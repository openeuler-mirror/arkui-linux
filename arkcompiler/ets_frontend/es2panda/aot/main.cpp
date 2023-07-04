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

#include <assembly-program.h>
#include <assembly-emitter.h>
#include <emitFiles.h>
#include <es2panda.h>
#include <mem/arena_allocator.h>
#include <mem/pool_manager.h>
#include <options.h>
#include <protobufSnapshotGenerator.h>
#include <util/dumper.h>
#include <util/moduleHelpers.h>
#include <util/programCache.h>
#include <util/workerQueue.h>

#include <iostream>

namespace panda::es2panda::aot {
using mem::MemConfig;
class MemManager {
public:
    explicit MemManager()
    {
        constexpr auto COMPILER_SIZE = 8192_MB;

        MemConfig::Initialize(0, 0, COMPILER_SIZE, 0);
        PoolManager::Initialize(PoolType::MMAP);
    }

    NO_COPY_SEMANTIC(MemManager);
    NO_MOVE_SEMANTIC(MemManager);

    ~MemManager()
    {
        PoolManager::Finalize();
        MemConfig::Finalize();
    }
};

static void GenerateBase64Output(panda::pandasm::Program *prog)
{
    auto pandaFile = panda::pandasm::AsmEmitter::Emit(*prog);
    const uint8_t *buffer = pandaFile->GetBase();
    size_t size = pandaFile->GetPtr().GetSize();
    std::string content(reinterpret_cast<const char*>(buffer), size);
    std::string base64Output = util::Base64Encode(content);
    std::cout << base64Output << std::endl;
}

static void DumpPandaFileSizeStatistic(std::map<std::string, size_t> &stat)
{
    size_t totalSize = 0;
    std::cout << "Panda file size statistic:" << std::endl;
    constexpr std::array<std::string_view, 2> INFO_STATS = {"instructions_number", "codesize"};

    for (const auto &[name, size] : stat) {
        if (find(INFO_STATS.begin(), INFO_STATS.end(), name) != INFO_STATS.end()) {
            continue;
        }
        std::cout << name << " section: " << size << std::endl;
        totalSize += size;
    }

    for (const auto &name : INFO_STATS) {
        std::cout << name << ": " << stat.at(std::string(name)) << std::endl;
    }

    std::cout << "total: " << totalSize << std::endl;
}

static bool GenerateProgramsByWorkers(const std::map<std::string, panda::es2panda::util::ProgramCache*> &programsInfo,
    const std::unique_ptr<panda::es2panda::aot::Options> &options, std::map<std::string, size_t> *statp)
{
    auto queue = new panda::es2panda::aot::EmitFileQueue(options, statp, programsInfo);

    bool emitResult = true;
    try {
        queue->Schedule();
        queue->Consume();
        queue->Wait();
    } catch (const class Error &e) {
        emitResult = false;
        std::cerr << e.Message() << std::endl;
    }

    delete queue;
    queue = nullptr;

    return emitResult;
}

static void DumpProgramInfos(const std::map<std::string, panda::es2panda::util::ProgramCache*> &programsInfo,
    const std::unique_ptr<panda::es2panda::aot::Options> &options)
{
    const es2panda::CompilerOptions &compilerOptions = options->CompilerOptions();
    if (compilerOptions.dumpAsm || compilerOptions.dumpLiteralBuffer) {
        for (const auto &progInfo : programsInfo) {
            if (compilerOptions.dumpAsm) {
                es2panda::Compiler::DumpAsm(&(progInfo.second->program));
            }

            if (compilerOptions.dumpLiteralBuffer) {
                panda::es2panda::util::Dumper::DumpLiterals(progInfo.second->program.literalarray_table);
            }
        }
    }
}

static bool GenerateProgram(const std::map<std::string, panda::es2panda::util::ProgramCache*> &programsInfo,
    const std::unique_ptr<panda::es2panda::aot::Options> &options)
{
    DumpProgramInfos(programsInfo, options);

    if (programsInfo.size() == 1) {
        auto *prog = &(programsInfo.begin()->second->program);
        if (options->OutputFiles().empty() && options->CompilerOutput().empty()) {
            GenerateBase64Output(prog);
            return true;
        }

        if (options->compilerProtoOutput().size() > 0) {
            panda::proto::ProtobufSnapshotGenerator::GenerateSnapshot(*prog, options->compilerProtoOutput());
            return true;
        }
    }

    bool dumpSize = options->SizeStat();
    std::map<std::string, size_t> stat;
    std::map<std::string, size_t> *statp = dumpSize ? &stat : nullptr;

    if (!GenerateProgramsByWorkers(programsInfo, options, statp)) {
        return false;
    }

    if (dumpSize) {
        DumpPandaFileSizeStatistic(stat);
    }

    return true;
}

static bool GenerateAbcFiles(const std::map<std::string, panda::es2panda::util::ProgramCache*> &programsInfo,
    const std::unique_ptr<panda::es2panda::aot::Options> &options, size_t expectedProgsCount)
{
    if (programsInfo.size() != expectedProgsCount) {
        std::cerr << "the size of programs is expected to be " << expectedProgsCount
                  << ", but is " << programsInfo.size() << std::endl;
        return false;
    }

    if (!GenerateProgram(programsInfo, options)) {
        std::cerr << "GenerateProgram Failed!" << std::endl;
        return false;
    }

    return true;
}

int Run(int argc, const char **argv)
{
    auto options = std::make_unique<Options>();
    if (!options->Parse(argc, argv)) {
        std::cerr << options->ErrorMsg() << std::endl;
        return 1;
    }

    if (options->CompilerOptions().bcVersion || options->CompilerOptions().bcMinVersion) {
        std::string version = options->CompilerOptions().bcVersion ?
            panda::panda_file::GetVersion(panda::panda_file::version) :
            panda::panda_file::GetVersion(panda::panda_file::minVersion);
        std::cout << version << std::endl;
        return 0;
    }

    std::map<std::string, panda::es2panda::util::ProgramCache*> programsInfo;
    size_t expectedProgsCount = options->CompilerOptions().sourceFiles.size();
    panda::ArenaAllocator allocator(panda::SpaceType::SPACE_TYPE_COMPILER, nullptr, true);

    int ret = Compiler::CompileFiles(options->CompilerOptions(), programsInfo, &allocator);
    if (options->ParseOnly()) {
        return ret;
    }

    if (!options->NpmModuleEntryList().empty()) {
        es2panda::util::ModuleHelpers::CompileNpmModuleEntryList(options->NpmModuleEntryList(),
            options->CompilerOptions(), programsInfo, &allocator);
        expectedProgsCount++;
    }

    if (!GenerateAbcFiles(programsInfo, options, expectedProgsCount)) {
        return 1;
    }

    return 0;
}
}  // namespace panda::es2panda::aot

int main(int argc, const char **argv)
{
    panda::es2panda::aot::MemManager mm;
    return panda::es2panda::aot::Run(argc, argv);
}
