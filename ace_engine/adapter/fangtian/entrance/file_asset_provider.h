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

#ifndef FOUNDATION_ACE_ADAPTER_OHOS_CPP_FILE_ASSET_PROVIDER_H
#define FOUNDATION_ACE_ADAPTER_OHOS_CPP_FILE_ASSET_PROVIDER_H

#include <map>
#include <string>
#include <unordered_map>
#include <vector>

#include "flutter/assets/asset_resolver.h"
#include "flutter/fml/mapping.h"

#include "base/resource/asset_manager.h"
#include "base/utils/macros.h"
#include "core/common/flutter/flutter_asset_manager.h"

namespace OHOS::Ace {

class ACE_EXPORT FileAssetProvider : public FlutterAssetProvider {
    DECLARE_ACE_TYPE(FileAssetProvider, FlutterAssetProvider);

public:
    FileAssetProvider() = default;
    ~FileAssetProvider() override = default;

    bool Initialize(const std::string& packagePath, const std::vector<std::string>& assetBasePaths);

    std::unique_ptr<fml::Mapping> GetAsMapping(const std::string& assetName) const override;

    bool IsValid() const override;

    std::string GetAssetPath(const std::string& assetName) override;

    void GetAssetList(const std::string& path, std::vector<std::string>& assetList) override;

private:
    mutable std::mutex mutex_;
    std::string packagePath_;
    std::vector<std::string> assetBasePaths_;
};

} // namespace OHOS::Ace

#endif // FOUNDATION_ACE_ADAPTER_OHOS_CPP_FILE_ASSET_PROVIDER_H
