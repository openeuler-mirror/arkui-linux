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
static napi_value CreateDateFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");

    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_number, "Wrong type of arguments. Expects a number as first argument.");

    double time = 0;
    NAPI_CALL(env, napi_get_value_double(env, args[0], &time));

    napi_value date = nullptr;
    NAPI_CALL(env, napi_create_date(env, time, &date));

    return date;
}

static napi_value IsDateFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value date = nullptr, result = nullptr;
    size_t argc = 1;
    bool is_date = false;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, &date, nullptr, nullptr));
    NAPI_CALL(env, napi_is_date(env, date, &is_date));
    NAPI_CALL(env, napi_get_boolean(env, is_date, &result));

    return result;
}

static napi_value GetDateValueFun(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_value date = nullptr, result = nullptr;
    size_t argc = 1;
    double value = 0;
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, &date, nullptr, nullptr));
    NAPI_CALL(env, napi_get_date_value(env, date, &value));
    NAPI_CALL(env, napi_create_double(env, value, &result));

    return result;
}

napi_value JsDateInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);
    
    napi_property_descriptor descriptors[] = {
        DECLARE_NAPI_FUNCTION("testCreateDateFun", CreateDateFun),
        DECLARE_NAPI_FUNCTION("testIsDateFun", IsDateFun),
        DECLARE_NAPI_FUNCTION("testGetDateValueFun", GetDateValueFun),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(descriptors) / sizeof(descriptors[0]), descriptors));
    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
