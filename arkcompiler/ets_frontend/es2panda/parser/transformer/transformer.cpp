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

#include "transformer.h"

#include "ir/base/scriptFunction.h"
#include "ir/base/classDefinition.h"
#include "ir/expressions/assignmentExpression.h"
#include "ir/expressions/binaryExpression.h"
#include "ir/expressions/callExpression.h"
#include "ir/expressions/functionExpression.h"
#include "ir/expressions/identifier.h"
#include "ir/expressions/memberExpression.h"
#include "ir/expressions/objectExpression.h"
#include "ir/module/exportNamedDeclaration.h"
#include "ir/statements/blockStatement.h"
#include "ir/statements/classDeclaration.h"
#include "ir/statements/emptyStatement.h"
#include "ir/statements/expressionStatement.h"
#include "ir/statements/functionDeclaration.h"
#include "ir/statements/variableDeclaration.h"
#include "ir/statements/variableDeclarator.h"
#include "ir/ts/tsImportEqualsDeclaration.h"
#include "ir/ts/tsModuleBlock.h"
#include "ir/ts/tsModuleDeclaration.h"
#include "ir/ts/tsQualifiedName.h"
#include "util/helpers.h"


namespace panda::es2panda::parser {

void Transformer::Transform(Program *program)
{
    program_ = program;
    if (Extension() == ScriptExtension::TS) {
        TransformFromTS();
    }
}

void Transformer::TransformFromTS()
{
    ASSERT(Extension() == ScriptExtension::TS);
    VisitTSNodes(program_->Ast());
}

ir::AstNode *Transformer::VisitTSNodes(ir::AstNode *parent)
{
    if (!parent) {
        return nullptr;
    }
    parent->UpdateSelf([this](auto *childNode) { return VisitTSNode(childNode); }, Binder());
    return parent;
}

binder::Scope *Transformer::FindExportVariableInTsModuleScope(util::StringView name) const
{
    bool isExport = false;
    auto currentScope = Scope();
    while (currentScope != nullptr) {
        binder::Variable *v = currentScope->FindLocal(name, binder::ResolveBindingOptions::ALL);
        bool isTSModuleScope = currentScope->IsTSModuleScope();
        if (v != nullptr) {
            if (!v->HasFlag(binder::VariableFlags::VAR)) {
                break;
            }
            if (isTSModuleScope && currentScope->AsTSModuleScope()->FindExportVariable(name)) {
                isExport = true;
            }
            break;
        }
        if (currentScope->InLocalTSBindings(name) &&
            !currentScope->FindLocalTSVariable<binder::TSBindingType::IMPORT_EQUALS>(name)) {
            break;
        }
        if (isTSModuleScope && currentScope->AsTSModuleScope()->InExportBindings(name)) {
            isExport = true;
            break;
        }
        currentScope = currentScope->Parent();
    }
    if (!isExport) {
        return nullptr;
    }
    return currentScope;
}

ir::UpdateNodes Transformer::VisitTSNode(ir::AstNode *childNode)
{
    ASSERT(childNode != nullptr);
    switch (childNode->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            auto *ident = childNode->AsIdentifier();
            if (!ident->IsReference() || !IsTsModule()) {
                return VisitTSNodes(childNode);
            }

            auto name = ident->Name();
            auto scope = FindExportVariableInTsModuleScope(name);
            if (scope) {
                auto moduleName = FindTSModuleNameByScope(scope);
                auto *id = AllocNode<ir::Identifier>(moduleName, Allocator());
                id->AsIdentifier()->SetReference();
                auto *res = AllocNode<ir::MemberExpression>(id, AllocNode<ir::Identifier>(name, Allocator()),
                    ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, false);
                SetOriginalNode(res, childNode);
                return res;
            }

            return VisitTSNodes(childNode);
        }
        case ir::AstNodeType::TS_MODULE_DECLARATION: {
            auto *node = childNode->AsTSModuleDeclaration();
            if (node->Declare() || !node->IsInstantiated()) {
                return childNode;
            }
            auto res = VisitTsModuleDeclaration(node);
            SetOriginalNode(res, childNode);
            return res;
        }
        case ir::AstNodeType::EXPORT_NAMED_DECLARATION: {
            auto *node = childNode->AsExportNamedDeclaration();
            auto *decl = node->Decl();
            if (!decl) {
                return VisitTSNodes(childNode);
            }

            if (decl->IsTSModuleDeclaration()) {
                auto *tsModuleDeclaration = decl->AsTSModuleDeclaration();
                if (tsModuleDeclaration->Declare() || !tsModuleDeclaration->IsInstantiated()) {
                    return childNode;
                }
                auto res = VisitTsModuleDeclaration(tsModuleDeclaration, true);
                SetOriginalNode(res, childNode);
                return res;
            }

            if (!IsTsModule()) {
                return VisitTSNodes(childNode);
            }

            auto res = VisitExportNamedVariable(decl);
            SetOriginalNode(res, childNode);
            return res;
        }
        case ir::AstNodeType::TS_IMPORT_EQUALS_DECLARATION: {
            auto *node = childNode->AsTSImportEqualsDeclaration();
            auto *express = node->ModuleReference();
            if (express->IsTSExternalModuleReference()) {
                return VisitTSNodes(childNode);
            }
            auto *res = VisitTsImportEqualsDeclaration(node);
            SetOriginalNode(res, childNode);
            return res;
        }
        default: {
            return VisitTSNodes(childNode);
        }
    }
}

ir::AstNode *Transformer::VisitTsImportEqualsDeclaration(ir::TSImportEqualsDeclaration *node)
{
    auto *express = node->ModuleReference();
    if (!IsInstantiatedTSModule(express)) {
        return node;
    }
    auto name = node->Id()->Name();
    if (IsTsModule() && node->IsExport()) {
        auto moduleName = GetCurrentTSModuleName();
        auto *id = AllocNode<ir::Identifier>(moduleName, Allocator());
        id->AsIdentifier()->SetReference();
        auto *left = AllocNode<ir::MemberExpression>(id, AllocNode<ir::Identifier>(name, Allocator()),
            ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, false);
        ir::Expression *right = CreateMemberExpressionFromQualified(express);
        auto *assignExpr = AllocNode<ir::AssignmentExpression>(left, right,
            lexer::TokenType::PUNCTUATOR_SUBSTITUTION);
        auto *res = AllocNode<ir::ExpressionStatement>(assignExpr);
        return res;
    }

    ir::Expression *init = CreateMemberExpressionFromQualified(express);
    ir::Statement *res = CreateVariableDeclarationWithIdentify(name, VariableParsingFlags::VAR, node,
        node->IsExport(), init);
    if (node->IsExport()) {
        ArenaVector<ir::ExportSpecifier *> specifiers(Allocator()->Adapter());
        res = AllocNode<ir::ExportNamedDeclaration>(res, std::move(specifiers));
        AddExportLocalEntryItem(name, node->Id());
    }
    return res;
}

bool Transformer::IsInstantiatedTSModule(const ir::Expression *node) const
{
    auto *var = FindTSModuleVariable(node, Scope());
    if (var == nullptr) {
        return true;
    }
    auto *decl = var->Declaration();
    ASSERT(decl->IsNamespaceDecl());
    auto tsModules = decl->AsNamespaceDecl()->Decls();
    for (auto *it : tsModules) {
        if (it->IsInstantiated()) {
            return true;
        }
    }
    return false;
}

binder::Variable *Transformer::FindTSModuleVariable(const ir::Expression *node, binder::Scope *scope) const
{
    if (node == nullptr) {
        return nullptr;
    }
    if (node->IsTSQualifiedName()) {
        auto *tsQualifiedName = node->AsTSQualifiedName();
        auto *var = FindTSModuleVariable(tsQualifiedName->Left(), scope);
        if (var == nullptr) {
            return nullptr;
        }
        auto *exportTSBindings = var->AsNamespaceVariable()->GetExportBindings();
        auto name = tsQualifiedName->Right()->Name();
        auto *res = exportTSBindings->FindExportTSVariable<binder::TSBindingType::NAMESPACE>(name);
        if (res != nullptr) {
            return res;
        }
        res = exportTSBindings->FindExportTSVariable<binder::TSBindingType::IMPORT_EQUALS>(name);
        if (res != nullptr) {
            auto *node = res->Declaration()->Node();
            return FindTSModuleVariable(node->Parent()->AsTSImportEqualsDeclaration()->ModuleReference(),
                res->AsImportEqualsVariable()->GetScope());
        }
        return nullptr;
    }
    ASSERT(node->IsIdentifier());
    auto name = node->AsIdentifier()->Name();
    auto *currentScope = scope;
    while (currentScope != nullptr) {
        auto *res = currentScope->FindLocalTSVariable<binder::TSBindingType::NAMESPACE>(name);
        if (res == nullptr && currentScope->IsTSModuleScope()) {
            res = currentScope->AsTSModuleScope()->FindExportTSVariable<binder::TSBindingType::NAMESPACE>(name);
        }
        if (res != nullptr) {
            return res;
        }
        res = currentScope->FindLocalTSVariable<binder::TSBindingType::IMPORT_EQUALS>(name);
        if (res == nullptr && currentScope->IsTSModuleScope()) {
            res = currentScope->AsTSModuleScope()->FindExportTSVariable<binder::TSBindingType::IMPORT_EQUALS>(name);
        }
        if (res != nullptr) {
            auto *node = res->Declaration()->Node();
            return FindTSModuleVariable(node->Parent()->AsTSImportEqualsDeclaration()->ModuleReference(),
                res->AsImportEqualsVariable()->GetScope());
        }
        currentScope = currentScope->Parent();
    }
    return nullptr;
}

std::vector<ir::AstNode *> Transformer::VisitExportNamedVariable(ir::Statement *decl)
{
    std::vector<ir::AstNode *> res;
    if (decl->IsVariableDeclaration()) {
        auto declarators = decl->AsVariableDeclaration()->Declarators();
        for (auto *it : declarators) {
            if (it->Init()) {
                auto *left = std::get<ir::AstNode *>(VisitTSNode(it->Id()))->AsExpression();
                auto *right = std::get<ir::AstNode *>(VisitTSNode(it->Init()))->AsExpression();
                auto *assignExpr = AllocNode<ir::AssignmentExpression>(left, right,
                    lexer::TokenType::PUNCTUATOR_SUBSTITUTION);
                res.push_back(AllocNode<ir::ExpressionStatement>(assignExpr));
            }
        }
    } else if (decl->IsFunctionDeclaration() || decl->IsClassDeclaration()) {
        res.push_back(VisitTSNodes(decl));
        auto name = decl->IsFunctionDeclaration() ?
            decl->AsFunctionDeclaration()->Function()->Id() :
            decl->AsClassDeclaration()->Definition()->Ident();
        ASSERT(name != nullptr);
        res.push_back(CreateTsModuleAssignment(name->Name()));
    }
    return res;
}

ir::Expression *Transformer::CreateMemberExpressionFromQualified(ir::Expression *node)
{
    if (node->IsTSQualifiedName()) {
        auto *tsQualifiedName = node->AsTSQualifiedName();
        auto *left = CreateMemberExpressionFromQualified(tsQualifiedName->Left());
        auto *right = AllocNode<ir::Identifier>(tsQualifiedName->Right()->Name(), Allocator());
        return AllocNode<ir::MemberExpression>(left, right,
            ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, false);
    }
    ASSERT(node->IsIdentifier());
    auto *id = AllocNode<ir::Identifier>(node->AsIdentifier()->Name(), Allocator());
    id->AsIdentifier()->SetReference();
    return id;
}

void Transformer::SetOriginalNode(ir::UpdateNodes res, ir::AstNode *originalNode) const
{
    if (std::holds_alternative<ir::AstNode *>(res)) {
        auto *node = std::get<ir::AstNode *>(res);
        if (node == nullptr || node == originalNode) {
            return;
        }
        node->SetOriginal(originalNode);
        node->SetRange(originalNode->Range());
    } else {
        auto nodes = std::get<std::vector<ir::AstNode *>>(res);
        for (auto *it : nodes) {
            it->SetOriginal(originalNode);
            it->SetRange(originalNode->Range());
        }
    }
}

ir::ExpressionStatement *Transformer::CreateTsModuleAssignment(util::StringView name)
{
    auto moduleName = GetCurrentTSModuleName();
    auto *id = AllocNode<ir::Identifier>(moduleName, Allocator());
    id->AsIdentifier()->SetReference();
    auto *left = AllocNode<ir::MemberExpression>(id, AllocNode<ir::Identifier>(name, Allocator()),
        ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, false);
    auto *right = AllocNode<ir::Identifier>(name, Allocator());
    right->AsIdentifier()->SetReference();
    auto *assignExpr = AllocNode<ir::AssignmentExpression>(left, right, lexer::TokenType::PUNCTUATOR_SUBSTITUTION);
    return AllocNode<ir::ExpressionStatement>(assignExpr);
}

util::StringView Transformer::GetNameFromModuleDeclaration(ir::TSModuleDeclaration *node) const
{
    return node->Name()->AsIdentifier()->Name();
}

ir::VariableDeclaration *Transformer::CreateVariableDeclarationWithIdentify(util::StringView name,
                                                                            VariableParsingFlags flags,
                                                                            ir::AstNode *node,
                                                                            bool isExport,
                                                                            ir::Expression *init)
{
    auto *ident = AllocNode<ir::Identifier>(name, Allocator());
    ident->AsIdentifier()->SetReference();
    auto *declarator = AllocNode<ir::VariableDeclarator>(ident, init);
    ArenaVector<ir::VariableDeclarator *> declarators(Allocator()->Adapter());
    declarators.push_back(declarator);

    binder::Decl *decl = nullptr;
    binder::DeclarationFlags declflag = isExport ?
        binder::DeclarationFlags::EXPORT :
        binder::DeclarationFlags::NONE;
    auto varKind = ir::VariableDeclaration::VariableDeclarationKind::VAR;
    if (flags & VariableParsingFlags::VAR) {
        decl = Binder()->AddDecl<binder::VarDecl>(node->Start(), declflag, name);
    } else if (flags & VariableParsingFlags::LET) {
        varKind = ir::VariableDeclaration::VariableDeclarationKind::LET;
        decl = Binder()->AddDecl<binder::LetDecl>(node->Start(), declflag, name);
    } else {
        varKind = ir::VariableDeclaration::VariableDeclarationKind::CONST;
        decl = Binder()->AddDecl<binder::ConstDecl>(node->Start(), declflag, name);
    }

    auto *declaration = AllocNode<ir::VariableDeclaration>(varKind, std::move(declarators), false);
    decl->BindNode(declaration);

    return declaration;
}

util::StringView Transformer::GetParamName(ir::TSModuleDeclaration *node, util::StringView name) const
{
    auto scope = node->Scope();
    if (!scope->HasVariableName(name)) {
        return name;
    }

    auto pramaName = name;
    uint32_t idx = 0;
    do {
        std::stringstream ss;
        ss << name;
        idx++;
        ss << "_" << std::to_string(idx);
        util::UString internalName(ss.str(), Allocator());
        pramaName = internalName.View();
    } while (Binder()->HasVariableName(pramaName));
    Binder()->AddDeclarationName(pramaName);
    return pramaName;
}

ir::CallExpression *Transformer::CreateCallExpressionForTsModule(ir::TSModuleDeclaration *node,
                                                                 util::StringView name,
                                                                 bool isExport)
{
    ir::ScriptFunction *funcNode = nullptr;

    binder::FunctionScope *funcScope = node->Scope();
    binder::FunctionParamScope *funcParamScope = funcScope->ParamScope();
    auto paramName = GetParamName(node, name);
    {
        auto paramScopeCtx = binder::LexicalScope<binder::FunctionParamScope>::Enter(Binder(), funcParamScope);

        ArenaVector<ir::Expression *> params(Allocator()->Adapter());
        auto *parameter = AllocNode<ir::Identifier>(paramName, Allocator());
        parameter->AsIdentifier()->SetReference();
        Binder()->AddParamDecl(parameter);
        params.push_back(parameter);

        ir::BlockStatement *blockNode = nullptr;
        {
            auto scopeCtx = binder::LexicalScope<binder::FunctionScope>::Enter(Binder(), funcScope);
            tsModuleList_.push_back({paramName, funcScope});
            if (node->Body()->IsTSModuleDeclaration()) {
                auto *tsModule = node->Body()->AsTSModuleDeclaration();
                auto body = std::get<std::vector<ir::AstNode *>>(VisitTsModuleDeclaration(tsModule, true));
                ArenaVector<ir::Statement *> statements(Allocator()->Adapter());
                for (auto *it : body) {
                    statements.push_back(static_cast<ir::Statement *>(it));
                }
                blockNode = AllocNode<ir::BlockStatement>(funcScope, std::move(statements));
            } else {
                auto body = VisitTSNodes(node->Body());
                blockNode = AllocNode<ir::BlockStatement>(funcScope,
                    std::move(body->AsTSModuleBlock()->Statements()));
            }
            tsModuleList_.pop_back();
            funcScope->AddBindsFromParam();
        }

        funcNode = AllocNode<ir::ScriptFunction>(funcScope, std::move(params), nullptr, blockNode, nullptr,
            ir::ScriptFunctionFlags::NONE, false, Extension() == ScriptExtension::TS);

        funcScope->BindNode(funcNode);
        funcParamScope->BindNode(funcNode);
    }

    auto *funcExpr = AllocNode<ir::FunctionExpression>(funcNode);

    ArenaVector<ir::Expression *> arguments(Allocator()->Adapter());
    ArenaVector<ir::Expression *> properties(Allocator()->Adapter());
    auto *objectExpression = AllocNode<ir::ObjectExpression>(ir::AstNodeType::OBJECT_EXPRESSION,
                                                             std::move(properties),
                                                             false);
    auto assignExpr = AllocNode<ir::AssignmentExpression>(CreateTsModuleParam(name, isExport),
                                                          objectExpression,
                                                          lexer::TokenType::PUNCTUATOR_SUBSTITUTION);
    auto argument = AllocNode<ir::BinaryExpression>(CreateTsModuleParam(name, isExport),
                                                    assignExpr,
                                                    lexer::TokenType::PUNCTUATOR_LOGICAL_OR);
    if (isExport) {
        auto *id = AllocNode<ir::Identifier>(name, Allocator());
        id->AsIdentifier()->SetReference();
        arguments.push_back(AllocNode<ir::AssignmentExpression>(id, argument,
            lexer::TokenType::PUNCTUATOR_SUBSTITUTION));
    } else {
        arguments.push_back(argument);
    }

    auto *callExpr = AllocNode<ir::CallExpression>(funcExpr, std::move(arguments), nullptr, false);

    return callExpr;
}

ir::Expression *Transformer::CreateTsModuleParam(util::StringView paramName, bool isExport)
{
    if (isExport) {
        auto moduleName = GetCurrentTSModuleName();
        auto *id = AllocNode<ir::Identifier>(moduleName, Allocator());
        id->AsIdentifier()->SetReference();
        return AllocNode<ir::MemberExpression>(id, AllocNode<ir::Identifier>(paramName, Allocator()),
            ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, false);
    }

    auto *id = AllocNode<ir::Identifier>(paramName, Allocator());
    id->AsIdentifier()->SetReference();
    return id;
}

void Transformer::AddExportLocalEntryItem(util::StringView name, const ir::Identifier *identifier)
{
    auto moduleRecord = GetSourceTextModuleRecord();
    auto *entry = moduleRecord->NewEntry<SourceTextModuleRecord::ExportEntry>(name, name, identifier, identifier);
    [[maybe_unused]] bool res = moduleRecord->AddLocalExportEntry(entry);
    ASSERT(res);
}

ir::UpdateNodes Transformer::VisitTsModuleDeclaration(ir::TSModuleDeclaration *node, bool isExport)
{
    std::vector<ir::AstNode *> res;

    util::StringView name = GetNameFromModuleDeclaration(node);

    auto findRes = Scope()->FindLocal(name, binder::ResolveBindingOptions::ALL);
    if (findRes == nullptr) {
        bool doExport = isExport && !IsTsModule();
        auto flag = VariableParsingFlags::VAR;
        if (IsTsModule()) {
            flag = VariableParsingFlags::LET;
        }
        auto *var = CreateVariableDeclarationWithIdentify(name, flag, node, doExport);
        if (doExport) {
            ArenaVector<ir::ExportSpecifier *> specifiers(Allocator()->Adapter());
            res.push_back(AllocNode<ir::ExportNamedDeclaration>(var, std::move(specifiers)));
            AddExportLocalEntryItem(name, node->Name()->AsIdentifier());
        } else {
            res.push_back(var);
        }
    }

    auto *callExpr = CreateCallExpressionForTsModule(node, name, isExport && IsTsModule());
    auto *exprStatementNode = AllocNode<ir::ExpressionStatement>(callExpr);
    res.push_back(exprStatementNode);

    return res;
}

}  // namespace panda::es2panda::parser
