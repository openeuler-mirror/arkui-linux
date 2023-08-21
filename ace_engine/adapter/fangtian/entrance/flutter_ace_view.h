
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

#ifndef FOUNDATION_ACE_ADAPTER_PREVIEW_FLUTTER_ACE_VIEW_H
#define FOUNDATION_ACE_ADAPTER_PREVIEW_FLUTTER_ACE_VIEW_H

#include <memory>

#include "flutter/common/settings.h"
#include "flutter/lib/ui/compositing/scene.h"
#include "flutter/lib/ui/compositing/scene_builder.h"
#include "flutter/shell/platform/ohos/ohos_shell_holder.h"

#include "adapter/preview/entrance/ace_resource_register.h"
#include "base/utils/noncopyable.h"
#include "core/common/ace_view.h"
#include "core/event/key_event_recognizer.h"

namespace OHOS::Ace::Platform {

using ReleaseCallback = std::function<void()>;

class FlutterAceView : public AceView, public Referenced {
public:
    explicit FlutterAceView(int32_t instanceId) : instanceId_(instanceId) {}
    ~FlutterAceView() override = default;

    void RegisterTouchEventCallback(TouchEventCallback&& callback) override;
    void RegisterKeyEventCallback(KeyEventCallback&& callback) override;
    void RegisterMouseEventCallback(MouseEventCallback&& callback) override;
    void RegisterAxisEventCallback(AxisEventCallback&& callback) override;
    void RegisterRotationEventCallback(RotationEventCallBack&& callback) override;
    void RegisterDragEventCallback(DragEventCallBack&& callback) override {}

    void Launch() override;

    static FlutterAceView* CreateView(
        int32_t instanceId, bool useCurrentEventRunner = false, bool usePlatformThread = false);
    static void SurfaceCreated(FlutterAceView* view, OHOS::sptr<OHOS::Rosen::Window> window);
    void SetShellHolder(std::unique_ptr<flutter::OhosShellHolder> holder);
    flutter::OhosShellHolder* GetShellHolder() const
    {
        return shell_holder_.get();
    }

    int32_t GetInstanceId() const override
    {
        return instanceId_;
    }

    void RegisterCardViewPositionCallback(CardViewPositionCallBack&& callback) override
    {
        if (callback) {
            cardViewPositionCallBack_ = std::move(callback);
        }
    }

    void RegisterCardViewAccessibilityParamsCallback(CardViewAccessibilityParamsCallback&& callback) override
    {
        if (callback) {
            cardViewAccessibilityParamsCallback_ = std::move(callback);
        }
    }

    void RegisterViewChangeCallback(ViewChangeCallback&& callback) override
    {
        if (callback) {
            viewChangeCallback_ = std::move(callback);
        }
    }

    void RegisterViewPositionChangeCallback(ViewPositionChangeCallback&& callback) override {}

    void RegisterDensityChangeCallback(DensityChangeCallback&& callback) override
    {
        if (callback) {
            densityChangeCallback_ = std::move(callback);
        }
    }

    void RegisterSystemBarHeightChangeCallback(SystemBarHeightChangeCallback&& callback) override
    {
        if (callback) {
            systemBarHeightChangeCallback_ = std::move(callback);
        }
    }

    void RegisterSurfaceDestroyCallback(SurfaceDestroyCallback&& callback) override
    {
        if (callback) {
            surfaceDestroyCallback_ = std::move(callback);
        }
    }

    void RegisterIdleCallback(IdleCallback&& callback) override
    {
        if (callback) {
            idleCallback_ = std::move(callback);
        }
    }

    const RefPtr<PlatformResRegister>& GetPlatformResRegister() const override
    {
        return resRegister_;
    }

    bool Dump(const std::vector<std::string>& params) override;

    void ProcessIdleEvent(int64_t deadline);

    void NotifySurfaceChanged(
        int32_t width, int32_t height, WindowSizeChangeReason type = WindowSizeChangeReason::UNDEFINED)
    {
        width_ = width;
        height_ = height;
        if (viewChangeCallback_) {
            viewChangeCallback_(width, height, type);
        }
    }

    void NotifyDensityChanged(double density) const
    {
        if (densityChangeCallback_) {
            densityChangeCallback_(density);
        }
    }

    void NotifySystemBarHeightChanged(double statusBar, double navigationBar) const
    {
        if (systemBarHeightChangeCallback_) {
            systemBarHeightChangeCallback_(statusBar, navigationBar);
        }
    }

    void NotifySurfaceDestroyed() const
    {
        if (surfaceDestroyCallback_) {
            surfaceDestroyCallback_();
        }
    }

    // Use to receive event from pc previewer
    bool HandleTouchEvent(const TouchEvent& touchEvent) override;

    // Use to receive event from pc previewer
    bool HandleKeyEvent(const KeyEvent& keyEvent) override;

    ViewType GetViewType() const override
    {
        return AceView::ViewType::SURFACE_VIEW;
    }

    std::unique_ptr<DrawDelegate> GetDrawDelegate() override;
    std::unique_ptr<PlatformWindow> GetPlatformWindow() override;
    const void* GetNativeWindowById(uint64_t textureId) override;

private:
    int32_t instanceId_ = 0;
    RefPtr<PlatformResRegister> resRegister_ = Referenced::MakeRefPtr<AceResourceRegister>();

    std::unique_ptr<flutter::OhosShellHolder> shell_holder_;
    TouchEventCallback touchEventCallback_;
    MouseEventCallback mouseEventCallback_;
    AxisEventCallback axisEventCallback_;
    RotationEventCallBack rotationEventCallBack_;
    CardViewPositionCallBack cardViewPositionCallBack_;
    CardViewAccessibilityParamsCallback cardViewAccessibilityParamsCallback_;
    ViewChangeCallback viewChangeCallback_;
    DensityChangeCallback densityChangeCallback_;
    SystemBarHeightChangeCallback systemBarHeightChangeCallback_;
    SurfaceDestroyCallback surfaceDestroyCallback_;
    IdleCallback idleCallback_;
    KeyEventCallback keyEventCallback_;
    KeyEventRecognizer keyEventRecognizer_;

    ACE_DISALLOW_COPY_AND_MOVE(FlutterAceView);
};

} // namespace OHOS::Ace::Platform

#endif // FOUNDATION_ACE_ADAPTER_PREVIEW_FLUTTER_ACE_VIEW_H
