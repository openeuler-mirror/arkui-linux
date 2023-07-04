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

#include "module_load_checker.h"

#include "utils/log.h"

void ModuleLoadChecker::SetModuleBlocklist(
    std::unordered_map<int32_t, std::unordered_set<std::string>>&& blocklist)
{
    moduleBlocklist_ = std::move(blocklist);
    HILOG_INFO("moduleBlocklist_ size = %{public}d", static_cast<int32_t>(moduleBlocklist_.size()));
}

void ModuleLoadChecker::SetProcessExtensionType(int32_t extensionType)
{
    processExtensionType_ = extensionType;
}

int32_t ModuleLoadChecker::GetProcessExtensionType()
{
    return processExtensionType_;
}

bool ModuleLoadChecker::CheckModuleLoadable(const char* moduleName)
{
    HILOG_INFO("check blocklist, moduleName = %{public}s, processExtensionType_ = %{public}d",
        moduleName, static_cast<int32_t>(processExtensionType_));
    const auto& blockListIter = moduleBlocklist_.find(processExtensionType_);
    if (blockListIter == moduleBlocklist_.end()) {
        return true;
    }
    auto blackList = blockListIter->second;
    if (blackList.find(moduleName) == blackList.end()) {
        return true;
    }
    return false;
}