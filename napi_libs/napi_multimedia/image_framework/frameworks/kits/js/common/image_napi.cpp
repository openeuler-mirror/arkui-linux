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

#include "image_napi.h"
#include "media_errors.h"
#include "hilog/log.h"
#include "image_format.h"
#include "image_napi_utils.h"

using OHOS::HiviewDFX::HiLog;
using std::string;
using std::shared_ptr;
using std::unique_ptr;
using std::vector;
using std::make_shared;
using std::make_unique;

namespace {
    constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {LOG_CORE, LOG_DOMAIN, "ImageNapi"};
}

namespace OHOS {
namespace Media {
static const std::string CLASS_NAME = "ImageNapi";
static const std::string SURFACE_DATA_SIZE_TAG = "dataSize";
std::shared_ptr<ImageReceiver> ImageNapi::staticImageReceiverInstance_ = nullptr;
std::shared_ptr<ImageCreator> ImageNapi::staticImageCreatorInstance_ = nullptr;
sptr<SurfaceBuffer> ImageNapi::staticInstance_ = nullptr;
thread_local napi_ref ImageNapi::sConstructor_ = nullptr;
static bool receiverTest = false;

const int ARGS0 = 0;
const int ARGS1 = 1;
const int ARGS2 = 2;
const int PARAM0 = 0;
const int PARAM1 = 1;
const int PARAM2 = 2;
const int NUM0 = 0;
const int NUM1 = 1;
const int NUM2 = 2;

ImageNapi::ImageNapi():env_(nullptr)
{}

ImageNapi::~ImageNapi()
{
    release();
}
struct YUV422SPData {
    std::vector<uint8_t> y;
    std::vector<uint8_t> u;
    std::vector<uint8_t> v;
    uint64_t ySize;
    uint64_t uvSize;
};


static void YUV422SPDataCopy(uint8_t* surfaceBuffer, uint64_t bufferSize,
    YUV422SPData &data, bool flip)
{
    uint64_t ui = NUM0, vi = NUM0;
    for (uint64_t i = NUM0; i < bufferSize; i++) {
        if (i < data.ySize) {
            if (flip) {
                surfaceBuffer[i] = data.y[i];
            } else {
                data.y[i] = surfaceBuffer[i];
            }
            continue;
        }
        if (vi >= data.uvSize || ui >= data.uvSize) {
            // Over write buffer size.
            continue;
        }
        if (i % NUM2 == NUM1) {
            if (flip) {
                surfaceBuffer[i] = data.v[vi++];
            } else {
                data.v[vi++] = surfaceBuffer[i];
            }
        } else {
            if (flip) {
                surfaceBuffer[i] = data.u[ui++];
            } else {
                data.u[ui++] = surfaceBuffer[i];
            }
        }
    }
}

static uint64_t GetSurfaceDataSize(sptr<SurfaceBuffer> surface)
{
    if (surface == nullptr) {
        HiLog::Error(LABEL, "Nullptr surface");
        return NUM0;
    }

    uint64_t bufferSize = surface->GetSize();
    auto surfaceExtraData = surface->GetExtraData();
    if (surfaceExtraData == nullptr) {
        HiLog::Error(LABEL, "Nullptr surface extra data. return buffer size %{public}" PRIu64, bufferSize);
        return bufferSize;
    }

    int32_t extraDataSize = NUM0;
    auto res = surfaceExtraData->ExtraGet(SURFACE_DATA_SIZE_TAG, extraDataSize);
    if (res != NUM0) {
        HiLog::Error(LABEL, "Surface ExtraGet dataSize error %{public}d", res);
        return bufferSize;
    } else if (extraDataSize <= NUM0) {
        HiLog::Error(LABEL, "Surface ExtraGet dataSize Ok, but size <= 0");
        return bufferSize;
    } else if (static_cast<uint64_t>(extraDataSize) > bufferSize) {
        HiLog::Error(LABEL,
            "Surface ExtraGet dataSize Ok,but dataSize %{public}d is bigger than bufferSize %{public}" PRIu64,
            extraDataSize, bufferSize);
        return bufferSize;
    }
    HiLog::Info(LABEL, "Surface ExtraGet dataSize %{public}d", extraDataSize);
    return extraDataSize;
}

static uint32_t ProcessYUV422SP(ImageNapi* imageNapi, sptr<SurfaceBuffer> surface)
{
    IMAGE_FUNCTION_IN();
    uint8_t* surfaceBuffer = static_cast<uint8_t*>(surface->GetVirAddr());
    if (surfaceBuffer == nullptr) {
        HiLog::Error(LABEL, "Nullptr surface buffer");
        return ERR_IMAGE_DATA_ABNORMAL;
    }
    uint64_t surfaceSize = GetSurfaceDataSize(surface);
    if (surfaceSize == NUM0) {
        HiLog::Error(LABEL, "Surface size is 0");
        return ERR_IMAGE_DATA_ABNORMAL;
    }
    if (surface->GetHeight() <= NUM0 || surface->GetWidth() <= NUM0) {
        HiLog::Error(LABEL, "Invaild width %{public}" PRId32 " height %{public}" PRId32,
            surface->GetWidth(), surface->GetHeight());
        return ERR_IMAGE_DATA_ABNORMAL;
    }
    uint64_t ySize = static_cast<uint64_t>(surface->GetHeight() * surface->GetWidth());
    uint64_t uvStride = static_cast<uint64_t>((surface->GetWidth() + NUM1) / NUM2);
    uint64_t uvSize = static_cast<uint64_t>(surface->GetHeight() * uvStride);
    if (surfaceSize < (ySize + uvSize * NUM2)) {
        HiLog::Error(LABEL, "Surface size %{public}" PRIu64 " < y plane %{public}" PRIu64
            " + uv plane %{public}" PRIu64, surfaceSize, ySize, uvSize * NUM2);
        return ERR_IMAGE_DATA_ABNORMAL;
    }

    Component* y = imageNapi->CreateComponentData(ComponentType::YUV_Y, ySize, surface->GetWidth(), NUM1);
    Component* u = imageNapi->CreateComponentData(ComponentType::YUV_U, uvSize, uvStride, NUM2);
    Component* v = imageNapi->CreateComponentData(ComponentType::YUV_V, uvSize, uvStride, NUM2);
    if ((y == nullptr) || (u == nullptr) || (v == nullptr)) {
        HiLog::Error(LABEL, "Create Component failed");
        return ERR_IMAGE_DATA_ABNORMAL;
    }
    struct YUV422SPData data;
    data.ySize = ySize;
    data.uvSize = uvSize;
    data.y = y->raw;
    data.u = u->raw;
    data.v = v->raw;
    YUV422SPDataCopy(surfaceBuffer, surfaceSize, data, false);
    return SUCCESS;
}
static uint32_t SplitSurfaceToComponent(ImageNapi* imageNapi, sptr<SurfaceBuffer> surface)
{
    auto surfaceFormat = surface->GetFormat();
    switch (surfaceFormat) {
        case int32_t(ImageFormat::YCBCR_422_SP):
        case int32_t(PIXEL_FMT_YCBCR_422_SP):
            return ProcessYUV422SP(imageNapi, surface);
        default:
            break;
    }
    // Unsupport split component
    return ERR_IMAGE_DATA_UNSUPPORT;
}

static void CommonCallbackRoutine(napi_env env, ImageAsyncContext* &context,
                                  const napi_value &valueParam)
{
    IMAGE_FUNCTION_IN();
    napi_value result[2] = {0};
    napi_value retVal;
    napi_value callback = nullptr;

    napi_get_undefined(env, &result[0]);
    napi_get_undefined(env, &result[1]);

    if (context == nullptr) {
        IMAGE_ERR("context is nullptr");
        return;
    }

    if (context->status == SUCCESS) {
        result[1] = valueParam;
    }

    if (context->deferred) {
        if (context->status == SUCCESS) {
            napi_resolve_deferred(env, context->deferred, result[1]);
        } else {
            ImageNapiUtils::CreateErrorObj(env, result[0], context->status,
                "There is generic napi failure!");
            napi_reject_deferred(env, context->deferred, result[0]);
        }
    } else {
        if (context->status == SUCCESS) {
            napi_create_uint32(env, context->status, &result[0]);
        } else {
            ImageNapiUtils::CreateErrorObj(env, result[0], context->status,
                "There is generic napi failure!");
        }
        napi_get_reference_value(env, context->callbackRef, &callback);
        napi_call_function(env, nullptr, callback, PARAM2, result, &retVal);
        napi_delete_reference(env, context->callbackRef);
    }

    napi_delete_async_work(env, context->work);

    delete context;
    context = nullptr;
    IMAGE_FUNCTION_OUT();
}

void ImageNapi::NativeRelease()
{
    if (imageReceiver_ != nullptr) {
        imageReceiver_->ReleaseBuffer(sSurfaceBuffer_);
        imageReceiver_ = nullptr;
    }
    sSurfaceBuffer_ = nullptr;
    if (componentData_.size() > 0) {
        for (auto iter = componentData_.begin(); iter != componentData_.end(); iter++) {
            iter->second = nullptr;
            componentData_.erase(iter);
        }
    }
}

napi_value ImageNapi::Init(napi_env env, napi_value exports)
{
    IMAGE_FUNCTION_IN();
    napi_property_descriptor props[] = {
        DECLARE_NAPI_GETTER("clipRect", JSGetClipRect),
        DECLARE_NAPI_GETTER("size", JsGetSize),
        DECLARE_NAPI_GETTER("format", JsGetFormat),
        DECLARE_NAPI_FUNCTION("getComponent", JsGetComponent),
        DECLARE_NAPI_FUNCTION("release", JsRelease),
    };
    napi_value constructor = nullptr;

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_define_class(env, CLASS_NAME.c_str(), NAPI_AUTO_LENGTH, Constructor,
        nullptr, IMG_ARRAY_SIZE(props), props, &constructor)),
        nullptr,
        IMAGE_ERR("define class fail")
    );

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_create_reference(env, constructor, 1, &sConstructor_)),
        nullptr,
        IMAGE_ERR("create reference fail")
    );

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(
        napi_set_named_property(env, exports, CLASS_NAME.c_str(), constructor)),
        nullptr,
        IMAGE_ERR("set named property fail")
    );

    IMAGE_DEBUG("Init success");

    IMAGE_FUNCTION_OUT();
    return exports;
}

std::shared_ptr<ImageNapi> ImageNapi::GetImageSource(napi_env env, napi_value image)
{
    std::unique_ptr<ImageNapi> imageNapi = std::make_unique<ImageNapi>();

    napi_status status = napi_unwrap(env, image, reinterpret_cast<void**>(&imageNapi));
    if (!IMG_IS_OK(status)) {
        IMAGE_ERR("GetImage napi unwrap failed");
        return nullptr;
    }

    if (imageNapi == nullptr) {
        IMAGE_ERR("GetImage imageNapi is nullptr");
        return nullptr;
    }
    IMAGE_ERR("get nativeImage");

    return imageNapi;
}

napi_value ImageNapi::Constructor(napi_env env, napi_callback_info info)
{
    napi_value undefineVar = nullptr;
    napi_get_undefined(env, &undefineVar);

    napi_status status;
    napi_value thisVar = nullptr;

    IMAGE_FUNCTION_IN();
    status = napi_get_cb_info(env, info, nullptr, nullptr, &thisVar, nullptr);
    if (status == napi_ok && thisVar != nullptr) {
        std::unique_ptr<ImageNapi> reference = std::make_unique<ImageNapi>();
        if (reference != nullptr) {
            reference->env_ = env;
            reference->sSurfaceBuffer_ = staticInstance_;
            reference->imageReceiver_ = staticImageReceiverInstance_;
            staticImageReceiverInstance_ = nullptr;
            status = napi_wrap(env, thisVar, reinterpret_cast<void *>(reference.get()),
                               ImageNapi::Destructor, nullptr, nullptr);
            if (status == napi_ok) {
                IMAGE_FUNCTION_OUT();
                reference.release();
                return thisVar;
            } else {
                IMAGE_ERR("Failure wrapping js to native napi");
            }
        }
    }

    return undefineVar;
}

void ImageNapi::Destructor(napi_env env, void *nativeObject, void *finalize)
{
}

napi_value ImageNapi::Create(napi_env env, sptr<SurfaceBuffer> surfaceBuffer,
    std::shared_ptr<ImageReceiver> imageReceiver)
{
    napi_status status;
    napi_value constructor = nullptr, result = nullptr;

    IMAGE_FUNCTION_IN();
    if (surfaceBuffer == nullptr) {
        IMAGE_ERR("surfaceBuffer is nullptr");
        return result;
    }

    napi_get_undefined(env, &result);

    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        staticInstance_ = surfaceBuffer;
        staticImageReceiverInstance_ = imageReceiver;
        status = napi_new_instance(env, constructor, 0, nullptr, &result);
        if (status == napi_ok) {
            IMAGE_FUNCTION_OUT();
            return result;
        } else {
            IMAGE_ERR("New instance could not be obtained");
        }
    }

    IMAGE_ERR("Failed to get reference of constructor");
    return result;
}

napi_value ImageNapi::Create(napi_env env, std::shared_ptr<ImageReceiver> imageReceiver)
{
    receiverTest = true;
    napi_status status;
    napi_value constructor = nullptr, result = nullptr;

    IMAGE_FUNCTION_IN();

    napi_get_undefined(env, &result);
    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        staticInstance_ = nullptr;
        staticImageReceiverInstance_ = imageReceiver;
        status = napi_new_instance(env, constructor, 0, nullptr, &result);
        if (status == napi_ok) {
            IMAGE_FUNCTION_OUT();
            return result;
        } else {
            IMAGE_ERR("New instance could not be obtained");
        }
    }

    IMAGE_ERR("Failed to get reference of constructor");
    return result;
}

napi_value ImageNapi::CreateBufferToImage(napi_env env, sptr<SurfaceBuffer> surfaceBuffer,
    std::shared_ptr<ImageCreator> imageCreator)
{
    napi_status status;
    napi_value constructor = nullptr, result = nullptr;

    IMAGE_FUNCTION_IN();
    if (surfaceBuffer == nullptr) {
        IMAGE_ERR("surfaceBuffer is nullptr");
        return result;
    }

    napi_get_undefined(env, &result);

    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        staticInstance_ = surfaceBuffer;
        staticImageCreatorInstance_ = imageCreator;
        status = napi_new_instance(env, constructor, 0, nullptr, &result);
        if (status == napi_ok) {
            IMAGE_FUNCTION_OUT();
            return result;
        } else {
            IMAGE_ERR("New instance could not be obtained");
        }
    }

    IMAGE_ERR("Failed to get reference of constructor");
    return result;
}

unique_ptr<ImageAsyncContext> ImageNapi::UnwarpContext(napi_env env, napi_callback_info info)
{
    napi_status status;
    napi_value thisVar = nullptr;
    size_t argc = ARGS0;

    IMAGE_FUNCTION_IN();

    status = napi_get_cb_info(env, info, &argc, nullptr, &thisVar, nullptr);
    if (status != napi_ok) {
        IMAGE_ERR("fail to napi_get_cb_info %{public}d", status);
        return nullptr;
    }

    unique_ptr<ImageAsyncContext> context = make_unique<ImageAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&context->constructor_));
    if (status != napi_ok || context->constructor_ == nullptr) {
        IMAGE_ERR("fail to unwrap constructor_ %{public}d", status);
        return nullptr;
    }
    return context;
}

static void BuildIntProperty(napi_env env, const std::string &name,
                             int32_t val, napi_value result)
{
    napi_value nVal;
    napi_create_int32(env, val, &nVal);
    napi_set_named_property(env, result, name.c_str(), nVal);
}

static napi_value BuildJsSize(napi_env env, int32_t width, int32_t height)
{
    napi_value result = nullptr;

    napi_create_object(env, &result);

    BuildIntProperty(env, "width", width, result);
    BuildIntProperty(env, "height", height, result);
    return result;
}

static napi_value BuildJsRegion(napi_env env, int32_t width,
                                int32_t height, int32_t x, int32_t y)
{
    napi_value result = nullptr;

    napi_create_object(env, &result);

    napi_set_named_property(env, result, "size", BuildJsSize(env, width, height));

    BuildIntProperty(env, "x", x, result);
    BuildIntProperty(env, "y", y, result);
    return result;
}

napi_value ImageNapi::JSGetClipRect(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    unique_ptr<ImageAsyncContext> context;

    IMAGE_FUNCTION_IN();
    napi_get_undefined(env, &result);
    context = UnwarpContext(env, info);
    if (context == nullptr) {
        return result;
    }

    if (context->constructor_ == nullptr) {
        IMAGE_ERR("Image context is nullptr");
        return result;
    }
    auto surfaceBuffer = context->constructor_->sSurfaceBuffer_;

    if (surfaceBuffer == nullptr && receiverTest == false) {
        IMAGE_ERR("Image surface buffer is nullptr");
        return result;
    }

    if (surfaceBuffer != nullptr && receiverTest == false) {
        return BuildJsRegion(env, surfaceBuffer->GetWidth(), surfaceBuffer->GetHeight(), NUM0, NUM0);
    } else {
        const int32_t WIDTH = 8192;
        const int32_t HEIGHT = 8;
        return BuildJsRegion(env, WIDTH, HEIGHT, NUM0, NUM0);
    }
}

napi_value ImageNapi::JsGetSize(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    unique_ptr<ImageAsyncContext> context;

    IMAGE_FUNCTION_IN();
    napi_get_undefined(env, &result);
    context = UnwarpContext(env, info);
    if (context == nullptr) {
        return result;
    }

    if (context->constructor_ == nullptr) {
        IMAGE_ERR("Image context is nullptr");
        return result;
    }
    auto surfaceBuffer = context->constructor_->sSurfaceBuffer_;

    if (surfaceBuffer == nullptr && receiverTest == false) {
        IMAGE_ERR("Image surface buffer is nullptr");
        return result;
    }

    if (surfaceBuffer == nullptr && receiverTest == true) {
        const int32_t WIDTH = 8192;
        const int32_t HEIGHT = 8;
        return BuildJsSize(env, WIDTH, HEIGHT);
    } else {
        return BuildJsSize(env, surfaceBuffer->GetWidth(), surfaceBuffer->GetHeight());
    }
}

napi_value ImageNapi::JsGetFormat(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    unique_ptr<ImageAsyncContext> context;

    IMAGE_FUNCTION_IN();
    napi_get_undefined(env, &result);
    context = UnwarpContext(env, info);
    if (context == nullptr) {
        return result;
    }

    if (context->constructor_ == nullptr) {
        IMAGE_ERR("Image context is nullptr");
        return result;
    }

    auto surfaceBuffer = context->constructor_->sSurfaceBuffer_;
    if (surfaceBuffer == nullptr && receiverTest == false) {
        IMAGE_ERR("Image surface buffer is nullptr");
        return result;
    }

    if (surfaceBuffer == nullptr && receiverTest == true) {
        const int32_t FORMAT = 12;
        napi_create_int32(env, FORMAT, &result);
    } else {
        napi_create_int32(env, surfaceBuffer->GetFormat(), &result);
    }
    return result;
}

static void JSReleaseCallBack(napi_env env, napi_status status,
                              ImageAsyncContext* context)
{
    IMAGE_FUNCTION_IN();
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    if (context == nullptr) {
        IMAGE_ERR("context is nullptr");
        return;
    }
    context->constructor_->NativeRelease();
    context->status = SUCCESS;

    IMAGE_FUNCTION_OUT();
    CommonCallbackRoutine(env, context, result);
}

napi_value ImageNapi::JsRelease(napi_env env, napi_callback_info info)
{
    IMAGE_FUNCTION_IN();
    napi_status status;
    napi_value result = nullptr, thisVar = nullptr;
    size_t argc = ARGS1;
    napi_value argv[ARGS1] = {0};

    napi_get_undefined(env, &result);

    status = napi_get_cb_info(env, info, &argc, argv, &thisVar, nullptr);
    if (status != napi_ok) {
        IMAGE_ERR("fail to napi_get_cb_info %{public}d", status);
        return result;
    }

    unique_ptr<ImageAsyncContext> context = UnwarpContext(env, info);
    if (context == nullptr) {
        IMAGE_ERR("fail to unwrap constructor_ %{public}d", status);
        return result;
    }

    if (argc == ARGS1) {
        auto argType = ImageNapiUtils::getType(env, argv[PARAM0]);
        if (argType == napi_function) {
            int32_t refCount = 1;
            napi_create_reference(env, argv[PARAM0], refCount, &context->callbackRef);
        } else {
            IMAGE_ERR("Unsupport arg 0 type: %{public}d", argType);
            return result;
        }
    }

    if (context->callbackRef == nullptr) {
        napi_create_promise(env, &(context->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    napi_value resource = nullptr;
    napi_create_string_utf8(env, "JsRelease", NAPI_AUTO_LENGTH, &resource);
    status = napi_create_async_work(
        env, nullptr, resource, [](napi_env env, void* data) {},
        reinterpret_cast<napi_async_complete_callback>(JSReleaseCallBack),
        static_cast<void *>(context.get()), &(context->work));
    if (status != napi_ok) {
        IMAGE_ERR("fail to create async work %{public}d", status);
        return result;
    }

    status = napi_queue_async_work(env, context->work);
    if (status != napi_ok) {
        IMAGE_ERR("fail to queue async work %{public}d", status);
        return result;
    }

    context.release();

    IMAGE_FUNCTION_OUT();
    return result;
}

static bool CreateArrayBuffer(napi_env env, uint8_t* src, size_t srcLen, napi_value *res)
{
    if (src == nullptr || srcLen == 0) {
        return false;
    }
    auto status = napi_create_external_arraybuffer(env, src, srcLen,
        [](napi_env env, void* data, void* hint) { }, nullptr, res);
    if (status != napi_ok) {
        return false;
    }
    return true;
}

static bool IsYUVType(const int32_t& type)
{
    if (type == static_cast<int32_t>(ComponentType::YUV_Y) ||
        type == static_cast<int32_t>(ComponentType::YUV_U) ||
        type == static_cast<int32_t>(ComponentType::YUV_V)) {
        return true;
    }
    return false;
}
static inline bool IsYCbCr422SP(int32_t format)
{
    if (int32_t(ImageFormat::YCBCR_422_SP) == format) {
        return true;
    }
    if (int32_t(PIXEL_FMT_YCBCR_422_SP) == format) {
        return true;
    }
    return false;
}
static void TestGetComponentCallBack(napi_env env, napi_status status, ImageAsyncContext* context)
{
    if (context == nullptr) {
        HiLog::Error(LABEL, "Invalid input context");
        return;
    }
    napi_value result;
    napi_value array;
    void *nativePtr = nullptr;
    if (napi_create_arraybuffer(env, NUM1, &nativePtr, &array) != napi_ok || nativePtr == nullptr) {
        return;
    }
    napi_create_object(env, &result);
    napi_set_named_property(env, result, "byteBuffer", array);
    BuildIntProperty(env, "componentType", context->componentType, result);
    BuildIntProperty(env, "rowStride", NUM0, result);
    BuildIntProperty(env, "pixelStride", NUM0, result);
    context->status = SUCCESS;
    CommonCallbackRoutine(env, context, result);
}
void ImageNapi::JsGetComponentCallBack(napi_env env, napi_status status,
                                       ImageAsyncContext* context)
{
    IMAGE_FUNCTION_IN();
    napi_value result;
    napi_get_undefined(env, &result);

    if (receiverTest) {
        TestGetComponentCallBack(env, status, context);
        return;
    }

    if (context == nullptr || context->constructor_ == nullptr ||
        context->constructor_->sSurfaceBuffer_ == nullptr) {
        HiLog::Error(LABEL, "Invalid input context");
        CommonCallbackRoutine(env, context, result);
        return;
    }

    auto surfaceBuffer = context->constructor_->sSurfaceBuffer_;
    uint32_t bufferSize = 0;
    uint8_t *buffer = nullptr;
    uint32_t rowStride = 0;
    uint32_t pixelStride = 0;
    if (IsYCbCr422SP(surfaceBuffer->GetFormat()) && IsYUVType(context->componentType)) {
        Component* component = context->constructor_->GetComponentData(
            ComponentType(context->componentType));
        if (component != nullptr) {
            bufferSize = component->raw.size();
            buffer = component->raw.data();
            rowStride = component->rowStride;
            pixelStride = component->pixelStride;
        } else {
            context->status = ERROR;
            HiLog::Error(LABEL, "Failed to GetComponentData");
        }
    } else {
        bufferSize = GetSurfaceDataSize(surfaceBuffer);
        buffer = static_cast<uint8_t*>(surfaceBuffer->GetVirAddr());
        rowStride = surfaceBuffer->GetWidth();
        pixelStride = NUM1;
    }

    if (buffer != nullptr && bufferSize != NUM0) {
        napi_value array;
        if (CreateArrayBuffer(env, buffer, bufferSize, &array)) {
            napi_create_object(env, &result);
            napi_set_named_property(env, result, "byteBuffer", array);
            BuildIntProperty(env, "componentType", context->componentType, result);
            BuildIntProperty(env, "rowStride", rowStride, result);
            BuildIntProperty(env, "pixelStride", pixelStride, result);
            context->status = SUCCESS;
        } else {
            HiLog::Error(LABEL, "napi_create_arraybuffer failed!");
        }
    } else {
        HiLog::Error(LABEL, "buffer is nullptr or bufferSize is %{public}" PRIu32, bufferSize);
    }

    IMAGE_FUNCTION_OUT();
    CommonCallbackRoutine(env, context, result);
}

static void JsGetComponentExec(napi_env env, ImageAsyncContext* context)
{
    if (context == nullptr || context->constructor_ == nullptr ||
        context->constructor_->sSurfaceBuffer_ == nullptr) {
        HiLog::Error(LABEL, "Invalid input context");
        return;
    }
    auto surfaceBuffer = context->constructor_->sSurfaceBuffer_;
    HiLog::Info(LABEL,
        "JsGetComponentExec surface buffer type %{public}" PRId32, surfaceBuffer->GetFormat());
    context->status = SplitSurfaceToComponent(context->constructor_, surfaceBuffer);
}

static bool CheckComponentType(const int32_t& type, int32_t format)
{
    if (IsYCbCr422SP(format) && IsYUVType(type)) {
        return true;
    }
    if (!IsYCbCr422SP(format) && type == static_cast<int32_t>(ComponentType::JPEG)) {
        return true;
    }
    return false;
}

static bool JsGetComponentArgs(napi_env env, size_t argc, napi_value* argv, ImageAsyncContext* context)
{
    if (argv == nullptr || context == nullptr) {
        IMAGE_ERR("argv is nullptr");
        return false;
    }

    if (context->constructor_ == nullptr ||
        (!receiverTest && context->constructor_->sSurfaceBuffer_ == nullptr)) {
        IMAGE_ERR("Constructor is nullptr");
        return false;
    }

    if (argc == ARGS1 || argc == ARGS2) {
        auto argType0 = ImageNapiUtils::getType(env, argv[PARAM0]);
        if (argType0 == napi_number) {
            napi_get_value_int32(env, argv[PARAM0], &(context->componentType));
        } else {
            IMAGE_ERR("Unsupport arg 0 type: %{public}d", argType0);
            return false;
        }

        if (!receiverTest) {
            auto surfaceBuffer = context->constructor_->sSurfaceBuffer_;
            if (!CheckComponentType(context->componentType, surfaceBuffer->GetFormat())) {
                IMAGE_ERR("Unsupport component type 0 value: %{public}d", context->componentType);
                return false;
            }
        }
    }
    if (argc == ARGS2) {
        auto argType1 = ImageNapiUtils::getType(env, argv[PARAM1]);
        if (argType1 == napi_function) {
            int32_t refCount = 1;
            napi_create_reference(env, argv[PARAM1], refCount, &(context->callbackRef));
        } else {
            IMAGE_ERR("Unsupport arg 1 type: %{public}d", argType1);
            return false;
        }
    }
    return true;
}

napi_value ImageNapi::JsGetComponent(napi_env env, napi_callback_info info)
{
    IMAGE_FUNCTION_IN();
    napi_status status;
    napi_value result = nullptr, thisVar = nullptr;
    size_t argc = ARGS2;
    napi_value argv[ARGS2] = {0};

    napi_get_undefined(env, &result);

    status = napi_get_cb_info(env, info, &argc, argv, &thisVar, nullptr);
    if (status != napi_ok) {
        IMAGE_ERR("fail to napi_get_cb_info %{public}d", status);
        return result;
    }

    unique_ptr<ImageAsyncContext> context = UnwarpContext(env, info);
    if (context == nullptr) {
        std::string errMsg = "fail to unwrap constructor_ ";
        return ImageNapiUtils::ThrowExceptionError(env, static_cast<int32_t>(napi_invalid_arg),
            errMsg.append(std::to_string(status)));
    }

    if (!JsGetComponentArgs(env, argc, argv, context.get())) {
        return ImageNapiUtils::ThrowExceptionError(env, static_cast<int32_t>(napi_invalid_arg),
            "Unsupport arg type!");
    }

    if (context->callbackRef == nullptr) {
        napi_create_promise(env, &(context->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    napi_value resource = nullptr;
    napi_create_string_utf8(env, "JsGetComponent", NAPI_AUTO_LENGTH, &resource);
    status = napi_create_async_work(
        env, nullptr, resource,
        reinterpret_cast<napi_async_execute_callback>(JsGetComponentExec),
        reinterpret_cast<napi_async_complete_callback>(JsGetComponentCallBack),
        static_cast<void *>(context.get()), &(context->work));
    if (status != napi_ok) {
        IMAGE_ERR("fail to create async work %{public}d", status);
        return result;
    }

    status = napi_queue_async_work(env, context->work);
    if (status != napi_ok) {
        IMAGE_ERR("fail to queue async work %{public}d", status);
        return result;
    }
    context.release();

    IMAGE_FUNCTION_OUT();
    return result;
}

void ImageNapi::release()
{
    if (!isRelease) {
        NativeRelease();
        isRelease = true;
    }
}

Component* ImageNapi::CreateComponentData(ComponentType type, size_t size,
    int32_t rowStride, int32_t pixelStride)
{
    Component* result = nullptr;
    if (size == NUM0) {
        HiLog::Error(LABEL, "Could't create 0 size component data");
        return result;
    }
    auto iter = componentData_.find(type);
    if (iter != componentData_.end()) {
        HiLog::Info(LABEL, "Component %{public}d already exist. No need create", type);
        return iter->second.get();
    }
    std::unique_ptr<Component> component = std::make_unique<Component>();
    component->pixelStride = pixelStride;
    component->rowStride = rowStride;
    component->raw.resize(size);
    componentData_.insert(std::map<ComponentType, std::unique_ptr<Component>>::value_type(type,
        std::move(component)));
    result = GetComponentData(type);
    return result;
}
Component* ImageNapi::GetComponentData(ComponentType type)
{
    auto iter = componentData_.find(type);
    if (iter != componentData_.end()) {
        return iter->second.get();
    }
    return nullptr;
}
uint32_t ImageNapi::CombineComponentsIntoSurface()
{
    if (!IsYCbCr422SP(sSurfaceBuffer_->GetFormat())) {
        HiLog::Info(LABEL, "No need to combine components for NO YUV format now");
        return SUCCESS;
    }
    Component* y = GetComponentData(ComponentType::YUV_Y);
    Component* u = GetComponentData(ComponentType::YUV_U);
    Component* v = GetComponentData(ComponentType::YUV_V);
    if ((y == nullptr) || (u == nullptr) || (v == nullptr)) {
        HiLog::Error(LABEL, "No component need to combine");
        return ERR_IMAGE_DATA_ABNORMAL;
    }
    uint32_t bufferSize = GetSurfaceDataSize(sSurfaceBuffer_);
    uint8_t* buffer = static_cast<uint8_t*>(sSurfaceBuffer_->GetVirAddr());
    struct YUV422SPData data;
    data.ySize = y->raw.size();
    data.uvSize = u->raw.size();
    data.y = y->raw;
    data.u = u->raw;
    data.v = v->raw;
    YUV422SPDataCopy(buffer, bufferSize, data, true);
    return SUCCESS;
}
}  // namespace Media
}  // namespace OHOS
