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

#include "scope.h"

#include <binder/declaration.h>
#include <util/helpers.h>
#include <binder/tsBinding.h>
#include <binder/variable.h>
#include <binder/variableFlags.h>
#include <ir/astNode.h>
#include <ir/base/scriptFunction.h>
#include <ir/expressions/identifier.h>
#include <ir/module/exportAllDeclaration.h>
#include <ir/module/exportNamedDeclaration.h>
#include <ir/module/exportSpecifier.h>
#include <ir/module/importDeclaration.h>
#include <macros.h>
#include <util/concurrent.h>
#include <util/ustring.h>

#include <algorithm>
#include <sstream>

namespace panda::es2panda::binder {

VariableScope *Scope::EnclosingVariableScope()
{
    Scope *iter = this;

    while (iter) {
        if (iter->IsVariableScope()) {
            return iter->AsVariableScope();
        }

        iter = iter->Parent();
    }

    return nullptr;
}

FunctionScope *Scope::EnclosingFunctionVariableScope()
{
    Scope *iter = this;
    while (iter) {
        if (iter->IsFunctionVariableScope()) {
            return iter->AsFunctionVariableScope();
        }

        iter = iter->Parent();
    }

    return nullptr;
}

Variable *Scope::FindLocal(const util::StringView &name, ResolveBindingOptions options) const
{
    if (options & ResolveBindingOptions::INTERFACES) {
        util::StringView interfaceNameView(binder::TSBinding::ToTSBinding(name));

        auto res = bindings_.find(interfaceNameView);
        if (res != bindings_.end()) {
            return res->second;
        }

        if (!(options & ResolveBindingOptions::BINDINGS)) {
            return nullptr;
        }
    }

    auto res = bindings_.find(name);
    if (res == bindings_.end()) {
        return nullptr;
    }

    return res->second;
}

ScopeFindResult Scope::Find(const util::StringView &name, ResolveBindingOptions options) const
{
    uint32_t level = 0;
    uint32_t lexLevel = 0;
    const auto *iter = this;
    bool crossConcurrent = false;

    if (iter->IsFunctionParamScope()) {
        Variable *v = iter->FindLocal(name, options);

        if (v != nullptr) {
            return {name, const_cast<Scope *>(iter), level, lexLevel, v, crossConcurrent};
        }

        level++;
        auto *funcVariableScope = iter->AsFunctionParamScope()->GetFunctionScope();

        // we may only have function param scope without function scope in TS here
        if ((funcVariableScope != nullptr) && (funcVariableScope->NeedLexEnv())) {
            lexLevel++;
        }

        iter = iter->Parent();
    }

    bool lexical = false;

    while (iter != nullptr) {
        Variable *v = iter->FindLocal(name, options);

        if (v != nullptr) {
            return {name, const_cast<Scope *>(iter), level, lexLevel, v, crossConcurrent};
        }

        if (iter->IsFunctionVariableScope() && !lexical) {
            lexical = true;
        }

        if (iter->IsVariableScope()) {
            if (lexical) {
                level++;
            }

            if (iter->IsFunctionScope() && !crossConcurrent) {
                crossConcurrent = iter->Node()->AsScriptFunction()->IsConcurrent() ? true : false;
            }

            if (iter->AsVariableScope()->NeedLexEnv()) {
                lexLevel++;
            }
        }

        iter = iter->Parent();
    }

    return {name, nullptr, 0, 0, nullptr, crossConcurrent};
}

Decl *Scope::FindDecl(const util::StringView &name) const
{
    for (auto *it : decls_) {
        if (it->Name() == name) {
            return it;
        }
    }

    return nullptr;
}

bool Scope::HasVarDecl(const util::StringView &name) const
{
    for (auto *it : decls_) {
        if (it->Name() == name && it->IsVarDecl()) {
            return true;
        }
    }

    return false;
}

std::tuple<Scope *, bool> Scope::IterateShadowedVariables(const util::StringView &name, const VariableVisitior &visitor)
{
    auto *iter = this;

    while (true) {
        auto *v = iter->FindLocal(name);

        if (v && visitor(v)) {
            return {iter, true};
        }

        if (iter->IsFunctionVariableScope()) {
            break;
        }

        iter = iter->Parent();
    }

    return {iter, false};
}

bool Scope::AddLocal(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                     [[maybe_unused]] ScriptExtension extension)
{
    VariableFlags flags = VariableFlags::NONE;
    switch (newDecl->Type()) {
        case DeclType::VAR: {
            auto [scope, shadowed] = IterateShadowedVariables(
                newDecl->Name(), [](const Variable *v) { return !v->HasFlag(VariableFlags::VAR); });

            if (shadowed) {
                return false;
            }

            VariableFlags varFlags = VariableFlags::HOIST_VAR;
            if (scope->IsGlobalScope()) {
                scope->Bindings().insert({newDecl->Name(), allocator->New<GlobalVariable>(newDecl, varFlags)});
            } else {
                scope->PropagateBinding<LocalVariable>(allocator, newDecl->Name(), newDecl, varFlags);
            }

            return true;
        }
        case DeclType::ENUM: {
            bindings_.insert({newDecl->Name(), allocator->New<EnumVariable>(newDecl, false)});
            return true;
        }
        case DeclType::ENUM_LITERAL: {
            bindings_.insert({newDecl->Name(), allocator->New<LocalVariable>(newDecl, VariableFlags::ENUM_LITERAL)});
            return true;
        }
        case DeclType::INTERFACE: {
            bindings_.insert({newDecl->Name(), allocator->New<LocalVariable>(newDecl, VariableFlags::INTERFACE)});
            return true;
        }
        case DeclType::FUNC: {
            flags = VariableFlags::HOIST;
            [[fallthrough]];
        }
        default: {
            if (currentVariable) {
                return false;
            }

            if (HasVarDecl(newDecl->Name())) {
                return false;
            }

            bindings_.insert({newDecl->Name(), allocator->New<LocalVariable>(newDecl, flags)});
            return true;
        }
    }
}

bool ParamScope::AddParam(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl, VariableFlags flags)
{
    ASSERT(newDecl->IsParameterDecl());

    if (currentVariable) {
        return false;
    }

    auto *param = allocator->New<LocalVariable>(newDecl, flags);

    params_.push_back(param);
    bindings_.insert({newDecl->Name(), param});
    return true;
}

std::tuple<ParameterDecl *, const ir::AstNode *> ParamScope::AddParamDecl(ArenaAllocator *allocator,
                                                                          const ir::AstNode *param)
{
    const auto [name, pattern] = util::Helpers::ParamName(allocator, param, params_.size());

    auto *decl = NewDecl<ParameterDecl>(allocator, name);

    if (!AddParam(allocator, FindLocal(name), decl, VariableFlags::VAR)) {
        return {decl, param};
    }

    if (!pattern) {
        decl->BindNode(param);
        return {decl, nullptr};
    }

    std::vector<const ir::Identifier *> bindings = util::Helpers::CollectBindingNames(param);

    for (const auto *binding : bindings) {
        auto *varDecl = NewDecl<VarDecl>(allocator, binding->Name());
        varDecl->BindNode(binding);

        if (FindLocal(varDecl->Name())) {
            return {decl, binding};
        }

        auto *paramVar = allocator->New<LocalVariable>(varDecl, VariableFlags::VAR);
        bindings_.insert({varDecl->Name(), paramVar});
    }

    return {decl, nullptr};
}

void FunctionParamScope::BindName(ArenaAllocator *allocator, util::StringView name)
{
    nameVar_ = AddDecl<ConstDecl, LocalVariable>(allocator, name, VariableFlags::INITIALIZED);
    functionScope_->Bindings().insert({name, nameVar_});
}

bool FunctionParamScope::AddBinding([[maybe_unused]] ArenaAllocator *allocator,
                                    [[maybe_unused]] Variable *currentVariable, [[maybe_unused]] Decl *newDecl,
                                    [[maybe_unused]] ScriptExtension extension)
{
    UNREACHABLE();
}

bool FunctionScope::AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                               [[maybe_unused]] ScriptExtension extension)
{
    switch (newDecl->Type()) {
        case DeclType::VAR: {
            return AddVar<LocalVariable>(allocator, currentVariable, newDecl);
        }
        case DeclType::FUNC: {
            return AddFunction<LocalVariable>(allocator, currentVariable, newDecl, extension);
        }
        case DeclType::ENUM: {
            bindings_.insert({newDecl->Name(), allocator->New<EnumVariable>(newDecl, false)});
            return true;
        }
        case DeclType::ENUM_LITERAL: {
            return AddTSBinding<LocalVariable>(allocator, currentVariable, newDecl, VariableFlags::ENUM_LITERAL);
        }
        case DeclType::NAMESPACE: {
            return AddTSBinding<NamespaceVariable>(allocator, newDecl, VariableFlags::NAMESPACE);
        }
        case DeclType::IMPORT_EQUALS: {
            return AddTSBinding<ImportEqualsVariable>(allocator, newDecl, VariableFlags::IMPORT_EQUALS);
        }
        case DeclType::INTERFACE: {
            return AddTSBinding<LocalVariable>(allocator, currentVariable, newDecl, VariableFlags::INTERFACE);
        }
        default: {
            return AddLexical<LocalVariable>(allocator, currentVariable, newDecl);
        }
    }
}

bool GlobalScope::AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                             [[maybe_unused]] ScriptExtension extension)
{
    switch (newDecl->Type()) {
        case DeclType::VAR: {
            return AddVar<GlobalVariable>(allocator, currentVariable, newDecl);
        }
        case DeclType::FUNC: {
            return AddFunction<GlobalVariable>(allocator, currentVariable, newDecl, extension);
        }
        case DeclType::ENUM: {
            bindings_.insert({newDecl->Name(), allocator->New<EnumVariable>(newDecl, false)});
            return true;
        }
        case DeclType::ENUM_LITERAL: {
            return AddTSBinding<LocalVariable>(allocator, currentVariable, newDecl, VariableFlags::ENUM_LITERAL);
        }
        case DeclType::NAMESPACE: {
            return AddTSBinding<NamespaceVariable>(allocator, newDecl, VariableFlags::NAMESPACE);
        }
        case DeclType::IMPORT_EQUALS: {
            return AddTSBinding<ImportEqualsVariable>(allocator, newDecl, VariableFlags::IMPORT_EQUALS);
        }
        case DeclType::INTERFACE: {
            return AddTSBinding<LocalVariable>(allocator, currentVariable, newDecl, VariableFlags::INTERFACE);
        }
        default: {
            return AddLexical<LocalVariable>(allocator, currentVariable, newDecl);
        }
    }

    return true;
}

// ModuleScope

void ModuleScope::ConvertLocalVariableToModuleVariable(ArenaAllocator *allocator, util::StringView localName)
{
    auto res = bindings_.find(localName);
    // Since the module's exported [localName] has been validated before,
    // [localName] must have a binding now.
    ASSERT(res != bindings_.end());
    if (!res->second->IsModuleVariable()) {
        auto *decl = res->second->Declaration();
        decl->AddFlag(DeclarationFlags::EXPORT);
        VariableFlags flags = res->second->Flags();
        res->second = allocator->New<ModuleVariable>(decl, flags | VariableFlags::LOCAL_EXPORT);
    }
}

void ModuleScope::AssignIndexToModuleVariable(util::StringView name, uint32_t index)
{
    auto *moduleVar = FindLocal(name);
    ASSERT(moduleVar != nullptr);
    ASSERT(moduleVar->IsModuleVariable());
    moduleVar->AsModuleVariable()->AssignIndex(index);
}

bool ModuleScope::AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                             [[maybe_unused]] ScriptExtension extension)
{
    switch (newDecl->Type()) {
        case DeclType::VAR: {
            auto [scope, shadowed] = IterateShadowedVariables(
                newDecl->Name(), [](const Variable *v) { return !v->HasFlag(VariableFlags::VAR); });

            if (shadowed) {
                return false;
            }
            return newDecl->IsImportOrExportDecl() ?
                   AddVar<ModuleVariable>(allocator, currentVariable, newDecl) :
                   AddVar<LocalVariable>(allocator, currentVariable, newDecl);
        }
        case DeclType::FUNC: {
            if (currentVariable) {
                return false;
            }
            return newDecl->IsImportOrExportDecl() ?
                   AddFunction<ModuleVariable>(allocator, currentVariable, newDecl, extension) :
                   AddFunction<LocalVariable>(allocator, currentVariable, newDecl, extension);
        }
        case DeclType::ENUM: {
            bindings_.insert({newDecl->Name(), allocator->New<EnumVariable>(newDecl, false)});
            return true;
        }
        case DeclType::ENUM_LITERAL: {
            return AddTSBinding<LocalVariable>(allocator, currentVariable, newDecl, VariableFlags::ENUM_LITERAL);
        }
        case DeclType::NAMESPACE: {
            return AddTSBinding<NamespaceVariable>(allocator, newDecl, VariableFlags::NAMESPACE);
        }
        case DeclType::IMPORT_EQUALS: {
            return AddTSBinding<ImportEqualsVariable>(allocator, newDecl, VariableFlags::IMPORT_EQUALS);
        }
        case DeclType::INTERFACE: {
            return AddTSBinding<LocalVariable>(allocator, currentVariable, newDecl, VariableFlags::INTERFACE);
        }
        default: {
            if (currentVariable) {
                return false;
            }
            return newDecl->IsImportOrExportDecl() ?
                   AddLexical<ModuleVariable>(allocator, currentVariable, newDecl) :
                   AddLexical<LocalVariable>(allocator, currentVariable, newDecl);
        }
    }
}

// LocalScope

bool LocalScope::AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                            [[maybe_unused]] ScriptExtension extension)
{
    return AddLocal(allocator, currentVariable, newDecl, extension);
}

void LoopScope::InitVariable()
{
    for (const auto &[name, var] : bindings_) {
        if (!var->Declaration()->IsLetOrConstOrClassDecl()) {
            continue;
        }

        var->AddFlag(VariableFlags::INITIALIZED);
        if (var->LexicalBound()) {
            var->AddFlag(VariableFlags::PER_ITERATION);
        }
    }
}

bool CatchParamScope::AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                                 [[maybe_unused]] ScriptExtension extension)
{
    return AddParam(allocator, currentVariable, newDecl, VariableFlags::INITIALIZED);
}

bool CatchScope::AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                            [[maybe_unused]] ScriptExtension extension)
{
    if (!newDecl->IsVarDecl() && paramScope_->FindLocal(newDecl->Name())) {
        return false;
    }

    return AddLocal(allocator, currentVariable, newDecl, extension);
}

}  // namespace panda::es2panda::binder
