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

#ifndef INTERFACES_INNERKITS_INCLUDE_PIXEL_MAP_MANAGER_H_
#define INTERFACES_INNERKITS_INCLUDE_PIXEL_MAP_MANAGER_H_

#include "pixel_map.h"

namespace OHOS {
namespace Media {
class PixelMapManager {
public:
    explicit PixelMapManager(PixelMap *pixelMap) : pixelMap_(pixelMap)
    {}

    void FreePixels()
    {
        pixelMap_.clear();
    }

    bool Invalid()
    {
        return pixelMap_ == nullptr;
    }

    PixelMap &GetPixelMap()
    {
        return *pixelMap_;
    }

    int32_t GetByteCount()
    {
        if (pixelMap_ == nullptr) {
            return 0;
        }
        return pixelMap_->GetByteCount();
    }

    void Ref()
    {
        if (pixelMap_ == nullptr) {
            return;
        }
        pixelMap_->IncStrongRef(nullptr);
    }

    void UnRef()
    {
        if (pixelMap_ == nullptr) {
            return;
        }
        pixelMap_->DecStrongRef(nullptr);
    }

    ~PixelMapManager()
    {}

private:
    ::OHOS::sptr<PixelMap> pixelMap_ = nullptr;
};
} // namespace Media
} // namespace OHOS
#endif // INTERFACES_INNERKITS_INCLUDE_PIXEL_MAP_MANAGER_H_
