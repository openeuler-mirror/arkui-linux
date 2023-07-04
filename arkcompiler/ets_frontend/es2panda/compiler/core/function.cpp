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

#include "function.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <binder/variable.h>
#include <compiler/base/lreference.h>
#include <compiler/core/pandagen.h>
#include <ir/base/classDefinition.h>
#include <ir/base/classProperty.h>
#include <ir/base/scriptFunction.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/statements/blockStatement.h>
#include <ir/ts/tsParameterProperty.h>
#include <util/helpers.h>

namespace panda::es2panda::compiler {

static void CompileSourceBlock(PandaGen *pg, const ir::BlockStatement *block)
{
    bool hasReturn = false;

    const auto &statements = block->Statements();
    pg->SetFirstStmt(statements.empty() ? block : statements.front());

    for (const auto *stmt : statements) {
        stmt->Compile(pg);

        if (stmt->IsReturnStatement()) {
            hasReturn = true;
        }
    }

    if (hasReturn) {
        return;
    }

    pg->ImplicitReturn(statements.empty() ? block : statements.back());
}

static void CompileFunctionParameterDeclaration(PandaGen *pg, const ir::ScriptFunction *func)
{
    ScopeContext scopeCtx(pg, func->Scope()->ParamScope());

    uint32_t index = 0;

    for (const auto *param : func->Params()) {
        LReference ref = LReference::CreateLRef(pg, param, true);

        [[maybe_unused]] binder::Variable *paramVar = ref.Variable();

        if (ref.Kind() == ReferenceKind::DESTRUCTURING) {
            util::StringView name = util::Helpers::ToStringView(pg->Allocator(), index);
            paramVar = pg->Scope()->FindLocal(name, binder::ResolveBindingOptions::BINDINGS);
        }

        ASSERT(paramVar && paramVar->IsLocalVariable());

        VReg paramReg = binder::Binder::MANDATORY_PARAMS_NUMBER + index++;
        ASSERT(paramVar->LexicalBound() || paramVar->AsLocalVariable()->Vreg() == paramReg);

        // parameter has default value
        if (param->IsAssignmentPattern()) {
            RegScope rs(pg);

            ref.Kind() == ReferenceKind::DESTRUCTURING ?
                pg->LoadAccumulator(func, paramReg) : ref.GetValue();

            auto *nonDefaultLabel = pg->AllocLabel();

            if (ref.Kind() == ReferenceKind::DESTRUCTURING) {
                auto *loadParamLabel = pg->AllocLabel();

                pg->BranchIfStrictNotUndefined(func, loadParamLabel);
                param->AsAssignmentPattern()->Right()->Compile(pg);
                pg->Branch(func, nonDefaultLabel);

                pg->SetLabel(func, loadParamLabel);
                pg->LoadAccumulator(func, paramReg);

                pg->SetLabel(func, nonDefaultLabel);
                ref.SetValue();
            } else {
                pg->BranchIfStrictNotUndefined(func, nonDefaultLabel);

                param->AsAssignmentPattern()->Right()->Compile(pg);
                ref.SetValue();
                pg->SetLabel(func, nonDefaultLabel);
            }

            continue;
        }

        if (param->IsRestElement()) {
            pg->CopyRestArgs(param, func->Params().size() - 1);
        } else if (ref.Kind() == ReferenceKind::DESTRUCTURING) {
            pg->LoadAccumulator(func, paramReg);
        } else {
            continue;
        }
        ref.SetValue();
    }
}

static void CompileInstanceFields(PandaGen *pg, const ir::ScriptFunction *decl)
{
    const auto &statements = decl->Parent()->Parent()->Parent()->AsClassDefinition()->Body();

    RegScope rs(pg);
    auto thisReg = pg->AllocReg();
    pg->GetThis(decl);
    pg->StoreAccumulator(decl, thisReg);

    for (auto const &stmt : statements) {
        if (stmt->IsClassProperty()) {
            const auto *prop = stmt->AsClassProperty();
            if (!prop->Value()) {
                pg->LoadConst(stmt, Constant::JS_UNDEFINED);
            } else {
                RegScope rsProp(pg);
                prop->Value()->Compile(pg);
            }

            if (!prop->Key()->IsIdentifier()) {
                PandaGen::Unimplemented();
            }

            pg->StoreObjByName(stmt, thisReg, prop->Key()->AsIdentifier()->Name());
        }
    }
}

static void CompileFunction(PandaGen *pg)
{
    const auto *decl = pg->RootNode()->AsScriptFunction();

    // TODO(szilagyia): move after super call
    if (decl->IsConstructor()) {
        CompileInstanceFields(pg, decl);
    }

    auto *funcParamScope = pg->TopScope()->ParamScope();
    if (funcParamScope->NameVar()) {
        RegScope rs(pg);
        pg->GetFunctionObject(pg->RootNode());
        pg->StoreAccToLexEnv(pg->RootNode(), funcParamScope->Find(funcParamScope->NameVar()->Name()), true);
    }

    pg->SetSourceLocationFlag(lexer::SourceLocationFlag::INVALID_SOURCE_LOCATION);
    pg->FunctionEnter();
    pg->SetSourceLocationFlag(lexer::SourceLocationFlag::VALID_SOURCE_LOCATION);

    if (pg->IsAsyncFunction()) {
        CompileFunctionParameterDeclaration(pg, decl);
    }

    const ir::AstNode *body = decl->Body();

    if (body->IsExpression()) {
        body->Compile(pg);
        pg->ExplicitReturn(decl);
    } else {
        CompileSourceBlock(pg, body->AsBlockStatement());
    }

    pg->FunctionExit();
}

static void CompileFunctionOrProgram(PandaGen *pg)
{
    FunctionRegScope lrs(pg);
    const auto *topScope = pg->TopScope();

    if (pg->FunctionHasFinalizer()) {
        ASSERT(topScope->IsFunctionScope());

        if (!pg->IsAsyncFunction()) {
            CompileFunctionParameterDeclaration(pg, pg->RootNode()->AsScriptFunction());
        }

        TryContext tryCtx(pg);
        pg->FunctionInit(tryCtx.GetCatchTable());

        CompileFunction(pg);
    } else {
        pg->FunctionInit(nullptr);

        if (topScope->IsFunctionScope() || topScope->IsTSModuleScope()) {
            CompileFunctionParameterDeclaration(pg, pg->RootNode()->AsScriptFunction());
            CompileFunction(pg);
        } else {
            ASSERT(topScope->IsGlobalScope() || topScope->IsModuleScope());
            CompileSourceBlock(pg, pg->RootNode()->AsBlockStatement());
        }
    }
}

void Function::Compile(PandaGen *pg)
{
    pg->SetFunctionKind();
    CompileFunctionOrProgram(pg);
    pg->SetSourceLocationFlag(lexer::SourceLocationFlag::INVALID_SOURCE_LOCATION);
    pg->CopyFunctionArguments(pg->RootNode());
    pg->InitializeLexEnv(pg->RootNode());
    pg->SetSourceLocationFlag(lexer::SourceLocationFlag::VALID_SOURCE_LOCATION);
    pg->AdjustSpillInsns();
    pg->SortCatchTables();
}

}  // namespace panda::es2panda::compiler
