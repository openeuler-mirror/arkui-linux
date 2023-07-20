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

#ifndef FOUNDATION_ACE_ADAPTER_OHOS_ENTRANCE_ACE_FORM_UTILS_IMPL_H
#define FOUNDATION_ACE_ADAPTER_OHOS_ENTRANCE_ACE_FORM_UTILS_IMPL_H

#include <string>
#include <unordered_map>

#include "core/components/form/resource/form_utils.h"

namespace OHOS::Ace {
class FormUtilsImpl final : public FormUtils {
public:
    FormUtilsImpl() = default;
    ~FormUtilsImpl() override = default;

    int32_t RouterEvent(
        int64_t formId, const std::string& action, int32_t containerId, const std::string& defaultBundleName) override;

    int32_t BackgroundEvent(
        int64_t formId, const std::string& action, int32_t containerId, const std::string& defaultBundleName) override;
};
} // namespace OHOS::Ace
#endif // FOUNDATION_ACE_ADAPTER_OHOS_ENTRANCE_ACE_FORM_UTILS_IMPL_H