/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd. All rights reserved.
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

#include "adapter/ohos/entrance/capability_registry.h"

#include "adapter/ohos/capability/clipboard/clipboard_impl.h"
#include "adapter/ohos/capability/distributed/storage/distributed_storage_interface.h"
#include "adapter/ohos/capability/environment/environment_proxy_impl.h"
#include "adapter/ohos/capability/preference/storage_impl.h"
#include "core/common/clipboard/clipboard_proxy.h"
#include "core/common/environment/environment_proxy.h"
#include "core/common/storage/storage_proxy.h"

namespace OHOS::Ace {

void CapabilityRegistry::Register()
{
    ClipboardProxy::GetInstance()->SetDelegate(std::make_unique<ClipboardProxyImpl>());
    StorageProxy::GetInstance()->SetDelegate(std::make_unique<StorageProxyImpl>());
    StorageProxy::GetInstance()->SetDistributedDelegate(std::make_unique<DistributedStorageInterface>());
    EnvironmentProxy::GetInstance()->SetDelegate(std::make_unique<EnvironmentProxyImpl>());
}

} // namespace OHOS::Ace
