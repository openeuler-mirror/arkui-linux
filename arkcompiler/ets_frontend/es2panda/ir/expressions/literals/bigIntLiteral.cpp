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

#include "bigIntLiteral.h"

#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void BigIntLiteral::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void BigIntLiteral::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "BigIntLiteral"}, {"value", src_}});
}

void BigIntLiteral::Compile(compiler::PandaGen *pg) const
{
    util::StringView bigIntValue = src_.Substr(0, src_.Length()-1);
    pg->LoadAccumulatorBigInt(this, bigIntValue);
}

checker::Type *BigIntLiteral::Check(checker::Checker *checker) const
{
    auto search = checker->BigintLiteralMap().find(src_);
    if (search != checker->BigintLiteralMap().end()) {
        return search->second;
    }

    auto *newBigintLiteralType = checker->Allocator()->New<checker::BigintLiteralType>(src_, false);
    checker->BigintLiteralMap().insert({src_, newBigintLiteralType});
    return newBigintLiteralType;
}

void BigIntLiteral::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
