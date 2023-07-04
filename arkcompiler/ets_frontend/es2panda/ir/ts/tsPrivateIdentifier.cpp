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

#include "tsPrivateIdentifier.h"

#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSPrivateIdentifier::Iterate(const NodeTraverser &cb) const
{
    cb(key_);

    if (value_) {
        cb(value_);
    }

    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void TSPrivateIdentifier::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSPrivateIdentifier"},
                 {"key", key_},
                 {"value", AstDumper::Optional(value_)},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)}});
}

void TSPrivateIdentifier::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSPrivateIdentifier::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSPrivateIdentifier::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    key_ = std::get<ir::AstNode *>(cb(key_))->AsExpression();

    if (value_) {
        value_ = std::get<ir::AstNode *>(cb(value_))->AsExpression();
    }

    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
