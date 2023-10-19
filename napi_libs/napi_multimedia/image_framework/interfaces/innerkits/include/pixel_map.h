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

#ifndef INTERFACES_INNERKITS_INCLUDE_PIXEL_MAP_H_
#define INTERFACES_INNERKITS_INCLUDE_PIXEL_MAP_H_

#include <memory>
#ifdef IMAGE_COLORSPACE_FLAG
#include "color_space.h"
#endif
#include "image_type.h"
#include "parcel.h"

namespace OHOS {
namespace Media {
class RosenImageWrapper;
using TransColorProc = bool (*)(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
using CustomFreePixelMap = void (*)(void *addr, void *context, uint32_t size);

struct InitializationOptions {
    Size size;
    PixelFormat pixelFormat = PixelFormat::UNKNOWN;
    AlphaType alphaType = AlphaType::IMAGE_ALPHA_TYPE_UNKNOWN;
    ScaleMode scaleMode = ScaleMode::FIT_TARGET_SIZE;
    bool editable = false;
    bool useSourceIfMatch = false;
};

// Build ARGB_8888 pixel value
constexpr uint8_t ARGB_MASK = 0xFF;
constexpr uint8_t ARGB_A_SHIFT = 24;
constexpr uint8_t ARGB_R_SHIFT = 16;
constexpr uint8_t ARGB_G_SHIFT = 8;
constexpr uint8_t ARGB_B_SHIFT = 0;
// Define pixel map malloc max size 600MB
constexpr int32_t PIXEL_MAP_MAX_RAM_SIZE = 600 * 1024 * 1024;

class PixelMap : public Parcelable {
public:
    PixelMap() = default;
    virtual ~PixelMap();
    NATIVEEXPORT static std::unique_ptr<PixelMap> Create(const uint32_t *colors, uint32_t colorLength,
                                                         const InitializationOptions &opts);
    NATIVEEXPORT static std::unique_ptr<PixelMap> Create(const uint32_t *colors, uint32_t colorLength, int32_t offset,
                                                         int32_t stride, const InitializationOptions &opts);
    NATIVEEXPORT static std::unique_ptr<PixelMap> Create(const InitializationOptions &opts);
    NATIVEEXPORT static std::unique_ptr<PixelMap> Create(PixelMap &source, const InitializationOptions &opts);
    NATIVEEXPORT static std::unique_ptr<PixelMap> Create(PixelMap &source, const Rect &srcRect,
                                                         const InitializationOptions &opts);
    NATIVEEXPORT uint32_t SetImageInfo(ImageInfo &info);
    NATIVEEXPORT uint32_t SetImageInfo(ImageInfo &info, bool isReused);
    NATIVEEXPORT const uint8_t *GetPixel(int32_t x, int32_t y);
    NATIVEEXPORT const uint8_t *GetPixel8(int32_t x, int32_t y);
    NATIVEEXPORT const uint16_t *GetPixel16(int32_t x, int32_t y);
    NATIVEEXPORT const uint32_t *GetPixel32(int32_t x, int32_t y);
    NATIVEEXPORT bool GetARGB32Color(int32_t x, int32_t y, uint32_t &color);
    NATIVEEXPORT void SetPixelsAddr(void *addr, void *context, uint32_t size, AllocatorType type,
                                    CustomFreePixelMap func);
    NATIVEEXPORT int32_t GetPixelBytes();
    NATIVEEXPORT int32_t GetRowBytes();
    NATIVEEXPORT int32_t GetByteCount();
    NATIVEEXPORT int32_t GetWidth();
    NATIVEEXPORT int32_t GetHeight();
    NATIVEEXPORT int32_t GetBaseDensity();
    NATIVEEXPORT void scale(float xAxis, float yAxis);
    NATIVEEXPORT void translate(float xAxis, float yAxis);
    NATIVEEXPORT void rotate(float degrees);
    NATIVEEXPORT void flip(bool xAxis, bool yAxis);
    NATIVEEXPORT uint32_t crop(const Rect &rect);
    NATIVEEXPORT void GetImageInfo(ImageInfo &imageInfo);
    NATIVEEXPORT PixelFormat GetPixelFormat();
    NATIVEEXPORT ColorSpace GetColorSpace();
    NATIVEEXPORT AlphaType GetAlphaType();
    NATIVEEXPORT uint32_t SetAlpha(const float percent);
    NATIVEEXPORT const uint8_t *GetPixels();
    NATIVEEXPORT uint8_t GetARGB32ColorA(uint32_t color);
    NATIVEEXPORT uint8_t GetARGB32ColorR(uint32_t color);
    NATIVEEXPORT uint8_t GetARGB32ColorG(uint32_t color);
    NATIVEEXPORT uint8_t GetARGB32ColorB(uint32_t color);
    // Config the pixel map parameter
    NATIVEEXPORT bool IsSameImage(const PixelMap &other);
    NATIVEEXPORT uint32_t ReadPixels(const uint64_t &bufferSize, const uint32_t &offset, const uint32_t &stride,
                                     const Rect &region, uint8_t *dst);
    NATIVEEXPORT uint32_t ReadPixels(const uint64_t &bufferSize, uint8_t *dst);
    NATIVEEXPORT uint32_t ReadPixel(const Position &pos, uint32_t &dst);
    NATIVEEXPORT uint32_t ResetConfig(const Size &size, const PixelFormat &format);
    NATIVEEXPORT bool SetAlphaType(const AlphaType &alphaType);
    NATIVEEXPORT uint32_t WritePixel(const Position &pos, const uint32_t &color);
    NATIVEEXPORT uint32_t WritePixels(const uint8_t *source, const uint64_t &bufferSize, const uint32_t &offset,
                         const uint32_t &stride, const Rect &region);
    NATIVEEXPORT uint32_t WritePixels(const uint8_t *source, const uint64_t &bufferSize);
    NATIVEEXPORT bool WritePixels(const uint32_t &color);
    NATIVEEXPORT void FreePixelMap();
    NATIVEEXPORT AllocatorType GetAllocatorType();
    NATIVEEXPORT void *GetFd() const;

    NATIVEEXPORT uint32_t GetCapacity()
    {
        return pixelsSize_;
    }

    NATIVEEXPORT bool IsEditable()
    {
        return editable_;
    }

    // judgement whether create pixelmap use source as result
    NATIVEEXPORT bool IsSourceAsResponse()
    {
        return useSourceAsResponse_;
    }

    NATIVEEXPORT void *GetWritablePixels() const
    {
        return static_cast<void *>(data_);
    }

    NATIVEEXPORT bool Marshalling(Parcel &data) const override;
    NATIVEEXPORT static PixelMap *Unmarshalling(Parcel &data);

#ifdef IMAGE_COLORSPACE_FLAG
    // -------[inner api for ImageSource/ImagePacker codec] it will get a colorspace object pointer----begin----
    NATIVEEXPORT void InnerSetColorSpace(const OHOS::ColorManager::ColorSpace &grColorSpace);
    NATIVEEXPORT OHOS::ColorManager::ColorSpace InnerGetGrColorSpace();
    // -------[inner api for ImageSource/ImagePacker codec] it will get a colorspace object pointer----end-------
#endif

private:
    static constexpr size_t MAX_IMAGEDATA_SIZE = 128 * 1024 * 1024; // 128M
    static constexpr size_t MIN_IMAGEDATA_SIZE = 32 * 1024;         // 32k
    friend class ImageSource;
    static bool ALPHA8ToARGB(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
    static bool RGB565ToARGB(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
    static bool ARGB8888ToARGB(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
    static bool RGBA8888ToARGB(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
    static bool BGRA8888ToARGB(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
    static bool RGB888ToARGB(const uint8_t *in, uint32_t inCount, uint32_t *out, uint32_t outCount);
    static bool CheckParams(const uint32_t *colors, uint32_t colorLength, int32_t offset, int32_t stride,
                            const InitializationOptions &opts);
    static void UpdatePixelsAlpha(const AlphaType &alphaType, const PixelFormat &pixelFormat, uint8_t *dstPixels,
                                  PixelMap dstPixelMap);
    static void InitDstImageInfo(const InitializationOptions &opts, const ImageInfo &srcImageInfo,
                                 ImageInfo &dstImageInfo);
    static bool CopyPixelMap(PixelMap &source, PixelMap &dstPixelMap);
    static bool SourceCropAndConvert(PixelMap &source, const ImageInfo &srcImageInfo, const ImageInfo &dstImageInfo,
                                     const Rect &srcRect, PixelMap &dstPixelMap);
    static bool IsSameSize(const Size &src, const Size &dst);
    static bool ScalePixelMap(const Size &targetSize, const Size &dstSize, const ScaleMode &scaleMode,
                              PixelMap &dstPixelMap);
    bool GetPixelFormatDetail(const PixelFormat format);
    bool CheckPixelsInput(const uint8_t *dst, const uint64_t &bufferSize, const uint32_t &offset,
                          const uint32_t &stride, const Rect &region);
    void ReleaseSharedMemory(void *addr, void *context, uint32_t size);
    void SetEditable(bool editable)
    {
        editable_ = editable;
    }

    void ResetPixelMap()
    {
        rowDataSize_ = 0;
        pixelBytes_ = 0;
        colorProc_ = nullptr;
    }

    bool CheckValidParam(int32_t x, int32_t y)
    {
        return (data_ == nullptr) || (x >= imageInfo_.size.width) || (x < 0) || (y >= imageInfo_.size.height) ||
                       (y < 0) || (pixelsSize_ < static_cast<uint64_t>(rowDataSize_) * imageInfo_.size.height)
                   ? false
                   : true;
    }

    static void ReleaseMemory(AllocatorType allocType, void *addr, void *context, uint32_t size);
    bool WriteImageData(Parcel &parcel, size_t size) const;
    static uint8_t *ReadImageData(Parcel &parcel, int32_t size);
    static int ReadFileDescriptor(Parcel &parcel);
    static bool WriteFileDescriptor(Parcel &parcel, int fd);
    bool ReadImageInfo(Parcel &parcel, ImageInfo &imgInfo);
    bool WriteImageInfo(Parcel &parcel) const;

    uint8_t *data_ = nullptr;
    // this info SHOULD be the final info for decoded pixelmap, not the original image info
    ImageInfo imageInfo_;
    int32_t rowDataSize_ = 0;
    int32_t pixelBytes_ = 0;
    TransColorProc colorProc_ = nullptr;
    void *context_ = nullptr;
    CustomFreePixelMap custFreePixelMap_ = nullptr;
    AllocatorType allocatorType_ = AllocatorType::HEAP_ALLOC;
    uint32_t pixelsSize_ = 0;
    bool editable_ = false;
    bool useSourceAsResponse_ = false;

    // only used by rosen backend
    std::shared_ptr<RosenImageWrapper> rosenImageWrapper_;
    friend class PixelMapRosenUtils;

#ifdef IMAGE_COLORSPACE_FLAG
    std::shared_ptr<OHOS::ColorManager::ColorSpace> grColorSpace_ = nullptr;
#else
    std::shared_ptr<uint8_t> grColorSpace_ = nullptr;
#endif
};
} // namespace Media
} // namespace OHOS

#endif // INTERFACES_INNERKITS_INCLUDE_PIXEL_MAP_H_
