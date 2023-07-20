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

#ifndef FOUNDATION_ACE_ACE_ENGINE_ADAPTER_OHOS_ENTRANCE_UTILS_H
#define FOUNDATION_ACE_ACE_ENGINE_ADAPTER_OHOS_ENTRANCE_UTILS_H

#include <string>

#include "base/log/log.h"
#include "core/common/flutter/flutter_asset_manager.h"

namespace OHOS::Ace {

std::string GetStringFromFile(const std::string& packagePathStr, const std::string& fileName);
std::string GetStringFromHap(const std::string& hapPath, const std::string& fileName);
bool GetIsArkFromConfig(const std::string& packagePathStr, bool isHap);

RefPtr<FlutterAssetProvider> CreateAssetProvider(const std::string& packagePath,
    const std::vector<std::string>& assetBasePaths);

inline const std::string GenerateFullPath(const std::string& prePath, const std::string& postPath)
{
    if (prePath.empty() && postPath.empty()) {
        return "";
    }
    std::string tmpPostPath = postPath;
    if (tmpPostPath.back() == '/') {
        tmpPostPath.pop_back();
    }
    std::string fullPath = prePath;
    if (fullPath.empty() || fullPath.back() == '/') {
        fullPath += tmpPostPath;
    } else {
        fullPath += "/" + tmpPostPath;
    }
    return fullPath;
}
} // namespace OHOS::Ace

#endif // FOUNDATION_ACE_ACE_ENGINE_ADAPTER_OHOS_ENTRANCE_UTILS_H
