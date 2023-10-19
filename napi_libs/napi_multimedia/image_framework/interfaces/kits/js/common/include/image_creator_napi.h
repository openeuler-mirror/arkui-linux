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

#ifndef IMAGE_CREATOR_NAPI_H_
#define IMAGE_CREATOR_NAPI_H_

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
#include "image_creator.h"
#include "image_napi_utils.h"
#include "image_source.h"
#include "image_napi.h"
#include "image_receiver_napi.h"
#include "image_receiver.h"


namespace OHOS {
namespace Media {
struct ImageCreatorCommonArgs;
struct ImageCreatorAsyncContext;
using Contextc = ImageCreatorAsyncContext* ;
using CompleteCreatorCallback = void (*)(napi_env env, napi_status status, Contextc context);
class ImageCreatorNapi {
public:
    ImageCreatorNapi();
    ~ImageCreatorNapi();
    static napi_value Init(napi_env env, napi_value exports);
    static void DoCallBack(std::shared_ptr<ImageCreatorAsyncContext> context,
                           std::string name,
                           CompleteCreatorCallback callBack);
    void NativeRelease();
#ifdef IMAGE_DEBUG_FLAG
    bool isCallBackTest = false;
#endif

private:
    static napi_value Constructor(napi_env env, napi_callback_info info);
    static void Destructor(napi_env env, void *nativeObject, void *finalize);

    static napi_value JSCreateImageCreator(napi_env env, napi_callback_info info);
    static napi_value JsGetCapacity(napi_env env, napi_callback_info info);
    static napi_value JsGetFormat(napi_env env, napi_callback_info info);
    static napi_value JsGetSize(napi_env env, napi_callback_info info);
    static napi_value JsDequeueImage(napi_env env, napi_callback_info info);
    static napi_value JsQueueImage(napi_env env, napi_callback_info info);
    static napi_value JsOn(napi_env env, napi_callback_info info);
    static napi_value JsRelease(napi_env env, napi_callback_info info);

    static bool GetNativeFromEnv(napi_env env, napi_callback_info info, std::shared_ptr<ImageCreator> &native);
    static napi_value JSCommonProcess(ImageCreatorCommonArgs &args);
    static void JsQueueImageCallBack(napi_env env, napi_status status,
                                     ImageCreatorAsyncContext* context);
#ifdef IMAGE_DEBUG_FLAG
    static napi_value JsTest(napi_env env, napi_callback_info info);
#endif
    void release();
    bool isRelease = false;

    static thread_local napi_ref sConstructor_;
    static std::shared_ptr<ImageCreator> staticInstance_;

    napi_env env_ = nullptr;
    std::shared_ptr<ImageCreator> imageCreator_;
};
struct ImageCreatorAsyncContext {
    napi_env env = nullptr;
    napi_async_work work = nullptr;
    napi_deferred deferred = nullptr;
    napi_ref callbackRef = nullptr;
    ImageCreatorNapi *constructor_ = nullptr;
    std::shared_ptr<ImageCreator> creator_ = nullptr;
    uint32_t status;
    sptr<SurfaceBuffer> surfaceBuffer;
    std::shared_ptr<ImageSource> imageSource_;
    std::shared_ptr<ImageNapi> imageNapi_;
};
struct ImageCreatorInnerContext {
    napi_status status;
    napi_value result = nullptr;
    napi_value thisVar = nullptr;
    size_t argc;
    std::vector<napi_value> argv;
    std::string onType;
    int32_t refCount = 1;
    std::unique_ptr<ImageCreatorAsyncContext> context = nullptr;
};

using CreatorCommonFunc = bool (*)(ImageCreatorCommonArgs &args, ImageCreatorInnerContext &ic);

enum class CreatorCallType : uint32_t {
    STATIC = 0,
    GETTER = 1,
    ASYNC = 2,
};

struct ImageCreatorCommonArgs {
    napi_env env;
    napi_callback_info info;
    CreatorCallType async;
    const std::string name;
    CompleteCreatorCallback callBack;
    size_t argc;
    CreatorCommonFunc queryArgs;
    CreatorCommonFunc nonAsyncBack;
    bool asyncLater = false;
};

class ImageCreatorReleaseListener : public SurfaceBufferReleaseListener {
public:
    ~ImageCreatorReleaseListener()
    {
        context = nullptr;
        callBack = nullptr;
    }
    void OnSurfaceBufferRelease() override
    {
        ImageCreatorNapi::DoCallBack(context, name, callBack);
    }
    std::shared_ptr<ImageCreatorAsyncContext> context = nullptr;
    std::string name;
    CompleteCreatorCallback callBack = nullptr;
};

class CreatorSurfaceListener : public SurfaceBufferAvaliableListener {
public:
        void OnSurfaceBufferAvaliable() override;
    };
} // namespace Media
} // namespace OHOS
#endif /* IMAGE_CREATOR_NAPI_H_ */
