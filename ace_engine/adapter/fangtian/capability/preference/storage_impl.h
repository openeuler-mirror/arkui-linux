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
#ifndef FOUNDATION_ACE_ACE_ENGINE_ADAPTER_OHOS_CAPABILITY_PERFERENCE_STORAGE_IMPL_H
#define FOUNDATION_ACE_ACE_ENGINE_ADAPTER_OHOS_CAPABILITY_PERFERENCE_STORAGE_IMPL_H

#include "base/thread/task_executor.h"
// Fangtian TODO 
// #include "preferences.h"
// #include "preferences_helper.h"
#include "base/utils/string_utils.h"
#include "core/common/storage/storage_interface.h"
#include "core/common/container.h"

namespace OHOS::Ace {
class StorageImpl : public Storage {
    DECLARE_ACE_TYPE(StorageImpl, Storage);

public:
    explicit StorageImpl(const RefPtr<TaskExecutor>& taskExecutor) : Storage(taskExecutor)
    {
        if (!Container::Current()) {
            LOGE("StorageImpl: Container empty");
            return;
        }
        fileName_ = Container::Current()->GetFilesDataPath() + "/persistent_storage";
    };
    ~StorageImpl() override = default;

    void SetString(const std::string& key, const std::string& value) override;
    std::string GetString(const std::string& key) override;
    void SetDouble(const std::string& key, const double value) override
    {}
    bool GetDouble(const std::string& key, double& value) override
    {
        return false;
    }
    void SetBoolean(const std::string& key, const bool value) override
    {}
    bool GetBoolean(const std::string& key, bool& value) override
    {
        return false;
    }
    void Clear() override;
    void Delete(const std::string& key) override;

private:
    std::shared_ptr<NativePreferences::Preferences> GetPreference(const std::string& fileName);
    int errCode_;
    std::string fileName_;
};

class StorageProxyImpl : public StorageInterface {
    RefPtr<Storage> GetStorage(const RefPtr<TaskExecutor>& taskExecutor) const override;
};
} // namespace OHOS::Ace
#endif // FOUNDATION_ACE_ACE_ENGINE_ADAPTER_OHOS_CAPABILITY_PERFERENCE_STORAGE_IMPL_H
