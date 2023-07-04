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

#include "property.h"

#include <ir/astDump.h>
#include <ir/expression.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/validationInfo.h>

namespace panda::es2panda::ir {

bool Property::ConventibleToPatternProperty()
{
    // Object pattern can't contain getter or setter
    if (IsAccessor() || isMethod_) {
        return false;
    }

    switch (value_->Type()) {
        case AstNodeType::OBJECT_EXPRESSION: {
            return value_->AsObjectExpression()->ConvertibleToObjectPattern();
        }
        case AstNodeType::ARRAY_EXPRESSION: {
            return value_->AsArrayExpression()->ConvertibleToArrayPattern();
        }
        case AstNodeType::ASSIGNMENT_EXPRESSION: {
            return value_->AsAssignmentExpression()->ConvertibleToAssignmentPattern();
        }
        case AstNodeType::META_PROPERTY_EXPRESSION: {
            return false;
        }
        default: {
            break;
        }
    }

    return true;
}

ValidationInfo Property::ValidateExpression()
{
    ValidationInfo info;

    if (!IsComputed() && !IsMethod() && !IsAccessor() && !IsShorthand()) {
        bool currentIsProto = false;

        if (key_->IsIdentifier()) {
            currentIsProto = key_->AsIdentifier()->Name().Is("__proto__");
        } else if (key_->IsStringLiteral()) {
            currentIsProto = key_->AsStringLiteral()->Str().Is("__proto__");
        }

        if (currentIsProto) {
            kind_ = PropertyKind::PROTO;
        }
    }

    if (value_) {
        if (value_->IsAssignmentPattern()) {
            return {"Invalid shorthand property initializer.", value_->Start()};
        }

        if (value_->IsObjectExpression()) {
            info = value_->AsObjectExpression()->ValidateExpression();
        } else if (value_->IsArrayExpression()) {
            info = value_->AsArrayExpression()->ValidateExpression();
        }
    }

    return info;
}

void Property::Iterate(const NodeTraverser &cb) const
{
    cb(key_);
    cb(value_);
}

void Property::Dump(ir::AstDumper *dumper) const
{
    const char *kind = nullptr;

    switch (kind_) {
        case PropertyKind::INIT: {
            kind = "init";
            break;
        }
        case PropertyKind::PROTO: {
            kind = "proto";
            break;
        }
        case PropertyKind::GET: {
            kind = "get";
            break;
        }
        case PropertyKind::SET: {
            kind = "set";
            break;
        }
        default: {
            UNREACHABLE();
        }
    }

    dumper->Add({{"type", "Property"},
                 {"method", isMethod_},
                 {"shorthand", isShorthand_},
                 {"computed", isComputed_},
                 {"key", key_},
                 {"value", value_},
                 {"kind", kind}});
}

void Property::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *Property::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void Property::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    key_ = std::get<ir::AstNode *>(cb(key_))->AsExpression();
    value_ = std::get<ir::AstNode *>(cb(value_))->AsExpression();
}

}  // namespace panda::es2panda::ir
