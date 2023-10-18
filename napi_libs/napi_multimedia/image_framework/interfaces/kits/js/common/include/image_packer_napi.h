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

#ifndef INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_PACKER_NAPI_H_
#define INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_PACKER_NAPI_H_

#include <cerrno>
#include <dirent.h>
#include <fcntl.h>
#include <ftw.h>
#include <securec.h>
#include <sys/stat.h>
#include <unistd.h>
#include <variant>

#include "image_packer.h"
#include "image_type.h"
#include "image_source.h"
#include "napi/native_api.h"
#include "napi/native_node_api.h"
#include "pixel_map.h"
#include "image_source_napi.h"

namespace OHOS {
namespace Media {
class ImagePackerNapi {
public:
    ImagePackerNapi();
    ~ImagePackerNapi();
    static napi_value Init(napi_env env, napi_value exports);
    static napi_value CreateImagePacker(napi_env env, napi_callback_info info);

private:
    static napi_value Constructor(napi_env env, napi_callback_info info);
    static void Destructor(napi_env env, void *nativeObject, void *finalize);
    static napi_value Packing(napi_env env, napi_callback_info info);
    static napi_value PackingFromPixelMap(napi_env env, napi_callback_info info);
    static napi_value Release(napi_env env, napi_callback_info info);
    static napi_value GetSupportedFormats(napi_env env, napi_callback_info info);

    void release();
    bool isRelease = false;
    static thread_local napi_ref sConstructor_;
    static std::shared_ptr<ImageSource> sImgSource_;
    static std::shared_ptr<ImagePacker> sImgPck_;

    napi_env env_ = nullptr;
    std::shared_ptr<ImagePacker> nativeImgPck = nullptr;
};
} // namespace Media
} // namespace OHOS
#endif // INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_PACKER_NAPI_H_
