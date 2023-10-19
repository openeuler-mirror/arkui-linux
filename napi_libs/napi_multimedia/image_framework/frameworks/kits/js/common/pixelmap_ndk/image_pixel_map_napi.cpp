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

#include "image_pixel_map_napi.h"
#include "napi/native_node_api.h"

namespace OHOS {
namespace Media {
extern "C" int32_t OHOS_MEDIA_GetImageInfo(napi_env env, napi_value value, OhosPixelMapInfo *info);
extern "C" int32_t OHOS_MEDIA_AccessPixels(napi_env env, napi_value value, uint8_t** addrPtr);
extern "C" int32_t OHOS_MEDIA_UnAccessPixels(napi_env env, napi_value value);

extern "C" __attribute__((visibility("default"))) int32_t OH_GetImageInfo(napi_env env, napi_value value,
                                                                          OhosPixelMapInfo *info)
{
    int32_t ret = OHOS_MEDIA_GetImageInfo(env, value, info);
    if (ret != OHOS_IMAGE_RESULT_SUCCESS) {
        return OHOS_IMAGE_RESULT_BAD_PARAMETER;
    }

    return OHOS_IMAGE_RESULT_SUCCESS;
}

extern "C" __attribute__((visibility("default"))) int32_t OH_AccessPixels(napi_env env, napi_value value,
                                                                          void** addrPtr)
{
    int32_t ret = OHOS_MEDIA_AccessPixels(env, value, reinterpret_cast<uint8_t**>(addrPtr));
    if (ret != OHOS_IMAGE_RESULT_SUCCESS) {
        return OHOS_IMAGE_RESULT_BAD_PARAMETER;
    }

    return OHOS_IMAGE_RESULT_SUCCESS;
}

extern "C" __attribute__((visibility("default"))) int32_t OH_UnAccessPixels(napi_env env, napi_value value)
{
    int32_t ret = OHOS_MEDIA_UnAccessPixels(env, value);
    if (ret != OHOS_IMAGE_RESULT_SUCCESS) {
        return OHOS_IMAGE_RESULT_BAD_PARAMETER;
    }

    return OHOS_IMAGE_RESULT_SUCCESS;
}
}  // namespace Media
}  // namespace OHOS
