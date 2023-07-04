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

#include "assignmentExpression.h"

#include <compiler/base/lreference.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <typescript/core/destructuringContext.h>
#include <ir/astDump.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

bool AssignmentExpression::ConvertibleToAssignmentPattern(bool mustBePattern)
{
    bool convResult = true;

    switch (left_->Type()) {
        case AstNodeType::ARRAY_EXPRESSION: {
            convResult = left_->AsArrayExpression()->ConvertibleToArrayPattern();
            break;
        }
        case AstNodeType::SPREAD_ELEMENT: {
            convResult = mustBePattern && left_->AsSpreadElement()->ConvertibleToRest(false);
            break;
        }
        case AstNodeType::OBJECT_EXPRESSION: {
            convResult = left_->AsObjectExpression()->ConvertibleToObjectPattern();
            break;
        }
        case AstNodeType::ASSIGNMENT_EXPRESSION: {
            convResult = left_->AsAssignmentExpression()->ConvertibleToAssignmentPattern(mustBePattern);
            break;
        }
        case AstNodeType::META_PROPERTY_EXPRESSION:
        case AstNodeType::CHAIN_EXPRESSION: {
            convResult = false;
            break;
        }
        default: {
            break;
        }
    }

    if (mustBePattern) {
        SetType(AstNodeType::ASSIGNMENT_PATTERN);
    }

    if (!right_->IsAssignmentExpression()) {
        return convResult;
    }

    switch (right_->Type()) {
        case AstNodeType::ARRAY_EXPRESSION: {
            convResult = right_->AsArrayExpression()->ConvertibleToArrayPattern();
            break;
        }
        case AstNodeType::CHAIN_EXPRESSION:
        case AstNodeType::SPREAD_ELEMENT: {
            convResult = false;
            break;
        }
        case AstNodeType::OBJECT_EXPRESSION: {
            convResult = right_->AsObjectExpression()->ConvertibleToObjectPattern();
            break;
        }
        case AstNodeType::ASSIGNMENT_EXPRESSION: {
            convResult = right_->AsAssignmentExpression()->ConvertibleToAssignmentPattern(false);
            break;
        }
        default: {
            break;
        }
    }

    return convResult;
}

void AssignmentExpression::Iterate(const NodeTraverser &cb) const
{
    cb(left_);
    cb(right_);
}

void AssignmentExpression::Dump(ir::AstDumper *dumper) const
{
    if (type_ == AstNodeType::ASSIGNMENT_EXPRESSION) {
        dumper->Add({{"type", "AssignmentExpression"}, {"operator", operator_}, {"left", left_}, {"right", right_}});
    } else {
        dumper->Add({{"type", "AssignmentPattern"}, {"left", left_}, {"right", right_}});
    }
}

void AssignmentExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::LReference lref = compiler::LReference::CreateLRef(pg, left_, false);

    if (operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_AND_EQUAL ||
        operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_OR_EQUAL ||
        operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_NULLISH_EQUAL) {
        auto *skipRight = pg->AllocLabel();
        auto *endLabel = pg->AllocLabel();
        compiler::VReg lhsReg = pg->AllocReg();

        lref.GetValue();
        pg->StoreAccumulator(left_, lhsReg);
        if (operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_AND_EQUAL) {
            pg->BranchIfFalse(left_, skipRight);
        } else if (operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_OR_EQUAL) {
            pg->BranchIfTrue(left_, skipRight);
        } else {
            ASSERT(operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_NULLISH_EQUAL);
            auto *nullish = pg->AllocLabel();
            pg->BranchIfStrictNull(left_, nullish);
            pg->LoadAccumulator(left_, lhsReg);
            pg->BranchIfStrictNotUndefined(this, skipRight);
            pg->SetLabel(left_, nullish);
        }
        // left = right
        right_->Compile(pg);
        lref.SetValue();
        pg->Branch(this, endLabel);
        // skip right part
        pg->SetLabel(this, skipRight);
        pg->LoadAccumulator(this, lhsReg);
        pg->SetLabel(this, endLabel);
        return;
    } else if (operator_ != lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
        compiler::VReg lhsReg = pg->AllocReg();

        lref.GetValue();
        pg->StoreAccumulator(left_, lhsReg);
        right_->Compile(pg);
        pg->Binary(this, operator_, lhsReg);
    } else {
        right_->Compile(pg);
    }

    lref.SetValue();
}

void AssignmentExpression::CompilePattern(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::LReference lref = compiler::LReference::CreateLRef(pg, left_, false);
    right_->Compile(pg);
    lref.SetValue();
}

checker::Type *AssignmentExpression::Check(checker::Checker *checker) const
{
    if (left_->IsArrayPattern()) {
        auto savedContext = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
        auto destructuringContext = checker::ArrayDestructuringContext(checker, left_, true, true, nullptr, right_);
        destructuringContext.Start();
        return destructuringContext.InferedType();
    }

    if (left_->IsObjectPattern()) {
        auto savedContext = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
        auto destructuringContext = checker::ObjectDestructuringContext(checker, left_, true, true, nullptr, right_);
        destructuringContext.Start();
        return destructuringContext.InferedType();
    }

    if (left_->IsIdentifier() && left_->AsIdentifier()->Variable() &&
        left_->AsIdentifier()->Variable()->Declaration()->IsConstDecl()) {
        checker->ThrowTypeError({"Cannot assign to ", left_->AsIdentifier()->Name(), " because it is a constant."},
                                left_->Start());
    }

    auto *leftType = left_->Check(checker);

    if (leftType->HasTypeFlag(checker::TypeFlag::READONLY)) {
        checker->ThrowTypeError("Cannot assign to this property because it is readonly.", left_->Start());
    }

    if (operator_ == lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
        checker->ElaborateElementwise(leftType, right_, left_->Start());
        return checker->CheckTypeCached(right_);
    }

    auto *rightType = right_->Check(checker);

    switch (operator_) {
        case lexer::TokenType::PUNCTUATOR_MULTIPLY_EQUAL:
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL:
        case lexer::TokenType::PUNCTUATOR_DIVIDE_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MOD_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MINUS_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR_EQUAL: {
            return checker->CheckBinaryOperator(leftType, rightType, left_, right_, this, operator_);
        }
        case lexer::TokenType::PUNCTUATOR_PLUS_EQUAL: {
            return checker->CheckPlusOperator(leftType, rightType, left_, right_, this, operator_);
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL: {
            return checker->CheckCompareOperator(leftType, rightType, left_, right_, this, operator_);
        }
        case lexer::TokenType::PUNCTUATOR_SUBSTITUTION: {
            checker->CheckAssignmentOperator(operator_, left_, leftType, rightType);
            return rightType;
        }
        default: {
            UNREACHABLE();
            break;
        }
    }

    return nullptr;
}

void AssignmentExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    left_ = std::get<ir::AstNode *>(cb(left_))->AsExpression();
    right_ = std::get<ir::AstNode *>(cb(right_))->AsExpression();
}

}  // namespace panda::es2panda::ir
