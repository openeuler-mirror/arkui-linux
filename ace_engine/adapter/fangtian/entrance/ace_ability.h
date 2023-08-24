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

#ifndef FOUNDATION_ACE_ADAPTER_PREVIEW_ACE_ABILITY_H
#define FOUNDATION_ACE_ADAPTER_PREVIEW_ACE_ABILITY_H

#include <atomic>

#include "flutter/shell/platform/glfw/public/flutter_glfw.h"
#include "glfw_render_context.h"
#include "adapter/fangtian/entrance/ace_run_args.h"
#include "adapter/fangtian/entrance/rs_ace_view.h"
#include "adapter/fangtian/entrance/flutter_ace_view.h"
#include "base/utils/macros.h"
#include "core/event/key_event.h"
#include "core/event/touch_event.h"

namespace OHOS::Ace::Platform {


struct ConfigChanges {
    bool watchLocale = false;
    bool watchLayout = false;
    bool watchFontSize = false;
    bool watchOrientation = false;
    bool watchDensity = false;
};

struct SystemParams {
    int32_t deviceWidth { 0 };
    int32_t deviceHeight { 0 };
    bool isRound = false;
    double density { 1.0 };
    std::string language = "zh";
    std::string region = "CN";
    std::string script = "";
    OHOS::Ace::DeviceType deviceType { DeviceType::PHONE };
    OHOS::Ace::ColorMode colorMode { ColorMode::LIGHT };
    OHOS::Ace::DeviceOrientation orientation { DeviceOrientation::PORTRAIT };
};

using GlfwController = std::shared_ptr<FT::Rosen::GlfwRenderContext>;

class AceAbility;
class AceWindowListener : public OHOS::Rosen::IWindowChangeListener {
public:
    AceWindowListener(std::weak_ptr<AceAbility> owner) : callbackOwner_(owner) {}
    ~AceWindowListener() = default;
    void OnSizeChange(OHOS::Rosen::Rect rect, OHOS::Rosen::WindowSizeChangeReason reason) override;
    void OnModeChange(OHOS::Rosen::WindowMode mode) override;

private:
    std::weak_ptr<AceAbility> callbackOwner_;
};

class ACE_FORCE_EXPORT_WITH_PREVIEW AceAbility {
public:
    explicit AceAbility(const AceRunArgs& runArgs);
    ~AceAbility();

    // Be called in Previewer frontend thread, which is not ACE platform thread.
    static std::shared_ptr<AceAbility> CreateInstance(AceRunArgs& runArgs);
    void InitEnv();
    void Start();
    static void Stop();
    void OnConfigurationChanged(const DeviceConfig& newConfig);
    void SurfaceChanged(
        const DeviceOrientation& orientation, const double& resolution, int32_t& width, int32_t& height);
    void ReplacePage(const std::string& url, const std::string& params);
    void LoadDocument(const std::string& url, const std::string& componentName, SystemParams& systemParams);
    void OnSizeChange(const OHOS::Rosen::Rect& rect, OHOS::Rosen::WindowSizeChangeReason reason);
    void OnModeChange(OHOS::Rosen::WindowMode mode);

    std::string GetJSONTree();
    std::string GetDefaultJSONTree();
    bool OperateComponent(const std::string& attrsJson);
    GlfwController GetGlfwWindowController()
    {
        return controller_;
    }

    friend class AceWindowListener;

private:
    FlutterAceView* flutterView_ = nullptr;
    void RunEventLoop();

    void SetConfigChanges(const std::string& configChanges);

    void SetGlfwWindowController(const GlfwController &controller)
    {
        controller_ = controller;
    }

#ifndef ENABLE_ROSEN_BACKEND
    void SetFlutterWindowControllerRef(const FlutterDesktopWindowControllerRef &controller)
    {
        windowControllerRef_ = controller;
    }

    FlutterDesktopWindowControllerRef windowControllerRef_ = nullptr;
#endif

    // flag indicating if the glfw message loop should be running.
    static std::atomic<bool> loopRunning_;

    AceRunArgs runArgs_;
    ConfigChanges configChanges_;
    GlfwController controller_ = nullptr;
};

} // namespace OHOS::Ace::Platform

#endif // FOUNDATION_ACE_ADAPTER_PREVIEW_ACE_ABILITY_H
