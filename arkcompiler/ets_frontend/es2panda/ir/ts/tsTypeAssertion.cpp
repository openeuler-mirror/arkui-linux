/**
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

#include "tsTypeAssertion.h"

#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSTypeAssertion::Iterate(const NodeTraverser &cb) const
{
    cb(typeAnnotation_);
    cb(expression_);
}

void TSTypeAssertion::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTypeAssertion"}, {"typeAnnotation", typeAnnotation_}, {"expression", expression_}});
}

void TSTypeAssertion::Compile(compiler::PandaGen *pg) const
{
    expression_->Compile(pg);
}

checker::Type *TSTypeAssertion::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSTypeAssertion::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    expression_ = std::get<ir::AstNode *>(cb(expression_))->AsExpression();
}

}  // namespace panda::es2panda::ir
