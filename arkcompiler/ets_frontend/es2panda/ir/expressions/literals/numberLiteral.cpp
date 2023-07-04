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

#include "numberLiteral.h"

#include <util/helpers.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void NumberLiteral::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void NumberLiteral::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "NumberLiteral"}, {"value", number_}});
}

bool NumberLiteral::IsInteger() const
{
    return util::Helpers::IsInteger<int32_t>(number_);
}

void NumberLiteral::Compile(compiler::PandaGen *pg) const
{
    if (std::isnan(number_)) {
        pg->LoadConst(this, compiler::Constant::JS_NAN);
    } else if (!std::isfinite(number_)) {
        pg->LoadConst(this, compiler::Constant::JS_INFINITY);
    } else if (util::Helpers::IsInteger<int32_t>(number_)) {
        pg->LoadAccumulatorInt(this, static_cast<int32_t>(number_));
    } else {
        pg->LoadAccumulatorFloat(this, number_);
    }
}

checker::Type *NumberLiteral::Check(checker::Checker *checker) const
{
    auto search = checker->NumberLiteralMap().find(number_);
    if (search != checker->NumberLiteralMap().end()) {
        return search->second;
    }

    auto *newNumLiteralType = checker->Allocator()->New<checker::NumberLiteralType>(number_);
    checker->NumberLiteralMap().insert({number_, newNumLiteralType});
    return newNumLiteralType;
}

void NumberLiteral::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
