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
#include <memory>

#include "js_napi_common.h"
#include "napi/native_api.h"
#include "napi/native_common.h"
#include "napi/native_node_api.h"
#include "utils/log.h"

namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
static const constexpr int32_t gFinalizeHintData = 100;
static void InstancesFinalizeCallBack(napi_env env, void* finalizeData, void* finalizeHint)
{
    HILOG_INFO("%{public}s,called", __func__);
    HILOG_INFO("%{public}s,called end.", __func__);
}

static napi_value GetModuleName(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 0, "Wrong number of arguments.");

    const char* data = nullptr;
    NAPI_CALL(env, node_api_get_module_file_name(env, &data));
    std::shared_ptr<char> module(const_cast<char*>(data));
    napi_value jsValue = nullptr;

    if (module != nullptr) {
        HILOG_INFO("%{public}s,called moduleName = %{public}s", __func__, data);
        NAPI_CALL(env, napi_create_string_utf8(env, data, NAPI_AUTO_LENGTH, &jsValue));
    } else {
        NAPI_CALL(env, napi_get_null(env, &jsValue));
    }

    return jsValue;
}

static napi_value SetInstanceData(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments.");

    int32_t result = 0;
    NAPI_CALL(env, napi_get_value_int32(env, args[0], &result));
    NAPI_CALL(env, napi_set_instance_data(env, (void*)&result, InstancesFinalizeCallBack, (void*)&gFinalizeHintData));

    return args[0];
}

static napi_value GetInstanceData(napi_env env, napi_callback_info info)
{
    const char* moduleName = nullptr;
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc == 0, "Wrong number of arguments.");

    NAPI_CALL(env, node_api_get_module_file_name(env, &moduleName));
    napi_value jsString;
    NAPI_CALL(env, napi_create_string_utf8(env, moduleName, NAPI_AUTO_LENGTH, &jsString));

    std::shared_ptr<char> name(const_cast<char*>(moduleName));
    HILOG_INFO("%{public}s,called moduleName = %{public}s", __func__, name.get());
    return jsString;
}
napi_value InstanceDataInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_property_descriptor descriptors[] = { DECLARE_NAPI_FUNCTION("testGetModuleName", GetModuleName),
        DECLARE_NAPI_FUNCTION("testSetInstanceData", SetInstanceData),
        DECLARE_NAPI_FUNCTION("testGetInstanceData", GetInstanceData) };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(descriptors) / sizeof(*descriptors), descriptors));

    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE