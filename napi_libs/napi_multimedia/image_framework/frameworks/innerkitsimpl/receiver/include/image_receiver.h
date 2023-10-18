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

#ifndef FRAMEWORKS_INNERKITSIMPL_RECEIVER_INCLUDE_IMAGE_RECEIVER_H_
#define FRAMEWORKS_INNERKITSIMPL_RECEIVER_INCLUDE_IMAGE_RECEIVER_H_

#include <surface.h>
#include "display_type.h"
#include <cstdint>
#include <string>
#include <securec.h>
#include "hilog/log.h"
#include "image_format.h"
#include "image_type.h"
#include "log_tags.h"
#include "media_errors.h"
#include "pixel_map.h"
#include "image_receiver_context.h"

namespace OHOS {
namespace Media {
class SurfaceBufferAvaliableListener {
public:
    SurfaceBufferAvaliableListener()= default;
    virtual ~SurfaceBufferAvaliableListener()= default;
    virtual void OnSurfaceBufferAvaliable() = 0;
};
class ImageReceiver {
public:
    std::shared_ptr<ImageReceiverContext> iraContext_ = nullptr;
    sptr<Surface> receiverConsumerSurface_ = nullptr;
    sptr<Surface> receiverProducerSurface_ = nullptr;
    std::shared_ptr<SurfaceBufferAvaliableListener> surfaceBufferAvaliableListener_ = nullptr;
    ImageReceiver() {}
    ~ImageReceiver()
    {
        receiverConsumerSurface_ = nullptr;
        receiverProducerSurface_ = nullptr;
        iraContext_ = nullptr;
        surfaceBufferAvaliableListener_ = nullptr;
    }
    static inline int32_t pipeFd[2] = {};
    static inline std::string OPTION_FORMAT = "image/jpeg";
    static inline std::int32_t OPTION_QUALITY = 100;
    static inline std::int32_t OPTION_NUMBERHINT = 1;
    static std::shared_ptr<ImageReceiver> CreateImageReceiver(int32_t width,
                                                              int32_t height,
                                                              int32_t format,
                                                              int32_t capicity);
    sptr<Surface> GetReceiverSurface();
    OHOS::sptr<OHOS::SurfaceBuffer> ReadNextImage();
    OHOS::sptr<OHOS::SurfaceBuffer> ReadLastImage();
    int32_t SaveBufferAsImage(int &fd,
                              OHOS::sptr<OHOS::SurfaceBuffer> buffer,
                              InitializationOptions initializationOpts);
    int32_t SaveBufferAsImage(int &fd, InitializationOptions initializationOpts);
    void ReleaseBuffer(OHOS::sptr<OHOS::SurfaceBuffer> &buffer);
    std::unique_ptr<PixelMap> getSurfacePixelMap(InitializationOptions initializationOpts);
    void RegisterBufferAvaliableListener(
        std::shared_ptr<SurfaceBufferAvaliableListener> surfaceBufferAvaliableListener)
    {
        surfaceBufferAvaliableListener_ = surfaceBufferAvaliableListener;
    }
    static sptr<Surface> getSurfaceById(std::string id);
    void ReleaseReceiver();
};
class ImageReceiverSurfaceListener : public IBufferConsumerListener {
public:
    std::shared_ptr<ImageReceiver> ir_;
    void OnBufferAvailable() override;
};
} // namespace Media
} // namespace OHOS

#endif // FRAMEWORKS_INNERKITSIMPL_RECEIVER_INCLUDE_IMAGE_RECEIVER_H_
