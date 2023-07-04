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

#ifndef ES2PANDA_BINDER_BINDER_H
#define ES2PANDA_BINDER_BINDER_H

#include <binder/scope.h>
#include <binder/variableFlags.h>
#include <lexer/token/sourceLocation.h>
#include <macros.h>
#include <parser/program/program.h>

namespace panda::es2panda::ir {
class AstNode;
class BlockStatement;
class CatchClause;
class ClassDefinition;
class Expression;
class ExportNamedDeclaration;
class ForUpdateStatement;
class Identifier;
class ScriptFunction;
class Statement;
class VariableDeclarator;
class TSFunctionType;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::binder {
class Scope;
class VariableScope;

class Binder {
public:
    explicit Binder(parser::Program *program, ScriptExtension extension)
        : program_(program),
          functionScopes_(Allocator()->Adapter()),
          functionNames_(Allocator()->Adapter()),
          anonymousFunctionNames_(Allocator()->Adapter()),
          variableNames_(Allocator()->Adapter()),
          extension_(extension)
    {
        if (extension_ == ScriptExtension::TS) {
            bindingOptions_ = ResolveBindingOptions::ALL;
            return;
        }

        bindingOptions_ = ResolveBindingOptions::BINDINGS;
    }

    NO_COPY_SEMANTIC(Binder);
    DEFAULT_MOVE_SEMANTIC(Binder);
    ~Binder() = default;

    void InitTopScope();
    void IdentifierAnalysis(ResolveBindingFlags flags = ResolveBindingFlags::ALL);

    template <typename T, typename... Args>
    T *AddDecl(const lexer::SourcePosition &pos, Args &&... args);

    template <typename T, typename... Args>
    T *AddDecl(const lexer::SourcePosition &pos, DeclarationFlags flag, Args &&... args);

    template <typename T, typename... Args>
    T *AddTsDecl(const lexer::SourcePosition &pos, Args &&... args);

    ParameterDecl *AddParamDecl(const ir::AstNode *param);

    Scope *GetScope() const
    {
        return scope_;
    }

    FunctionScope *TopScope() const
    {
        return topScope_;
    }

    [[noreturn]] void ThrowRedeclaration(const lexer::SourcePosition &pos, const util::StringView &name);
    [[noreturn]] void ThrowUndeclaredExport(const lexer::SourcePosition &pos, const util::StringView &name);
    [[noreturn]] void ThrowInvalidDstrTarget(const lexer::SourcePosition &pos, const util::StringView &name);

    void CheckMandatoryArguments(const ir::Identifier *ident);

    template <typename T>
    friend class LexicalScope;

    inline ArenaAllocator *Allocator() const
    {
        return program_->Allocator();
    }

    const ArenaVector<FunctionScope *> &Functions() const
    {
        return functionScopes_;
    }

    ArenaVector<FunctionScope *> Functions()
    {
        return functionScopes_;
    }

    const parser::Program *Program() const
    {
        return program_;
    }

    void SetProgram(parser::Program *program)
    {
        program_ = program;
    }

    const ArenaUnorderedMap<const ir::ScriptFunction *, util::StringView> &AnonymousFunctionNames() const
    {
        return anonymousFunctionNames_;
    }

    void AddDeclarationName(const util::StringView &name);

    bool HasVariableName(const util::StringView &name) const;

    static constexpr std::string_view FUNCTION_ARGUMENTS = "arguments";
    static constexpr std::string_view MANDATORY_PARAM_FUNC = "4funcObj";
    static constexpr std::string_view MANDATORY_PARAM_NEW_TARGET = "4newTarget";
    static constexpr std::string_view MANDATORY_PARAM_THIS = "this";

    static constexpr std::string_view CJS_MANDATORY_PARAM_EXPORTS = "exports";
    static constexpr std::string_view CJS_MANDATORY_PARAM_REQUIRE = "require";
    static constexpr std::string_view CJS_MANDATORY_PARAM_MODULE = "module";
    static constexpr std::string_view CJS_MANDATORY_PARAM_FILENAME = "__filename";
    static constexpr std::string_view CJS_MANDATORY_PARAM_DIRNAME = "__dirname";

    static constexpr uint32_t MANDATORY_PARAM_FUNC_REG = 0;
    static constexpr uint32_t MANDATORY_PARAMS_NUMBER = 3;
    static constexpr uint32_t CJS_MANDATORY_PARAMS_NUMBER = 8;

    static constexpr std::string_view LEXICAL_MANDATORY_PARAM_FUNC = "0funcObj";
    static constexpr std::string_view LEXICAL_MANDATORY_PARAM_NEW_TARGET = "0newTarget";
    static constexpr std::string_view LEXICAL_MANDATORY_PARAM_THIS = "0this";

    static constexpr std::string_view MAIN_FUNC_NAME = "func_main_0";
    static constexpr std::string_view ANONYMOUS_FUNC_NAME = "";

private:
    using MandatoryParams = std::array<std::string_view, MANDATORY_PARAMS_NUMBER>;
    using CommonjsMandatoryParams = std::array<std::string_view, CJS_MANDATORY_PARAMS_NUMBER>;

    static constexpr MandatoryParams FUNCTION_MANDATORY_PARAMS = {MANDATORY_PARAM_FUNC, MANDATORY_PARAM_NEW_TARGET,
                                                                  MANDATORY_PARAM_THIS};

    static constexpr MandatoryParams ARROW_MANDATORY_PARAMS = {MANDATORY_PARAM_FUNC, LEXICAL_MANDATORY_PARAM_NEW_TARGET,
                                                               LEXICAL_MANDATORY_PARAM_THIS};

    static constexpr MandatoryParams CTOR_ARROW_MANDATORY_PARAMS = {
        LEXICAL_MANDATORY_PARAM_FUNC, LEXICAL_MANDATORY_PARAM_NEW_TARGET, LEXICAL_MANDATORY_PARAM_THIS};

    static constexpr CommonjsMandatoryParams CJS_MAINFUNC_MANDATORY_PARAMS = {
        MANDATORY_PARAM_FUNC, MANDATORY_PARAM_NEW_TARGET, MANDATORY_PARAM_THIS,
        CJS_MANDATORY_PARAM_EXPORTS, CJS_MANDATORY_PARAM_REQUIRE, CJS_MANDATORY_PARAM_MODULE,
        CJS_MANDATORY_PARAM_FILENAME, CJS_MANDATORY_PARAM_DIRNAME};

    void AddMandatoryParam(const std::string_view &name);

    template<typename T>
    void AddMandatoryParams(const T &params)
    {
        for (auto iter = params.rbegin(); iter != params.rend(); iter++) {
            AddMandatoryParam(*iter);
        }
    }

    void AddMandatoryParams();
    void AssignIndexToModuleVariable();
    void BuildFunction(FunctionScope *funcScope, util::StringView name, const ir::ScriptFunction *func = nullptr);
    void BuildScriptFunction(Scope *outerScope, const ir::ScriptFunction *scriptFunc);
    void BuildClassDefinition(ir::ClassDefinition *classDef);
    void LookupReference(const util::StringView &name);
    void InstantiateArguments();
    void BuildVarDeclarator(ir::VariableDeclarator *varDecl);
    void BuildVarDeclaratorId(const ir::AstNode *parent, ir::AstNode *childNode);
    void BuildForUpdateLoop(ir::ForUpdateStatement *forUpdateStmt);
    void BuildForInOfLoop(const ir::Statement *parent, binder::LoopScope *loopScope, ir::AstNode *left,
                          ir::Expression *right, ir::Statement *body);
    void BuildCatchClause(ir::CatchClause *catchClauseStmt);
    void LookupIdentReference(ir::Identifier *ident);
    void ResolveReference(const ir::AstNode *parent, ir::AstNode *childNode);
    void ResolveReferences(const ir::AstNode *parent);
    void ValidateExportDecl(const ir::ExportNamedDeclaration *exportDecl);

    // TypeScript specific functions
    void BuildTSSignatureDeclarationBaseParams(const ir::AstNode *typeNode);

    parser::Program *program_ {};
    FunctionScope *topScope_ {};
    Scope *scope_ {};
    ArenaVector<FunctionScope *> functionScopes_;
    ResolveBindingOptions bindingOptions_;
    ArenaSet<util::StringView> functionNames_;
    ArenaUnorderedMap<const ir::ScriptFunction *, util::StringView> anonymousFunctionNames_;
    ArenaSet<util::StringView> variableNames_;
    size_t functionNameIndex_ {1};
    ResolveBindingFlags bindingFlags_ {ResolveBindingFlags::ALL};
    ScriptExtension extension_;
};

template <typename T>
class LexicalScope {
public:
    template <typename... Args>
    explicit LexicalScope(Binder *binder, Args &&... args)
        : LexicalScope(binder->Allocator()->New<T>(binder->Allocator(), binder->scope_, std::forward<Args>(args)...),
                       binder)
    {
    }

    T *GetScope() const
    {
        return scope_;
    }

    ~LexicalScope()
    {
        ASSERT(binder_);
        binder_->scope_ = prevScope_;
    }

    [[nodiscard]] static LexicalScope<T> Enter(Binder *binder, T *scope)
    {
        LexicalScope<T> lexScope(scope, binder);
        return lexScope;
    }

    DEFAULT_MOVE_SEMANTIC(LexicalScope);

private:
    NO_COPY_SEMANTIC(LexicalScope);

    explicit LexicalScope(T *scope, Binder *binder) : binder_(binder), scope_(scope), prevScope_(binder->scope_)
    {
        binder_->scope_ = scope_;
    }

    Binder *binder_ {};
    T *scope_ {};
    Scope *prevScope_ {};
};

template <typename T, typename... Args>
T *Binder::AddTsDecl(const lexer::SourcePosition &pos, Args &&... args)
{
    T *decl = Allocator()->New<T>(std::forward<Args>(args)...);

    if (scope_->AddTsDecl(Allocator(), decl, program_->Extension())) {
        AddDeclarationName(decl->Name());
        return decl;
    }

    ThrowRedeclaration(pos, decl->Name());
}

template <typename T, typename... Args>
T *Binder::AddDecl(const lexer::SourcePosition &pos, Args &&... args)
{
    T *decl = Allocator()->New<T>(std::forward<Args>(args)...);

    if (scope_->AddDecl(Allocator(), decl, program_->Extension())) {
        AddDeclarationName(decl->Name());
        return decl;
    }

    ThrowRedeclaration(pos, decl->Name());
}

template <typename T, typename... Args>
T *Binder::AddDecl(const lexer::SourcePosition &pos, DeclarationFlags flag, Args &&... args)
{
    T *decl = Allocator()->New<T>(std::forward<Args>(args)...);
    decl->AddFlag(flag);

    if (scope_->AddDecl(Allocator(), decl, program_->Extension())) {
        AddDeclarationName(decl->Name());
        return decl;
    }

    ThrowRedeclaration(pos, decl->Name());
}
}  // namespace panda::es2panda::binder

#endif
