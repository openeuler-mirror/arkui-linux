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

#include "hoisting.h"

#include <ir/base/scriptFunction.h>
#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/core/pandagen.h>
#include <parser/module/sourceTextModuleRecord.h>

namespace panda::es2panda::compiler {

static void StoreModuleVarOrLocalVar(PandaGen *pg, binder::ScopeFindResult &result, const binder::Decl *decl)
{
    if (decl->IsImportOrExportDecl()) {
        ASSERT(pg->Scope()->IsModuleScope());
        auto *var = pg->Scope()->FindLocal(decl->Name());
        ASSERT(var->IsModuleVariable());
        pg->StoreModuleVariable(decl->Node(), var->AsModuleVariable());
    } else {
        pg->StoreAccToLexEnv(decl->Node(), result, true);
    }
}

static void HoistVar(PandaGen *pg, binder::Variable *var, const binder::VarDecl *decl)
{
    auto *scope = pg->Scope();

    if (scope->IsGlobalScope()) {
        pg->LoadConst(decl->Node(), Constant::JS_UNDEFINED);
        pg->StoreGlobalVar(decl->Node(), decl->Name());
        return;
    }

    auto *funcScope = scope->EnclosingFunctionVariableScope();
    if (funcScope->ParamScope()->HasParam(decl->Name())) {
        return;
    }

    binder::ScopeFindResult result(decl->Name(), scope, 0, var);

    pg->LoadConst(decl->Node(), Constant::JS_UNDEFINED);
    StoreModuleVarOrLocalVar(pg, result, decl);
}

static void HoistFunction(PandaGen *pg, binder::Variable *var, const binder::FunctionDecl *decl)
{
    const ir::ScriptFunction *scriptFunction = decl->Node()->AsScriptFunction();
    auto *scope = pg->Scope();

    const auto &internalName = scriptFunction->Scope()->InternalName();

    if (scope->IsGlobalScope()) {
        pg->DefineFunction(decl->Node(), scriptFunction, internalName);
        pg->StoreGlobalVar(decl->Node(), var->Declaration()->Name());
        return;
    }

    ASSERT(scope->IsFunctionScope() || scope->IsCatchScope() || scope->IsLocalScope() ||
        scope->IsModuleScope() || scope->IsTSModuleScope());
    binder::ScopeFindResult result(decl->Name(), scope, 0, var);

    pg->DefineFunction(decl->Node(), scriptFunction, internalName);
    StoreModuleVarOrLocalVar(pg, result, decl);
}

static void HoistNameSpaceImports(PandaGen *pg)
{
    if (pg->Scope()->IsModuleScope()) {
        parser::SourceTextModuleRecord *moduleRecord = pg->Binder()->Program()->ModuleRecord();
        ASSERT(moduleRecord != nullptr);
        for (auto nameSpaceEntry : moduleRecord->GetNamespaceImportEntries()) {
            auto *var = pg->TopScope()->FindLocal(nameSpaceEntry->localName_);
            ASSERT(var != nullptr);
            auto *node = var->Declaration()->Node();
            ASSERT(node != nullptr);
            pg->GetModuleNamespace(node, nameSpaceEntry->moduleRequestIdx_);
            pg->StoreVar(node, {nameSpaceEntry->localName_, pg->TopScope(), 0, var}, true);
        }
    }
}

void Hoisting::Hoist(PandaGen *pg)
{
    const auto *scope = pg->Scope();

    for (const auto &[_, var] : scope->Bindings()) {
        (void)_;
        if (!var->HasFlag(binder::VariableFlags::HOIST)) {
            continue;
        }

        const auto *decl = var->Declaration();

        if (decl->IsVarDecl()) {
            HoistVar(pg, var, decl->AsVarDecl());
        } else {
            ASSERT(decl->IsFunctionDecl());
            HoistFunction(pg, var, decl->AsFunctionDecl());
        }
    }

    HoistNameSpaceImports(pg);
}

}  // namespace panda::es2panda::compiler
