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

#include "newExpression.h"

#include <util/helpers.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/ts/tsTypeParameterInstantiation.h>

namespace panda::es2panda::ir {

void NewExpression::Iterate(const NodeTraverser &cb) const
{
    cb(callee_);

    if (typeParams_) {
        cb(typeParams_);
    }

    for (auto *it : arguments_) {
        cb(it);
    }
}

void NewExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "NewExpression"}, {"callee", callee_}, {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"arguments", arguments_}});
}

void NewExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::VReg ctor = pg->AllocReg();

    callee_->Compile(pg);
    pg->StoreAccumulator(this, ctor);

    if (!util::Helpers::ContainSpreadElement(arguments_)) {
        for (const auto *it : arguments_) {
            compiler::VReg arg = pg->AllocReg();
            it->Compile(pg);
            pg->StoreAccumulator(this, arg);
        }

        pg->NewObject(this, ctor, arguments_.size() + 1);
    } else {
        compiler::VReg argsObj = pg->AllocReg();

        pg->CreateArray(this, arguments_, argsObj);
        pg->NewObjSpread(this, ctor);
    }
}

checker::Type *NewExpression::Check(checker::Checker *checker) const
{
    checker::Type *calleeType = callee_->Check(checker);

    // TODO(aszilagyi): handle optional chain
    if (calleeType->IsObjectType()) {
        checker::ObjectType *calleeObj = calleeType->AsObjectType();
        return checker->resolveCallOrNewExpression(calleeObj->ConstructSignatures(), arguments_, Start());
    }

    checker->ThrowTypeError("This expression is not callable.", Start());
    return nullptr;
}

void NewExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    callee_ = std::get<ir::AstNode *>(cb(callee_))->AsExpression();

    for (auto iter = arguments_.begin(); iter != arguments_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
