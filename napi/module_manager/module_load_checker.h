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

#ifndef FOUNDATION_ACE_NAPI_MODULE_MANAGER_MODULE_LOAD_CHECKER_H
#define FOUNDATION_ACE_NAPI_MODULE_MANAGER_MODULE_LOAD_CHECKER_H

#include <string>
#include <unordered_map>
#include <unordered_set>

namespace {
    constexpr int32_t EXTENSION_TYPE_UNSPECIFIED = 255;
}

/**
 * @brief Module load checker. check whether module can be loaded
 * 
 */
class ModuleLoadChecker {
public:
    ModuleLoadChecker() = default;
    virtual ~ModuleLoadChecker() = default;

    /**
     * @brief Set the module blocklist, module in the blocklist will prevent loading 
     * 
     * @param blocklist module blocklist
     */
    void SetModuleBlocklist(std::unordered_map<int32_t, std::unordered_set<std::string>>&& blocklist);

    /**
     * @brief Set the process extension type
     * 
     * @param extensionType extension type
     */
    void SetProcessExtensionType(int32_t extensionType);

    /**
     * @brief Get the process extension type
     * 
     * @return The extension type
     */
    int32_t GetProcessExtensionType();

    /**
     * @brief Check whether the module is allowed to be loaded
     * 
     * @param moduleName module name
     * @return true The module can be loaded
     * @return false The module cannot be loaded
     */
    bool CheckModuleLoadable(const char* moduleName);

private:
    std::unordered_map<int32_t, std::unordered_set<std::string>> moduleBlocklist_;
    int32_t processExtensionType_{EXTENSION_TYPE_UNSPECIFIED};
};

#endif /* FOUNDATION_ACE_NAPI_MODULE_MANAGER_MODULE_LOAD_CHECKER_H */
