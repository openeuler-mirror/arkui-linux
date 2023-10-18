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

#include "image_creator.h"
#include "image_packer.h"
#include "image_source.h"
#include "image_utils.h"
#include "hilog/log.h"
#include "image_creator_manager.h"

namespace OHOS {
namespace Media {
constexpr OHOS::HiviewDFX::HiLogLabel LABEL = {LOG_CORE, LOG_TAG_DOMAIN_ID_IMAGE, "imageCreator"};
std::map<uint8_t*, ImageCreator*> ImageCreator::bufferCreatorMap_;
using namespace OHOS::HiviewDFX;

GSError ImageCreator::OnBufferRelease(sptr<SurfaceBuffer> &buffer)
{
    HiLog::Info(LABEL, "OnBufferRelease");
    auto iter = bufferCreatorMap_.find(static_cast<uint8_t*>(buffer->GetVirAddr()));
    if (iter == bufferCreatorMap_.end()) {
        return GSERROR_NO_ENTRY;
    }
    auto icr = iter->second;
    if (icr->surfaceBufferReleaseListener_ == nullptr) {
        HiLog::Info(LABEL, "empty icr");
        return GSERROR_NO_ENTRY;
    }
    icr->surfaceBufferReleaseListener_->OnSurfaceBufferRelease();
    bufferCreatorMap_.erase(iter);
    return GSERROR_NO_ENTRY;
}

std::shared_ptr<ImageCreatorContext> ImageCreatorContext ::CreateImageCreatorContext()
{
    std::shared_ptr<ImageCreatorContext> icc = std::make_shared<ImageCreatorContext>();
    return icc;
}

void ImageCreatorSurfaceListener ::OnBufferAvailable()
{
    HiLog::Debug(LABEL, "CreatorBufferAvailable");
    if (ic_->surfaceBufferAvaliableListener_ != nullptr) {
        ic_->surfaceBufferAvaliableListener_->OnSurfaceBufferAvaliable();
    }
}

std::shared_ptr<ImageCreator> ImageCreator::CreateImageCreator(int32_t width,
    int32_t height, int32_t format, int32_t capicity)
{
    std::shared_ptr<ImageCreator> iva = std::make_shared<ImageCreator>();
    iva->iraContext_ = ImageCreatorContext::CreateImageCreatorContext();
    iva->creatorConsumerSurface_ = Surface::CreateSurfaceAsConsumer();
    if (iva->creatorConsumerSurface_ == nullptr) {
        HiLog::Debug(LABEL, "SurfaceAsConsumer == nullptr");
        return iva;
    }
    iva->creatorConsumerSurface_->SetDefaultWidthAndHeight(width, height);
    iva->creatorConsumerSurface_->SetQueueSize(capicity);
    sptr<ImageCreatorSurfaceListener> listener = new ImageCreatorSurfaceListener();
    listener->ic_ = iva;
    iva->creatorConsumerSurface_->
    RegisterConsumerListener((sptr<IBufferConsumerListener> &)listener);
    auto p = iva->creatorConsumerSurface_->GetProducer();
    iva->creatorProducerSurface_ = Surface::CreateSurfaceAsProducer(p);
    iva->creatorProducerSurface_->SetDefaultWidthAndHeight(width, height);
    iva->creatorProducerSurface_->SetQueueSize(capicity);
    if (iva->creatorProducerSurface_ == nullptr) {
        HiLog::Debug(LABEL, "SurfaceAsProducer == nullptr");
        return iva;
    }
    iva->iraContext_->SetCreatorBufferConsumer(iva->creatorConsumerSurface_);
    iva->iraContext_->SetCreatorBufferProducer(iva->creatorProducerSurface_);
    iva->iraContext_->SetWidth(width);
    iva->iraContext_->SetHeight(height);
    iva->iraContext_->SetFormat(format);
    iva->iraContext_->SetCapicity(capicity);
    ImageCreatorManager& imageCreatorManager = ImageCreatorManager::getInstance();
    std::string creatorKey = imageCreatorManager.SaveImageCreator(iva);
    iva->iraContext_->SetCreatorKey(creatorKey);
    iva->creatorProducerSurface_->
    RegisterReleaseListener(OnBufferRelease);
    return iva;
}

int64_t CreatorPackImage(uint8_t *tempBuffer, uint32_t bufferSize, std::unique_ptr<PixelMap> pixelMap)
{
    HiLog::Debug(LABEL, "PackImage");
    ImagePacker imagePacker;
    PackOption option;
    option.format = ImageReceiver::OPTION_FORMAT;
    option.quality = ImageReceiver::OPTION_QUALITY;
    option.numberHint = ImageReceiver::OPTION_NUMBERHINT;
    std::set<std::string> formats;

    uint32_t ret = imagePacker.GetSupportedFormats(formats);
    if (ret != SUCCESS) {
        HiLog::Error(LABEL, "image packer get supported format failed, ret=%{public}u.", ret);
        return 0;
    } else {
        HiLog::Debug(LABEL, "SUCCESS");
    }
    imagePacker.StartPacking(tempBuffer, bufferSize, option);
    imagePacker.AddImage(*pixelMap);
    int64_t packedSize = 0;
    imagePacker.FinalizePacking(packedSize);
    HiLog::Info(LABEL, "packedSize=%{public}lld.", static_cast<long long>(packedSize));
    return packedSize;
}
static const int BIT4 = 4;
static const int PRINT_WIDTH = 100;
static const int PRINT_WIDTH_MOD = 99;
static const uint8_t BIT4_MASK = 0xf;
static void dumpBuffer(const uint8_t* tempBuffer, int64_t size)
{
    std::vector<char> ss;
    char xx[] = "0123456789ABCDEF";
    for (int i = 0; i < size; i++) {
        ss.push_back(xx[(tempBuffer[i]>>BIT4)&BIT4_MASK]);
        ss.push_back(xx[tempBuffer[i]&BIT4_MASK]);
        if (i % PRINT_WIDTH == PRINT_WIDTH_MOD) {
            ss.push_back('\0');
            HiLog::Info(LABEL, "buffer[%{public}d] = [%{public}s]", i, ss.data());
            ss.clear();
            ss.resize(0);
        }
    }
    ss.push_back('\0');
    HiLog::Info(LABEL, "buffer[LAST] = [%{public}s]", ss.data());
    ss.clear();
    ss.resize(0);
}

int32_t ImageCreator::SaveSTP(uint32_t *buffer,
    uint8_t *tempBuffer, uint32_t bufferSize, InitializationOptions initializationOpts)
{
    int64_t errorCode = -1;
    std::unique_ptr<PixelMap> pixelMap = PixelMap::Create(buffer, bufferSize, initializationOpts);
    if (pixelMap.get() != nullptr) {
        ImageInfo imageInfo;
        pixelMap->GetImageInfo(imageInfo);
        HiLog::Debug(LABEL, "create pixel map imageInfo.size.width=%{public}u.",
            imageInfo.size.width);
    } else {
        HiLog::Error(LABEL, "pixelMap.get() == nullptr");
        return ERR_MEDIA_INVALID_VALUE;
    }
    ImagePacker imagePacker;
    errorCode = CreatorPackImage(tempBuffer, bufferSize, std::move(pixelMap));
    if (errorCode > 0) {
        int64_t len = errorCode < bufferSize ? errorCode : bufferSize;
        dumpBuffer(tempBuffer, len);
        errorCode = SUCCESS;
    } else {
        errorCode = ERR_MEDIA_INVALID_VALUE;
    }
    return errorCode;
}

static void ReleaseBuffer(AllocatorType allocatorType, uint8_t **buffer)
{
    if (allocatorType == AllocatorType::HEAP_ALLOC) {
        if (*buffer != nullptr) {
            free(*buffer);
            *buffer = nullptr;
        }
        return;
    }
}

static bool AllocHeapBuffer(uint64_t bufferSize, uint8_t **buffer)
{
    if (bufferSize == 0 || bufferSize > MALLOC_MAX_LENTH) {
        HiLog::Error(LABEL, "[PostProc]Invalid value of bufferSize");
        return false;
    }
    *buffer = static_cast<uint8_t *>(malloc(bufferSize));
    if (*buffer == nullptr) {
        HiLog::Error(LABEL, "[PostProc]alloc covert color buffersize[%{public}llu] failed.",
            static_cast<unsigned long long>(bufferSize));
        return false;
    }
    errno_t errRet = memset_s(*buffer, bufferSize, 0, bufferSize);
    if (errRet != EOK) {
        HiLog::Error(LABEL, "[PostProc]memset convertData fail, errorCode = %{public}d", errRet);
        ReleaseBuffer(AllocatorType::HEAP_ALLOC, buffer);
        return false;
    }
    return true;
}

int32_t ImageCreator::SaveSenderBufferAsImage(OHOS::sptr<OHOS::SurfaceBuffer> buffer,
    InitializationOptions initializationOpts)
{
    int32_t errorcode = 0;
    if (buffer != nullptr) {
        uint32_t *addr = static_cast<uint32_t *>(buffer->GetVirAddr());
        uint8_t *addr2 = nullptr;
        int32_t size = buffer->GetSize();
        if (!AllocHeapBuffer(size, &addr2)) {
            HiLog::Error(LABEL, "AllocHeapBuffer failed");
            return ERR_MEDIA_INVALID_VALUE;
        }
        errorcode = SaveSTP(addr, addr2, (uint32_t)size, initializationOpts);
        (iraContext_->GetCreatorBufferConsumer())->ReleaseBuffer(buffer, -1);
        HiLog::Info(LABEL, "start release");
    } else {
        HiLog::Debug(LABEL, "SaveBufferAsImage buffer == nullptr");
    }
    return errorcode;
}

OHOS::sptr<OHOS::SurfaceBuffer> ImageCreator::DequeueImage()
{
    int32_t flushFence = 0;
    OHOS::sptr<OHOS::SurfaceBuffer> buffer;
    sptr<Surface> creatorSurface = iraContext_->GetCreatorBufferProducer();
    BufferRequestConfig config;
    config.width = iraContext_->GetWidth();
    config.height = iraContext_->GetHeight();
    config.format = PIXEL_FMT_RGBA_8888;
    config.strideAlignment = 0x8;
    config.usage = BUFFER_USAGE_CPU_READ| BUFFER_USAGE_CPU_WRITE | BUFFER_USAGE_MEM_DMA;
    config.timeout = 0;
    SurfaceError surfaceError = creatorSurface->RequestBuffer(buffer, flushFence, config);
    if (surfaceError == SURFACE_ERROR_OK) {
        iraContext_->currentCreatorBuffer_ = buffer;
    } else {
        HiLog::Debug(LABEL, "error : request buffer is null");
    }
    if (buffer->GetVirAddr() != nullptr) {
        bufferCreatorMap_.insert(
            std::map<uint8_t*, ImageCreator*>::value_type(static_cast<uint8_t*>(buffer->GetVirAddr()), this));
    }
    return iraContext_->currentCreatorBuffer_;
}

void ImageCreator::QueueImage(OHOS::sptr<OHOS::SurfaceBuffer> &buffer)
{
    HiLog::Info(LABEL, "start Queue Image");
    int32_t flushFence = -1;
    BufferFlushConfig config;
    config.damage.w = iraContext_->GetWidth();
    config.damage.h = iraContext_->GetHeight();
    sptr<Surface> creatorSurface = iraContext_->GetCreatorBufferProducer();
    SurfaceError surfaceError = creatorSurface->FlushBuffer(buffer, flushFence, config);
    HiLog::Info(LABEL, "finish Queue Image");
    if (surfaceError != SURFACE_ERROR_OK) {
        HiLog::Debug(LABEL, "Queue fail");
    }
}
sptr<Surface> ImageCreator::GetCreatorSurface()
{
    return iraContext_->GetCreatorBufferConsumer();
}

sptr<Surface> ImageCreator::getSurfaceById(std::string id)
{
    ImageCreatorManager& imageCreatorManager = ImageCreatorManager::getInstance();
    sptr<Surface> surface = imageCreatorManager.GetSurfaceByKeyId(id);
    HiLog::Debug(LABEL, "getSurfaceByCreatorId");
    return surface;
}

void ImageCreator::ReleaseCreator()
{
    ImageCreator::~ImageCreator();
}
} // namespace Media
} // namespace OHOS
