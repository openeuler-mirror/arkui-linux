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
#include <cstring>
#include <uv.h>
#include "js_napi_common.h"
#include "napi/native_api.h"
#include "napi/native_common.h"
#include "napi/native_node_api.h"
#include "utils/log.h"
#include "securec.h"
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
static const char theText[] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

static int deleterCallCount = 0;
static void DeleteTheTextFun(napi_env env, void* data, void* finalize_hint)
{
    HILOG_INFO("%{public}s,called", __func__);
    NAPI_ASSERT_RETURN_VOID(env, data != nullptr && strcmp(static_cast<char*>(data), theText) == 0, "invalid data");
    (void)finalize_hint;
    free(data);
    deleterCallCount++;
}

static napi_value NewBufferFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value theBuffer = nullptr;
    char* theCopy = nullptr;

    size_t argc = 1;
    napi_value args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments");
    napi_valuetype theType;
    NAPI_CALL(env, napi_typeof(env, args[0], &theType));
    NAPI_ASSERT(env, theType == napi_string, "NewBufferFun: instance is not an string object");

    std::string paraStr;
    UnwrapStringParam(paraStr, env, args[0]);
    HILOG_INFO("%{public}s, ====step1===args[0] = %{public}s", __func__, paraStr.c_str());

    NAPI_CALL(env, napi_create_buffer(env, paraStr.size()+1, (void**)(&theCopy), &theBuffer));
    NAPI_ASSERT(env, theCopy, "Failed to copy static text for NewBufferFun");
    
    if (memcpy_s(theCopy, paraStr.size(), paraStr.c_str(), paraStr.size()) != 0) {
        return nullptr;
    }

    return theBuffer;
}
static constexpr int32_t TMP_BUJJER_SIZE = 4;
static char tmpBuffer[TMP_BUJJER_SIZE];
static napi_value NewExternalBufferFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value theBuffer = nullptr;

    size_t argc = 1;
    napi_value args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments");
    napi_valuetype theType;
    NAPI_CALL(env, napi_typeof(env, args[0], &theType));
    NAPI_ASSERT(env, theType == napi_string, "NewExternalBufferFun: instance is not an string object");

    std::string paraStr;
    UnwrapStringParam(paraStr, env, args[0]);
    if (memset_s(tmpBuffer, sizeof(tmpBuffer), 0, sizeof(tmpBuffer)) != 0) {
        return nullptr;
    }

    if (memcpy_s(tmpBuffer, sizeof(tmpBuffer), paraStr.c_str(), sizeof(tmpBuffer)) != 0) {
        return nullptr;
    }
    HILOG_INFO("%{public}s, ====step1===args[0] = %{public}s", __func__, paraStr.c_str());
    NAPI_CALL(env, napi_create_external_buffer(env, TMP_BUJJER_SIZE, tmpBuffer,
        DeleteTheTextFun, nullptr, &theBuffer));

    return theBuffer;
}

static napi_value CopyBufferFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value theBuffer = nullptr, args[1] = { nullptr };
    void* result_data = nullptr;

    size_t argc = 1;
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments");
    napi_valuetype theType;
    NAPI_CALL(env, napi_typeof(env, args[0], &theType));
    NAPI_ASSERT(env, theType == napi_string, "CopyBufferFun: instance is not an string object");

    std::string paraStr;
    UnwrapStringParam(paraStr, env, args[0]);
    HILOG_INFO("%{public}s, ====step1===args[0] = %{public}s", __func__, paraStr.c_str());
    NAPI_CALL(env, napi_create_buffer_copy(env, paraStr.size()+1,
        const_cast<char*>(paraStr.c_str()), &result_data, &theBuffer));
    HILOG_INFO("%{public}s,end", __func__);
    HILOG_INFO("%{public}s,str", static_cast<char*>(result_data));
    return theBuffer;
}

static napi_value BufferHasInstanceFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments");
    napi_value theBuffer = args[0];
    bool hasInstance = false;
    napi_valuetype theType;

    NAPI_CALL(env, napi_typeof(env, theBuffer, &theType));
    NAPI_ASSERT(env, theType == napi_object, "BufferHasInstanceFun: instance is not an object");
    NAPI_CALL(env, napi_is_buffer(env, theBuffer, &hasInstance));
    NAPI_ASSERT(env, hasInstance, "BufferHasInstanceFun: instance is not a buffer");
    napi_value returnValue = nullptr;
    NAPI_CALL(env, napi_get_boolean(env, hasInstance, &returnValue));
    return returnValue;
}

static napi_value BufferInfoFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments");
    napi_valuetype theType;
    NAPI_CALL(env, napi_typeof(env, args[0], &theType));
    NAPI_ASSERT(env, theType == napi_object, "BufferInfoFun: param is not a string object");

    napi_value theBuffer = args[0];
    char* bufferData = nullptr;
    napi_value returnValue = nullptr;
    size_t bufferLength;
    NAPI_CALL(env, napi_get_buffer_info(env, theBuffer, (void**)(&bufferData), &bufferLength));
    NAPI_CALL(env, napi_create_string_utf8(env, bufferData, std::strlen(bufferData), &returnValue));

    return returnValue;
}

napi_value BufferInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value theValue = nullptr;

    NAPI_CALL(env, napi_create_string_utf8(env, theText, sizeof(theText), &theValue));
    NAPI_CALL(env, napi_set_named_property(env, exports, "theText", theValue));

    napi_property_descriptor methods[] = {
        DECLARE_NAPI_FUNCTION("testNewBufferFun", NewBufferFun),
        DECLARE_NAPI_FUNCTION("testNewExternalBufferFun", NewExternalBufferFun),
        DECLARE_NAPI_FUNCTION("testCopyBufferFun", CopyBufferFun),
        DECLARE_NAPI_FUNCTION("testBufferHasInstance", BufferHasInstanceFun),
        DECLARE_NAPI_FUNCTION("testBufferInfoFun", BufferInfoFun)
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(methods) / sizeof(methods[0]), methods));
    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
