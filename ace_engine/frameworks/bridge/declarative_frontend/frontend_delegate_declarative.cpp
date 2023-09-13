/*
 * Copyright (c) 2021-2023 Huawei Device Co., Ltd.
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

#include "frameworks/bridge/declarative_frontend/frontend_delegate_declarative.h"

#include <atomic>
#include <regex>
#include <string>

#include "uicast_interface/uicast_context_impl.h"

#include "base/i18n/localization.h"
#include "base/log/ace_trace.h"
#include "base/log/event_report.h"
#include "base/memory/ace_type.h"
#include "base/memory/referenced.h"
#include "base/resource/ace_res_config.h"
#include "base/subwindow/subwindow_manager.h"
#include "base/thread/background_task_executor.h"
#include "base/utils/measure_util.h"
#include "base/utils/utils.h"
#include "bridge/common/manifest/manifest_parser.h"
#include "bridge/common/utils/utils.h"
#include "bridge/declarative_frontend/ng/page_router_manager.h"
#include "bridge/js_frontend/js_ace_page.h"
#include "core/common/ace_application_info.h"
#include "core/common/container.h"
#include "core/common/container_scope.h"
#include "core/common/platform_bridge.h"
#include "core/common/thread_checker.h"
#include "core/components/dialog/dialog_component.h"
#include "core/components/toast/toast_component.h"
#include "core/components_ng/base/ui_node.h"
#include "core/components_ng/pattern/overlay/overlay_manager.h"
#include "core/components_ng/pattern/stage/page_pattern.h"
#include "core/pipeline_ng/pipeline_context.h"
#include "frameworks/core/common/ace_engine.h"

namespace OHOS::Ace::Framework {
namespace {

constexpr int32_t INVALID_PAGE_ID = -1;
constexpr int32_t MAX_ROUTER_STACK = 32;
constexpr int32_t TOAST_TIME_MAX = 10000;    // ms
constexpr int32_t TOAST_TIME_DEFAULT = 1500; // ms
constexpr int32_t MAX_PAGE_ID_SIZE = sizeof(uint64_t) * 8;
constexpr int32_t NANO_TO_MILLI = 1000000; // nanosecond to millisecond
constexpr int32_t TO_MILLI = 1000;         // second to millisecond
constexpr int32_t CALLBACK_ERRORCODE_SUCCESS = 0;
constexpr int32_t CALLBACK_ERRORCODE_CANCEL = 1;
constexpr int32_t CALLBACK_ERRORCODE_COMPLETE = 2;
constexpr int32_t CALLBACK_DATACODE_ZERO = 0;

const char MANIFEST_JSON[] = "manifest.json";
const char PAGES_JSON[] = "main_pages.json";
const char FILE_TYPE_JSON[] = ".json";
const char I18N_FOLDER[] = "i18n/";
const char RESOURCES_FOLDER[] = "resources/";
const char STYLES_FOLDER[] = "styles/";
const char I18N_FILE_SUFFIX[] = "/properties/string.json";

// helper function to run OverlayManager task
// ensures that the task runs in subwindow instead of main Window
void MainWindowOverlay(std::function<void(RefPtr<NG::OverlayManager>)>&& task)
{
    auto currentId = Container::CurrentId();
    ContainerScope scope(currentId);
    auto context = NG::PipelineContext::GetCurrentContext();
    CHECK_NULL_VOID(context);
    auto overlayManager = context->GetOverlayManager();
    context->GetTaskExecutor()->PostTask(
        [task = std::move(task), weak = WeakPtr<NG::OverlayManager>(overlayManager)] {
            auto overlayManager = weak.Upgrade();
            task(overlayManager);
        },
        TaskExecutor::TaskType::UI);
}

} // namespace

int32_t FrontendDelegateDeclarative::GenerateNextPageId()
{
    for (int32_t idx = 0; idx < MAX_PAGE_ID_SIZE; ++idx) {
        uint64_t bitMask = (1ULL << idx);
        if ((bitMask & pageIdPool_.fetch_or(bitMask, std::memory_order_relaxed)) == 0) {
            return idx;
        }
    }
    return INVALID_PAGE_ID;
}

void FrontendDelegateDeclarative::RecyclePageId(int32_t pageId)
{
    if (pageId < 0 || pageId >= MAX_PAGE_ID_SIZE) {
        return;
    }
    uint64_t bitMask = (1ULL << pageId);
    pageIdPool_.fetch_and(~bitMask, std::memory_order_relaxed);
}

FrontendDelegateDeclarative::FrontendDelegateDeclarative(const RefPtr<TaskExecutor>& taskExecutor,
    const LoadJsCallback& loadCallback, const JsMessageDispatcherSetterCallback& transferCallback,
    const EventCallback& asyncEventCallback, const EventCallback& syncEventCallback,
    const UpdatePageCallback& updatePageCallback, const ResetStagingPageCallback& resetLoadingPageCallback,
    const DestroyPageCallback& destroyPageCallback, const DestroyApplicationCallback& destroyApplicationCallback,
    const UpdateApplicationStateCallback& updateApplicationStateCallback, const TimerCallback& timerCallback,
    const MediaQueryCallback& mediaQueryCallback, const RequestAnimationCallback& requestAnimationCallback,
    const JsCallback& jsCallback, const OnWindowDisplayModeChangedCallBack& onWindowDisplayModeChangedCallBack,
    const OnConfigurationUpdatedCallBack& onConfigurationUpdatedCallBack,
    const OnSaveAbilityStateCallBack& onSaveAbilityStateCallBack,
    const OnRestoreAbilityStateCallBack& onRestoreAbilityStateCallBack, const OnNewWantCallBack& onNewWantCallBack,
    const OnMemoryLevelCallBack& onMemoryLevelCallBack, const OnStartContinuationCallBack& onStartContinuationCallBack,
    const OnCompleteContinuationCallBack& onCompleteContinuationCallBack,
    const OnRemoteTerminatedCallBack& onRemoteTerminatedCallBack, const OnSaveDataCallBack& onSaveDataCallBack,
    const OnRestoreDataCallBack& onRestoreDataCallBack, const ExternalEventCallback& externalEventCallback)
    : loadJs_(loadCallback), externalEvent_(externalEventCallback), dispatcherCallback_(transferCallback),
      asyncEvent_(asyncEventCallback), syncEvent_(syncEventCallback), updatePage_(updatePageCallback),
      resetStagingPage_(resetLoadingPageCallback), destroyPage_(destroyPageCallback),
      destroyApplication_(destroyApplicationCallback), updateApplicationState_(updateApplicationStateCallback),
      timer_(timerCallback), mediaQueryCallback_(mediaQueryCallback),
      requestAnimationCallback_(requestAnimationCallback), jsCallback_(jsCallback),
      onWindowDisplayModeChanged_(onWindowDisplayModeChangedCallBack),
      onConfigurationUpdated_(onConfigurationUpdatedCallBack), onSaveAbilityState_(onSaveAbilityStateCallBack),
      onRestoreAbilityState_(onRestoreAbilityStateCallBack), onNewWant_(onNewWantCallBack),
      onMemoryLevel_(onMemoryLevelCallBack), onStartContinuationCallBack_(onStartContinuationCallBack),
      onCompleteContinuationCallBack_(onCompleteContinuationCallBack),
      onRemoteTerminatedCallBack_(onRemoteTerminatedCallBack), onSaveDataCallBack_(onSaveDataCallBack),
      onRestoreDataCallBack_(onRestoreDataCallBack), manifestParser_(AceType::MakeRefPtr<ManifestParser>()),
      jsAccessibilityManager_(AccessibilityNodeManager::Create()),
      mediaQueryInfo_(AceType::MakeRefPtr<MediaQueryInfo>()), taskExecutor_(taskExecutor)
{
    LOGD("FrontendDelegateDeclarative create");
}

FrontendDelegateDeclarative::~FrontendDelegateDeclarative()
{
    CHECK_RUN_ON(JS);
    LOG_DESTROY();
}

int32_t FrontendDelegateDeclarative::GetMinPlatformVersion()
{
    return manifestParser_->GetMinPlatformVersion();
}

void FrontendDelegateDeclarative::RunPage(const std::string& url, const std::string& params, const std::string& profile)
{
    ACE_SCOPED_TRACE("FrontendDelegateDeclarative::RunPage");

    LOGI("FrontendDelegateDeclarative RunPage url=%{public}s", url.c_str());
    std::string jsonContent;
    if (GetAssetContent(MANIFEST_JSON, jsonContent)) {
        manifestParser_->Parse(jsonContent);
        manifestParser_->Printer();
    } else if (!profile.empty() && GetAssetContent(profile, jsonContent)) {
        LOGI("Parse profile %{public}s", profile.c_str());
        manifestParser_->Parse(jsonContent);
    } else if (GetAssetContent(PAGES_JSON, jsonContent)) {
        LOGI("Parse main_pages.json");
        manifestParser_->Parse(jsonContent);
    } else {
        LOGE("RunPage parse manifest.json failed");
        EventReport::SendPageRouterException(PageRouterExcepType::RUN_PAGE_ERR, url);
        return;
    }

    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)]() {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->manifestParser_->GetAppInfo()->ParseI18nJsonInfo();
            }
        },
        TaskExecutor::TaskType::JS);

    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->SetManifestParser(manifestParser_);
        taskExecutor_->PostTask(
            [weakPtr = WeakPtr<NG::PageRouterManager>(pageRouterManager_), url, params]() {
                auto pageRouterManager = weakPtr.Upgrade();
                CHECK_NULL_VOID(pageRouterManager);
                pageRouterManager->RunPage(url, params);
            },
            TaskExecutor::TaskType::JS);
        return;
    }
    if (!url.empty()) {
        mainPagePath_ = manifestParser_->GetRouter()->GetPagePath(url);
    } else {
        mainPagePath_ = manifestParser_->GetRouter()->GetEntry();
    }
    AddRouterTask(RouterTask { RouterAction::PUSH, PageTarget(mainPagePath_), params });
    LoadPage(GenerateNextPageId(), PageTarget(mainPagePath_), true, params);
}

void FrontendDelegateDeclarative::ChangeLocale(const std::string& language, const std::string& countryOrRegion)
{
    LOGD("JSFrontend ChangeLocale");
    taskExecutor_->PostTask(
        [language, countryOrRegion]() { AceApplicationInfo::GetInstance().ChangeLocale(language, countryOrRegion); },
        TaskExecutor::TaskType::PLATFORM);
}

void FrontendDelegateDeclarative::GetI18nData(std::unique_ptr<JsonValue>& json)
{
    auto data = JsonUtil::CreateArray(true);
    GetConfigurationCommon(I18N_FOLDER, data);
    auto i18nData = JsonUtil::Create(true);
    i18nData->Put("resources", data);
    json->Put("i18n", i18nData);
}

void FrontendDelegateDeclarative::GetResourceConfiguration(std::unique_ptr<JsonValue>& json)
{
    auto data = JsonUtil::CreateArray(true);
    GetConfigurationCommon(RESOURCES_FOLDER, data);
    json->Put("resourcesConfiguration", data);
}

void FrontendDelegateDeclarative::GetConfigurationCommon(const std::string& filePath, std::unique_ptr<JsonValue>& data)
{
    std::vector<std::string> files;
    if (assetManager_) {
        assetManager_->GetAssetList(filePath, files);
    }

    std::vector<std::string> fileNameList;
    for (const auto& file : files) {
        if (EndWith(file, FILE_TYPE_JSON) && !StartWith(file, STYLES_FOLDER)) {
            fileNameList.emplace_back(file.substr(0, file.size() - (sizeof(FILE_TYPE_JSON) - 1)));
        }
    }

    std::vector<std::string> priorityFileName;
    if (filePath.compare(I18N_FOLDER) == 0) {
        auto localeTag = AceApplicationInfo::GetInstance().GetLocaleTag();
        priorityFileName = AceResConfig::GetLocaleFallback(localeTag, fileNameList);
    } else {
        priorityFileName = AceResConfig::GetResourceFallback(fileNameList);
    }

    for (const auto& fileName : priorityFileName) {
        auto fileFullPath = filePath + fileName + std::string(FILE_TYPE_JSON);
        std::string content;
        if (GetAssetContent(fileFullPath, content)) {
            auto fileData = ParseFileData(content);
            if (fileData == nullptr) {
                LOGW("parse %{private}s.json content failed", filePath.c_str());
            } else {
                data->Put(fileData);
            }
        }
    }
}

void FrontendDelegateDeclarative::LoadResourceConfiguration(
    std::map<std::string, std::string>& mediaResourceFileMap, std::unique_ptr<JsonValue>& currentResourceData)
{
    std::vector<std::string> files;
    if (assetManager_) {
        assetManager_->GetAssetList(RESOURCES_FOLDER, files);
    }

    std::set<std::string> resourceFolderName;
    for (const auto& file : files) {
        if (file.find_first_of("/") != std::string::npos) {
            resourceFolderName.insert(file.substr(0, file.find_first_of("/")));
        }
    }

    std::vector<std::string> sortedResourceFolderPath =
        AceResConfig::GetDeclarativeResourceFallback(resourceFolderName);
    for (const auto& folderName : sortedResourceFolderPath) {
        auto fileFullPath = std::string(RESOURCES_FOLDER) + folderName + std::string(I18N_FILE_SUFFIX);
        std::string content;
        if (GetAssetContent(fileFullPath, content)) {
            auto fileData = ParseFileData(content);
            if (fileData == nullptr) {
                LOGW("parse %{private}s i18n content failed", fileFullPath.c_str());
            } else {
                currentResourceData->Put(fileData);
            }
        }
    }

    std::set<std::string> mediaFileName;
    for (const auto& file : files) {
        if (file.find_first_of("/") == std::string::npos) {
            continue;
        }
        auto mediaPathName = file.substr(file.find_first_of("/"));
        std::regex mediaPattern(R"(^\/media\/\w*(\.jpg|\.png|\.gif|\.svg|\.webp|\.bmp)$)");
        std::smatch result;
        if (std::regex_match(mediaPathName, result, mediaPattern)) {
            mediaFileName.insert(mediaPathName.substr(mediaPathName.find_first_of("/")));
        }
    }

    auto currentResTag = AceResConfig::GetCurrentDeviceResTag();
    auto currentResolutionTag = currentResTag.substr(currentResTag.find_last_of("-") + 1);
    for (const auto& folderName : sortedResourceFolderPath) {
        for (const auto& fileName : mediaFileName) {
            if (mediaResourceFileMap.find(fileName) != mediaResourceFileMap.end()) {
                continue;
            }
            auto fullFileName = folderName + fileName;
            if (std::find(files.begin(), files.end(), fullFileName) != files.end()) {
                mediaResourceFileMap.emplace(fileName.substr(fileName.find_last_of("/") + 1),
                    std::string(RESOURCES_FOLDER).append(fullFileName));
            }
        }
        if (mediaResourceFileMap.size() == mediaFileName.size()) {
            break;
        }
    }
}

void FrontendDelegateDeclarative::OnJSCallback(const std::string& callbackId, const std::string& data)
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), callbackId, args = data] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->jsCallback_(callbackId, args);
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::SetJsMessageDispatcher(const RefPtr<JsMessageDispatcher>& dispatcher) const
{
    LOGD("FrontendDelegateDeclarative SetJsMessageDispatcher");
    taskExecutor_->PostTask([dispatcherCallback = dispatcherCallback_, dispatcher] { dispatcherCallback(dispatcher); },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::TransferComponentResponseData(
    int32_t callbackId, int32_t /*code*/, std::vector<uint8_t>&& data)
{
    LOGD("FrontendDelegateDeclarative TransferComponentResponseData");
    auto pipelineContext = pipelineContextHolder_.Get();
    WeakPtr<PipelineBase> contextWeak(pipelineContext);
    taskExecutor_->PostTask(
        [callbackId, data = std::move(data), contextWeak]() mutable {
            auto context = contextWeak.Upgrade();
            if (!context) {
                LOGE("context is null");
            } else if (!context->GetMessageBridge()) {
                LOGE("messageBridge is null");
            } else {
                context->GetMessageBridge()->HandleCallback(callbackId, std::move(data));
            }
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::TransferJsResponseData(
    int32_t callbackId, int32_t code, std::vector<uint8_t>&& data) const
{
    LOGD("FrontendDelegateDeclarative TransferJsResponseData");
    if (groupJsBridge_ && groupJsBridge_->ForwardToWorker(callbackId)) {
        LOGD("FrontendDelegateDeclarative Forward to worker.");
        groupJsBridge_->TriggerModuleJsCallback(callbackId, code, std::move(data));
        return;
    }

    taskExecutor_->PostTask(
        [callbackId, code, data = std::move(data), groupJsBridge = groupJsBridge_]() mutable {
            if (groupJsBridge) {
                groupJsBridge->TriggerModuleJsCallback(callbackId, code, std::move(data));
            }
        },
        TaskExecutor::TaskType::JS);
}

#if defined(PREVIEW)
void FrontendDelegateDeclarative::TransferJsResponseDataPreview(
    int32_t callbackId, int32_t code, ResponseData responseData) const
{
    LOGI("FrontendDelegateDeclarative TransferJsResponseDataPreview");
    taskExecutor_->PostTask(
        [callbackId, code, responseData, groupJsBridge = groupJsBridge_]() mutable {
            if (groupJsBridge) {
                groupJsBridge->TriggerModuleJsCallbackPreview(callbackId, code, responseData);
            }
        },
        TaskExecutor::TaskType::JS);
}
#endif

void FrontendDelegateDeclarative::TransferJsPluginGetError(
    int32_t callbackId, int32_t errorCode, std::string&& errorMessage) const
{
    LOGD("FrontendDelegateDeclarative TransferJsPluginGetError");
    taskExecutor_->PostTask(
        [callbackId, errorCode, errorMessage = std::move(errorMessage), groupJsBridge = groupJsBridge_]() mutable {
            if (groupJsBridge) {
                groupJsBridge->TriggerModulePluginGetErrorCallback(callbackId, errorCode, std::move(errorMessage));
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::TransferJsEventData(
    int32_t callbackId, int32_t code, std::vector<uint8_t>&& data) const
{
    taskExecutor_->PostTask(
        [callbackId, code, data = std::move(data), groupJsBridge = groupJsBridge_]() mutable {
            if (groupJsBridge) {
                groupJsBridge->TriggerEventJsCallback(callbackId, code, std::move(data));
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::LoadPluginJsCode(std::string&& jsCode) const
{
    LOGD("FrontendDelegateDeclarative LoadPluginJsCode");
    taskExecutor_->PostTask(
        [jsCode = std::move(jsCode), groupJsBridge = groupJsBridge_]() mutable {
            if (groupJsBridge) {
                groupJsBridge->LoadPluginJsCode(std::move(jsCode));
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::LoadPluginJsByteCode(
    std::vector<uint8_t>&& jsCode, std::vector<int32_t>&& jsCodeLen) const
{
    LOGD("FrontendDelegateDeclarative LoadPluginJsByteCode");
    if (groupJsBridge_ == nullptr) {
        LOGE("groupJsBridge_ is nullptr");
        return;
    }
    taskExecutor_->PostTask(
        [jsCode = std::move(jsCode), jsCodeLen = std::move(jsCodeLen), groupJsBridge = groupJsBridge_]() mutable {
            groupJsBridge->LoadPluginJsByteCode(std::move(jsCode), std::move(jsCodeLen));
        },
        TaskExecutor::TaskType::JS);
}

bool FrontendDelegateDeclarative::OnPageBackPress()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_RETURN(pageRouterManager_, false);
        auto pageNode = pageRouterManager_->GetCurrentPageNode();
        CHECK_NULL_RETURN(pageNode, false);
        auto pagePattern = pageNode->GetPattern<NG::PagePattern>();
        CHECK_NULL_RETURN(pagePattern, false);
        if (pagePattern->OnBackPressed()) {
            return true;
        }
        return pageRouterManager_->Pop();
    }

    auto result = false;
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), &result] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pageId = delegate->GetRunningPageId();
            auto page = delegate->GetPage(pageId);
            if (page) {
                result = page->FireDeclarativeOnBackPressCallback();
            }
        },
        TaskExecutor::TaskType::JS);
    return result;
}

void FrontendDelegateDeclarative::NotifyAppStorage(
    const WeakPtr<Framework::JsEngine>& jsEngineWeak, const std::string& key, const std::string& value)
{
    taskExecutor_->PostTask(
        [jsEngineWeak, key, value] {
            auto jsEngine = jsEngineWeak.Upgrade();
            if (!jsEngine) {
                return;
            }
            jsEngine->NotifyAppStorage(key, value);
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnBackGround()
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            delegate->OnPageHide();
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnForeground()
{
    // first page show will be called by push page successfully
    if (!isFirstNotifyShow_) {
        taskExecutor_->PostTask(
            [weak = AceType::WeakClaim(this)] {
                auto delegate = weak.Upgrade();
                if (!delegate) {
                    return;
                }
                delegate->OnPageShow();
            },
            TaskExecutor::TaskType::JS);
    }
    isFirstNotifyShow_ = false;
}

void FrontendDelegateDeclarative::OnConfigurationUpdated(const std::string& data)
{
    taskExecutor_->PostSyncTask(
        [onConfigurationUpdated = onConfigurationUpdated_, data] { onConfigurationUpdated(data); },
        TaskExecutor::TaskType::JS);
    OnMediaQueryUpdate();
}

bool FrontendDelegateDeclarative::OnStartContinuation()
{
    bool ret = false;
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), &ret] {
            auto delegate = weak.Upgrade();
            if (delegate && delegate->onStartContinuationCallBack_) {
                ret = delegate->onStartContinuationCallBack_();
            }
        },
        TaskExecutor::TaskType::JS);
    return ret;
}

void FrontendDelegateDeclarative::OnCompleteContinuation(int32_t code)
{
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), code] {
            auto delegate = weak.Upgrade();
            if (delegate && delegate->onCompleteContinuationCallBack_) {
                delegate->onCompleteContinuationCallBack_(code);
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnRemoteTerminated()
{
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (delegate && delegate->onRemoteTerminatedCallBack_) {
                delegate->onRemoteTerminatedCallBack_();
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnSaveData(std::string& data)
{
    std::string savedData;
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), &savedData] {
            auto delegate = weak.Upgrade();
            if (delegate && delegate->onSaveDataCallBack_) {
                delegate->onSaveDataCallBack_(savedData);
            }
        },
        TaskExecutor::TaskType::JS);
    std::string pageUri = GetRunningPageUrl();
    data = std::string("{\"url\":\"").append(pageUri).append("\",\"__remoteData\":").append(savedData).append("}");
}

bool FrontendDelegateDeclarative::OnRestoreData(const std::string& data)
{
    bool ret = false;
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), &data, &ret] {
            auto delegate = weak.Upgrade();
            if (delegate && delegate->onRestoreDataCallBack_) {
                ret = delegate->onRestoreDataCallBack_(data);
            }
        },
        TaskExecutor::TaskType::JS);
    return ret;
}

void FrontendDelegateDeclarative::OnMemoryLevel(const int32_t level)
{
    taskExecutor_->PostTask(
        [onMemoryLevel = onMemoryLevel_, level]() {
            if (onMemoryLevel) {
                onMemoryLevel(level);
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::GetPluginsUsed(std::string& data)
{
    if (!GetAssetContentImpl(assetManager_, "module_collection.txt", data)) {
        LOGW("read failed, will load all the system plugin");
        data = "All";
    }
}

void FrontendDelegateDeclarative::OnNewRequest(const std::string& data)
{
    FireSyncEvent("_root", std::string("\"onNewRequest\","), data);
}

void FrontendDelegateDeclarative::CallPopPage()
{
    LOGI("CallPopPage begin");
    Back("", "");
}

void FrontendDelegateDeclarative::ResetStagingPage()
{
    taskExecutor_->PostTask([resetStagingPage = resetStagingPage_] { resetStagingPage(); }, TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnApplicationDestroy(const std::string& packageName)
{
    taskExecutor_->PostSyncTask(
        [destroyApplication = destroyApplication_, packageName] { destroyApplication(packageName); },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::UpdateApplicationState(const std::string& packageName, Frontend::State state)
{
    taskExecutor_->PostTask([updateApplicationState = updateApplicationState_, packageName,
                                state] { updateApplicationState(packageName, state); },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnWindowDisplayModeChanged(bool isShownInMultiWindow, const std::string& data)
{
    taskExecutor_->PostTask([onWindowDisplayModeChanged = onWindowDisplayModeChanged_, isShownInMultiWindow,
                                data] { onWindowDisplayModeChanged(isShownInMultiWindow, data); },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnSaveAbilityState(std::string& data)
{
    taskExecutor_->PostSyncTask(
        [onSaveAbilityState = onSaveAbilityState_, &data] { onSaveAbilityState(data); }, TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnRestoreAbilityState(const std::string& data)
{
    taskExecutor_->PostTask([onRestoreAbilityState = onRestoreAbilityState_, data] { onRestoreAbilityState(data); },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnNewWant(const std::string& data)
{
    taskExecutor_->PostTask([onNewWant = onNewWant_, data] { onNewWant(data); }, TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::FireAsyncEvent(
    const std::string& eventId, const std::string& param, const std::string& jsonArgs)
{
    LOGD("FireAsyncEvent eventId: %{public}s", eventId.c_str());
    std::string args = param;
    args.append(",null").append(",null"); // callback and dom changes
    if (!jsonArgs.empty()) {
        args.append(",").append(jsonArgs); // method args
    }
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), eventId, args = std::move(args)] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->asyncEvent_(eventId, args);
            }
        },
        TaskExecutor::TaskType::JS);
}

bool FrontendDelegateDeclarative::FireSyncEvent(
    const std::string& eventId, const std::string& param, const std::string& jsonArgs)
{
    std::string resultStr;
    FireSyncEvent(eventId, param, jsonArgs, resultStr);
    return (resultStr == "true");
}

void FrontendDelegateDeclarative::FireExternalEvent(
    const std::string& /*eventId*/, const std::string& componentId, const uint32_t nodeId, const bool isDestroy)
{
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), componentId, nodeId, isDestroy] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->externalEvent_(componentId, nodeId, isDestroy);
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::FireSyncEvent(
    const std::string& eventId, const std::string& param, const std::string& jsonArgs, std::string& result)
{
    int32_t callbackId = callbackCnt_++;
    std::string args = param;
    args.append("{\"_callbackId\":\"").append(std::to_string(callbackId)).append("\"}").append(",null");
    if (!jsonArgs.empty()) {
        args.append(",").append(jsonArgs); // method args
    }
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), eventId, args = std::move(args)] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->syncEvent_(eventId, args);
            }
        },
        TaskExecutor::TaskType::JS);

    result = jsCallBackResult_[callbackId];
    LOGD("FireSyncEvent eventId: %{public}s, callbackId: %{public}d", eventId.c_str(), callbackId);
    jsCallBackResult_.erase(callbackId);
}

void FrontendDelegateDeclarative::FireAccessibilityEvent(const AccessibilityEvent& accessibilityEvent)
{
    jsAccessibilityManager_->SendAccessibilityAsyncEvent(accessibilityEvent);
}

void FrontendDelegateDeclarative::InitializeAccessibilityCallback()
{
    jsAccessibilityManager_->InitializeCallback();
}

std::string FrontendDelegateDeclarative::GetCurrentPageUrl()
{
    if (!Container::IsCurrentUseNewPipeline()) {
        return "";
    }
    CHECK_NULL_RETURN(pageRouterManager_, "");
    return pageRouterManager_->GetCurrentPageUrl();
}

// Get the currently running JS page information in NG structure.
RefPtr<RevSourceMap> FrontendDelegateDeclarative::GetCurrentPageSourceMap()
{
    if (!Container::IsCurrentUseNewPipeline()) {
        return nullptr;
    }
    CHECK_NULL_RETURN(pageRouterManager_, nullptr);
    return pageRouterManager_->GetCurrentPageSourceMap(assetManager_);
}

// Get the currently running JS page information in NG structure.
RefPtr<RevSourceMap> FrontendDelegateDeclarative::GetFaAppSourceMap()
{
    if (!Container::IsCurrentUseNewPipeline()) {
        return nullptr;
    }
    if (appSourceMap_) {
        return appSourceMap_;
    }
    std::string appMap;
    if (GetAssetContent("app.js.map", appMap)) {
        appSourceMap_ = AceType::MakeRefPtr<RevSourceMap>();
        appSourceMap_->Init(appMap);
    } else {
        LOGW("app map load failed!");
    }
    return appSourceMap_;
}

void FrontendDelegateDeclarative::GetStageSourceMap(
    std::unordered_map<std::string, RefPtr<Framework::RevSourceMap>>& sourceMaps)
{
    if (!Container::IsCurrentUseNewPipeline()) {
        return;
    }

    std::string maps;
    if (GetAssetContent(MERGE_SOURCEMAPS_PATH, maps)) {
        auto SourceMap = AceType::MakeRefPtr<RevSourceMap>();
        SourceMap->StageModeSourceMapSplit(maps, sourceMaps);
    } else {
        LOGW("app map load failed!");
    }
}

void FrontendDelegateDeclarative::InitializeRouterManager(NG::LoadPageCallback&& loadPageCallback)
{
    pageRouterManager_ = AceType::MakeRefPtr<NG::PageRouterManager>();
    pageRouterManager_->SetLoadJsCallback(std::move(loadPageCallback));
}

// Start FrontendDelegate overrides.
void FrontendDelegateDeclarative::Push(const std::string& uri, const std::string& params)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->Push({ uri }, params);
        OnMediaQueryUpdate();
        return;
    }

    Push(PageTarget(uri), params);
}

void FrontendDelegateDeclarative::PushWithMode(const std::string& uri, const std::string& params, uint32_t routerMode)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->Push({ uri }, params, static_cast<NG::RouterMode>(routerMode));
        OnMediaQueryUpdate();
        return;
    }
    Push(PageTarget(uri, static_cast<RouterMode>(routerMode)), params);
}

void FrontendDelegateDeclarative::PushWithCallback(const std::string& uri, const std::string& params,
    const std::function<void(const std::string&, int32_t)>& errorCallback, uint32_t routerMode)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->PushWithCallback({ uri }, params, errorCallback, static_cast<NG::RouterMode>(routerMode));
        OnMediaQueryUpdate();
        return;
    }
    Push(PageTarget(uri, static_cast<RouterMode>(routerMode)), params, errorCallback);
}

void FrontendDelegateDeclarative::Replace(const std::string& uri, const std::string& params)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->Replace({ uri }, params);
        return;
    }
    Replace(PageTarget(uri), params);
}

void FrontendDelegateDeclarative::ReplaceWithMode(
    const std::string& uri, const std::string& params, uint32_t routerMode)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->Replace({ uri }, params, static_cast<NG::RouterMode>(routerMode));
        return;
    }
    Replace(PageTarget(uri, static_cast<RouterMode>(routerMode)), params);
}

void FrontendDelegateDeclarative::ReplaceWithCallback(const std::string& uri, const std::string& params,
    const std::function<void(const std::string&, int32_t)>& errorCallback, uint32_t routerMode)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->ReplaceWithCallback(
            { uri }, params, errorCallback, static_cast<NG::RouterMode>(routerMode));
        return;
    }
    Replace(PageTarget(uri, static_cast<RouterMode>(routerMode)), params, errorCallback);
}

void FrontendDelegateDeclarative::Back(const std::string& uri, const std::string& params)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->BackWithTarget({ uri }, params);
        OnMediaQueryUpdate();
        return;
    }
    BackWithTarget(PageTarget(uri), params);
}

void FrontendDelegateDeclarative::Clear()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->Clear();
        return;
    }
    {
        std::lock_guard<std::mutex> lock(routerQueueMutex_);
        if (!routerQueue_.empty()) {
            AddRouterTask(RouterTask { RouterAction::CLEAR });
            return;
        }
        AddRouterTask(RouterTask { RouterAction::CLEAR });
    }
    ClearInvisiblePages();
}

int32_t FrontendDelegateDeclarative::GetStackSize() const
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_RETURN(pageRouterManager_, 0);
        return pageRouterManager_->GetStackSize();
    }
    std::lock_guard<std::mutex> lock(mutex_);
    return static_cast<int32_t>(pageRouteStack_.size());
}

void FrontendDelegateDeclarative::GetState(int32_t& index, std::string& name, std::string& path)
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->GetState(index, name, path);
        return;
    }

    std::string url;
    {
        std::lock_guard<std::mutex> lock(mutex_);
        if (pageRouteStack_.empty()) {
            return;
        }
        index = static_cast<int32_t>(pageRouteStack_.size());
        url = pageRouteStack_.back().url;
    }
    auto pos = url.rfind(".js");
    if (pos == url.length() - 3) {
        url = url.substr(0, pos);
    }
    pos = url.rfind("/");
    if (pos != std::string::npos) {
        name = url.substr(pos + 1);
        path = url.substr(0, pos + 1);
    }
}

std::string FrontendDelegateDeclarative::GetParams()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_RETURN(pageRouterManager_, "");
        return pageRouterManager_->GetParams();
    }
    if (pageParamMap_.find(pageId_) != pageParamMap_.end()) {
        return pageParamMap_.find(pageId_)->second;
    }
    return "";
}

void FrontendDelegateDeclarative::AddRouterTask(const RouterTask& task)
{
    if (routerQueue_.size() < MAX_ROUTER_STACK) {
        routerQueue_.emplace(task);
        LOGI("router queue's size = %{public}zu, action = %{public}d, url = %{public}s", routerQueue_.size(),
            static_cast<uint32_t>(task.action), task.target.url.c_str());
    } else {
        LOGW("router queue is full");
    }
}

void FrontendDelegateDeclarative::ProcessRouterTask()
{
    std::lock_guard<std::mutex> lock(routerQueueMutex_);
    if (!routerQueue_.empty()) {
        routerQueue_.pop();
    }
    if (routerQueue_.empty()) {
        return;
    }
    RouterTask currentTask = routerQueue_.front();
    LOGI("ProcessRouterTask current size = %{public}zu, action = %{public}d, url = %{public}s", routerQueue_.size(),
        static_cast<uint32_t>(currentTask.action), currentTask.target.url.c_str());
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), currentTask] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            switch (currentTask.action) {
                case RouterAction::PUSH:
                    delegate->StartPush(currentTask.target, currentTask.params, currentTask.errorCallback);
                    break;
                case RouterAction::REPLACE:
                    delegate->StartReplace(currentTask.target, currentTask.params, currentTask.errorCallback);
                    break;
                case RouterAction::BACK:
                    delegate->BackCheckAlert(currentTask.target, currentTask.params);
                    break;
                case RouterAction::CLEAR:
                    delegate->ClearInvisiblePages();
                    break;
                default:
                    break;
            }
        },
        TaskExecutor::TaskType::JS);
}

bool FrontendDelegateDeclarative::IsNavigationStage(const PageTarget& target)
{
    return target.container.Upgrade();
}

void FrontendDelegateDeclarative::Push(const PageTarget& target, const std::string& params,
    const std::function<void(const std::string&, int32_t)>& errorCallback)
{
    if (IsNavigationStage(target)) {
        StartPush(target, params, errorCallback);
        return;
    }
    {
        std::lock_guard<std::mutex> lock(routerQueueMutex_);
        if (!routerQueue_.empty()) {
            AddRouterTask(RouterTask { RouterAction::PUSH, target, params, errorCallback });
            return;
        }
        AddRouterTask(RouterTask { RouterAction::PUSH, target, params, errorCallback });
    }
    StartPush(target, params, errorCallback);
}

void FrontendDelegateDeclarative::StartPush(const PageTarget& target, const std::string& params,
    const std::function<void(const std::string&, int32_t)>& errorCallback)
{
    if (target.url.empty()) {
        LOGE("router.Push uri is empty");
        ProcessRouterTask();
        return;
    }
    if (isRouteStackFull_) {
        LOGE("the router stack has reached its max size, you can't push any more pages.");
        EventReport::SendPageRouterException(PageRouterExcepType::PAGE_STACK_OVERFLOW_ERR, target.url);
        if (errorCallback != nullptr) {
            errorCallback("The pages are pushed too much.", ERROR_CODE_PAGE_STACK_FULL);
        }
        ProcessRouterTask();
        return;
    }

    std::string pagePath = manifestParser_->GetRouter()->GetPagePath(target.url);
    LOGD("router.Push pagePath = %{private}s", pagePath.c_str());
    if (!pagePath.empty()) {
        LoadPage(GenerateNextPageId(), PageTarget(target, pagePath), false, params);
        {
            UICastContextImpl::HandleRouterPageCall("UICast::Page::push", target.url);
        }
        if (errorCallback != nullptr) {
            errorCallback("", ERROR_CODE_NO_ERROR);
        }
    } else {
        LOGW("[Engine Log] this uri not support in route push.");
        if (errorCallback != nullptr) {
            errorCallback("The uri of router is not exist.", ERROR_CODE_URI_ERROR);
        }
        ProcessRouterTask();
    }
}

void FrontendDelegateDeclarative::Replace(const PageTarget& target, const std::string& params,
    const std::function<void(const std::string&, int32_t)>& errorCallback)
{
    if (IsNavigationStage(target)) {
        StartReplace(target, params, errorCallback);
        return;
    }
    {
        std::lock_guard<std::mutex> lock(routerQueueMutex_);
        if (!routerQueue_.empty()) {
            AddRouterTask(RouterTask { RouterAction::REPLACE, target, params, errorCallback });
            return;
        }
        AddRouterTask(RouterTask { RouterAction::REPLACE, target, params, errorCallback });
    }
    StartReplace(target, params, errorCallback);
}

void FrontendDelegateDeclarative::StartReplace(const PageTarget& target, const std::string& params,
    const std::function<void(const std::string&, int32_t)>& errorCallback)
{
    if (target.url.empty()) {
        LOGE("router.Replace uri is empty");
        ProcessRouterTask();
        return;
    }

    std::string pagePath = manifestParser_->GetRouter()->GetPagePath(target.url);
    LOGD("router.Replace pagePath = %{private}s", pagePath.c_str());
    if (!pagePath.empty()) {
        LoadReplacePage(GenerateNextPageId(), PageTarget(target, pagePath), params);
        {
            UICastContextImpl::HandleRouterPageCall("UICast::Page::replace", target.url);
        }
        if (errorCallback != nullptr) {
            errorCallback("", ERROR_CODE_NO_ERROR);
        }
    } else {
        LOGW("[Engine Log] this uri not support in route replace.");
        if (errorCallback != nullptr) {
            errorCallback("The uri of router is not exist.", ERROR_CODE_URI_ERROR_LITE);
        }
        ProcessRouterTask();
    }
}

void FrontendDelegateDeclarative::PostponePageTransition()
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = delegate->pipelineContextHolder_.Get();
            pipelineContext->PostponePageTransition();
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::LaunchPageTransition()
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = delegate->pipelineContextHolder_.Get();
            pipelineContext->LaunchPageTransition();
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::BackCheckAlert(const PageTarget& target, const std::string& params)
{
    {
        std::lock_guard<std::mutex> lock(mutex_);
        if (pageRouteStack_.empty()) {
            LOGI("page route stack is empty");
            ProcessRouterTask();
            return;
        }
        auto& currentPage = pageRouteStack_.back();
        if (currentPage.alertCallback) {
            backUri_ = target;
            backParam_ = params;
            auto context = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
            taskExecutor_->PostTask(
                [context, dialogProperties = pageRouteStack_.back().dialogProperties,
                    isRightToLeft = AceApplicationInfo::GetInstance().IsRightToLeft()]() {
                    if (context) {
                        context->ShowDialog(dialogProperties, isRightToLeft);
                    }
                },
                TaskExecutor::TaskType::UI);
            return;
        }
    }
    StartBack(target, params);
}

void FrontendDelegateDeclarative::BackWithTarget(const PageTarget& target, const std::string& params)
{
    LOGD("router.Back path = %{private}s", target.url.c_str());
    if (IsNavigationStage(target)) {
        BackCheckAlert(target, params);
        return;
    }
    {
        std::lock_guard<std::mutex> lock(routerQueueMutex_);
        if (!routerQueue_.empty()) {
            AddRouterTask(RouterTask { RouterAction::BACK, target, params });
            return;
        }
        AddRouterTask(RouterTask { RouterAction::BACK, target, params });
    }
    BackCheckAlert(target, params);
}

void FrontendDelegateDeclarative::StartBack(const PageTarget& target, const std::string& params)
{
    {
        UICastContextImpl::HandleRouterPageCall("UICast::Page::back", target.url);
    }
    if (target.url.empty()) {
        std::string pagePath;
        {
            std::lock_guard<std::mutex> lock(mutex_);
            size_t pageRouteSize = pageRouteStack_.size();
            if (pageRouteSize > 1) {
                pageId_ = pageRouteStack_[pageRouteSize - 2].pageId;
                if (!params.empty()) {
                    pageParamMap_[pageId_] = params;
                }
                // determine whether the previous page needs to be loaded
                if (pageRouteStack_[pageRouteSize - 2].isRestore) {
                    pagePath = pageRouteStack_[pageRouteSize - 2].url;
                }
            }
        }
        if (!pagePath.empty()) {
            LoadPage(pageId_, PageTarget(target, pagePath), false, params, true);
            return;
        }
        LOGI("run in normal back");
        PopPage();
    } else {
        std::string pagePath = manifestParser_->GetRouter()->GetPagePath(target.url, ".js");
        LOGD("router.Back pagePath = %{private}s", pagePath.c_str());
        if (!pagePath.empty()) {
            bool isRestore = false;
            pageId_ = GetPageIdByUrl(pagePath, isRestore);
            if (isRestore) {
                LoadPage(pageId_, PageTarget(target, pagePath), false, params, true);
                return;
            }
            if (!params.empty()) {
                std::lock_guard<std::mutex> lock(mutex_);
                pageParamMap_[pageId_] = params;
            }
            PopToPage(pagePath);
        } else {
            LOGW("[Engine Log] this uri not support in route Back.");
            ProcessRouterTask();
        }
    }
}

size_t FrontendDelegateDeclarative::GetComponentsCount()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_RETURN(pageRouterManager_, 0);
        auto pageNode = pageRouterManager_->GetCurrentPageNode();
        CHECK_NULL_RETURN(pageNode, 0);
        return pageNode->GetAllDepthChildrenCount();
    }
    auto pipelineContext = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    CHECK_NULL_RETURN(pipelineContext, 0);
    const auto& pageElement = pipelineContext->GetLastPage();
    if (pageElement) {
        return pageElement->GetComponentsCount();
    }
    return 0;
}

void FrontendDelegateDeclarative::TriggerPageUpdate(int32_t pageId, bool directExecute)
{
    auto page = GetPage(pageId);
    if (!page) {
        return;
    }

    auto jsPage = AceType::DynamicCast<Framework::JsAcePage>(page);
    ACE_DCHECK(jsPage);

    // Pop all JS command and execute them in UI thread.
    auto jsCommands = std::make_shared<std::vector<RefPtr<JsCommand>>>();
    jsPage->PopAllCommands(*jsCommands);

    auto pipelineContext = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    WeakPtr<Framework::JsAcePage> jsPageWeak(jsPage);
    WeakPtr<PipelineContext> contextWeak(pipelineContext);
    auto updateTask = [jsPageWeak, contextWeak, jsCommands] {
        ACE_SCOPED_TRACE("FlushUpdateCommands");
        auto jsPage = jsPageWeak.Upgrade();
        auto context = contextWeak.Upgrade();
        if (!jsPage || !context) {
            LOGE("Page update failed. page or context is null.");
            EventReport::SendPageRouterException(PageRouterExcepType::UPDATE_PAGE_ERR);
            return;
        }
        // Flush all JS commands.
        for (const auto& command : *jsCommands) {
            command->Execute(jsPage);
        }
        if (jsPage->GetDomDocument()) {
            jsPage->GetDomDocument()->HandleComponentPostBinding();
        }
        auto accessibilityManager = context->GetAccessibilityManager();
        if (accessibilityManager) {
            accessibilityManager->HandleComponentPostBinding();
        }

        jsPage->ClearShowCommand();
        std::vector<NodeId> dirtyNodes;
        jsPage->PopAllDirtyNodes(dirtyNodes);
        for (auto nodeId : dirtyNodes) {
            auto patchComponent = jsPage->BuildPagePatch(nodeId);
            if (patchComponent) {
                context->ScheduleUpdate(patchComponent);
            }
        }
    };

    taskExecutor_->PostTask(
        [updateTask, pipelineContext, directExecute]() {
            if (pipelineContext) {
                pipelineContext->AddPageUpdateTask(std::move(updateTask), directExecute);
            }
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::PostJsTask(std::function<void()>&& task)
{
    taskExecutor_->PostTask(task, TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::RemoveVisibleChangeNode(NodeId id)
{
    LOGW("RemoveVisibleChangeNode: Not implemented yet.");
}

const std::string& FrontendDelegateDeclarative::GetAppID() const
{
    return manifestParser_->GetAppInfo()->GetAppID();
}

const std::string& FrontendDelegateDeclarative::GetAppName() const
{
    return manifestParser_->GetAppInfo()->GetAppName();
}

const std::string& FrontendDelegateDeclarative::GetVersionName() const
{
    return manifestParser_->GetAppInfo()->GetVersionName();
}

int32_t FrontendDelegateDeclarative::GetVersionCode() const
{
    return manifestParser_->GetAppInfo()->GetVersionCode();
}

double FrontendDelegateDeclarative::MeasureText(const MeasureContext& context)
{
    return MeasureUtil::MeasureText(context);
}

Size FrontendDelegateDeclarative::MeasureTextSize(const MeasureContext& context)
{
    return MeasureUtil::MeasureTextSize(context);
}

void FrontendDelegateDeclarative::ShowToast(const std::string& message, int32_t duration, const std::string& bottom)
{
    LOGD("FrontendDelegateDeclarative ShowToast.");
    {
        UICastContextImpl::ShowToast(message, duration, bottom);
    }
    int32_t durationTime = std::clamp(duration, TOAST_TIME_DEFAULT, TOAST_TIME_MAX);
    bool isRightToLeft = AceApplicationInfo::GetInstance().IsRightToLeft();
    if (Container::IsCurrentUseNewPipeline()) {
        auto task = [durationTime, message, bottom, isRightToLeft, containerId = Container::CurrentId()](
                        const RefPtr<NG::OverlayManager>& overlayManager) {
            CHECK_NULL_VOID(overlayManager);
            ContainerScope scope(containerId);
            LOGI("Begin to show toast message %{public}s, duration is %{public}d", message.c_str(), durationTime);
            overlayManager->ShowToast(message, durationTime, bottom, isRightToLeft);
        };
        MainWindowOverlay(std::move(task));
        return;
    }
    auto pipeline = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    taskExecutor_->PostTask(
        [durationTime, message, bottom, isRightToLeft, context = pipeline] {
            ToastComponent::GetInstance().Show(context, message, durationTime, bottom, isRightToLeft);
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::SetToastStopListenerCallback(std::function<void()>&& stopCallback)
{
    ToastComponent::GetInstance().SetToastStopListenerCallback(std::move(stopCallback));
}

void FrontendDelegateDeclarative::ShowDialogInner(DialogProperties& dialogProperties,
    std::function<void(int32_t, int32_t)>&& callback, const std::set<std::string>& callbacks)
{
    auto pipelineContext = pipelineContextHolder_.Get();
    if (Container::IsCurrentUseNewPipeline()) {
        LOGI("Dialog IsCurrentUseNewPipeline.");
        dialogProperties.onSuccess = std::move(callback);
        dialogProperties.onCancel = [callback, taskExecutor = taskExecutor_] {
            taskExecutor->PostTask([callback]() { if (callback) callback(CALLBACK_ERRORCODE_CANCEL, CALLBACK_DATACODE_ZERO); },
                TaskExecutor::TaskType::JS);
        };
        auto task = [dialogProperties](const RefPtr<NG::OverlayManager>& overlayManager) {
            CHECK_NULL_VOID(overlayManager);
            LOGI("Begin to show dialog ");
            overlayManager->ShowDialog(dialogProperties, nullptr, AceApplicationInfo::GetInstance().IsRightToLeft());
        };
        MainWindowOverlay(std::move(task));
        return;
    }
    std::unordered_map<std::string, EventMarker> callbackMarkers;
    if (callbacks.find(COMMON_SUCCESS) != callbacks.end()) {
        auto successEventMarker = BackEndEventManager<void(int32_t)>::GetInstance().GetAvailableMarker();
        BackEndEventManager<void(int32_t)>::GetInstance().BindBackendEvent(
            successEventMarker, [callback, taskExecutor = taskExecutor_](int32_t successType) {
                taskExecutor->PostTask([callback, successType]() { callback(CALLBACK_ERRORCODE_SUCCESS, successType); },
                    TaskExecutor::TaskType::JS);
            });
        callbackMarkers.emplace(COMMON_SUCCESS, successEventMarker);
    }

    if (callbacks.find(COMMON_CANCEL) != callbacks.end()) {
        auto cancelEventMarker = BackEndEventManager<void()>::GetInstance().GetAvailableMarker();
        BackEndEventManager<void()>::GetInstance().BindBackendEvent(
            cancelEventMarker, [callback, taskExecutor = taskExecutor_] {
                taskExecutor->PostTask([callback]() { callback(CALLBACK_ERRORCODE_CANCEL, CALLBACK_DATACODE_ZERO); },
                    TaskExecutor::TaskType::JS);
            });
        callbackMarkers.emplace(COMMON_CANCEL, cancelEventMarker);
    }

    if (callbacks.find(COMMON_COMPLETE) != callbacks.end()) {
        auto completeEventMarker = BackEndEventManager<void()>::GetInstance().GetAvailableMarker();
        BackEndEventManager<void()>::GetInstance().BindBackendEvent(
            completeEventMarker, [callback, taskExecutor = taskExecutor_] {
                taskExecutor->PostTask([callback]() { callback(CALLBACK_ERRORCODE_COMPLETE, CALLBACK_DATACODE_ZERO); },
                    TaskExecutor::TaskType::JS);
            });
        callbackMarkers.emplace(COMMON_COMPLETE, completeEventMarker);
    }
    dialogProperties.callbacks = std::move(callbackMarkers);
    auto context = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    CHECK_NULL_VOID(context);
    context->ShowDialog(dialogProperties, AceApplicationInfo::GetInstance().IsRightToLeft());
}

void FrontendDelegateDeclarative::ShowDialog(const std::string& title, const std::string& message,
    const std::vector<ButtonInfo>& buttons, bool autoCancel, std::function<void(int32_t, int32_t)>&& callback,
    const std::set<std::string>& callbacks)
{
    DialogProperties dialogProperties = {
        .title = title,
        .content = message,
        .autoCancel = autoCancel,
        .buttons = buttons,
    };
    ShowDialogInner(dialogProperties, std::move(callback), callbacks);
    {
        UICastContextImpl::ShowDialog(dialogProperties);
    }
}

void FrontendDelegateDeclarative::ShowDialog(const std::string& title, const std::string& message,
    const std::vector<ButtonInfo>& buttons, bool autoCancel, std::function<void(int32_t, int32_t)>&& callback,
    const std::set<std::string>& callbacks, std::function<void(bool)>&& onStatusChanged)
{
    DialogProperties dialogProperties = {
        .title = title,
        .content = message,
        .autoCancel = autoCancel,
        .buttons = buttons,
        .onStatusChanged = std::move(onStatusChanged),
    };
    ShowDialogInner(dialogProperties, std::move(callback), callbacks);
    {
        UICastContextImpl::ShowDialog(dialogProperties);
    }
}

void FrontendDelegateDeclarative::ShowActionMenuInner(DialogProperties& dialogProperties,
    const std::vector<ButtonInfo>& button, std::function<void(int32_t, int32_t)>&& callback)
{
    ButtonInfo buttonInfo = { .text = Localization::GetInstance()->GetEntryLetters("common.cancel"), .textColor = "" };
    dialogProperties.buttons.emplace_back(buttonInfo);
    if (Container::IsCurrentUseNewPipeline()) {
        LOGI("Dialog IsCurrentUseNewPipeline.");
        dialogProperties.onSuccess = std::move(callback);
        dialogProperties.onCancel = [callback, taskExecutor = taskExecutor_] {
            taskExecutor->PostTask([callback]() { if (callback) callback(CALLBACK_ERRORCODE_CANCEL, CALLBACK_DATACODE_ZERO); },
                TaskExecutor::TaskType::JS);
        };
        auto context = DynamicCast<NG::PipelineContext>(pipelineContextHolder_.Get());
        auto overlayManager = context ? context->GetOverlayManager() : nullptr;
        taskExecutor_->PostTask(
            [dialogProperties, weak = WeakPtr<NG::OverlayManager>(overlayManager)] {
                auto overlayManager = weak.Upgrade();
                CHECK_NULL_VOID(overlayManager);
                overlayManager->ShowDialog(
                    dialogProperties, nullptr, AceApplicationInfo::GetInstance().IsRightToLeft());
            },
            TaskExecutor::TaskType::UI);
        return;
    }

    std::unordered_map<std::string, EventMarker> callbackMarkers;
    auto successEventMarker = BackEndEventManager<void(int32_t)>::GetInstance().GetAvailableMarker();
    BackEndEventManager<void(int32_t)>::GetInstance().BindBackendEvent(
        successEventMarker, [callback, number = button.size(), taskExecutor = taskExecutor_](int32_t successType) {
            taskExecutor->PostTask(
                [callback, number, successType]() {
                    // if callback index is larger than button's number, cancel button is selected
                    if (static_cast<size_t>(successType) == number) {
                        callback(CALLBACK_ERRORCODE_CANCEL, CALLBACK_DATACODE_ZERO);
                    } else {
                        callback(CALLBACK_ERRORCODE_SUCCESS, successType);
                    }
                },
                TaskExecutor::TaskType::JS);
        });
    callbackMarkers.emplace(COMMON_SUCCESS, successEventMarker);

    auto cancelEventMarker = BackEndEventManager<void()>::GetInstance().GetAvailableMarker();
    BackEndEventManager<void()>::GetInstance().BindBackendEvent(
        cancelEventMarker, [callback, taskExecutor = taskExecutor_] {
            taskExecutor->PostTask([callback]() { callback(CALLBACK_ERRORCODE_CANCEL, CALLBACK_DATACODE_ZERO); },
                TaskExecutor::TaskType::JS);
        });
    callbackMarkers.emplace(COMMON_CANCEL, cancelEventMarker);
    dialogProperties.callbacks = std::move(callbackMarkers);
    auto context = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    CHECK_NULL_VOID(context);
    context->ShowDialog(dialogProperties, AceApplicationInfo::GetInstance().IsRightToLeft());
}

void FrontendDelegateDeclarative::ShowActionMenu(
    const std::string& title, const std::vector<ButtonInfo>& button, std::function<void(int32_t, int32_t)>&& callback)
{
    DialogProperties dialogProperties = {
        .title = title,
        .autoCancel = true,
        .isMenu = true,
        .buttons = button,
    };
    ShowActionMenuInner(dialogProperties, button, std::move(callback));
    {
        UICastContextImpl::ShowDialog(dialogProperties);
    }
}

void FrontendDelegateDeclarative::ShowActionMenu(const std::string& title, const std::vector<ButtonInfo>& button,
    std::function<void(int32_t, int32_t)>&& callback, std::function<void(bool)>&& onStatusChanged)
{
    DialogProperties dialogProperties = {
        .title = title,
        .autoCancel = true,
        .isMenu = true,
        .buttons = button,
        .onStatusChanged = std::move(onStatusChanged),
    };
    ShowActionMenuInner(dialogProperties, button, std::move(callback));
    {
        UICastContextImpl::ShowDialog(dialogProperties);
    }
}

void FrontendDelegateDeclarative::EnableAlertBeforeBackPage(
    const std::string& message, std::function<void(int32_t)>&& callback)
{
    if (Container::IsCurrentUseNewPipeline()) {
        LOGI("EnableAlertBeforeBackPage IsCurrentUseNewPipeline.");
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->EnableAlertBeforeBackPage(message, std::move(callback));
        return;
    }

    if (!taskExecutor_) {
        LOGE("task executor is null.");
        return;
    }
    std::unordered_map<std::string, EventMarker> callbackMarkers;
    auto pipelineContext = pipelineContextHolder_.Get();
    auto successEventMarker = BackEndEventManager<void(int32_t)>::GetInstance().GetAvailableMarker();
    BackEndEventManager<void(int32_t)>::GetInstance().BindBackendEvent(successEventMarker,
        [weak = AceType::WeakClaim(this), callback, taskExecutor = taskExecutor_](int32_t successType) {
            taskExecutor->PostTask(
                [weak, callback, successType]() {
                    callback(successType);
                    auto delegate = weak.Upgrade();
                    if (!delegate) {
                        return;
                    }
                    if (!successType) {
                        LOGI("dialog choose cancel button, can not back");
                        delegate->ProcessRouterTask();
                        return;
                    }
                    delegate->StartBack(delegate->backUri_, delegate->backParam_);
                },
                TaskExecutor::TaskType::JS);
        });
    callbackMarkers.emplace(COMMON_SUCCESS, successEventMarker);

    std::lock_guard<std::mutex> lock(mutex_);
    if (pageRouteStack_.empty()) {
        LOGE("page stack is null.");
        return;
    }

    auto& currentPage = pageRouteStack_.back();
    ClearAlertCallback(currentPage);
    currentPage.alertCallback = callback;
    currentPage.dialogProperties = {
        .content = message,
        .autoCancel = false,
        .buttons = { { .text = Localization::GetInstance()->GetEntryLetters("common.cancel"), .textColor = "" },
            { .text = Localization::GetInstance()->GetEntryLetters("common.ok"), .textColor = "" } },
        .callbacks = std::move(callbackMarkers),
    };
}

void FrontendDelegateDeclarative::DisableAlertBeforeBackPage()
{
    if (Container::IsCurrentUseNewPipeline()) {
        LOGI("DisableAlertBeforeBackPage IsCurrentUseNewPipeline.");
        CHECK_NULL_VOID(pageRouterManager_);
        pageRouterManager_->DisableAlertBeforeBackPage();
        return;
    }

    std::lock_guard<std::mutex> lock(mutex_);
    if (pageRouteStack_.empty()) {
        LOGE("page stack is null.");
        return;
    }
    auto& currentPage = pageRouteStack_.back();
    ClearAlertCallback(currentPage);
    currentPage.alertCallback = nullptr;
}

Rect FrontendDelegateDeclarative::GetBoundingRectData(NodeId nodeId)
{
    Rect rect;
    auto task = [context = pipelineContextHolder_.Get(), nodeId, &rect]() {
        context->GetBoundingRectData(nodeId, rect);
    };
    PostSyncTaskToPage(task);
    return rect;
}

std::string FrontendDelegateDeclarative::GetInspector(NodeId nodeId)
{
    std::string attrs;
    auto task = [weak = WeakClaim(AceType::RawPtr(jsAccessibilityManager_)), nodeId, &attrs]() {
        auto accessibilityNodeManager = weak.Upgrade();
        if (accessibilityNodeManager) {
            attrs = accessibilityNodeManager->GetInspectorNodeById(nodeId);
        }
    };
    PostSyncTaskToPage(task);
    return attrs;
}

void FrontendDelegateDeclarative::SetCallBackResult(const std::string& callBackId, const std::string& result)
{
    jsCallBackResult_.try_emplace(StringToInt(callBackId), result);
}

void FrontendDelegateDeclarative::WaitTimer(
    const std::string& callbackId, const std::string& delay, bool isInterval, bool isFirst)
{
    if (!isFirst) {
        auto timeoutTaskIter = timeoutTaskMap_.find(callbackId);
        // If not find the callbackId in map, means this timer already was removed,
        // no need create a new cancelableTimer again.
        if (timeoutTaskIter == timeoutTaskMap_.end()) {
            return;
        }
    }

    int32_t delayTime = StringToInt(delay);
    // CancelableCallback class can only be executed once.
    CancelableCallback<void()> cancelableTimer;
    cancelableTimer.Reset([callbackId, delay, isInterval, call = timer_] { call(callbackId, delay, isInterval); });
    auto result = timeoutTaskMap_.try_emplace(callbackId, cancelableTimer);
    if (!result.second) {
        result.first->second = cancelableTimer;
    }
    taskExecutor_->PostDelayedTask(cancelableTimer, TaskExecutor::TaskType::JS, delayTime);
}

void FrontendDelegateDeclarative::ClearTimer(const std::string& callbackId)
{
    auto timeoutTaskIter = timeoutTaskMap_.find(callbackId);
    if (timeoutTaskIter != timeoutTaskMap_.end()) {
        timeoutTaskIter->second.Cancel();
        timeoutTaskMap_.erase(timeoutTaskIter);
    } else {
        LOGW("ClearTimer callbackId not found");
    }
}

void FrontendDelegateDeclarative::PostSyncTaskToPage(std::function<void()>&& task)
{
    pipelineContextHolder_.Get(); // Wait until Pipeline Context is attached.
    taskExecutor_->PostSyncTask(task, TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::AddTaskObserver(std::function<void()>&& task)
{
    taskExecutor_->AddTaskObserver(std::move(task));
}

void FrontendDelegateDeclarative::RemoveTaskObserver()
{
    taskExecutor_->RemoveTaskObserver();
}

bool FrontendDelegateDeclarative::GetAssetContent(const std::string& url, std::string& content)
{
    return GetAssetContentImpl(assetManager_, url, content);
}

bool FrontendDelegateDeclarative::GetAssetContent(const std::string& url, std::vector<uint8_t>& content)
{
    return GetAssetContentImpl(assetManager_, url, content);
}

std::string FrontendDelegateDeclarative::GetAssetPath(const std::string& url)
{
    return GetAssetPathImpl(assetManager_, url);
}

void FrontendDelegateDeclarative::LoadPage(
    int32_t pageId, const PageTarget& target, bool isMainPage, const std::string& params, bool isRestore)
{
    LOGI("FrontendDelegateDeclarative LoadPage[%{public}d]: %{public}s.", pageId, target.url.c_str());
    if (pageId == INVALID_PAGE_ID) {
        LOGE("FrontendDelegateDeclarative, invalid page id");
        EventReport::SendPageRouterException(PageRouterExcepType::LOAD_PAGE_ERR, target.url);
        ProcessRouterTask();
        return;
    }
    {
        std::lock_guard<std::mutex> lock(mutex_);
        pageId_ = pageId;
        pageParamMap_[pageId] = params;
    }
    if (isStagingPageExist_) {
        LOGE("FrontendDelegateDeclarative, load page failed, waiting for current page loading finish.");
        RecyclePageId(pageId);
        ProcessRouterTask();
        return;
    }
    isStagingPageExist_ = true;

    singlePageId_ = INVALID_PAGE_ID;
    if (target.routerMode == RouterMode::SINGLE) {
        singlePageId_ = GetPageIdByUrl(target.url);
        LOGI("single page id = %{public}d", singlePageId_);
    }

    auto document = AceType::MakeRefPtr<DOMDocument>(pageId);
    auto page = AceType::MakeRefPtr<JsAcePage>(pageId, document, target.url, target.container);
    page->SetPageParams(params);
    page->SetFlushCallback([weak = AceType::WeakClaim(this), isMainPage, isRestore](const RefPtr<JsAcePage>& acePage) {
        auto delegate = weak.Upgrade();
        if (!delegate) {
            return;
        }
        if (acePage) {
            delegate->FlushPageCommand(acePage, acePage->GetUrl(), isMainPage, isRestore);
        } else {
            LOGE("flush callback called unexpected");
            delegate->ProcessRouterTask();
        }
    });
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), page, isMainPage] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            delegate->loadJs_(page->GetUrl(), page, isMainPage);
            page->FlushCommands();
            // just make sure the pipelineContext is created.
            auto pipeline = delegate->pipelineContextHolder_.Get();
            if (delegate->GetMinPlatformVersion() > 0) {
                pipeline->SetMinPlatformVersion(delegate->GetMinPlatformVersion());
            }
            delegate->taskExecutor_->PostTask(
                [weak, page] {
                    auto delegate = weak.Upgrade();
                    if (delegate) {
                        auto context = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
                        if (context) {
                            context->FlushFocus();
                        }
                    }
                    if (page->GetDomDocument()) {
                        page->GetDomDocument()->HandlePageLoadFinish();
                    }
                },
                TaskExecutor::TaskType::UI);
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnSurfaceChanged()
{
    if (mediaQueryInfo_->GetIsInit()) {
        mediaQueryInfo_->SetIsInit(false);
    }
    mediaQueryInfo_->EnsureListenerIdValid();
    OnMediaQueryUpdate();
}

void FrontendDelegateDeclarative::OnMediaQueryUpdate()
{
    auto containerId = Container::CurrentId();
    if (containerId < 0) {
        auto container = Container::GetActive();
        if (container) {
            containerId = container->GetInstanceId();
        }
    }
    bool isInSubwindow = containerId >= 1000000;
    if (isInSubwindow) {
        return;
    }
    if (mediaQueryInfo_->GetIsInit()) {
        return;
    }

    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            const auto& info = delegate->mediaQueryInfo_->GetMediaQueryInfo();
            // request css mediaquery
            std::string param("\"viewsizechanged\",");
            param.append(info);
            delegate->asyncEvent_("_root", param);

            // request js media query
            const auto& listenerId = delegate->mediaQueryInfo_->GetListenerId();
            delegate->mediaQueryCallback_(listenerId, info);
            delegate->mediaQueryInfo_->ResetListenerId();
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::OnPageReady(
    const RefPtr<JsAcePage>& page, const std::string& url, bool isMainPage, bool isRestore)
{
    LOGI("OnPageReady url = %{private}s", url.c_str());
    // Pop all JS command and execute them in UI thread.
    auto jsCommands = std::make_shared<std::vector<RefPtr<JsCommand>>>();
    page->PopAllCommands(*jsCommands);

    auto pipelineContext = pipelineContextHolder_.Get();
    page->SetPipelineContext(pipelineContext);
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), page, url, jsCommands, isMainPage, isRestore] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
            CHECK_NULL_VOID(pipelineContext);
            // Flush all JS commands.
            for (const auto& command : *jsCommands) {
                command->Execute(page);
            }
            // Just clear all dirty nodes.
            page->ClearAllDirtyNodes();
            if (page->GetDomDocument()) {
                page->GetDomDocument()->HandleComponentPostBinding();
            }
            if (pipelineContext->GetAccessibilityManager()) {
                pipelineContext->GetAccessibilityManager()->HandleComponentPostBinding();
            }
            if (isRestore) {
                delegate->RestorePopPage(page, url);
                return;
            }
            if (pipelineContext->CanPushPage()) {
                if (!isMainPage) {
                    delegate->OnPageHide();
                }
                delegate->OnPrePageChange(page);
                pipelineContext->RemovePageTransitionListener(delegate->pageTransitionListenerId_);
                delegate->pageTransitionListenerId_ = pipelineContext->AddPageTransitionListener(
                    [weak, page](
                        const TransitionEvent& event, const WeakPtr<PageElement>& in, const WeakPtr<PageElement>& out) {
                        auto delegate = weak.Upgrade();
                        if (delegate) {
                            delegate->PushPageTransitionListener(event, page);
                        }
                    });
                if (delegate->singlePageId_ != INVALID_PAGE_ID) {
                    pipelineContext->SetSinglePageId(delegate->singlePageId_);
                }
                pipelineContext->PushPage(page->BuildPage(url), page->GetStageElement());
            } else {
                // This page has been loaded but become useless now, the corresponding js instance
                // must be destroyed to avoid memory leak.
                LOGW("router push run in unexpected process");
                delegate->OnPageDestroy(page->GetPageId());
                delegate->ResetStagingPage();
                delegate->ProcessRouterTask();
            }
            delegate->isStagingPageExist_ = false;
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::PushPageTransitionListener(
    const TransitionEvent& event, const RefPtr<JsAcePage>& page)
{
    if (event == TransitionEvent::PUSH_END) {
        OnPushPageSuccess(page, page->GetUrl());
        SetCurrentPage(page->GetPageId());
        OnPageShow();
        OnMediaQueryUpdate();
        ProcessRouterTask();
    }
}

void FrontendDelegateDeclarative::OnPushPageSuccess(const RefPtr<JsAcePage>& page, const std::string& url)
{
    std::lock_guard<std::mutex> lock(mutex_);
    AddPageLocked(page);
    pageRouteStack_.emplace_back(PageInfo { page->GetPageId(), page->GetUrl() });
    if (singlePageId_ != INVALID_PAGE_ID) {
        RecycleSinglePage();
    }
    if (pageRouteStack_.size() >= MAX_ROUTER_STACK) {
        isRouteStackFull_ = true;
        EventReport::SendPageRouterException(PageRouterExcepType::PAGE_STACK_OVERFLOW_ERR, page->GetUrl());
    }
    LOGI("OnPushPageSuccess size=%{private}zu,pageId=%{private}d,url=%{private}s", pageRouteStack_.size(),
        pageRouteStack_.back().pageId, pageRouteStack_.back().url.c_str());
}

void FrontendDelegateDeclarative::RecycleSinglePage()
{
    LOGI("single page recycle");
    auto iter = find_if(pageRouteStack_.begin(), pageRouteStack_.end(),
        [&](const PageInfo& item) { return item.pageId == singlePageId_; });
    if (iter != pageRouteStack_.end()) {
        pageMap_.erase(singlePageId_);
        pageParamMap_.erase(singlePageId_);
        pageRouteStack_.erase(iter);
        OnPageDestroy(singlePageId_);
    }
    singlePageId_ = INVALID_PAGE_ID;
}

void FrontendDelegateDeclarative::OnPrePageChange(const RefPtr<JsAcePage>& page)
{
    LOGD("FrontendDelegateDeclarative OnPrePageChange");
    if (page && page->GetDomDocument() && jsAccessibilityManager_) {
        jsAccessibilityManager_->SetRootNodeId(page->GetDomDocument()->GetRootNodeId());
    }
}

void FrontendDelegateDeclarative::FlushPageCommand(
    const RefPtr<JsAcePage>& page, const std::string& url, bool isMainPage, bool isRestore)
{
    if (!page) {
        ProcessRouterTask();
        return;
    }
    LOGD("FlushPageCommand FragmentCount(%{public}d)", page->FragmentCount());
    if (page->FragmentCount() == 1) {
        OnPageReady(page, url, isMainPage, isRestore);
    } else {
        TriggerPageUpdate(page->GetPageId());
    }
}

void FrontendDelegateDeclarative::AddPageLocked(const RefPtr<JsAcePage>& page)
{
    auto result = pageMap_.try_emplace(page->GetPageId(), page);
    if (!result.second) {
        LOGW("the page has already in the map");
    }
}

void FrontendDelegateDeclarative::SetCurrentPage(int32_t pageId)
{
    LOGD("FrontendDelegateDeclarative SetCurrentPage pageId=%{private}d", pageId);
    auto page = GetPage(pageId);
    if (page != nullptr) {
        jsAccessibilityManager_->SetVersion(AccessibilityVersion::JS_DECLARATIVE_VERSION);
        jsAccessibilityManager_->SetRunningPage(page);
        taskExecutor_->PostTask([updatePage = updatePage_, page] { updatePage(page); }, TaskExecutor::TaskType::JS);
    } else {
        LOGE("FrontendDelegateDeclarative SetCurrentPage page is null.");
    }
}

void FrontendDelegateDeclarative::PopToPage(const std::string& url)
{
    LOGD("FrontendDelegateDeclarative PopToPage url = %{private}s", url.c_str());
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), url] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pageId = delegate->GetPageIdByUrl(url);
            if (pageId == INVALID_PAGE_ID) {
                delegate->ProcessRouterTask();
                return;
            }
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
            CHECK_NULL_VOID(pipelineContext);
            if (!pipelineContext->CanPopPage()) {
                LOGW("router pop to page run in unexpected process");
                delegate->ResetStagingPage();
                delegate->ProcessRouterTask();
                return;
            }
            delegate->OnPageHide();
            pipelineContext->RemovePageTransitionListener(delegate->pageTransitionListenerId_);
            delegate->pageTransitionListenerId_ = pipelineContext->AddPageTransitionListener(
                [weak, url, pageId](
                    const TransitionEvent& event, const WeakPtr<PageElement>& in, const WeakPtr<PageElement>& out) {
                    auto delegate = weak.Upgrade();
                    if (delegate) {
                        delegate->PopToPageTransitionListener(event, url, pageId);
                    }
                });
            pipelineContext->PopToPage(pageId);
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::PopToPageTransitionListener(
    const TransitionEvent& event, const std::string& url, int32_t pageId)
{
    if (event == TransitionEvent::POP_END) {
        OnPopToPageSuccess(url);
        SetCurrentPage(pageId);
        OnPageShow();
        OnMediaQueryUpdate();
        ProcessRouterTask();
    }
}

void FrontendDelegateDeclarative::OnPopToPageSuccess(const std::string& url)
{
    std::lock_guard<std::mutex> lock(mutex_);
    while (!pageRouteStack_.empty()) {
        if (pageRouteStack_.back().url == url) {
            break;
        }
        OnPageDestroy(pageRouteStack_.back().pageId);
        pageMap_.erase(pageRouteStack_.back().pageId);
        pageParamMap_.erase(pageRouteStack_.back().pageId);
        ClearAlertCallback(pageRouteStack_.back());
        pageRouteStack_.pop_back();
    }

    if (isRouteStackFull_) {
        isRouteStackFull_ = false;
    }
}

int32_t FrontendDelegateDeclarative::OnPopPageSuccess()
{
    std::lock_guard<std::mutex> lock(mutex_);
    pageMap_.erase(pageRouteStack_.back().pageId);
    pageParamMap_.erase(pageRouteStack_.back().pageId);
    ClearAlertCallback(pageRouteStack_.back());
    pageRouteStack_.pop_back();
    if (isRouteStackFull_) {
        isRouteStackFull_ = false;
    }
    if (!pageRouteStack_.empty()) {
        LOGI("OnPopPageSuccess: pop to page %{private}s", pageRouteStack_.back().url.c_str());
        return pageRouteStack_.back().pageId;
    }
    return INVALID_PAGE_ID;
}

void FrontendDelegateDeclarative::PopPage()
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
            CHECK_NULL_VOID(pipelineContext);
            if (delegate->GetStackSize() == 1) {
                if (delegate->disallowPopLastPage_) {
                    LOGW("Not allow back because this is the last page!");
                    delegate->ProcessRouterTask();
                    return;
                }
                delegate->OnPageHide();
                delegate->OnPageDestroy(delegate->GetRunningPageId());
                delegate->OnPopPageSuccess();
                pipelineContext->Finish();
                return;
            }
            if (!pipelineContext->CanPopPage()) {
                delegate->ResetStagingPage();
                LOGW("router pop run in unexpected process");
                delegate->ProcessRouterTask();
                return;
            }
            delegate->OnPageHide();
            pipelineContext->RemovePageTransitionListener(delegate->pageTransitionListenerId_);
            delegate->pageTransitionListenerId_ = pipelineContext->AddPageTransitionListener(
                [weak, destroyPageId = delegate->GetRunningPageId()](
                    const TransitionEvent& event, const WeakPtr<PageElement>& in, const WeakPtr<PageElement>& out) {
                    auto delegate = weak.Upgrade();
                    if (delegate) {
                        delegate->PopPageTransitionListener(event, destroyPageId);
                    }
                });
            pipelineContext->PopPage();
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::PopPageTransitionListener(const TransitionEvent& event, int32_t destroyPageId)
{
    if (event == TransitionEvent::POP_END) {
        OnPageDestroy(destroyPageId);
        auto pageId = OnPopPageSuccess();
        SetCurrentPage(pageId);
        OnPageShow();
        OnMediaQueryUpdate();
        ProcessRouterTask();
    }
}

void FrontendDelegateDeclarative::RestorePopPage(const RefPtr<JsAcePage>& page, const std::string& url)
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), page, url] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            LOGI("RestorePopPage begin");
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
            CHECK_NULL_VOID(pipelineContext);
            if (delegate->GetStackSize() == 1) {
                if (delegate->disallowPopLastPage_) {
                    LOGW("Not allow back because this is the last page!");
                    delegate->ProcessRouterTask();
                    return;
                }
                delegate->OnPageHide();
                delegate->OnPageDestroy(delegate->GetRunningPageId());
                delegate->OnPopPageSuccess();
                pipelineContext->Finish();
                return;
            }
            delegate->OnPageHide();
            pipelineContext->RemovePageTransitionListener(delegate->pageTransitionListenerId_);
            delegate->pageTransitionListenerId_ = pipelineContext->AddPageTransitionListener(
                [weak, url, page](
                    const TransitionEvent& event, const WeakPtr<PageElement>& in, const WeakPtr<PageElement>& out) {
                    auto delegate = weak.Upgrade();
                    if (delegate) {
                        delegate->RestorePageTransitionListener(event, url, page);
                    }
                });
            pipelineContext->RestorePopPage(page->BuildPage(url));
            delegate->isStagingPageExist_ = false;
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::RestorePageTransitionListener(
    const TransitionEvent& event, const std::string& url, const RefPtr<JsAcePage>& page)
{
    if (event == TransitionEvent::PUSH_END) {
        LOGI("RestorePageTransitionListener %{public}s", url.c_str());
        OnPopToPageSuccess(url);
        {
            std::lock_guard<std::mutex> lock(mutex_);
            AddPageLocked(page);
            pageRouteStack_.back().isRestore = false;
        }
        SetCurrentPage(GetPageIdByUrl(url));
        OnPageShow();
        OnMediaQueryUpdate();
        ProcessRouterTask();
    }
}

int32_t FrontendDelegateDeclarative::OnClearInvisiblePagesSuccess()
{
    std::lock_guard<std::mutex> lock(mutex_);
    PageInfo pageInfo = std::move(pageRouteStack_.back());
    pageRouteStack_.pop_back();
    for (const auto& info : pageRouteStack_) {
        ClearAlertCallback(info);
        OnPageDestroy(info.pageId);
        pageMap_.erase(info.pageId);
        pageParamMap_.erase(info.pageId);
    }
    pageRouteStack_.clear();
    int32_t resPageId = pageInfo.pageId;
    pageRouteStack_.emplace_back(std::move(pageInfo));
    if (isRouteStackFull_) {
        isRouteStackFull_ = false;
    }
    return resPageId;
}

void FrontendDelegateDeclarative::ClearInvisiblePages()
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
            CHECK_NULL_VOID(pipelineContext);
            if (pipelineContext->ClearInvisiblePages([weak]() {
                    auto delegate = weak.Upgrade();
                    if (!delegate) {
                        return;
                    }
                    delegate->ProcessRouterTask();
                })) {
                auto pageId = delegate->OnClearInvisiblePagesSuccess();
                delegate->SetCurrentPage(pageId);
            } else {
                delegate->ProcessRouterTask();
            }
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::OnReplacePageSuccess(const RefPtr<JsAcePage>& page, const std::string& url)
{
    if (!page) {
        return;
    }
    std::lock_guard<std::mutex> lock(mutex_);
    AddPageLocked(page);
    if (!pageRouteStack_.empty()) {
        pageMap_.erase(pageRouteStack_.back().pageId);
        pageParamMap_.erase(pageRouteStack_.back().pageId);
        ClearAlertCallback(pageRouteStack_.back());
        pageRouteStack_.pop_back();
    }
    pageRouteStack_.emplace_back(PageInfo { page->GetPageId(), url });
    if (singlePageId_ != INVALID_PAGE_ID) {
        RecycleSinglePage();
    }
}

void FrontendDelegateDeclarative::ReplacePage(const RefPtr<JsAcePage>& page, const std::string& url)
{
    LOGI("ReplacePage url = %{private}s", url.c_str());
    // Pop all JS command and execute them in UI thread.
    auto jsCommands = std::make_shared<std::vector<RefPtr<JsCommand>>>();
    page->PopAllCommands(*jsCommands);

    auto pipelineContext = pipelineContextHolder_.Get();
    page->SetPipelineContext(pipelineContext);
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), page, url, jsCommands] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(delegate->pipelineContextHolder_.Get());
            CHECK_NULL_VOID(pipelineContext);
            // Flush all JS commands.
            for (const auto& command : *jsCommands) {
                command->Execute(page);
            }
            // Just clear all dirty nodes.
            page->ClearAllDirtyNodes();
            page->GetDomDocument()->HandleComponentPostBinding();
            pipelineContext->GetAccessibilityManager()->HandleComponentPostBinding();
            if (pipelineContext->CanReplacePage()) {
                delegate->OnPageHide();
                delegate->OnPageDestroy(delegate->GetRunningPageId());
                delegate->OnPrePageChange(page);
                if (delegate->singlePageId_ != INVALID_PAGE_ID) {
                    pipelineContext->SetSinglePageId(delegate->singlePageId_);
                }
                pipelineContext->ReplacePage(page->BuildPage(url), page->GetStageElement(), [weak, page, url]() {
                    auto delegate = weak.Upgrade();
                    if (!delegate) {
                        return;
                    }
                    delegate->OnReplacePageSuccess(page, url);
                    delegate->SetCurrentPage(page->GetPageId());
                    delegate->OnPageShow();
                    delegate->OnMediaQueryUpdate();
                    delegate->ProcessRouterTask();
                });
            } else {
                // This page has been loaded but become useless now, the corresponding js instance
                // must be destroyed to avoid memory leak.
                LOGW("replace run in unexpected process");
                delegate->OnPageDestroy(page->GetPageId());
                delegate->ResetStagingPage();
                delegate->ProcessRouterTask();
            }
            delegate->isStagingPageExist_ = false;
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::ReplacePageInSubStage(const RefPtr<JsAcePage>& page, const std::string& url)
{
    LOGI("ReplacePageInSubStage url = %{private}s", url.c_str());
    auto pipelineContext = pipelineContextHolder_.Get();
    page->SetPipelineContext(pipelineContext);
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), page, url] {
            auto delegate = weak.Upgrade();
            if (!delegate) {
                return;
            }
            auto pipelineContext = AceType::DynamicCast<PipelineContext>(page->GetPipelineContext().Upgrade());
            if (!pipelineContext) {
                LOGE("pipelineContext is null");
                return;
            }
            auto stageElement = page->GetStageElement();
            if (!stageElement) {
                LOGE("stageElement is null");
                return;
            }

            if (stageElement->GetChildren().empty()) {
                delegate->OnPrePageChange(page);
                pipelineContext->RemovePageTransitionListener(delegate->pageTransitionListenerId_);
                delegate->pageTransitionListenerId_ = pipelineContext->AddPageTransitionListener(
                    [weak, page](
                        const TransitionEvent& event, const WeakPtr<PageElement>& in, const WeakPtr<PageElement>& out) {
                        auto delegate = weak.Upgrade();
                        if (delegate) {
                            delegate->PushPageTransitionListener(event, page);
                        }
                    });
                pipelineContext->PushPage(page->BuildPage(url), page->GetStageElement());
                delegate->isStagingPageExist_ = false;
                return;
            }

            if (stageElement->CanReplacePage()) {
                delegate->OnPageHide();
                delegate->OnPageDestroy(delegate->GetRunningPageId());
                delegate->OnPrePageChange(page);
                stageElement->Replace(page->BuildPage(url), [weak, page, url]() {
                    auto delegate = weak.Upgrade();
                    if (!delegate) {
                        return;
                    }
                    delegate->OnReplacePageSuccess(page, url);
                    delegate->SetCurrentPage(page->GetPageId());
                    delegate->OnPageShow();
                    delegate->OnMediaQueryUpdate();
                    delegate->ProcessRouterTask();
                });
            } else {
                // This page has been loaded but become useless now, the corresponding js instance
                // must be destroyed to avoid memory leak.
                LOGW("replace run in unexpected process");
                delegate->OnPageDestroy(page->GetPageId());
                delegate->ResetStagingPage();
                delegate->ProcessRouterTask();
            }
            delegate->isStagingPageExist_ = false;
        },
        TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::LoadReplacePage(int32_t pageId, const PageTarget& target, const std::string& params)
{
    LOGI("FrontendDelegateDeclarative LoadReplacePage[%{private}d]: %{private}s.", pageId, target.url.c_str());
    if (pageId == INVALID_PAGE_ID) {
        LOGW("FrontendDelegateDeclarative, invalid page id");
        EventReport::SendPageRouterException(PageRouterExcepType::REPLACE_PAGE_ERR, target.url);
        ProcessRouterTask();
        return;
    }
    {
        std::lock_guard<std::mutex> lock(mutex_);
        pageId_ = pageId;
        pageParamMap_[pageId] = params;
    }
    auto document = AceType::MakeRefPtr<DOMDocument>(pageId);
    auto page = AceType::MakeRefPtr<JsAcePage>(pageId, document, target.url, target.container);
    page->SetSubStage(target.useSubStage);
    if (isStagingPageExist_ && !page->GetSubStageFlag()) {
        LOGW("FrontendDelegateDeclarative, replace page failed, waiting for current page loading finish.");
        EventReport::SendPageRouterException(PageRouterExcepType::REPLACE_PAGE_ERR, target.url);
        ProcessRouterTask();
        return;
    }

    singlePageId_ = INVALID_PAGE_ID;
    if (target.routerMode == RouterMode::SINGLE) {
        singlePageId_ = GetPageIdByUrl(target.url);
        LOGI("single page id = %{public}d", singlePageId_);
    }

    isStagingPageExist_ = true;
    page->SetPageParams(params);
    taskExecutor_->PostTask(
        [page, weak = AceType::WeakClaim(this)] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->loadJs_(page->GetUrl(), page, false);
                if (page->GetSubStageFlag()) {
                    page->FireDeclarativeOnPageAppearCallback();
                    delegate->ReplacePageInSubStage(page, page->GetUrl());
                } else {
                    delegate->ReplacePage(page, page->GetUrl());
                }
            }
        },
        TaskExecutor::TaskType::JS);
}

void FrontendDelegateDeclarative::SetColorMode(ColorMode colorMode)
{
    OnMediaQueryUpdate();
}

void FrontendDelegateDeclarative::RebuildAllPages()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        auto url = pageRouterManager_->GetCurrentPageUrl();
        pageRouterManager_->Clear();
        pageRouterManager_->RunPage(url, "");
        return;
    }
    std::unordered_map<int32_t, RefPtr<JsAcePage>> pages;
    {
        std::lock_guard<std::mutex> lock(mutex_);
        pages.insert(pageMap_.begin(), pageMap_.end());
    }
    for (const auto& [pageId, page] : pages) {
        page->FireDeclarativeOnPageRefreshCallback();
        TriggerPageUpdate(page->GetPageId(), true);
    }
}

void FrontendDelegateDeclarative::OnPageShow()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        auto pageNode = pageRouterManager_->GetCurrentPageNode();
        CHECK_NULL_VOID(pageNode);
        auto pagePattern = pageNode->GetPattern<NG::PagePattern>();
        CHECK_NULL_VOID(pagePattern);
        pagePattern->OnShow();
        return;
    }

    auto pageId = GetRunningPageId();
    auto page = GetPage(pageId);
    if (page) {
        page->FireDeclarativeOnPageAppearCallback();
    }
    FireAsyncEvent("_root", std::string("\"viewappear\",null,null"), std::string(""));
}

void FrontendDelegateDeclarative::OnPageHide()
{
    if (Container::IsCurrentUseNewPipeline()) {
        CHECK_NULL_VOID(pageRouterManager_);
        auto pageNode = pageRouterManager_->GetCurrentPageNode();
        CHECK_NULL_VOID(pageNode);
        auto pagePattern = pageNode->GetPattern<NG::PagePattern>();
        CHECK_NULL_VOID(pagePattern);
        pagePattern->OnHide();
        return;
    }
    auto pageId = GetRunningPageId();
    auto page = GetPage(pageId);
    if (page) {
        page->FireDeclarativeOnPageDisAppearCallback();
    }
    FireAsyncEvent("_root", std::string("\"viewdisappear\",null,null"), std::string(""));
}

void FrontendDelegateDeclarative::ClearAlertCallback(PageInfo pageInfo)
{
    if (pageInfo.alertCallback) {
        // notify to clear js reference
        pageInfo.alertCallback(static_cast<int32_t>(AlertState::RECOVERY));
        pageInfo.alertCallback = nullptr;
    }
}

void FrontendDelegateDeclarative::OnPageDestroy(int32_t pageId)
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), pageId] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->destroyPage_(pageId);
                delegate->RecyclePageId(pageId);
            }
        },
        TaskExecutor::TaskType::JS);
}

int32_t FrontendDelegateDeclarative::GetRunningPageId() const
{
    std::lock_guard<std::mutex> lock(mutex_);
    if (pageRouteStack_.empty()) {
        return INVALID_PAGE_ID;
    }
    return pageRouteStack_.back().pageId;
}

std::string FrontendDelegateDeclarative::GetRunningPageUrl() const
{
    std::lock_guard<std::mutex> lock(mutex_);
    if (pageRouteStack_.empty()) {
        return std::string();
    }
    const auto& pageUrl = pageRouteStack_.back().url;
    auto pos = pageUrl.rfind(".js");
    if (pos == pageUrl.length() - 3) {
        return pageUrl.substr(0, pos);
    }
    return pageUrl;
}

int32_t FrontendDelegateDeclarative::GetPageIdByUrl(const std::string& url, bool& isRestore)
{
    std::lock_guard<std::mutex> lock(mutex_);
    auto pageIter = std::find_if(std::rbegin(pageRouteStack_), std::rend(pageRouteStack_),
        [&url](const PageInfo& pageRoute) { return url == pageRoute.url; });
    if (pageIter != std::rend(pageRouteStack_)) {
        LOGD("GetPageIdByUrl pageId=%{private}d url=%{private}s", pageIter->pageId, url.c_str());
        isRestore = pageIter->isRestore;
        return pageIter->pageId;
    }
    return INVALID_PAGE_ID;
}

RefPtr<JsAcePage> FrontendDelegateDeclarative::GetPage(int32_t pageId) const
{
    std::lock_guard<std::mutex> lock(mutex_);
    auto itPage = pageMap_.find(pageId);
    if (itPage == pageMap_.end()) {
        LOGE("the page is not in the map");
        return nullptr;
    }
    return itPage->second;
}

void FrontendDelegateDeclarative::RegisterFont(const std::string& familyName, const std::string& familySrc)
{
    pipelineContextHolder_.Get()->RegisterFont(familyName, familySrc);
}

void FrontendDelegateDeclarative::HandleImage(
    const std::string& src, std::function<void(bool, int32_t, int32_t)>&& callback)
{
    LOGW("Not implement in declarative frontend.");
}

void FrontendDelegateDeclarative::PushJsCallbackToRenderNode(
    NodeId id, double ratio, std::function<void(bool, double)>&& callback)
{
    LOGW("Not implement in declarative frontend.");
}

void FrontendDelegateDeclarative::RequestAnimationFrame(const std::string& callbackId)
{
    CancelableCallback<void()> cancelableTask;
    cancelableTask.Reset([callbackId, call = requestAnimationCallback_, weak = AceType::WeakClaim(this)] {
        auto delegate = weak.Upgrade();
        if (delegate && call) {
            call(callbackId, delegate->GetSystemRealTime());
        }
    });
    animationFrameTaskMap_.try_emplace(callbackId, cancelableTask);
    animationFrameTaskIds_.emplace(callbackId);
}

uint64_t FrontendDelegateDeclarative::GetSystemRealTime()
{
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    return ts.tv_sec * TO_MILLI + ts.tv_nsec / NANO_TO_MILLI;
}

void FrontendDelegateDeclarative::CancelAnimationFrame(const std::string& callbackId)
{
    auto animationTaskIter = animationFrameTaskMap_.find(callbackId);
    if (animationTaskIter != animationFrameTaskMap_.end()) {
        animationTaskIter->second.Cancel();
        animationFrameTaskMap_.erase(animationTaskIter);
    } else {
        LOGW("cancelAnimationFrame callbackId not found");
    }
}

void FrontendDelegateDeclarative::FlushAnimationTasks()
{
    while (!animationFrameTaskIds_.empty()) {
        const auto& callbackId = animationFrameTaskIds_.front();
        if (!callbackId.empty()) {
            auto taskIter = animationFrameTaskMap_.find(callbackId);
            if (taskIter != animationFrameTaskMap_.end()) {
                taskExecutor_->PostTask(taskIter->second, TaskExecutor::TaskType::JS);
            }
        }
        animationFrameTaskIds_.pop();
    }
}

SingleTaskExecutor FrontendDelegateDeclarative::GetAnimationJsTask()
{
    return SingleTaskExecutor::Make(taskExecutor_, TaskExecutor::TaskType::JS);
}

SingleTaskExecutor FrontendDelegateDeclarative::GetUiTask()
{
    return SingleTaskExecutor::Make(taskExecutor_, TaskExecutor::TaskType::UI);
}

void FrontendDelegateDeclarative::AttachPipelineContext(const RefPtr<PipelineBase>& context)
{
    if (!context) {
        return;
    }
    context->SetOnPageShow([weak = AceType::WeakClaim(this)] {
        auto delegate = weak.Upgrade();
        if (delegate) {
            delegate->OnPageShow();
        }
    });
    context->SetAnimationCallback([weak = AceType::WeakClaim(this)] {
        auto delegate = weak.Upgrade();
        if (delegate) {
            delegate->FlushAnimationTasks();
        }
    });
    pipelineContextHolder_.Attach(context);
    jsAccessibilityManager_->SetPipelineContext(context);
    jsAccessibilityManager_->InitializeCallback();
}

RefPtr<PipelineBase> FrontendDelegateDeclarative::GetPipelineContext()
{
    return pipelineContextHolder_.Get();
}

std::string FrontendDelegateDeclarative::RestoreRouterStack(const std::string& contentInfo)
{
    LOGI("FrontendDelegateDeclarative::RestoreRouterStack: contentInfo = %{public}s", contentInfo.c_str());
    auto jsonContentInfo = JsonUtil::ParseJsonString(contentInfo);
    if (!jsonContentInfo->IsValid() || !jsonContentInfo->IsObject()) {
        LOGW("restore contentInfo is invalid");
        return "";
    }
    // restore node info
    auto jsonNodeInfo = jsonContentInfo->GetValue("nodeInfo");
    auto pipelineContext = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    CHECK_NULL_RETURN(pipelineContext, "");
    pipelineContext->RestoreNodeInfo(std::move(jsonNodeInfo));
    // restore stack info
    std::lock_guard<std::mutex> lock(mutex_);
    auto routerStack = jsonContentInfo->GetValue("stackInfo");
    if (!routerStack->IsValid() || !routerStack->IsArray()) {
        LOGW("restore router stack is invalid");
        return "";
    }
    int32_t stackSize = routerStack->GetArraySize();
    if (stackSize < 1) {
        LOGW("restore stack size is invalid");
        return "";
    }
    for (int32_t index = 0; index < stackSize - 1; ++index) {
        std::string url = routerStack->GetArrayItem(index)->ToString();
        // remove 2 useless character, as "XXX" to XXX
        pageRouteStack_.emplace_back(PageInfo { GenerateNextPageId(), url.substr(1, url.size() - 2), true });
    }
    std::string startUrl = routerStack->GetArrayItem(stackSize - 1)->ToString();
    // remove 5 useless character, as "XXX.js" to XXX
    return startUrl.substr(1, startUrl.size() - 5);
}

std::string FrontendDelegateDeclarative::GetContentInfo()
{
    auto jsonContentInfo = JsonUtil::Create(true);

    {
        std::lock_guard<std::mutex> lock(mutex_);
        auto jsonRouterStack = JsonUtil::CreateArray(false);
        for (size_t index = 0; index < pageRouteStack_.size(); ++index) {
            jsonRouterStack->Put("", pageRouteStack_[index].url.c_str());
        }
        jsonContentInfo->Put("stackInfo", jsonRouterStack);
    }

    auto pipelineContext = AceType::DynamicCast<PipelineContext>(pipelineContextHolder_.Get());
    CHECK_NULL_RETURN(pipelineContext, jsonContentInfo->ToString());
    jsonContentInfo->Put("nodeInfo", pipelineContext->GetStoredNodeInfo());

    return jsonContentInfo->ToString();
}

} // namespace OHOS::Ace::Framework
