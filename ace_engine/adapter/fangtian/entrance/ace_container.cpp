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

#include "adapter/fangtian/entrance/ace_container.h"

#include <functional>

#include "wm/window.h"
#include <ui/rs_surface_node.h>
#include <ui/rs_ui_director.h>
#include "flutter/lib/ui/ui_dart_state.h"
#include "adapter/fangtian/entrance/rs_dir_asset_provider.h"
#include "adapter/fangtian/entrance/dir_asset_provider.h"
#include "core/common/rosen/rosen_asset_manager.h"
#include "core/common/flutter/flutter_asset_manager.h"
#include "core/common/flutter/flutter_task_executor.h"

#include "adapter/fangtian/entrance/ace_application_info.h"
#include "adapter/fangtian/osal/stage_card_parser.h"
#include "base/log/ace_trace.h"
#include "base/log/event_report.h"
#include "base/log/log.h"
#include "base/utils/system_properties.h"
#include "base/utils/utils.h"
#include "bridge/card_frontend/card_frontend.h"
#include "bridge/card_frontend/card_frontend_declarative.h"
#include "bridge/card_frontend/form_frontend_declarative.h"
#include "bridge/common/utils/engine_helper.h"
#include "bridge/declarative_frontend/declarative_frontend.h"
#include "bridge/js_frontend/engine/common/js_engine_loader.h"
#include "bridge/js_frontend/js_frontend.h"
#include "core/common/ace_engine.h"
#include "core/common/ace_view.h"
#include "core/common/container_scope.h"
#include "core/common/platform_bridge.h"
#include "core/common/platform_window.h"
#include "core/common/text_field_manager.h"
#include "core/common/window.h"
#include "core/components/theme/app_theme.h"
#include "core/components/theme/theme_constants.h"
#include "core/components/theme/theme_manager_impl.h"
#include "core/components_ng/pattern/text_field/text_field_manager.h"
#include "core/components_ng/render/adapter/rosen_window.h"
//#include "core/components_ng/render/adapter/window_prviewer.h"
#include "core/pipeline/base/element.h"
#include "core/pipeline/pipeline_context.h"
#include "core/pipeline_ng/pipeline_context.h"
#include "adapter/fangtian/entrance/ace_new_pipe_judgement.h"

namespace OHOS::Ace::Platform {
namespace {
const char LANGUAGE_TAG[] = "language";
const char COUNTRY_TAG[] = "countryOrRegion";
const char DIRECTION_TAG[] = "dir";
const char UNICODE_SETTING_TAG[] = "unicodeSetting";
const char LOCALE_DIR_LTR[] = "ltr";
const char LOCALE_DIR_RTL[] = "rtl";
const char LOCALE_KEY[] = "locale";
} // namespace

std::once_flag AceContainer::onceFlag_;

AceContainer::AceContainer(int32_t instanceId, FrontendType type, RefPtr<Context> context)
    : instanceId_(instanceId), messageBridge_(AceType::MakeRefPtr<PlatformBridge>()), type_(type), context_(context)
{
    ThemeConstants::InitDeviceType();

    auto state = flutter::UIDartState::Current()->GetStateById(instanceId);
    auto taskExecutor = Referenced::MakeRefPtr<FlutterTaskExecutor>(state->GetTaskRunners());
    if (type_ != FrontendType::DECLARATIVE_JS && type_ != FrontendType::ETS_CARD) {
       taskExecutor->InitJsThread();
    }

    taskExecutor_ = taskExecutor;
}

void AceContainer::Initialize()
{
    ContainerScope scope(instanceId_);
    auto stageContext = AceType::DynamicCast<StageContext>(context_);
    auto faContext = AceType::DynamicCast<FaContext>(context_);
    bool useNewPipe = true;
    if (type_ != FrontendType::DECLARATIVE_JS && type_ != FrontendType::ETS_CARD) {
        useNewPipe = false;
    } else if (stageContext) {
        auto appInfo = stageContext->GetAppInfo();
        CHECK_NULL_VOID(appInfo);
        auto hapModuleInfo = stageContext->GetHapModuleInfo();
        CHECK_NULL_VOID(hapModuleInfo);
        auto compatibleVersion = appInfo->GetMinAPIVersion();
        auto targetVersion = appInfo->GetTargetAPIVersion();
        auto releaseType = appInfo->GetApiReleaseType();
        labelId_ = hapModuleInfo->GetLabelId();
        bool enablePartialUpdate = hapModuleInfo->GetPartialUpdateFlag();
        // only app should have menubar, card don't need
        if (type_ == FrontendType::DECLARATIVE_JS) {
            installationFree_ = appInfo->IsInstallationFree();
        }
        useNewPipe = AceNewPipeJudgement::QueryAceNewPipeEnabledStage("", compatibleVersion, targetVersion,
            releaseType, !enablePartialUpdate);
    } else if (faContext) {
        auto appInfo = faContext->GetAppInfo();
        CHECK_NULL_VOID(appInfo);
        auto compatibleVersion = appInfo->GetMinAPIVersion();
        auto targetVersion = appInfo->GetTargetAPIVersion();
        auto releaseType = appInfo->GetApiReleaseType();
        useNewPipe = AceNewPipeJudgement::QueryAceNewPipeEnabledFA("", compatibleVersion, targetVersion, releaseType);
    }
    LOGI("Using %{public}s pipeline context ...", (useNewPipe ? "new" : "old"));
    if (useNewPipe) {
        SetUseNewPipeline();
    }
    if (type_ != FrontendType::DECLARATIVE_JS && type_ != FrontendType::ETS_CARD) {
        InitializeFrontend();
    }
}

void AceContainer::Destroy()
{
    ContainerScope scope(instanceId_);
    LOGI("AceContainer::Destroy begin");
    if (!pipelineContext_) {
        LOGE("no context find in %{private}d container", instanceId_);
        return;
    }
    if (!taskExecutor_) {
        LOGE("no taskExecutor find in %{private}d container", instanceId_);
        return;
    }
    auto weak = AceType::WeakClaim(AceType::RawPtr(pipelineContext_));
    taskExecutor_->PostTask(
        [weak]() {
            auto context = weak.Upgrade();
            if (context == nullptr) {
                LOGE("context is nullptr");
                return;
            }
            context->Destroy();
        },
        TaskExecutor::TaskType::UI);

    RefPtr<Frontend> frontend;
    frontend_.Swap(frontend);
    if (frontend && taskExecutor_) {
        taskExecutor_->PostTask(
            [frontend]() {
                frontend->UpdateState(Frontend::State::ON_DESTROY);
                frontend->Destroy();
            },
            TaskExecutor::TaskType::JS);
    }

    messageBridge_.Reset();
    resRegister_.Reset();
    assetManager_.Reset();
    pipelineContext_.Reset();
    aceView_ = nullptr;
    LOGI("AceContainer::Destroy end");
}

void AceContainer::DestroyView()
{
    if (aceView_ != nullptr) {
        delete aceView_;
        aceView_ = nullptr;
    }
}

void AceContainer::InitializeFrontend()
{
    if (type_ == FrontendType::JS) {
        frontend_ = Frontend::Create();
        auto jsFrontend = AceType::DynamicCast<JsFrontend>(frontend_);
        auto jsEngine = Framework::JsEngineLoader::Get().CreateJsEngine(GetInstanceId());
        EngineHelper::AddEngine(instanceId_, jsEngine);
        jsFrontend->SetJsEngine(jsEngine);
        jsFrontend->SetNeedDebugBreakPoint(AceApplicationInfo::GetInstance().IsNeedDebugBreakPoint());
        jsFrontend->SetDebugVersion(AceApplicationInfo::GetInstance().IsDebugVersion());
    } else if (type_ == FrontendType::DECLARATIVE_JS) {
        frontend_ = AceType::MakeRefPtr<DeclarativeFrontend>();
        auto declarativeFrontend = AceType::DynamicCast<DeclarativeFrontend>(frontend_);
        auto jsEngine = Framework::JsEngineLoader::GetDeclarative().CreateJsEngine(instanceId_);
        EngineHelper::AddEngine(instanceId_, jsEngine);
        declarativeFrontend->SetJsEngine(jsEngine);
        declarativeFrontend->SetPageProfile(pageProfile_);
    } else if (type_ == FrontendType::JS_CARD) {
        AceApplicationInfo::GetInstance().SetCardType();
        frontend_ = AceType::MakeRefPtr<CardFrontend>();
    } else if (type_ == FrontendType::ETS_CARD) {
        frontend_ = AceType::MakeRefPtr<FormFrontendDeclarative>();
        auto cardFrontend = AceType::DynamicCast<FormFrontendDeclarative>(frontend_);
        auto jsEngine = Framework::JsEngineLoader::GetDeclarative().CreateJsEngine(instanceId_);
        EngineHelper::AddEngine(instanceId_, jsEngine);
        cardFrontend->SetJsEngine(jsEngine);
        cardFrontend->SetPageProfile(pageProfile_);
        cardFrontend->SetRunningCardId(0);
        cardFrontend->SetIsFormRender(true);
        cardFrontend->SetTaskExecutor(taskExecutor_);
        SetIsFRSCardContainer(true);
    } else {
        LOGE("Frontend type not supported");
        return;
    }
    ACE_DCHECK(frontend_);
    frontend_->DisallowPopLastPage();
    frontend_->Initialize(type_, taskExecutor_);
    if (assetManager_) {
        frontend_->SetAssetManager(assetManager_);
    }
}

void AceContainer::RunNativeEngineLoop()
{
    taskExecutor_->PostTask([frontend = frontend_]() { frontend->RunNativeEngineLoop(); }, TaskExecutor::TaskType::JS);
}

void AceContainer::InitializeStageAppConfig(const std::string& assetPath, bool formsEnabled)
{
    auto stageContext = AceType::DynamicCast<StageContext>(context_);
    CHECK_NULL_VOID(stageContext);
    auto appInfo = stageContext->GetAppInfo();
    CHECK_NULL_VOID(appInfo);
    auto hapModuleInfo = stageContext->GetHapModuleInfo();
    CHECK_NULL_VOID(hapModuleInfo);
    if (pipelineContext_ && !formsEnabled) {
        LOGI("Set MinPlatformVersion to %{public}d", appInfo->GetMinAPIVersion());
        pipelineContext_->SetMinPlatformVersion(appInfo->GetMinAPIVersion());
    }
    auto& bundleName = appInfo->GetBundleName();
    auto& compileMode = hapModuleInfo->GetCompileMode();
    auto& moduleName = hapModuleInfo->GetModuleName();
    bool isBundle = (compileMode != "esmodule");
    auto declarativeFrontend = AceType::DynamicCast<DeclarativeFrontend>(frontend_);
    CHECK_NULL_VOID(declarativeFrontend);
    declarativeFrontend->InitializeModuleSearcher(bundleName, moduleName, assetPath, isBundle);

    auto formFrontend = AceType::DynamicCast<FormFrontendDeclarative>(frontend_);
    CHECK_NULL_VOID(formFrontend);
    formFrontend->SetBundleName(bundleName);
    formFrontend->SetModuleName(moduleName);
    formFrontend->SetIsBundle(isBundle);
}

void AceContainer::SetStageCardConfig(const std::string& pageProfile, const std::string& selectUrl)
{
    std::string fullPageProfile = pageProfile + ".json";
    std::string formConfigs;
    RefPtr<StageCardParser> stageCardParser = AceType::MakeRefPtr<StageCardParser>();
    if (!Framework::GetAssetContentImpl(assetManager_, fullPageProfile, formConfigs)) {
        LOGI("Can not load the form config.");
        return;
    }
    const std::string prefix("./js/");
    stageCardParser->Parse(formConfigs, prefix + selectUrl);
    auto cardFront = static_cast<CardFrontend*>(RawPtr(frontend_));
    if (cardFront) {
        cardFront->SetFormSrc(selectUrl);
        cardFront->SetCardWindowConfig(stageCardParser->GetWindowConfig());
    }
}

void AceContainer::InitializeCallback()
{
    ACE_FUNCTION_TRACE();

    ACE_DCHECK(aceView_ && taskExecutor_ && pipelineContext_);

    auto weak = AceType::WeakClaim(AceType::RawPtr(pipelineContext_));
    auto&& touchEventCallback = [weak, id = instanceId_](
                                    const TouchEvent& event, const std::function<void()>& ignoreMark) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostTask(
            [context, event]() { context->OnTouchEvent(event); }, TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterTouchEventCallback(touchEventCallback);

    auto&& keyEventCallback = [weak, id = instanceId_](const KeyEvent& event) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return false;
        }
        bool result = false;
        context->GetTaskExecutor()->PostSyncTask(
            [context, event, &result]() { result = context->OnKeyEvent(event); }, TaskExecutor::TaskType::UI);
        return result;
    };
    aceView_->RegisterKeyEventCallback(keyEventCallback);

    auto&& mouseEventCallback = [weak, id = instanceId_](
                                    const MouseEvent& event, const std::function<void()>& ignoreMark) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostTask(
            [context, event]() { context->OnMouseEvent(event); }, TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterMouseEventCallback(mouseEventCallback);

    auto&& axisEventCallback = [weak, id = instanceId_](
                                   const AxisEvent& event, const std::function<void()>& ignoreMark) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostTask(
            [context, event]() { context->OnAxisEvent(event); }, TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterAxisEventCallback(axisEventCallback);

    auto&& rotationEventCallback = [weak, id = instanceId_](const RotationEvent& event) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return false;
        }
        bool result = false;
        context->GetTaskExecutor()->PostSyncTask(
            [context, event, &result]() { result = context->OnRotationEvent(event); }, TaskExecutor::TaskType::UI);
        return result;
    };
    aceView_->RegisterRotationEventCallback(rotationEventCallback);

    auto&& cardViewPositionCallback = [weak, instanceId = instanceId_](int id, float offsetX, float offsetY) {
        ContainerScope scope(instanceId);
        auto context = AceType::DynamicCast<PipelineContext>(weak.Upgrade());
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostSyncTask(
            [context, id, offsetX, offsetY]() { context->SetCardViewPosition(id, offsetX, offsetY); },
            TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterCardViewPositionCallback(cardViewPositionCallback);

    auto&& cardViewParamsCallback = [weak, id = instanceId_](const std::string& key, bool focus) {
        ContainerScope scope(id);
        auto context = AceType::DynamicCast<PipelineContext>(weak.Upgrade());
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostSyncTask(
            [context, key, focus]() { context->SetCardViewAccessibilityParams(key, focus); },
            TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterCardViewAccessibilityParamsCallback(cardViewParamsCallback);

    auto&& viewChangeCallback = [weak, id = instanceId_](int32_t width, int32_t height, WindowSizeChangeReason type) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        ACE_SCOPED_TRACE("ViewChangeCallback(%d, %d)", width, height);
        context->GetTaskExecutor()->PostTask(
            [context, width, height, type]() { context->OnSurfaceChanged(width, height, type); },
            TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterViewChangeCallback(viewChangeCallback);

    auto&& densityChangeCallback = [weak, id = instanceId_](double density) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        ACE_SCOPED_TRACE("DensityChangeCallback(%lf)", density);
        context->GetTaskExecutor()->PostTask(
            [context, density]() { context->OnSurfaceDensityChanged(density); }, TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterDensityChangeCallback(densityChangeCallback);

    auto&& systemBarHeightChangeCallback = [weak, id = instanceId_](double statusBar, double navigationBar) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        ACE_SCOPED_TRACE("SystemBarHeightChangeCallback(%lf, %lf)", statusBar, navigationBar);
        context->GetTaskExecutor()->PostTask(
            [context, statusBar, navigationBar]() { context->OnSystemBarHeightChanged(statusBar, navigationBar); },
            TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterSystemBarHeightChangeCallback(systemBarHeightChangeCallback);

    auto&& surfaceDestroyCallback = [weak, id = instanceId_]() {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostTask(
            [context]() { context->OnSurfaceDestroyed(); }, TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterSurfaceDestroyCallback(surfaceDestroyCallback);

    auto&& idleCallback = [weak, id = instanceId_](int64_t deadline) {
        ContainerScope scope(id);
        auto context = weak.Upgrade();
        if (context == nullptr) {
            LOGE("context is nullptr");
            return;
        }
        context->GetTaskExecutor()->PostTask(
            [context, deadline]() { context->OnIdle(deadline); }, TaskExecutor::TaskType::UI);
    };
    aceView_->RegisterIdleCallback(idleCallback);
}

void AceContainer::CreateContainer(int32_t instanceId, FrontendType type, const AceRunArgs& runArgs)
{
    // for ohos container use newPipeline
    SystemProperties::SetExtSurfaceEnabled(!runArgs.containerSdkPath.empty());

    auto context = Context::CreateContext(runArgs.projectModel == ProjectModel::STAGE, runArgs.appResourcesPath);
    auto aceContainer = AceType::MakeRefPtr<AceContainer>(instanceId, type, context);
    AceEngine::Get().AddContainer(aceContainer->GetInstanceId(), aceContainer);
    aceContainer->Initialize();
    ContainerScope scope(instanceId);
    auto front = aceContainer->GetFrontend();
    if (front) {
        front->UpdateState(Frontend::State::ON_CREATE);
        front->SetJsMessageDispatcher(aceContainer);
    }
    auto platMessageBridge = aceContainer->GetMessageBridge();
    platMessageBridge->SetJsMessageDispatcher(aceContainer);
}

void AceContainer::DestroyContainer(int32_t instanceId)
{
    auto container = AceEngine::Get().GetContainer(instanceId);
    if (!container) {
        LOGE("no AceContainer with id %{private}d in AceEngine", instanceId);
        return;
    }
    container->Destroy();
    // unregister watchdog before stop thread to avoid UI_BLOCK report
    AceEngine::Get().UnRegisterFromWatchDog(instanceId);
    auto taskExecutor = container->GetTaskExecutor();
    if (taskExecutor) {
        taskExecutor->PostSyncTask([] { LOGI("Wait UI thread..."); }, TaskExecutor::TaskType::UI);
        taskExecutor->PostSyncTask([] { LOGI("Wait JS thread..."); }, TaskExecutor::TaskType::JS);
    }
    container->DestroyView(); // Stop all threads(ui,gpu,io) for current ability.
    EngineHelper::RemoveEngine(instanceId);
    AceEngine::Get().RemoveContainer(instanceId);
}

bool AceContainer::RunPage(int32_t instanceId, int32_t pageId, const std::string& url, const std::string& params)
{
    ACE_FUNCTION_TRACE();
    auto container = AceEngine::Get().GetContainer(instanceId);
    if (!container) {
        return false;
    }

    ContainerScope scope(instanceId);
    auto front = container->GetFrontend();
    if (front) {
        auto type = front->GetType();
        if ((type == FrontendType::JS) || (type == FrontendType::DECLARATIVE_JS) || (type == FrontendType::JS_CARD) ||
            (type == FrontendType::ETS_CARD)) {
            front->RunPage(pageId, url, params);
            return true;
        } else {
            LOGE("Frontend type not supported when runpage");
            EventReport::SendAppStartException(AppStartExcepType::FRONTEND_TYPE_ERR);
            return false;
        }
    }
    return false;
}

void AceContainer::UpdateResourceConfiguration(const std::string& jsonStr)
{
    ContainerScope scope(instanceId_);
    uint32_t updateFlags = 0;
    auto resConfig = resourceInfo_.GetResourceConfiguration();
    if (!resConfig.UpdateFromJsonString(jsonStr, updateFlags) || !updateFlags) {
        return;
    }
    resourceInfo_.SetResourceConfiguration(resConfig);
    if (ResourceConfiguration::TestFlag(updateFlags, ResourceConfiguration::COLOR_MODE_UPDATED_FLAG)) {
        SystemProperties::SetColorMode(resConfig.GetColorMode());
        if (frontend_) {
            frontend_->SetColorMode(resConfig.GetColorMode());
        }
    }
    if (!pipelineContext_) {
        return;
    }
    auto themeManager = pipelineContext_->GetThemeManager();
    if (!themeManager) {
        return;
    }
    themeManager->UpdateConfig(resConfig);
    taskExecutor_->PostTask(
        [weakThemeManager = WeakPtr<ThemeManager>(themeManager), colorScheme = colorScheme_, config = resConfig,
            weakContext = WeakPtr<PipelineBase>(pipelineContext_)]() {
            auto themeManager = weakThemeManager.Upgrade();
            auto context = weakContext.Upgrade();
            if (!themeManager || !context) {
                return;
            }
            themeManager->LoadResourceThemes();
            themeManager->ParseSystemTheme();
            themeManager->SetColorScheme(colorScheme);
            context->RefreshRootBgColor();
            context->UpdateFontWeightScale();
            context->SetFontScale(config.GetFontRatio());
        },
        TaskExecutor::TaskType::UI);
    if (frontend_) {
        frontend_->RebuildAllPages();
    }
}

void AceContainer::NativeOnConfigurationUpdated(int32_t instanceId)
{
    auto container = GetContainerInstance(instanceId);
    if (!container) {
        return;
    }
    ContainerScope scope(instanceId);
    auto front = container->GetFrontend();
    if (!front) {
        return;
    }

    std::unique_ptr<JsonValue> value = JsonUtil::Create(true);
    value->Put("fontScale", container->GetResourceConfiguration().GetFontRatio());
    value->Put("colorMode", SystemProperties::GetColorMode() == ColorMode::LIGHT ? "light" : "dark");
    auto declarativeFrontend = AceType::DynamicCast<DeclarativeFrontend>(front);
    if (declarativeFrontend) {
        container->UpdateResourceConfiguration(value->ToString());
        declarativeFrontend->OnConfigurationUpdated(value->ToString());
        return;
    }

    std::unique_ptr<JsonValue> localeValue = JsonUtil::Create(false);
    localeValue->Put(LANGUAGE_TAG, AceApplicationInfo::GetInstance().GetLanguage().c_str());
    localeValue->Put(COUNTRY_TAG, AceApplicationInfo::GetInstance().GetCountryOrRegion().c_str());
    localeValue->Put(
        DIRECTION_TAG, AceApplicationInfo::GetInstance().IsRightToLeft() ? LOCALE_DIR_RTL : LOCALE_DIR_LTR);
    localeValue->Put(UNICODE_SETTING_TAG, AceApplicationInfo::GetInstance().GetUnicodeSetting().c_str());
    value->Put(LOCALE_KEY, localeValue);
    front->OnConfigurationUpdated(value->ToString());
}

void AceContainer::Dispatch(
    const std::string& group, std::vector<uint8_t>&& data, int32_t id, bool replyToComponent) const
{}

void AceContainer::FetchResponse(const ResponseData responseData, const int32_t callbackId) const
{
    auto container = AceType::DynamicCast<AceContainer>(AceEngine::Get().GetContainer(0));
    if (!container) {
        LOGE("FetchResponse container is null!");
        return;
    }
    ContainerScope scope(instanceId_);
    auto front = container->GetFrontend();
    auto type = container->GetType();
    if (type == FrontendType::JS) {
        auto jsFrontend = AceType::DynamicCast<JsFrontend>(front);
        if (jsFrontend) {
            jsFrontend->TransferJsResponseDataPreview(callbackId, ACTION_SUCCESS, responseData);
        }
    } else if (type == FrontendType::DECLARATIVE_JS) {
        auto declarativeFrontend = AceType::DynamicCast<DeclarativeFrontend>(front);
        if (declarativeFrontend) {
            declarativeFrontend->TransferJsResponseDataPreview(callbackId, ACTION_SUCCESS, responseData);
        }
    } else {
        LOGE("Frontend type not supported");
        return;
    }
}

void AceContainer::CallCurlFunction(const RequestData requestData, const int32_t callbackId) const
{
    auto container = AceType::DynamicCast<AceContainer>(AceEngine::Get().GetContainer(ACE_INSTANCE_ID));
    if (!container) {
        LOGE("CallCurlFunction container is null!");
        return;
    }

    ContainerScope scope(instanceId_);
    taskExecutor_->PostTask(
        [container, requestData, callbackId]() mutable {
            ResponseData responseData;
            if (FetchManager::GetInstance().Fetch(requestData, callbackId, responseData)) {
                container->FetchResponse(responseData, callbackId);
            }
        },
        TaskExecutor::TaskType::BACKGROUND);
}

void AceContainer::DispatchPluginError(int32_t callbackId, int32_t errorCode, std::string&& errorMessage) const
{
    auto front = GetFrontend();
    if (!front) {
        LOGE("the front jni is nullptr");
        return;
    }

    ContainerScope scope(instanceId_);
    taskExecutor_->PostTask(
        [front, callbackId, errorCode, errorMessage = std::move(errorMessage)]() mutable {
            front->TransferJsPluginGetError(callbackId, errorCode, std::move(errorMessage));
        },
        TaskExecutor::TaskType::BACKGROUND);
}

bool AceContainer::Dump(const std::vector<std::string>& params)
{
    ContainerScope scope(instanceId_);
    if (aceView_ && aceView_->Dump(params)) {
        return true;
    }

    if (pipelineContext_) {
        pipelineContext_->Dump(params);
        return true;
    }
    return false;
}

void AceContainer::AddRouterChangeCallback(int32_t instanceId, const OnRouterChangeCallback& onRouterChangeCallback)
{
    auto container = GetContainerInstance(instanceId);
    if (!container) {
        return;
    }
    ContainerScope scope(instanceId);
    if (!container->pipelineContext_) {
        LOGE("container pipelineContext not init");
        return;
    }
    container->pipelineContext_->AddRouterChangeCallback(onRouterChangeCallback);
}

#ifndef ENABLE_ROSEN_BACKEND
void AceContainer::AddAssetPath(
    int32_t instanceId, const std::string& packagePath, const std::vector<std::string>& paths)
{
    auto container = GetContainerInstance(instanceId);
    CHECK_NULL_VOID(container);

    if (!container->assetManager_) {
        RefPtr<FlutterAssetManager> flutterAssetManager = Referenced::MakeRefPtr<FlutterAssetManager>();
        container->assetManager_ = flutterAssetManager;
        if (container->frontend_) {
            container->frontend_->SetAssetManager(flutterAssetManager);
        }
    }

    for (const auto& path : paths) {
        LOGD("Current path is: %{private}s", path.c_str());
        auto dirAssetProvider = AceType::MakeRefPtr<DirAssetProvider>(
            path, std::make_unique<flutter::DirectoryAssetBundle>(
                      fml::OpenDirectory(path.c_str(), false, fml::FilePermission::kRead)));
        container->assetManager_->PushBack(std::move(dirAssetProvider));
    }
}
#else
void AceContainer::AddAssetPath(
    int32_t instanceId, const std::string& packagePath, const std::vector<std::string>& paths)
{
    auto container = GetContainerInstance(instanceId);
    CHECK_NULL_VOID(container);

    if (!container->assetManager_) {
        RefPtr<RSAssetManager> rsAssetManager = Referenced::MakeRefPtr<RSAssetManager>();
        container->assetManager_ = rsAssetManager;
        if (container->frontend_) {
            container->frontend_->SetAssetManager(rsAssetManager);
        }
    }

    for (const auto& path : paths) {
        LOGD("Current path is: %{private}s", path.c_str());
        auto dirAssetProvider = AceType::MakeRefPtr<RSDirAssetProvider>(path);
        container->assetManager_->PushBack(std::move(dirAssetProvider));
    }
}
#endif

void AceContainer::SetResourcesPathAndThemeStyle(int32_t instanceId, const std::string& systemResourcesPath,
    const std::string& appResourcesPath, const int32_t& themeId, const ColorMode& colorMode)
{
    auto container = GetContainerInstance(instanceId);
    if (!container) {
        return;
    }
    ContainerScope scope(instanceId);
    auto resConfig = container->resourceInfo_.GetResourceConfiguration();
    resConfig.SetColorMode(static_cast<OHOS::Ace::ColorMode>(colorMode));
    container->resourceInfo_.SetResourceConfiguration(resConfig);
    container->resourceInfo_.SetPackagePath(appResourcesPath);
    container->resourceInfo_.SetSystemPackagePath(systemResourcesPath);
    container->resourceInfo_.SetThemeId(themeId);
}

void AceContainer::UpdateDeviceConfig(const DeviceConfig& deviceConfig)
{
    ContainerScope scope(instanceId_);
    SystemProperties::InitDeviceType(deviceConfig.deviceType);
    SystemProperties::SetDeviceOrientation(deviceConfig.orientation == DeviceOrientation::PORTRAIT ? 0 : 1);
    SystemProperties::SetResolution(deviceConfig.density);
    SystemProperties::SetColorMode(deviceConfig.colorMode);
    auto resConfig = resourceInfo_.GetResourceConfiguration();
    if (resConfig.GetDeviceType() == deviceConfig.deviceType &&
        resConfig.GetOrientation() == deviceConfig.orientation && resConfig.GetDensity() == deviceConfig.density &&
        resConfig.GetColorMode() == deviceConfig.colorMode && resConfig.GetFontRatio() == deviceConfig.fontRatio) {
        return;
    } else {
        resConfig.SetDeviceType(deviceConfig.deviceType);
        resConfig.SetOrientation(deviceConfig.orientation);
        resConfig.SetDensity(deviceConfig.density);
        resConfig.SetColorMode(deviceConfig.colorMode);
        resConfig.SetFontRatio(deviceConfig.fontRatio);
        if (frontend_) {
            frontend_->SetColorMode(deviceConfig.colorMode);
        }
    }
    resourceInfo_.SetResourceConfiguration(resConfig);
    if (!pipelineContext_) {
        return;
    }
    auto themeManager = pipelineContext_->GetThemeManager();
    if (!themeManager) {
        return;
    }
    themeManager->UpdateConfig(resConfig);
    taskExecutor_->PostTask(
        [weakThemeManager = WeakPtr<ThemeManager>(themeManager), colorScheme = colorScheme_,
            weakContext = WeakPtr<PipelineBase>(pipelineContext_)]() {
            auto themeManager = weakThemeManager.Upgrade();
            auto context = weakContext.Upgrade();
            if (!themeManager || !context) {
                return;
            }
            themeManager->LoadResourceThemes();
            themeManager->ParseSystemTheme();
            themeManager->SetColorScheme(colorScheme);
            context->RefreshRootBgColor();
        },
        TaskExecutor::TaskType::UI);
}

void AceContainer::SetView(RSAceView* view, double density, int32_t width, int32_t height,
    OHOS::sptr<OHOS::Rosen::Window> ftWindow, SendRenderDataCallback onRender)
{
    CHECK_NULL_VOID(view);
    auto container = AceType::DynamicCast<AceContainer>(AceEngine::Get().GetContainer(view->GetInstanceId()));
    CHECK_NULL_VOID(container);
    container->SetWindow(ftWindow);
    auto taskExecutor = container->GetTaskExecutor();
    CHECK_NULL_VOID(taskExecutor);
    std::unique_ptr<Window> window = std::make_unique<NG::RosenWindow>(ftWindow, taskExecutor, view->GetInstanceId());
    container->AttachView(std::move(window), view, density, width, height, onRender);
    taskExecutor->PostSyncTask(
        [container]() {
            auto pipelineContext = container->GetPipelineContext();
            CHECK_NULL_VOID(pipelineContext);
            pipelineContext->ShowContainerTitle(true);
        },
        TaskExecutor::TaskType::UI);
}

void AceContainer::InitWindowCallback()
{
    LOGD("AceContainer InitWindowCallback");
    if (windowModal_ == WindowModal::CONTAINER_MODAL && pipelineContext_) {
        auto& windowManager = pipelineContext_->GetWindowManager();
        windowManager->SetAppIconId(0x1000001); // 0x1000001 is icon's id
        windowManager->SetWindowMinimizeCallBack([window = window_]() { window->Minimize(); });
        windowManager->SetWindowMaximizeCallBack([window = window_]() { window->Maximize(); });
        windowManager->SetWindowRecoverCallBack([window = window_]() { window->Recover(); });
        windowManager->SetWindowCloseCallBack([window = window_]() { window->Close(); });
        windowManager->SetWindowStartMoveCallBack([window = window_]() { window->StartMove(); });
        windowManager->SetWindowGetModeCallBack(
            [window = window_]() -> WindowMode { return static_cast<WindowMode>(window->GetMode()); });
    }

    pipelineContext_->SetGetWindowRectImpl([window = window_]() -> Rect {
        Rect rect;
        CHECK_NULL_RETURN_NOLOG(window, rect);
        auto windowRect = window->GetRect();
        rect.SetRect(windowRect.posX_, windowRect.posY_, windowRect.width_, windowRect.height_);
        return rect;
    });
}

void AceContainer::AttachView(std::unique_ptr<Window> window, RSAceView* view, double density, int32_t width,
    int32_t height, SendRenderDataCallback onRender)
{
    ContainerScope scope(instanceId_);
    aceView_ = view;
    auto instanceId = aceView_->GetInstanceId();

    //auto state = flutter::UIDartState::Current()->GetStateById(instanceId);
    // ACE_DCHECK(state != nullptr);
    auto rsTaskExecutor = AceType::DynamicCast<FlutterTaskExecutor>(taskExecutor_);
    //rsTaskExecutor->InitOtherThreads(state->GetTaskRunners());
    if (type_ == FrontendType::DECLARATIVE_JS || type_ == FrontendType::ETS_CARD) {
        // For DECLARATIVE_JS frontend display UI in JS thread temporarily.
        rsTaskExecutor->InitJsThread(false);
        InitializeFrontend();
        auto front = GetFrontend();
        if (front) {
            front->UpdateState(Frontend::State::ON_CREATE);
            front->SetJsMessageDispatcher(AceType::Claim(this));
        }
    }
    resRegister_ = aceView_->GetPlatformResRegister();
    if (useNewPipeline_) {
        LOGI("New pipeline version creating...");
        pipelineContext_ = AceType::MakeRefPtr<NG::PipelineContext>(
            std::move(window), taskExecutor_, assetManager_, resRegister_, frontend_, instanceId);
        pipelineContext_->SetTextFieldManager(AceType::MakeRefPtr<NG::TextFieldManagerNG>());
    } else {
        pipelineContext_ = AceType::MakeRefPtr<PipelineContext>(
            std::move(window), taskExecutor_, assetManager_, resRegister_, frontend_, instanceId);
        pipelineContext_->SetTextFieldManager(AceType::MakeRefPtr<TextFieldManager>());
    }
    pipelineContext_->SetRootSize(density, width, height);
    pipelineContext_->SetIsRightToLeft(AceApplicationInfo::GetInstance().IsRightToLeft());
    pipelineContext_->SetMessageBridge(messageBridge_);
    pipelineContext_->SetWindowModal(windowModal_);
    pipelineContext_->SetDrawDelegate(aceView_->GetDrawDelegate());
    pipelineContext_->SetIsJsCard(type_ == FrontendType::JS_CARD);

    InitWindowCallback();

    if (installationFree_) {
        LOGD("installationFree:%{public}d, labelId:%{public}d", installationFree_, labelId_);
        pipelineContext_->SetInstallationFree(installationFree_);
        pipelineContext_->SetAppLabelId(labelId_);
    }
    pipelineContext_->OnShow();
    InitializeCallback();

    auto cardFrontend = AceType::DynamicCast<FormFrontendDeclarative>(frontend_);
    if (cardFrontend) {
        cardFrontend->SetLoadCardCallBack(WeakPtr<PipelineBase>(pipelineContext_));
    }

    ThemeConstants::InitDeviceType();
    // Only init global resource here, construct theme in UI thread
    auto themeManager = AceType::MakeRefPtr<ThemeManagerImpl>();
    if (themeManager) {
        pipelineContext_->SetThemeManager(themeManager);
        // Init resource, load theme map.
        themeManager->InitResource(resourceInfo_);
        themeManager->LoadSystemTheme(resourceInfo_.GetThemeId());
        taskExecutor_->PostTask(
            [themeManager, assetManager = assetManager_, colorScheme = colorScheme_, aceView = aceView_]() {
                themeManager->ParseSystemTheme();
                themeManager->SetColorScheme(colorScheme);
                themeManager->LoadCustomTheme(assetManager);
                // get background color from theme
                aceView->SetBackgroundColor(themeManager->GetBackgroundColor());
            },
            TaskExecutor::TaskType::UI);
    }

    taskExecutor_->PostTask(
        [pipelineContext = AceType::DynamicCast<PipelineContext>(pipelineContext_), onRender, this]() {
            CHECK_NULL_VOID(pipelineContext);
            auto director = Rosen::RSUIDirector::Create();
            if (director == nullptr) {
                return;
            }

            struct Rosen::RSSurfaceNodeConfig rsSurfaceNodeConfig = {
                .SurfaceNodeName = "preview_surface",
                .onRender = onRender,
            };
            static auto snode = Rosen::RSSurfaceNode::Create(rsSurfaceNodeConfig);
            director->SetRSSurfaceNode(snode);

            auto func = [taskExecutor = taskExecutor_, id = instanceId_](const std::function<void()>& task) {
                ContainerScope scope(id);
                taskExecutor->PostTask(task, TaskExecutor::TaskType::UI);
            };
            director->SetUITaskRunner(func);

            director->Init();
            pipelineContext->SetRSUIDirector(director);
            LOGI("Init Rosen Backend");
        },
        TaskExecutor::TaskType::UI);

    auto weak = AceType::WeakClaim(AceType::RawPtr(pipelineContext_));
    taskExecutor_->PostTask(
        [weak]() {
            auto context = weak.Upgrade();
            if (context == nullptr) {
                LOGE("context is nullptr");
                return;
            }
            context->SetupRootElement();
        },
        TaskExecutor::TaskType::UI);
    aceView_->Launch();

    frontend_->AttachPipelineContext(pipelineContext_);
    auto cardFronted = AceType::DynamicCast<CardFrontend>(frontend_);
    if (cardFronted) {
        cardFronted->SetDensity(static_cast<double>(density));
        taskExecutor_->PostTask(
            [weak, width, height]() {
                auto context = weak.Upgrade();
                if (context == nullptr) {
                    LOGE("context is nullptr");
                    return;
                }
                context->OnSurfaceChanged(width, height);
            },
            TaskExecutor::TaskType::UI);
    }

    AceEngine::Get().RegisterToWatchDog(instanceId, taskExecutor_, GetSettings().useUIAsJSThread);
}

void AceContainer::InitDeviceInfo(int32_t instanceId, const AceRunArgs& runArgs)
{
    ContainerScope scope(instanceId);
    SystemProperties::InitDeviceInfo(runArgs.deviceWidth, runArgs.deviceHeight,
        runArgs.deviceConfig.orientation == DeviceOrientation::PORTRAIT ? 0 : 1, runArgs.deviceConfig.density,
        runArgs.isRound);
    SystemProperties::InitDeviceType(runArgs.deviceConfig.deviceType);
    SystemProperties::SetColorMode(runArgs.deviceConfig.colorMode);
    auto container = GetContainerInstance(instanceId);
    if (!container) {
        LOGE("container is null, AceContainer::InitDeviceInfo failed.");
        return;
    }
    auto config = container->GetResourceConfiguration();
    config.SetDeviceType(SystemProperties::GetDeviceType());
    config.SetOrientation(SystemProperties::GetDeviceOrientation());
    config.SetDensity(runArgs.deviceConfig.density);
    config.SetColorMode(runArgs.deviceConfig.colorMode);
    config.SetFontRatio(runArgs.deviceConfig.fontRatio);
    container->SetResourceConfiguration(config);
}

RefPtr<AceContainer> AceContainer::GetContainerInstance(int32_t instanceId)
{
    auto container = AceType::DynamicCast<AceContainer>(AceEngine::Get().GetContainer(instanceId));
    return container;
}

void AceContainer::LoadDocument(const std::string& url, const std::string& componentName)
{
    ContainerScope scope(instanceId_);
    if (type_ != FrontendType::DECLARATIVE_JS) {
        LOGE("component preview not supported");
        return;
    }
    auto frontend = AceType::DynamicCast<OHOS::Ace::DeclarativeFrontend>(frontend_);
    if (!frontend) {
        LOGE("frontend is null, AceContainer::LoadDocument failed");
        return;
    }
    auto jsEngine = frontend->GetJsEngine();
    if (!jsEngine) {
        LOGE("jsEngine is null, AceContainer::LoadDocument failed");
        return;
    }
    taskExecutor_->PostTask(
        [front = frontend, componentName, url, jsEngine]() {
            front->SetPagePath(url);
            jsEngine->ReplaceJSContent(url, componentName);
        },
        TaskExecutor::TaskType::JS);
}
} // namespace OHOS::Ace::Platform
