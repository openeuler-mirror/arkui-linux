/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_AOT_EMITFILES_H
#define ES2PANDA_AOT_EMITFILES_H

#include <aot/options.h>
#include <util/workerQueue.h>

#include <mutex>

namespace panda::es2panda::aot {
class EmitSingleAbcJob : public util::WorkerJob {
public:
    explicit EmitSingleAbcJob(const std::string &outputFileName, panda::pandasm::Program *prog,
                              std::map<std::string, size_t> *statp)
        : outputFileName_(outputFileName), prog_(prog), statp_(statp) {};
    NO_COPY_SEMANTIC(EmitSingleAbcJob);
    NO_MOVE_SEMANTIC(EmitSingleAbcJob);
    ~EmitSingleAbcJob() override = default;

    void Run() override;
private:
    std::string outputFileName_;
    panda::pandasm::Program *prog_;
    std::map<std::string, size_t> *statp_;
};

class EmitMergedAbcJob : public util::WorkerJob {
public:
    explicit EmitMergedAbcJob(const std::string &outputFileName,
                              const std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo)
        : outputFileName_(outputFileName), progsInfo_(progsInfo) {};
    NO_COPY_SEMANTIC(EmitMergedAbcJob);
    NO_MOVE_SEMANTIC(EmitMergedAbcJob);
    ~EmitMergedAbcJob() override = default;

    void Run() override;
private:
    std::string outputFileName_;
    const std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo_;
};

class EmitCacheJob : public util::WorkerJob {
public:
    explicit EmitCacheJob(const std::string &outputProtoName, panda::es2panda::util::ProgramCache *progCache)
        : outputProtoName_(outputProtoName), progCache_(progCache) {};
    NO_COPY_SEMANTIC(EmitCacheJob);
    NO_MOVE_SEMANTIC(EmitCacheJob);
    ~EmitCacheJob() override = default;

    void Run() override;
private:
    std::string outputProtoName_;
    panda::es2panda::util::ProgramCache *progCache_;
};

class EmitFileQueue : public util::WorkerQueue {
public:
    explicit EmitFileQueue(const std::unique_ptr<panda::es2panda::aot::Options> &options,
                           std::map<std::string, size_t> *statp,
                           const std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo)
        : WorkerQueue(options->CompilerOptions().fileThreadCount), options_(options), statp_(statp),
        progsInfo_(progsInfo) {
            mergeAbc_ = options_->CompilerOptions().mergeAbc;
        }

    NO_COPY_SEMANTIC(EmitFileQueue);
    NO_MOVE_SEMANTIC(EmitFileQueue);
    ~EmitFileQueue() override = default;

    void Schedule() override;

private:
    const std::unique_ptr<panda::es2panda::aot::Options> &options_;
    std::map<std::string, size_t> *statp_;
    const std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo_;
    bool mergeAbc_ { false };
};
}  // namespace panda::es2panda::aot

#endif
