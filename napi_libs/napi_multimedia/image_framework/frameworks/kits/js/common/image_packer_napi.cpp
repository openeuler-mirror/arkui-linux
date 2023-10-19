/*
 * Copyright (C) 2021 Huawei Device Co., Ltd.
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

#include "image_packer_napi.h"
#include "hilog/log.h"
#include "media_errors.h"
#include "image_napi_utils.h"
#include "image_packer.h"
#include "image_source.h"
#include "image_source_napi.h"
#include "pixel_map_napi.h"
#include "image_trace.h"
#include "hitrace_meter.h"

using OHOS::HiviewDFX::HiLog;
namespace {
    constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {LOG_CORE, LOG_DOMAIN, "ImagePackerNapi"};
    constexpr uint32_t NUM_0 = 0;
    constexpr uint32_t NUM_1 = 1;
    constexpr uint32_t NUM_2 = 2;
}

namespace OHOS {
namespace Media {
static const std::string CLASS_NAME_IMAGEPACKER = "ImagePacker";
std::shared_ptr<ImagePacker> ImagePackerNapi::sImgPck_ = nullptr;
std::shared_ptr<ImageSource> ImagePackerNapi::sImgSource_ = nullptr;
thread_local napi_ref ImagePackerNapi::sConstructor_ = nullptr;

const int ARGS_THREE = 3;
const int PARAM0 = 0;
const int PARAM1 = 1;
const int PARAM2 = 2;
const int PARAM3 = 3;
const uint8_t BYTE_FULL = 0xFF;
const int32_t SIZE = 100;
const int32_t TYPE_IMAGE_SOURCE = 1;
const int32_t TYPE_PIXEL_MAP = 2;
const int64_t DEFAULT_BUFFER_SIZE = 10 * 1024 * 1024; // 10M is the maximum default packedSize

struct ImagePackerAsyncContext {
    napi_env env;
    napi_async_work work;
    napi_deferred deferred;
    napi_ref callbackRef = nullptr;
    napi_ref errorMsg = nullptr;
    ImagePackerNapi *constructor_;
    bool status = false;
    std::shared_ptr<ImageSource> rImageSource;
    PackOption packOption;
    std::shared_ptr<ImagePacker> rImagePacker;
    std::shared_ptr<PixelMap> rPixelMap;
    std::unique_ptr<uint8_t[]> resultBuffer;
    int32_t packType = TYPE_IMAGE_SOURCE;
    int64_t resultBufferSize = 0;
    int64_t packedSize = 0;
};

struct PackingOption {
    std::string format;
    uint8_t quality = 100;
};

ImagePackerNapi::ImagePackerNapi():env_(nullptr)
{}

ImagePackerNapi::~ImagePackerNapi()
{
    release();
}

static void CommonCallbackRoutine(napi_env env, ImagePackerAsyncContext* &connect, const napi_value &valueParam)
{
    HiLog::Debug(LABEL, "CommonCallbackRoutine enter");
    napi_value result[NUM_2] = {0};
    napi_value retVal;
    napi_value callback = nullptr;

    napi_get_undefined(env, &result[NUM_0]);
    napi_get_undefined(env, &result[NUM_1]);

    if (connect->status == SUCCESS) {
        result[NUM_1] = valueParam;
    } else if (connect->errorMsg != nullptr) {
        napi_get_reference_value(env, connect->errorMsg, &result[NUM_0]);
        napi_delete_reference(env, connect->errorMsg);
    } else {
        napi_create_string_utf8(env, "Internal error", NAPI_AUTO_LENGTH, &(result[NUM_0]));
    }

    if (connect->deferred) {
        if (connect->status == SUCCESS) {
            napi_resolve_deferred(env, connect->deferred, result[NUM_1]);
        } else {
            napi_reject_deferred(env, connect->deferred, result[NUM_0]);
        }
    } else {
        napi_get_reference_value(env, connect->callbackRef, &callback);
        napi_call_function(env, nullptr, callback, PARAM2, result, &retVal);
        napi_delete_reference(env, connect->callbackRef);
    }

    napi_delete_async_work(env, connect->work);

    delete connect;
    connect = nullptr;
    HiLog::Debug(LABEL, "CommonCallbackRoutine exit");
}

static void BuildMsgOnError(napi_env env,
    ImagePackerAsyncContext* context, bool assertion, const std::string msg)
{
    napi_value tmpError;
    napi_status status;
    if (!assertion) {
        HiLog::Error(LABEL, "%{public}s", msg.c_str());
        status = napi_create_string_utf8(env, msg.c_str(), NAPI_AUTO_LENGTH, &tmpError);
        if (status != napi_ok) {
            HiLog::Error(LABEL, "Create error msg error");
            return;
        }
        napi_create_reference(env, tmpError, NUM_1, &(context->errorMsg));
    }
}

STATIC_EXEC_FUNC(Packing)
{
    HiLog::Debug(LABEL, "PackingExec enter");
    int64_t packedSize = 0;
    auto context = static_cast<ImagePackerAsyncContext*>(data);
    HiLog::Debug(LABEL, "image packer get supported format");
    std::set<std::string> formats;
    uint32_t ret = context->rImagePacker->GetSupportedFormats(formats);
    if (ret != SUCCESS) {
        HiLog::Error(LABEL, "image packer get supported format failed, ret=%{public}u.", ret);
    }
    HiLog::Info(LABEL, "ImagePacker BufferSize %{public}" PRId64, context->resultBufferSize);
    context->resultBuffer = std::make_unique<uint8_t[]>(
        (context->resultBufferSize <= 0)?DEFAULT_BUFFER_SIZE:context->resultBufferSize);
    if (context->resultBuffer == nullptr) {
        BuildMsgOnError(env, context, context->resultBuffer == nullptr, "ImagePacker buffer alloc error");
        return;
    }
    context->rImagePacker->StartPacking(context->resultBuffer.get(),
        context->resultBufferSize, context->packOption);
    if (context->packType == TYPE_IMAGE_SOURCE) {
        HiLog::Info(LABEL, "ImagePacker set image source");
        if (context->rImageSource == nullptr) {
            BuildMsgOnError(env, context, context->rImageSource == nullptr, "ImageSource is nullptr");
            return;
        }
        context->rImagePacker->AddImage(*(context->rImageSource));
    } else {
        HiLog::Info(LABEL, "ImagePacker set pixelmap");
        if (context->rPixelMap == nullptr) {
            BuildMsgOnError(env, context, context->rImageSource == nullptr, "Pixelmap is nullptr");
            return;
        }
        context->rImagePacker->AddImage(*(context->rPixelMap));
    }
    context->rImagePacker->FinalizePacking(packedSize);
    HiLog::Debug(LABEL, "packedSize=%{public}" PRId64, packedSize);
    if (packedSize > 0 && (packedSize < context->resultBufferSize)) {
        context->packedSize = packedSize;
        context->status = SUCCESS;
    } else {
        context->status = ERROR;
        HiLog::Error(LABEL, "Packing failed, packedSize outside size.");
    }
    HiLog::Debug(LABEL, "PackingExec exit");
}

STATIC_COMPLETE_FUNC(PackingError)
{
    HiLog::Debug(LABEL, "PackingErrorComplete IN");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);
    auto context = static_cast<ImagePackerAsyncContext*>(data);
    context->status = ERROR;
    HiLog::Debug(LABEL, "PackingErrorComplete OUT");
    CommonCallbackRoutine(env, context, result);
}

STATIC_COMPLETE_FUNC(Packing)
{
    HiLog::Debug(LABEL, "PackingComplete enter");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);
    auto context = static_cast<ImagePackerAsyncContext*>(data);

    if (!ImageNapiUtils::CreateArrayBuffer(env, context->resultBuffer.get(),
                                           context->packedSize, &result)) {
        context->status = ERROR;
        HiLog::Error(LABEL, "napi_create_arraybuffer failed!");
        napi_get_undefined(env, &result);
    } else {
        context->status = SUCCESS;
    }
    context->resultBuffer = nullptr;
    context->resultBufferSize = 0;
    HiLog::Debug(LABEL, "PackingComplete exit");
    CommonCallbackRoutine(env, context, result);
}

napi_value ImagePackerNapi::Init(napi_env env, napi_value exports)
{
    napi_property_descriptor props[] = {
        DECLARE_NAPI_FUNCTION("packing", Packing),
        DECLARE_NAPI_FUNCTION("packingFromPixelMap", Packing),
        DECLARE_NAPI_FUNCTION("release", Release),
        DECLARE_NAPI_GETTER("supportedFormats", GetSupportedFormats),
    };
    napi_property_descriptor static_prop[] = {
        DECLARE_NAPI_STATIC_FUNCTION("createImagePacker", CreateImagePacker),
    };

    napi_value constructor = nullptr;

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_define_class(env, CLASS_NAME_IMAGEPACKER.c_str(), NAPI_AUTO_LENGTH, Constructor,
        nullptr, IMG_ARRAY_SIZE(props), props, &constructor)), nullptr,
        HiLog::Error(LABEL, "define class fail")
    );

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_create_reference(env, constructor, 1, &sConstructor_)),
        nullptr,
        HiLog::Error(LABEL, "create reference fail")
    );

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_set_named_property(env, exports, CLASS_NAME_IMAGEPACKER.c_str(), constructor)),
        nullptr,
        HiLog::Error(LABEL, "set named property fail")
    );
    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_define_properties(env, exports, IMG_ARRAY_SIZE(static_prop), static_prop)),
        nullptr,
        HiLog::Error(LABEL, "define properties fail")
    );

    HiLog::Debug(LABEL, "Init success");
    return exports;
}

napi_value ImagePackerNapi::Constructor(napi_env env, napi_callback_info info)
{
    napi_value undefineVar = nullptr;
    napi_get_undefined(env, &undefineVar);

    napi_status status;
    napi_value thisVar = nullptr;

    HiLog::Debug(LABEL, "Constructor in");
    status = napi_get_cb_info(env, info, nullptr, nullptr, &thisVar, nullptr);
    if (status == napi_ok && thisVar != nullptr) {
        std::unique_ptr<ImagePackerNapi> pImgPackerNapi = std::make_unique<ImagePackerNapi>();
        if (pImgPackerNapi != nullptr) {
            pImgPackerNapi->env_ = env;
            pImgPackerNapi->nativeImgPck = sImgPck_;
            status = napi_wrap(env, thisVar, reinterpret_cast<void *>(pImgPackerNapi.get()),
                               ImagePackerNapi::Destructor, nullptr, nullptr);
            if (status == napi_ok) {
                pImgPackerNapi.release();
                return thisVar;
            } else {
                HiLog::Error(LABEL, "Failure wrapping js to native napi");
            }
        }
    }

    return undefineVar;
}

napi_value ImagePackerNapi::CreateImagePacker(napi_env env, napi_callback_info info)
{
    StartTrace(HITRACE_TAG_ZIMAGE, "CreateImagePacker");
    napi_value constructor = nullptr;
    napi_value result = nullptr;
    napi_status status;

    HiLog::Debug(LABEL, "CreateImagePacker IN");
    std::shared_ptr<ImagePacker> imagePacker = std::make_shared<ImagePacker>();
    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        sImgPck_ = imagePacker;
        status = napi_new_instance(env, constructor, 0, nullptr, &result);
        if (status == napi_ok) {
            return result;
        } else {
            HiLog::Error(LABEL, "New instance could not be obtained");
        }
    }
    FinishTrace(HITRACE_TAG_ZIMAGE);
    return result;
}

void ImagePackerNapi::Destructor(napi_env env, void *nativeObject, void *finalize)
{
}

static int64_t parseBufferSize(napi_env env, napi_value root)
{
    napi_value tempValue = nullptr;
    int64_t tmpNumber = DEFAULT_BUFFER_SIZE;
    if (napi_get_named_property(env, root, "bufferSize", &tempValue) != napi_ok) {
        HiLog::Info(LABEL, "No bufferSize, Using default");
        return tmpNumber;
    }
    napi_get_value_int64(env, tempValue, &tmpNumber);
    HiLog::Info(LABEL, "BufferSize is %{public}" PRId64, tmpNumber);
    if (tmpNumber < 0) {
        return DEFAULT_BUFFER_SIZE;
    }
    return tmpNumber;
}

static bool parsePackOptions(napi_env env, napi_value root, PackOption* opts)
{
    napi_value tmpValue = nullptr;
    uint32_t tmpNumber = 0;

    HiLog::Debug(LABEL, "parsePackOptions IN");
    if (!GET_NODE_BY_NAME(root, "format", tmpValue)) {
        HiLog::Error(LABEL, "No format in pack option");
        return false;
    }

    bool isFormatArray = false;
    napi_is_array(env, tmpValue, &isFormatArray);
    auto formatType = ImageNapiUtils::getType(env, tmpValue);

    HiLog::Debug(LABEL, "parsePackOptions format type %{public}d, is array %{public}d",
        formatType, isFormatArray);

    char buffer[SIZE] = {0};
    size_t res = 0;
    if (napi_string == formatType) {
        if (napi_get_value_string_utf8(env, tmpValue, buffer, SIZE, &res) != napi_ok) {
            HiLog::Error(LABEL, "Parse pack option format failed");
            return false;
        }
        opts->format = std::string(buffer);
    } else if (isFormatArray) {
        uint32_t len = 0;
        if (napi_get_array_length(env, tmpValue, &len) != napi_ok) {
            HiLog::Error(LABEL, "Parse pack napi_get_array_length failed");
            return false;
        }
        HiLog::Debug(LABEL, "Parse pack array_length=%{public}u", len);
        for (size_t i = 0; i < len; i++) {
            napi_value item;
            napi_get_element(env, tmpValue, i, &item);
            if (napi_get_value_string_utf8(env, item, buffer, SIZE, &res) != napi_ok) {
                HiLog::Error(LABEL, "Parse format in item failed %{public}zu", i);
                continue;
            }
            opts->format = std::string(buffer);
            HiLog::Debug(LABEL, "format is %{public}s.", opts->format.c_str());
        }
    } else {
        HiLog::Error(LABEL, "Invalid pack option format type");
        return false;
    }
    HiLog::Debug(LABEL, "parsePackOptions format:[%{public}s]", opts->format.c_str());

    if (!GET_UINT32_BY_NAME(root, "quality", tmpNumber)) {
        HiLog::Error(LABEL, "No quality in pack option");
        return false;
    }
    if (tmpNumber > SIZE) {
        HiLog::Error(LABEL, "Invalid quality");
        opts->quality = BYTE_FULL;
    } else {
        opts->quality = static_cast<uint8_t>(tmpNumber & 0xff);
    }
    HiLog::Debug(LABEL, "parsePackOptions OUT");
    return true;
}

static int32_t ParserPackingArgumentType(napi_env env, napi_value argv)
{
    napi_value constructor = nullptr;
    napi_value global = nullptr;
    bool isInstance = false;
    napi_status ret = napi_invalid_arg;

    napi_get_global(env, &global);

    ret = napi_get_named_property(env, global, "ImageSource", &constructor);
    if (ret != napi_ok) {
        HiLog::Error(LABEL, "Get ImageSourceNapi property failed!");
    }

    ret = napi_instanceof(env, argv, constructor, &isInstance);
    if (ret == napi_ok && isInstance) {
        HiLog::Debug(LABEL, "This is ImageSourceNapi type!");
        return TYPE_IMAGE_SOURCE;
    }

    ret = napi_get_named_property(env, global, "PixelMap", &constructor);
    if (ret != napi_ok) {
        HiLog::Error(LABEL, "Get PixelMapNapi property failed!");
    }

    ret = napi_instanceof(env, argv, constructor, &isInstance);
    if (ret == napi_ok && isInstance) {
        HiLog::Debug(LABEL, "This is PixelMapNapi type!");
        return TYPE_PIXEL_MAP;
    }

    HiLog::Error(LABEL, "Inalued type!");
    return TYPE_IMAGE_SOURCE;
}

static std::shared_ptr<ImageSource> GetImageSourceFromNapi(napi_env env, napi_value value)
{
    if (env == nullptr || value == nullptr) {
        HiLog::Error(LABEL, "GetImageSourceFromNapi input is null");
    }
    std::unique_ptr<ImageSourceNapi> imageSourceNapi = std::make_unique<ImageSourceNapi>();
    napi_status status = napi_unwrap(env, value, reinterpret_cast<void**>(&imageSourceNapi));
    if (!IMG_IS_OK(status)) {
        HiLog::Error(LABEL, "GetImageSourceFromNapi napi unwrap failed");
        return nullptr;
    }
    if (imageSourceNapi == nullptr) {
        HiLog::Error(LABEL, "GetImageSourceFromNapi imageSourceNapi is nullptr");
        return nullptr;
    }
    return imageSourceNapi.release()->nativeImgSrc;
}

static void ParserPackingArguments(napi_env env,
    napi_value* argv, size_t argc, ImagePackerAsyncContext* context)
{
    int32_t refCount = 1;
    if (argc < PARAM1 || argc > PARAM3) {
        BuildMsgOnError(env, context, (argc < PARAM1 || argc > PARAM3), "Arguments Count error");
    }
    context->packType = ParserPackingArgumentType(env, argv[PARAM0]);
    if (context->packType == TYPE_IMAGE_SOURCE) {
        context->rImageSource = GetImageSourceFromNapi(env, argv[PARAM0]);
        BuildMsgOnError(env, context, context->rImageSource != nullptr, "ImageSource mismatch");
    } else {
        context->rPixelMap = PixelMapNapi::GetPixelMap(env, argv[PARAM0]);
        BuildMsgOnError(env, context, context->rPixelMap != nullptr, "PixelMap mismatch");
    }
    if (argc > PARAM1 && ImageNapiUtils::getType(env, argv[PARAM1]) == napi_object) {
        BuildMsgOnError(env, context,
            parsePackOptions(env, argv[PARAM1], &(context->packOption)), "PackOptions mismatch");
        context->resultBufferSize = parseBufferSize(env, argv[PARAM1]);
    }
    if (argc > PARAM2 && ImageNapiUtils::getType(env, argv[PARAM2]) == napi_function) {
        napi_create_reference(env, argv[PARAM2], refCount, &(context->callbackRef));
    }
}

napi_value ImagePackerNapi::Packing(napi_env env, napi_callback_info info)
{
    StartTrace(HITRACE_TAG_ZIMAGE, "Packing");
    napi_status status;
    napi_value result = nullptr;
    size_t argc = ARGS_THREE;
    napi_value argv[ARGS_THREE] = {0};
    napi_value thisVar = nullptr;

    HiLog::Debug(LABEL, "Packing IN");
    napi_get_undefined(env, &result);

    IMG_JS_ARGS(env, info, status, argc, argv, thisVar);
    NAPI_ASSERT(env, IMG_IS_OK(status), "fail to napi_get_cb_info");

    std::unique_ptr<ImagePackerAsyncContext> asyncContext = std::make_unique<ImagePackerAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&asyncContext->constructor_));
    NAPI_ASSERT(env, IMG_IS_READY(status, asyncContext->constructor_), "fail to unwrap constructor_");

    asyncContext->rImagePacker = std::move(asyncContext->constructor_->nativeImgPck);
    ParserPackingArguments(env, argv, argc, asyncContext.get());
    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    }

    ImageNapiUtils::HicheckerReport();

    if (asyncContext->errorMsg != nullptr) {
        IMG_CREATE_CREATE_ASYNC_WORK(env, status, "PackingError",
            [](napi_env env, void *data) {}, PackingErrorComplete, asyncContext, asyncContext->work);
    } else {
        IMG_CREATE_CREATE_ASYNC_WORK(env, status, "Packing",
            PackingExec, PackingComplete, asyncContext, asyncContext->work);
    }

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status),
        nullptr, HiLog::Error(LABEL, "fail to create async work"));
    FinishTrace(HITRACE_TAG_ZIMAGE);
    return result;
}

napi_value ImagePackerNapi::GetSupportedFormats(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    napi_value thisVar = nullptr;
    size_t argCount = 0;
    HiLog::Debug(LABEL, "GetSupportedFormats IN");

    IMG_JS_ARGS(env, info, status, argCount, nullptr, thisVar);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), result, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImagePackerAsyncContext> context = std::make_unique<ImagePackerAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&context->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, context->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));
    std::set<std::string> formats;
    uint32_t ret = context->constructor_->nativeImgPck->GetSupportedFormats(formats);

    IMG_NAPI_CHECK_RET_D((ret == SUCCESS),
        nullptr, HiLog::Error(LABEL, "fail to get supported formats"));

    napi_create_array(env, &result);
    size_t i = 0;
    for (const std::string& formatStr: formats) {
        napi_value format = nullptr;
        napi_create_string_latin1(env, formatStr.c_str(), formatStr.length(), &format);
        napi_set_element(env, result, i, format);
        i++;
    }
    return result;
}

static void ReleaseComplete(napi_env env, napi_status status, void *data)
{
    HiLog::Debug(LABEL, "ReleaseComplete IN");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    auto context = static_cast<ImagePackerAsyncContext*>(data);
    if (context != nullptr && context->constructor_ != nullptr) {
        delete context->constructor_;
        context->constructor_ = nullptr;
    }
    HiLog::Debug(LABEL, "ReleaseComplete OUT");
    CommonCallbackRoutine(env, context, result);
}

napi_value ImagePackerNapi::Release(napi_env env, napi_callback_info info)
{
    StartTrace(HITRACE_TAG_ZIMAGE, "Release");
    HiLog::Debug(LABEL, "Release enter");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    int32_t refCount = 1;
    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_1] = {0};
    size_t argCount = 1;

    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    HiLog::Debug(LABEL, "Release argCount is [%{public}zu]", argCount);
    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), result, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImagePackerAsyncContext> context = std::make_unique<ImagePackerAsyncContext>();
    status = napi_remove_wrap(env, thisVar, reinterpret_cast<void**>(&context->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, context->constructor_), result,
        HiLog::Error(LABEL, "fail to unwrap context"));
    HiLog::Debug(LABEL, "Release argCount is [%{public}zu]", argCount);
    if (argCount == 1 && ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_function) {
        napi_create_reference(env, argValue[NUM_0], refCount, &context->callbackRef);
    }

    if (context->callbackRef == nullptr) {
        napi_create_promise(env, &(context->deferred), &result);
    }

    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "Release",
        [](napi_env env, void *data) {}, ReleaseComplete, context, context->work);
    HiLog::Debug(LABEL, "Release exit");
    FinishTrace(HITRACE_TAG_ZIMAGE);
    return result;
}
void ImagePackerNapi::release()
{
    if (!isRelease) {
        nativeImgPck = nullptr;
        isRelease = true;
    }
}
}  // namespace Media
}  // namespace OHOS
