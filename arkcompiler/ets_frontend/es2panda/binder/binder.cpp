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

#include "binder.h"

#include <util/helpers.h>
#include <binder/scope.h>
#include <binder/tsBinding.h>
#include <es2panda.h>
#include <ir/astNode.h>
#include <ir/base/catchClause.h>
#include <ir/base/classDefinition.h>
#include <ir/base/methodDefinition.h>
#include <ir/base/property.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/objectExpression.h>
#include <ir/module/exportNamedDeclaration.h>
#include <ir/module/exportSpecifier.h>
#include <ir/statements/blockStatement.h>
#include <ir/statements/doWhileStatement.h>
#include <ir/statements/forInStatement.h>
#include <ir/statements/forOfStatement.h>
#include <ir/statements/forUpdateStatement.h>
#include <ir/statements/ifStatement.h>
#include <ir/statements/switchCaseStatement.h>
#include <ir/statements/switchStatement.h>
#include <ir/statements/variableDeclaration.h>
#include <ir/statements/variableDeclarator.h>
#include <ir/statements/whileStatement.h>
#include <ir/ts/tsConstructorType.h>
#include <ir/ts/tsFunctionType.h>
#include <ir/ts/tsMethodSignature.h>
#include <ir/ts/tsModuleBlock.h>
#include <ir/ts/tsModuleDeclaration.h>
#include <ir/ts/tsSignatureDeclaration.h>
#include <util/concurrent.h>
#include <util/helpers.h>

namespace panda::es2panda::binder {
void Binder::InitTopScope()
{
    if (program_->Kind() == parser::ScriptKind::MODULE) {
        topScope_ = Allocator()->New<ModuleScope>(Allocator());
    } else {
        topScope_ = Allocator()->New<GlobalScope>(Allocator());
    }

    scope_ = topScope_;
}

ParameterDecl *Binder::AddParamDecl(const ir::AstNode *param)
{
    ASSERT(scope_->IsFunctionParamScope() || scope_->IsCatchParamScope());
    auto [decl, node] = static_cast<ParamScope *>(scope_)->AddParamDecl(Allocator(), param);

    if (!node) {
        return decl;
    }

    ThrowRedeclaration(node->Start(), decl->Name());
}

void Binder::ThrowRedeclaration(const lexer::SourcePosition &pos, const util::StringView &name)
{
    lexer::LineIndex index(program_->SourceCode());
    lexer::SourceLocation loc = index.GetLocation(pos);

    std::stringstream ss;
    ss << "Variable '" << name << "' has already been declared.";
    throw Error(ErrorType::SYNTAX, ss.str(), loc.line, loc.col);
}

void Binder::ThrowUndeclaredExport(const lexer::SourcePosition &pos, const util::StringView &name)
{
    lexer::LineIndex index(program_->SourceCode());
    lexer::SourceLocation loc = index.GetLocation(pos);

    std::stringstream ss;
    ss << "Export name '" << name << "' is not defined.";
    throw Error(ErrorType::SYNTAX, ss.str(), loc.line, loc.col);
}

void Binder::ThrowInvalidDstrTarget(const lexer::SourcePosition &pos, const util::StringView &name)
{
    lexer::LineIndex index(program_->SourceCode());
    lexer::SourceLocation loc = index.GetLocation(pos);

    std::stringstream ss;
    ss << "Invalid destructuring assignment target: " << name;
    throw Error(ErrorType::SYNTAX, ss.str(), loc.line, loc.col);
}

void Binder::CheckMandatoryArguments(const ir::Identifier *ident)
{
    const auto *iter = static_cast<const ir::AstNode *>(ident);
    bool isPatternMember = false;
    while (iter) {
        if (iter->IsArrayExpression() || iter->IsArrayPattern()) {
            isPatternMember = true;
            break;
        }

        if (iter->IsObjectExpression() || iter->IsObjectPattern()) {
            isPatternMember = util::Helpers::IsObjectPropertyValue(iter->AsObjectExpression(), ident);
            break;
        }
        iter = iter->Parent();
    }

    if (!isPatternMember) {
        return;
    }

    auto *patternNode = iter;

    while (iter) {
        if (iter->IsAssignmentExpression() || iter->IsVariableDeclarator() || iter->IsForInStatement() ||
            iter->IsForOfStatement()) {
            break;
        }

        iter = iter->Parent();
    }

    if (!iter) {
        return;
    }

    const ir::AstNode *potentialParent = iter;

    if (iter->IsAssignmentExpression()) {
        potentialParent = iter->AsAssignmentExpression()->Left();
    } else if (iter->IsVariableDeclarator()) {
        potentialParent = iter->AsVariableDeclarator()->Id();
    } else {
        potentialParent = iter->IsForInStatement() ? iter->AsForInStatement()->Left() :
                                                     iter->AsForOfStatement()->Left();
    }

    if (!util::Helpers::IsChild(potentialParent, patternNode)) {
        return;
    }

    ThrowInvalidDstrTarget(ident->Start(), ident->Name());
}

void Binder::AssignIndexToModuleVariable()
{
    ASSERT(program_->ModuleRecord());
    program_->ModuleRecord()->AssignIndexToModuleVariable(topScope_->AsModuleScope());
}

void Binder::IdentifierAnalysis(ResolveBindingFlags flags)
{
    ASSERT(program_->Ast());
    ASSERT(scope_ == topScope_);

    bindingFlags_ = flags;
    if (bindingFlags_ & ResolveBindingFlags::TS_BEFORE_TRANSFORM) {
        ResolveReferences(program_->Ast());
    } else if (bindingFlags_ & ResolveBindingFlags::ALL) {
        BuildFunction(topScope_, MAIN_FUNC_NAME);
        ResolveReferences(program_->Ast());
        AddMandatoryParams();
        if (topScope_->IsModuleScope()) {
            AssignIndexToModuleVariable();
        }
    }
}

void Binder::ValidateExportDecl(const ir::ExportNamedDeclaration *exportDecl)
{
    if (exportDecl->Source() != nullptr || exportDecl->Decl() != nullptr) {
        return;
    }

    ASSERT(topScope_->IsModuleScope());
    for (auto *it : exportDecl->Specifiers()) {
        auto localName = it->AsExportSpecifier()->Local()->Name();
        if (topScope_->FindLocal(localName) == nullptr) {
            ThrowUndeclaredExport(it->AsExportSpecifier()->Local()->Start(), localName);
        }
        topScope_->AsModuleScope()->ConvertLocalVariableToModuleVariable(Allocator(), localName);
    }
}

void Binder::LookupReference(const util::StringView &name)
{
    ScopeFindResult res = scope_->Find(name);
    if (res.level == 0) {
        return;
    }

    ASSERT(res.variable);
    res.variable->SetLexical(res.scope, program_->HotfixHelper());
}

void Binder::InstantiateArguments()
{
    auto *iter = scope_;
    while (true) {
        Scope *scope = iter->IsFunctionParamScope() ? iter : iter->EnclosingVariableScope();

        const auto *node = scope->Node();

        if (scope->IsLoopScope()) {
            iter = scope->Parent();
            continue;
        }

        if (!node->IsScriptFunction()) {
            break;
        }

        if (!node->AsScriptFunction()->IsArrow()) {
            auto *argumentsVariable =
                scope->AddDecl<ConstDecl, LocalVariable>(Allocator(), FUNCTION_ARGUMENTS, VariableFlags::INITIALIZED);

            if (iter->IsFunctionParamScope()) {
                if (!argumentsVariable) {
                    break;
                }

                scope = iter->AsFunctionParamScope()->GetFunctionScope();
                scope->Bindings().insert({argumentsVariable->Name(), argumentsVariable});
            }

            scope->AsVariableScope()->AddFlag(VariableScopeFlags::USE_ARGS);

            break;
        }

        iter = scope->Parent();
    }
}

void Binder::LookupIdentReference(ir::Identifier *ident)
{
    if (ident->Name().Is(FUNCTION_ARGUMENTS)) {
        InstantiateArguments();
    }

    ScopeFindResult res = scope_->Find(ident->Name(), bindingOptions_);

    if (res.level != 0) {
        ASSERT(res.variable);
        util::Concurrent::VerifyImportVarForConcurrentFunction(Program()->GetLineIndex(), ident, res);
        res.variable->SetLexical(res.scope, program_->HotfixHelper());
    }

    if (!res.variable) {
        return;
    }

    auto decl = res.variable->Declaration();
    if (decl->IsLetOrConstOrClassDecl() && !decl->HasFlag(DeclarationFlags::NAMESPACE_IMPORT) &&
        !res.variable->HasFlag(VariableFlags::INITIALIZED)) {
        ident->SetTdz();
    }

    ident->SetVariable(res.variable);
}

void Binder::BuildFunction(FunctionScope *funcScope, util::StringView name, const ir::ScriptFunction *func)
{
    functionScopes_.push_back(funcScope);

    bool funcNameWithoutDot = (name.Find(".") == std::string::npos);
    bool funcNameWithoutBackslash = (name.Find("\\") == std::string::npos);
    if (name != ANONYMOUS_FUNC_NAME && funcNameWithoutDot && funcNameWithoutBackslash && !functionNames_.count(name)) {
        auto internalName = std::string(program_->FormatedRecordName()) + std::string(name);
        functionNames_.insert(name);
        funcScope->BindName(name, util::UString(internalName, Allocator()).View());
        return;
    }
    std::stringstream ss;
    ss << std::string(program_->FormatedRecordName());
    uint32_t idx = functionNameIndex_++;
    ss << "#" << std::to_string(idx) << "#";
    if (name == ANONYMOUS_FUNC_NAME && func != nullptr) {
        anonymousFunctionNames_[func] = util::UString(ss.str(), Allocator()).View();
    }
    if (funcNameWithoutDot && funcNameWithoutBackslash) {
        ss << name;
    }
    util::UString internalName(ss.str(), Allocator());
    funcScope->BindName(name, internalName.View());
}

void Binder::BuildScriptFunction(Scope *outerScope, const ir::ScriptFunction *scriptFunc)
{
    if (bindingFlags_ & ResolveBindingFlags::TS_BEFORE_TRANSFORM) {
        return;
    }

    if (scriptFunc->IsArrow()) {
        VariableScope *outerVarScope = outerScope->EnclosingVariableScope();
        outerVarScope->AddFlag(VariableScopeFlags::INNER_ARROW);
    }

    ASSERT(scope_->IsFunctionScope() || scope_->IsTSModuleScope());
    BuildFunction(scope_->AsFunctionVariableScope(), util::Helpers::FunctionName(scriptFunc), scriptFunc);
}

void Binder::BuildVarDeclaratorId(const ir::AstNode *parent, ir::AstNode *childNode)
{
    childNode->SetParent(parent);

    switch (childNode->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            auto *ident = childNode->AsIdentifier();
            const auto &name = ident->Name();
            if (name.Is(FUNCTION_ARGUMENTS)) {
                CheckMandatoryArguments(ident);
            }

            if (util::Helpers::IsGlobalIdentifier(name)) {
                break;
            }

            auto *variable = scope_->FindLocal(name);

            if (Program()->Extension() == ScriptExtension::TS) {
                ident->SetVariable(variable);
                BuildTSSignatureDeclarationBaseParams(ident->TypeAnnotation());
            }

            variable->AddFlag(VariableFlags::INITIALIZED);
            break;
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            auto *objPattern = childNode->AsObjectPattern();

            for (auto *prop : objPattern->Properties()) {
                BuildVarDeclaratorId(childNode, prop);
            }

            BuildTSSignatureDeclarationBaseParams(objPattern->TypeAnnotation());
            break;
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            auto *arrayPattern = childNode->AsArrayPattern();

            for (auto *element : childNode->AsArrayPattern()->Elements()) {
                BuildVarDeclaratorId(childNode, element);
            }

            BuildTSSignatureDeclarationBaseParams(arrayPattern->TypeAnnotation());
            break;
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            ResolveReference(childNode, childNode->AsAssignmentPattern()->Right());
            BuildVarDeclaratorId(childNode, childNode->AsAssignmentPattern()->Left());
            break;
        }
        case ir::AstNodeType::PROPERTY: {
            ResolveReference(childNode, childNode->AsProperty()->Key());
            BuildVarDeclaratorId(childNode, childNode->AsProperty()->Value());
            break;
        }
        case ir::AstNodeType::REST_ELEMENT: {
            BuildVarDeclaratorId(childNode, childNode->AsRestElement()->Argument());
            break;
        }
        default:
            break;
    }
}

void Binder::BuildTSSignatureDeclarationBaseParams(const ir::AstNode *typeNode)
{
    if (!typeNode) {
        return;
    }

    Scope *scope = nullptr;

    switch (typeNode->Type()) {
        case ir::AstNodeType::TS_FUNCTION_TYPE: {
            scope = typeNode->AsTSFunctionType()->Scope();
            break;
        }
        case ir::AstNodeType::TS_CONSTRUCTOR_TYPE: {
            scope = typeNode->AsTSConstructorType()->Scope();
            break;
        }
        case ir::AstNodeType::TS_SIGNATURE_DECLARATION: {
            scope = typeNode->AsTSSignatureDeclaration()->Scope();
            break;
        }
        case ir::AstNodeType::TS_METHOD_SIGNATURE: {
            scope = typeNode->AsTSMethodSignature()->Scope();
            break;
        }
        default: {
            ResolveReferences(typeNode);
            return;
        }
    }

    ASSERT(scope && scope->IsFunctionParamScope());

    auto scopeCtx = LexicalScope<FunctionParamScope>::Enter(this, scope->AsFunctionParamScope());
    ResolveReferences(typeNode);
}

void Binder::BuildVarDeclarator(ir::VariableDeclarator *varDecl)
{
    if (varDecl->Parent()->AsVariableDeclaration()->Kind() == ir::VariableDeclaration::VariableDeclarationKind::VAR) {
        ResolveReferences(varDecl);
        return;
    }

    if (varDecl->Init()) {
        ResolveReference(varDecl, varDecl->Init());
    }

    BuildVarDeclaratorId(varDecl, varDecl->Id());
}

void Binder::BuildClassDefinition(ir::ClassDefinition *classDef)
{
    if (classDef->Parent()->IsClassDeclaration()) {
        util::StringView className = classDef->GetName();
        ASSERT(!className.Empty());
        ScopeFindResult res = scope_->Find(className);

        ASSERT(res.variable && res.variable->Declaration()->IsClassDecl());
        res.variable->AddFlag(VariableFlags::INITIALIZED);
    }

    auto scopeCtx = LexicalScope<LocalScope>::Enter(this, classDef->Scope());

    if (classDef->Super()) {
        ResolveReference(classDef, classDef->Super());
    }

    if (classDef->Ident()) {
        ScopeFindResult res = scope_->Find(classDef->Ident()->Name());

        ASSERT(res.variable && res.variable->Declaration()->IsConstDecl());
        res.variable->AddFlag(VariableFlags::INITIALIZED);
    }

    ResolveReference(classDef, classDef->Ctor());

    for (auto *stmt : classDef->Body()) {
        ResolveReference(classDef, stmt);
    }
}

void Binder::BuildForUpdateLoop(ir::ForUpdateStatement *forUpdateStmt)
{
    auto *loopScope = forUpdateStmt->Scope();

    auto loopCtx = LexicalScope<LoopScope>::Enter(this, loopScope);

    if (forUpdateStmt->Init()) {
        ResolveReference(forUpdateStmt, forUpdateStmt->Init());
    }

    if (forUpdateStmt->Update()) {
        ResolveReference(forUpdateStmt, forUpdateStmt->Update());
    }

    if (forUpdateStmt->Test()) {
        ResolveReference(forUpdateStmt, forUpdateStmt->Test());
    }

    ResolveReference(forUpdateStmt, forUpdateStmt->Body());

    loopCtx.GetScope()->InitVariable();
}

void Binder::BuildForInOfLoop(const ir::Statement *parent, binder::LoopScope *loopScope, ir::AstNode *left,
                              ir::Expression *right, ir::Statement *body)
{
    auto loopCtx = LexicalScope<LoopScope>::Enter(this, loopScope);

    ResolveReference(parent, right);
    ResolveReference(parent, left);

    ResolveReference(parent, body);
    loopCtx.GetScope()->InitVariable();
}

void Binder::BuildCatchClause(ir::CatchClause *catchClauseStmt)
{
    if (catchClauseStmt->Param()) {
        auto paramScopeCtx = LexicalScope<CatchParamScope>::Enter(this, catchClauseStmt->Scope()->ParamScope());
        ResolveReference(catchClauseStmt, catchClauseStmt->Param());
    }

    auto scopeCtx = LexicalScope<CatchScope>::Enter(this, catchClauseStmt->Scope());
    ResolveReference(catchClauseStmt, catchClauseStmt->Body());
}

void Binder::ResolveReference(const ir::AstNode *parent, ir::AstNode *childNode)
{
    childNode->SetParent(parent);

    switch (childNode->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            auto *ident = childNode->AsIdentifier();

            if (ident->Name().Is(FUNCTION_ARGUMENTS)) {
                CheckMandatoryArguments(ident);
            }

            if (ident->IsReference()) {
                LookupIdentReference(ident);
            }

            ResolveReferences(childNode);
            break;
        }
        case ir::AstNodeType::SUPER_EXPRESSION: {
            VariableScope *varScope = scope_->EnclosingVariableScope();
            varScope->AddFlag(VariableScopeFlags::USE_SUPER);

            ResolveReferences(childNode);
            break;
        }
        case ir::AstNodeType::SCRIPT_FUNCTION: {
            auto *scriptFunc = childNode->AsScriptFunction();
            util::Concurrent::SetConcurrent(const_cast<ir::ScriptFunction *>(scriptFunc), Program()->GetLineIndex());
            auto *funcScope = scriptFunc->Scope();

            auto *outerScope = scope_;

            {
                auto paramScopeCtx = LexicalScope<FunctionParamScope>::Enter(this, funcScope->ParamScope());

                for (auto *param : scriptFunc->Params()) {
                    ResolveReference(scriptFunc, param);
                }
            }

            if (Program()->Extension() == ScriptExtension::TS) {
                if (scriptFunc->ReturnTypeAnnotation()) {
                    ResolveReference(scriptFunc, scriptFunc->ReturnTypeAnnotation());
                }

                if (scriptFunc->IsOverload() || scriptFunc->Declare()) {
                    break;
                }
            }

            auto scopeCtx = LexicalScope<FunctionScope>::Enter(this, funcScope);

            BuildScriptFunction(outerScope, scriptFunc);

            ResolveReference(scriptFunc, scriptFunc->Body());
            break;
        }
        case ir::AstNodeType::VARIABLE_DECLARATOR: {
            BuildVarDeclarator(childNode->AsVariableDeclarator());

            break;
        }
        case ir::AstNodeType::CLASS_DEFINITION: {
            BuildClassDefinition(childNode->AsClassDefinition());

            break;
        }
        case ir::AstNodeType::CLASS_PROPERTY: {
            const ir::ScriptFunction *ctor = util::Helpers::GetContainingConstructor(childNode->AsClassProperty());
            auto scopeCtx = LexicalScope<FunctionScope>::Enter(this, ctor->Scope());

            ResolveReferences(childNode);
            break;
        }
        case ir::AstNodeType::BLOCK_STATEMENT: {
            auto scopeCtx = LexicalScope<Scope>::Enter(this, childNode->AsBlockStatement()->Scope());

            ResolveReferences(childNode);
            break;
        }
        case ir::AstNodeType::SWITCH_STATEMENT: {
            auto *switchStatement = childNode->AsSwitchStatement();
            ResolveReference(switchStatement, switchStatement->Discriminant());

            auto scopeCtx = LexicalScope<LocalScope>::Enter(this, childNode->AsSwitchStatement()->Scope());
            for (auto *it : switchStatement->Cases()) {
                ResolveReference(switchStatement, it);
            }
            break;
        }
        case ir::AstNodeType::DO_WHILE_STATEMENT: {
            auto *doWhileStatement = childNode->AsDoWhileStatement();

            {
                auto loopScopeCtx = LexicalScope<LoopScope>::Enter(this, doWhileStatement->Scope());
                ResolveReference(doWhileStatement, doWhileStatement->Body());
                loopScopeCtx.GetScope()->InitVariable();
            }

            ResolveReference(doWhileStatement, doWhileStatement->Test());
            break;
        }
        case ir::AstNodeType::WHILE_STATEMENT: {
            auto *whileStatement = childNode->AsWhileStatement();
            ResolveReference(whileStatement, whileStatement->Test());

            auto loopScopeCtx = LexicalScope<LoopScope>::Enter(this, whileStatement->Scope());
            ResolveReference(whileStatement, whileStatement->Body());
            loopScopeCtx.GetScope()->InitVariable();
            break;
        }
        case ir::AstNodeType::FOR_UPDATE_STATEMENT: {
            BuildForUpdateLoop(childNode->AsForUpdateStatement());
            break;
        }
        case ir::AstNodeType::FOR_IN_STATEMENT: {
            auto *forInStmt = childNode->AsForInStatement();
            BuildForInOfLoop(forInStmt, forInStmt->Scope(), forInStmt->Left(), forInStmt->Right(), forInStmt->Body());

            break;
        }
        case ir::AstNodeType::FOR_OF_STATEMENT: {
            auto *forOfStmt = childNode->AsForOfStatement();
            BuildForInOfLoop(forOfStmt, forOfStmt->Scope(), forOfStmt->Left(), forOfStmt->Right(), forOfStmt->Body());
            break;
        }
        case ir::AstNodeType::CATCH_CLAUSE: {
            BuildCatchClause(childNode->AsCatchClause());
            break;
        }
        case ir::AstNodeType::EXPORT_NAMED_DECLARATION: {
            ValidateExportDecl(childNode->AsExportNamedDeclaration());

            ResolveReferences(childNode);
            break;
        }
        // TypeScript specific part
        case ir::AstNodeType::TS_FUNCTION_TYPE:
        case ir::AstNodeType::TS_CONSTRUCTOR_TYPE:
        case ir::AstNodeType::TS_METHOD_SIGNATURE:
        case ir::AstNodeType::TS_SIGNATURE_DECLARATION: {
            BuildTSSignatureDeclarationBaseParams(childNode);
            break;
        }
        case ir::AstNodeType::TS_MODULE_DECLARATION: {
            auto scopeCtx = LexicalScope<Scope>::Enter(this, childNode->AsTSModuleDeclaration()->Scope());
            ResolveReferences(childNode);
            break;
        }
        default: {
            ResolveReferences(childNode);
            break;
        }
    }
}
void Binder::ResolveReferences(const ir::AstNode *parent)
{
    parent->Iterate([this, parent](auto *childNode) { ResolveReference(parent, childNode); });
}

void Binder::AddMandatoryParam(const std::string_view &name)
{
    ASSERT(scope_->IsFunctionVariableScope());

    auto *decl = Allocator()->New<ParameterDecl>(name);
    auto *param = Allocator()->New<LocalVariable>(decl, VariableFlags::VAR);

    auto &funcParams = scope_->AsFunctionVariableScope()->ParamScope()->Params();
    funcParams.insert(funcParams.begin(), param);
    scope_->AsFunctionVariableScope()->ParamScope()->Bindings().insert({decl->Name(), param});
    scope_->AsFunctionVariableScope()->Bindings().insert({decl->Name(), param});
}

void Binder::AddMandatoryParams()
{
    ASSERT(scope_ == topScope_);
    ASSERT(!functionScopes_.empty());
    auto iter = functionScopes_.begin();
    [[maybe_unused]] auto *funcScope = *iter++;

    ASSERT(funcScope->IsGlobalScope() || funcScope->IsModuleScope());

    if (program_->Kind() == parser::ScriptKind::COMMONJS) {
        AddMandatoryParams(CJS_MAINFUNC_MANDATORY_PARAMS);
    } else {
        AddMandatoryParams(FUNCTION_MANDATORY_PARAMS);
    }

    for (; iter != functionScopes_.end(); iter++) {
        funcScope = *iter;
        const auto *scriptFunc = funcScope->Node()->AsScriptFunction();

        auto scopeCtx = LexicalScope<FunctionScope>::Enter(this, funcScope);

        if (!scriptFunc->IsArrow()) {
            AddMandatoryParams(FUNCTION_MANDATORY_PARAMS);
            continue;
        }

        const ir::ScriptFunction *ctor = util::Helpers::GetContainingConstructor(scriptFunc);
        bool lexicalFunctionObject {};

        if (ctor && util::Helpers::GetClassDefiniton(ctor)->Super() &&
            funcScope->HasFlag(VariableScopeFlags::USE_SUPER)) {
            ASSERT(ctor->Scope()->HasFlag(VariableScopeFlags::INNER_ARROW));
            ctor->Scope()->AddFlag(VariableScopeFlags::SET_LEXICAL_FUNCTION);
            lexicalFunctionObject = true;
            AddMandatoryParams(CTOR_ARROW_MANDATORY_PARAMS);
        } else {
            AddMandatoryParams(ARROW_MANDATORY_PARAMS);
        }

        LookupReference(MANDATORY_PARAM_NEW_TARGET);
        LookupReference(MANDATORY_PARAM_THIS);

        if (funcScope->HasFlag(VariableScopeFlags::USE_ARGS)) {
            LookupReference(FUNCTION_ARGUMENTS);
        }

        if (lexicalFunctionObject) {
            LookupReference(MANDATORY_PARAM_FUNC);
        }
    }
}

void Binder::AddDeclarationName(const util::StringView &name)
{
    if (extension_ != ScriptExtension::TS) {
        return;
    }
    variableNames_.insert(name);
    auto *scope = GetScope();
    while (scope != nullptr) {
        if (scope->IsTSModuleScope()) {
            scope->AsTSModuleScope()->AddDeclarationName(name);
        }
        scope = scope->Parent();
    }
}

bool Binder::HasVariableName(const util::StringView &name) const
{
    return variableNames_.find(name) != variableNames_.end();
}

}  // namespace panda::es2panda::binder
