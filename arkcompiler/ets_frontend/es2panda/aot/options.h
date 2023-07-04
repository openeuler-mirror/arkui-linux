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

#ifndef ES2PANDA_AOT_OPTIONS_H
#define ES2PANDA_AOT_OPTIONS_H

#include <es2panda.h>
#include <macros.h>
#include <parser/program/program.h>

#include <exception>
#include <fstream>
#include <iostream>
#include <util/base64.h>

namespace panda {
class PandArgParser;
class PandaArg;
}  // namespace panda

namespace panda::es2panda::aot {
enum class OptionFlags {
    DEFAULT = 0,
    PARSE_ONLY = 1 << 1,
    SIZE_STAT = 1 << 2,
};

inline std::underlying_type_t<OptionFlags> operator&(OptionFlags a, OptionFlags b)
{
    using utype = std::underlying_type_t<OptionFlags>;
    /* NOLINTNEXTLINE(hicpp-signed-bitwise) */
    return static_cast<utype>(static_cast<utype>(a) & static_cast<utype>(b));
}

inline OptionFlags &operator|=(OptionFlags &a, OptionFlags b)
{
    using utype = std::underlying_type_t<OptionFlags>;
    /* NOLINTNEXTLINE(hicpp-signed-bitwise) */
    return a = static_cast<OptionFlags>(static_cast<utype>(a) | static_cast<utype>(b));
}

class Options {
public:
    Options();
    NO_COPY_SEMANTIC(Options);
    NO_MOVE_SEMANTIC(Options);
    ~Options();

    bool Parse(int argc, const char **argv);

    es2panda::ScriptExtension Extension() const
    {
        return extension_;
    }

    const es2panda::CompilerOptions &CompilerOptions() const
    {
        return compilerOptions_;
    }

    es2panda::CompilerOptions &CompilerOptions()
    {
        return compilerOptions_;
    }

    es2panda::parser::ScriptKind ScriptKind() const
    {
        return scriptKind_;
    }

    const std::string &CompilerOutput() const
    {
        return compilerOutput_;
    }

    const std::string &SourceFile() const
    {
        return sourceFile_;
    }

    const std::string &RecordName() const
    {
        return recordName_;
    }

    const std::string &ErrorMsg() const
    {
        return errorMsg_;
    }

    int OptLevel() const
    {
        return optLevel_;
    }

    bool ParseOnly() const
    {
        return (options_ & OptionFlags::PARSE_ONLY) != 0;
    }

    bool SizeStat() const
    {
        return (options_ & OptionFlags::SIZE_STAT) != 0;
    }

    std::string ExtractContentFromBase64Input(const std::string &inputBase64String);

    const std::string &compilerProtoOutput() const
    {
        return compilerProtoOutput_;
    }

    const std::string &NpmModuleEntryList() const
    {
        return npmModuleEntryList_;
    }

    const std::unordered_map<std::string, std::string> &OutputFiles() const
    {
        return outputFiles_;
    }

    bool CollectInputFilesFromFileList(const std::string &input);
    bool CollectInputFilesFromFileDirectory(const std::string &input, const std::string &extension);
    void ParseCacheFileOption(const std::string &cacheInput);

private:
    es2panda::ScriptExtension extension_ {es2panda::ScriptExtension::JS};
    es2panda::CompilerOptions compilerOptions_ {};
    es2panda::parser::ScriptKind scriptKind_ {es2panda::parser::ScriptKind::SCRIPT};
    OptionFlags options_ {OptionFlags::DEFAULT};
    panda::PandArgParser *argparser_;
    std::string base64Input_;
    std::string compilerOutput_;
    std::string result_;
    std::string sourceFile_;
    std::string recordName_;
    std::string errorMsg_;
    std::string compilerProtoOutput_;
    int optLevel_ {0};
    int functionThreadCount_ {0};
    int fileThreadCount_ {0};
    std::string npmModuleEntryList_;
    std::vector<es2panda::SourceFile> sourceFiles_;
    std::unordered_map<std::string, std::string> outputFiles_;
};
}  // namespace panda::es2panda::aot

#endif  // AOT_OPTIONS_H
