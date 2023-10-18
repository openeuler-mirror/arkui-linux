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

#include "image_source_napi.h"
#include <fcntl.h>
#include "hilog/log.h"
#include "image_napi_utils.h"
#include "media_errors.h"
#include "string_ex.h"
#include "image_trace.h"
#include "hitrace_meter.h"
#include <linux/limits.h>

using OHOS::HiviewDFX::HiLog;
namespace {
    constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {LOG_CORE, LOG_DOMAIN, "ImageSourceNapi"};
    constexpr uint32_t NUM_0 = 0;
    constexpr uint32_t NUM_1 = 1;
    constexpr uint32_t NUM_2 = 2;
    constexpr uint32_t NUM_3 = 3;
    constexpr uint32_t NUM_4 = 4;
    constexpr uint32_t NUM_5 = 5;
    constexpr uint32_t NUM_8 = 8;
}

namespace OHOS {
namespace Media {
thread_local napi_ref ImageSourceNapi::sConstructor_ = nullptr;
std::shared_ptr<ImageSource> ImageSourceNapi::sImgSrc_ = nullptr;
std::shared_ptr<IncrementalPixelMap> ImageSourceNapi::sIncPixelMap_ = nullptr;
static const std::string CLASS_NAME = "ImageSource";
static const std::string FILE_URL_PREFIX = "file://";
std::string ImageSourceNapi::filePath_ = "";
int ImageSourceNapi::fileDescriptor_ = -1;
void* ImageSourceNapi::fileBuffer_ = nullptr;
size_t ImageSourceNapi::fileBufferSize_ = 0;

napi_ref ImageSourceNapi::pixelMapFormatRef_ = nullptr;
napi_ref ImageSourceNapi::propertyKeyRef_ = nullptr;
napi_ref ImageSourceNapi::imageFormatRef_ = nullptr;
napi_ref ImageSourceNapi::alphaTypeRef_ = nullptr;
napi_ref ImageSourceNapi::scaleModeRef_ = nullptr;
napi_ref ImageSourceNapi::componentTypeRef_ = nullptr;

struct ImageSourceAsyncContext {
    napi_env env;
    napi_async_work work;
    napi_deferred deferred;
    napi_ref callbackRef = nullptr;
    ImageSourceNapi *constructor_;
    uint32_t status;
    std::string pathName;
    int fdIndex;
    void* sourceBuffer;
    size_t sourceBufferSize;
    std::string keyStr;
    std::string valueStr;
    std::string defaultValueStr;
    int32_t valueInt;
    int32_t deufltValueInt;
    void *updataBuffer;
    size_t updataBufferSize;
    uint32_t updataBufferOffset = 0;
    uint32_t updataLength = 0;
    bool isCompleted = false;
    bool isSuccess = false;
    size_t pathNameLength;
    SourceOptions opts;
    uint32_t index = 0;
    ImageInfo imageInfo;
    DecodeOptions decodeOpts;
    std::shared_ptr<ImageSource> rImageSource;
    std::shared_ptr<PixelMap> rPixelMap;
    std::string errMsg;
};

struct ImageEnum {
    std::string name;
    int32_t numVal;
    std::string strVal;
};

static std::vector<struct ImageEnum> sPixelMapFormatMap = {
    {"UNKNOWN", 0, ""},
    {"ARGB_8888", 1, ""},
    {"RGB_565", 2, ""},
    {"RGBA_8888", 3, ""},
    {"BGRA_8888", 4, ""},
    {"RGB_888", 5, ""},
    {"ALPHA_8", 6, ""},
    {"RGBA_F16", 7, ""},
    {"NV21", 8, ""},
    {"NV12", 9, ""},
};
static std::vector<struct ImageEnum> sPropertyKeyMap = {
    {"BITS_PER_SAMPLE", 0, "BitsPerSample"},
    {"ORIENTATION", 0, "Orientation"},
    {"IMAGE_LENGTH", 0, "ImageLength"},
    {"IMAGE_WIDTH", 0, "ImageWidth"},
    {"GPS_LATITUDE", 0, "GPSLatitude"},
    {"GPS_LONGITUDE", 0, "GPSLongitude"},
    {"GPS_LATITUDE_REF", 0, "GPSLatitudeRef"},
    {"GPS_LONGITUDE_REF", 0, "GPSLongitudeRef"},
    {"DATE_TIME_ORIGINAL", 0, "DateTimeOriginal"},
    {"EXPOSURE_TIME", 0, "ExposureTime"},
    {"SCENE_TYPE", 0, "SceneType"},
    {"ISO_SPEED_RATINGS", 0, "ISOSpeedRatings"},
    {"F_NUMBER", 0, "FNumber"},
    {"COMPRESSED_BITS_PER_PIXEL", 0, "CompressedBitsPerPixel"},
};
static std::vector<struct ImageEnum> sImageFormatMap = {
    {"YCBCR_422_SP", 1000, ""},
    {"JPEG", 2000, ""},
};
static std::vector<struct ImageEnum> sAlphaTypeMap = {
    {"UNKNOWN", 0, ""},
    {"OPAQUE", 1, ""},
    {"PREMUL", 2, ""},
    {"UNPREMUL", 3, ""},
};
static std::vector<struct ImageEnum> sScaleModeMap = {
    {"FIT_TARGET_SIZE", 0, ""},
    {"CENTER_CROP", 1, ""},
};
static std::vector<struct ImageEnum> sComponentTypeMap = {
    {"YUV_Y", 1, ""},
    {"YUV_U", 2, ""},
    {"YUV_V", 3, ""},
    {"JPEG", 4, ""},
};

static std::string GetStringArgument(napi_env env, napi_value value)
{
    std::string strValue = "";
    size_t bufLength = 0;
    napi_status status = napi_get_value_string_utf8(env, value, nullptr, NUM_0, &bufLength);
    if (status == napi_ok && bufLength > NUM_0 && bufLength < PATH_MAX) {
        char *buffer = reinterpret_cast<char *>(malloc((bufLength + NUM_1) * sizeof(char)));
        if (buffer == nullptr) {
            HiLog::Error(LABEL, "No memory");
            return strValue;
        }

        status = napi_get_value_string_utf8(env, value, buffer, bufLength + NUM_1, &bufLength);
        if (status == napi_ok) {
            HiLog::Debug(LABEL, "Get Success");
            strValue = buffer;
        } else {
            free(buffer);
            buffer = nullptr;
        }
    }
    return strValue;
}

static void ImageSourceCallbackRoutine(napi_env env, ImageSourceAsyncContext* &context, const napi_value &valueParam)
{
    napi_value result[NUM_2] = {0};
    napi_value retVal;
    napi_value callback = nullptr;

    napi_get_undefined(env, &result[NUM_0]);
    napi_get_undefined(env, &result[NUM_1]);

    if (context == nullptr) {
        HiLog::Error(LABEL, "context is nullptr");
        return;
    }

    if (context->status == SUCCESS) {
        result[NUM_1] = valueParam;
    } else if (context->errMsg.size() > 0) {
        napi_create_string_utf8(env, context->errMsg.c_str(), NAPI_AUTO_LENGTH, &result[NUM_0]);
    } else {
        HiLog::Debug(LABEL, "error status, no message");
        napi_create_string_utf8(env, "error status, no message", NAPI_AUTO_LENGTH, &result[NUM_0]);
    }

    if (context->deferred) {
        if (context->status == SUCCESS) {
            napi_resolve_deferred(env, context->deferred, result[NUM_1]);
        } else {
            napi_reject_deferred(env, context->deferred, result[NUM_0]);
        }
    } else {
        HiLog::Debug(LABEL, "call callback function");
        napi_get_reference_value(env, context->callbackRef, &callback);
        napi_call_function(env, nullptr, callback, NUM_2, result, &retVal);
        napi_delete_reference(env, context->callbackRef);
    }

    napi_delete_async_work(env, context->work);

    delete context;
    context = nullptr;
}

static napi_value CreateEnumTypeObject(napi_env env,
    napi_valuetype type, napi_ref* ref, std::vector<struct ImageEnum> imageEnumMap)
{
    napi_value result = nullptr;
    napi_status status;
    int32_t refCount = 1;
    std::string propName;
    status = napi_create_object(env, &result);
    if (status == napi_ok) {
        for (auto imgEnum : imageEnumMap) {
            napi_value enumNapiValue = nullptr;
            if (type == napi_string) {
                status = napi_create_string_utf8(env, imgEnum.strVal.c_str(),
                    NAPI_AUTO_LENGTH, &enumNapiValue);
            } else if (type == napi_number) {
                status = napi_create_int32(env, imgEnum.numVal, &enumNapiValue);
            } else {
                HiLog::Error(LABEL, "Unsupported type %{public}d!", type);
            }
            if (status == napi_ok && enumNapiValue != nullptr) {
                status = napi_set_named_property(env, result, imgEnum.name.c_str(), enumNapiValue);
            }
            if (status != napi_ok) {
                HiLog::Error(LABEL, "Failed to add named prop!");
                break;
            }
        }

        if (status == napi_ok) {
            status = napi_create_reference(env, result, refCount, ref);
            if (status == napi_ok) {
                return result;
            }
        }
    }
    HiLog::Error(LABEL, "CreateEnumTypeObject is Failed!");
    napi_get_undefined(env, &result);
    return result;
}

ImageSourceNapi::ImageSourceNapi():env_(nullptr)
{   }

ImageSourceNapi::~ImageSourceNapi()
{
    release();
}

struct ImageConstructorInfo {
    std::string className;
    napi_ref* classRef;
    napi_callback constructor;
    const napi_property_descriptor* property;
    size_t propertyCount;
    const napi_property_descriptor* staticProperty;
    size_t staticPropertyCount;
};

static napi_value DoInit(napi_env env, napi_value exports, struct ImageConstructorInfo info)
{
    napi_value constructor = nullptr;
    napi_status status = napi_define_class(env, info.className.c_str(), NAPI_AUTO_LENGTH,
        info.constructor, nullptr, info.propertyCount, info.property, &constructor);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "define class fail");
        return nullptr;
    }

    status = napi_create_reference(env, constructor, NUM_1, info.classRef);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "create reference fail");
        return nullptr;
    }

    napi_value global = nullptr;
    status = napi_get_global(env, &global);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "Init:get global fail");
        return nullptr;
    }

    status = napi_set_named_property(env, global, info.className.c_str(), constructor);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "Init:set global named property fail");
        return nullptr;
    }

    status = napi_set_named_property(env, exports, info.className.c_str(), constructor);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "set named property fail");
        return nullptr;
    }

    status = napi_define_properties(env, exports, info.staticPropertyCount, info.staticProperty);
    if (status != napi_ok) {
        HiLog::Error(LABEL, "define properties fail");
        return nullptr;
    }
    return exports;
}

napi_value ImageSourceNapi::Init(napi_env env, napi_value exports)
{
    napi_property_descriptor properties[] = {
        DECLARE_NAPI_FUNCTION("getImageInfo", GetImageInfo),
        DECLARE_NAPI_FUNCTION("modifyImageProperty", ModifyImageProperty),
        DECLARE_NAPI_FUNCTION("getImageProperty", GetImageProperty),
        DECLARE_NAPI_FUNCTION("createPixelMap", CreatePixelMap),
        DECLARE_NAPI_FUNCTION("updateData", UpdateData),
        DECLARE_NAPI_FUNCTION("release", Release),
        DECLARE_NAPI_GETTER("supportedFormats", GetSupportedFormats),
    };

    napi_property_descriptor static_prop[] = {
        DECLARE_NAPI_STATIC_FUNCTION("createImageSource", CreateImageSource),
        DECLARE_NAPI_STATIC_FUNCTION("CreateIncrementalSource", CreateIncrementalSource),
        DECLARE_NAPI_PROPERTY("PixelMapFormat",
            CreateEnumTypeObject(env, napi_number, &pixelMapFormatRef_, sPixelMapFormatMap)),
        DECLARE_NAPI_PROPERTY("PropertyKey",
            CreateEnumTypeObject(env, napi_string, &propertyKeyRef_, sPropertyKeyMap)),
        DECLARE_NAPI_PROPERTY("ImageFormat",
            CreateEnumTypeObject(env, napi_number, &imageFormatRef_, sImageFormatMap)),
        DECLARE_NAPI_PROPERTY("AlphaType",
            CreateEnumTypeObject(env, napi_number, &alphaTypeRef_, sAlphaTypeMap)),
        DECLARE_NAPI_PROPERTY("ScaleMode",
            CreateEnumTypeObject(env, napi_number, &scaleModeRef_, sScaleModeMap)),
        DECLARE_NAPI_PROPERTY("ComponentType",
            CreateEnumTypeObject(env, napi_number, &componentTypeRef_, sComponentTypeMap)),
    };

    struct ImageConstructorInfo info = {
        .className = CLASS_NAME,
        .classRef = &sConstructor_,
        .constructor = Constructor,
        .property = properties,
        .propertyCount = sizeof(properties) / sizeof(properties[NUM_0]),
        .staticProperty = static_prop,
        .staticPropertyCount = sizeof(static_prop) / sizeof(static_prop[NUM_0]),
    };

    if (DoInit(env, exports, info)) {
        return nullptr;
    }

    HiLog::Debug(LABEL, "Init success");
    return exports;
}

napi_value ImageSourceNapi::Constructor(napi_env env, napi_callback_info info)
{
    napi_value undefineValue = nullptr;
    napi_get_undefined(env, &undefineValue);

    napi_status status;
    napi_value thisVar = nullptr;
    status = napi_get_cb_info(env, info, nullptr, nullptr, &thisVar, nullptr);
    if (status == napi_ok && thisVar != nullptr) {
        std::unique_ptr<ImageSourceNapi> pImgSrcNapi = std::make_unique<ImageSourceNapi>();
        if (pImgSrcNapi != nullptr) {
            pImgSrcNapi->env_ = env;
            pImgSrcNapi->nativeImgSrc = sImgSrc_;
            pImgSrcNapi->navIncPixelMap_ = sIncPixelMap_;
            sIncPixelMap_ = nullptr;

            status = napi_wrap(env, thisVar, reinterpret_cast<void *>(pImgSrcNapi.get()),
                               ImageSourceNapi::Destructor, nullptr, nullptr);
            if (status == napi_ok) {
                pImgSrcNapi.release();
                return thisVar;
            } else {
                HiLog::Error(LABEL, "Failure wrapping js to native napi");
            }
        }
    }

    return undefineValue;
}

void ImageSourceNapi::Destructor(napi_env env, void *nativeObject, void *finalize)
{
}

napi_value ImageSourceNapi::GetSupportedFormats(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    napi_value thisVar = nullptr;
    size_t argCount = 0;
    HiLog::Debug(LABEL, "GetSupportedFormats IN");

    IMG_JS_ARGS(env, info, status, argCount, nullptr, thisVar);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), result, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImageSourceAsyncContext> asyncContext = std::make_unique<ImageSourceAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&asyncContext->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));
    std::set<std::string> formats;
    uint32_t ret = asyncContext->constructor_->nativeImgSrc->GetSupportedFormats(formats);

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

STATIC_COMPLETE_FUNC(GetImageInfo)
{
    HiLog::Debug(LABEL, "[ImageSource]GetImageInfoComplete IN");
    napi_value result = nullptr;
    auto context = static_cast<ImageSourceAsyncContext*>(data);
    if (context->status == SUCCESS) {
        napi_create_object(env, &result);

        napi_value size = nullptr;
        napi_create_object(env, &size);

        napi_value sizeWith = nullptr;
        napi_create_int32(env, context->imageInfo.size.width, &sizeWith);
        napi_set_named_property(env, size, "width", sizeWith);

        napi_value sizeHeight = nullptr;
        napi_create_int32(env, context->imageInfo.size.height, &sizeHeight);
        napi_set_named_property(env, size, "height", sizeHeight);

        napi_set_named_property(env, result, "size", size);

        napi_value pixelFormatValue = nullptr;
        napi_create_int32(env, static_cast<int32_t>(context->imageInfo.pixelFormat), &pixelFormatValue);
        napi_set_named_property(env, result, "pixelFormat", pixelFormatValue);

        napi_value colorSpaceValue = nullptr;
        napi_create_int32(env, static_cast<int32_t>(context->imageInfo.colorSpace), &colorSpaceValue);
        napi_set_named_property(env, result, "colorSpace", colorSpaceValue);

        napi_value alphaTypeValue = nullptr;
        napi_create_int32(env, static_cast<int32_t>(context->imageInfo.alphaType), &alphaTypeValue);
        napi_set_named_property(env, result, "alphaType", alphaTypeValue);

        if (!IMG_IS_OK(status)) {
            context->status = ERROR;
            HiLog::Error(LABEL, "napi_create_int32 failed!");
            napi_get_undefined(env, &result);
        } else {
            context->status = SUCCESS;
        }
    } else {
        napi_get_undefined(env, &result);
    }

    HiLog::Debug(LABEL, "[ImageSource]GetImageInfoComplete OUT");
    ImageSourceCallbackRoutine(env, context, result);
}

static bool ParseSize(napi_env env, napi_value root, Size* size)
{
    if (size == nullptr) {
        HiLog::Error(LABEL, "size is nullptr");
        return false;
    }
    if (!GET_INT32_BY_NAME(root, "height", size->height)) {
        return false;
    }

    if (!GET_INT32_BY_NAME(root, "width", size->width)) {
        return false;
    }

    return true;
}

static bool ParseRegion(napi_env env, napi_value root, Rect* region)
{
    napi_value tmpValue = nullptr;

    if (region == nullptr) {
        HiLog::Error(LABEL, "region is nullptr");
        return false;
    }

    if (!GET_INT32_BY_NAME(root, "x", region->left)) {
        return false;
    }

    if (!GET_INT32_BY_NAME(root, "y", region->top)) {
        return false;
    }

    if (!GET_NODE_BY_NAME(root, "size", tmpValue)) {
        return false;
    }

    if (!GET_INT32_BY_NAME(tmpValue, "height", region->height)) {
        return false;
    }

    if (!GET_INT32_BY_NAME(tmpValue, "width", region->width)) {
        return false;
    }

    return true;
}

static bool IsSupportPixelFormat(int32_t val)
{
    if (val >= static_cast<int32_t>(PixelFormat::UNKNOWN) &&
        val <= static_cast<int32_t>(PixelFormat::RGBA_F16)) {
        return true;
    }

    return false;
}

static PixelFormat ParsePixlForamt(int32_t val)
{
    if (val <= static_cast<int32_t>(PixelFormat::CMYK)) {
        return PixelFormat(val);
    }

    return PixelFormat::UNKNOWN;
}

static bool ParseDecodeOptions2(napi_env env, napi_value root, DecodeOptions* opts, std::string &error)
{
    uint32_t tmpNumber = 0;
    if (!GET_UINT32_BY_NAME(root, "desiredPixelFormat", tmpNumber)) {
        HiLog::Debug(LABEL, "no desiredPixelFormat");
    } else {
        if (IsSupportPixelFormat(tmpNumber)) {
            opts->desiredPixelFormat = ParsePixlForamt(tmpNumber);
        } else {
            HiLog::Debug(LABEL, "Invalid desiredPixelFormat %{public}d", tmpNumber);
            error = "DecodeOptions mismatch";
            return false;
        }
    }

    if (opts == nullptr) {
        HiLog::Error(LABEL, "opts is nullptr");
        return false;
    }

    if (!GET_INT32_BY_NAME(root, "fitDensity", opts->fitDensity)) {
        HiLog::Debug(LABEL, "no fitDensity");
    }
    return true;
}

static bool ParseDecodeOptions(napi_env env, napi_value root, DecodeOptions* opts,
    uint32_t* pIndex, std::string &error)
{
    napi_value tmpValue = nullptr;

    if (!ImageNapiUtils::GetUint32ByName(env, root, "index", pIndex)) {
        HiLog::Debug(LABEL, "no index");
    }

    if (opts == nullptr) {
        HiLog::Error(LABEL, "opts is nullptr");
        return false;
    }

    if (!GET_UINT32_BY_NAME(root, "sampleSize", opts->sampleSize)) {
        HiLog::Debug(LABEL, "no sampleSize");
    }

    if (!GET_UINT32_BY_NAME(root, "rotate", opts->rotateNewDegrees)) {
        HiLog::Debug(LABEL, "no rotate");
    } else {
        if (opts->rotateNewDegrees >= 0 &&
            opts->rotateNewDegrees <= 360) { // 360 is the maximum rotation angle.
            opts->rotateDegrees = (float)opts->rotateNewDegrees;
        } else {
            HiLog::Debug(LABEL, "Invalid rotate %{public}d", opts->rotateNewDegrees);
            error = "DecodeOptions mismatch";
            return false;
        }
    }

    if (!GET_BOOL_BY_NAME(root, "editable", opts->editable)) {
        HiLog::Debug(LABEL, "no editable");
    }

    if (!GET_NODE_BY_NAME(root, "desiredSize", tmpValue)) {
        HiLog::Debug(LABEL, "no desiredSize");
    } else {
        if (!ParseSize(env, tmpValue, &(opts->desiredSize))) {
            HiLog::Debug(LABEL, "ParseSize error");
        }
    }

    if (!GET_NODE_BY_NAME(root, "desiredRegion", tmpValue)) {
        HiLog::Debug(LABEL, "no desiredRegion");
    } else {
        if (!ParseRegion(env, tmpValue, &(opts->CropRect))) {
            HiLog::Debug(LABEL, "ParseRegion error");
        }
    }
    return ParseDecodeOptions2(env, root, opts, error);
}

static std::string FileUrlToRawPath(const std::string &path)
{
    if (path.size() > FILE_URL_PREFIX.size() &&
        (path.compare(0, FILE_URL_PREFIX.size(), FILE_URL_PREFIX) == 0)) {
        return path.substr(FILE_URL_PREFIX.size());
    }
    return path;
}

static void parseSourceOptions(napi_env env, napi_value root, SourceOptions* opts)
{
    if (!ImageNapiUtils::GetInt32ByName(env, root, "sourceDensity", &(opts->baseDensity))) {
        HiLog::Debug(LABEL, "no sourceDensity");
    }

    int32_t pixelFormat = 0;
    if (!ImageNapiUtils::GetInt32ByName(env, root, "sourcePixelFormat", &pixelFormat)) {
        HiLog::Debug(LABEL, "no sourcePixelFormat");
    } else {
        opts->pixelFormat = static_cast<PixelFormat>(pixelFormat);
        HiLog::Info(LABEL, "sourcePixelFormat:%{public}d", static_cast<int32_t>(opts->pixelFormat));
    }

    napi_value tmpValue = nullptr;
    if (!GET_NODE_BY_NAME(root, "sourceSize", tmpValue)) {
        HiLog::Debug(LABEL, "no sourceSize");
    } else {
        if (!ParseSize(env, tmpValue, &(opts->size))) {
            HiLog::Debug(LABEL, "ParseSize error");
        }
        HiLog::Info(LABEL, "sourceSize:(%{public}d, %{public}d)", opts->size.width, opts->size.height);
    }
}

napi_value ImageSourceNapi::CreateImageSource(napi_env env, napi_callback_info info)
{
    napi_value globalValue;
    napi_get_global(env, &globalValue);
    napi_value func;
    napi_get_named_property(env, globalValue, "requireNapi", &func);

    napi_value imageInfo;
    napi_create_string_utf8(env, "multimedia.image", NAPI_AUTO_LENGTH, &imageInfo);
    napi_value funcArgv[1] = { imageInfo };
    napi_value returnValue;
    napi_call_function(env, globalValue, func, 1, funcArgv, &returnValue);

    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_2] = {0};
    size_t argCount = 2;
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    filePath_ = "";
    fileDescriptor_ = -1;
    fileBuffer_ = nullptr;
    fileBufferSize_ = 0;

    std::unique_ptr<ImageSourceAsyncContext> asyncContext = std::make_unique<ImageSourceAsyncContext>();
    uint32_t errorCode = ERR_MEDIA_INVALID_VALUE;
    SourceOptions opts;
    std::unique_ptr<ImageSource> imageSource = nullptr;

    NAPI_ASSERT(env, argCount > 0, "No arg!");

    if (argCount > NUM_1) {
        parseSourceOptions(env, argValue[NUM_1], &opts);
    }

    auto inputType = ImageNapiUtils::getType(env, argValue[NUM_0]);
    if (napi_string == inputType) { // File Path
        if (!ImageNapiUtils::GetUtf8String(env, argValue[NUM_0], asyncContext->pathName)) {
            HiLog::Error(LABEL, "fail to get pathName");
            napi_get_undefined(env, &result);
            return result;
        }
        asyncContext->pathName = FileUrlToRawPath(asyncContext->pathName);
        asyncContext->pathNameLength = asyncContext->pathName.size();
        HiLog::Debug(LABEL, "pathName is [%{public}s]", asyncContext->pathName.c_str());
        filePath_ = asyncContext->pathName;
        imageSource = ImageSource::CreateImageSource(asyncContext->pathName, opts, errorCode);
    } else if (napi_number == inputType) { // Fd
        napi_get_value_int32(env, argValue[NUM_0], &asyncContext->fdIndex);
        HiLog::Debug(LABEL, "CreateImageSource fdIndex is [%{public}d]", asyncContext->fdIndex);
        fileDescriptor_ = asyncContext->fdIndex;
        imageSource = ImageSource::CreateImageSource(asyncContext->fdIndex, opts, errorCode);
    } else { // Input Buffer
        napi_get_arraybuffer_info(env, argValue[NUM_0], &(fileBuffer_), &(fileBufferSize_));
        asyncContext->sourceBuffer = fileBuffer_;
        asyncContext->sourceBufferSize = fileBufferSize_;
        imageSource = ImageSource::CreateImageSource(static_cast<uint8_t *>(fileBuffer_),
            fileBufferSize_, opts, errorCode);
    }

    if (errorCode != SUCCESS || imageSource == nullptr) {
        HiLog::Error(LABEL, "CreateImageSourceExec error");
        napi_get_undefined(env, &result);
        return result;
    }
    napi_value constructor = nullptr;
    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        sImgSrc_ = std::move(imageSource);
        status = napi_new_instance(env, constructor, NUM_0, nullptr, &result);
    }
    if (!IMG_IS_OK(status)) {
        HiLog::Error(LABEL, "New instance could not be obtained");
        napi_get_undefined(env, &result);
    }
    return result;
}

napi_value ImageSourceNapi::CreateImageSourceComplete(napi_env env, napi_status status, void *data)
{
    napi_value constructor = nullptr;
    napi_value result = nullptr;

    HiLog::Debug(LABEL, "CreateImageSourceComplete IN");
    auto context = static_cast<ImageSourceAsyncContext*>(data);
    if (context == nullptr) {
        return result;
    }
    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        sImgSrc_ = context->rImageSource;
        status = napi_new_instance(env, constructor, NUM_0, nullptr, &result);
    }

    if (!IMG_IS_OK(status)) {
        context->status = ERROR;
        HiLog::Error(LABEL, "New instance could not be obtained");
        napi_get_undefined(env, &result);
    }
    return result;
}

napi_value ImageSourceNapi::CreateIncrementalSource(napi_env env, napi_callback_info info)
{
    napi_value globalValue;
    napi_get_global(env, &globalValue);
    napi_value func;
    napi_get_named_property(env, globalValue, "requireNapi", &func);

    napi_value imageInfo;
    napi_create_string_utf8(env, "multimedia.image", NAPI_AUTO_LENGTH, &imageInfo);
    napi_value funcArgv[1] = { imageInfo };
    napi_value returnValue;
    napi_call_function(env, globalValue, func, 1, funcArgv, &returnValue);

    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    HiLog::Debug(LABEL, "CreateIncrementalSource IN");

    napi_value thisVar = nullptr;
    napi_value argValue[NUM_2] = {0};
    size_t argCount = NUM_2;
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    uint32_t errorCode = 0;
    IncrementalSourceOptions incOpts;
    if (argCount == NUM_2) {
        parseSourceOptions(env, argValue[NUM_1], &(incOpts.sourceOptions));
    }

    incOpts.incrementalMode = IncrementalMode::INCREMENTAL_DATA;
    std::unique_ptr<ImageSource> imageSource = ImageSource::CreateIncrementalImageSource(incOpts, errorCode);
    DecodeOptions decodeOpts;
    std::unique_ptr<IncrementalPixelMap> incPixelMap = imageSource->CreateIncrementalPixelMap(0, decodeOpts, errorCode);
    HiLog::Debug(LABEL, "CreateIncrementalImageSource end");
    if (errorCode != SUCCESS || imageSource == nullptr) {
        HiLog::Error(LABEL, "CreateIncrementalImageSource error");
        napi_get_undefined(env, &result);
        return result;
    }
    napi_value constructor = nullptr;
    status = napi_get_reference_value(env, sConstructor_, &constructor);
    if (IMG_IS_OK(status)) {
        sImgSrc_ = std::move(imageSource);
        sIncPixelMap_ = std::move(incPixelMap);
        status = napi_new_instance(env, constructor, NUM_0, nullptr, &result);
    }
    if (!IMG_IS_OK(status)) {
        HiLog::Error(LABEL, "New instance could not be obtained");
        napi_get_undefined(env, &result);
    }
    return result;
}

napi_value ImageSourceNapi::GetImageInfo(napi_env env, napi_callback_info info)
{
    StartTrace(HITRACE_TAG_ZIMAGE, "GetImageInfo");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    int32_t refCount = 1;
    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_2] = {0};
    size_t argCount = 2;
    HiLog::Debug(LABEL, "GetImageInfo IN");
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    HiLog::Debug(LABEL, "GetImageInfo argCount is [%{public}zu]", argCount);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImageSourceAsyncContext> asyncContext = std::make_unique<ImageSourceAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&asyncContext->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));

    asyncContext->rImageSource = asyncContext->constructor_->nativeImgSrc;

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->rImageSource),
        nullptr, HiLog::Error(LABEL, "empty native pixelmap"));
    HiLog::Debug(LABEL, "GetImageInfo argCount is [%{public}zu]", argCount);
    if (argCount == NUM_1 && ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_function) {
        HiLog::Debug(LABEL, "GetImageInfo arg0 getType is [%{public}u]", ImageNapiUtils::getType(env, argValue[NUM_0]));
        napi_create_reference(env, argValue[NUM_0], refCount, &asyncContext->callbackRef);
    } else if (argCount == NUM_1 && ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_number) {
        napi_get_value_uint32(env, argValue[NUM_0], &asyncContext->index);
    } else if (argCount == NUM_2 && ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_number
                && ImageNapiUtils::getType(env, argValue[NUM_1]) == napi_function) {
        HiLog::Debug(LABEL, "GetImageInfo arg0 getType is [%{public}u]", ImageNapiUtils::getType(env, argValue[NUM_0]));
        HiLog::Debug(LABEL, "GetImageInfo arg1 getType is [%{public}u]", ImageNapiUtils::getType(env, argValue[NUM_1]));
        napi_get_value_uint32(env, argValue[NUM_0], &asyncContext->index);
        napi_create_reference(env, argValue[NUM_1], refCount, &asyncContext->callbackRef);
    }

    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "GetImageInfo",
        [](napi_env env, void *data) {
            auto context = static_cast<ImageSourceAsyncContext*>(data);
            int index = (context->index >= NUM_0) ? context->index : NUM_0;
            context->status = context->rImageSource->GetImageInfo(index, context->imageInfo);
        }, GetImageInfoComplete, asyncContext, asyncContext->work);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status),
        nullptr, HiLog::Error(LABEL, "fail to create async work"));
    FinishTrace(HITRACE_TAG_ZIMAGE);
    return result;
}

static void CreatePixelMapExecute(napi_env env, void *data)
{
    HiLog::Debug(LABEL, "CreatePixelMapExecute IN");
    if (data == nullptr) {
        HiLog::Error(LABEL, "data is nullptr");
        return;
    }
    uint32_t errorCode = 0;
    auto context = static_cast<ImageSourceAsyncContext*>(data);
    if (context == nullptr) {
        HiLog::Error(LABEL, "empty context");
        return;
    }

    if (context->errMsg.size() > 0) {
        HiLog::Error(LABEL, "mismatch args");
        context->status = ERROR;
        return;
    }

    if (context->rImageSource == nullptr) {
        HiLog::Error(LABEL, "empty context rImageSource");
        return;
    }

    if (context->constructor_ != nullptr) {
        auto incPixelMap = context->constructor_->GetIncrementalPixelMap();
        if (incPixelMap != nullptr) {
            HiLog::Info(LABEL, "Get Incremental PixelMap!!!");
            context->rPixelMap = incPixelMap;
        }
    } else {
        HiLog::Info(LABEL, "Create PixelMap!!!");
    }
    if (context->rPixelMap == nullptr) {
        int index = (context->index >= NUM_0) ? context->index : NUM_0;
        context->rPixelMap = context->rImageSource->CreatePixelMapEx(index, context->decodeOpts, errorCode);
    }

    if (IMG_NOT_NULL(context->rPixelMap)) {
        context->status = SUCCESS;
    } else {
        context->status = ERROR;
        context->errMsg = "Create PixelMap error";
        HiLog::Error(LABEL, "Create PixelMap error");
    }
    HiLog::Debug(LABEL, "CreatePixelMapExecute OUT");
}

static void CreatePixelMapComplete(napi_env env, napi_status status, void *data)
{
    HiLog::Debug(LABEL, "CreatePixelMapComplete IN");
    napi_value result = nullptr;
    auto context = static_cast<ImageSourceAsyncContext*>(data);

    if (context->status == SUCCESS) {
        result = PixelMapNapi::CreatePixelMap(env, context->rPixelMap);
    } else {
        napi_get_undefined(env, &result);
    }
    HiLog::Debug(LABEL, "CreatePixelMapComplete OUT");
    ImageSourceCallbackRoutine(env, context, result);
}

napi_value ImageSourceNapi::CreatePixelMap(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    int32_t refCount = 1;
    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_2] = {0};
    size_t argCount = NUM_2;
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, thisVar), nullptr, HiLog::Error(LABEL, "fail to get thisVar"));
    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImageSourceAsyncContext> asyncContext = std::make_unique<ImageSourceAsyncContext>();

    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&asyncContext->constructor_));
    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));
    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->constructor_->nativeImgSrc),
        nullptr, HiLog::Error(LABEL, "fail to unwrap nativeImgSrc"));
    asyncContext->rImageSource = asyncContext->constructor_->nativeImgSrc;
    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->rImageSource),
        nullptr, HiLog::Error(LABEL, "empty native rImageSource"));

    if (argCount == NUM_0) {
        HiLog::Debug(LABEL, "CreatePixelMap with no arg");
    } else if (argCount == NUM_1 || argCount == NUM_2) {
        if (ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_object) {
            if (!ParseDecodeOptions(env, argValue[NUM_0], &(asyncContext->decodeOpts),
                                    &(asyncContext->index), asyncContext->errMsg)) {
                HiLog::Error(LABEL, "DecodeOptions mismatch");
            }
        }
        if (ImageNapiUtils::getType(env, argValue[argCount - 1]) == napi_function) {
            napi_create_reference(env, argValue[argCount - 1], refCount, &asyncContext->callbackRef);
        }
    } else {
        HiLog::Error(LABEL, "argCount mismatch");
        return result;
    }
    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    ImageNapiUtils::HicheckerReport();
    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "CreatePixelMap", CreatePixelMapExecute,
        CreatePixelMapComplete, asyncContext, asyncContext->work);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status),
        nullptr, HiLog::Error(LABEL, "fail to create async work"));
    return result;
}

static bool ParsePropertyOptions(napi_env env, napi_value root, ImageSourceAsyncContext* context)
{
    napi_value tmpValue = nullptr;
    if (!GET_UINT32_BY_NAME(root, "index", context->index)) {
        HiLog::Debug(LABEL, "no index");
        return false;
    }
    if (!GET_NODE_BY_NAME(root, "defaultValue", tmpValue)) {
        HiLog::Debug(LABEL, "no defaultValue");
    } else {
        if (tmpValue != nullptr) {
            context->defaultValueStr = GetStringArgument(env, tmpValue);
        }
    }
    return true;
}

static void ModifyImagePropertyComplete(napi_env env, napi_status status, ImageSourceAsyncContext *context)
{
    HiLog::Debug(LABEL, "ModifyPropertyComplete IN");

    if (context == nullptr) {
        HiLog::Error(LABEL, "context is nullptr");
        return;
    }

    napi_value result[NUM_2] = {0};
    napi_get_undefined(env, &result[NUM_0]);
    napi_get_undefined(env, &result[NUM_1]);
    napi_value retVal;
    napi_value callback = nullptr;
    if (context->status == ERR_MEDIA_WRITE_PARCEL_FAIL) {
        if (context->fdIndex != -1) {
            ImageNapiUtils::CreateErrorObj(env, result[0], context->status,
                "Create Fd without write permission!");
        }
    } else if (context->status == ERR_MEDIA_OUT_OF_RANGE) {
        ImageNapiUtils::CreateErrorObj(env, result[0], context->status,
            "The given buffer size is too small to add new exif data!");
    } else if (context->status == ERR_IMAGE_DECODE_EXIF_UNSUPPORT) {
        ImageNapiUtils::CreateErrorObj(env, result[0], context->status,
            "The exif data format is not standard, so modify it failed!");
    } else if (context->status == ERR_MEDIA_VALUE_INVALID) {
        ImageNapiUtils::CreateErrorObj(env, result[0], context->status, context->errMsg);
    }

    if (context->deferred) {
        if (context->status == SUCCESS) {
            napi_resolve_deferred(env, context->deferred, result[NUM_1]);
        } else {
            napi_reject_deferred(env, context->deferred, result[NUM_0]);
        }
    } else {
        HiLog::Debug(LABEL, "call callback function");
        napi_get_reference_value(env, context->callbackRef, &callback);
        napi_call_function(env, nullptr, callback, NUM_2, result, &retVal);
        napi_delete_reference(env, context->callbackRef);
    }

    napi_delete_async_work(env, context->work);

    delete context;
    context = nullptr;
    HiLog::Debug(LABEL, "ModifyPropertyComplete OUT");
}

static void GetImagePropertyComplete(napi_env env, napi_status status, ImageSourceAsyncContext *context)
{
    HiLog::Debug(LABEL, "GetImagePropertyComplete IN");

    if (context == nullptr) {
        HiLog::Error(LABEL, "context is nullptr");
        return;
    }

    napi_value result[NUM_2] = {0};
    napi_value retVal;
    napi_value callback = nullptr;

    napi_get_undefined(env, &result[NUM_0]);
    napi_get_undefined(env, &result[NUM_1]);

    if (context->status == SUCCESS) {
        napi_create_string_utf8(env, context->valueStr.c_str(), context->valueStr.length(), &result[NUM_1]);
    } else if (context->status == ERR_IMAGE_DECODE_EXIF_UNSUPPORT) {
        ImageNapiUtils::CreateErrorObj(env, result[0], context->status, "Unsupport EXIF info key!");
    } else {
        ImageNapiUtils::CreateErrorObj(env, result[0], context->status, "There is generic napi failure!");
    }

    if (context->deferred) {
        if (context->status == SUCCESS) {
            napi_resolve_deferred(env, context->deferred, result[NUM_1]);
        } else {
            napi_reject_deferred(env, context->deferred, result[NUM_0]);
        }
    } else {
        HiLog::Debug(LABEL, "call callback function");
        napi_get_reference_value(env, context->callbackRef, &callback);
        napi_call_function(env, nullptr, callback, NUM_2, result, &retVal);
        napi_delete_reference(env, context->callbackRef);
    }

    napi_delete_async_work(env, context->work);
    delete context;
    context = nullptr;
    HiLog::Debug(LABEL, "GetImagePropertyComplete OUT");
}

static std::unique_ptr<ImageSourceAsyncContext> UnwrapContext(napi_env env, napi_callback_info info)
{
    int32_t refCount = 1;
    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_3] = {0};
    size_t argCount = NUM_3;
    HiLog::Debug(LABEL, "GetImageProperty UnwrapContext");
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    HiLog::Debug(LABEL, "GetImageProperty argCount is [%{public}zu]", argCount);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImageSourceAsyncContext> context = std::make_unique<ImageSourceAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&context->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, context->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));

    context->rImageSource = context->constructor_->nativeImgSrc;

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, context->rImageSource),
        nullptr, HiLog::Error(LABEL, "empty native rImageSource"));

    if (argCount < NUM_1 || argCount > NUM_3) {
        HiLog::Error(LABEL, "argCount missmatch");
        return nullptr;
    }
    if (ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_string) {
        context->keyStr = GetStringArgument(env, argValue[NUM_0]);
    } else {
        HiLog::Error(LABEL, "arg 0 type missmatch");
        return nullptr;
    }
    if (argCount == NUM_2 || argCount == NUM_3) {
        if (ImageNapiUtils::getType(env, argValue[NUM_1]) == napi_object) {
            IMG_NAPI_CHECK_RET_D(ParsePropertyOptions(env, argValue[NUM_1], context.get()),
                                 nullptr, HiLog::Error(LABEL, "PropertyOptions mismatch"));
        }
        if (ImageNapiUtils::getType(env, argValue[argCount - 1]) == napi_function) {
            napi_create_reference(env, argValue[argCount - 1], refCount, &context->callbackRef);
        }
    }
    return context;
}

static bool CheckExifDataValue(const std::string &key, const std::string &value, std::string &errorInfo)
{
    if (IsSameTextStr(key, "BitsPerSample")) {
        std::vector<std::string> bitsVec;
        SplitStr(value, ",", bitsVec);
        if (bitsVec.size() > NUM_2) {
            errorInfo = "BitsPerSample has invalid exif value: ";
            errorInfo.append(value);
            return false;
        }
        for (size_t i = 0; i < bitsVec.size(); i++) {
            if (!IsNumericStr(bitsVec[i])) {
                errorInfo = "BitsPerSample has invalid exif value: ";
                errorInfo.append(bitsVec[i]);
                return false;
            }
        }
    } else if (IsSameTextStr(key, "Orientation")) {
        if (!IsNumericStr(value) || atoi(value.c_str()) < 1 || static_cast<uint32_t>(atoi(value.c_str())) > NUM_8) {
            errorInfo = "Orientation has invalid exif value: ";
            errorInfo.append(value);
            return false;
        }
    } else if (IsSameTextStr(key, "ImageLength") || IsSameTextStr(key, "ImageWidth")) {
        if (!IsNumericStr(value)) {
            errorInfo = "ImageLength or ImageWidth has invalid exif value: ";
            errorInfo.append(value);
            return false;
        }
    } else if (IsSameTextStr(key, "GPSLatitude") || IsSameTextStr(key, "GPSLongitude")) {
        std::vector<std::string> gpsVec;
        SplitStr(value, ",", gpsVec);
        if (gpsVec.size() != NUM_2) {
            errorInfo = "GPSLatitude or GPSLongitude has invalid exif value: ";
            errorInfo.append(value);
            return false;
        }

        for (size_t i = 0; i < gpsVec.size(); i++) {
            if (!IsNumericStr(gpsVec[i])) {
                errorInfo = "GPSLatitude or GPSLongitude has invalid exif value: ";
                errorInfo.append(gpsVec[i]);
                return false;
            }
        }
    } else if (IsSameTextStr(key, "GPSLatitudeRef")) {
        if (!IsSameTextStr(value, "N") && !IsSameTextStr(value, "S")) {
            errorInfo = "GPSLatitudeRef has invalid exif value: ";
            errorInfo.append(value);
            return false;
        }
    } else if (IsSameTextStr(key, "GPSLongitudeRef")) {
        if (!IsSameTextStr(value, "W") && !IsSameTextStr(value, "E")) {
            errorInfo = "GPSLongitudeRef has invalid exif value: ";
            errorInfo.append(value);
            return false;
        }
    }
    return true;
}

static std::unique_ptr<ImageSourceAsyncContext> UnwrapContextForModify(napi_env env,
    napi_callback_info info)
{
    int32_t refCount = 1;
    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_4] = {0};
    size_t argCount = NUM_4;
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    HiLog::Debug(LABEL, "UnwrapContextForModify argCount is [%{public}zu]", argCount);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImageSourceAsyncContext> context = std::make_unique<ImageSourceAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&context->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, context->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));

    context->rImageSource = context->constructor_->nativeImgSrc;

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, context->rImageSource),
        nullptr, HiLog::Error(LABEL, "empty native rImageSource"));
    if (argCount < NUM_1 || argCount > NUM_4) {
        HiLog::Error(LABEL, "argCount missmatch");
        return nullptr;
    }
    if (ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_string) {
        context->keyStr = GetStringArgument(env, argValue[NUM_0]);
    } else {
        HiLog::Error(LABEL, "arg 0 type missmatch");
        return nullptr;
    }
    if (ImageNapiUtils::getType(env, argValue[NUM_1]) == napi_string) {
        context->valueStr = GetStringArgument(env, argValue[NUM_1]);
    } else {
        HiLog::Error(LABEL, "arg 1 type missmatch");
        return nullptr;
    }
    if (argCount == NUM_3 || argCount == NUM_4) {
        if (ImageNapiUtils::getType(env, argValue[NUM_2]) == napi_object) {
            IMG_NAPI_CHECK_RET_D(ParsePropertyOptions(env, argValue[NUM_2], context.get()),
                nullptr, HiLog::Error(LABEL, "PropertyOptions mismatch"));
        }
        if (ImageNapiUtils::getType(env, argValue[argCount - 1]) == napi_function) {
            napi_create_reference(env, argValue[argCount - 1], refCount, &context->callbackRef);
        }
    }
    context->pathName = ImageSourceNapi::filePath_;
    context->fdIndex = ImageSourceNapi::fileDescriptor_;
    context->sourceBuffer = ImageSourceNapi::fileBuffer_;
    context->sourceBufferSize = ImageSourceNapi::fileBufferSize_;
    return context;
}

napi_value ImageSourceNapi::ModifyImageProperty(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    HiLog::Debug(LABEL, "ModifyImageProperty IN");
    std::unique_ptr<ImageSourceAsyncContext> asyncContext = UnwrapContextForModify(env, info);
    if (asyncContext == nullptr) {
        return ImageNapiUtils::ThrowExceptionError(env, static_cast<int32_t>(napi_invalid_arg),
            "async context unwrap failed");
    }

    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "ModifyImageProperty",
        [](napi_env env, void *data) {
            auto context = static_cast<ImageSourceAsyncContext*>(data);

            if (!CheckExifDataValue(context->keyStr, context->valueStr, context->errMsg)) {
                HiLog::Error(LABEL, "There is invalid exif data parameter");
                context->status = ERR_MEDIA_VALUE_INVALID;
                return;
            }
            if (!IsSameTextStr(context->pathName, "")) {
                context->status = context->rImageSource->ModifyImageProperty(context->index,
                    context->keyStr, context->valueStr, context->pathName);
            } else if (context->fdIndex != -1) {
                context->status = context->rImageSource->ModifyImageProperty(context->index,
                    context->keyStr, context->valueStr, context->fdIndex);
            } else if (context->sourceBuffer != nullptr) {
                context->status = context->rImageSource->ModifyImageProperty(context->index,
                    context->keyStr, context->valueStr, static_cast<uint8_t *>(context->sourceBuffer),
                    context->sourceBufferSize);
            } else {
                HiLog::Error(LABEL, "There is no image source!");
            }
        },
        reinterpret_cast<napi_async_complete_callback>(ModifyImagePropertyComplete),
        asyncContext,
        asyncContext->work);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status),
        nullptr, HiLog::Error(LABEL, "fail to create async work"));
    return result;
}

napi_value ImageSourceNapi::GetImageProperty(napi_env env, napi_callback_info info)
{
    StartTrace(HITRACE_TAG_ZIMAGE, "GetImageProperty");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    napi_status status;
    HiLog::Debug(LABEL, "GetImageProperty IN");
    std::unique_ptr<ImageSourceAsyncContext> asyncContext = UnwrapContext(env, info);
    if (asyncContext == nullptr) {
        return ImageNapiUtils::ThrowExceptionError(env, static_cast<int32_t>(napi_invalid_arg),
            "async context unwrap failed");
    }

    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "GetImageProperty",
        [](napi_env env, void *data) {
            auto context = static_cast<ImageSourceAsyncContext*>(data);
            context->status = context->rImageSource->GetImagePropertyString(context->index,
                                                                            context->keyStr,
                                                                            context->valueStr);
        },
        reinterpret_cast<napi_async_complete_callback>(GetImagePropertyComplete),
        asyncContext,
        asyncContext->work);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status),
        nullptr, HiLog::Error(LABEL, "fail to create async work"));
    FinishTrace(HITRACE_TAG_ZIMAGE);
    return result;
}

static void UpdateDataExecute(napi_env env, void *data)
{
    auto context = static_cast<ImageSourceAsyncContext*>(data);
    uint8_t *buffer = static_cast<uint8_t*>(context->updataBuffer);
    if (context->updataBufferOffset < context->updataBufferSize) {
        buffer = buffer + context->updataBufferOffset;
    }

    uint32_t lastSize = context->updataBufferSize - context->updataBufferOffset;
    uint32_t size = context->updataLength < lastSize ? context->updataLength : lastSize;

    uint32_t res = context->rImageSource->UpdateData(buffer, size,
                                                     context->isCompleted);
    context->isSuccess = res == 0;
    if (context->isSuccess && context->constructor_ != nullptr) {
        auto incPixelMap = context->constructor_->GetIncrementalPixelMap();
        if (incPixelMap != nullptr) {
            uint8_t decodeProgress = 0;
            uint32_t err = incPixelMap->PromoteDecoding(decodeProgress);
            if (!(err == SUCCESS || (err == ERR_IMAGE_SOURCE_DATA_INCOMPLETE && !context->isCompleted))) {
                HiLog::Error(LABEL, "UpdateData PromoteDecoding error");
                context->isSuccess = false;
            }
            if (context->isCompleted) {
                incPixelMap->DetachFromDecoding();
            }
        }
    }
}

static void UpdateDataComplete(napi_env env, napi_status status, void *data)
{
    HiLog::Debug(LABEL, "UpdateDataComplete IN");
    napi_value result = nullptr;
    napi_create_object(env, &result);

    auto context = static_cast<ImageSourceAsyncContext*>(data);

    napi_get_boolean(env, context->isSuccess, &result);
    HiLog::Debug(LABEL, "UpdateDataComplete OUT");
    ImageSourceCallbackRoutine(env, context, result);
}

static bool isNapiTypedArray(napi_env env, napi_value val)
{
    bool res = false;
    napi_is_typedarray(env, val, &res);
    HiLog::Debug(LABEL, "isNapiTypedArray %{public}d", res);
    return res;
}

napi_value ImageSourceNapi::UpdateData(napi_env env, napi_callback_info info)
{
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    int32_t refCount = 1;
    napi_status status;
    napi_value thisVar = nullptr;
    napi_value argValue[NUM_5] = {0};
    size_t argCount = 5;
    HiLog::Debug(LABEL, "UpdateData IN");
    IMG_JS_ARGS(env, info, status, argCount, argValue, thisVar);
    HiLog::Debug(LABEL, "UpdateData argCount is [%{public}zu]", argCount);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status), nullptr, HiLog::Error(LABEL, "fail to napi_get_cb_info"));

    std::unique_ptr<ImageSourceAsyncContext> asyncContext = std::make_unique<ImageSourceAsyncContext>();
    status = napi_unwrap(env, thisVar, reinterpret_cast<void**>(&asyncContext->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->constructor_),
        nullptr, HiLog::Error(LABEL, "fail to unwrap context"));

    asyncContext->rImageSource = asyncContext->constructor_->nativeImgSrc;

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->rImageSource),
        nullptr, HiLog::Error(LABEL, "empty native rImageSource"));
    HiLog::Debug(LABEL, "UpdateData argCount %{public}zu", argCount);
    if (argCount > NUM_0 && isNapiTypedArray(env, argValue[NUM_0])) {
        HiLog::Error(LABEL, "UpdateData napi_get_arraybuffer_info ");
        napi_typedarray_type type;
        napi_value arraybuffer;
        size_t offset;
        status = napi_get_typedarray_info(env, argValue[NUM_0], &type,
            &(asyncContext->updataBufferSize), &(asyncContext->updataBuffer),
            &arraybuffer, &offset);
    }

    if (argCount >= NUM_2 && ImageNapiUtils::getType(env, argValue[NUM_1]) == napi_boolean) {
        status = napi_get_value_bool(env, argValue[NUM_1], &(asyncContext->isCompleted));
    }

    if (argCount >= NUM_3 && ImageNapiUtils::getType(env, argValue[NUM_2]) == napi_number) {
        asyncContext->updataBufferOffset = 0;
        status = napi_get_value_uint32(env, argValue[NUM_2], &(asyncContext->updataBufferOffset));
        HiLog::Debug(LABEL, "asyncContext->updataBufferOffset is [%{public}u]", asyncContext->updataBufferOffset);
    }

    if (argCount >= NUM_4 && ImageNapiUtils::getType(env, argValue[NUM_3]) == napi_number) {
        asyncContext->updataLength = 0;
        status = napi_get_value_uint32(env, argValue[NUM_3], &(asyncContext->updataLength));
        HiLog::Debug(LABEL, "asyncContext->updataLength is [%{public}u]", asyncContext->updataLength);
    }

    if (!IMG_IS_OK(status)) {
        HiLog::Error(LABEL, "fail to UpdateData");
        napi_get_undefined(env, &result);
        return result;
    }

    if (argCount == NUM_5 && ImageNapiUtils::getType(env, argValue[NUM_4]) == napi_function) {
        napi_create_reference(env, argValue[NUM_4], refCount, &asyncContext->callbackRef);
    }

    if (argCount == NUM_3 && ImageNapiUtils::getType(env, argValue[NUM_2]) == napi_function) {
        napi_create_reference(env, argValue[NUM_2], refCount, &asyncContext->callbackRef);
    }

    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    } else {
        napi_get_undefined(env, &result);
    }

    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "UpdateData",
        UpdateDataExecute, UpdateDataComplete, asyncContext, asyncContext->work);

    IMG_NAPI_CHECK_RET_D(IMG_IS_OK(status),
        nullptr, HiLog::Error(LABEL, "fail to create async work"));
    return result;
}

static void ReleaseComplete(napi_env env, napi_status status, void *data)
{
    HiLog::Debug(LABEL, "ReleaseComplete IN");
    napi_value result = nullptr;
    napi_get_undefined(env, &result);

    auto context = static_cast<ImageSourceAsyncContext*>(data);
    delete context->constructor_;
    context->constructor_ = nullptr;
    HiLog::Debug(LABEL, "ReleaseComplete OUT");
    ImageSourceCallbackRoutine(env, context, result);
}

napi_value ImageSourceNapi::Release(napi_env env, napi_callback_info info)
{
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

    std::unique_ptr<ImageSourceAsyncContext> asyncContext = std::make_unique<ImageSourceAsyncContext>();
    status = napi_remove_wrap(env, thisVar, reinterpret_cast<void**>(&asyncContext->constructor_));

    IMG_NAPI_CHECK_RET_D(IMG_IS_READY(status, asyncContext->constructor_), result,
        HiLog::Error(LABEL, "fail to unwrap context"));

    HiLog::Debug(LABEL, "Release argCount is [%{public}zu]", argCount);
    if (argCount == 1 && ImageNapiUtils::getType(env, argValue[NUM_0]) == napi_function) {
        napi_create_reference(env, argValue[NUM_0], refCount, &asyncContext->callbackRef);
    }

    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &(asyncContext->deferred), &result);
    }

    IMG_CREATE_CREATE_ASYNC_WORK(env, status, "Release",
        [](napi_env env, void *data) {}, ReleaseComplete, asyncContext, asyncContext->work);
    HiLog::Debug(LABEL, "Release exit");
    return result;
}

void ImageSourceNapi::release()
{
    if (!isRelease) {
        if (nativeImgSrc != nullptr) {
            nativeImgSrc = nullptr;
        }
        isRelease = true;
    }
}
}  // namespace Media
}  // namespace OHOS
