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

#include "tsPropertySignature.h"

#include <typescript/checker.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>
#include <binder/scope.h>

namespace panda::es2panda::ir {

void TSPropertySignature::Iterate(const NodeTraverser &cb) const
{
    cb(key_);

    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void TSPropertySignature::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSPropertySignature"},
                 {"computed", computed_},
                 {"optional", optional_},
                 {"readonly", readonly_},
                 {"key", key_},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)}});
}

void TSPropertySignature::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSPropertySignature::Check(checker::Checker *checker) const
{
    if (typeAnnotation_) {
        typeAnnotation_->Check(checker);
    }

    if (computed_) {
        checker->CheckComputedPropertyName(key_);
    }

    if (typeAnnotation_) {
        Variable()->SetTsType(typeAnnotation_->AsTypeNode()->GetType(checker));
        return nullptr;
    }

    checker->ThrowTypeError("Property implicitly has an 'any' type.", Start());
    return nullptr;
}

void TSPropertySignature::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    key_ = std::get<ir::AstNode *>(cb(key_))->AsExpression();

    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
