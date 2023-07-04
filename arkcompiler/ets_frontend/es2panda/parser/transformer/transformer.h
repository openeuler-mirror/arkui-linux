/*
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

#ifndef ES2PANDA_PARSER_TRANSFORMER_TRANSFORMER_H
#define ES2PANDA_PARSER_TRANSFORMER_TRANSFORMER_H

#include <macros.h>

#include "binder/binder.h"
#include "binder/scope.h"
#include "ir/astNode.h"
#include "parser/module/sourceTextModuleRecord.h"
#include "parser/parserFlags.h"
#include "parser/program/program.h"

namespace panda::es2panda::parser {

struct TsModuleInfo {
    util::StringView name;
    binder::Scope *scope;
};

class Transformer {
public:
    explicit Transformer(panda::ArenaAllocator *allocator)
        : program_(nullptr),
          tsModuleList_(allocator->Adapter())
    {
    }
    NO_COPY_SEMANTIC(Transformer);
    ~Transformer() = default;

    void Transform(Program *program);

private:
    void TransformFromTS();
    ir::AstNode *VisitTSNodes(ir::AstNode *parent);
    ir::UpdateNodes VisitTSNode(ir::AstNode *childNode);
    ir::UpdateNodes VisitTsModuleDeclaration(ir::TSModuleDeclaration *childNode, bool isExport = false);
    std::vector<ir::AstNode *> VisitExportNamedVariable(ir::Statement *decl);
    ir::AstNode *VisitTsImportEqualsDeclaration(ir::TSImportEqualsDeclaration *node);
    ir::VariableDeclaration *CreateVariableDeclarationWithIdentify(util::StringView name,
                                                                   VariableParsingFlags flags,
                                                                   ir::AstNode *node,
                                                                   bool isExport,
                                                                   ir::Expression *init = nullptr);
    ir::CallExpression *CreateCallExpressionForTsModule(ir::TSModuleDeclaration *node,
                                                        util::StringView paramName,
                                                        bool isExport = false);
    ir::Expression *CreateTsModuleParam(util::StringView paramName, bool isExport);
    ir::ExpressionStatement *CreateTsModuleAssignment(util::StringView name);
    ir::Expression *CreateMemberExpressionFromQualified(ir::Expression *node);
    util::StringView GetNameFromModuleDeclaration(ir::TSModuleDeclaration *node) const;
    util::StringView GetParamName(ir::TSModuleDeclaration *node, util::StringView name) const;
    binder::Scope *FindExportVariableInTsModuleScope(util::StringView name) const;
    binder::Variable *FindTSModuleVariable(const ir::Expression *node, binder::Scope *scope) const;
    void AddExportLocalEntryItem(util::StringView name, const ir::Identifier *identifier);
    bool IsInstantiatedTSModule(const ir::Expression *node) const;
    void SetOriginalNode(ir::UpdateNodes res, ir::AstNode *originalNode) const;

    bool IsTsModule() const
    {
        return (tsModuleList_.size() != 0);
    }

    template <typename T, typename... Args>
    T *AllocNode(Args &&... args)
    {
        auto ret = program_->Allocator()->New<T>(std::forward<Args>(args)...);
        if (ret == nullptr) {
            throw Error(ErrorType::GENERIC, "Unsuccessful allocation during parsing");
        }
        return ret;
    }

    ArenaAllocator *Allocator() const
    {
        return program_->Allocator();
    }

    binder::Binder *Binder() const
    {
        return program_->Binder();
    }

    binder::Scope *Scope() const
    {
        return Binder()->GetScope();
    }

    util::StringView GetCurrentTSModuleName() const
    {
        return tsModuleList_.back().name;
    }

    util::StringView FindTSModuleNameByScope(binder::Scope *scope) const
    {
        for (auto it : tsModuleList_) {
            if (it.scope == scope) {
                return it.name;
            }
        }
        UNREACHABLE();
    }

    ScriptExtension Extension() const
    {
        return program_->Extension();
    }

    SourceTextModuleRecord *GetSourceTextModuleRecord()
    {
        return program_->ModuleRecord();
    }

    Program *program_;
    ArenaVector<TsModuleInfo> tsModuleList_;
};

}  // namespace panda::es2panda::parser

#endif
