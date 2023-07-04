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
#include <uv.h>
#include "js_napi_common.h"
#include "napi/native_api.h"
#include "napi/native_common.h"
#include "napi/native_node_api.h"
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
napi_value ScopeRunInCallback(napi_env env, napi_callback_info info)
{
    static constexpr int SCOPE_ARGC_TWO = 2;
    static constexpr int SCOPE_ARGC_THREE = 3;
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = SCOPE_ARGC_THREE;
    napi_value args[SCOPE_ARGC_THREE] = { nullptr };

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, nullptr, nullptr, nullptr));
    NAPI_ASSERT(env, argc == SCOPE_ARGC_THREE, "Wrong number of arguments");

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_object, "Wrong type of arguments. Expects an object as first argument.");

    NAPI_CALL(env, napi_typeof(env, args[1], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_string, "Wrong type of arguments. Expects a string as second argument.");

    NAPI_CALL(env, napi_typeof(env, args[SCOPE_ARGC_TWO], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_function, "Wrong type of arguments. Expects a function as third argument.");

    napi_async_context context;
    NAPI_CALL(env, napi_async_init(env, args[0], args[1], &context));

    napi_callback_scope scope = nullptr;
    NAPI_CALL(env, napi_open_callback_scope(env, args[0], context, &scope));

    napi_value result = nullptr;
    NAPI_CALL(env, napi_call_function(env, args[0], args[SCOPE_ARGC_TWO], 0, nullptr, &result));

    NAPI_CALL(env, napi_close_callback_scope(env, scope));
    NAPI_CALL(env, napi_async_destroy(env, context));

    return result;
}

napi_value CallBackScopeInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_property_descriptor descriptors[] = {
        DECLARE_NAPI_FUNCTION("testScopeRunInCallback", ScopeRunInCallback),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(descriptors) / sizeof(*descriptors), descriptors));

    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
