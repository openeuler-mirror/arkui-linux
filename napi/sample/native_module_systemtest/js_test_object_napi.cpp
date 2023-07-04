/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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
#include "js_napi_common.h"
#include "js_native_api.h"
#include "napi/native_api.h"
#include "napi/native_common.h"
#include "napi/native_node_api.h"
#include "utils/log.h"
#define NAPI_VERSION 8
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
static const napi_type_tag typeTags[2] = {
    { 0xdaf987b3daf987b3, 0xb745b049b745b049 },
    { 0xbb7936c3bb7936c6, 0xa9548d07a9548d07 }
};

static napi_value ObjectTypeTaggedInstance(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    uint32_t typeIndex = 0;
    napi_value instance = nullptr, whichType = nullptr;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, &whichType, NULL, NULL));
    NAPI_CALL(env, napi_get_value_uint32(env, whichType, &typeIndex));
    NAPI_CALL(env, napi_create_object(env, &instance));
    NAPI_CALL(env, napi_type_tag_object(env, instance, &typeTags[typeIndex]));
    
    HILOG_INFO("%{public}s,called typeIndex=%{public}d", __func__, typeIndex);
    return instance;
}

static napi_value ObjectCheckTypeTag(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 2;
    bool result = false;
    napi_value argv[2] = { nullptr }, js_result = nullptr;
    uint32_t typeIndex = 0;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL));
    NAPI_CALL(env, napi_get_value_uint32(env, argv[0], &typeIndex));
    NAPI_CALL(env, napi_check_object_type_tag(env, argv[1], &typeTags[typeIndex], &result));
    NAPI_CALL(env, napi_get_boolean(env, result, &js_result));

    HILOG_INFO("%{public}s,called typeIndex=%{public}d, result=%{public}s", __func__, typeIndex,
        result ? "true" : "false");
    
    return js_result;
}

static napi_value ObjectFreeze(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

    napi_value object = args[0];
    NAPI_CALL(env, napi_object_freeze(env, object));

    return object;
}

static napi_value ObjectSeal(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

    napi_value object = args[0];
    NAPI_CALL(env, napi_object_seal(env, object));

    return object;
}

void AddReturnedStatus(napi_env env, const char* key, napi_value object,
    char* expected_message, napi_status expected_status, napi_status actual_status)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value propValue = nullptr;

    if (actual_status != expected_status) {
        HILOG_INFO("%{public}s,called actual_status != expected_status", __func__);
    }

    NAPI_CALL_RETURN_VOID(env, napi_create_string_utf8(
        env, expected_message, NAPI_AUTO_LENGTH, &propValue));
    NAPI_CALL_RETURN_VOID(env, napi_set_named_property(env, object, key, propValue));
}

void AddLastStatus(napi_env env, const char* key, napi_value returnValue)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value prop_value = nullptr;
    const napi_extended_error_info* pLastError = nullptr;

    NAPI_CALL_RETURN_VOID(env, napi_get_last_error_info(env, &pLastError));

    NAPI_CALL_RETURN_VOID(env, napi_create_string_utf8(env, (pLastError->error_message == nullptr ?
        "Invalid argument" : pLastError->error_message), NAPI_AUTO_LENGTH, &prop_value));
    
    NAPI_CALL_RETURN_VOID(env, napi_set_named_property(env, returnValue, key, prop_value));
}

static napi_value ObjectGetAllPropertyNames(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);

    napi_value returnValue = nullptr, props = nullptr;
    NAPI_CALL(env, napi_create_object(env, &returnValue));
    napi_status actual_status = napi_get_all_property_names(
        NULL, returnValue, napi_key_own_only, napi_key_writable, napi_key_keep_numbers, &props);
    AddReturnedStatus(env, "envIsNull", returnValue, (char*)("Invalid argument"), napi_invalid_arg, actual_status);
    napi_get_all_property_names(env, NULL, napi_key_own_only, napi_key_writable, napi_key_keep_numbers, &props);

    AddLastStatus(env, "objectIsNull", returnValue);
    napi_get_all_property_names(env, returnValue, napi_key_own_only, napi_key_writable, napi_key_keep_numbers, NULL);
    AddLastStatus(env, "valueIsNull", returnValue);
    return returnValue;
}

napi_value ObjectInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);

    napi_property_descriptor methods[] = {
        DECLARE_NAPI_FUNCTION("testObjectTypeTaggedInstance", ObjectTypeTaggedInstance),
        DECLARE_NAPI_FUNCTION("testObjectCheckTypeTag", ObjectCheckTypeTag),
        DECLARE_NAPI_FUNCTION("testObjectFreeze", ObjectFreeze),
        DECLARE_NAPI_FUNCTION("testObjectSeal", ObjectSeal),
        DECLARE_NAPI_FUNCTION("testObjectGetAllPropertyNames", ObjectGetAllPropertyNames),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(methods) / sizeof(methods[0]), methods));

    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE