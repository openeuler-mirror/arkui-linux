/**
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "arena_allocator.h"
#include "mergeProgram.h"
#include "options.h"
#include "protobufSnapshotGenerator.h"

#include <assembly-emitter.h>
#include <mem/pool_manager.h>

namespace panda::proto {
using mem::MemConfig;

class ProtoMemManager {
public:
    explicit ProtoMemManager()
    {
        constexpr auto COMPILER_SIZE = 512_MB;

        MemConfig::Initialize(0, 0, COMPILER_SIZE, 0);
        PoolManager::Initialize(PoolType::MMAP);
    }

    NO_COPY_SEMANTIC(ProtoMemManager);
    NO_MOVE_SEMANTIC(ProtoMemManager);

    ~ProtoMemManager()
    {
        PoolManager::Finalize();
        MemConfig::Finalize();
    }
};

int Run(int argc, const char **argv)
{
    auto options = std::make_unique<Options>();
    if (!options->Parse(argc, argv)) {
        std::cerr << options->ErrorMsg() << std::endl;
        return 1;
    }

    std::string protoPathInput = options->protoPathInput();
    std::string protoBinSuffix = options->protoBinSuffix();
    std::string outputFilePath = options->outputFilePath();
    if (outputFilePath.empty()) {
        outputFilePath = panda::os::file::File::GetExecutablePath().Value();
    }

    std::vector<std::string> protoFiles;
    if (!MergeProgram::CollectProtoFiles(protoPathInput, protoBinSuffix, protoFiles)) {
        return 1;
    }

    panda::ArenaAllocator allocator(panda::SpaceType::SPACE_TYPE_COMPILER, nullptr, true);

    std::vector<panda::pandasm::Program *> programs;
    programs.reserve(protoFiles.size());
    for(size_t i = 0; i < protoFiles.size(); i++) {
        auto *prog = allocator.New<panda::pandasm::Program>();
        programs.emplace_back(prog);
    }

    size_t idx = 0;
    for (auto &protoFile : protoFiles) {
        proto::ProtobufSnapshotGenerator::GenerateProgram(protoFile, *(programs[idx++]), &allocator);
    }

    std::string outputFileName = outputFilePath.append(panda::os::file::File::GetPathDelim()).
        append(options->outputFileName());
    if (!panda::pandasm::AsmEmitter::EmitPrograms(panda::os::file::File::GetExtendedFilePath(outputFileName), programs,
        true)) {
        return 1;
    }

    return 0;
}
} // namespace panda::proto

int main(int argc, const char **argv)
{
    panda::proto::ProtoMemManager mm;
    return panda::proto::Run(argc, argv);
}
