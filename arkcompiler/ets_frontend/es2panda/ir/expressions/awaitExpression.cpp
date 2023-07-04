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

#include "awaitExpression.h"

#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void AwaitExpression::Iterate(const NodeTraverser &cb) const
{
    if (argument_) {
        cb(argument_);
    }
}

void AwaitExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "AwaitExpression"}, {"argument", AstDumper::Nullable(argument_)}});
}

void AwaitExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);

    if (argument_) {
        argument_->Compile(pg);
    } else {
        pg->LoadConst(this, compiler::Constant::JS_UNDEFINED);
    }

    pg->EmitAwait(this);
}

checker::Type *AwaitExpression::Check(checker::Checker *checker) const
{
    // TODO(aszilagyi)
    return checker->GlobalAnyType();
}

void AwaitExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (argument_) {
        argument_ = std::get<ir::AstNode *>(cb(argument_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
