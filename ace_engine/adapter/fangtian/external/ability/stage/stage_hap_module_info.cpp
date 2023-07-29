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

#include "adapter/fangtian/external/ability/stage/stage_hap_module_info.h"

namespace OHOS::Ace {
void StageHapModuleInfo::Parse(const std::unique_ptr<JsonValue>& root)
{
    if (!root) {
        LOGE("The information of stage model application is null.");
        return;
    }
    compileMode_ = root->GetString("compileMode");
    moduleName_ = root->GetString("name");
    auto metaData = root->GetValue("metadata");
    if (metaData && metaData->IsArray()) {
        for (auto index = 0; index < metaData->GetArraySize(); ++index) {
            auto item = metaData->GetArrayItem(index);
            if (item && item->GetString("name") == "ArkTSPartialUpdate") {
                isPartialUpdate_ = (item->GetString("value", "true") != "false");
            }
        }
    }
    auto abilities = root->GetValue("abilities");
    if (abilities && abilities->IsArray()) {
        auto item = abilities->GetArrayItem(0);
        if (item) {
            labelId_ = item->GetUInt("labelId", 0);
        }
    }
}

const std::string& StageHapModuleInfo::GetCompileMode() const
{
    return compileMode_;
}

const std::string& StageHapModuleInfo::GetModuleName() const
{
    return moduleName_;
}

const std::string& StageHapModuleInfo::GetSrcLanguage() const
{
    return srcLanguage_;
}

bool StageHapModuleInfo::GetPartialUpdateFlag() const
{
    return isPartialUpdate_;
}

uint32_t StageHapModuleInfo::GetLabelId() const
{
    return labelId_;
}
} // namespace OHOS::Ace
