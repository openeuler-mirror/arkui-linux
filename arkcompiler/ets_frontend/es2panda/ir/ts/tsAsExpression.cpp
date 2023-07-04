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

#include "tsAsExpression.h"

#include <binder/scope.h>
#include <typescript/checker.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literal.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/unaryExpression.h>
#include <ir/typeNode.h>

namespace panda::es2panda::ir {

void TSAsExpression::Iterate(const NodeTraverser &cb) const
{
    cb(expression_);
    cb(typeAnnotation_);
}

void TSAsExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSAsExpression"}, {"expression", expression_}, {"typeAnnotation", typeAnnotation_}});
}

void TSAsExpression::Compile(compiler::PandaGen *pg) const
{
    expression_->Compile(pg);
}

static bool IsValidConstAssertionArgument(checker::Checker *checker, const ir::AstNode *arg)
{
    switch (arg->Type()) {
        case ir::AstNodeType::NUMBER_LITERAL:
        case ir::AstNodeType::STRING_LITERAL:
        case ir::AstNodeType::BIGINT_LITERAL:
        case ir::AstNodeType::BOOLEAN_LITERAL:
        case ir::AstNodeType::ARRAY_EXPRESSION:
        case ir::AstNodeType::OBJECT_EXPRESSION:
        case ir::AstNodeType::TEMPLATE_LITERAL: {
            return true;
        }
        case ir::AstNodeType::UNARY_EXPRESSION: {
            const ir::UnaryExpression *unaryExpr = arg->AsUnaryExpression();
            lexer::TokenType op = unaryExpr->OperatorType();
            const ir::Expression *unaryArg = unaryExpr->Argument();
            return (op == lexer::TokenType::PUNCTUATOR_MINUS && unaryArg->IsLiteral() &&
                    (unaryArg->AsLiteral()->IsNumberLiteral() || unaryArg->AsLiteral()->IsBigIntLiteral())) ||
                   (op == lexer::TokenType::PUNCTUATOR_PLUS && unaryArg->IsLiteral() &&
                    unaryArg->AsLiteral()->IsNumberLiteral());
        }
        case ir::AstNodeType::MEMBER_EXPRESSION: {
            const ir::MemberExpression *memberExpr = arg->AsMemberExpression();
            if (memberExpr->Object()->IsIdentifier()) {
                binder::ScopeFindResult result = checker->Scope()->Find(memberExpr->Object()->AsIdentifier()->Name());
                constexpr auto enumLiteralType = checker::EnumLiteralType::EnumLiteralTypeKind::LITERAL;
                if (result.variable && result.variable->TsType()->HasTypeFlag(checker::TypeFlag::ENUM_LITERAL) &&
                    result.variable->TsType()->AsEnumLiteralType()->Kind() == enumLiteralType) {
                    return true;
                }
            }
            return false;
        }
        default:
            return false;
    }
}

checker::Type *TSAsExpression::Check(checker::Checker *checker) const
{
    if (isConst_) {
        auto context = checker::SavedCheckerContext(checker, checker::CheckerStatus::IN_CONST_CONTEXT);
        checker::Type *exprType = expression_->Check(checker);

        if (!IsValidConstAssertionArgument(checker, expression_)) {
            checker->ThrowTypeError(
                "A 'const' assertions can only be applied to references to enum members, or string, number, "
                "boolean, array, or object literals.",
                expression_->Start());
        }

        return exprType;
    }

    auto context = checker::SavedCheckerContext(checker, checker::CheckerStatus::NO_OPTS);

    typeAnnotation_->Check(checker);
    checker::Type *exprType = checker->GetBaseTypeOfLiteralType(expression_->Check(checker));
    checker::Type *targetType = typeAnnotation_->AsTypeNode()->GetType(checker);

    checker->IsTypeComparableTo(
        targetType, exprType,
        {"Conversion of type '", exprType, "' to type '", targetType,
         "' may be a mistake because neither type sufficiently overlaps with the other. If this was ",
         "intentional, convert the expression to 'unknown' first."},
        Start());

    return targetType;
}

void TSAsExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    expression_ = std::get<ir::AstNode *>(cb(expression_))->AsExpression();
    typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
}

}  // namespace panda::es2panda::ir
