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

#include "asyncGeneratorFunctionBuilder.h"

#include <compiler/base/catchTable.h>
#include <compiler/core/pandagen.h>
#include <ir/base/scriptFunction.h>

namespace panda::es2panda::compiler {
void AsyncGeneratorFunctionBuilder::Prepare(const ir::ScriptFunction *node)
{
    RegScope rs(pg_);
    VReg callee = FunctionReg(node);
    VReg completionType = pg_->AllocReg();
    VReg completionValue = pg_->AllocReg();

    pg_->CreateAsyncGeneratorObj(node, callee);
    pg_->StoreAccumulator(node, funcObj_);

    pg_->SetLabel(node, catchTable_->LabelSet().TryBegin());

    pg_->LoadConst(node, Constant::JS_UNDEFINED);
    SuspendResumeExecution(node, completionType, completionValue);
}

void AsyncGeneratorFunctionBuilder::CleanUp(const ir::ScriptFunction *node) const
{
    const auto &labelSet = catchTable_->LabelSet();

    RegScope rs(pg_);
    VReg retVal = pg_->AllocReg();

    pg_->SetLabel(node, labelSet.TryEnd());
    pg_->SetLabel(node, labelSet.CatchBegin());
    pg_->StoreAccumulator(node, retVal);
    pg_->GeneratorComplete(node, funcObj_);
    pg_->LoadAccumulator(node, retVal);
    pg_->AsyncGeneratorReject(node, funcObj_);
    pg_->EmitReturn(node);
    pg_->SetLabel(node, labelSet.CatchEnd());
}

void AsyncGeneratorFunctionBuilder::DirectReturn(const ir::AstNode *node) const
{
    RegScope rs(pg_);
    VReg retVal = pg_->AllocReg();
    VReg canSuspend = pg_->AllocReg();

    pg_->StoreAccumulator(node, retVal);
    pg_->StoreConst(node, canSuspend, Constant::JS_TRUE);

    pg_->GeneratorComplete(node, funcObj_);
    pg_->AsyncGeneratorResolve(node, funcObj_, retVal, canSuspend);
    pg_->EmitReturn(node);
}

void AsyncGeneratorFunctionBuilder::ImplicitReturn(const ir::AstNode *node) const
{
    pg_->LoadConst(node, Constant::JS_UNDEFINED);
    DirectReturn(node);
}

void AsyncGeneratorFunctionBuilder::ExplicitReturn(const ir::AstNode *node) const
{
    RegScope rs(pg_);
    VReg resumeType = pg_->AllocReg();
    VReg resumeValue = pg_->AllocReg();
    VReg canSuspend = pg_->AllocReg();

    pg_->StoreAccumulator(node, resumeValue);
    pg_->GeneratorComplete(node, funcObj_);
    pg_->LoadAccumulator(node, resumeValue);
    pg_->AsyncFunctionAwait(node, funcObj_);
    SuspendResumeExecution(node, resumeType, resumeValue);
    pg_->StoreConst(node, canSuspend, Constant::JS_TRUE);
    pg_->AsyncGeneratorResolve(node, funcObj_, resumeValue, canSuspend);
    pg_->EmitReturn(node);
}

void AsyncGeneratorFunctionBuilder::Yield(const ir::AstNode *node)
{
    RegScope rs(pg_);
    VReg value = pg_->AllocReg();
    VReg resumeType = pg_->AllocReg();
    VReg resumeValue = pg_->AllocReg();
    auto *notReturn = pg_->AllocLabel();
    auto *normalCompletion = pg_->AllocLabel();
    auto *notThrowCompletion = pg_->AllocLabel();

    // 27.6.3.8.5 Set value to ? Await(value).
    Await(node);
    pg_->StoreAccumulator(node, value);

    AsyncYield(node, value, resumeType, resumeValue);

    // 27.6.3.8.8.a If resumptionValue.[[Type]] is not return
    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::RETURN));
    pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, resumeType, notReturn);

    // 27.6.3.8.8.b Let awaited be Await(resumptionValue.[[Value]]).
    pg_->LoadAccumulator(node, resumeValue);
    pg_->AsyncFunctionAwait(node, funcObj_);
    SuspendResumeExecution(node, resumeType, resumeValue);

    // 27.6.3.8.8.c. If awaited.[[Type]] is throw, return Completion(awaited).
    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::THROW));
    pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, resumeType, normalCompletion);
    pg_->LoadAccumulator(node, resumeValue);
    pg_->EmitThrow(node);

    pg_->SetLabel(node, normalCompletion);
    // 27.6.3.8.8.d. Assert: awaited.[[Type]] is normal.
    // 27.6.3.8.8.e. Return Completion { [[Type]]: return, [[Value]]: awaited.[[Value]], [[Target]]: empty }
    pg_->ControlFlowChangeBreak();
    pg_->LoadAccumulator(node, resumeValue);
    DirectReturn(node);

    pg_->SetLabel(node, notReturn);
    // 27.6.3.8.8.a return Completion(resumptionValue)
    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::THROW));
    pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, resumeType, notThrowCompletion);
    pg_->LoadAccumulator(node, resumeValue);
    pg_->EmitThrow(node);
    pg_->SetLabel(node, notThrowCompletion);
    pg_->LoadAccumulator(node, resumeValue);
}

IteratorType AsyncGeneratorFunctionBuilder::GeneratorKind() const
{
    return IteratorType::ASYNC;
}
}  // namespace panda::es2panda::compiler
