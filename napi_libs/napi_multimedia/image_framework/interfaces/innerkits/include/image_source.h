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

#ifndef INTERFACES_INNERKITS_INCLUDE_IMAGE_SOURCE_H_
#define INTERFACES_INNERKITS_INCLUDE_IMAGE_SOURCE_H_

#include <cstdint>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <set>

#include "decode_listener.h"
#include "image_type.h"
#include "incremental_pixel_map.h"
#include "peer_listener.h"
#include "pixel_map.h"

namespace OHOS {
namespace MultimediaPlugin {
constexpr float EPSILON = 1e-6;

class PluginServer;
} // namespace MultimediaPlugin
} // namespace OHOS

namespace OHOS {
namespace ImagePlugin {
class AbsImageFormatAgent;
class AbsImageDecoder;
struct PixelDecodeOptions;
struct PlImageInfo;
} // namespace ImagePlugin
} // namespace OHOS

namespace OHOS {
namespace Media {
struct SourceOptions {
    std::string formatHint;
    int32_t baseDensity = 0;
    PixelFormat pixelFormat = PixelFormat::UNKNOWN;
    Size size;
};

struct IncrementalSourceOptions {
    SourceOptions sourceOptions;
    IncrementalMode incrementalMode = IncrementalMode::FULL_DATA;
};

struct NinePatchInfo {
    void *ninePatch = nullptr;
    size_t patchSize = 0;
};

enum class DecodeEvent : int32_t {
    EVENT_COMPLETE_DECODE = 0,
    EVENT_PARTIAL_DECODE = 1,
    EVENT_HEADER_DECODE = 2,
    EVENT_LAST = 3
};

enum class ImageDecodingState : int32_t {
    UNRESOLVED = 0,
    BASE_INFO_ERROR = 1,
    BASE_INFO_PARSED = 2,
    IMAGE_DECODING = 3,
    IMAGE_ERROR = 4,
    PARTIAL_IMAGE = 5,
    IMAGE_DECODED = 6
};

enum class SourceDecodingState : int32_t {
    UNRESOLVED = 0,
    SOURCE_ERROR = 1,
    UNKNOWN_FORMAT = 2,
    FORMAT_RECOGNIZED = 3,
    UNSUPPORTED_FORMAT = 4,
    FILE_INFO_ERROR = 5,
    FILE_INFO_DECODED = 6,
    IMAGE_DECODING = 7,
    ALL_IMAGES_ERROR = 8
};

enum class SourceInfoState : int32_t {
    SOURCE_ERROR = 0,
    SOURCE_INCOMPLETE = 1,
    UNKNOWN_FORMAT = 2,
    UNSUPPORTED_FORMAT = 3,
    FILE_INFO_ERROR = 4,
    FILE_INFO_PARSED = 5
};

struct ImageDecodingStatus {
    ImageInfo imageInfo;
    ImageDecodingState imageState = ImageDecodingState::UNRESOLVED;
};

struct SourceInfo {
    int32_t baseDensity = 0;
    uint32_t topLevelImageNum = 0;
    std::string encodedFormat;
    SourceInfoState state = SourceInfoState::SOURCE_ERROR;
};

struct IncrementalDecodingContext {
    std::unique_ptr<ImagePlugin::AbsImageDecoder> decoder;
    ImageDecodingState IncrementalState = ImageDecodingState::UNRESOLVED;
    uint8_t decodingProgress = 0;
};

class SourceStream;

class ImageSource {
public:
    ~ImageSource();
    NATIVEEXPORT static uint32_t GetSupportedFormats(std::set<std::string> &formats);
    NATIVEEXPORT static std::unique_ptr<ImageSource> CreateImageSource(std::unique_ptr<std::istream> is,
                                                                       const SourceOptions &opts, uint32_t &errorCode);
    NATIVEEXPORT static std::unique_ptr<ImageSource> CreateImageSource(const uint8_t *data, uint32_t size,
                                                                       const SourceOptions &opts, uint32_t &errorCode);
    NATIVEEXPORT static std::unique_ptr<ImageSource> CreateImageSource(const std::string &pathName,
                                                                       const SourceOptions &opts, uint32_t &errorCode);
    NATIVEEXPORT static std::unique_ptr<ImageSource> CreateImageSource(const int fd, const SourceOptions &opts,
                                                       uint32_t &errorCode);
    NATIVEEXPORT static std::unique_ptr<ImageSource> CreateIncrementalImageSource(const IncrementalSourceOptions &opts,
                                                                                  uint32_t &errorCode);

    NATIVEEXPORT std::unique_ptr<PixelMap> CreatePixelMap(const DecodeOptions &opts, uint32_t &errorCode)
    {
        return CreatePixelMapEx(0, opts, errorCode);
    }
    NATIVEEXPORT std::unique_ptr<PixelMap> CreatePixelMapEx(uint32_t index, const DecodeOptions &opts,
                                                            uint32_t &errorCode);
    NATIVEEXPORT std::unique_ptr<PixelMap> CreatePixelMap(uint32_t index, const DecodeOptions &opts,
                                                          uint32_t &errorCode);
    NATIVEEXPORT std::unique_ptr<IncrementalPixelMap> CreateIncrementalPixelMap(uint32_t index,
                                                                                const DecodeOptions &opts,
                                                                                uint32_t &errorCode);
    // for incremental source.
    NATIVEEXPORT uint32_t UpdateData(const uint8_t *data, uint32_t size, bool isCompleted);
    // for obtaining basic image information without decoding image data.
    NATIVEEXPORT uint32_t GetImageInfo(ImageInfo &imageInfo)
    {
        return GetImageInfo(0, imageInfo);
    }
    NATIVEEXPORT uint32_t GetImageInfo(uint32_t index, ImageInfo &imageInfo);
    NATIVEEXPORT const SourceInfo &GetSourceInfo(uint32_t &errorCode);
    NATIVEEXPORT void RegisterListener(PeerListener *listener);
    NATIVEEXPORT void UnRegisterListener(PeerListener *listener);
    NATIVEEXPORT DecodeEvent GetDecodeEvent();
    NATIVEEXPORT void AddDecodeListener(DecodeListener *listener);
    NATIVEEXPORT void RemoveDecodeListener(DecodeListener *listener);
    NATIVEEXPORT bool IsIncrementalSource();
    NATIVEEXPORT uint32_t GetImagePropertyInt(uint32_t index, const std::string &key, int32_t &value);
    NATIVEEXPORT uint32_t GetImagePropertyString(uint32_t index, const std::string &key, std::string &value);
    NATIVEEXPORT uint32_t ModifyImageProperty(uint32_t index, const std::string &key, const std::string &value,
        const std::string &path);
    NATIVEEXPORT uint32_t ModifyImageProperty(uint32_t index, const std::string &key, const std::string &value,
        const int fd);
    NATIVEEXPORT uint32_t ModifyImageProperty(uint32_t index, const std::string &key, const std::string &value,
        uint8_t *data, uint32_t size);
    NATIVEEXPORT const NinePatchInfo &GetNinePatchInfo() const;
    NATIVEEXPORT void SetMemoryUsagePreference(const MemoryUsagePreference preference);
    NATIVEEXPORT MemoryUsagePreference GetMemoryUsagePreference();
    NATIVEEXPORT uint32_t GetFilterArea(const int &privacyType, std::vector<std::pair<uint32_t, uint32_t>> &ranges);

private:
    DISALLOW_COPY_AND_MOVE(ImageSource);
    using FormatAgentMap = std::map<std::string, ImagePlugin::AbsImageFormatAgent *>;
    using ImageStatusMap = std::map<uint32_t, ImageDecodingStatus>;
    using IncrementalRecordMap = std::map<PixelMap *, IncrementalDecodingContext>;
    ImageSource(std::unique_ptr<SourceStream> &&stream, const SourceOptions &opts);
    uint32_t CheckEncodedFormat(ImagePlugin::AbsImageFormatAgent &agent);
    static FormatAgentMap InitClass();
    uint32_t GetEncodedFormat(const std::string &formatHint, std::string &format);
    uint32_t DecodeImageInfo(uint32_t index, ImageStatusMap::iterator &iter);
    uint32_t DecodeSourceInfo(bool isAcquiredImageNum);
    uint32_t InitMainDecoder();
    ImagePlugin::AbsImageDecoder *CreateDecoder(uint32_t &errorCode);
    void CopyOptionsToPlugin(const DecodeOptions &opts, ImagePlugin::PixelDecodeOptions &plOpts);
    void CopyOptionsToProcOpts(const DecodeOptions &opts, DecodeOptions &procOpts, PixelMap &pixelMap);
    uint32_t CheckFormatHint(const std::string &formatHint, FormatAgentMap::iterator &formatIter);
    uint32_t GetSourceInfo();
    uint32_t OnSourceRecognized(bool isAcquiredImageNum);
    uint32_t OnSourceUnresolved();
    uint32_t SetDecodeOptions(std::unique_ptr<ImagePlugin::AbsImageDecoder> &decoder, uint32_t index,
                              const DecodeOptions &opts, ImagePlugin::PlImageInfo &plInfo);
    uint32_t UpdatePixelMapInfo(const DecodeOptions &opts, ImagePlugin::PlImageInfo &plInfo, PixelMap &pixelMap);
    // declare friend class, only IncrementalPixelMap can call PromoteDecoding function.
    friend class IncrementalPixelMap;
    uint32_t PromoteDecoding(uint32_t index, const DecodeOptions &opts, PixelMap &pixelMap, ImageDecodingState &state,
                             uint8_t &decodeProgress);
    void DetachIncrementalDecoding(PixelMap &pixelMap);
    ImageStatusMap::iterator GetValidImageStatus(uint32_t index, uint32_t &errorCode);
    uint32_t AddIncrementalContext(PixelMap &pixelMap, IncrementalRecordMap::iterator &iterator);
    uint32_t DoIncrementalDecoding(uint32_t index, const DecodeOptions &opts, PixelMap &pixelMap,
                                   IncrementalDecodingContext &recordContext);
    void SetIncrementalSource(const bool isIncrementalSource);
    bool IsStreamCompleted();
    FinalOutputStep GetFinalOutputStep(const DecodeOptions &opts, PixelMap &pixelMap, bool hasNinePatch);
    bool HasDensityChange(const DecodeOptions &opts, ImageInfo &srcImageInfo, bool hasNinePatch);
    bool ImageSizeChange(int32_t width, int32_t height, int32_t desiredWidth, int32_t desiredHeight);
    bool ImageConverChange(const Rect &cropRect, ImageInfo &dstImageInfo, ImageInfo &srcImageInfo);
    void Reset();
    static std::unique_ptr<SourceStream> DecodeBase64(const uint8_t *data, uint32_t size);
    static std::unique_ptr<SourceStream> DecodeBase64(const std::string &data);
    bool IsSpecialYUV();
    bool ConvertYUV420ToRGBA(uint8_t *data, uint32_t size, bool isSupportOdd, bool isAddUV, uint32_t &errorCode);
    std::unique_ptr<PixelMap> CreatePixelMapForYUV(uint32_t &errorCode);

    const std::string NINE_PATCH = "ninepatch";
    const std::string SKIA_DECODER = "SKIA_DECODER";
    static MultimediaPlugin::PluginServer &pluginServer_;
    static FormatAgentMap formatAgentMap_;
    std::unique_ptr<SourceStream> sourceStreamPtr_;
    SourceDecodingState decodeState_ = SourceDecodingState::UNRESOLVED;
    SourceInfo sourceInfo_;
    SourceOptions sourceOptions_;
    NinePatchInfo ninePatchInfo_;
    ImageStatusMap imageStatusMap_;
    IncrementalRecordMap incDecodingMap_;
    // The main decoder is responsible for ordinary decoding (non-Incremental decoding),
    // as well as decoding SourceInfo and ImageInfo.
    std::unique_ptr<ImagePlugin::AbsImageDecoder> mainDecoder_;
    DecodeOptions opts_;
    std::set<PeerListener *> listeners_;
    DecodeEvent decodeEvent_ = DecodeEvent::EVENT_COMPLETE_DECODE;
    std::map<int32_t, int32_t> decodeEventMap_;
    std::set<DecodeListener *> decodeListeners_;
    std::mutex listenerMutex_;
    std::mutex decodingMutex_;
    bool isIncrementalSource_ = false;
    bool isIncrementalCompleted_ = false;
    MemoryUsagePreference preference_ = MemoryUsagePreference::DEFAULT;
};
} // namespace Media
} // namespace OHOS

#endif // INTERFACES_INNERKITS_INCLUDE_IMAGE_SOURCE_H_
