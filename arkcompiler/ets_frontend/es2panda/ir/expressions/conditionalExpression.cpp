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

#include "conditionalExpression.h"

#include <compiler/base/condition.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void ConditionalExpression::Iterate(const NodeTraverser &cb) const
{
    cb(test_);
    cb(consequent_);
    cb(alternate_);
}

void ConditionalExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add(
        {{"type", "ConditionalExpression"}, {"test", test_}, {"consequent", consequent_}, {"alternate", alternate_}});
}

void ConditionalExpression::Compile(compiler::PandaGen *pg) const
{
    auto *falseLabel = pg->AllocLabel();
    auto *endLabel = pg->AllocLabel();

    compiler::Condition::Compile(pg, test_, falseLabel);
    consequent_->Compile(pg);
    pg->Branch(this, endLabel);
    pg->SetLabel(this, falseLabel);
    alternate_->Compile(pg);
    pg->SetLabel(this, endLabel);
}

checker::Type *ConditionalExpression::Check(checker::Checker *checker) const
{
    checker::Type *testType = test_->Check(checker);

    checker->CheckTruthinessOfType(testType, test_->Start());
    checker->CheckTestingKnownTruthyCallableOrAwaitableType(test_, testType, consequent_);

    checker::Type *consequentType = consequent_->Check(checker);
    checker::Type *alternateType = alternate_->Check(checker);

    return checker->CreateUnionType({consequentType, alternateType});
}

void ConditionalExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    test_ = std::get<ir::AstNode *>(cb(test_))->AsExpression();
    consequent_ = std::get<ir::AstNode *>(cb(consequent_))->AsExpression();
    alternate_ = std::get<ir::AstNode *>(cb(alternate_))->AsExpression();
}

}  // namespace panda::es2panda::ir
