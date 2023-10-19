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

#include "native_module_ohos_image.h"
#include "hilog/log.h"

using OHOS::HiviewDFX::HiLog;
namespace {
    constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {LOG_CORE, LOG_DOMAIN, "NAPITEST"};
}
namespace OHOS {
namespace Media{
/*
 * Function registering all props and functions of ohos.medialibrary module
 */
static napi_value Export(napi_env env, napi_value exports)
{
    HiLog::Error(LABEL, "ImagePackerNapi CALL");
    ImagePackerNapi::Init(env, exports);
    HiLog::Error(LABEL, "PixelMapNapi CALL");
    PixelMapNapi::Init(env, exports);
    HiLog::Error(LABEL, "ImageSourceNapi CALL");
    ImageSourceNapi::Init(env, exports);
#if !defined(_IOS) && !defined(_ANDROID)
    HiLog::Error(LABEL, "ImageReceiverNapi CALL");
    ImageReceiverNapi::Init(env, exports);
    HiLog::Error(LABEL, "ImageCreatorNapi CALL");
    ImageCreatorNapi::Init(env, exports);
    HiLog::Error(LABEL, "ImageNapi CALL");
    ImageNapi::Init(env, exports);
#endif
    return exports;
}

/*
 * module define
 */
static napi_module g_module = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = Export,
    .nm_modname = "multimedia.image",
    .nm_priv = (reinterpret_cast<void *>(0)),
    .reserved = {0}
};

/*
 * module register
 */
extern "C" __attribute__((constructor)) void ImageRegisterModule(void)
{
    napi_module_register(&g_module);
}
} // namespace Media
} // namespace OHOS
