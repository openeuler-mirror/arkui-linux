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

#include "dynamicContext.h"

#include <compiler/core/pandagen.h>
#include <compiler/base/catchTable.h>
#include <ir/expressions/identifier.h>
#include <ir/statements/tryStatement.h>
#include <ir/statements/blockStatement.h>
#include <ir/statements/labelledStatement.h>

namespace panda::es2panda::compiler {
DynamicContext::DynamicContext(PandaGen *pg, LabelTarget target) : pg_(pg), target_(target), prev_(pg_->dynamicContext_)
{
    pg_->dynamicContext_ = this;
}

DynamicContext::~DynamicContext()
{
    pg_->dynamicContext_ = prev_;
}

LabelContext::LabelContext(PandaGen *pg, const ir::LabelledStatement *labelledStmt)
    : DynamicContext(pg, LabelTarget(labelledStmt->Ident()->Name())), labelledStmt_(labelledStmt)
{
    if (!labelledStmt->Body()->IsBlockStatement() && !labelledStmt->Body()->IsIfStatement()) {
        return;
    }

    label_ = pg->AllocLabel();
    target_.SetBreakTarget(label_);
}

LabelContext::~LabelContext()
{
    if (!label_) {
        return;
    }

    pg_->SetLabel(labelledStmt_, label_);
}

LexEnvContext::LexEnvContext(LoopEnvScope *envScope, PandaGen *pg, LabelTarget target)
    : DynamicContext(pg, target), envScope_(envScope)
{
    if (!envScope_->HasEnv()) {
        return;
    }

    catchTable_ = pg_->CreateCatchTable();
    const auto &labelSet = catchTable_->LabelSet();
    const auto *node = envScope_->Scope()->Node();

    pg_->SetLabel(node, labelSet.TryBegin());
}

LexEnvContext::~LexEnvContext()
{
    if (!envScope_->HasEnv()) {
        return;
    }

    const auto &labelSet = catchTable_->LabelSet();
    const auto *node = envScope_->Scope()->Node();

    pg_->SetLabel(node, labelSet.TryEnd());
    pg_->Branch(node, labelSet.CatchEnd());

    pg_->SetLabel(node, labelSet.CatchBegin());
    pg_->PopLexEnv(node);
    pg_->EmitThrow(node);
    pg_->SetLabel(node, labelSet.CatchEnd());
    pg_->PopLexEnv(node);
}

bool LexEnvContext::HasTryCatch() const
{
    return envScope_->HasEnv();
}

void LexEnvContext::AbortContext([[maybe_unused]] ControlFlowChange cfc,
                                 [[maybe_unused]] const util::StringView &targetLabel)
{
    if (!envScope_->HasEnv()) {
        return;
    }

    const auto *node = envScope_->Scope()->Node();
    if (node->IsForUpdateStatement()) {
        return;
    }

    pg_->PopLexEnv(node);
}

IteratorContext::IteratorContext(PandaGen *pg, const Iterator &iterator, LabelTarget target)
    : DynamicContext(pg, target), iterator_(iterator), catchTable_(pg->CreateCatchTable())
{
    const auto &labelSet = catchTable_->LabelSet();
    pg_->SetLabel(iterator_.Node(), labelSet.TryBegin());
}

IteratorContext::~IteratorContext()
{
    const auto &labelSet = catchTable_->LabelSet();
    const auto *node = iterator_.Node();

    pg_->SetLabel(node, labelSet.TryEnd());
    pg_->Branch(node, labelSet.CatchEnd());

    pg_->SetLabel(node, labelSet.CatchBegin());
    iterator_.Close(true);
    pg_->SetLabel(node, labelSet.CatchEnd());
}

void IteratorContext::AbortContext([[maybe_unused]] ControlFlowChange cfc,
                                   [[maybe_unused]] const util::StringView &targetLabel)
{
    if (cfc == ControlFlowChange::CONTINUE && target_.ContinueLabel() == targetLabel) {
        return;
    }

    iterator_.Close(false);
}

DestructuringIteratorContext::DestructuringIteratorContext(PandaGen *pg, const DestructuringIterator &iterator)
    : DynamicContext(pg, {}), iterator_(iterator), catchTable_(pg->CreateCatchTable())
{
    const auto &labelSet = catchTable_->LabelSet();
    pg_->SetLabel(iterator_.Node(), labelSet.TryBegin());
}

DestructuringIteratorContext::~DestructuringIteratorContext()
{
    const auto &labelSet = catchTable_->LabelSet();
    const auto *node = iterator_.Node();

    pg_->SetLabel(node, labelSet.TryEnd());

    // Normal completion
    pg_->LoadAccumulator(node, iterator_.Done());
    pg_->BranchIfTrue(node, labelSet.CatchEnd());
    iterator_.Close(false);

    pg_->Branch(node, labelSet.CatchEnd());

    Label *end = pg_->AllocLabel();
    pg_->SetLabel(node, labelSet.CatchBegin());
    pg_->StoreAccumulator(node, iterator_.Result());
    pg_->LoadAccumulator(node, iterator_.Done());

    pg_->BranchIfTrue(node, end);
    pg_->LoadAccumulator(node, iterator_.Result());
    iterator_.Close(true);
    pg_->SetLabel(node, end);
    pg_->LoadAccumulator(node, iterator_.Result());
    pg_->EmitThrow(node);
    pg_->SetLabel(node, labelSet.CatchEnd());
}

void DestructuringIteratorContext::AbortContext(ControlFlowChange cfc, const util::StringView &targetLabel)
{
    if (cfc == ControlFlowChange::CONTINUE && target_.ContinueLabel() == targetLabel) {
        return;
    }

    iterator_.Close(false);
}

void TryContext::InitFinalizer()
{
    ASSERT(tryStmt_);

    if (!hasFinalizer_ || !tryStmt_->FinallyBlock()) {
        return;
    }

    finalizerRun_ = pg_->AllocReg();
    pg_->StoreConst(tryStmt_, finalizerRun_, Constant::JS_UNDEFINED);
}

void TryContext::InitCatchTable()
{
    catchTable_ = pg_->CreateCatchTable();
}

const TryLabelSet &TryContext::LabelSet() const
{
    return catchTable_->LabelSet();
}

bool TryContext::HasFinalizer() const
{
    return hasFinalizer_;
}

void TryContext::EmitFinalizer()
{
    if (!hasFinalizer_ || inFinalizer_ || !tryStmt_->FinallyBlock()) {
        return;
    }

    inFinalizer_ = true;
    tryStmt_->FinallyBlock()->Compile(pg_);
    inFinalizer_ = false;
}

void TryContext::AbortContext([[maybe_unused]] ControlFlowChange cfc,
                              [[maybe_unused]] const util::StringView &targetLabel)
{
    EmitFinalizer();
}
}  // namespace panda::es2panda::compiler
