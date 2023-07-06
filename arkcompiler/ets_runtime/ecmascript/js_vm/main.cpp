/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#include <chrono>
#include <iostream>
#include <iterator>
#include <limits>
#include <ostream>
#include <signal.h>  // NOLINTNEXTLINE(modernize-deprecated-headers)
#include <vector>

#include "ecmascript/base/string_helper.h"
#include "ecmascript/ecma_string.h"
#include "ecmascript/ecma_vm.h"
#include "ecmascript/js_runtime_options.h"
#include "ecmascript/log.h"
#include "ecmascript/mem/mem_controller.h"
#include "ecmascript/mem/clock_scope.h"
#include "ecmascript/napi/include/jsnapi.h"

extern const std::string PUBLIC_API COMMON_HELP_HEAD_MSG;
extern const std::string PUBLIC_API HELP_OPTION_MSG;
extern const std::string PUBLIC_API HELP_TAIL_MSG;

namespace panda::ecmascript {
void BlockSignals()
{
#if defined(PANDA_TARGET_UNIX)
    sigset_t set;
    if (sigemptyset(&set) == -1) {
        LOG_ECMA(ERROR) << "sigemptyset failed";
        return;
    }
#endif  // PANDA_TARGET_UNIX
}

std::string GetHelper()
{
    std::string str;
    str.append(COMMON_HELP_HEAD_MSG);
    str.append(HELP_OPTION_MSG);
    str.append(HELP_TAIL_MSG);
    return str;
}

int Main(const int argc, const char **argv)
{
    auto startTime =
        std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::system_clock::now().time_since_epoch())
            .count();

    BlockSignals();

    if (argc < 2) { // 2: at least have two arguments
        std::cerr << GetHelper();
        return -1;
    }

    int newArgc = argc;
    std::string files = argv[argc - 1];
    if (!base::StringHelper::EndsWith(files, ".abc")) {
        std::cerr << "The last argument must be abc file" << std::endl;
        std::cerr << GetHelper();
        return 1;
    }

    newArgc--;
    JSRuntimeOptions runtimeOptions;
    bool retOpt = runtimeOptions.ParseCommand(newArgc, argv);
    if (!retOpt) {
        std::cerr << GetHelper();
        return 1;
    }

    if (runtimeOptions.IsStartupTime()) {
        std::cout << "\n"
                  << "Startup start time: " << startTime << std::endl;
    }
    bool ret = true;
    EcmaVM *vm = JSNApi::CreateEcmaVM(runtimeOptions);
    if (vm == nullptr) {
        std::cerr << "Cannot Create vm" << std::endl;
        return -1;
    }

    bool isMergeAbc = runtimeOptions.GetMergeAbc();
    JSNApi::SetBundle(vm, !isMergeAbc);
    {
        LocalScope scope(vm);
        std::string entry = runtimeOptions.GetEntryPoint();
#if defined(PANDA_TARGET_WINDOWS)
        arg_list_t fileNames = base::StringHelper::SplitString(files, ";");
#else
        arg_list_t fileNames = base::StringHelper::SplitString(files, ":");
#endif
        ClockScope execute;
        for (const auto &fileName : fileNames) {
            auto res = JSNApi::Execute(vm, fileName, entry);
            if (!res) {
                std::cerr << "Cannot execute panda file '" << fileName << "' with entry '" << entry << "'" << std::endl;
                ret = false;
                break;
            }
        }
        auto totalTime = execute.TotalSpentTime();
        if (runtimeOptions.IsEnablePrintExecuteTime()) {
            std::cout << "execute pandafile spent time " << totalTime << "ms" << std::endl;
        }
    }

    JSNApi::DestroyJSVM(vm);
    return ret ? 0 : -1;
}
}  // namespace panda::ecmascript

int main(int argc, const char **argv)
{
    return panda::ecmascript::Main(argc, argv);
}
