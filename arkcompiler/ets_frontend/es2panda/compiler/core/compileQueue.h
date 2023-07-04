/*
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

#ifndef ES2PANDA_COMPILER_CORE_COMPILEQUEUE_H
#define ES2PANDA_COMPILER_CORE_COMPILEQUEUE_H

#include <aot/options.h>
#include <macros.h>
#include <os/thread.h>
#include <util/symbolTable.h>
#include <util/workerQueue.h>

#include <condition_variable>
#include <mutex>

namespace panda::es2panda::binder {
class FunctionScope;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::compiler {

class CompilerContext;

class CompileFunctionJob : public util::WorkerJob {
public:
    explicit CompileFunctionJob(CompilerContext *context) : context_(context) {};
    NO_COPY_SEMANTIC(CompileFunctionJob);
    NO_MOVE_SEMANTIC(CompileFunctionJob);
    ~CompileFunctionJob() override = default;

    binder::FunctionScope *Scope() const
    {
        return scope_;
    }

    void SetFunctionScope(binder::FunctionScope *scope)
    {
        scope_ = scope;
    }

    void Run() override;

private:
    CompilerContext *context_ {};
    binder::FunctionScope *scope_ {};
};

class CompileModuleRecordJob : public util::WorkerJob {
public:
    explicit CompileModuleRecordJob(CompilerContext *context) : context_(context) {};
    NO_COPY_SEMANTIC(CompileModuleRecordJob);
    NO_MOVE_SEMANTIC(CompileModuleRecordJob);
    ~CompileModuleRecordJob() override = default;

    void Run() override;

private:
    CompilerContext *context_ {};
};

class CompileFileJob : public util::WorkerJob {
public:
    explicit CompileFileJob(es2panda::SourceFile *src, es2panda::CompilerOptions *options,
                            std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo,
                            util::SymbolTable *symbolTable, panda::ArenaAllocator *allocator)
        : src_(src), options_(options), progsInfo_(progsInfo), symbolTable_(symbolTable), allocator_(allocator) {};
    NO_COPY_SEMANTIC(CompileFileJob);
    NO_MOVE_SEMANTIC(CompileFileJob);
    ~CompileFileJob() override = default;

    void Run() override;

private:
    static std::mutex global_m_;
    es2panda::SourceFile *src_;
    es2panda::CompilerOptions *options_;
    std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo_;
    util::SymbolTable *symbolTable_;
    panda::ArenaAllocator *allocator_;
};

class CompileFuncQueue : public util::WorkerQueue {
public:
    explicit CompileFuncQueue(size_t threadCount, CompilerContext *context)
        : util::WorkerQueue(threadCount), context_(context) {}

    NO_COPY_SEMANTIC(CompileFuncQueue);
    NO_MOVE_SEMANTIC(CompileFuncQueue);
    ~CompileFuncQueue() override = default;

    void Schedule() override;

private:
    CompilerContext *context_;
};

class CompileFileQueue : public util::WorkerQueue {
public:
    explicit CompileFileQueue(size_t threadCount, es2panda::CompilerOptions *options,
                              std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo,
                              util::SymbolTable *symbolTable, panda::ArenaAllocator *allocator)
        : util::WorkerQueue(threadCount), options_(options), progsInfo_(progsInfo),
        symbolTable_(symbolTable), allocator_(allocator) {}

    NO_COPY_SEMANTIC(CompileFileQueue);
    NO_MOVE_SEMANTIC(CompileFileQueue);
    ~CompileFileQueue() override = default;

    void Schedule() override;

private:
    es2panda::CompilerOptions *options_;
    std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo_;
    util::SymbolTable *symbolTable_;
    panda::ArenaAllocator *allocator_;
};

}  // namespace panda::es2panda::compiler

#endif
