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

#include "tryStatement.h"

#include <compiler/core/pandagen.h>
#include <compiler/core/dynamicContext.h>
#include <compiler/base/catchTable.h>
#include <ir/astDump.h>
#include <ir/base/catchClause.h>
#include <ir/statements/blockStatement.h>

namespace panda::es2panda::ir {

void TryStatement::Iterate(const NodeTraverser &cb) const
{
    cb(block_);

    if (catchClause_) {
        cb(catchClause_);
    }

    if (finalizer_) {
        cb(finalizer_);
    }
}

void TryStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TryStatement"},
                 {"block", block_},
                 {"handler", AstDumper::Nullable(catchClause_)},
                 {"finalizer", AstDumper::Nullable(finalizer_)}});
}

void TryStatement::CompileFinally(compiler::PandaGen *pg, compiler::TryContext *tryCtx,
                                  const compiler::TryLabelSet &labelSet) const
{
    compiler::RegScope rs(pg);
    compiler::VReg exception = pg->AllocReg();
    pg->StoreConst(this, exception, compiler::Constant::JS_HOLE);
    pg->Branch(this, labelSet.CatchEnd());

    pg->SetLabel(this, labelSet.CatchBegin());
    pg->StoreAccumulator(this, exception);

    pg->SetLabel(this, labelSet.CatchEnd());

    compiler::Label *label = pg->AllocLabel();
    pg->LoadAccumulator(this, tryCtx->FinalizerRun());

    pg->BranchIfNotUndefined(this, label);
    pg->StoreAccumulator(this, tryCtx->FinalizerRun());
    tryCtx->EmitFinalizer();
    pg->SetLabel(this, label);

    pg->LoadAccumulator(this, exception);
    pg->EmitRethrow(this);
}

void TryStatement::CompileTryCatchFinally(compiler::PandaGen *pg) const
{
    ASSERT(catchClause_ && finalizer_);

    compiler::TryContext tryCtx(pg, this);
    const auto &labelSet = tryCtx.LabelSet();

    pg->SetLabel(this, labelSet.TryBegin());
    {
        compiler::TryContext innerTryCtx(pg, this, false);
        const auto &innerLabelSet = innerTryCtx.LabelSet();

        pg->SetLabel(this, innerLabelSet.TryBegin());
        block_->Compile(pg);
        pg->SetLabel(this, innerLabelSet.TryEnd());

        pg->Branch(this, innerLabelSet.CatchEnd());

        pg->SetLabel(this, innerLabelSet.CatchBegin());
        catchClause_->Compile(pg);
        pg->SetLabel(this, innerLabelSet.CatchEnd());
    }
    pg->SetLabel(this, labelSet.TryEnd());

    CompileFinally(pg, &tryCtx, labelSet);
}

void TryStatement::CompileTryFinally(compiler::PandaGen *pg) const
{
    ASSERT(!catchClause_ && finalizer_);

    compiler::TryContext tryCtx(pg, this);
    const auto &labelSet = tryCtx.LabelSet();

    pg->SetLabel(this, labelSet.TryBegin());
    {
        compiler::TryContext innerTryCtx(pg, this, false);
        const auto &innerLabelSet = innerTryCtx.LabelSet();

        pg->SetLabel(this, innerLabelSet.TryBegin());
        block_->Compile(pg);
        pg->SetLabel(this, innerLabelSet.TryEnd());

        pg->Branch(this, innerLabelSet.CatchEnd());

        pg->SetLabel(this, innerLabelSet.CatchBegin());
        pg->EmitThrow(this);
        pg->SetLabel(this, innerLabelSet.CatchEnd());
    }
    pg->SetLabel(this, labelSet.TryEnd());

    CompileFinally(pg, &tryCtx, labelSet);
}

void TryStatement::CompileTryCatch(compiler::PandaGen *pg) const
{
    ASSERT(catchClause_ && !finalizer_);

    compiler::TryContext tryCtx(pg, this);
    const auto &labelSet = tryCtx.LabelSet();

    pg->SetLabel(this, labelSet.TryBegin());
    block_->Compile(pg);
    pg->SetLabel(this, labelSet.TryEnd());

    pg->Branch(this, labelSet.CatchEnd());

    pg->SetLabel(this, labelSet.CatchBegin());
    catchClause_->Compile(pg);
    pg->SetLabel(this, labelSet.CatchEnd());
}

void TryStatement::Compile(compiler::PandaGen *pg) const
{
    if (finalizer_) {
        if (catchClause_) {
            CompileTryCatchFinally(pg);
        } else {
            CompileTryFinally(pg);
        }
    } else {
        CompileTryCatch(pg);
    }
}

checker::Type *TryStatement::Check(checker::Checker *checker) const
{
    block_->Check(checker);

    if (catchClause_) {
        catchClause_->Check(checker);
    }

    if (finalizer_) {
        finalizer_->Check(checker);
    }

    return nullptr;
}

void TryStatement::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    block_ = std::get<ir::AstNode *>(cb(block_))->AsBlockStatement();

    if (catchClause_) {
        catchClause_ = std::get<ir::AstNode *>(cb(catchClause_))->AsCatchClause();
    }

    if (finalizer_) {
        finalizer_ = std::get<ir::AstNode *>(cb(finalizer_))->AsBlockStatement();
    }
}

}  // namespace panda::es2panda::ir
