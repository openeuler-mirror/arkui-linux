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

#include "envScope.h"

#include <compiler/core/pandagen.h>
#include <ir/statement.h>

namespace panda::es2panda::compiler {

ScopeContext::ScopeContext(PandaGen *pg, binder::Scope *newScope) : pg_(pg), prevScope_(pg_->scope_)
{
    pg_->scope_ = newScope;
}

ScopeContext::~ScopeContext()
{
    pg_->scope_ = prevScope_;
}

void EnvScope::Initialize(PandaGen *pg)
{
    pg_ = pg;
    prev_ = pg_->envScope_;
    pg_->envScope_ = this;
}

EnvScope::~EnvScope()
{
    if (!pg_) {
        return;
    }

    pg_->envScope_ = prev_;
}

void LoopEnvScope::InitLoopContext(PandaGen *pg, binder::VariableScope *scope)
{
    if (!HasEnv()) {
        return;
    }

    Initialize(pg);
    ASSERT(scope->NeedLexEnv());
    pg_->NewLexicalEnv(scope_->Node(), scope->LexicalSlots(), scope_);
}

void LoopEnvScope::CopyPerIterationCtx()
{
    if (!HasEnv()) {
        return;
    }

    auto num = scope_->LexicalSlots();
    RegScope rs(pg_);
    std::vector<VReg> lexicals;
    lexicals.reserve(num);
    for (uint32_t i = 0; i < num; i++) {
        VReg lexical = pg_->AllocReg();
        pg_->LoadLexicalVar(scope_->Node(), 0, i);
        pg_->StoreAccumulator(scope_->Node(), lexical);
        lexicals.push_back(lexical);
    }
    pg_->PopLexEnv(scope_->Node());
    pg_->NewLexicalEnv(scope_->Node(), num, scope_);

    for (uint32_t i = 0; i < num; i++) {
        pg_->StoreLexicalVar(scope_->Node(), 0, i, lexicals[i]);
    }
}

}  // namespace panda::es2panda::compiler
