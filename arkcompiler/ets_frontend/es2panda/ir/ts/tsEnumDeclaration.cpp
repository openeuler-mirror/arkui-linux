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

#include "tsEnumDeclaration.h"

#include <binder/scope.h>
#include <util/helpers.h>
#include <ir/astDump.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/unaryExpression.h>
#include <ir/expressions/binaryExpression.h>
#include <ir/expressions/templateLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/ts/tsEnumMember.h>
#include <typescript/checker.h>

namespace panda::es2panda::ir {

void TSEnumDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(key_);

    for (auto *it : members_) {
        cb(it);
    }
}

void TSEnumDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSEnumDeclaration"}, {"id", key_}, {"members", members_}, {"const", isConst_}});
}

void TSEnumDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

int32_t ToInt(double num)
{
    if (num >= std::numeric_limits<int32_t>::min() && num <= std::numeric_limits<int32_t>::max()) {
        return static_cast<int32_t>(num);
    }

    // TODO(aszilagyi): Perform ECMA defined toInt conversion

    return 0;
}

uint32_t ToUInt(double num)
{
    if (num >= std::numeric_limits<uint32_t>::min() && num <= std::numeric_limits<uint32_t>::max()) {
        return static_cast<int32_t>(num);
    }

    // TODO(aszilagyi): Perform ECMA defined toInt conversion

    return 0;
}

binder::EnumMemberResult EvaluateIdentifier(checker::Checker *checker, binder::EnumVariable *enumVar,
                                            const ir::Identifier *expr)
{
    if (expr->Name() == "NaN") {
        return std::nan("");
    }
    if (expr->Name() == "Infinity") {
        return std::numeric_limits<double>::infinity();
    }

    binder::Variable *enumMember = expr->AsIdentifier()->Variable();

    if (!enumMember) {
        checker->ThrowTypeError({"Cannot find name ", expr->AsIdentifier()->Name()},
                                enumVar->Declaration()->Node()->Start());
    }

    if (enumMember->IsEnumVariable()) {
        binder::EnumVariable *exprEnumVar = enumMember->AsEnumVariable();
        if (std::holds_alternative<bool>(exprEnumVar->Value())) {
            checker->ThrowTypeError(
                "A member initializer in a enum declaration cannot reference members declared after it, "
                "including "
                "members defined in other enums.",
                enumVar->Declaration()->Node()->Start());
        }

        return exprEnumVar->Value();
    }

    return false;
}

binder::EnumMemberResult EvaluateUnaryExpression(checker::Checker *checker, binder::EnumVariable *enumVar,
                                                 const ir::UnaryExpression *expr)
{
    binder::EnumMemberResult value = TSEnumDeclaration::EvaluateEnumMember(checker, enumVar, expr->Argument());
    if (!std::holds_alternative<double>(value)) {
        return false;
    }

    switch (expr->OperatorType()) {
        case lexer::TokenType::PUNCTUATOR_PLUS: {
            return std::get<double>(value);
        }
        case lexer::TokenType::PUNCTUATOR_MINUS: {
            return -std::get<double>(value);
        }
        case lexer::TokenType::PUNCTUATOR_TILDE: {
            return static_cast<double>(~ToInt(std::get<double>(value)));
        }
        default: {
            break;
        }
    }

    return false;
}

binder::EnumMemberResult EvaluateMemberExpression(checker::Checker *checker,
                                                  [[maybe_unused]] binder::EnumVariable *enumVar,
                                                  const ir::MemberExpression *expr)
{
    if (checker::Checker::IsConstantMemberAccess(expr->AsExpression())) {
        if (expr->Check(checker)->TypeFlags() == checker::TypeFlag::ENUM) {
            util::StringView name;
            if (!expr->IsComputed()) {
                name = expr->Property()->AsIdentifier()->Name();
            } else {
                ASSERT(checker::Checker::IsStringLike(expr->Property()));
                name = reinterpret_cast<const ir::StringLiteral *>(expr->Property())->Str();
            }

            // TODO(aszilagyi)
        }
    }

    return false;
}

binder::EnumMemberResult EvaluateBinaryExpression(checker::Checker *checker, binder::EnumVariable *enumVar,
                                                  const ir::BinaryExpression *expr)
{
    binder::EnumMemberResult left =
        TSEnumDeclaration::EvaluateEnumMember(checker, enumVar, expr->AsBinaryExpression()->Left());
    binder::EnumMemberResult right =
        TSEnumDeclaration::EvaluateEnumMember(checker, enumVar, expr->AsBinaryExpression()->Right());
    if (std::holds_alternative<double>(left) && std::holds_alternative<double>(right)) {
        switch (expr->AsBinaryExpression()->OperatorType()) {
            case lexer::TokenType::PUNCTUATOR_BITWISE_OR: {
                return static_cast<double>(ToUInt(std::get<double>(left)) | ToUInt(std::get<double>(right)));
            }
            case lexer::TokenType::PUNCTUATOR_BITWISE_AND: {
                return static_cast<double>(ToUInt(std::get<double>(left)) & ToUInt(std::get<double>(right)));
            }
            case lexer::TokenType::PUNCTUATOR_BITWISE_XOR: {
                return static_cast<double>(ToUInt(std::get<double>(left)) ^ ToUInt(std::get<double>(right)));
            }
            case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT: {
                return static_cast<double>(ToInt(std::get<double>(left)) << ToUInt(std::get<double>(right)));
            }
            case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT: {
                return static_cast<double>(ToInt(std::get<double>(left)) >> ToUInt(std::get<double>(right)));
            }
            case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT: {
                return static_cast<double>(ToUInt(std::get<double>(left)) >> ToUInt(std::get<double>(right)));
            }
            case lexer::TokenType::PUNCTUATOR_PLUS: {
                return std::get<double>(left) + std::get<double>(right);
            }
            case lexer::TokenType::PUNCTUATOR_MINUS: {
                return std::get<double>(left) - std::get<double>(right);
            }
            case lexer::TokenType::PUNCTUATOR_MULTIPLY: {
                return std::get<double>(left) * std::get<double>(right);
            }
            case lexer::TokenType::PUNCTUATOR_DIVIDE: {
                return std::get<double>(left) / std::get<double>(right);
            }
            case lexer::TokenType::PUNCTUATOR_MOD: {
                return std::fmod(std::get<double>(left), std::get<double>(right));
            }
            case lexer::TokenType::PUNCTUATOR_EXPONENTIATION: {
                return std::pow(std::get<double>(left), std::get<double>(right));
            }
            default: {
                break;
            }
        }

        return false;
    }

    if (std::holds_alternative<util::StringView>(left) && std::holds_alternative<util::StringView>(right) &&
        expr->AsBinaryExpression()->OperatorType() == lexer::TokenType::PUNCTUATOR_PLUS) {
        std::stringstream ss;
        ss << std::get<util::StringView>(left) << std::get<util::StringView>(right);

        util::UString res(ss.str(), checker->Allocator());
        return res.View();
    }

    return false;
}

binder::EnumMemberResult TSEnumDeclaration::EvaluateEnumMember(checker::Checker *checker, binder::EnumVariable *enumVar,
                                                               const ir::AstNode *expr)
{
    switch (expr->Type()) {
        case ir::AstNodeType::UNARY_EXPRESSION: {
            return EvaluateUnaryExpression(checker, enumVar, expr->AsUnaryExpression());
        }
        case ir::AstNodeType::BINARY_EXPRESSION: {
            return EvaluateBinaryExpression(checker, enumVar, expr->AsBinaryExpression());
        }
        case ir::AstNodeType::NUMBER_LITERAL: {
            return expr->AsNumberLiteral()->Number();
        }
        case ir::AstNodeType::STRING_LITERAL: {
            return expr->AsStringLiteral()->Str();
        }
        case ir::AstNodeType::IDENTIFIER: {
            return EvaluateIdentifier(checker, enumVar, expr->AsIdentifier());
        }
        case ir::AstNodeType::MEMBER_EXPRESSION: {
            return EvaluateEnumMember(checker, enumVar, expr->AsMemberExpression());
        }
        default:
            break;
    }

    return false;
}

bool IsComputedEnumMember(const ir::Expression *init)
{
    if (init->IsLiteral()) {
        return !init->AsLiteral()->IsStringLiteral() && !init->AsLiteral()->IsNumberLiteral();
    }

    if (init->IsTemplateLiteral()) {
        return !init->AsTemplateLiteral()->Quasis().empty();
    }

    return true;
}

void AddEnumValueDeclaration(checker::Checker *checker, double number, binder::EnumVariable *variable)
{
    variable->SetTsType(checker->GlobalNumberType());

    util::StringView memberStr = util::Helpers::ToStringView(checker->Allocator(), number);

    binder::LocalScope *enumScope = checker->Scope()->AsLocalScope();
    binder::Variable *res = enumScope->FindLocal(memberStr);
    binder::EnumVariable *enumVar = nullptr;

    if (!res) {
        auto *decl = checker->Allocator()->New<binder::EnumDecl>(memberStr);
        decl->BindNode(variable->Declaration()->Node());
        enumScope->AddDecl(checker->Allocator(), decl, ScriptExtension::TS);
        res = enumScope->FindLocal(memberStr);
        ASSERT(res && res->IsEnumVariable());
        enumVar = res->AsEnumVariable();
        enumVar->AsEnumVariable()->SetBackReference();
        enumVar->SetTsType(checker->GlobalStringType());
    } else {
        ASSERT(res->IsEnumVariable());
        enumVar = res->AsEnumVariable();
        auto *decl = checker->Allocator()->New<binder::EnumDecl>(memberStr);
        decl->BindNode(variable->Declaration()->Node());
        enumVar->ResetDecl(decl);
    }

    enumVar->SetValue(variable->Declaration()->Name());
}

void InferEnumVariableType(checker::Checker *checker, binder::EnumVariable *variable, double *value, bool *initNext,
                           bool *isLiteralEnum, bool isConstEnum, const ir::Expression *computedExpr)
{
    const ir::Expression *init = variable->Declaration()->Node()->AsTSEnumMember()->Init();

    if (!init && *initNext) {
        checker->ThrowTypeError("Enum member must have initializer.", variable->Declaration()->Node()->Start());
    }

    if (!init && !*initNext) {
        variable->SetValue(++(*value));
        AddEnumValueDeclaration(checker, *value, variable);
        return;
    }

    ASSERT(init);

    if (IsComputedEnumMember(init)) {
        if (*isLiteralEnum) {
            checker->ThrowTypeError("Computed values are not permitted in an enum with string valued members.",
                                    init->Start());
        }

        computedExpr = init;
    }

    binder::EnumMemberResult res = TSEnumDeclaration::EvaluateEnumMember(checker, variable, init);
    if (std::holds_alternative<util::StringView>(res)) {
        if (computedExpr) {
            checker->ThrowTypeError("Computed values are not permitted in an enum with string valued members.",
                                    computedExpr->Start());
        }

        *isLiteralEnum = true;
        variable->SetTsType(checker->GlobalStringType());
        *initNext = true;
        return;
    }

    if (std::holds_alternative<bool>(res)) {
        if (isConstEnum) {
            checker->ThrowTypeError(
                "const enum member initializers can only contain literal values and other computed enum "
                "values.",
                init->Start());
        }

        *initNext = true;
        return;
    }

    ASSERT(std::holds_alternative<double>(res));
    variable->SetValue(res);

    *value = std::get<double>(res);
    if (isConstEnum) {
        if (std::isnan(*value)) {
            checker->ThrowTypeError("'const' enum member initializer was evaluated to disallowed value 'NaN'.",
                                    init->Start());
        }

        if (std::isinf(*value)) {
            checker->ThrowTypeError("'const' enum member initializer was evaluated to a non-finite value.",
                                    init->Start());
        }
    }

    *initNext = false;
    AddEnumValueDeclaration(checker, *value, variable);
}

checker::Type *TSEnumDeclaration::InferType(checker::Checker *checker, bool isConst) const
{
    double value = -1.0;

    binder::LocalScope *enumScope = checker->Scope()->AsLocalScope();

    bool initNext = false;
    bool isLiteralEnum = false;
    const ir::Expression *computedExpr = nullptr;
    size_t localsSize = enumScope->Decls().size();

    for (size_t i = 0; i < localsSize; i++) {
        const util::StringView &currentName = enumScope->Decls()[i]->Name();
        binder::Variable *currentVar = enumScope->FindLocal(currentName);
        ASSERT(currentVar && currentVar->IsEnumVariable());
        InferEnumVariableType(checker, currentVar->AsEnumVariable(), &value, &initNext, &isLiteralEnum, isConst,
                              computedExpr);
    }

    checker::Type *enumType = checker->Allocator()->New<checker::EnumLiteralType>(
        key_->Name(), checker->Scope(),
        isLiteralEnum ? checker::EnumLiteralType::EnumLiteralTypeKind::LITERAL
                      : checker::EnumLiteralType::EnumLiteralTypeKind::NUMERIC);

    return enumType;
}

checker::Type *TSEnumDeclaration::Check(checker::Checker *checker) const
{
    binder::Variable *enumVar = key_->Variable();
    ASSERT(enumVar);

    if (!enumVar->TsType()) {
        checker::ScopeContext scopeCtx(checker, scope_);
        checker::Type *enumType = InferType(checker, isConst_);
        enumType->SetVariable(enumVar);
        enumVar->SetTsType(enumType);
    }

    return nullptr;
}

void TSEnumDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    key_ = std::get<ir::AstNode *>(cb(key_))->AsIdentifier();

    for (auto iter = members_.begin(); iter != members_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsTSEnumMember();
    }
}

}  // namespace panda::es2panda::ir
