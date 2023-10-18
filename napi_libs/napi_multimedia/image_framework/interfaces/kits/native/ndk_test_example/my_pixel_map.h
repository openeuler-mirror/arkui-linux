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

#ifndef PIXEL_MAP_NAPI_TEST_H_
#define PIXEL_MAP_NAPI_TEST_H_

#include "pixel_map.h"
#include "image_type.h"
#include "image_source.h"
#include "napi/native_api.h"
#include "napi/native_node_api.h"

namespace OHOS {
namespace Media {
class MyPixelMap {
public:
    MyPixelMap();
    ~MyPixelMap();

    static napi_value Init(napi_env env, napi_value exports);

    static napi_value TestGetImageInfo(napi_env env, napi_callback_info info);
    static napi_value TestAccessPixels(napi_env env, napi_callback_info info);
    static napi_value TestUnAccessPixels(napi_env env, napi_callback_info info);

private:
    static napi_value Constructor(napi_env env, napi_callback_info info);

    static napi_ref sConstructor_;

    napi_env env_ = nullptr;
};
} // namespace Media
} // namespace OHOS
#endif /* PIXEL_MAP_NAPI_TEST_H_ */
