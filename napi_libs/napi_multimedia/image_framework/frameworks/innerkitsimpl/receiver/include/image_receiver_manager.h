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

#ifndef FRAMEWORKS_INNERKITSIMPL_RECEIVER_INCLUDE_IMAGE_RECEIVER_MANAGER_H_
#define FRAMEWORKS_INNERKITSIMPL_RECEIVER_INCLUDE_IMAGE_RECEIVER_MANAGER_H_

#include <surface.h>
#include <cstdint>
#include <string>
#include <securec.h>
#include "display_type.h"
#include "image_receiver.h"

namespace OHOS {
namespace Media {
using namespace std;
class ImageReceiverManager {
public:
    ~ImageReceiverManager() {}
    ImageReceiverManager(const ImageReceiverManager&) = delete;
    ImageReceiverManager& operator=(const ImageReceiverManager&) = delete;
    static ImageReceiverManager& getInstance()
    {
        static ImageReceiverManager instance;
        return instance;
    }
    string SaveImageReceiver(shared_ptr<ImageReceiver> imageReceiver);
    sptr<Surface> getSurfaceByKeyId(string keyId);
    shared_ptr<ImageReceiver> getImageReceiverByKeyId(string keyId);
private:
    map<string, shared_ptr<ImageReceiver>> mapReceiver_;
    ImageReceiverManager() {}
};
} // namespace Media
} // namespace OHOS

#endif // FRAMEWORKS_INNERKITSIMPL_RECEIVER_INCLUDE_IMAGE_RECEIVER_MANAGER_H_
