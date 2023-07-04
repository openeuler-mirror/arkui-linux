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
#ifndef OHOS_ACE_TEST_NAPI_COMMON_H
#define OHOS_ACE_TEST_NAPI_COMMON_H
#include <memory>
#include <string>

#include "napi/native_api.h"
#include "napi/native_common.h"
#include "napi/native_node_api.h"
#include "utils/log.h"
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {

#define NAPI_CALL_BASE_BOOL(theCall, retVal) \
    do {                                     \
        if ((theCall) == false) {            \
            return retVal;                   \
        }                                    \
    } while (0)

    bool IsTypeForNapiValue(napi_env env, napi_value param, napi_valuetype expectType);
    bool UnwrapIntValue(napi_env env, napi_value jsValue, int& result);
    napi_value UnwrapStringParam(std::string& str, napi_env env, napi_value argv);
    napi_value BigIntInit(napi_env env, napi_value exports);
    napi_value BufferInit(napi_env env, napi_value exports);
    napi_value ThreadSafeInit(napi_env env, napi_value exports);
    napi_value JsDateInit(napi_env env, napi_value exports);
    napi_value CallBackScopeInit(napi_env env, napi_value exports);
    napi_value JsStringInit(napi_env env, napi_value exports);
    napi_value ObjectInit(napi_env env, napi_value exports);
    napi_value ArrayDetachInit(napi_env env, napi_value exports);
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
#endif // OHOS_ACE_NAPI_COMMON_H