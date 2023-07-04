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
#include "utils/log.h"

namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
EXTERN_C_START
/*
 * The module initialization.
 */
static napi_value ModuleInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);
    BigIntInit(env, exports);
    BufferInit(env, exports);
    ThreadSafeInit(env, exports);
    JsDateInit(env, exports);
    CallBackScopeInit(env, exports);
    JsStringInit(env, exports);
    ObjectInit(env, exports);
    ArrayDetachInit(env, exports);
    return exports;
}
EXTERN_C_END

/*
 * The module definition.
 */
static napi_module NapiSystemtestModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = ModuleInit,
    .nm_modname = "systemtestnapi",
    .nm_priv = ((void*)0),
    .reserved = { 0 }
};

/*
 * The module registration.
 */
extern "C" __attribute__((constructor)) void RegisterModule(void)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_module_register(&NapiSystemtestModule);
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE