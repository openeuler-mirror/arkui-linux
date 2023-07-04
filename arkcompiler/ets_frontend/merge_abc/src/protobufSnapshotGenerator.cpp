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

#include "assemblyProgramProto.h"
#include "assembly-program.h"
#include "protobufSnapshotGenerator.h"

namespace panda::proto {
void ProtobufSnapshotGenerator::GenerateSnapshot(const panda::pandasm::Program &program, const std::string &outputName)
{
    protoPanda::Program protoProgram;

    Program::Serialize(program, protoProgram);

    std::fstream output(panda::os::file::File::GetExtendedFilePath(outputName),
        std::ios::out | std::ios::trunc | std::ios::binary);
    if (!output) {
        std::cerr << "Failed to create: " << outputName << std::endl;
        return;
    }
    protoProgram.SerializeToOstream(&output);
    output.close();
}

void ProtobufSnapshotGenerator::GenerateProgram(const std::string &inputName, panda::pandasm::Program &prog,
                                                panda::ArenaAllocator *allocator)
{
    std::fstream input(panda::os::file::File::GetExtendedFilePath(inputName), std::ios::in | std::ios::binary);
    if (!input) {
        std::cerr << "Failed to open: " << inputName << std::endl;
        return;
    }
    protoPanda::Program proto_program;
    if (!proto_program.ParseFromIstream(&input)) {
        std::cerr << "Failed to parse: " << inputName << std::endl;
        return;
    }
    Program::Deserialize(proto_program, prog, allocator);
}

panda::es2panda::util::ProgramCache *ProtobufSnapshotGenerator::GetCacheContext(const std::string &cacheFilePath,
    panda::ArenaAllocator *allocator)
{
    std::fstream input(panda::os::file::File::GetExtendedFilePath(cacheFilePath),
        std::ios::in | std::ios::binary);
    if (!input) {
        return nullptr;
    }

    protoPanda::ProgramCache protoCache;
    if (!protoCache.ParseFromIstream(&input)) {
        std::cerr << "Failed to parse cache file: " << cacheFilePath << std::endl;
        return nullptr;
    }

    auto *program = allocator->New<panda::pandasm::Program>();
    Program::Deserialize(protoCache.program(), *program, allocator);
    uint32_t hashCode = protoCache.hashcode();
    auto *programCache = allocator->New<panda::es2panda::util::ProgramCache>(hashCode, std::move(*program));

    return programCache;
}

void ProtobufSnapshotGenerator::UpdateCacheFile(const panda::es2panda::util::ProgramCache *programCache,
    const std::string &cacheFilePath)
{
    protoPanda::ProgramCache protoCache;
    protoCache.set_hashcode(programCache->hashCode);
    auto *protoProgram = protoCache.mutable_program();
    Program::Serialize(programCache->program, *protoProgram);

    std::fstream output(panda::os::file::File::GetExtendedFilePath(cacheFilePath),
        std::ios::out | std::ios::trunc | std::ios::binary);
    if (!output) {
        std::cerr << "Failed to create cache file: " << cacheFilePath << std::endl;
        return;
    }
    protoCache.SerializeToOstream(&output);
    output.close();
}

} // panda::proto
