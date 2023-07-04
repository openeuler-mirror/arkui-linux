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

#include "forOfStatement.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/base/iterators.h>
#include <compiler/base/lreference.h>
#include <compiler/core/labelTarget.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void ForOfStatement::Iterate(const NodeTraverser &cb) const
{
    cb(left_);
    cb(right_);
    cb(body_);
}

void ForOfStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ForOfStatement"}, {"await", isAwait_}, {"left", left_}, {"right", right_}, {"body", body_}});
}

void ForOfStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::LocalRegScope regScope(pg, scope_);

    if (scope_->NeedLexEnv()) {
        pg->NewLexEnv(this, scope_->LexicalSlots());
    }

    right_->Compile(pg); // if poplexenv next, acc will not be affected, no need to store the value to a vreg

    if (scope_->NeedLexEnv()) {
        pg->PopLexEnv(this);
    }

    compiler::LabelTarget labelTarget(pg);
    auto iterator_type = isAwait_ ? compiler::IteratorType::ASYNC : compiler::IteratorType::SYNC;
    compiler::Iterator iterator(pg, this, iterator_type);

    pg->SetLabel(this, labelTarget.ContinueTarget());

    iterator.Next();
    iterator.Complete();
    pg->BranchIfTrue(this, labelTarget.BreakTarget());

    compiler::VReg value = pg->AllocReg();
    iterator.Value();
    pg->StoreAccumulator(this, value);

    auto lref = compiler::LReference::CreateLRef(pg, left_, false);
    {
        compiler::IteratorContext forOfCtx(pg, iterator, labelTarget);
        compiler::LoopEnvScope envScope(pg, scope_, {});
        pg->LoadAccumulator(this, value);
        lref.SetValue();

        body_->Compile(pg);
    }

    pg->Branch(this, labelTarget.ContinueTarget());
    pg->SetLabel(this, labelTarget.BreakTarget());
}

checker::Type *ForOfStatement::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ForOfStatement::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto *loopScope = Scope();
    auto loopCtx = binder::LexicalScope<binder::LoopScope>::Enter(binder, loopScope);
    left_ = std::get<ir::AstNode *>(cb(left_));
    right_ = std::get<ir::AstNode *>(cb(right_))->AsExpression();

    body_ = std::get<ir::AstNode *>(cb(body_))->AsStatement();
}

}  // namespace panda::es2panda::ir
