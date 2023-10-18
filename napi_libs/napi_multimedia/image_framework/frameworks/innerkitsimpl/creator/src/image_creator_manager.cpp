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

#include "image_creator_manager.h"
namespace OHOS {
namespace Media {
using namespace OHOS::HiviewDFX;
using namespace std;
string ImageCreatorManager::SaveImageCreator(shared_ptr<ImageCreator> imageCreator)
{
    string id = "1";

    if (GetImageCreatorByKeyId(id) != nullptr) {
        mapCreator_.erase(id);
    }

    mapCreator_.insert(pair<string, shared_ptr<ImageCreator>>(id, imageCreator));
    return id;
}
sptr<Surface> ImageCreatorManager::GetSurfaceByKeyId(string keyId)
{
    map<string, shared_ptr<ImageCreator>>::iterator iter;
    shared_ptr<ImageCreator> imageCreator = nullptr;
    iter = mapCreator_.find(keyId);
    if (iter != mapCreator_.end()) {
        imageCreator = iter->second;
    }
    if (imageCreator == nullptr) {
        return nullptr;
    }
    return imageCreator->GetCreatorSurface();
}
shared_ptr<ImageCreator> ImageCreatorManager::GetImageCreatorByKeyId(string keyId)
{
    map<string, shared_ptr<ImageCreator>>::iterator iter;
    shared_ptr<ImageCreator> imageCreator = nullptr;
    iter = mapCreator_.find(keyId);
    if (iter != mapCreator_.end()) {
        imageCreator = iter->second;
    }
    return imageCreator;
}
} // namespace Media
} // namespace OHOS
