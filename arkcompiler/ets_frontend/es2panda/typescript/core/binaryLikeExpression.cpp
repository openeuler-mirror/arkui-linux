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

#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/memberExpression.h>

#include <typescript/checker.h>

namespace panda::es2panda::checker {

Type *Checker::CheckBinaryOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                                   const ir::Expression *rightExpr, const ir::AstNode *expr, lexer::TokenType op)
{
    CheckNonNullType(leftType, leftExpr->Start());
    CheckNonNullType(rightType, rightExpr->Start());

    if (leftType->HasTypeFlag(TypeFlag::BOOLEAN_LIKE) && rightType->HasTypeFlag(TypeFlag::BOOLEAN_LIKE)) {
        lexer::TokenType suggestedOp;
        switch (op) {
            case lexer::TokenType::PUNCTUATOR_BITWISE_OR:
            case lexer::TokenType::PUNCTUATOR_BITWISE_OR_EQUAL: {
                suggestedOp = lexer::TokenType::PUNCTUATOR_LOGICAL_OR;
                break;
            }
            case lexer::TokenType::PUNCTUATOR_BITWISE_AND:
            case lexer::TokenType::PUNCTUATOR_BITWISE_AND_EQUAL: {
                suggestedOp = lexer::TokenType::PUNCTUATOR_LOGICAL_AND;
                break;
            }
            case lexer::TokenType::PUNCTUATOR_BITWISE_XOR:
            case lexer::TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL: {
                suggestedOp = lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL;
                break;
            }
            default: {
                suggestedOp = lexer::TokenType::EOS;
                break;
            }
        }

        if (suggestedOp != lexer::TokenType::EOS) {
            ThrowTypeError(
                {"The ", op, " operator is not allowed for boolean types. Consider using ", suggestedOp, " instead"},
                expr->Start());
        }
    }

    if (!leftType->HasTypeFlag(TypeFlag::VALID_ARITHMETIC_TYPE)) {
        ThrowTypeError(
            "The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an "
            "enum "
            "type.",
            expr->Start());
    }

    if (!rightType->HasTypeFlag(TypeFlag::VALID_ARITHMETIC_TYPE)) {
        ThrowTypeError(
            "The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an "
            "enum "
            "type.",
            rightExpr->Start());
    }

    Type *resultType = nullptr;
    if ((leftType->IsAnyType() && rightType->IsAnyType()) ||
        !(leftType->HasTypeFlag(TypeFlag::BIGINT_LIKE) || rightType->HasTypeFlag(TypeFlag::BIGINT_LIKE))) {
        resultType = GlobalNumberType();
    } else if (leftType->HasTypeFlag(TypeFlag::BIGINT_LIKE) && rightType->HasTypeFlag(TypeFlag::BIGINT_LIKE)) {
        if (op == lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT ||
            op == lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL) {
            ThrowTypeError({"operator ", op, " cannot be applied to types 'bigint' and 'bigint'"}, expr->Start());
        }
        resultType = GlobalBigintType();
    } else {
        ThrowBinaryLikeError(op, leftType, rightType, expr->Start());
    }

    CheckAssignmentOperator(op, leftExpr, leftType, resultType);
    return resultType;
}

Type *Checker::CheckPlusOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                                 const ir::Expression *rightExpr, const ir::AstNode *expr, lexer::TokenType op)
{
    if (!leftType->HasTypeFlag(TypeFlag::STRING_LIKE) && !rightType->HasTypeFlag(TypeFlag::STRING_LIKE)) {
        CheckNonNullType(leftType, leftExpr->Start());
        CheckNonNullType(rightType, rightExpr->Start());
    }

    Type *resultType = nullptr;
    if (IsTypeAssignableTo(leftType, GlobalNumberType()) && IsTypeAssignableTo(rightType, GlobalNumberType())) {
        resultType = GlobalNumberType();
    } else if (IsTypeAssignableTo(leftType, GlobalBigintType()) && IsTypeAssignableTo(rightType, GlobalBigintType())) {
        resultType = GlobalBigintType();
    } else if (IsTypeAssignableTo(leftType, GlobalStringType()) || IsTypeAssignableTo(rightType, GlobalStringType())) {
        resultType = GlobalStringType();
    } else if (MaybeTypeOfKind(leftType, TypeFlag::UNKNOWN)) {
        ThrowTypeError("object is of type 'unknown'", leftExpr->Start());
    } else if (MaybeTypeOfKind(rightType, TypeFlag::UNKNOWN)) {
        ThrowTypeError("object is of type 'unknown'", rightExpr->Start());
    } else if (leftType->IsAnyType() || rightType->IsAnyType()) {
        resultType = GlobalAnyType();
    } else {
        ThrowBinaryLikeError(op, leftType, rightType, expr->Start());
    }

    if (op == lexer::TokenType::PUNCTUATOR_PLUS_EQUAL) {
        CheckAssignmentOperator(op, leftExpr, leftType, resultType);
    }

    return resultType;
}

Type *Checker::CheckCompareOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                                    const ir::Expression *rightExpr, const ir::AstNode *expr, lexer::TokenType op)
{
    CheckNonNullType(leftType, leftExpr->Start());
    CheckNonNullType(rightType, rightExpr->Start());

    if (AreTypesComparable(leftType, rightType) || (IsTypeAssignableTo(leftType, GlobalNumberOrBigintType()) &&
                                                    IsTypeAssignableTo(rightType, GlobalNumberOrBigintType()))) {
        return GlobalBooleanType();
    }

    ThrowBinaryLikeError(op, leftType, rightType, expr->Start());

    return GlobalAnyType();
}

Type *Checker::CheckAndOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr)
{
    CheckTruthinessOfType(leftType, leftExpr->Start());

    if (static_cast<uint64_t>(leftType->GetTypeFacts()) & static_cast<uint64_t>(TypeFacts::TRUTHY)) {
        Type *resultType = CreateUnionType({ExtractDefinitelyFalsyTypes(rightType), rightType});
        return resultType;
    }

    return leftType;
}

Type *Checker::CheckOrOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr)
{
    CheckTruthinessOfType(leftType, leftExpr->Start());

    if (static_cast<uint64_t>(leftType->GetTypeFacts()) & static_cast<uint64_t>(TypeFacts::FALSY)) {
        // TODO(aszilagyi): subtype reduction in the result union
        Type *resultType = CreateUnionType({RemoveDefinitelyFalsyTypes(leftType), rightType});
        return resultType;
    }

    return leftType;
}

static bool TypeHasCallOrConstructSignatures(Type *type)
{
    return type->IsObjectType() &&
           (!type->AsObjectType()->CallSignatures().empty() || !type->AsObjectType()->ConstructSignatures().empty());
}

Type *Checker::CheckInstanceofExpression(Type *leftType, Type *rightType, const ir::Expression *rightExpr,
                                         const ir::AstNode *expr)
{
    if (leftType->TypeFlags() != TypeFlag::ANY && IsAllTypesAssignableTo(leftType, GlobalPrimitiveType())) {
        ThrowTypeError({"The left-hand side of an 'instanceof' expression must be of type 'any',",
                        " an object type or a type parameter."},
                       expr->Start());
    }

    // TODO(aszilagyi): Check if right type is subtype of globalFunctionType
    if (rightType->TypeFlags() != TypeFlag::ANY && !TypeHasCallOrConstructSignatures(rightType)) {
        ThrowTypeError({"The right-hand side of an 'instanceof' expression must be of type 'any'",
                        " or of a type assignable to the 'Function' interface type."},
                       rightExpr->Start());
    }

    return GlobalBooleanType();
}

Type *Checker::CheckInExpression(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                                 const ir::Expression *rightExpr, const ir::AstNode *expr)
{
    CheckNonNullType(leftType, leftExpr->Start());
    CheckNonNullType(rightType, rightExpr->Start());

    // TODO(aszilagyi): Check IsAllTypesAssignableTo with ESSymbol too
    if (leftType->TypeFlags() != TypeFlag::ANY && !IsAllTypesAssignableTo(leftType, GlobalStringOrNumberType())) {
        ThrowTypeError(
            {"The left-hand side of an 'in' expression must be of type 'any',", " 'string', 'number', or 'symbol'."},
            expr->Start());
    }

    // TODO(aszilagyi): Handle type parameters
    if (!IsAllTypesAssignableTo(rightType, GlobalNonPrimitiveType())) {
        ThrowTypeError("The right-hand side of an 'in' expression must not be a primitive.", rightExpr->Start());
    }

    return GlobalBooleanType();
}

void Checker::CheckAssignmentOperator(lexer::TokenType op, const ir::Expression *leftExpr, Type *leftType,
                                      Type *valueType)
{
    if (IsAssignmentOperator(op)) {
        CheckReferenceExpression(
            leftExpr, "the left hand side of an assigment expression must be a variable or a property access",
            "The left-hand side of an assignment expression may not be an optional property access.");

        if (!IsTypeAssignableTo(valueType, leftType)) {
            ThrowAssignmentError(valueType, leftType, leftExpr->Start(),
                                 leftExpr->Parent()->AsAssignmentExpression()->Right()->IsMemberExpression() ||
                                     leftExpr->Parent()->AsAssignmentExpression()->Right()->IsChainExpression());
        }
    }
}

}  // namespace panda::es2panda::checker
