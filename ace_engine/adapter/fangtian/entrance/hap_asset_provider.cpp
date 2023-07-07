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

#include "adapter/ohos/entrance/hap_asset_provider.h"

#include "base/log/ace_trace.h"
#include "base/log/log.h"
#include "base/utils/utils.h"

namespace OHOS::Ace {

bool HapAssetProvider::Initialize(const std::string& hapPath, const std::vector<std::string>& assetBasePaths)
{
    ACE_SCOPED_TRACE("Initialize");
    if (hapPath.empty() || assetBasePaths.empty()) {
        LOGE("the packagePath or assetBasePath is empty");
        return false;
    }

    runtimeExtractor_ = AbilityRuntime::RuntimeExtractor::Create(hapPath);
    CHECK_NULL_RETURN_NOLOG(runtimeExtractor_, false);
    assetBasePaths_ = assetBasePaths;
    hapPath_ = hapPath;
    LOGD("hapPath_:%{public}s", hapPath_.c_str());
    return true;
}

bool HapAssetProvider::IsValid() const
{
    return true;
}

class HapAssetMapping : public fml::Mapping {
public:
    explicit HapAssetMapping(const std::ostringstream& ostream)
    {
        const std::string& content = ostream.str();
        data_.assign(content.data(), content.data() + content.size());
    }

    ~HapAssetMapping() override = default;

    size_t GetSize() const override
    {
        return data_.size();
    }

    const uint8_t* GetMapping() const override
    {
        return data_.data();
    }

private:
    std::vector<uint8_t> data_;
};

std::unique_ptr<fml::Mapping> HapAssetProvider::GetAsMapping(const std::string& assetName) const
{
    ACE_SCOPED_TRACE("GetAsMapping");
    LOGD("assert name is: %{public}s :: %{public}s", hapPath_.c_str(), assetName.c_str());
    std::lock_guard<std::mutex> lock(mutex_);

    for (const auto& basePath : assetBasePaths_) {
        std::string fileName = basePath + assetName;
        bool hasFile = runtimeExtractor_->HasEntry(fileName);
        if (!hasFile) {
            LOGD("HasEntry failed: %{public}s %{public}s", hapPath_.c_str(), fileName.c_str());
            continue;
        }
        std::ostringstream osstream;
        hasFile = runtimeExtractor_->GetFileBuffer(fileName, osstream);
        if (!hasFile) {
            LOGD("GetFileBuffer failed: %{public}s %{public}s", hapPath_.c_str(), fileName.c_str());
            continue;
        }
        LOGD("GetFileBuffer Success: %{public}s %{public}s", hapPath_.c_str(), fileName.c_str());
        return std::make_unique<HapAssetMapping>(osstream);
    }
    LOGI("Cannot find base path of %{public}s", assetName.c_str());
    return nullptr;
}

std::string HapAssetProvider::GetAssetPath(const std::string& assetName)
{
    std::lock_guard<std::mutex> lock(mutex_);
    for (const auto& basePath : assetBasePaths_) {
        std::string fileName = basePath + assetName;
        bool hasFile = runtimeExtractor_->HasEntry(fileName);
        if (!hasFile) {
            continue;
        }
        return hapPath_ + "/" + basePath;
    }
    LOGI("Cannot find base path of %{public}s", assetName.c_str());
    return "";
}

void HapAssetProvider::GetAssetList(const std::string& path, std::vector<std::string>& assetList)
{
    std::lock_guard<std::mutex> lock(mutex_);
    for (const auto& basePath : assetBasePaths_) {
        std::string assetPath = basePath + path;
        bool res = runtimeExtractor_->IsDirExist(assetPath);
        if (!res) {
            LOGD("IsDirExist failed: %{public}s %{public}s", hapPath_.c_str(), assetPath.c_str());
            continue;
        }
        res = runtimeExtractor_->GetFileList(assetPath, assetList);
        if (!res) {
            LOGD("GetAssetList failed: %{public}s %{public}s", hapPath_.c_str(), assetPath.c_str());
            continue;
        }
        return;
    }
    LOGI("Cannot Get File List from %{public}s", path.c_str());
}

} // namespace OHOS::Ace
