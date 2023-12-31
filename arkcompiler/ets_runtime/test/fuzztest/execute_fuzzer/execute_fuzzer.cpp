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

#include "execute_fuzzer.h"
#include "ecmascript/napi/include/jsnapi.h"

using namespace panda;
using namespace panda::ecmascript;
namespace OHOS {
    static constexpr auto PANDA_MAIN_FUNCTION = "_GLOBAL::func_main_0";

    void ExecuteFuzzTest(const uint8_t* data, size_t size)
    {
        RuntimeOption option;
        option.SetGcType(RuntimeOption::GC_TYPE::GEN_GC);
        option.SetLogLevel(RuntimeOption::LOG_LEVEL::ERROR);
        auto vm = JSNApi::CreateJSVM(option);
        if (size <= 0) {
            return;
        }
        Local<StringRef> entry = StringRef::NewFromUtf8(vm, PANDA_MAIN_FUNCTION);
        std::string entryStr = entry->ToString();
        JSNApi::Execute(vm, data, size, entryStr);
        JSNApi::DestroyJSVM(vm);
    }
}

// Fuzzer entry point.
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
{
    // Run your code on data.
    OHOS::ExecuteFuzzTest(data, size);
    return 0;
}