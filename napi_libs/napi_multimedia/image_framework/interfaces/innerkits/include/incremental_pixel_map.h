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

#ifndef INCREMENTAL_PIXEL_MAP_H
#define INCREMENTAL_PIXEL_MAP_H

#include "nocopyable.h"
#include "image_type.h"
#include "pixel_map.h"
#include "peer_listener.h"

namespace OHOS {
namespace Media {
class ImageSource;

enum class IncrementalDecodingState : int32_t {
    UNRESOLVED = 0,
    BASE_INFO_ERROR = 1,
    BASE_INFO_PARSED = 2,
    IMAGE_DECODING = 3,
    IMAGE_ERROR = 4,
    PARTIAL_IMAGE = 5,
    IMAGE_DECODED = 6
};

struct IncrementalDecodingStatus {
    static constexpr uint8_t FULL_PROGRESS = 100;
    IncrementalDecodingState state = IncrementalDecodingState::UNRESOLVED;
    uint32_t errorDetail = 0;
    uint8_t decodingProgress = 0;
};

class IncrementalPixelMap : public PixelMap, public PeerListener {
public:
    IncrementalPixelMap() = delete;
    ~IncrementalPixelMap();
    uint32_t PromoteDecoding(uint8_t &decodeProgress);
    void DetachFromDecoding();
    const IncrementalDecodingStatus &GetDecodingStatus();

private:
    // declare friend class, only ImageSource can create IncrementalPixelMap object.
    friend class ImageSource;
    DISALLOW_COPY_AND_MOVE(IncrementalPixelMap);
    IncrementalPixelMap(uint32_t index, const DecodeOptions opts, ImageSource *imageSource);
    void OnPeerDestory() override;
    void DetachSource();
    IncrementalDecodingStatus decodingStatus_;
    uint32_t index_ = 0;
    DecodeOptions opts_;
    ImageSource *imageSource_ = nullptr;
};
} // namespace Media
} // namespace OHOS

#endif // INCREMENTAL_PIXEL_MAP_H
