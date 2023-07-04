/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ES2PANDA_COMPILER_INCLUDE_COMPILER_IMPL_H
#define ES2PANDA_COMPILER_INCLUDE_COMPILER_IMPL_H

#include <es2panda.h>
#include <macros.h>
#include <mem/arena_allocator.h>
#include <os/thread.h>
#include <typescript/extractor/typeExtractor.h>
#include <util/hotfix.h>

#include <string>

namespace panda::pandasm {
struct Program;
}  // namespace panda::pandasm

namespace panda::es2panda::parser {
class Program;
}  // namespace panda::es2panda::parser

namespace panda::es2panda::compiler {
class CompileFuncQueue;

class CompilerImpl {
public:
    explicit CompilerImpl(size_t threadCount): threadCount_(threadCount) {}
    ~CompilerImpl();
    NO_COPY_SEMANTIC(CompilerImpl);
    NO_MOVE_SEMANTIC(CompilerImpl);

    panda::pandasm::Program *Compile(parser::Program *program, const es2panda::CompilerOptions &options,
                                     const std::string &debugInfoSourceFile, const std::string &pkgName);
    static void DumpAsm(const panda::pandasm::Program *prog);

    void AddHotfixHelper(util::Hotfix *hotfixHelper)
    {
        hotfixHelper_ = hotfixHelper;
    }

private:
    size_t threadCount_ {0};
    CompileFuncQueue *queue_ {nullptr};
    util::Hotfix *hotfixHelper_ {nullptr};
    std::unique_ptr<extractor::TypeExtractor> extractor_ {};
};
}  // namespace panda::es2panda::compiler

#endif
