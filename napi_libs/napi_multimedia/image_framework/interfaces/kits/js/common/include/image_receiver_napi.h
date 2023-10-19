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

#ifndef INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_RECEIVER_NAPI_H_
#define INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_RECEIVER_NAPI_H_

#include <cerrno>
#include <dirent.h>
#include <fcntl.h>
#include <ftw.h>
#include <securec.h>
#include <sys/stat.h>
#include <unistd.h>
#include <variant>

#include "napi/native_api.h"
#include "napi/native_node_api.h"
#include "pixel_map.h"
#include "image_receiver.h"
#include "image_napi_utils.h"

namespace OHOS {
namespace Media {
struct ImageReceiverCommonArgs;
struct ImageReceiverAsyncContext;
using Context = ImageReceiverAsyncContext*;
using CompleteCallback = void (*)(napi_env env, napi_status status, Context context);
class ImageReceiverNapi {
public:
    ImageReceiverNapi();
    ~ImageReceiverNapi();
    static napi_value Init(napi_env env, napi_value exports);
    static void DoCallBack(std::shared_ptr<ImageReceiverAsyncContext> context,
                           std::string name,
                           CompleteCallback callBack);
    void NativeRelease();
#ifdef IMAGE_DEBUG_FLAG
    bool isCallBackTest = false;
#endif

private:
    static napi_value Constructor(napi_env env, napi_callback_info info);
    static void Destructor(napi_env env, void *nativeObject, void *finalize);

    static napi_value JSCreateImageReceiver(napi_env env, napi_callback_info info);
    static napi_value JsGetSize(napi_env env, napi_callback_info info);
    static napi_value JsGetCapacity(napi_env env, napi_callback_info info);
    static napi_value JsGetFormat(napi_env env, napi_callback_info info);
    static napi_value JsGetReceivingSurfaceId(napi_env env, napi_callback_info info);
    static napi_value JsReadLatestImage(napi_env env, napi_callback_info info);
    static napi_value JsReadNextImage(napi_env env, napi_callback_info info);
    static napi_value JsOn(napi_env env, napi_callback_info info);
    static napi_value JsRelease(napi_env env, napi_callback_info info);

    static bool GetNativeFromEnv(napi_env env, napi_callback_info info, std::shared_ptr<ImageReceiver> &native);
    static napi_value JSCommonProcess(ImageReceiverCommonArgs &args);
#ifdef IMAGE_DEBUG_FLAG
    static napi_value JsTest(napi_env env, napi_callback_info info);
    static napi_value JsCheckDeviceTest(napi_env env, napi_callback_info info);
    static napi_value JsTestYUV(napi_env env, napi_callback_info info);
#endif
    void release();
    static thread_local napi_ref sConstructor_;
    static std::shared_ptr<ImageReceiver> staticInstance_;

    napi_env env_ = nullptr;
    std::shared_ptr<ImageReceiver> imageReceiver_;
    bool isRelease = false;
};
struct ImageReceiverAsyncContext {
    napi_env env = nullptr;
    napi_async_work work = nullptr;
    napi_deferred deferred = nullptr;
    napi_ref callbackRef = nullptr;
    ImageReceiverNapi *constructor_ = nullptr;
    std::shared_ptr<ImageReceiver> receiver_ = nullptr;
    uint32_t status;
};
struct ImageReceiverInnerContext {
    napi_status status;
    napi_value result = nullptr;
    napi_value thisVar = nullptr;
    size_t argc;
    std::vector<napi_value> argv;
    std::string onType;
    int32_t refCount = 1;
    std::unique_ptr<ImageReceiverAsyncContext> context = nullptr;
};

using CommonFunc = bool (*)(ImageReceiverCommonArgs &args, ImageReceiverInnerContext &ic);

enum class CallType : uint32_t {
    STATIC = 0,
    GETTER = 1,
    ASYNC = 2,
};

struct ImageReceiverCommonArgs {
    napi_env env;
    napi_callback_info info;
    CallType async;
    const std::string name;
    CompleteCallback callBack;
    size_t argc;
    CommonFunc queryArgs;
    CommonFunc nonAsyncBack;
    bool asyncLater = false;
};

class ImageReceiverAvaliableListener : public SurfaceBufferAvaliableListener {
public:
    ~ImageReceiverAvaliableListener()
    {
        context = nullptr;
        callBack = nullptr;
    }
    void OnSurfaceBufferAvaliable() override
    {
        ImageReceiverNapi::DoCallBack(context, name, callBack);
    }
    std::shared_ptr<ImageReceiverAsyncContext> context = nullptr;
    std::string name;
    CompleteCallback callBack = nullptr;
};
} // namespace Media
} // namespace OHOS
#endif // INTERFACES_KITS_JS_COMMON_INCLUDE_IMAGE_RECEIVER_NAPI_H_
