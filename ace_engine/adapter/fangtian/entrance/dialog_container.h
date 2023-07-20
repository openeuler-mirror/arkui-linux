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

#ifndef FOUNDATION_ACE_ADAPTER_OHOS_CPP_DIALOG_CONTAINER_H
#define FOUNDATION_ACE_ADAPTER_OHOS_CPP_DIALOG_CONTAINER_H

#include <memory>

#include "base/resource/asset_manager.h"
#include "base/thread/task_executor.h"
#include "base/utils/noncopyable.h"
#include "core/common/ace_view.h"
#include "core/common/container.h"
#include "core/common/js_message_dispatcher.h"
#include "core/common/window.h"
#include "core/components/dialog/dialog_properties.h"
#include "core/components_ng/render/adapter/rosen_window.h"

namespace OHOS::Ace::Platform {
class DialogContainer : public Container, public JsMessageDispatcher {
    DECLARE_ACE_TYPE(DialogContainer, Container, JsMessageDispatcher);

public:
    explicit DialogContainer(int32_t instanceId, FrontendType type = FrontendType::DECLARATIVE_JS);
    ~DialogContainer() override = default;

    void Initialize() override {};
    void Destroy() override;
    void DestroyView() override;

    int32_t GetInstanceId() const override
    {
        if (aceView_) {
            return aceView_->GetInstanceId();
        }
        return -1;
    }

    RefPtr<Frontend> GetFrontend() const override
    {
        return frontend_;
    }

    RefPtr<PlatformResRegister> GetPlatformResRegister() const override
    {
        return resRegister_;
    }

    RefPtr<PipelineBase> GetPipelineContext() const override
    {
        return pipelineContext_;
    }

    int32_t GetViewPosX() const override
    {
        return aceView_ ? aceView_->GetPosX() : 0;
    }

    int32_t GetViewPosY() const override
    {
        return aceView_ ? aceView_->GetPosY() : 0;
    }

    void SetWindowId(uint32_t windowId) override
    {
        windowId_ = windowId;
    }

    uint32_t GetWindowId() const override
    {
        return windowId_;
    }

    int32_t GetViewWidth() const override
    {
        return aceView_ ? aceView_->GetWidth() : 0;
    }

    int32_t GetViewHeight() const override
    {
        return aceView_ ? aceView_->GetHeight() : 0;
    }

    AceView* GetAceView() const
    {
        return aceView_;
    }

    void* GetView() const override
    {
        return static_cast<void*>(aceView_);
    }

    RefPtr<TaskExecutor> GetTaskExecutor() const override
    {
        return taskExecutor_;
    }

    void Dispatch(
        const std::string& group, std::vector<uint8_t>&& data, int32_t id, bool replyToComponent) const override {};

    void DispatchPluginError(int32_t callbackId, int32_t errorCode, std::string&& errorMessage) const override {};

    bool Dump(const std::vector<std::string>& params) override;

    void DispatchSync(
        const std::string& group, std::vector<uint8_t>&& data, uint8_t** resData, int64_t& position) const override
    {}

    std::string GetHostClassName() const override
    {
        return "";
    }

    void DumpHeapSnapshot(bool isPrivate) override;

    void SetAssetManager(const RefPtr<AssetManager>& assetManager)
    {
        assetManager_ = assetManager;
        if (frontend_) {
            frontend_->SetAssetManager(assetManager);
        }
    }

    RefPtr<AssetManager> GetAssetManager() const override
    {
        return assetManager_;
    }

    bool IsSubContainer() const override
    {
        return true;
    }

    bool IsDialogContainer() const override
    {
        return true;
    }

    static void ShowToast(int32_t instanceId, const std::string& message, int32_t duration, const std::string& bottom);
    static void ShowDialog(int32_t instanceId, const std::string& title, const std::string& message,
        const std::vector<ButtonInfo>& buttons, bool autoCancel, std::function<void(int32_t, int32_t)>&& callback,
        const std::set<std::string>& callbacks);
    static void ShowActionMenu(int32_t instanceId, const std::string& title, const std::vector<ButtonInfo>& button,
        std::function<void(int32_t, int32_t)>&& callback);

    static bool ShowToastDialogWindow(
        int32_t instanceId, int32_t posX, int32_t posY, int32_t width, int32_t height, bool isToast = false);
    static bool CloseWindow(int32_t instanceId);
    static bool HideWindow(int32_t instanceId);

    static void SetUIWindow(int32_t instanceId, sptr<OHOS::Rosen::Window>& uiWindow);
    static sptr<OHOS::Rosen::Window> GetUIWindow(int32_t instanceId);

    static void DestroyContainer(int32_t instanceId, const std::function<void()>& destroyCallback = nullptr);
    static RefPtr<DialogContainer> GetContainer(int32_t instanceId);
    static void SetView(
        AceView* view, double density, int32_t width, int32_t height, sptr<OHOS::Rosen::Window>& rsWindow);
    static void SetViewNew(
        AceView* view, double density, int32_t width, int32_t height, sptr<OHOS::Rosen::Window>& rsWindow);
    static bool OnBackPressed(int32_t instanceId);

private:
    void InitPipelineContext(std::unique_ptr<Window> window, int32_t instanceId, double density, int32_t width,
        int32_t height, uint32_t windowId);
    void InitializeFrontend();
    void InitializeCallback();
    void InitializeTouchEventCallback();
    void InitializeMouseEventCallback();
    void InitializeAxisEventCallback();
    void InitializeKeyEventCallback();
    void InitializeRotationEventCallback();
    void InitializeViewChangeCallback();
    void InitializeDensityChangeCallback();
    void InitializeSystemBarHeightChangeCallback();
    void InitializeSurfaceDestroyCallback();
    void InitializeDragEventCallback();

    void AttachView(std::unique_ptr<Window> window, AceView* view, double density, int32_t width, int32_t height,
        uint32_t windowId);
    void SetUIWindowInner(sptr<OHOS::Rosen::Window> uiWindow);
    sptr<OHOS::Rosen::Window> GetUIWindowInner() const;

    uint32_t windowId_ = OHOS::Rosen::INVALID_WINDOW_ID;
    int32_t instanceId_ = -1;
    AceView* aceView_ = nullptr;
    RefPtr<TaskExecutor> taskExecutor_;
    RefPtr<AssetManager> assetManager_;
    RefPtr<PlatformResRegister> resRegister_;
    RefPtr<PipelineBase> pipelineContext_;
    RefPtr<Frontend> frontend_;
    FrontendType type_ = FrontendType::DECLARATIVE_JS;
    ResourceInfo resourceInfo_;
    sptr<OHOS::Rosen::Window> uiWindow_ = nullptr;
    std::string windowName_;
    WindowModal windowModal_ { WindowModal::NORMAL };
    ColorScheme colorScheme_ { ColorScheme::FIRST_VALUE };

    ACE_DISALLOW_COPY_AND_MOVE(DialogContainer);
};

} // namespace OHOS::Ace::Platform

#endif // FOUNDATION_ACE_ADAPTER_OHOS_CPP_DIALOG_CONTAINER_H
