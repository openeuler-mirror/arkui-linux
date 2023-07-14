/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "resmgr_fuzzer.h"

#include <string>
#include <securec.h>
#include <vector>
#include "resource_manager.h"

#undef private

using namespace std;
using namespace OHOS::Global::Resource;

namespace OHOS {
    bool GetStringByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            std::string extraInfo = "";
            result = rm->GetStringById(testId, extraInfo);
        }
        return result;
    }

    bool GetStringArrayByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            std::vector<std::string> outValue;
            result = rm->GetStringArrayById(testId, outValue);
        }
        return result;
    }

    bool GetIntegerByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            int outValue;
            result = rm->GetIntegerById(testId, outValue);
        }
        return result;
    }

    bool GetIntegerByNameFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            std::string testName(reinterpret_cast<const char*>(data), size);
            int outValue;
            result = rm->GetIntegerByName(testName, outValue);
        }
        return result;
    }

    bool GetBooleanByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            bool outValue;
            result = rm->GetBooleanById(testId, outValue);
        }
        return result;
    }

    bool GetFloatByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            float outValue;
            result = rm->GetFloatById(testId, outValue);
        }
        return result;
    }

    bool GetMediaByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            std::string outValue = "";
            result = rm->GetMediaById(testId, outValue);
        }
        return result;
    }

    bool GetMediaByNameFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            std::string testName(reinterpret_cast<const char*>(data), size);
            std::string outValue = "";
            result = rm->GetMediaByName(testName, outValue);
        }
        return result;
    }

    bool GetStringFormatByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            std::string outValue = "";
            result = rm->GetStringFormatById(outValue, testId);
        }
        return result;
    }

    bool GetColorByIdFuzzTest(const char* data, size_t size, ResourceManager *rm)
    {
        bool result = false;
        if (size > 0) {
            uint32_t testId = reinterpret_cast<uint32_t>(data);
            uint32_t outValue = 0;
            result = rm->GetColorById(testId, outValue);
        }
        return result;
    }

    void ResourceManagerImplFuzzTest(const char* data, size_t size)
    {
        ResourceManager *rm = CreateResourceManager();
        if (rm == nullptr) {
            return;
        }
        GetStringByIdFuzzTest(data, size, rm);
        GetStringArrayByIdFuzzTest(data, size, rm);
        GetIntegerByIdFuzzTest(data, size, rm);
        GetIntegerByNameFuzzTest(data, size, rm);
        GetBooleanByIdFuzzTest(data, size, rm);
        GetFloatByIdFuzzTest(data, size, rm);
        GetMediaByIdFuzzTest(data, size, rm);
        GetMediaByNameFuzzTest(data, size, rm);
        GetStringFormatByIdFuzzTest(data, size, rm);
        GetColorByIdFuzzTest(data, size, rm);
        delete rm;
        return;
    }
}

/* Fuzzer entry point */
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    /* Run your code on data */
    if (data == nullptr) {
        return 0;
    }

    char* ch = (char *)malloc(size + 1);
    if (ch == nullptr) {
        return 0;
    }

    (void)memset_s(ch, size, 0x00, size);
    if (memcpy_s(ch, size, data, size) != 0) {
        free(ch);
        ch = nullptr;
        return 0;
    }
    OHOS::ResourceManagerImplFuzzTest(ch, size);
    free(ch);
    ch = nullptr;
    return 0;
}

