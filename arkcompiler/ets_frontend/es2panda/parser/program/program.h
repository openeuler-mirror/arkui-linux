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

#ifndef ES2PANDA_PARSER_INCLUDE_PROGRAM_H
#define ES2PANDA_PARSER_INCLUDE_PROGRAM_H

#include <lexer/token/sourceLocation.h>
#include <macros.h>
#include <mem/arena_allocator.h>
#include <parser/module/sourceTextModuleRecord.h>
#include <util/hotfix.h>
#include <util/ustring.h>

#include "es2panda.h"

namespace panda::es2panda::ir {
class BlockStatement;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::binder {
class Binder;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::parser {

enum class ScriptKind { SCRIPT, MODULE, COMMONJS };

class Program {
public:
    explicit Program(es2panda::ScriptExtension extension);
    NO_COPY_SEMANTIC(Program);
    Program(Program &&other);
    Program &operator=(Program &&other);
    ~Program() = default;

    ArenaAllocator *Allocator() const
    {
        return allocator_.get();
    }

    const binder::Binder *Binder() const
    {
        return binder_;
    }

    binder::Binder *Binder()
    {
        return binder_;
    }

    ScriptExtension Extension() const
    {
        return extension_;
    }

    ScriptKind Kind() const
    {
        return kind_;
    }

    bool IsCommonjs() const
    {
        return kind_ == ScriptKind::COMMONJS;
    }

    SourceTextModuleRecord *ModuleRecord() const
    {
        return moduleRecord_;
    }

    util::StringView SourceCode() const
    {
        return sourceCode_.View();
    }

    util::StringView SourceFile() const
    {
        return sourceFile_.View();
    }

    util::StringView RecordName() const
    {
        return recordName_.View();
    }

    util::StringView FormatedRecordName() const
    {
        return formatedRecordName_.View();
    }

    const lexer::LineIndex &GetLineIndex() const
    {
        return lineIndex_;
    }

    ir::BlockStatement *Ast()
    {
        return ast_;
    }

    const ir::BlockStatement *Ast() const
    {
        return ast_;
    }

    void SetAst(ir::BlockStatement *ast)
    {
        ast_ = ast;
    }

    void SetSource(const std::string &sourceCode, const std::string &sourceFile, bool isDtsFile)
    {
        sourceCode_ = util::UString(sourceCode, Allocator());
        sourceFile_ = util::UString(sourceFile, Allocator());
        lineIndex_ = lexer::LineIndex(SourceCode());
        isDtsFile_ = isDtsFile;
    }

    void SetRecordName(const std::string &recordName)
    {
        recordName_ = util::UString(recordName, Allocator());
        std::string formatedRecordName = recordName + ".";
        formatedRecordName_ = util::UString(formatedRecordName, Allocator());
    }

    void AddHotfixHelper(util::Hotfix *hotfixHelper)
    {
        hotfixHelper_ = hotfixHelper;
    }

    util::Hotfix *HotfixHelper()
    {
        return hotfixHelper_;
    }

    bool IsDtsFile() const
    {
        return isDtsFile_;
    }

    std::string Dump() const;
    void SetKind(ScriptKind kind);

private:
    std::unique_ptr<ArenaAllocator> allocator_ {};
    binder::Binder *binder_ {};
    ir::BlockStatement *ast_ {};
    util::UString sourceCode_ {};
    util::UString sourceFile_ {};
    util::UString recordName_ {};
    util::UString formatedRecordName_ {};
    ScriptKind kind_ {};
    ScriptExtension extension_ {};
    lexer::LineIndex lineIndex_ {};
    SourceTextModuleRecord *moduleRecord_ {nullptr};
    util::Hotfix *hotfixHelper_ {nullptr};
    bool isDtsFile_ {false};
};

}  // namespace panda::es2panda::parser

#endif
