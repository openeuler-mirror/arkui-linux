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

#include "whileStatement.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/base/condition.h>
#include <compiler/core/labelTarget.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void WhileStatement::Iterate(const NodeTraverser &cb) const
{
    cb(test_);
    cb(body_);
}

void WhileStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "WhileStatement"}, {"test", test_}, {"body", body_}});
}

void WhileStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::LabelTarget labelTarget(pg);

    pg->SetLabel(this, labelTarget.ContinueTarget());
    compiler::Condition::Compile(pg, test_, labelTarget.BreakTarget());

    {
        compiler::LoopEnvScope envScope(pg, labelTarget, scope_);
        body_->Compile(pg);
    }

    pg->Branch(this, labelTarget.ContinueTarget());
    pg->SetLabel(this, labelTarget.BreakTarget());
}

checker::Type *WhileStatement::Check(checker::Checker *checker) const
{
    checker::ScopeContext scopeCtx(checker, scope_);

    checker::Type *testType = test_->Check(checker);
    checker->CheckTruthinessOfType(testType, Start());

    body_->Check(checker);

    return nullptr;
}

void WhileStatement::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    test_ = std::get<ir::AstNode *>(cb(test_))->AsExpression();

    auto loopScopeCtx = binder::LexicalScope<binder::LoopScope>::Enter(binder, scope_);
    body_ = std::get<ir::AstNode *>(cb(body_))->AsStatement();
}

}  // namespace panda::es2panda::ir
