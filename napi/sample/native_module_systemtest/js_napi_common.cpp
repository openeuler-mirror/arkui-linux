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

namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {

bool IsTypeForNapiValue(napi_env env, napi_value param, napi_valuetype expectType)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_valuetype valueType = napi_undefined;

    if (napi_typeof(env, param, &valueType) != napi_ok) {
        return false;
    }
    return valueType == expectType;
}

bool UnwrapIntValue(napi_env env, napi_value jsValue, int& result)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_valuetype jsValueType = napi_undefined;
    NAPI_CALL_BASE(env, napi_typeof(env, jsValue, &jsValueType), false);
    if (jsValueType != napi_number) {
        return false;
    }
    int32_t natValue32 = 0;
    NAPI_CALL_BASE(env, napi_get_value_int32(env, jsValue, &natValue32), false);
    result = static_cast<int>(natValue32);
    return true;
}

napi_value UnwrapStringParam(std::string& str, napi_env env, napi_value argv)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_valuetype valueType = napi_valuetype::napi_undefined;

    napi_status rev = napi_typeof(env, argv, &valueType);
    if (rev != napi_ok) {
        return nullptr;
    }

    if (valueType != napi_valuetype::napi_string) {
        HILOG_INFO("%{public}s called, Parameter type does not match", __func__);
        return nullptr;
    }

    size_t len;
    napi_status status = napi_get_value_string_utf8(env, argv, nullptr, 0, &len);
    if (status != napi_ok) {
        HILOG_INFO("%{public}s called, Get locale tag length failed", __func__);
        return nullptr;
    }
    std::vector<char> buf(len + 1);
    status = napi_get_value_string_utf8(env, argv, buf.data(), len + 1, &len);
    if (status != napi_ok) {
        HILOG_INFO("%{public}s called, Get locale tag failed", __func__);
        return nullptr;
    }
    str = std::string(buf.data());

    napi_value result = nullptr;
    NAPI_CALL(env, napi_create_int32(env, 1, &result));
    return result;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE