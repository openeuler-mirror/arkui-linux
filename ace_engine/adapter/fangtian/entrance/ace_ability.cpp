/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "adapter/fangtian/entrance/ace_ability.h"

#ifdef INIT_ICU_DATA_PATH
#include "unicode/putil.h"
#endif

//#include "include/core/SkFontMgr.h"

#include "adapter/fangtian/entrance/ace_application_info.h"
#include "adapter/fangtian/entrance/ace_container.h"
#include "adapter/fangtian/entrance/event_dispatcher.h"
#include "adapter/fangtian/inspector/inspector_client.h"
#include "frameworks/bridge/common/utils/utils.h"
#include "frameworks/bridge/js_frontend/js_frontend.h"

#ifndef ENABLE_ROSEN_BACKEND
#include "frameworks/core/components/common/painter/flutter_svg_painter.h"
#endif

namespace OHOS::Ace::Platform {

std::atomic<bool> AceAbility::loopRunning_ = true;

namespace {

// JS frontend maintain the page ID self, so it's useless to pass page ID from platform
// layer, neither Android/OpenHarmony or Windows, we should delete here usage when Java delete it.
constexpr int32_t UNUSED_PAGE_ID = 1;

constexpr char ASSET_PATH_SHARE[] = "share";
#ifdef WINDOWS_PLATFORM
constexpr char DELIMITER[] = "\\";
constexpr char ASSET_PATH_SHARE_STAGE[] = "resources\\base\\profile";
#else
constexpr char DELIMITER[] = "/";
constexpr char ASSET_PATH_SHARE_STAGE[] = "resources/base/profile";
#endif

#ifdef USE_GLFW_WINDOW
// Screen Density Coefficient/Base Density = Resolution/ppi
constexpr double SCREEN_DENSITY_COEFFICIENT_PHONE = 1080.0 * 160.0 / 480.0;
constexpr double SCREEN_DENSITY_COEFFICIENT_WATCH = 466.0 * 160 / 320.0;
constexpr double SCREEN_DENSITY_COEFFICIENT_TABLE = 2560.0 * 160.0 / 280.0;
constexpr double SCREEN_DENSITY_COEFFICIENT_TV = 3840.0 * 160.0 / 640.0;

void AdaptDeviceType(AceRunArgs& runArgs)
{
    if (runArgs.deviceConfig.deviceType == DeviceType::PHONE) {
        runArgs.deviceConfig.density = runArgs.deviceWidth / SCREEN_DENSITY_COEFFICIENT_PHONE;
    } else if (runArgs.deviceConfig.deviceType == DeviceType::WATCH) {
        runArgs.deviceConfig.density = runArgs.deviceWidth / SCREEN_DENSITY_COEFFICIENT_WATCH;
    } else if (runArgs.deviceConfig.deviceType == DeviceType::TABLET) {
        runArgs.deviceConfig.density = runArgs.deviceWidth / SCREEN_DENSITY_COEFFICIENT_TABLE;
    } else if (runArgs.deviceConfig.deviceType == DeviceType::TV) {
        runArgs.deviceConfig.density = runArgs.deviceWidth / SCREEN_DENSITY_COEFFICIENT_TV;
    } else {
        LOGE("DeviceType not supported");
    }
}
#endif

void SetFontMgrConfig(const std::string& containerSdkPath)
{
    // To check if use ohos or container fonts.
    std::string runtimeOS;
    std::string containerFontBasePath;
    if (containerSdkPath.empty()) {
        runtimeOS = "OHOS";
    } else {
        runtimeOS = "OHOS_Container";
        containerFontBasePath = containerSdkPath + DELIMITER + "resources" + DELIMITER + "fonts" + DELIMITER;
    }
    LOGI("Runtime OS is %{public}s, and the container fontBasePath is %{public}s", runtimeOS.c_str(),
        containerFontBasePath.c_str());
    //SkFontMgr::SetFontMgrConfig(runtimeOS, containerFontBasePath);
}

std::string GetCustomAssetPath(std::string assetPath)
{
    if (assetPath.empty()) {
        LOGE("AssetPath is null.");
        return std::string();
    }
    std::string customAssetPath;
    if (OHOS::Ace::Framework::EndWith(assetPath, DELIMITER)) {
        assetPath = assetPath.substr(0, assetPath.size() - 1);
    }
    customAssetPath = assetPath.substr(0, assetPath.find_last_of(DELIMITER) + 1);
    return customAssetPath;
}

} // namespace

AceAbility::AceAbility(const AceRunArgs& runArgs) : runArgs_(runArgs)
{
    static std::once_flag onceFlag;
    std::call_once(onceFlag, []() {
        LOGI("Initialize for current process.");
        //Container::UpdateCurrent(INSTANCE_ID_PLATFORM);
    });

    if (runArgs_.aceVersion == AceVersion::ACE_1_0) {
        if (runArgs_.formsEnabled) {
            LOGI("CreateContainer with JS_CARD frontend");
            AceContainer::CreateContainer(ACE_INSTANCE_ID, FrontendType::JS_CARD, runArgs_);
        } else {
            LOGI("CreateContainer with JS frontend");
            AceContainer::CreateContainer(ACE_INSTANCE_ID, FrontendType::JS, runArgs_);
        }
    } else if (runArgs_.aceVersion == AceVersion::ACE_2_0) {
        if (runArgs_.formsEnabled) {
            LOGI("CreateContainer with ETS_CARD frontend");
            AceContainer::CreateContainer(ACE_INSTANCE_ID, FrontendType::ETS_CARD, runArgs_);
        } else {
            LOGI("CreateContainer with JSDECLARATIVE frontend");
            AceContainer::CreateContainer(ACE_INSTANCE_ID, FrontendType::DECLARATIVE_JS, runArgs_);
        }
    } else {
        LOGE("UnKnown frontend type");
    }
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        LOGE("container is null, set configuration failed.");
        return;
    }
    container->InitDeviceInfo(ACE_INSTANCE_ID, runArgs);
    SetConfigChanges(runArgs.configChanges);
    auto resConfig = container->GetResourceConfiguration();
    resConfig.SetOrientation(SystemProperties::GetDeviceOrientation());
    resConfig.SetDensity(SystemProperties::GetResolution());
    resConfig.SetDeviceType(SystemProperties::GetDeviceType());
    container->SetResourceConfiguration(resConfig);
}

AceAbility::~AceAbility()
{
    if (controller_ != nullptr) {
        controller_->DestroyWindow();
        controller_->Terminate();
    }
}

namespace {
inline void DumpAceRunArgs(const AceRunArgs& runArgs)
{
#ifdef ACE_DEBUG
    LOGI("runArgs.pageProfile: %{private}s", runArgs.pageProfile.c_str());
    LOGI("runArgs.asset: %{private}s", runArgs.assetPath.c_str());
    LOGI("runArgs.systemResources: %{private}s", runArgs.systemResourcesPath.c_str());
    LOGI("runArgs.appResources: %{private}s", runArgs.appResourcesPath.c_str());
    LOGI("runArgs.themeId: %{private}u", runArgs.themeId);
    LOGI("runArgs.deviceConfig.orientation: %{private}d", static_cast<int>(runArgs.deviceConfig.orientation));
    LOGI("runArgs.deviceConfig.density: %{private}lf", runArgs.deviceConfig.density);
    LOGI("runArgs.deviceConfig.deviceType: %{private}d", static_cast<int>(runArgs.deviceConfig.deviceType));
    LOGI("runArgs.deviceConfig.fontRatio: %{private}lf", runArgs.deviceConfig.fontRatio);
    LOGI("runArgs.deviceConfig.colorMode: %{private}d", static_cast<int>(runArgs.deviceConfig.colorMode));
    LOGI("runArgs.url: %{private}s", runArgs.url.c_str());
    LOGI("runArgs.windowTitle: %{private}s", runArgs.windowTitle.c_str());
    LOGI("runArgs.isRound: %{private}s", runArgs.isRound ? "true" : "false");
    LOGI("runArgs.viewWidth: %{private}d", runArgs.viewWidth);
    LOGI("runArgs.viewHeight: %{private}d", runArgs.viewHeight);
    LOGI("runArgs.deviceWidth: %{private}d", runArgs.deviceWidth);
    LOGI("runArgs.deviceHeight: %{private}d", runArgs.deviceHeight);
#endif
}
} // namespace

std::unique_ptr<AceAbility> AceAbility::CreateInstance(AceRunArgs& runArgs)
{
    DumpAceRunArgs(runArgs);
    LOGI("Start create AceAbility instance");

    // TODO Create Window
    //bool initSucceeded = FlutterDesktopInit();
    //if (!initSucceeded) {
    //    LOGE("Could not create window; AceDesktopInit failed.");
    //    return nullptr;
    //}
    AceApplicationInfo::GetInstance().SetLocale(runArgs.language, runArgs.region, runArgs.script, "");

    SetFontMgrConfig(runArgs.containerSdkPath);

    //auto controller = FlutterDesktopCreateWindow(
    //    runArgs.deviceWidth, runArgs.deviceHeight, runArgs.windowTitle.c_str(), runArgs.onRender);
    //EventDispatcher::GetInstance().SetGlfwWindowController(controller);
    EventDispatcher::GetInstance().Initialize();
    auto aceAbility = std::make_unique<AceAbility>(runArgs);
    //aceAbility->SetGlfwWindowController(controller);
    return aceAbility;
}

void AceAbility::InitEnv()
{
#ifdef INIT_ICU_DATA_PATH
    std::string icuPath = ".";
    u_setDataDirectory(icuPath.c_str());
#endif
    std::vector<std::string> paths;
    paths.push_back(runArgs_.assetPath);
    std::string appResourcesPath(runArgs_.appResourcesPath);
    if (!OHOS::Ace::Framework::EndWith(appResourcesPath, DELIMITER)) {
        appResourcesPath.append(DELIMITER);
    }
    if (runArgs_.projectModel == ProjectModel::STAGE) {
        // eTS Card
        if (runArgs_.aceVersion == AceVersion::ACE_2_0 && runArgs_.formsEnabled) {
            paths.push_back(runArgs_.assetPath + DELIMITER + "ets");
        }
        paths.push_back(appResourcesPath);
        paths.push_back(appResourcesPath + ASSET_PATH_SHARE_STAGE);
    } else {
        paths.push_back(GetCustomAssetPath(runArgs_.assetPath) + ASSET_PATH_SHARE);
    }
    AceContainer::AddAssetPath(ACE_INSTANCE_ID, "", paths);
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    CHECK_NULL_VOID(container);
    if (runArgs_.projectModel == ProjectModel::STAGE) {
        if (runArgs_.formsEnabled) {
            container->SetStageCardConfig(runArgs_.pageProfile, runArgs_.url);
        } else {
            container->SetPageProfile((runArgs_.pageProfile.empty() ? "" : runArgs_.pageProfile + ".json"));
        }
    }
    AceContainer::SetResourcesPathAndThemeStyle(ACE_INSTANCE_ID, runArgs_.systemResourcesPath,
        runArgs_.appResourcesPath, runArgs_.themeId, runArgs_.deviceConfig.colorMode);

    auto view = new RSAceView(ACE_INSTANCE_ID);
    if (runArgs_.aceVersion == AceVersion::ACE_2_0) {
        AceContainer::SetView(view, runArgs_.deviceConfig.density, runArgs_.deviceWidth, runArgs_.deviceHeight, runArgs_.onRender);
        AceContainer::RunPage(ACE_INSTANCE_ID, UNUSED_PAGE_ID, runArgs_.url, "");
    } else {
        AceContainer::RunPage(ACE_INSTANCE_ID, UNUSED_PAGE_ID, runArgs_.url, "");
        AceContainer::SetView(view, runArgs_.deviceConfig.density, runArgs_.deviceWidth, runArgs_.deviceHeight, runArgs_.onRender);
    }
    if (runArgs_.projectModel == ProjectModel::STAGE) {
        container->InitializeStageAppConfig(runArgs_.assetPath, runArgs_.formsEnabled);
    }
    AceContainer::AddRouterChangeCallback(ACE_INSTANCE_ID, runArgs_.onRouterChange);
    OHOS::Ace::Framework::InspectorClient::GetInstance().RegisterFastLinuxErrorCallback(runArgs_.onError);
    // Should make it possible to update surface changes by using viewWidth and viewHeight.
    view->NotifySurfaceChanged(runArgs_.deviceWidth, runArgs_.deviceHeight);
    view->NotifyDensityChanged(runArgs_.deviceConfig.density);
}

void AceAbility::Start()
{
    RunEventLoop();
}

void AceAbility::Stop()
{
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        return;
    }

    container->GetTaskExecutor()->PostTask([]() { loopRunning_ = false; }, TaskExecutor::TaskType::PLATFORM);
}

void AceAbility::RunEventLoop()
{
    while (controller_ != nullptr && !controller_->WindowShouldClose() && loopRunning_) {
        /*
        if (windowControllerRef_) {
            FlutterDesktopWaitForEvents(windowControllerRef_);
        }
        */
        controller_->PollEvents();

#ifdef USE_GLFW_WINDOW
        int32_t width;
        int32_t height;
        controller_->GetWindowSize(width, height);
        if (width != runArgs_.deviceWidth || height != runArgs_.deviceHeight) {
            AdaptDeviceType(runArgs_);
            SurfaceChanged(runArgs_.deviceConfig.orientation, runArgs_.deviceConfig.density, width, height);
        }
#endif

        auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
        if (container) {
            container->RunNativeEngineLoop();
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(1));
    }
    loopRunning_ = true;

    // Currently exit loop is only to restart the AceContainer for real-time linux case.
    // linuxer background thread will release the AceAbility instance and create new one,
    // then call the InitEnv() and Start() again.
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        LOGE("container is null");
        if (controller_ != nullptr) {
            controller_->DestroyWindow();
        }
        controller_ = nullptr;
        return;
    }
    auto viewPtr = container->GetAceView();
    AceContainer::DestroyContainer(ACE_INSTANCE_ID);

    if (controller_ != nullptr) {
        controller_->DestroyWindow();
    }
    if (viewPtr != nullptr) {
        delete viewPtr;
        viewPtr = nullptr;
    }
    controller_ = nullptr;
}

void AceAbility::SetConfigChanges(const std::string& configChanges)
{
    if (configChanges == "") {
        return;
    }
    std::vector<std::string> configChangesSplitter;
    OHOS::Ace::StringUtils::StringSplitter(configChanges, ',', configChangesSplitter);
    for (const auto& singleConfig : configChangesSplitter) {
        if (singleConfig == "locale") {
            configChanges_.watchLocale = true;
            continue;
        } else if (singleConfig == "layout") {
            configChanges_.watchLayout = true;
            continue;
        } else if (singleConfig == "fontSize") {
            configChanges_.watchFontSize = true;
            continue;
        } else if (singleConfig == "orientation") {
            configChanges_.watchOrientation = true;
            continue;
        } else if (singleConfig == "density") {
            configChanges_.watchDensity = true;
            continue;
        } else {
            LOGW("unsupported config %{public}s", singleConfig.c_str());
        }
    }
}

void AceAbility::OnConfigurationChanged(const DeviceConfig& newConfig)
{
    if (newConfig.colorMode == runArgs_.deviceConfig.colorMode) {
        return;
    }
    int32_t width = runArgs_.deviceWidth;
    int32_t height = runArgs_.deviceHeight;
    SurfaceChanged(runArgs_.deviceConfig.orientation, runArgs_.deviceConfig.density, width, height);
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        LOGE("container is null, change configuration failed.");
        return;
    }
    container->UpdateDeviceConfig(newConfig);
    runArgs_.deviceConfig.colorMode = newConfig.colorMode;
    if (container->GetType() == FrontendType::DECLARATIVE_JS) {
        container->NativeOnConfigurationUpdated(ACE_INSTANCE_ID);
    }
}

void AceAbility::SurfaceChanged(
    const DeviceOrientation& orientation, const double& resolution, int32_t& width, int32_t& height)
{
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        LOGE("container is null, SurfaceChanged failed.");
        return;
    }

    auto viewPtr = container->GetAceView();
    if (viewPtr == nullptr) {
        LOGE("aceView is null, SurfaceChanged failed.");
        return;
    }
    // Need to change the window resolution and then change the rendering resolution. Otherwise, the image may not adapt
    // to the new window after the window is modified.
    auto context = container->GetPipelineContext();
    if (context == nullptr) {
        LOGE("context is null, SurfaceChanged failed.");
        return;
    }
    context->GetTaskExecutor()->PostSyncTask(
        [this, width, height]() {
            if (controller_ != nullptr) {
                controller_->SetWindowSize(width, height);
            }
        },
        TaskExecutor::TaskType::PLATFORM);
    SystemProperties::InitDeviceInfo(
        width, height, orientation == DeviceOrientation::PORTRAIT ? 0 : 1, resolution, runArgs_.isRound);
    DeviceConfig deviceConfig = runArgs_.deviceConfig;
    deviceConfig.orientation = orientation;
    deviceConfig.density = resolution;
    container->UpdateDeviceConfig(deviceConfig);
    viewPtr->NotifyDensityChanged(resolution);
    viewPtr->NotifySurfaceChanged(width, height);
    if ((orientation != runArgs_.deviceConfig.orientation && configChanges_.watchOrientation) ||
        (resolution != runArgs_.deviceConfig.density && configChanges_.watchDensity) ||
        ((width != runArgs_.deviceWidth || height != runArgs_.deviceHeight) && configChanges_.watchLayout)) {
        container->NativeOnConfigurationUpdated(ACE_INSTANCE_ID);
    }
    runArgs_.deviceConfig.orientation = orientation;
    runArgs_.deviceConfig.density = resolution;
    runArgs_.deviceWidth = width;
    runArgs_.deviceHeight = height;
}

void AceAbility::ReplacePage(const std::string& url, const std::string& params)
{
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        LOGE("container is null");
        return;
    }
    container->GetFrontend()->ReplacePage(url, params);
}

void AceAbility::LoadDocument(const std::string& url, const std::string& componentName, SystemParams& systemParams)
{
    /*
    AceApplicationInfo::GetInstance().ChangeLocale(systemParams.language, systemParams.region);
    runArgs_.isRound = systemParams.isRound;
    SurfaceChanged(systemParams.orientation, systemParams.density, systemParams.deviceWidth, systemParams.deviceHeight);
    DeviceConfig deviceConfig = {
        .orientation = systemParams.orientation,
        .density = systemParams.density,
        .deviceType = systemParams.deviceType,
        .colorMode = systemParams.colorMode,
    };
    OnConfigurationChanged(deviceConfig);
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        LOGE("container is null");
        return;
    }
    container->LoadDocument(url, componentName);
    */
}

std::string AceAbility::GetJSONTree()
{
    std::string jsonTreeStr;
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    CHECK_NULL_RETURN(container, "");
    auto taskExecutor = container->GetTaskExecutor();
    CHECK_NULL_RETURN(taskExecutor, "");
    taskExecutor->PostSyncTask([&jsonTreeStr] {
            OHOS::Ace::Framework::InspectorClient::GetInstance().AssembleJSONTreeStr(jsonTreeStr);
        }, TaskExecutor::TaskType::UI);
    return jsonTreeStr;
}

std::string AceAbility::GetDefaultJSONTree()
{
    std::string defaultJsonTreeStr;
    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    CHECK_NULL_RETURN(container, "");
    auto taskExecutor = container->GetTaskExecutor();
    CHECK_NULL_RETURN(taskExecutor, "");
    taskExecutor->PostSyncTask([&defaultJsonTreeStr] {
            OHOS::Ace::Framework::InspectorClient::GetInstance().AssembleDefaultJSONTreeStr(defaultJsonTreeStr);
        }, TaskExecutor::TaskType::UI);
    return defaultJsonTreeStr;
}

bool AceAbility::OperateComponent(const std::string& attrsJson)
{
    LOGD("OperateComponent attrsJson %{public}s", attrsJson.c_str());
    auto root = JsonUtil::ParseJsonString(attrsJson);
    if (!root || !root->IsValid()) {
        LOGE("the attrsJson is illegal json format");
        return false;
    }

    auto container = AceContainer::GetContainerInstance(ACE_INSTANCE_ID);
    if (!container) {
        return false;
    }
    auto taskExecutor = container->GetTaskExecutor();
    if (!taskExecutor) {
        return false;
    }
    taskExecutor->PostTask(
        [attrsJson, instanceId = ACE_INSTANCE_ID] {
            ContainerScope scope(instanceId);
            bool result = OHOS::Ace::Framework::InspectorClient::GetInstance().OperateComponent(attrsJson);
            if (!result) {
                OHOS::Ace::Framework::InspectorClient::GetInstance().CallFastLinuxErrorCallback(attrsJson);
            }
        },
        TaskExecutor::TaskType::UI);
    return true;
}

} // namespace OHOS::Ace::Platform
