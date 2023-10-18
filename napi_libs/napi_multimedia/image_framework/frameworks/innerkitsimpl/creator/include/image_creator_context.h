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

#ifndef IMAGE_CREATOR_PRIVATE_H
#define IMAGE_CREATOR_PRIVATE_H

#include <surface.h>
#include <list>
#include "hilog/log.h"

namespace OHOS {
namespace Media {
class ImageCreatorContext {
public:
    ImageCreatorContext() {
    };
    ~ImageCreatorContext() {
    };
    OHOS::sptr<OHOS::SurfaceBuffer> currentCreatorBuffer_;
    static std::shared_ptr<ImageCreatorContext> CreateImageCreatorContext();
    void SetCreatorBufferConsumer(sptr<Surface> &consumer)
    {
        creatorConsumerSurface_ = consumer;
    }
    sptr<Surface> GetCreatorBufferConsumer()
    {
        return creatorConsumerSurface_;
    }
    void SetCreatorBufferProducer(sptr<Surface> &producer)
    {
        creatorProducerSurface_ = producer;
    }
    sptr<Surface> GetCreatorBufferProducer()
    {
        return creatorProducerSurface_;
    }
    void SetWidth(int32_t width)
    {
        width_ = width;
    }
    int32_t GetWidth() const
    {
        return width_;
    }
    void SetHeight(int32_t height)
    {
        height_ = height;
    }
    int32_t GetHeight() const
    {
        return height_;
    }
    void SetFormat(int32_t format)
    {
        format_ = format;
    }
    int32_t GetFormat() const
    {
        return format_;
    }
    void SetCapicity(int32_t capicity)
    {
        capicity_ = capicity;
    }
    int32_t GetCapicity() const
    {
        return capicity_;
    }
    void SetCreatorKey(std::string creatorKey)
    {
        creatorKey_ = creatorKey;
    }
    std::string GetCreatorKey() const
    {
        return creatorKey_;
    }
    OHOS::sptr<OHOS::SurfaceBuffer> GetCurrentCreatorBuffer() const
    {
        return currentCreatorBuffer_;
    }
    void SetCurrentBuffer(OHOS::sptr<OHOS::SurfaceBuffer> currentCreatorBuffer)
    {
        currentCreatorBuffer_ = currentCreatorBuffer;
    }
private:
    static constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {
    LOG_CORE, LOG_TAG_DOMAIN_ID_IMAGE, "ImageCreatorContext"};
    OHOS::sptr<Surface> creatorConsumerSurface_;
    OHOS::sptr<Surface> creatorProducerSurface_;
    int32_t width_;
    int32_t height_;
    int32_t format_;
    int32_t capicity_;
    std::string creatorKey_;
};
} // namespace Media
} // namespace OHOS
#endif // IMAGE_CREATOR_PRIVATE_H
