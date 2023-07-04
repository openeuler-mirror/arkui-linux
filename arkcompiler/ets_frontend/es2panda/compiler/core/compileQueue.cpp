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

#include "compileQueue.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/core/compilerContext.h>
#include <compiler/core/emitter/emitter.h>
#include <compiler/core/function.h>
#include <compiler/core/pandagen.h>
#include <es2panda.h>
#include <mem/arena_allocator.h>
#include <mem/pool_manager.h>
#include <protobufSnapshotGenerator.h>
#include <util/dumper.h>
#include <util/helpers.h>

namespace panda::es2panda::compiler {

std::mutex CompileFileJob::global_m_;

void CompileFunctionJob::Run()
{
    std::unique_lock<std::mutex> lock(m_);
    cond_.wait(lock, [this] { return dependencies_ == 0; });

    ArenaAllocator allocator(SpaceType::SPACE_TYPE_COMPILER, nullptr, true);
    PandaGen pg(&allocator, context_, scope_);

    Function::Compile(&pg);

    FunctionEmitter funcEmitter(&allocator, &pg);
    funcEmitter.Generate(context_->HotfixHelper());

    context_->GetEmitter()->AddFunction(&funcEmitter, context_);

    if (dependant_) {
        dependant_->Signal();
    }
}

void CompileModuleRecordJob::Run()
{
    std::unique_lock<std::mutex> lock(m_);
    cond_.wait(lock, [this] { return dependencies_ == 0; });

    ModuleRecordEmitter moduleEmitter(context_->Binder()->Program()->ModuleRecord(), context_->NewLiteralIndex());
    moduleEmitter.Generate();

    context_->GetEmitter()->AddSourceTextModuleRecord(&moduleEmitter, context_);

    if (dependant_) {
        dependant_->Signal();
    }
}

void CompileFileJob::Run()
{
    std::stringstream ss;
    std::string buffer;
    if (!src_->fileName.empty()) {
        if (!util::Helpers::ReadFileToBuffer(src_->fileName, ss)) {
            return;
        }
        buffer = ss.str();
        src_->source = buffer;

        auto cacheFileIter = options_->cacheFiles.find(src_->fileName);
        if (cacheFileIter != options_->cacheFiles.end()) {
            src_->hash = GetHash32String(reinterpret_cast<const uint8_t *>(buffer.c_str()));

            ArenaAllocator allocator(SpaceType::SPACE_TYPE_COMPILER, nullptr, true);
            auto *cacheProgramInfo = proto::ProtobufSnapshotGenerator::GetCacheContext(cacheFileIter->second,
                &allocator);

            if (cacheProgramInfo != nullptr && cacheProgramInfo->hashCode == src_->hash) {
                std::unique_lock<std::mutex> lock(global_m_);
                auto *cache = allocator_->New<util::ProgramCache>(src_->hash, std::move(cacheProgramInfo->program));
                progsInfo_.insert({src_->fileName, cache});
                return;
            }
        }
    }

    es2panda::Compiler compiler(options_->extension, options_->functionThreadCount);
    auto *prog = compiler.CompileFile(*options_, src_, symbolTable_);
    if (prog == nullptr) {
        return;
    }

    if (options_->optLevel != 0) {
        util::Helpers::OptimizeProgram(prog, src_->fileName);
    }

    {
        std::unique_lock<std::mutex> lock(global_m_);
        auto *cache = allocator_->New<util::ProgramCache>(src_->hash, std::move(*prog), true);
        progsInfo_.insert({src_->fileName, cache});
    }
}

void CompileFuncQueue::Schedule()
{
    ASSERT(jobsCount_ == 0);
    std::unique_lock<std::mutex> lock(m_);
    const auto &functions = context_->Binder()->Functions();

    for (auto *function : functions) {
        auto *funcJob = new CompileFunctionJob(context_);
        funcJob->SetFunctionScope(function);
        jobs_.push_back(funcJob);
        jobsCount_++;
    }

    if (context_->Binder()->Program()->Kind() == parser::ScriptKind::MODULE) {
        auto *moduleRecordJob = new CompileModuleRecordJob(context_);
        jobs_.push_back(moduleRecordJob);
        jobsCount_++;
    }

    lock.unlock();
    jobsAvailable_.notify_all();
}

void CompileFileQueue::Schedule()
{
    ASSERT(jobsCount_ == 0);
    std::unique_lock<std::mutex> lock(m_);

    for (auto &input: options_->sourceFiles) {
        auto *fileJob = new CompileFileJob(&input, options_, progsInfo_, symbolTable_, allocator_);
        jobs_.push_back(fileJob);
        jobsCount_++;
    }

    lock.unlock();
    jobsAvailable_.notify_all();
}

}  // namespace panda::es2panda::compiler
