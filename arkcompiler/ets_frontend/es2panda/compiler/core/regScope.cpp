/*
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

#include "regScope.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <binder/variable.h>
#include <compiler/base/hoisting.h>
#include <compiler/core/compilerContext.h>
#include <compiler/core/pandagen.h>

namespace panda::es2panda::compiler {

// RegScope

RegScope::RegScope(PandaGen *pg) : pg_(pg), regBase_(pg_->usedRegs_) {}

RegScope::~RegScope()
{
    pg_->totalRegs_ = std::max(pg_->totalRegs_, pg_->usedRegs_);
    pg_->usedRegs_ = regBase_;
}

void RegScope::DebuggerCloseScope()
{
    if (!pg_->IsDebug()) {
        return;
    }

    pg_->scope_->SetScopeEnd(pg_->insns_.back());
}

// LocalRegScope

LocalRegScope::LocalRegScope(PandaGen *pg) : RegScope(pg) {}

LocalRegScope::LocalRegScope(PandaGen *pg, binder::Scope *scope) : RegScope(pg)
{
    prevScope_ = pg_->scope_;
    pg_->scope_ = scope;

    for (const auto &[_, var] : scope->Bindings()) {
        (void)_;
        if (!var->LexicalBound() && var->IsLocalVariable()) {
            var->AsLocalVariable()->BindVReg(pg->AllocReg());
        }
    }

    if (pg_->IsDebug()) {
        pg_->scope_->SetScopeStart(pg_->insns_.back());
        pg_->debugInfo_.variableDebugInfo.push_back(pg_->scope_);
    }

    Hoisting::Hoist(pg_);
}

LocalRegScope::~LocalRegScope()
{
    if (!prevScope_) {
        return;
    }

    DebuggerCloseScope();

    pg_->scope_ = prevScope_;
}

// FunctionRegScope

FunctionRegScope::FunctionRegScope(PandaGen *pg) : RegScope(pg), envScope_(pg->Allocator()->New<EnvScope>())
{
    ASSERT(pg_->Scope()->IsFunctionVariableScope());
    ASSERT(pg_->NextReg() == binder::Binder::MANDATORY_PARAM_FUNC_REG);

    const auto *funcScope = pg_->Scope()->AsFunctionVariableScope();

    for (auto *param : funcScope->ParamScope()->Params()) {
        VReg paramReg = pg_->AllocReg();
        if (!param->LexicalBound()) {
            param->BindVReg(paramReg);
        }
    }

    envScope_->Initialize(pg_);

    for (const auto &[_, var] : funcScope->Bindings()) {
        (void)_;
        if (var->Declaration()->IsParameterDecl()) {
            continue;
        }

        if (!var->LexicalBound() && var->IsLocalVariable()) {
            var->AsLocalVariable()->BindVReg(pg->AllocReg());
        }
    }

    if (pg_->IsDebug()) {
        pg_->debugInfo_.variableDebugInfo.push_back(funcScope);
    }

    pg_->SetSourceLocationFlag(lexer::SourceLocationFlag::INVALID_SOURCE_LOCATION);
    pg_->LoadAccFromArgs(pg_->rootNode_);

    Hoisting::Hoist(pg);
    pg_->SetSourceLocationFlag(lexer::SourceLocationFlag::VALID_SOURCE_LOCATION);
}

FunctionRegScope::~FunctionRegScope()
{
    if (pg_->IsDebug()) {
        pg_->topScope_->SetScopeStart(pg_->insns_.front());
    }

    DebuggerCloseScope();

    envScope_->~EnvScope();
}

}  // namespace panda::es2panda::compiler
