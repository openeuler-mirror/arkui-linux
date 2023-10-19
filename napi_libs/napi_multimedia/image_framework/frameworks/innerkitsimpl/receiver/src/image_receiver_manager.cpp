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

#include "image_receiver_manager.h"
namespace OHOS {
namespace Media {
using namespace OHOS::HiviewDFX;
using namespace std;
string ImageReceiverManager::SaveImageReceiver(shared_ptr<ImageReceiver> imageReceiver)
{
    string id = "1";

    if (getImageReceiverByKeyId(id) != nullptr) {
        mapReceiver_.erase(id);
    }

    mapReceiver_.insert(pair<string, shared_ptr<ImageReceiver>>(id, imageReceiver));
    return id;
}
sptr<Surface> ImageReceiverManager::getSurfaceByKeyId(string keyId)
{
    map<string, shared_ptr<ImageReceiver>>::iterator iter;
    shared_ptr<ImageReceiver> imageReceiver = nullptr;
    iter = mapReceiver_.find(keyId);
    if (iter != mapReceiver_.end()) {
        imageReceiver = iter->second;
    }
    if (imageReceiver == nullptr) {
        return nullptr;
    }
    return imageReceiver->GetReceiverSurface();
}
shared_ptr<ImageReceiver> ImageReceiverManager::getImageReceiverByKeyId(string keyId)
{
    map<string, shared_ptr<ImageReceiver>>::iterator iter;
    shared_ptr<ImageReceiver> imageReceiver = nullptr;
    iter = mapReceiver_.find(keyId);
    if (iter != mapReceiver_.end()) {
        imageReceiver = iter->second;
    }
    return imageReceiver;
}
} // namespace Media
} // namespace OHOS
