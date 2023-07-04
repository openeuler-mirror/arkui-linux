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

#include "tsTypePredicate.h"

#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void TSTypePredicate::Iterate(const NodeTraverser &cb) const
{
    cb(parameterName_);
    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void TSTypePredicate::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTypePredicate"},
                 {"parameterName", parameterName_},
                 {"typeAnnotation", AstDumper::Nullable(typeAnnotation_)},
                 {"asserts", asserts_}});
}

void TSTypePredicate::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTypePredicate::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

checker::Type *TSTypePredicate::GetType([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSTypePredicate::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    parameterName_ = std::get<ir::AstNode *>(cb(parameterName_))->AsExpression();

    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
