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
#include "utils/log.h"
namespace ACE {
namespace NAPI {
namespace SYSTEM_TEST_NAPI {
static napi_value BigIntIsLossless(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 2;
    napi_value args[2] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    bool is_signed = false;
    NAPI_CALL(env, napi_get_value_bool(env, args[1], &is_signed));

    bool lossless = false;
    if (is_signed) {
        int64_t input = 0;
        NAPI_CALL(env, napi_get_value_bigint_int64(env, args[0], &input, &lossless));
    } else {
        uint64_t input = 0;
        NAPI_CALL(env, napi_get_value_bigint_uint64(env, args[0], &input, &lossless));
    }

    napi_value output = nullptr;
    NAPI_CALL(env, napi_get_boolean(env, lossless, &output));

    return output;
}

static napi_value BigInt64(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");
    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_bigint, "Wrong type of arguments. Expects a bigint as first argument.");
    int64_t input = 0;
    bool lossless = false;
    NAPI_CALL(env, napi_get_value_bigint_int64(env, args[0], &input, &lossless));
    napi_value output = nullptr;
    NAPI_CALL(env, napi_create_bigint_int64(env, input, &output));
    return output;
}

static napi_value BigUint64(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");

    napi_valuetype valuetype0;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));

    NAPI_ASSERT(env, valuetype0 == napi_bigint, "Wrong type of arguments. Expects a bigint as first argument.");

    uint64_t input = 0;
    bool lossless = false;
    NAPI_CALL(env, napi_get_value_bigint_uint64(env, args[0], &input, &lossless));

    napi_value output = nullptr;
    NAPI_CALL(env, napi_create_bigint_uint64(env, input, &output));

    return output;
}

static napi_value BigIntWords(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    size_t argc = 1;
    napi_value args[1] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    NAPI_ASSERT(env, argc >= 1, "Wrong number of arguments");

    napi_valuetype valuetype;
    NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
    NAPI_ASSERT(env, valuetype == napi_bigint, "Wrong type of arguments. Expects a bigint as first argument.");

    size_t expected_word_count;
    NAPI_CALL(env, napi_get_value_bigint_words(env, args[0], nullptr, &expected_word_count, nullptr));

    int sign_bit = 0;
    size_t word_count = 10;
    uint64_t words[10] = { 0 };

    NAPI_CALL(env, napi_get_value_bigint_words(env, args[0], &sign_bit, &word_count, words));
    NAPI_ASSERT(env, word_count == expected_word_count, "word counts do not match");

    napi_value output = nullptr;
    NAPI_CALL(env, napi_create_bigint_words(env, sign_bit, word_count, words, &output));

    return output;
}

// throws RangeError
static napi_value CreateTooBigBigInt(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    int sign_bit = 0;
    size_t word_count = 10;
    uint64_t words[10] = { 0 };
    napi_value output = nullptr;
    NAPI_CALL(env, napi_create_bigint_words(env, sign_bit, word_count, words, &output));

    return output;
}

napi_value BigIntInit(napi_env env, napi_value exports)
{
    napi_property_descriptor descriptors[] = {
        DECLARE_NAPI_FUNCTION("testBigIntIsLossless", BigIntIsLossless),
        DECLARE_NAPI_FUNCTION("testBigInt64", BigInt64),
        DECLARE_NAPI_FUNCTION("testBigUint64", BigUint64),
        DECLARE_NAPI_FUNCTION("testBigIntWords", BigIntWords),
        DECLARE_NAPI_FUNCTION("testCreateTooBigBigInt", CreateTooBigBigInt),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(descriptors) / sizeof(descriptors[0]), descriptors));

    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
