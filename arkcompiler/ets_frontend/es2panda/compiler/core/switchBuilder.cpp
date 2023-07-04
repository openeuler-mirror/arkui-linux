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

#include "switchBuilder.h"

#include <ir/expression.h>
#include <ir/statements/switchStatement.h>
#include <ir/statements/switchCaseStatement.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/labelTarget.h>
#include <typescript/checker.h>

namespace panda::es2panda::compiler {
// SwitchBuilder

SwitchBuilder::SwitchBuilder(PandaGen *pg, const ir::SwitchStatement *stmt)
    : pg_(pg), end_(pg->AllocLabel()), labelCtx_(pg, LabelTarget(end_, LabelTarget::BREAK_LABEL)), stmt_(stmt)
{
    for (size_t i = 0; i < stmt_->Cases().size(); i++) {
        caseLabels_.push_back(pg_->AllocLabel());
    }
}

SwitchBuilder::~SwitchBuilder()
{
    pg_->SetLabel(stmt_, end_);
}

void SwitchBuilder::SetCaseTarget(uint32_t index)
{
    pg_->SetLabel(stmt_->Cases()[index], caseLabels_[index]);
}

void SwitchBuilder::CompileTagOfSwitch(VReg tag)
{
    stmt_->Discriminant()->Compile(pg_);
    pg_->StoreAccumulator(stmt_->Discriminant(), tag);
}

void SwitchBuilder::CompileCaseStatements(uint32_t index)
{
    for (const auto *stmt : stmt_->Cases()[index]->Consequent()) {
        stmt->Compile(pg_);
    }
}

void SwitchBuilder::JumpIfCase(VReg tag, uint32_t index)
{
    const ir::SwitchCaseStatement *caseTarget = stmt_->Cases()[index];
    caseTarget->Test()->Compile(pg_);
    pg_->Condition(caseTarget, lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL, tag, caseLabels_[index]);
}

void SwitchBuilder::JumpToDefault(uint32_t defaultIndex)
{
    const ir::SwitchCaseStatement *defaultTarget = stmt_->Cases()[defaultIndex];
    pg_->Branch(defaultTarget, caseLabels_[defaultIndex]);
}

void SwitchBuilder::Break()
{
    pg_->Branch(stmt_, end_);
}
}  // namespace panda::es2panda::compiler
