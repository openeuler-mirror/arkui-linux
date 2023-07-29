/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
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

#include "adapter/fangtian/external/ability/fa/fa_hap_module_info.h"

namespace OHOS::Ace {
void FaHapModuleInfo::Parse(const std::unique_ptr<JsonValue>& root)
{
    if (!root) {
        LOGE("The information of fa model application is null.");
        return;
    }
    mainAbility_ = root->GetString("mainAbility");
    moduleName_ = root->GetString("name");
    package_ = root->GetString("package");

    auto abilities = root->GetValue("abilities");
    if (abilities && abilities->IsArray()) {
        auto item = abilities->GetArrayItem(0);
        if (item) {
            srcLanguage_ = item->GetString("srcLanguage");
            LOGI("srcLanguage: %s", srcLanguage_.c_str());
        }
    }
}

const std::string& FaHapModuleInfo::GetMainAbility() const
{
    return mainAbility_;
}

const std::string& FaHapModuleInfo::GetModuleName() const
{
    return moduleName_;
}

const std::string& FaHapModuleInfo::GetPackage() const
{
    return package_;
}

const std::string& FaHapModuleInfo::GetSrcLanguage() const
{
    return srcLanguage_;
}
} // namespace OHOS::Ace
