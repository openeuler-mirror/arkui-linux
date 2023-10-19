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

#ifndef IMAGE_CREATOR_MANAGER_H
#define IMAGE_CREATOR_MANAGER_H

#include <surface.h>
#include <cstdint>
#include <string>
#include <securec.h>
#include "display_type.h"
#include "image_creator.h"

namespace OHOS {
namespace Media {
using namespace std;
class ImageCreatorManager {
public:
    ~ImageCreatorManager() {};
    ImageCreatorManager(const ImageCreatorManager&) = delete;
    ImageCreatorManager& operator=(const ImageCreatorManager&) = delete;
    static ImageCreatorManager& getInstance()
    {
        static ImageCreatorManager instance;
        return instance;
    }
    string SaveImageCreator(shared_ptr<ImageCreator> imageCreator);
    sptr<Surface> GetSurfaceByKeyId(string keyId);
    shared_ptr<ImageCreator> GetImageCreatorByKeyId(string keyId);
private:
    map<string, shared_ptr<ImageCreator>> mapCreator_;
    ImageCreatorManager() {};
};
} // namespace Media
} // namespace OHOS

#endif // IMAGE_CREATOR_MANAGER_H
