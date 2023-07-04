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

#include "callExpression.h"

#include <util/helpers.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <typescript/types/objectType.h>
#include <typescript/types/signature.h>
#include <typescript/types/type.h>
#include <ir/astDump.h>
#include <ir/expressions/chainExpression.h>
#include <ir/expressions/memberExpression.h>
#include <ir/ts/tsTypeParameterInstantiation.h>

namespace panda::es2panda::ir {

void CallExpression::Iterate(const NodeTraverser &cb) const
{
    cb(callee_);

    if (typeParams_) {
        cb(typeParams_);
    }

    for (auto *it : arguments_) {
        cb(it);
    }
}

void CallExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "CallExpression"},
                 {"callee", callee_},
                 {"arguments", arguments_},
                 {"optional", optional_},
                 {"typeParameters", AstDumper::Optional(typeParams_)}});
}

compiler::VReg CallExpression::CreateSpreadArguments(compiler::PandaGen *pg) const
{
    compiler::VReg argsObj = pg->AllocReg();
    pg->CreateArray(this, arguments_, argsObj);

    return argsObj;
}

void CallExpression::Compile(compiler::PandaGen *pg) const
{
    if (callee_->IsCallExpression() || callee_->IsNewExpression()) {
        if (pg->TryCompileFunctionCallOrNewExpression(callee_)) {
            return;
        }
    }

    compiler::RegScope rs(pg);
    bool containsSpread = util::Helpers::ContainSpreadElement(arguments_);

    if (callee_->IsSuperExpression()) {
        if (containsSpread) {
            compiler::RegScope paramScope(pg);
            compiler::VReg argsObj = CreateSpreadArguments(pg);

            pg->GetFunctionObject(this);
            pg->SuperCallSpread(this, argsObj);
        } else {
            compiler::RegScope paramScope(pg);
            compiler::VReg argStart {};

            if (arguments_.empty()) {
                argStart = pg->AllocReg();
                pg->LoadConst(this, compiler::Constant::JS_UNDEFINED);
                pg->StoreAccumulator(this, argStart);
            } else {
                argStart = pg->NextReg();
            }

            for (const auto *it : arguments_) {
                compiler::VReg arg = pg->AllocReg();
                it->Compile(pg);
                pg->StoreAccumulator(it, arg);
            }

            pg->SuperCall(this, argStart, arguments_.size());
        }

        compiler::VReg newThis = pg->AllocReg();
        pg->StoreAccumulator(this, newThis);

        pg->GetThis(this);
        pg->ThrowIfSuperNotCorrectCall(this, 1);

        pg->LoadAccumulator(this, newThis);
        pg->SetThis(this);
        return;
    }

    compiler::VReg callee = pg->AllocReg();
    bool hasThis = false;
    compiler::VReg thisReg {};

    if (callee_->IsMemberExpression()) {
        hasThis = true;
        thisReg = pg->AllocReg();

        compiler::RegScope mrs(pg);
        callee_->AsMemberExpression()->Compile(pg, thisReg);
    } else if (callee_->IsChainExpression()) {
        hasThis = true;
        callee_->AsChainExpression()->Compile(pg);
    } else {
        callee_->Compile(pg);
    }

    pg->StoreAccumulator(this, callee);
    pg->GetOptionalChain()->CheckNullish(optional_, callee);

    if (containsSpread) {
        if (!hasThis) {
            thisReg = pg->AllocReg();
            pg->LoadConst(this, compiler::Constant::JS_UNDEFINED);
            pg->StoreAccumulator(this, thisReg);
        }

        compiler::VReg argsObj = CreateSpreadArguments(pg);
        pg->CallSpread(this, callee, thisReg, argsObj);
        return;
    }

    for (const auto *it : arguments_) {
        it->Compile(pg);
        compiler::VReg arg = pg->AllocReg();
        pg->StoreAccumulator(it, arg);
    }

    if (hasThis) {
        pg->CallThis(this, callee, static_cast<int64_t>(arguments_.size() + 1));
        return;
    }

    pg->Call(this, callee, arguments_.size());
}

checker::Type *CallExpression::Check(checker::Checker *checker) const
{
    checker::Type *calleeType = callee_->Check(checker);

    // TODO(aszilagyi): handle optional chain
    if (calleeType->IsObjectType()) {
        checker::ObjectType *calleeObj = calleeType->AsObjectType();
        return checker->resolveCallOrNewExpression(calleeObj->CallSignatures(), arguments_, Start());
    }

    checker->ThrowTypeError("This expression is not callable.", Start());
    return nullptr;
}

void CallExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    callee_ = std::get<ir::AstNode *>(cb(callee_))->AsExpression();

    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterInstantiation();
    }

    for (auto iter = arguments_.begin(); iter != arguments_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
