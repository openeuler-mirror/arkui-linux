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

#include "tsTypeOperator.h"

#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSTypeOperator::Iterate(const NodeTraverser &cb) const
{
    cb(type_);
}

void TSTypeOperator::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({
        {"type", "TSTypeOperator"},
        {"operator", AstDumper::TypeOperatorToString(operatorType_)},
        {"typeAnnotation", type_},
    });
}

void TSTypeOperator::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTypeOperator::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

checker::Type *TSTypeOperator::GetType([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSTypeOperator::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    type_ = std::get<ir::AstNode *>(cb(type_))->AsExpression();
}

}  // namespace panda::es2panda::ir
