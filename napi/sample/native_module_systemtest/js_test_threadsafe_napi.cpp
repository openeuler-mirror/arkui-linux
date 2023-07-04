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
static constexpr int ARRAY_LENGTH = 10;
static constexpr int MAX_QUEUE_SIZE = 2;
static constexpr int MAX_THREAD_SIZE = 2;
static constexpr int THREAD_ARG_TWO = 2;
static constexpr int THREAD_ARG_THREE = 3;
static constexpr int THREAD_ARG_FOUR = 4;

static uv_thread_t uv_threads[MAX_THREAD_SIZE];
static napi_threadsafe_function tsfun;

struct TS_FN_HINT {
    napi_threadsafe_function_call_mode blockOnFull = napi_tsfn_blocking;
    napi_threadsafe_function_release_mode abort = napi_tsfn_abort;
    bool startSecondary = false;
    napi_ref jsFinalizeCallBackRef = nullptr;
    uint32_t maxQueueSize = 0;
};
using TsFnHint = struct TS_FN_HINT;

static TsFnHint tsinfo;

// Thread data to transmit to JS
static int transmitData[ARRAY_LENGTH];
static napi_ref testCallbackRef[ARRAY_LENGTH] = { nullptr };

static void ReleaseThreadsafeFunction(void* data)
{
    HILOG_INFO("%{public}s,called", __func__);
    napi_threadsafe_function tsfun = static_cast<napi_threadsafe_function>(data);

    if (napi_release_threadsafe_function(tsfun, napi_tsfn_release) != napi_ok) {
        napi_fatal_error("ReleaseThreadsafeFunction",
            NAPI_AUTO_LENGTH, "napi_release_threadsafe_function failed", NAPI_AUTO_LENGTH);
    }
}
static napi_env gCallEnv = nullptr;
// Source thread producing the data
static void DataSourceThread(void* data)
{
    HILOG_INFO("%{public}s,called start", __func__);
    napi_env env = gCallEnv;
    napi_threadsafe_function tsfun = static_cast<napi_threadsafe_function>(data);
    void* hint = nullptr;
    bool queueWasFull = false, queueWasClosing = false;
    NAPI_CALL_RETURN_VOID(env, napi_get_threadsafe_function_context(tsfun, &hint));
    
    TsFnHint* tsFnInfo = static_cast<TsFnHint*>(hint);
    if (tsFnInfo != &tsinfo) {
        napi_fatal_error("DataSourceThread", NAPI_AUTO_LENGTH,
            "thread-safe function hint is not as expected", NAPI_AUTO_LENGTH);
    }
    if (tsFnInfo->startSecondary) {
        NAPI_CALL_RETURN_VOID(env, napi_acquire_threadsafe_function(tsfun));
        if (uv_thread_create(&uv_threads[1], ReleaseThreadsafeFunction, tsfun) != 0) {
            napi_fatal_error("DataSourceThread", NAPI_AUTO_LENGTH,
                "failed to start secondary thread", NAPI_AUTO_LENGTH);
        }
    }
    for (int index = ARRAY_LENGTH - 1; index > -1 && !queueWasClosing; index--) {
        auto status = napi_call_threadsafe_function(tsfun, &transmitData[index], tsFnInfo->blockOnFull);
        std::string statusStr;
        switch (status) {
            case napi_queue_full:
                queueWasFull = true;
                index++;
                statusStr = "napi_queue_full";
                break;
            case napi_ok:
                statusStr = "napi_ok";
                continue;
            case napi_closing:
                statusStr = "napi_closing";
                queueWasClosing = true;
                break;
            default:
                napi_fatal_error("DataSourceThread", NAPI_AUTO_LENGTH,
                    "napi_call_threadsafe_function failed", NAPI_AUTO_LENGTH);
        }
        HILOG_INFO("%{public}s,called napi_call_threadsafe_function index = %{public}d, status =%{public}s",
            __func__, index, statusStr.c_str());
    }
    if (!queueWasClosing && napi_release_threadsafe_function(tsfun, napi_tsfn_release) != napi_ok) {
        napi_fatal_error(
            "DataSourceThread", NAPI_AUTO_LENGTH, "napi_release_threadsafe_function failed", NAPI_AUTO_LENGTH);
    }
    HILOG_INFO("%{public}s,called end", __func__);
}

// Getting the data into JS
static void CallJsFuntion(napi_env env, napi_value cb, void* hint, void* data)
{
    HILOG_INFO("%{public}s called", __func__);
    if (!(env == nullptr || cb == nullptr)) {
        napi_value argv = nullptr;
        NAPI_CALL_RETURN_VOID(env, napi_create_int32(env, *(int*)data, &argv));

        for (int i = ARRAY_LENGTH - 1; i >= 0; i--) {
            if (testCallbackRef[i]) {
                napi_value callback = 0, undefined = nullptr, result = nullptr;
                napi_get_undefined(env, &undefined);
                napi_get_reference_value(env, testCallbackRef[i], &callback);
                napi_call_function(env, undefined, callback, 1, &argv, &result);
                napi_delete_reference(env, testCallbackRef[i]);
                testCallbackRef[i] = nullptr;
                break;
            }
        }
    }
}

static napi_ref altRef = nullptr;

// Cleanup Param:jsFinalizeCallBack, abort
static napi_value StopThread(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);

    uv_thread_join(&uv_threads[0]);
    if (tsinfo.startSecondary) {
        uv_thread_join(&uv_threads[1]);
    }

    size_t argc = THREAD_ARG_TWO;
    napi_value argv[THREAD_ARG_TWO] = { nullptr };
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));
    napi_valuetype value_type;
    NAPI_CALL(env, napi_typeof(env, argv[0], &value_type));
    NAPI_ASSERT(env, value_type == napi_function, "StopThread argument is a function");
    NAPI_ASSERT(env, (tsfun != nullptr), "Existing threadsafe function");
    NAPI_CALL(env, napi_create_reference(env, argv[0], 1, &(tsinfo.jsFinalizeCallBackRef)));
    bool abort = false;
    NAPI_CALL(env, napi_get_value_bool(env, argv[1], &abort));
    NAPI_CALL(env, napi_release_threadsafe_function(tsfun, abort ? napi_tsfn_abort : napi_tsfn_release));
    tsfun = nullptr;
    return nullptr;
}

// Join the thread and inform JS that we're done.
static void FinalizeCallBack(napi_env env, void* data, void* hint)
{
    HILOG_INFO("%{public}s,called", __func__);

    TsFnHint* theHint = static_cast<TsFnHint*>(hint);
    napi_value jsCallback = nullptr, undefined = nullptr, result = nullptr;

    NAPI_CALL_RETURN_VOID(env, napi_get_reference_value(env, theHint->jsFinalizeCallBackRef, &jsCallback));
    NAPI_CALL_RETURN_VOID(env, napi_get_undefined(env, &undefined));
    NAPI_CALL_RETURN_VOID(env, napi_call_function(env, undefined, jsCallback, 0, nullptr, &result));
    NAPI_CALL_RETURN_VOID(env, napi_delete_reference(env, theHint->jsFinalizeCallBackRef));
    if (altRef != nullptr) {
        NAPI_CALL_RETURN_VOID(env, napi_delete_reference(env, altRef));
        altRef = nullptr;
    }
}
// jsfunc, abort/release, startSecondary, maxQueueSize
static napi_value StartThreadInternal(napi_env env, napi_callback_info info,
    napi_threadsafe_function_call_js cb, bool blockOnFull, bool altRefJSCallBack)
{
    HILOG_INFO("%{public}s,called start", __func__);
    gCallEnv = env;
    size_t argc = THREAD_ARG_FOUR;
    napi_value argv[THREAD_ARG_FOUR] = { 0 };

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));
    if (altRefJSCallBack) {
        NAPI_CALL(env, napi_create_reference(env, argv[0], 1, &altRef));
        argv[0] = nullptr;
    }

    for (int i = 0; i<ARRAY_LENGTH; i++) {
        napi_create_reference(env, argv[0], 1, &testCallbackRef[i]);
    }

    tsinfo.blockOnFull = (blockOnFull ? napi_tsfn_blocking : napi_tsfn_nonblocking);

    NAPI_ASSERT(env, (tsfun == nullptr), "Existing thread-safe function");
    napi_value asyncName;
    NAPI_CALL(env, napi_create_string_utf8(env, "N-API Thread-safe Function Test", NAPI_AUTO_LENGTH, &asyncName));
    NAPI_CALL(env, napi_get_value_uint32(env, argv[THREAD_ARG_THREE], &tsinfo.maxQueueSize));

    NAPI_CALL(env, napi_create_threadsafe_function(env, argv[0], nullptr, asyncName, tsinfo.maxQueueSize,
        MAX_THREAD_SIZE, uv_threads, FinalizeCallBack, &tsinfo, cb, &tsfun));
    bool abort = false;
    NAPI_CALL(env, napi_get_value_bool(env, argv[1], &abort));
    tsinfo.abort = abort ? napi_tsfn_abort : napi_tsfn_release;
    NAPI_CALL(env, napi_get_value_bool(env, argv[THREAD_ARG_TWO], &(tsinfo.startSecondary)));

    NAPI_ASSERT(env, (uv_thread_create(&uv_threads[0], DataSourceThread, tsfun) == 0), "Thread creation");
    HILOG_INFO("%{public}s,called end", __func__);
    return nullptr;
}

// Startup  param: jsfunc, abort/release, startSecondary, maxQueueSize
static napi_value StartThread(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    // blockOnFull:true  altRefJSCallBack:false
    return StartThreadInternal(env, info, CallJsFuntion, true, false);
}

static napi_value StartThreadNonblocking(napi_env env, napi_callback_info info)
{
    HILOG_INFO("%{public}s,called", __func__);
    // blockOnFull:false  altRefJSCallBack:false
    return StartThreadInternal(env, info, CallJsFuntion, false, false);
}

// Module init
napi_value ThreadSafeInit(napi_env env, napi_value exports)
{
    HILOG_INFO("%{public}s,called", __func__);

    for (size_t index = 0; index < ARRAY_LENGTH; index++) {
        transmitData[index] = index;
    }
    napi_value jsArrayLength = 0, jsMaxQueueSize = 0;
    napi_create_uint32(env, ARRAY_LENGTH, &jsArrayLength);
    napi_create_uint32(env, MAX_QUEUE_SIZE, &jsMaxQueueSize);

    napi_property_descriptor properties[] = {
        DECLARE_NAPI_FUNCTION("testStartThread", StartThread),
        DECLARE_NAPI_FUNCTION("testStartThreadNonblocking", StartThreadNonblocking),
        DECLARE_NAPI_FUNCTION("testStopThread", StopThread),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(properties) / sizeof(properties[0]), properties));
    return exports;
}
} // namespace SYSTEM_TEST_NAPI
} // namespace NAPI
} // namespace ACE
