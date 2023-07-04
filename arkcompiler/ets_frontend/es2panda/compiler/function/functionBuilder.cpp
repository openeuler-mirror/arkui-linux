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

#include "functionBuilder.h"

#include <binder/binder.h>
#include <util/helpers.h>
#include <ir/statement.h>
#include <ir/base/scriptFunction.h>
#include <compiler/base/iterators.h>
#include <compiler/core/pandagen.h>

namespace panda::es2panda::compiler {

FunctionBuilder::FunctionBuilder(PandaGen *pg, CatchTable *catchTable)
    : pg_(pg), catchTable_(catchTable), funcObj_(pg_->AllocReg())
{
}

IteratorType FunctionBuilder::GeneratorKind() const
{
    return IteratorType::SYNC;
}

void FunctionBuilder::DirectReturn(const ir::AstNode *node) const
{
    pg_->NotifyConcurrentResult(node);
    pg_->EmitReturn(node);
}

void FunctionBuilder::ImplicitReturn(const ir::AstNode *node) const
{
    const auto *rootNode = pg_->RootNode();

    if (!rootNode->IsScriptFunction() || !rootNode->AsScriptFunction()->IsConstructor()) {
        if (pg_->isDebuggerEvaluateExpressionMode()) {
            pg_->NotifyConcurrentResult(node);
            pg_->EmitReturn(node);
            return;
        }
        pg_->LoadConst(node, Constant::JS_UNDEFINED);
        pg_->NotifyConcurrentResult(node);
        pg_->EmitReturnUndefined(node);
        return;
    }

    pg_->GetThis(rootNode);
    pg_->ThrowIfSuperNotCorrectCall(rootNode, 0);
    pg_->NotifyConcurrentResult(node);
    pg_->EmitReturn(node);
}

void FunctionBuilder::ExplicitReturn(const ir::AstNode *node) const
{
    DirectReturn(node);
}

void FunctionBuilder::AsyncYield(const ir::AstNode *node, VReg value, VReg completionType, VReg completionValue) const
{
    ASSERT(BuilderKind() == BuilderType::ASYNC_GENERATOR);
    RegScope rs(pg_);
    VReg done = pg_->AllocReg();
    // 27.6.3.8.6 Set generator.[[AsyncGeneratorState]] to suspendedYield.
    pg_->GeneratorYield(node, funcObj_);
    /** 27.6.3.8.7 Remove genContext from the execution context stack and restore the execution context that
     *  is at the top of the execution context stack as the running execution context.
     *  27.6.3.8.9 Return ! AsyncGeneratorResolve(generator, value, false).
     */
    pg_->StoreConst(node, done, Constant::JS_FALSE);
    pg_->AsyncGeneratorResolve(node, funcObj_, value, done);

    resumeGenerator(node, completionType, completionValue);
}

void FunctionBuilder::SuspendResumeExecution(const ir::AstNode *node, VReg completionType, VReg completionValue) const
{
    ASSERT(BuilderKind() == BuilderType::ASYNC || BuilderKind() == BuilderType::ASYNC_GENERATOR ||
           BuilderKind() == BuilderType::GENERATOR);

    pg_->SuspendGenerator(node, funcObj_); // iterResult is in acc
    resumeGenerator(node, completionType, completionValue);
}

void FunctionBuilder::resumeGenerator(const ir::AstNode *node, VReg completionType, VReg completionValue) const
{
    ASSERT(BuilderKind() == BuilderType::ASYNC || BuilderKind() == BuilderType::ASYNC_GENERATOR ||
           BuilderKind() == BuilderType::GENERATOR);

    pg_->ResumeGenerator(node, funcObj_);
    pg_->StoreAccumulator(node, completionValue);
    pg_->GetResumeMode(node, funcObj_);
    pg_->StoreAccumulator(node, completionType);
}

VReg FunctionBuilder::FunctionReg(const ir::ScriptFunction *node) const
{
    binder::FunctionScope *scope = node->Scope();
    auto res = scope->Find(binder::Binder::MANDATORY_PARAM_FUNC);
    ASSERT(res.level == 0 && res.variable->IsLocalVariable());
    return res.variable->AsLocalVariable()->Vreg();
}

void FunctionBuilder::Await(const ir::AstNode *node)
{
    if (BuilderKind() == BuilderType::NORMAL) {
        // TODO(frobert): Implement top-level await
        PandaGen::Unimplemented();
    }

    ASSERT(BuilderKind() == BuilderType::ASYNC || BuilderKind() == BuilderType::ASYNC_GENERATOR);

    RegScope rs(pg_);
    VReg completionType = pg_->AllocReg();
    VReg completionValue = pg_->AllocReg();

    pg_->AsyncFunctionAwait(node, funcObj_);
    SuspendResumeExecution(node, completionType, completionValue);

    HandleCompletion(node, completionType, completionValue);
}

void FunctionBuilder::HandleCompletion(const ir::AstNode *node, VReg completionType, VReg completionValue)
{
    if (BuilderKind() == BuilderType::GENERATOR) {
        // .return(value)
        pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::RETURN));

        auto *notRetLabel = pg_->AllocLabel();
        pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, completionType, notRetLabel);
        if (!handleReturn_) {
            handleReturn_ = true;
            pg_->ControlFlowChangeReturn();
            handleReturn_ = false;
        }

        pg_->LoadAccumulator(node, completionValue);
        pg_->DirectReturn(node);

        // .throw(value)
        pg_->SetLabel(node, notRetLabel);
    }

    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::THROW));

    auto *not_throw_label = pg_->AllocLabel();
    pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, completionType, not_throw_label);
    pg_->LoadAccumulator(node, completionValue);
    pg_->EmitThrow(node);

    // .next(value)
    pg_->SetLabel(node, not_throw_label);
    pg_->LoadAccumulator(node, completionValue);
}

void FunctionBuilder::YieldStar(const ir::AstNode *node)
{
    ASSERT(BuilderKind() == BuilderType::GENERATOR || BuilderKind() == BuilderType::ASYNC_GENERATOR);

    RegScope rs(pg_);

    auto *loopStart = pg_->AllocLabel();
    auto *returnCompletion = pg_->AllocLabel();
    auto *throwCompletion = pg_->AllocLabel();
    auto *callMethod = pg_->AllocLabel();
    auto *normalOrThrowCompletion = pg_->AllocLabel();
    auto *iteratorComplete = pg_->AllocLabel();

    // 4. Let iteratorRecord be ? GetIterator(value, generatorKind).
    Iterator iterator(pg_, node, GeneratorKind());

    // 6. Let received be NormalCompletion(undefined).
    VReg receivedValue = iterator.NextResult();
    VReg receivedType = pg_->AllocReg();
    VReg nextMethod = pg_->AllocReg();
    VReg exitReturn = pg_->AllocReg();
    VReg iterValue = pg_->AllocReg();

    pg_->StoreConst(node, receivedValue, Constant::JS_UNDEFINED);
    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::NEXT));
    pg_->StoreAccumulator(node, receivedType);
    pg_->MoveVreg(node, nextMethod, iterator.Method());

    // 7. Repeat
    pg_->SetLabel(node, loopStart);
    pg_->StoreConst(node, exitReturn, Constant::JS_FALSE);

    // a. If received.[[Type]] is normal, then
    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::NEXT));
    pg_->Condition(node, lexer::TokenType::PUNCTUATOR_STRICT_EQUAL, receivedType, throwCompletion);
    pg_->MoveVreg(node, iterator.Method(), nextMethod);
    pg_->Branch(node, callMethod);

    // b. Else if received.[[Type]] is throw, then
    pg_->SetLabel(node, throwCompletion);
    pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::THROW));
    pg_->Condition(node, lexer::TokenType::PUNCTUATOR_STRICT_EQUAL, receivedType, returnCompletion);

    // i. Let throw be ? GetMethod(iterator, "throw").
    iterator.GetMethod("throw");

    // ii. If throw is not undefined, then
    pg_->BranchIfNotUndefined(node, callMethod);

    // iii. Else,
    // 1. NOTE: If iterator does not have a throw method, this throw is going to terminate the yield* loop. But first we
    // need to give iterator a chance to clean up.
    // 2. Let closeCompletion be Completion { [[Type]]: normal, [[Value]]: empty, [[Target]]: empty }.
    // 3. If generatorKind is async, perform ? AsyncIteratorClose(iteratorRecord, closeCompletion).
    // 4. Else, perform ? IteratorClose(iteratorRecord, closeCompletion).
    iterator.Close(false);
    // 5. NOTE: The next step throws a TypeError to indicate that there was a yield* protocol violation: iterator does
    // not have a throw method.
    // 6. Throw a TypeError exception.
    pg_->ThrowThrowNotExist(node);

    // c. Else,
    // i. Assert: received.[[Type]] is return.
    pg_->SetLabel(node, returnCompletion);
    pg_->StoreConst(node, exitReturn, Constant::JS_TRUE);
    // ii. Let return be ? GetMethod(iterator, "return").
    iterator.GetMethod("return");

    // iii. If return is undefined, then
    pg_->BranchIfNotUndefined(node, callMethod);

    // 1. If generatorKind is async, set received.[[Value]] to ? Await(received.[[Value]]).
    pg_->ControlFlowChangeReturn();
    pg_->LoadAccumulator(node, receivedValue);

    if (GeneratorKind() == IteratorType::ASYNC) {
        Await(node);
    }

    // 2. Return Completion(received).
    pg_->DirectReturn(node);

    pg_->SetLabel(node, callMethod);
    // i. Let innerResult be ? Call(iteratorRecord.[[NextMethod]], iteratorRecord.[[Iterator]], « received.[[Value]] »).
    // 1. Let innerResult be ? Call(throw, iterator, « received.[[Value]] »).
    // iv. Let innerReturnResult be ? Call(return, iterator, « received.[[Value]] »).
    iterator.CallMethodWithValue();

    // ii. ii. If generatorKind is async, set innerResult to ? Await(innerResult).
    // 2. If generatorKind is async, set innerResult to ? Await(innerResult).
    // v. If generatorKind is async, set innerReturnResult to ? Await(innerReturnResult).
    if (GeneratorKind() == IteratorType::ASYNC) {
        Await(node);
    }

    pg_->StoreAccumulator(node, receivedValue);

    // ii. If Type(innerResult) is not Object, throw a TypeError exception.
    // 4. If Type(innerResult) is not Object, throw a TypeError exception.
    // vi. If Type(innerReturnResult) is not Object, throw a TypeError exception.
    pg_->ThrowIfNotObject(node, receivedValue);

    // iv. Let done be ? IteratorComplete(innerResult).
    // v. Let done be ? IteratorComplete(innerResult).
    // vii. Let done be ? IteratorComplete(innerReturnResult).
    iterator.Complete();
    pg_->BranchIfTrue(node, iteratorComplete);

    pg_->LoadAccumulator(node, receivedValue);
    // vi. If generatorKind is async, set received to AsyncGeneratorYield(? IteratorValue(innerResult)).
    // 7. If generatorKind is async, set received to AsyncGeneratorYield(? IteratorValue(innerResult)).
    // ix. If generatorKind is async, set received to AsyncGeneratorYield(? IteratorValue(innerReturnResult)).
    if (GeneratorKind() == IteratorType::ASYNC) {
        iterator.Value();
        // 27.6.3.8 AsyncGeneratorYield
        // 5. Set value to ? Await(value).
        Await(node);
        // 6. Set generator.[[AsyncGeneratorState]] to suspendedYield.
        pg_->StoreAccumulator(node, iterValue);
        AsyncYield(node, iterValue, receivedType, receivedValue);

        // a. If resumptionValue.[[Type]] is not return
        pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::RETURN));
        pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, receivedType, loopStart);

        // b. Let awaited be Await(resumptionValue.[[Value]]).
        pg_->LoadAccumulator(node, receivedValue);
        pg_->AsyncFunctionAwait(node, funcObj_);
        SuspendResumeExecution(node, receivedType, receivedValue);

        // c. If awaited.[[Type]] is throw, return Completion(awaited).
        pg_->LoadAccumulatorInt(node, static_cast<int32_t>(ResumeMode::THROW));
        // d. Assert: awaited.[[Type]] is normal.
        // e. Return Completion { [[Type]]: return, [[Value]]: awaited.[[Value]], [[Target]]: empty }.
        pg_->Condition(node, lexer::TokenType::PUNCTUATOR_EQUAL, receivedType, returnCompletion);
    } else {
        // vii. Else, set received to GeneratorYield(innerResult).
        // 8. Else, set received to GeneratorYield(innerResult).
        // x. Else, set received to GeneratorYield(innerReturnResult).
        SuspendResumeExecution(node, receivedType, receivedValue);
    }

    pg_->Branch(node, loopStart);

    // v. If done is true, then
    // 6. If done is true, then
    // viii. If done is true, then
    pg_->SetLabel(node, iteratorComplete);

    pg_->LoadAccumulator(node, exitReturn);
    pg_->BranchIfFalse(node, normalOrThrowCompletion);

    // 1. Let value be ? IteratorValue(innerReturnResult).
    iterator.Value();

    if (pg_->CheckControlFlowChange()) {
        pg_->StoreAccumulator(node, receivedValue);
        pg_->ControlFlowChangeReturn();
        pg_->LoadAccumulator(node, receivedValue);
    }

    // 2. Return Completion { [[Type]]: return, [[Value]]: value, [[Target]]: empty }.
    pg_->DirectReturn(node);

    pg_->SetLabel(node, normalOrThrowCompletion);
    // 1. Return ? IteratorValue(innerResult).
    // a. Return ? IteratorValue(innerResult).
    iterator.Value();
}

}  // namespace panda::es2panda::compiler
