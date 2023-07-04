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

#include "stringLiteral.h"

#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

#include <utility>

namespace panda::es2panda::ir {

void StringLiteral::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void StringLiteral::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "StringLiteral"}, {"value", str_}});
}

void StringLiteral::Compile(compiler::PandaGen *pg) const
{
    pg->LoadAccumulatorString(this, str_);
}

checker::Type *StringLiteral::Check(checker::Checker *checker) const
{
    auto search = checker->StringLiteralMap().find(str_);
    if (search != checker->StringLiteralMap().end()) {
        return search->second;
    }

    auto *newStrLiteralType = checker->Allocator()->New<checker::StringLiteralType>(str_);
    checker->StringLiteralMap().insert({str_, newStrLiteralType});

    return newStrLiteralType;
}

void StringLiteral::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
