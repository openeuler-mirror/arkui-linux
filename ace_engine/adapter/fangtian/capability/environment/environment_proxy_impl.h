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

#ifndef FOUNDATION_ACE_ADAPTER_OHOS_CAPABILITY_ENVIRONMENT_PROXY_IMPL_H
#define FOUNDATION_ACE_ADAPTER_OHOS_CAPABILITY_ENVIRONMENT_PROXY_IMPL_H

#include "base/utils/noncopyable.h"
#include "core/common/environment/environment_interface.h"

namespace OHOS::Ace {

class EnvironmentProxyImpl final : public EnvironmentInterface {
public:
    EnvironmentProxyImpl() = default;
    ~EnvironmentProxyImpl() override = default;

    RefPtr<Environment> GetEnvironment(const RefPtr<TaskExecutor>& taskExecutor) const override;

    ACE_DISALLOW_COPY_AND_MOVE(EnvironmentProxyImpl);
};

} // namespace OHOS::Ace

#endif // FOUNDATION_ACE_ADAPTER_OHOS_CAPABILITY_ENVIRONMENT_PROXY_IMPL_H
