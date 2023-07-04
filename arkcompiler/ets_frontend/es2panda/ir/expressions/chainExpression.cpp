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

#include "chainExpression.h"

#include <compiler/base/optionalChain.h>
#include <compiler/core/pandagen.h>
#include <ir/astDump.h>
#include <ir/expressions/callExpression.h>
#include <ir/expressions/memberExpression.h>

namespace panda::es2panda::ir {

void ChainExpression::Iterate(const NodeTraverser &cb) const
{
    cb(expression_);
}

void ChainExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ChainExpression"}, {"expression", expression_}});
}

void ChainExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::OptionalChain chain(pg, this);

    if (expression_->IsMemberExpression()) {
        expression_->AsMemberExpression()->Compile(pg);
    } else {
        assert(expression_->IsCallExpression());
        expression_->AsCallExpression()->Compile(pg);
    }
}

checker::Type *ChainExpression::Check(checker::Checker *checker) const
{
    return expression_->Check(checker);
}

void ChainExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    expression_ = std::get<ir::AstNode *>(cb(expression_))->AsExpression();
}

}  // namespace panda::es2panda::ir
