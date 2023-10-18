/*
 * Copyright (C) 2022 Huawei Device Co., Ltd.
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

#ifndef FRAMEWORKS_KITS_JS_COMMON_INCLUDE_IMAGE_NAPI_UTILS_H_
#define FRAMEWORKS_KITS_JS_COMMON_INCLUDE_IMAGE_NAPI_UTILS_H_

#include "napi/native_api.h"
#include "napi/native_node_api.h"

#define IMG_IS_OK(x) ((x) == napi_ok)
#define IMG_NOT_NULL(p) ((p) != nullptr)
#define IMG_IS_READY(x, p) (IMG_IS_OK(x) && IMG_NOT_NULL(p))

#define IMG_NAPI_CHECK_RET_D(x, res, msg) \
do \
{ \
    if (!(x)) \
    { \
        msg; \
        return (res); \
    } \
} while (0)

#define IMG_NAPI_CHECK_RET(x, res) \
do \
{ \
    if (!(x)) \
    { \
        return (res); \
    } \
} while (0)

#define IMG_JS_ARGS(env, info, status, argc, argv, thisVar) \
do \
{ \
    status = napi_get_cb_info(env, info, &argc, argv, &thisVar, nullptr); \
} while (0)

#define IMG_JS_NO_ARGS(env, info, status, thisVar) \
do \
{ \
    status = napi_get_cb_info(env, info, nullptr, nullptr, &thisVar, nullptr); \
} while (0)

#define IMG_CREATE_CREATE_ASYNC_WORK(env, status, workName, exec, complete, aContext, work) \
do \
{ \
    napi_value _resource = nullptr; \
    napi_create_string_utf8((env), (workName), NAPI_AUTO_LENGTH, &_resource); \
    (status) = napi_create_async_work(env, nullptr, _resource, (exec), \
            (complete), static_cast<void*>((aContext).get()), &(work)); \
    if ((status) == napi_ok) { \
        (status) = napi_queue_async_work((env), (work)); \
        if ((status) == napi_ok) { \
            (aContext).release(); \
        } \
    } \
} while (0)

#define IMG_ARRAY_SIZE(array) (sizeof(array) / sizeof((array)[0]))

#define GET_BUFFER_BY_NAME(root, name, res, len) ImageNapiUtils::GetBufferByName(env, (root), (name), &(res), &(len))
#define GET_UINT32_BY_NAME(root, name, res) ImageNapiUtils::GetUint32ByName(env, (root), (name), &(res))
#define GET_INT32_BY_NAME(root, name, res) ImageNapiUtils::GetInt32ByName(env, (root), (name), &(res))
#define GET_BOOL_BY_NAME(root, name, res) ImageNapiUtils::GetBoolByName(env, (root), (name), &(res))
#define GET_NODE_BY_NAME(root, name, res) ImageNapiUtils::GetNodeByName(env, (root), (name), &(res))

#define STATIC_EXEC_FUNC(name) static void name ## Exec(napi_env env, void *data)
#define STATIC_COMPLETE_FUNC(name) static void name ## Complete(napi_env env, napi_status status, void *data)

#define DECORATOR_HILOG(op, fmt, args...) \
do { \
    op(LABEL, fmt, ##args); \
} while (0)

#define IMAGE_ERR(fmt, ...) DECORATOR_HILOG(HiLog::Error, fmt, ##__VA_ARGS__)
#ifdef IMAGE_DEBUG_FLAG
#define IMAGE_INFO(fmt, ...) DECORATOR_HILOG(HiLog::Info, fmt, ##__VA_ARGS__)
#define IMAGE_DEBUG(fmt, ...) DECORATOR_HILOG(HiLog::Debug, fmt, ##__VA_ARGS__)
#define IMAGE_FUNCTION_IN(fmt, ...) DECORATOR_HILOG(HiLog::Info, fmt "%{public}s IN", __FUNCTION__, ##__VA_ARGS__)
#define IMAGE_FUNCTION_OUT(fmt, ...) DECORATOR_HILOG(HiLog::Info, fmt "%{public}s OUT", __FUNCTION__, ##__VA_ARGS__)
#define IMAGE_LINE_IN(fmt, ...) DECORATOR_HILOG(HiLog::Info, fmt "%{public}d IN", __LINE__, ##__VA_ARGS__)
#define IMAGE_LINE_OUT(fmt, ...) DECORATOR_HILOG(HiLog::Info, fmt "%{public}d OUT", __LINE__, ##__VA_ARGS__)
#else
#define IMAGE_INFO(fmt, ...)
#define IMAGE_DEBUG(fmt, ...)
#define IMAGE_FUNCTION_IN(fmt, ...)
#define IMAGE_FUNCTION_OUT(fmt, ...)
#define IMAGE_LINE_IN(fmt, ...)
#define IMAGE_LINE_OUT(fmt, ...)
#endif

namespace OHOS {
namespace Media {
class ImageNapiUtils {
public:
    static bool GetBufferByName(napi_env env, napi_value root, const char* name, void **res, size_t* len);
    static bool GetUint32ByName(napi_env env, napi_value root, const char* name, uint32_t *res);
    static bool GetInt32ByName(napi_env env, napi_value root, const char* name, int32_t *res);
    static bool GetBoolByName(napi_env env, napi_value root, const char* name, bool *res);
    static bool GetNodeByName(napi_env env, napi_value root, const char* name, napi_value *res);
    static bool GetUtf8String(napi_env env, napi_value root, std::string &res, bool eof = true);
    static napi_valuetype getType(napi_env env, napi_value root);
    static bool CreateArrayBuffer(napi_env env, void* src, size_t srcLen, napi_value *res);
    static void HicheckerReport();
    static void CreateErrorObj(napi_env env, napi_value &errorObj,
        const int32_t errCode, const std::string errMsg);
    static napi_value ThrowExceptionError(napi_env env, const int32_t errCode, const std::string errMsg);
};
} // namespace Media
} // namespace OHOS
#endif // FRAMEWORKS_KITS_JS_COMMON_INCLUDE_IMAGE_NAPI_UTILS_H_
