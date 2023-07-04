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
#include "napi/native_api.h"
#include "napi/native_common.h"
#include "napi/native_node_api.h"
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
static constexpr size_t bufferSizeAt16 = 128;
static constexpr size_t bufferSizeAt16Ext = 4;

static napi_value TestStringUtf16(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");
    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_string, "Wrong type of argment. Expects a string.");
    char16_t buffer[bufferSizeAt16] = { 0 };
    size_t buffer_size = bufferSizeAt16;
    size_t copied;

    NAPI_CALL(env, napi_get_value_string_utf16(env, args[0], buffer, buffer_size, &copied));
    napi_value output = nullptr;
    NAPI_CALL(env, napi_create_string_utf16(env, buffer, copied, &output));
    return output;
}

static napi_value TestStringUtf16Insufficient(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");

    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_string, "Wrong type of argment. Expects a string.");

    char16_t buffer[bufferSizeAt16Ext] = { 0 };
    size_t buffer_size = bufferSizeAt16Ext;
    size_t copied;

    NAPI_CALL(env, napi_get_value_string_utf16(env, args[0], buffer, buffer_size, &copied));

    napi_value output = nullptr;
    NAPI_CALL(env, napi_create_string_utf16(env, buffer, copied, &output));

    return output;
}

static napi_value TestStringUtf16Length(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");

    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_string, "Wrong type of argment. Expects a string.");

    size_t length;
    NAPI_CALL(env, napi_get_value_string_utf16(env, args[0], NULL, 0, &length));

    napi_value output;
    NAPI_CALL(env, napi_create_uint32(env, (uint32_t)length, &output));

    return output;
}

static napi_value TestStringLargeUtf16(napi_env env, napi_callback_info info)
{
    napi_value output = nullptr;
    if (SIZE_MAX > INT_MAX) {
        NAPI_CALL(env, napi_create_string_utf16(env, ((const char16_t*)""), ((size_t)INT_MAX) + 1, &output));
    } else {
        NAPI_CALL(env, napi_throw_error(env, NULL, "Invalid argument"));
    }

    return output;
}

napi_value JsStringInit(napi_env env, napi_value exports)
{
    napi_property_descriptor descriptors[] = {
        DECLARE_NAPI_FUNCTION("testStringUtf16", TestStringUtf16),
        DECLARE_NAPI_FUNCTION("testStringUtf16Insufficient", TestStringUtf16Insufficient),
        DECLARE_NAPI_FUNCTION("testStringUtf16Length", TestStringUtf16Length),
        DECLARE_NAPI_FUNCTION("testStringLargeUtf16", TestStringLargeUtf16),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(descriptors) / sizeof(*descriptors), descriptors));
    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
