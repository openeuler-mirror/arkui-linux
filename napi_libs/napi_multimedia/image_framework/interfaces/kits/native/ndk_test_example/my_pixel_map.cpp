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

#include "my_pixel_map.h"
#include "media_errors.h"
#include "hilog/log.h"
#include "image_napi_utils.h"
#include "image_pixel_map_napi.h"

using OHOS::HiviewDFX::HiLog;
namespace {
constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {LOG_CORE, LOG_DOMAIN, "MyPixelMapNapiTest"};
constexpr uint32_t TEST_ARG_SUM = 1;
}
namespace OHOS {
namespace Media {
static const std::string CLASS_NAME = "MyPixelMap";
napi_ref MyPixelMap::sConstructor_ = nullptr;
MyPixelMap::MyPixelMap():env_(nullptr)
{
}

MyPixelMap::~MyPixelMap()
{
}

napi_value MyPixelMap::Init(napi_env env, napi_value exports)
{
    napi_property_descriptor props[] = {
    };

    napi_property_descriptor static_prop[] = {
        DECLARE_NAPI_STATIC_FUNCTION("testGetImageInfo", TestGetImageInfo),
        DECLARE_NAPI_STATIC_FUNCTION("testAccessPixels", TestAccessPixels),
        DECLARE_NAPI_STATIC_FUNCTION("testUnAccessPixels", TestUnAccessPixels),
    };

    napi_value constructor = nullptr;

    if (napi_define_class(env, CLASS_NAME.c_str(), NAPI_AUTO_LENGTH, Constructor, nullptr, IMG_ARRAY_SIZE(props),
        props, &constructor) != napi_ok) {
        HiLog::Error(LABEL, "define class fail");
        return nullptr;
    }

    if (napi_create_reference(env, constructor, 1, &sConstructor_) != napi_ok) {
        HiLog::Error(LABEL, "create reference fail");
        return nullptr;
    }

    if (napi_set_named_property(env, exports, CLASS_NAME.c_str(), constructor) != napi_ok) {
        HiLog::Error(LABEL, "set named property fail");
        return nullptr;
    }

    if (napi_define_properties(env, exports, IMG_ARRAY_SIZE(static_prop), static_prop) != napi_ok) {
        HiLog::Error(LABEL, "define properties fail");
        return nullptr;
    }

    HiLog::Debug(LABEL, "Init success");
    return exports;
}

napi_value MyPixelMap::Constructor(napi_env env, napi_callback_info info)
{
    HiLog::Debug(LABEL, "Constructor IN");
    napi_value undefineVar = nullptr;
    napi_get_undefined(env, &undefineVar);

    napi_status status;
    napi_value thisVar = nullptr;
    napi_get_undefined(env, &thisVar);

    napi_get_cb_info(env, info, nullptr, nullptr, &thisVar, nullptr);

    HiLog::Debug(LABEL, "Constructor OUT");
    return thisVar;
}

napi_value MyPixelMap::TestGetImageInfo(napi_env env, napi_callback_info info)
{
    HiLog::Debug(LABEL, "TestGetImageInfo IN");

    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[TEST_ARG_SUM] = {0};
    size_t argCount = TEST_ARG_SUM;

    status = napi_get_cb_info(env, info, &argCount, argValue, &thisVar, nullptr);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "napi_get_cb_info fail");
    }

    HiLog::Debug(LABEL, "OH_GetImageInfo Test|Begin");
    OhosPixelMapInfo pixelMapInfo;
    int32_t res = OH_GetImageInfo(env, argValue[0], &pixelMapInfo);
    HiLog::Debug(LABEL, "OH_GetImageInfo Test|End, res=%{public}d", res);
    HiLog::Debug(LABEL, "OH_GetImageInfo, w=%{public}u, h=%{public}u, r=%{public}u, f=%{public}d",
        pixelMapInfo.width, pixelMapInfo.height, pixelMapInfo.rowSize, pixelMapInfo.pixelFormat);

    HiLog::Debug(LABEL, "TestGetImageInfo OUT");
    return result;
}

napi_value MyPixelMap::TestAccessPixels(napi_env env, napi_callback_info info)
{
    HiLog::Debug(LABEL, "TestAccessPixels IN");

    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[TEST_ARG_SUM] = {0};
    size_t argCount = TEST_ARG_SUM;

    status = napi_get_cb_info(env, info, &argCount, argValue, &thisVar, nullptr);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "napi_get_cb_info fail");
    }

    HiLog::Debug(LABEL, "OH_AccessPixels Test|Begin");
    void* addrPtr = nullptr;
    int32_t res = OH_AccessPixels(env, argValue[0], &addrPtr);
    HiLog::Debug(LABEL, "OH_AccessPixels Test|End, res=%{public}d", res);

    HiLog::Debug(LABEL, "TestAccessPixels OUT");
    return result;
}

napi_value MyPixelMap::TestUnAccessPixels(napi_env env, napi_callback_info info)
{
    HiLog::Debug(LABEL, "TestUnAccessPixels IN");

    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[TEST_ARG_SUM] = {0};
    size_t argCount = TEST_ARG_SUM;

    status = napi_get_cb_info(env, info, &argCount, argValue, &thisVar, nullptr);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "napi_get_cb_info fail");
    }

    HiLog::Debug(LABEL, "OH_UnAccessPixels Test|Begin");
    int32_t res = OH_UnAccessPixels(env, argValue[0]);
    HiLog::Debug(LABEL, "OH_UnAccessPixels Test|End, res=%{public}d", res);

    HiLog::Debug(LABEL, "TestUnAccessPixels OUT");
    return result;
}

/*
 * Function registering all props and functions of ohos.medialibrary module
 */
static napi_value Export(napi_env env, napi_value exports)
{
    HiLog::Error(LABEL, "MyPixelMap CALL");
    MyPixelMap::Init(env, exports);
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
    .nm_modname = "xtstest.mypixelmap",
    .nm_priv = ((void*)0),
    .reserved = {0}
};

/*
 * module register
 */
extern "C" __attribute__((constructor)) void MyPixelMapRegisterModule(void)
{
    napi_module_register(&g_module);
}
}  // namespace Media
}  // namespace OHOS
