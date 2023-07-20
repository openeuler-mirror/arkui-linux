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

#ifndef FOUNDATION_ACE_ADAPTER_OHOS_ENTRANCE_ACE_UI_CONTENT_IMPL_H
#define FOUNDATION_ACE_ADAPTER_OHOS_ENTRANCE_ACE_UI_CONTENT_IMPL_H

#include "ability_info.h"
#include "core/common/flutter/flutter_asset_manager.h"
#include "interfaces/inner_api/ace/ui_content.h"
#include "interfaces/inner_api/ace/viewport_config.h"
#include "key_event.h"
#include "native_engine/native_value.h"
#include "native_engine/native_engine.h"

#include "base/utils/macros.h"
#include "wm/window.h"

namespace OHOS {

class Window;

} // namespace OHOS

namespace OHOS::Ace {

class ACE_FORCE_EXPORT UIContentImpl : public UIContent {
public:
    UIContentImpl(OHOS::AbilityRuntime::Context* context, void* runtime);
    UIContentImpl(OHOS::AppExecFwk::Ability* ability);
    UIContentImpl(OHOS::AbilityRuntime::Context* context, void* runtime, bool isCard);
    ~UIContentImpl()
    {
        DestroyUIDirector();
        DestroyCallback();
    }

    // UI content lifecycles
    void Initialize(OHOS::Rosen::Window* window, const std::string& url, NativeValue* storage) override;
    void Foreground() override;
    void Background() override;
    void Focus() override;
    void UnFocus() override;
    void Destroy() override;
    void OnNewWant(const OHOS::AAFwk::Want& want) override;

    // distribute
    void Restore(OHOS::Rosen::Window* window, const std::string& contentInfo, NativeValue* storage) override;
    std::string GetContentInfo() const override;
    void DestroyUIDirector() override;

    // UI content event process
    bool ProcessBackPressed() override;
    bool ProcessPointerEvent(const std::shared_ptr<OHOS::MMI::PointerEvent>& pointerEvent) override;
    bool ProcessKeyEvent(const std::shared_ptr<OHOS::MMI::KeyEvent>& keyEvent) override;
    bool ProcessAxisEvent(const std::shared_ptr<OHOS::MMI::AxisEvent>& axisEvent) override;
    bool ProcessVsyncEvent(uint64_t timeStampNanos) override;
    void UpdateConfiguration(const std::shared_ptr<OHOS::AppExecFwk::Configuration>& config) override;
    void UpdateViewportConfig(const ViewportConfig& config, OHOS::Rosen::WindowSizeChangeReason reason) override;
    void UpdateWindowMode(OHOS::Rosen::WindowMode mode) override;
    void HideWindowTitleButton(bool hideSplit, bool hideMaximize, bool hideMinimize) override;

    // Window color
    uint32_t GetBackgroundColor() override;
    void SetBackgroundColor(uint32_t color) override;

    void DumpInfo(const std::vector<std::string>& params, std::vector<std::string>& info) override;

    // Set UIContent callback for custom window animation
    void SetNextFrameLayoutCallback(std::function<void()>&& callback) override;

    // Receive memory level notification
    void NotifyMemoryLevel(int32_t level) override;

    void SetAppWindowTitle(const std::string& title) override;
    void SetAppWindowIcon(const std::shared_ptr<Media::PixelMap>& pixelMap) override;

    // ArkTS Form
    std::shared_ptr<Rosen::RSSurfaceNode> GetFormRootNode() override;
    void UpdateFormData(const std::string& data) override;
    void UpdateFormSharedImage(
        const std::map<std::string, sptr<OHOS::AppExecFwk::FormAshmem>>& imageDataMap) override;
    void ReloadForm() override;

    void SetFormWidth(float width) override
    {
        formWidth_ = width;
    }
    void SetFormHeight(float height) override
    {
        formHeight_ = height;
    }
    float GetFormWidth() override
    {
        return formWidth_;
    }
    float GetFormHeight() override
    {
        return formHeight_;
    }

    void SetActionEventHandler(
        std::function<void(const std::string& action)>&& actionCallback) override;
    void SetErrorEventHandler(
        std::function<void(const std::string&, const std::string&)>&& errorCallback) override;

    void OnFormSurfaceChange(float width, float height) override;

private:
    void CommonInitialize(OHOS::Rosen::Window* window, const std::string& contentInfo, NativeValue* storage);
    void CommonInitializeForm(OHOS::Rosen::Window* window, const std::string& contentInfo, NativeValue* storage);
    void InitializeSubWindow(OHOS::Rosen::Window* window, bool isDialog = false);
    void DestroyCallback() const;
    std::weak_ptr<OHOS::AbilityRuntime::Context> context_;
    void* runtime_ = nullptr;
    OHOS::Rosen::Window* window_ = nullptr;
    std::string startUrl_;
    int32_t instanceId_ = -1;
    OHOS::sptr<OHOS::Rosen::IWindowDragListener> dragWindowListener_ = nullptr;
    OHOS::sptr<OHOS::Rosen::IOccupiedAreaChangeListener> occupiedAreaChangeListener_ = nullptr;

    // ITouchOutsideListener is used for touching out of hot areas of window.
    OHOS::sptr<OHOS::Rosen::ITouchOutsideListener> touchOutsideListener_ = nullptr;

    // ArkTS Form
    bool isFormRender_ = false;
    bool isFormRenderInit_ = false;
    std::string bundleName_;
    std::string moduleName_;
    bool isBundle_ = false;
    int32_t minCompatibleVersionCode_ = 0;
    float formWidth_ = 0.0;
    float formHeight_ = 0.0;
    std::string formData_;
    std::map<std::string, sptr<OHOS::AppExecFwk::FormAshmem>> formImageDataMap_;
};

} // namespace OHOS::Ace

#endif // FOUNDATION_ACE_ADAPTER_OHOS_ENTRANCE_ACE_UI_CONTENT_IMPL_H
