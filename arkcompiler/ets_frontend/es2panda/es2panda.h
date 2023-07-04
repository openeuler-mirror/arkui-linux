/**
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_PUBLIC_H
#define ES2PANDA_PUBLIC_H

#include <macros.h>
#include <mem/arena_allocator.h>
#include <util/hotfix.h>
#include <util/programCache.h>
#include <util/symbolTable.h>

#include <string>
#include <unordered_map>

namespace panda::pandasm {
struct Program;
}  // namespace panda::pandasm

namespace panda::es2panda {
namespace parser {
class ParserImpl;
class Transformer;
enum class ScriptKind;
}  // namespace parser

namespace compiler {
class CompilerImpl;
}  // namespace compiler

enum class ScriptExtension {
    JS,
    TS,
    AS,
};

struct SourceFile {
    SourceFile(std::string fn, std::string rn, parser::ScriptKind sk)
        : fileName(fn), recordName(rn), scriptKind(sk)
    {
    }

    std::string fileName {};
    std::string recordName {};
    std::string_view source {};
    parser::ScriptKind scriptKind {};
    std::string sourcefile {};
    std::string pkgName {};
    uint32_t hash {0};
};

struct HotfixOptions {
    std::string dumpSymbolTable {};
    std::string symbolTable {};
    bool generatePatch {false};
    bool hotReload {false};
};

struct CompilerOptions {
    bool isDebug {false};
    bool dumpAst {false};
    bool dumpAsm {false};
    bool dumpDebugInfo {false};
    bool parseOnly {false};
    bool enableTypeCheck {false};
    bool dumpLiteralBuffer {false};
    bool isDebuggerEvaluateExpressionMode {false};
    bool mergeAbc {false};
    bool typeExtractor {false};
    bool typeDtsBuiltin {false};
    ScriptExtension extension {};
    int fileThreadCount {0};
    int functionThreadCount {0};
    int optLevel {0};
    std::string output {};
    std::string debugInfoSourceFile {};
    std::vector<es2panda::SourceFile> sourceFiles;
    HotfixOptions hotfixOptions;
    bool bcVersion {false};
    bool bcMinVersion {false};
    std::unordered_map<std::string, std::string> cacheFiles;
};

enum class ErrorType {
    GENERIC,
    SYNTAX,
    TYPE,
};

class Error : public std::exception {
public:
    Error() noexcept = default;
    explicit Error(ErrorType type, std::string_view message) noexcept : type_(type), message_(message) {}
    explicit Error(ErrorType type, std::string_view message, size_t line, size_t column) noexcept
        : type_(type), message_(message), line_(line), col_(column)
    {
    }
    ~Error() override = default;
    DEFAULT_COPY_SEMANTIC(Error);
    DEFAULT_MOVE_SEMANTIC(Error);

    ErrorType Type() const noexcept
    {
        return type_;
    }

    const char *TypeString() const noexcept
    {
        switch (type_) {
            case ErrorType::SYNTAX:
                return "SyntaxError";
            case ErrorType::TYPE:
                return "TypeError";
            default:
                break;
        }

        return "Error";
    }

    const char *what() const noexcept override
    {
        return message_.c_str();
    }

    int ErrorCode() const noexcept
    {
        return errorCode_;
    }

    const std::string &Message() const noexcept
    {
        return message_;
    }

    size_t Line() const
    {
        return line_;
    }

    size_t Col() const
    {
        return col_;
    }

private:
    ErrorType type_ {ErrorType::GENERIC};
    std::string message_;
    size_t line_ {};
    size_t col_ {};
    int errorCode_ {1};
};

class Compiler {
public:
    explicit Compiler(ScriptExtension ext);
    explicit Compiler(ScriptExtension ext, size_t threadCount);
    ~Compiler();
    NO_COPY_SEMANTIC(Compiler);
    NO_MOVE_SEMANTIC(Compiler);

    panda::pandasm::Program *Compile(const SourceFile &input, const CompilerOptions &options,
        util::SymbolTable *symbolTable = nullptr);
    panda::pandasm::Program *CompileFile(const CompilerOptions &options, SourceFile *src, util::SymbolTable *symbolTable);

    static int CompileFiles(CompilerOptions &options,
        std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo, panda::ArenaAllocator *allocator);

    inline panda::pandasm::Program *Compile(const SourceFile &input)
    {
        CompilerOptions options;

        return Compile(input, options);
    }

    static void DumpAsm(const panda::pandasm::Program *prog);

    const Error &GetError() const noexcept
    {
        return error_;
    }

private:
    util::Hotfix *InitHotfixHelper(const SourceFile &input, const CompilerOptions &options,
                                   util::SymbolTable *symbolTable);
    static void CleanHotfixHelper(const util::Hotfix *hotfixHelper);

    parser::ParserImpl *parser_;
    compiler::CompilerImpl *compiler_;
    std::unique_ptr<parser::Transformer> transformer_ {nullptr};
    Error error_;
};
}  // namespace panda::es2panda

#endif
