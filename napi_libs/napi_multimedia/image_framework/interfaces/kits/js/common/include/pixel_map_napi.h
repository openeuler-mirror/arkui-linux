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

#ifndef INTERFACES_KITS_JS_COMMON_INCLUDE_PIXEL_MAP_NAPI_H_
#define INTERFACES_KITS_JS_COMMON_INCLUDE_PIXEL_MAP_NAPI_H_

#include "pixel_map.h"
#include "image_type.h"
#include "image_source.h"
#include "napi/native_api.h"
#include "napi/native_node_api.h"

namespace OHOS {
namespace Media {
class PixelMapNapi {
public:
    PixelMapNapi();
    ~PixelMapNapi();

    static napi_value Init(napi_env env, napi_value exports);

    static napi_value CreatePixelMap(napi_env env, std::shared_ptr<PixelMap> pixelmap);
    static std::shared_ptr<PixelMap> GetPixelMap(napi_env env, napi_value pixelmap);
    std::shared_ptr<PixelMap>* GetPixelMap();
    bool IsLockPixelMap();
    bool LockPixelMap();
    void UnlockPixelMap();

private:
    static napi_value Constructor(napi_env env, napi_callback_info info);
    static void Destructor(napi_env env, void *nativeObject, void *finalize);

    // readonly property
    static napi_value GetIsEditable(napi_env env, napi_callback_info info);

    // static mothod
    static napi_value CreatePixelMap(napi_env env, napi_callback_info info);
    static void CreatePixelMapComplete(napi_env env, napi_status status, void *data);

    // methods
    static napi_value ReadPixelsToBuffer(napi_env env, napi_callback_info info);
    static napi_value ReadPixels(napi_env env, napi_callback_info info);
    static napi_value WritePixels(napi_env env, napi_callback_info info);
    static napi_value WriteBufferToPixels(napi_env env, napi_callback_info info);
    static napi_value GetImageInfo(napi_env env, napi_callback_info info);
    static napi_value GetBytesNumberPerRow(napi_env env, napi_callback_info info);
    static napi_value GetPixelBytesNumber(napi_env env, napi_callback_info info);
    static napi_value getPixelBytesCount(napi_env env, napi_callback_info info);
    static napi_value IsSupportAlpha(napi_env env, napi_callback_info info);
    static napi_value SetAlphaAble(napi_env env, napi_callback_info info);
    static napi_value CreateAlphaPixelmap(napi_env env, napi_callback_info info);
    static napi_value GetDensity(napi_env env, napi_callback_info info);
    static napi_value SetDensity(napi_env env, napi_callback_info info);
    static napi_value Release(napi_env env, napi_callback_info info);
    static napi_value SetAlpha(napi_env env, napi_callback_info info);

    static napi_value Scale(napi_env env, napi_callback_info info);
    static napi_value Translate(napi_env env, napi_callback_info info);
    static napi_value Rotate(napi_env env, napi_callback_info info);
    static napi_value Flip(napi_env env, napi_callback_info info);
    static napi_value Crop(napi_env env, napi_callback_info info);

    void release();
    static thread_local napi_ref sConstructor_;
    static std::shared_ptr<PixelMap> sPixelMap_;

    napi_env env_ = nullptr;
    std::shared_ptr<PixelMap> nativePixelMap_;
    std::shared_ptr<PixelMap> nativeInner_;
    int32_t lockCount = 0;
    bool isRelease = false;
};
} // namespace Media
} // namespace OHOS
#endif // INTERFACES_KITS_JS_COMMON_INCLUDE_PIXEL_MAP_NAPI_H_
