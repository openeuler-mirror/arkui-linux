/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
#include <dlfcn.h>

#include "frameworks/bridge/js_frontend/engine/common/js_engine.h"

#include "frameworks/bridge/js_frontend/engine/common/runtime_constants.h"
#include "native_engine/native_engine.h"

namespace OHOS::Ace::Framework {

void JsEngine::RunNativeEngineLoop()
{
    LOGW("RunNativeEngineLoop not implemented.");
    if (nativeEngine_ != nullptr) {
        nativeEngine_->Loop(LOOP_NOWAIT, false);
    }
}

PixelMapNapiEntry JsEngine::GetPixelMapNapiEntry()
{
    static PixelMapNapiEntry pixelMapNapiEntry_ = nullptr;
    if (!pixelMapNapiEntry_) {
        std::string napiPluginPath = "/usr/lib64/libimage.so";
        void* handle = dlopen(napiPluginPath.c_str(), RTLD_LAZY);
        if (handle == nullptr) {
            LOGE("Failed to open shared library %{public}s, reason: %{public}s", napiPluginPath.c_str(), dlerror());
            return nullptr;
        }
        pixelMapNapiEntry_ = reinterpret_cast<PixelMapNapiEntry>(dlsym(handle, "OHOS_MEDIA_GetPixelMap"));
        if (pixelMapNapiEntry_ == nullptr) {
            dlclose(handle);
            LOGE("Failed to get symbol OHOS_MEDIA_GetPixelMap in %{public}s", napiPluginPath.c_str());
            return nullptr;
        }
    }
    return pixelMapNapiEntry_;
}

} // namespace OHOS::Ace::Framework