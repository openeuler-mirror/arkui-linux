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

#include "forUpdateStatement.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/base/condition.h>
#include <compiler/base/lreference.h>
#include <compiler/core/labelTarget.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/dynamicContext.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void ForUpdateStatement::Iterate(const NodeTraverser &cb) const
{
    if (init_) {
        cb(init_);
    }
    if (test_) {
        cb(test_);
    }
    if (update_) {
        cb(update_);
    }

    cb(body_);
}

void ForUpdateStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ForUpdateStatement"},
                 {"init", AstDumper::Nullable(init_)},
                 {"test", AstDumper::Nullable(test_)},
                 {"update", AstDumper::Nullable(update_)},
                 {"body", body_}});
}

void ForUpdateStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::LocalRegScope loopRegScope(pg, scope_);
    compiler::LabelTarget labelTarget(pg);
    compiler::LoopEnvScope envScope(pg, labelTarget, scope_);

    if (init_) {
        ASSERT(init_->IsVariableDeclaration() || init_->IsExpression());
        init_->Compile(pg);
    }

    auto *startLabel = pg->AllocLabel();
    pg->SetLabel(this, startLabel);

    {
        if (test_) {
            compiler::Condition::Compile(pg, test_, labelTarget.BreakTarget());
        }

        body_->Compile(pg);
        pg->SetLabel(this, labelTarget.ContinueTarget());
        envScope.CopyPerIterationCtx();
    }

    if (update_) {
        update_->Compile(pg);
    }

    pg->Branch(this, startLabel);
    pg->SetLabel(this, labelTarget.BreakTarget());
}

checker::Type *ForUpdateStatement::Check(checker::Checker *checker) const
{
    checker::ScopeContext scopeCtx(checker, scope_);

    if (init_) {
        init_->Check(checker);
    }

    if (test_) {
        checker::Type *testType = test_->Check(checker);
        checker->CheckTruthinessOfType(testType, Start());
    }

    if (update_) {
        update_->Check(checker);
    }

    body_->Check(checker);

    return nullptr;
}

void ForUpdateStatement::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto *loopScope = Scope();
    auto loopCtx = binder::LexicalScope<binder::LoopScope>::Enter(binder, loopScope);

    if (init_) {
        init_ = std::get<ir::AstNode *>(cb(init_));
    }

    if (test_) {
        test_ = std::get<ir::AstNode *>(cb(test_))->AsExpression();
    }

    if (update_) {
        update_ = std::get<ir::AstNode *>(cb(update_))->AsExpression();
    }

    body_ = std::get<ir::AstNode *>(cb(body_))->AsStatement();
}

}  // namespace panda::es2panda::ir
