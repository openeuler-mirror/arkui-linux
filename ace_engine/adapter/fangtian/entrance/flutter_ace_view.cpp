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

#include "adapter/fangtian/entrance/flutter_ace_view.h"

#include "base/log/dump_log.h"
#include "base/log/event_report.h"
#include "base/log/log.h"
#include "base/utils/macros.h"
#include "base/utils/system_properties.h"
#include "base/utils/utils.h"
#include "core/common/ace_engine.h"
#include "core/components/theme/theme_manager.h"
#include "core/event/mouse_event.h"
#include "core/event/touch_event.h"
#include "core/image/image_cache.h"
//#include "core/pipeline/layers/flutter_scene_builder.h"

#include "flutter/fml/synchronization/waitable_event.h"
#include "flutter/shell/common/shell_io_manager.h"
#include "flutter/shell/gpu/gpu_surface_gl_delegate.h"

namespace OHOS::Ace::Platform {

void FlutterAceView::RegisterTouchEventCallback(TouchEventCallback&& callback)
{
    ACE_DCHECK(callback);
    touchEventCallback_ = std::move(callback);
}

void FlutterAceView::RegisterKeyEventCallback(KeyEventCallback&& callback)
{
    ACE_DCHECK(callback);
    keyEventCallback_ = std::move(callback);
}

void FlutterAceView::RegisterMouseEventCallback(MouseEventCallback&& callback)
{
    ACE_DCHECK(callback);
    mouseEventCallback_ = std::move(callback);
}

void FlutterAceView::RegisterAxisEventCallback(AxisEventCallback&& callback)
{
    ACE_DCHECK(callback);
    axisEventCallback_ = std::move(callback);
}

void FlutterAceView::RegisterRotationEventCallback(RotationEventCallBack&& callback)
{
    ACE_DCHECK(callback);
    rotationEventCallBack_ = std::move(callback);
}

void FlutterAceView::Launch()
{
}

bool FlutterAceView::Dump(const std::vector<std::string>& params)
{
    return false;
}

void FlutterAceView::ProcessIdleEvent(int64_t deadline)
{
    if (idleCallback_) {
        idleCallback_(deadline);
    }
}

bool FlutterAceView::HandleTouchEvent(const TouchEvent& touchEvent)
{
    if (touchEvent.type == TouchType::UNKNOWN) {
        LOGW("Unknown event.");
        return false;
    }

    LOGD("HandleTouchEvent touchEvent.x: %lf, touchEvent.y: %lf, touchEvent.size: %lf",
        touchEvent.x, touchEvent.y, touchEvent.size);
    auto event = touchEvent.UpdatePointers();
    if (touchEventCallback_) {
        touchEventCallback_(event, nullptr);
    }

    return true;
}

bool FlutterAceView::HandleKeyEvent(const KeyEvent& keyEvent)
{
    if (!keyEventCallback_) {
        return false;
    }

    return keyEventCallback_(keyEvent);
}

std::unique_ptr<DrawDelegate> FlutterAceView::GetDrawDelegate()
{
    auto drawDelegate = std::make_unique<DrawDelegate>();

    drawDelegate->SetDrawFrameCallback([this](RefPtr<Flutter::Layer>& layer, const Rect& dirty) {
        if (!layer) {
            return;
        }
        /*
        RefPtr<Flutter::FlutterSceneBuilder> flutterSceneBuilder = AceType::MakeRefPtr<Flutter::FlutterSceneBuilder>();
        layer->AddToScene(*flutterSceneBuilder, 0.0, 0.0);
        auto scene_ = flutterSceneBuilder->Build();
        if (!flutter::UIDartState::Current()) {
            LOGE("uiDartState is nullptr");
            return;
        }
        auto window = flutter::UIDartState::Current()->window();
        if (window != nullptr && window->client() != nullptr) {
            window->client()->Render(scene_.get());
        }
        */
    });

    return drawDelegate;
}

std::unique_ptr<PlatformWindow> FlutterAceView::GetPlatformWindow()
{
    return nullptr;
}

const void* FlutterAceView::GetNativeWindowById(uint64_t textureId)
{
    return nullptr;
}

void FlutterAceView::SetShellHolder(std::unique_ptr<flutter::OhosShellHolder> holder)
{
    shell_holder_ = std::move(holder);
}

FlutterAceView* FlutterAceView::CreateView(int32_t instanceId, bool useCurrentEventRunner, bool usePlatformThread)
{
    FlutterAceView* aceSurface = new Platform::FlutterAceView(instanceId);
    if (aceSurface != nullptr) {
        aceSurface->IncRefCount();
    }
    flutter::Settings settings;
    settings.instanceId = instanceId;
    settings.platform = flutter::AcePlatform::ACE_PLATFORM_OHOS;
    settings.enable_software_rendering = true;
#ifdef ENABLE_ROSEN_BACKEND
    settings.use_system_render_thread = SystemProperties::GetRosenBackendEnabled();
#endif
    settings.platform_as_ui_thread = usePlatformThread;
    settings.use_current_event_runner = useCurrentEventRunner;
    LOGD("software render: %{public}s ", settings.enable_software_rendering ? "true" : "false");
    LOGD("use platform as ui thread: %{public}s", settings.platform_as_ui_thread ? "true" : "false");
    settings.idle_notification_callback = [instanceId](int64_t deadline) {
        ContainerScope scope(instanceId);
        auto container = Container::Current();
        CHECK_NULL_VOID_NOLOG(container);
        auto context = container->GetPipelineContext();
        CHECK_NULL_VOID_NOLOG(context);
        context->GetTaskExecutor()->PostTask(
            [context, deadline]() { context->OnIdle(deadline); }, TaskExecutor::TaskType::UI);
    };
    auto shell_holder = std::make_unique<flutter::OhosShellHolder>(settings, false);
    if (aceSurface != nullptr) {
        aceSurface->SetShellHolder(std::move(shell_holder));
    }
    return aceSurface;
}

void FlutterAceView::SurfaceCreated(FlutterAceView* view, OHOS::sptr<OHOS::Rosen::Window> window)
{
    CHECK_NULL_VOID(window);
    CHECK_NULL_VOID(view);
    LOGD(">>> FlutterAceView::SurfaceCreated, pWnd:%{public}p", &(*window));
    auto platformView = view->GetShellHolder()->GetPlatformView();
    LOGD("FlutterAceView::SurfaceCreated, GetPlatformView");
    if (platformView && !SystemProperties::GetRosenBackendEnabled()) {
        LOGD("FlutterAceView::SurfaceCreated, call NotifyCreated");
        platformView->NotifyCreated(window);
    }

    LOGD("<<< FlutterAceView::SurfaceCreated, end");
}
} // namespace OHOS::Ace::Platform
