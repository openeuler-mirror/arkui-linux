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
#include "utils/log.h"
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
static napi_value CreateArrayBuffer(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);

    void* arrayBufferPtr = nullptr;
    napi_value arrayBuffer = nullptr;
    size_t arrayBufferSize = 1024*4;
    NAPI_CALL(env, napi_create_arraybuffer(env, arrayBufferSize, &arrayBufferPtr, &arrayBuffer));

    return arrayBuffer;
}

static napi_value DetachArrayBuffer(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments.");

    bool  isArrayBuffer = false;
    NAPI_CALL(env, napi_is_arraybuffer(env, args[0], &isArrayBuffer));
    HILOG_INFO("%{public}s called isArrayBuffer = %{public}s", __func__, (isArrayBuffer == true) ? "true" : "false");
    NAPI_ASSERT(env,  isArrayBuffer, "Wrong type of arguments. Expects a typedarray as first argument.");

    NAPI_CALL(env, napi_detach_arraybuffer(env, args[0]));
    HILOG_INFO("%{public}s called end", __func__);

    napi_value result = 0;
    napi_get_null(env, &result);
    return result;
}

static napi_value IsDetachedArrayBuffer(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments.");

    napi_value array_buffer = args[0];
    bool isArrayBuffer = false;
    NAPI_CALL(env, napi_is_arraybuffer(env, array_buffer, &isArrayBuffer));
    NAPI_ASSERT(env, isArrayBuffer, "Wrong type of arguments. Expects an array buffer as first argument.");

    bool isDetached = false;
    NAPI_CALL(env, napi_is_detached_arraybuffer(env, array_buffer, &isDetached));

    napi_value result = nullptr;
    NAPI_CALL(env, napi_get_boolean(env, isDetached, &result));

    return result;
}

napi_value ArrayDetachInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);

    napi_property_descriptor descriptors[] = {
        DECLARE_NAPI_FUNCTION("testCreateArrayBuffer", CreateArrayBuffer),
        DECLARE_NAPI_FUNCTION("testDetachArrayBuffer", DetachArrayBuffer),
        DECLARE_NAPI_FUNCTION("testIsDetachedArrayBuffer", IsDetachedArrayBuffer),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(descriptors) / sizeof(*descriptors), descriptors));

    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
