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

#include "binaryExpression.h"

#include <binder/variable.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <lexer/token/tokenType.h>

namespace panda::es2panda::ir {

void BinaryExpression::Iterate(const NodeTraverser &cb) const
{
    cb(left_);
    cb(right_);
}

void BinaryExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", IsLogical() ? "LogicalExpression" : "BinaryExpression"},
                 {"operator", operator_},
                 {"left", left_},
                 {"right", right_}});
}

void BinaryExpression::CompileLogical(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::VReg lhs = pg->AllocReg();

    ASSERT(operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_AND ||
           operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_OR ||
           operator_ == lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING);
    auto *skipRight = pg->AllocLabel();
    auto *endLabel = pg->AllocLabel();

    // left -> acc -> lhs -> toboolean -> acc -> bool_lhs
    left_->Compile(pg);
    pg->StoreAccumulator(this, lhs);

    if (operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_AND) {
        pg->BranchIfFalse(this, skipRight);
    } else if (operator_ == lexer::TokenType::PUNCTUATOR_LOGICAL_OR) {
        pg->BranchIfTrue(this, skipRight);
    } else {
        ASSERT(operator_ == lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING);
        auto *nullish = pg->AllocLabel();
        // if lhs === null
        pg->BranchIfStrictNull(this, nullish);
        pg->LoadAccumulator(this, lhs);
        // if lhs === undefined
        pg->BranchIfStrictNotUndefined(this, skipRight);
        pg->SetLabel(this, nullish);
    }

    // left is true/false(and/or) then right -> acc
    right_->Compile(pg);
    pg->Branch(this, endLabel);

    // left is false/true(and/or) then lhs -> acc
    pg->SetLabel(this, skipRight);
    pg->LoadAccumulator(this, lhs);
    pg->SetLabel(this, endLabel);
}

void BinaryExpression::Compile(compiler::PandaGen *pg) const
{
    if (IsLogical()) {
        CompileLogical(pg);
        return;
    }

    compiler::RegScope rs(pg);
    compiler::VReg lhs = pg->AllocReg();

    left_->Compile(pg);
    pg->StoreAccumulator(this, lhs);
    right_->Compile(pg);

    pg->Binary(this, operator_, lhs);
}

checker::Type *BinaryExpression::Check(checker::Checker *checker) const
{
    auto *leftType = left_->Check(checker);
    auto *rightType = right_->Check(checker);

    switch (operator_) {
        case lexer::TokenType::PUNCTUATOR_MULTIPLY:
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION:
        case lexer::TokenType::PUNCTUATOR_DIVIDE:
        case lexer::TokenType::PUNCTUATOR_MOD:
        case lexer::TokenType::PUNCTUATOR_MINUS:
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND:
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR: {
            return checker->CheckBinaryOperator(leftType, rightType, left_, right_, this, operator_);
        }
        case lexer::TokenType::PUNCTUATOR_PLUS: {
            return checker->CheckPlusOperator(leftType, rightType, left_, right_, this, operator_);
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN: {
            return checker->CheckCompareOperator(leftType, rightType, left_, right_, this, operator_);
        }
        case lexer::TokenType::PUNCTUATOR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_NOT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_STRICT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL: {
            if (checker->IsTypeEqualityComparableTo(leftType, rightType) ||
                checker->IsTypeEqualityComparableTo(rightType, leftType)) {
                return checker->GlobalBooleanType();
            }

            checker->ThrowBinaryLikeError(operator_, leftType, rightType, Start());
        }
        case lexer::TokenType::KEYW_INSTANCEOF: {
            return checker->CheckInstanceofExpression(leftType, rightType, right_, this);
        }
        case lexer::TokenType::KEYW_IN: {
            return checker->CheckInExpression(leftType, rightType, left_, right_, this);
        }
        case lexer::TokenType::PUNCTUATOR_LOGICAL_AND: {
            return checker->CheckAndOperator(leftType, rightType, left_);
        }
        case lexer::TokenType::PUNCTUATOR_LOGICAL_OR: {
            return checker->CheckOrOperator(leftType, rightType, left_);
        }
        case lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING: {
            // TODO(Csaba Repasi): Implement checker for nullish coalescing
            return checker->GlobalAnyType();
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

void BinaryExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    left_ = std::get<ir::AstNode *>(cb(left_))->AsExpression();
    right_ = std::get<ir::AstNode *>(cb(right_))->AsExpression();
}

}  // namespace panda::es2panda::ir
