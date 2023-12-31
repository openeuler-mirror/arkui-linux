/*
 * Copyright (c) 2022-2023 Huawei Device Co., Ltd.
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

#include "core/components_ng/image_provider/image_provider.h"

#include <cstdint>
#include <mutex>

#include "base/log/ace_trace.h"
#include "base/memory/referenced.h"
#include "core/common/container.h"
#include "core/common/container_scope.h"
#include "core/components_ng/image_provider/adapter/skia_image_data.h"
#include "core/components_ng/image_provider/animated_image_object.h"
#include "core/components_ng/image_provider/image_loading_context.h"
#include "core/components_ng/image_provider/image_object.h"
#include "core/components_ng/image_provider/image_utils.h"
#include "core/components_ng/image_provider/pixel_map_image_object.h"
#include "core/components_ng/image_provider/static_image_object.h"
#include "core/components_ng/image_provider/svg_image_object.h"
#include "core/components_ng/render/adapter/svg_canvas_image.h"
#include "core/image/image_loader.h"
#include "core/pipeline_ng/pipeline_context.h"

namespace OHOS::Ace::NG {

namespace {

void CacheImageObject(const RefPtr<ImageObject>& obj)
{
    auto pipelineCtx = PipelineContext::GetCurrentContext();
    CHECK_NULL_VOID(pipelineCtx);
    auto cache = pipelineCtx->GetImageCache();
    CHECK_NULL_VOID(cache);
    if (cache && obj->IsSupportCache()) {
        cache->CacheImgObjNG(obj->GetSourceInfo().GetKey(), obj);
    }
}
} // namespace

std::mutex ImageProvider::taskMtx_;
std::unordered_map<std::string, ImageProvider::Task> ImageProvider::tasks_;

bool ImageProvider::PrepareImageData(const RefPtr<ImageObject>& imageObj)
{
    CHECK_NULL_RETURN(imageObj, false);
    // data already loaded
    if (imageObj->GetData()) {
        return true;
    }
    // if image object has no skData, reload data.
    std::string errorMessage;
    do {
        auto imageLoader = ImageLoader::CreateImageLoader(imageObj->GetSourceInfo());
        if (!imageLoader) {
            errorMessage = "Fail to create image loader. Image source type is not supported";
            break;
        }
        auto newLoadedData = imageLoader->GetImageData(
            imageObj->GetSourceInfo(), WeakClaim(RawPtr(NG::PipelineContext::GetCurrentContext())));
        if (!newLoadedData) {
            errorMessage = "Fail to load data, please check if data source is invalid";
            break;
        }
        // load data success
        imageObj->SetData(newLoadedData);
        return true;
    } while (false);
    return false;
}

RefPtr<ImageObject> ImageProvider::QueryImageObjectFromCache(const ImageSourceInfo& src)
{
    if (!src.IsSupportCache()) {
        return nullptr;
    }
    auto pipelineCtx = PipelineContext::GetCurrentContext();
    CHECK_NULL_RETURN(pipelineCtx, nullptr);
    auto imageCache = pipelineCtx->GetImageCache();
    if (!imageCache) {
        LOGD("No image cache %{private}s.", src.ToString().c_str());
        return nullptr;
    }
    RefPtr<ImageObject> imageObj = imageCache->GetCacheImgObjNG(src.GetKey());
    if (imageObj) {
        LOGD("imageObj found in cache %{private}s", src.ToString().c_str());
    }
    return imageObj;
}

void ImageProvider::FailCallback(const std::string& key, const std::string& errorMsg, bool sync)
{
    auto ctxs = EndTask(key);
    auto notifyLoadFailTask = [ctxs, errorMsg] {
        for (auto&& it : ctxs) {
            auto ctx = it.Upgrade();
            if (!ctx) {
                continue;
            }
            ctx->FailCallback(errorMsg);
        }
    };
    if (sync) {
        notifyLoadFailTask();
    } else {
        ImageUtils::PostToUI(std::move(notifyLoadFailTask));
    }
}

void ImageProvider::SuccessCallback(const RefPtr<CanvasImage>& canvasImage, const std::string& key, bool sync)
{
    auto ctxs = EndTask(key);
    // when upload success, pass back canvasImage to LoadingContext
    auto notifyLoadSuccess = [ctxs, canvasImage] {
        for (auto&& it : ctxs) {
            auto ctx = it.Upgrade();
            if (!ctx) {
                continue;
            }
            ctx->SuccessCallback(canvasImage);
        }
    };
    if (sync) {
        notifyLoadSuccess();
    } else {
        ImageUtils::PostToUI(std::move(notifyLoadSuccess));
    }
}

void ImageProvider::CreateImageObjHelper(const ImageSourceInfo& src, bool sync)
{
    ACE_SCOPED_TRACE("CreateImageObj %s", src.ToString().c_str());
    // load image data
    auto imageLoader = ImageLoader::CreateImageLoader(src);
    if (!imageLoader) {
        std::string errorMessage("Fail to create image loader, Image source type not supported");
        FailCallback(src.GetKey(), errorMessage, sync);
        return;
    }
    RefPtr<ImageData> data =
        imageLoader->GetImageData(src, WeakClaim(RawPtr(NG::PipelineContext::GetCurrentContext())));

    // build ImageObject
    RefPtr<ImageObject> imageObj = ImageProvider::BuildImageObject(src, data);
    if (!imageObj) {
        FailCallback(src.GetKey(), "Fail to build image object", sync);
        return;
    }
    CacheImageObject(imageObj);

    auto ctxs = EndTask(src.GetKey());
    // callback to LoadingContext
    auto notifyDataReadyTask = [ctxs, imageObj, src] {
        for (auto&& it : ctxs) {
            auto ctx = it.Upgrade();
            if (!ctx) {
                continue;
            }
            ctx->DataReadyCallback(imageObj);
        }
        // ImageObject cache is only for saving image size info, clear data to save memory
        imageObj->ClearData();
    };
    if (sync) {
        notifyDataReadyTask();
    } else {
        ImageUtils::PostToUI(std::move(notifyDataReadyTask));
    }
}

bool ImageProvider::RegisterTask(const std::string& key, const WeakPtr<ImageLoadingContext>& ctx)
{
    std::scoped_lock<std::mutex> lock(taskMtx_);
    // key exists -> task is running
    auto it = tasks_.find(key);
    if (it != tasks_.end()) {
        it->second.ctxs_.insert(ctx);
        LOGD("task already exist %{public}s, callbacks size = %u", key.c_str(),
            static_cast<uint32_t>(it->second.ctxs_.size()));
        return false;
    }
    tasks_[key].ctxs_.insert(ctx);
    LOGD("task is new %{public}s", key.c_str());
    return true;
}

std::set<WeakPtr<ImageLoadingContext>> ImageProvider::EndTask(const std::string& key)
{
    std::scoped_lock<std::mutex> lock(taskMtx_);
    auto it = tasks_.find(key);
    if (it == tasks_.end()) {
        LOGW("task not found in map %{private}s", key.c_str());
        return std::set<WeakPtr<ImageLoadingContext>>();
    }
    auto ctxs = it->second.ctxs_;
    if (ctxs.empty()) {
        LOGW("registered task has empty context %{public}s", key.c_str());
    }
    tasks_.erase(it);
    LOGD("endTask %s, ctx size = %u", key.c_str(), static_cast<uint32_t>(ctxs.size()));
    return ctxs;
}

void ImageProvider::CancelTask(const std::string& key, const WeakPtr<ImageLoadingContext>& ctx)
{
    std::scoped_lock<std::mutex> lock(taskMtx_);
    auto it = tasks_.find(key);
    CHECK_NULL_VOID(it != tasks_.end());
    CHECK_NULL_VOID(it->second.ctxs_.find(ctx) != it->second.ctxs_.end());
    // only one LoadingContext waiting for this task, can just cancel
    if (it->second.ctxs_.size() == 1) {
        bool canceled = it->second.bgTask_.Cancel();
        LOGD("cancel bgTask %s, result: %d", key.c_str(), canceled);
        if (canceled) {
            tasks_.erase(it);
            return;
        }
    }
    // other LoadingContext still waiting for this task, remove ctx from set
    it->second.ctxs_.erase(ctx);
}

void ImageProvider::CreateImageObject(const ImageSourceInfo& src, const WeakPtr<ImageLoadingContext>& ctx, bool sync)
{
    if (!RegisterTask(src.GetKey(), ctx)) {
        // task is already running, only register callbacks
        return;
    }
    if (sync) {
        CreateImageObjHelper(src, true);
    } else {
        std::scoped_lock<std::mutex> lock(taskMtx_);
        // wrap with [CancelableCallback] and record in [tasks_] map
        CancelableCallback<void()> task;
        task.Reset([src] { ImageProvider::CreateImageObjHelper(src); });
        tasks_[src.GetKey()].bgTask_ = task;
        ImageUtils::PostToBg(task);
    }
}

RefPtr<ImageObject> ImageProvider::BuildImageObject(const ImageSourceInfo& src, const RefPtr<ImageData>& data)
{
    if (!data) {
        LOGW("data is null when try ParseImageObjectType, src: %{public}s", src.ToString().c_str());
        return nullptr;
    }
    if (src.IsSvg()) {
        // SVG object needs to make SVG dom during creation
        return SvgImageObject::Create(src, data);
    }
    if (src.IsPixmap()) {
        return PixelMapImageObject::Create(src, data);
    }

    // standard skia image object
    auto skiaImageData = DynamicCast<SkiaImageData>(data);
    CHECK_NULL_RETURN(skiaImageData, nullptr);
    auto [size, frameCount] = skiaImageData->Parse();
    CHECK_NULL_RETURN(size.IsPositive() && frameCount > 0, nullptr);

    if (frameCount > 1) {
        return MakeRefPtr<AnimatedImageObject>(src, size, data);
    }
    return MakeRefPtr<StaticImageObject>(src, size, data);
}
} // namespace OHOS::Ace::NG
