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

#include "condition.h"

#include <compiler/core/pandagen.h>
#include <ir/expressions/binaryExpression.h>
#include <ir/expressions/unaryExpression.h>

namespace panda::es2panda::compiler {

void Condition::Compile(PandaGen *pg, const ir::Expression *expr, Label *falseLabel)
{
    if (expr->IsBinaryExpression()) {
        const auto *binExpr = expr->AsBinaryExpression();

        switch (binExpr->OperatorType()) {
            case lexer::TokenType::PUNCTUATOR_EQUAL:
            case lexer::TokenType::PUNCTUATOR_NOT_EQUAL:
            case lexer::TokenType::PUNCTUATOR_STRICT_EQUAL:
            case lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL:
            case lexer::TokenType::PUNCTUATOR_LESS_THAN:
            case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL:
            case lexer::TokenType::PUNCTUATOR_GREATER_THAN:
            case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL: {
                // This is a special case
                // These operators are expressed via cmp instructions and the following
                // if-else branches. Condition also expressed via cmp instruction and
                // the following if-else.
                // the goal of this method is to merge these two sequences of instructions.
                RegScope rs(pg);
                VReg lhs = pg->AllocReg();

                binExpr->Left()->Compile(pg);
                pg->StoreAccumulator(binExpr, lhs);
                binExpr->Right()->Compile(pg);
                pg->Condition(binExpr, binExpr->OperatorType(), lhs, falseLabel);
                return;
            }
            case lexer::TokenType::PUNCTUATOR_LOGICAL_AND: {
                binExpr->Left()->Compile(pg);
                pg->BranchIfFalse(binExpr, falseLabel);

                binExpr->Right()->Compile(pg);
                pg->BranchIfFalse(binExpr, falseLabel);
                return;
            }
            case lexer::TokenType::PUNCTUATOR_LOGICAL_OR: {
                auto *endLabel = pg->AllocLabel();

                binExpr->Left()->Compile(pg);
                pg->BranchIfTrue(binExpr, endLabel);

                binExpr->Right()->Compile(pg);
                pg->BranchIfFalse(binExpr, falseLabel);
                pg->SetLabel(binExpr, endLabel);
                return;
            }
            default: {
                break;
            }
        }
    } else if (expr->IsUnaryExpression() &&
               expr->AsUnaryExpression()->OperatorType() == lexer::TokenType::PUNCTUATOR_EXCLAMATION_MARK) {
        expr->AsUnaryExpression()->Argument()->Compile(pg);

        pg->Negate(expr);
        pg->BranchIfFalse(expr, falseLabel);
        return;
    }

    // General case including some binExpr i.E.(a+b)
    expr->Compile(pg);
    pg->BranchIfFalse(expr, falseLabel);
}

}  // namespace panda::es2panda::compiler
