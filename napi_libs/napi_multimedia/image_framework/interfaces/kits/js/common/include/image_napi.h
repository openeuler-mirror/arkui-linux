/*
 * Copyright (C) 2022 Huawei Device Co., Ltd.
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

#ifndef INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_NAPI_H_
#define INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_NAPI_H_

#include <cerrno>
#include <dirent.h>
#include <fcntl.h>
#include <ftw.h>
#include <securec.h>
#include <sys/stat.h>
#include <unistd.h>
#include <variant>
#include <map>

#include <surface.h>
#include "napi/native_api.h"
#include "napi/native_node_api.h"
#include "image_receiver.h"
#include "image_creator.h"

namespace OHOS {
namespace Media {
struct ImageAsyncContext;
struct Component {
    int32_t rowStride = 0;
    int32_t pixelStride = 0;
    std::vector<uint8_t> raw;
};

class ImageNapi {
public:
    ImageNapi();
    ~ImageNapi();
    static napi_value Init(napi_env env, napi_value exports);
    static std::shared_ptr<ImageNapi> GetImageSource(napi_env env, napi_value image);
    static napi_value Create(napi_env env, sptr<SurfaceBuffer> surfaceBuffer,
        std::shared_ptr<ImageReceiver> imageReceiver);
    static napi_value Create(napi_env env, std::shared_ptr<ImageReceiver> imageReceiver);
    static napi_value CreateBufferToImage(napi_env env, sptr<SurfaceBuffer> surfaceBuffer,
        std::shared_ptr<ImageCreator> imageCreator);
    void NativeRelease();
    sptr<SurfaceBuffer> sSurfaceBuffer_;
    Component* CreateComponentData(ComponentType type, size_t size, int32_t rowStride, int32_t pixelStride);
    Component* GetComponentData(ComponentType type);
    uint32_t CombineComponentsIntoSurface();

private:
    static napi_value Constructor(napi_env env, napi_callback_info info);
    static void Destructor(napi_env env, void *nativeObject, void *finalize);

    static napi_value JSGetClipRect(napi_env env, napi_callback_info info);
    static napi_value JsGetSize(napi_env env, napi_callback_info info);
    static napi_value JsGetFormat(napi_env env, napi_callback_info info);
    static napi_value JsGetComponent(napi_env env, napi_callback_info info);
    static napi_value JsRelease(napi_env env, napi_callback_info info);

    static napi_value BuildComponent(napi_env env, napi_callback_info info);
    static std::unique_ptr<ImageAsyncContext> UnwarpContext(napi_env env, napi_callback_info info);
    static void JsGetComponentCallBack(napi_env env, napi_status status, ImageAsyncContext* context);

    void release();
    bool isRelease = false;
    static thread_local napi_ref sConstructor_;
    static sptr<SurfaceBuffer> staticInstance_;
    static std::shared_ptr<ImageReceiver> staticImageReceiverInstance_;
    static std::shared_ptr<ImageCreator> staticImageCreatorInstance_;

    napi_env env_ = nullptr;
    std::shared_ptr<ImageReceiver> imageReceiver_;
    std::shared_ptr<ImageCreator> imageCreator_;
    std::shared_ptr<ImageNapi> nativeImage_;
    std::map<ComponentType, std::unique_ptr<Component>> componentData_;
};

struct ImageAsyncContext {
    napi_env env = nullptr;
    napi_async_work work = nullptr;
    napi_deferred deferred = nullptr;
    napi_ref callbackRef = nullptr;
    ImageNapi *constructor_ = nullptr;
    uint32_t status;
    int32_t componentType;
};
} // namespace Media
} // namespace OHOS
#endif // INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_NAPI_H_
