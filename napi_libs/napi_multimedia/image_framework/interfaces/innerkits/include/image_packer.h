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

#ifndef INTERFACES_INNERKITS_INCLUDE_IMAGE_PACKER_H_
#define INTERFACES_INNERKITS_INCLUDE_IMAGE_PACKER_H_

#include <set>
#include "image_source.h"
#include "image_type.h"
#include "nocopyable.h"
#include "pixel_map.h"

namespace OHOS {
namespace MultimediaPlugin {
class PluginServer;
} // namespace MultimediaPlugin
} // namespace OHOS

namespace OHOS {
namespace ImagePlugin {
struct PlEncodeOptions;
class AbsImageEncoder;
} // namespace ImagePlugin
} // namespace OHOS

namespace OHOS {
namespace Media {
struct PackOption {
    /**
     * Specify the file format of the output image.
     */
    std::string format;
    /**
     * Hint to the compression quality, 0-100.
     * Larger values indicate higher image quality but usually take up larger sizes.
     */
    uint8_t quality = 100;

    /**
     * Hint to how many images will be packed into the image file.
     */
    uint32_t numberHint = 1;
};

class PackerStream;

class ImagePacker {
public:
    ImagePacker();
    ~ImagePacker();
    static uint32_t GetSupportedFormats(std::set<std::string> &formats);
    uint32_t StartPacking(uint8_t *data, uint32_t maxSize, const PackOption &option);
    uint32_t StartPacking(const std::string &filePath, const PackOption &option);
    uint32_t StartPacking(const int &fd, const PackOption &option);
    uint32_t StartPacking(std::ostream &outputStream, const PackOption &option);
    uint32_t AddImage(PixelMap &pixelMap);
    uint32_t AddImage(ImageSource &source);
    uint32_t AddImage(ImageSource &source, uint32_t index);
    uint32_t FinalizePacking();
    uint32_t FinalizePacking(int64_t &packedSize);

protected:
    uint32_t StartPackingAdapter(PackerStream &outputStream, const PackOption &option);

private:
    DISALLOW_COPY_AND_MOVE(ImagePacker);
    static void CopyOptionsToPlugin(const PackOption &opts, ImagePlugin::PlEncodeOptions &plOpts);
    uint32_t StartPackingImpl(const PackOption &option);
    bool GetEncoderPlugin(const PackOption &option);
    void FreeOldPackerStream();
    bool IsPackOptionValid(const PackOption &option);
    static MultimediaPlugin::PluginServer &pluginServer_;
    std::unique_ptr<PackerStream> packerStream_;
    std::unique_ptr<ImagePlugin::AbsImageEncoder> encoder_;
    std::unique_ptr<PixelMap> pixelMap_;  // inner imagesource create, our manage the lifecycle
};
} // namespace Media
} // namespace OHOS

#endif // INTERFACES_INNERKITS_INCLUDE_IMAGE_PACKER_H_
