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

#include "spreadElement.h"

#include <ir/astDump.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/objectExpression.h>

namespace panda::es2panda::ir {

ValidationInfo SpreadElement::ValidateExpression()
{
    ValidationInfo info;

    switch (argument_->Type()) {
        case AstNodeType::OBJECT_EXPRESSION: {
            info = argument_->AsObjectExpression()->ValidateExpression();
            break;
        }
        case AstNodeType::ARRAY_EXPRESSION: {
            info = argument_->AsArrayExpression()->ValidateExpression();
            break;
        }
        default: {
            break;
        }
    }

    return info;
}

bool SpreadElement::ConvertibleToRest(bool isDeclaration, bool allowPattern)
{
    bool convResult = true;

    switch (argument_->Type()) {
        case AstNodeType::ARRAY_EXPRESSION: {
            convResult = allowPattern && argument_->AsArrayExpression()->ConvertibleToArrayPattern();
            break;
        }
        case AstNodeType::OBJECT_EXPRESSION: {
            convResult = allowPattern && argument_->AsObjectExpression()->ConvertibleToObjectPattern();
            break;
        }
        case AstNodeType::META_PROPERTY_EXPRESSION:
        case AstNodeType::CHAIN_EXPRESSION:
        case AstNodeType::ASSIGNMENT_EXPRESSION: {
            convResult = false;
            break;
        }
        case AstNodeType::MEMBER_EXPRESSION: {
            convResult = !isDeclaration;
            break;
        }
        default: {
            break;
        }
    }

    SetType(AstNodeType::REST_ELEMENT);
    return convResult;
}

void SpreadElement::SetTsTypeAnnotation(Expression *typeAnnotation)
{
    typeAnnotation_ = typeAnnotation;
}

void SpreadElement::Iterate(const NodeTraverser &cb) const
{
    cb(argument_);

    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void SpreadElement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", (type_ == AstNodeType::SPREAD_ELEMENT) ? "SpreadElement" : "RestElement"},
                 {"argument", argument_},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)}});
}

void SpreadElement::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *SpreadElement::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void SpreadElement::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    argument_ = std::get<ir::AstNode *>(cb(argument_))->AsExpression();
    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
