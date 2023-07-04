/*
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

#include <ir/typeNode.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/binaryExpression.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/statements/variableDeclarator.h>
#include <ir/statements/functionDeclaration.h>
#include <ir/ts/tsQualifiedName.h>
#include <ir/ts/tsTypeParameterDeclaration.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeReference.h>
#include <ir/ts/tsTypeAliasDeclaration.h>
#include <ir/ts/tsPropertySignature.h>
#include <ir/base/scriptFunction.h>
#include <binder/variable.h>
#include <binder/scope.h>

#include <typescript/checker.h>
#include <typescript/core/typeElaborationContext.h>

namespace panda::es2panda::checker {

void Checker::CheckTruthinessOfType(Type *type, lexer::SourcePosition lineInfo)
{
    if (type->IsVoidType()) {
        ThrowTypeError("An expression of type void cannot be tested for truthiness", lineInfo);
    }
}

Type *Checker::CheckNonNullType(Type *type, lexer::SourcePosition lineInfo)
{
    if (type->IsNullType()) {
        ThrowTypeError("Object is possibly 'null'.", lineInfo);
    }

    if (type->IsUndefinedType()) {
        ThrowTypeError("Object is possibly 'undefined'.", lineInfo);
    }

    return type;
}

Type *Checker::GetBaseTypeOfLiteralType(Type *type)
{
    if (HasStatus(CheckerStatus::KEEP_LITERAL_TYPE)) {
        return type;
    }

    if (type->IsStringLiteralType()) {
        return GlobalStringType();
    }

    if (type->IsNumberLiteralType()) {
        return GlobalNumberType();
    }

    if (type->IsBooleanLiteralType()) {
        return GlobalBooleanType();
    }

    if (type->IsBigintLiteralType()) {
        return GlobalBigintType();
    }

    if (type->IsUnionType()) {
        auto &constituentTypes = type->AsUnionType()->ConstituentTypes();
        ArenaVector<Type *> newConstituentTypes(allocator_->Adapter());

        newConstituentTypes.reserve(constituentTypes.size());
        for (auto *it : constituentTypes) {
            newConstituentTypes.push_back(GetBaseTypeOfLiteralType(it));
        }

        return CreateUnionType(std::move(newConstituentTypes));
    }

    return type;
}

void Checker::CheckReferenceExpression(const ir::Expression *expr, const char *invalidReferenceMsg,
                                       const char *invalidOptionalChainMsg)
{
    if (expr->IsIdentifier()) {
        const util::StringView &name = expr->AsIdentifier()->Name();
        binder::ScopeFindResult result = scope_->Find(name);
        ASSERT(result.variable);

        if (result.variable->HasFlag(binder::VariableFlags::ENUM_LITERAL)) {
            ThrowTypeError({"Cannot assign to '", name, "' because it is not a variable."}, expr->Start());
        }
    } else if (!expr->IsMemberExpression()) {
        if (expr->IsChainExpression()) {
            ThrowTypeError(invalidOptionalChainMsg, expr->Start());
        }

        ThrowTypeError(invalidReferenceMsg, expr->Start());
    }
}

void Checker::CheckTestingKnownTruthyCallableOrAwaitableType([[maybe_unused]] const ir::Expression *condExpr,
                                                             [[maybe_unused]] Type *type,
                                                             [[maybe_unused]] const ir::AstNode *body)
{
    // TODO(aszilagyi) rework this
}

Type *Checker::ExtractDefinitelyFalsyTypes(Type *type)
{
    if (type->IsStringType()) {
        return GlobalEmptyStringType();
    }

    if (type->IsNumberType()) {
        return GlobalZeroType();
    }

    if (type->IsBigintType()) {
        return GlobalZeroBigintType();
    }

    if (type == GlobalFalseType() || type->HasTypeFlag(TypeFlag::NULLABLE) ||
        type->HasTypeFlag(TypeFlag::ANY_OR_UNKNOWN) || type->HasTypeFlag(TypeFlag::VOID) ||
        (type->IsStringLiteralType() && IsTypeIdenticalTo(type, GlobalEmptyStringType())) ||
        (type->IsNumberLiteralType() && IsTypeIdenticalTo(type, GlobalZeroType())) ||
        (type->IsBigintLiteralType() && IsTypeIdenticalTo(type, GlobalZeroBigintType()))) {
        return type;
    }

    if (type->IsUnionType()) {
        auto &constituentTypes = type->AsUnionType()->ConstituentTypes();
        ArenaVector<Type *> newConstituentTypes(allocator_->Adapter());

        newConstituentTypes.reserve(constituentTypes.size());
        for (auto &it : constituentTypes) {
            newConstituentTypes.push_back(ExtractDefinitelyFalsyTypes(it));
        }

        return CreateUnionType(std::move(newConstituentTypes));
    }

    return GlobalNeverType();
}

Type *Checker::RemoveDefinitelyFalsyTypes(Type *type)
{
    if (static_cast<uint64_t>(GetFalsyFlags(type)) & static_cast<uint64_t>(TypeFlag::DEFINITELY_FALSY)) {
        if (type->IsUnionType()) {
            auto &constituentTypes = type->AsUnionType()->ConstituentTypes();
            ArenaVector<Type *> newConstituentTypes(allocator_->Adapter());

            for (auto &it : constituentTypes) {
                if (!(static_cast<uint64_t>(GetFalsyFlags(it)) & static_cast<uint64_t>(TypeFlag::DEFINITELY_FALSY))) {
                    newConstituentTypes.push_back(it);
                }
            }

            if (newConstituentTypes.empty()) {
                return GlobalNeverType();
            }

            if (newConstituentTypes.size() == 1) {
                return newConstituentTypes[0];
            }

            return CreateUnionType(std::move(newConstituentTypes));
        }

        return GlobalNeverType();
    }

    return type;
}

TypeFlag Checker::GetFalsyFlags(Type *type)
{
    if (type->IsStringLiteralType()) {
        return type->AsStringLiteralType()->Value().Empty() ? TypeFlag::STRING_LITERAL : TypeFlag::NONE;
    }

    if (type->IsNumberLiteralType()) {
        return type->AsNumberLiteralType()->Value() == 0 ? TypeFlag::NUMBER_LITERAL : TypeFlag::NONE;
    }

    if (type->IsBigintLiteralType()) {
        return type->AsBigintLiteralType()->Value() == "0n" ? TypeFlag::BIGINT_LITERAL : TypeFlag::NONE;
    }

    if (type->IsBooleanLiteralType()) {
        return type->AsBooleanLiteralType()->Value() ? TypeFlag::NONE : TypeFlag::BOOLEAN_LITERAL;
    }

    if (type->IsUnionType()) {
        auto &constituentTypes = type->AsUnionType()->ConstituentTypes();
        TypeFlag returnFlag = TypeFlag::NONE;

        for (auto &it : constituentTypes) {
            returnFlag |= GetFalsyFlags(it);
        }

        return returnFlag;
    }

    return static_cast<TypeFlag>(type->TypeFlags() & TypeFlag::POSSIBLY_FALSY);
}

bool Checker::IsVariableUsedInConditionBody(const ir::AstNode *parent, binder::Variable *searchVar)
{
    bool found = false;

    parent->Iterate([this, searchVar, &found](const ir::AstNode *childNode) -> void {
        binder::Variable *resultVar = nullptr;
        if (childNode->IsIdentifier()) {
            binder::ScopeFindResult result = scope_->Find(childNode->AsIdentifier()->Name());
            ASSERT(result.variable);
            resultVar = result.variable;
        }

        if (searchVar == resultVar) {
            found = true;
            return;
        }

        if (!childNode->IsMemberExpression()) {
            IsVariableUsedInConditionBody(childNode, searchVar);
        }
    });

    return found;
}

bool Checker::FindVariableInBinaryExpressionChain(const ir::AstNode *parent, binder::Variable *searchVar)
{
    bool found = false;

    parent->Iterate([this, searchVar, &found](const ir::AstNode *childNode) -> void {
        if (childNode->IsIdentifier()) {
            binder::ScopeFindResult result = scope_->Find(childNode->AsIdentifier()->Name());
            ASSERT(result.variable);
            if (result.variable == searchVar) {
                found = true;
                return;
            }
        }

        FindVariableInBinaryExpressionChain(childNode, searchVar);
    });

    return found;
}

bool Checker::IsVariableUsedInBinaryExpressionChain(const ir::AstNode *parent, binder::Variable *searchVar)
{
    while (parent->IsBinaryExpression() &&
           parent->AsBinaryExpression()->OperatorType() == lexer::TokenType::PUNCTUATOR_LOGICAL_AND) {
        if (FindVariableInBinaryExpressionChain(parent, searchVar)) {
            return true;
        }

        parent = parent->Parent();
    }

    return false;
}

void Checker::ThrowBinaryLikeError(lexer::TokenType op, Type *leftType, Type *rightType, lexer::SourcePosition lineInfo)
{
    if (!HasStatus(CheckerStatus::IN_CONST_CONTEXT)) {
        ThrowTypeError({"operator ", op, " cannot be applied to types ", leftType, " and ", AsSrc(rightType)},
                       lineInfo);
    }

    ThrowTypeError({"operator ", op, " cannot be applied to types ", leftType, " and ", rightType}, lineInfo);
}

void Checker::ThrowAssignmentError(Type *source, Type *target, lexer::SourcePosition lineInfo, bool isAsSrcLeftType)
{
    if (isAsSrcLeftType || !target->HasTypeFlag(TypeFlag::LITERAL)) {
        ThrowTypeError({"Type '", AsSrc(source), "' is not assignable to type '", target, "'."}, lineInfo);
    }

    ThrowTypeError({"Type '", source, "' is not assignable to type '", target, "'."}, lineInfo);
}

Type *Checker::GetUnaryResultType(Type *operandType)
{
    if (checker::Checker::MaybeTypeOfKind(operandType, checker::TypeFlag::BIGINT_LIKE)) {
        if (operandType->HasTypeFlag(checker::TypeFlag::UNION_OR_INTERSECTION) &&
            checker::Checker::MaybeTypeOfKind(operandType, checker::TypeFlag::NUMBER_LIKE)) {
            return GlobalNumberOrBigintType();
        }

        return GlobalBigintType();
    }

    return GlobalNumberType();
}

void Checker::ElaborateElementwise(Type *targetType, const ir::Expression *sourceNode, const lexer::SourcePosition &pos)
{
    auto savedContext = SavedCheckerContext(this, CheckerStatus::FORCE_TUPLE | CheckerStatus::KEEP_LITERAL_TYPE);

    Type *sourceType = CheckTypeCached(sourceNode);

    if (IsTypeAssignableTo(sourceType, targetType)) {
        return;
    }

    if (targetType->IsArrayType() && sourceNode->IsArrayExpression()) {
        ArrayElaborationContext(this, targetType, sourceType, sourceNode, pos).Start();
    } else if (targetType->IsObjectType() || targetType->IsUnionType()) {
        if (sourceNode->IsObjectExpression()) {
            ObjectElaborationContext(this, targetType, sourceType, sourceNode, pos).Start();
        } else if (sourceNode->IsArrayExpression()) {
            ArrayElaborationContext(this, targetType, sourceType, sourceNode, pos).Start();
        }
    }

    ThrowAssignmentError(sourceType, targetType, pos);
}

void Checker::InferSimpleVariableDeclaratorType(const ir::VariableDeclarator *declarator)
{
    ASSERT(declarator->Id()->IsIdentifier());

    binder::Variable *var = declarator->Id()->AsIdentifier()->Variable();
    ASSERT(var);

    if (declarator->Id()->AsIdentifier()->TypeAnnotation()) {
        var->SetTsType(declarator->Id()->AsIdentifier()->TypeAnnotation()->AsTypeNode()->GetType(this));
        return;
    }

    if (declarator->Init()) {
        var->SetTsType(CheckTypeCached(declarator->Init()));
        return;
    }

    ThrowTypeError({"Variable ", declarator->Id()->AsIdentifier()->Name(), " implicitly has an any type."},
                   declarator->Id()->Start());
}

Type *Checker::GetTypeOfVariable(binder::Variable *var)
{
    if (var->TsType()) {
        return var->TsType();
    }

    const binder::Decl *decl = var->Declaration();

    if (!typeStack_.insert(decl->Node()).second) {
        ThrowTypeError({"'", var->Name(),
                        "' is referenced directly or indirectly in its "
                        "own initializer ot type annotation."},
                       decl->Node()->Start());
    }

    switch (decl->Type()) {
        case binder::DeclType::CONST:
        case binder::DeclType::LET: {
            if (!decl->Node()->Parent()->IsTSTypeQuery()) {
                ThrowTypeError({"Block-scoped variable '", var->Name(), "' used before its declaration"},
                               decl->Node()->Start());
                break;
            }

            [[fallthrough]];
        }
        case binder::DeclType::VAR: {
            const ir::AstNode *declarator = FindAncestorGivenByType(decl->Node(), ir::AstNodeType::VARIABLE_DECLARATOR);
            ASSERT(declarator);

            if (declarator->AsVariableDeclarator()->Id()->IsIdentifier()) {
                InferSimpleVariableDeclaratorType(declarator->AsVariableDeclarator());
                break;
            }

            declarator->Check(this);
            break;
        }
        case binder::DeclType::PROPERTY: {
            var->SetTsType(decl->Node()->AsTSPropertySignature()->TypeAnnotation()->AsTypeNode()->GetType(this));
            break;
        }
        case binder::DeclType::METHOD: {
            auto *signatureInfo = allocator_->New<checker::SignatureInfo>(allocator_);
            auto *callSignature = allocator_->New<checker::Signature>(signatureInfo, GlobalAnyType());
            var->SetTsType(CreateFunctionTypeWithSignature(callSignature));
            break;
        }
        case binder::DeclType::FUNC: {
            checker::ScopeContext scopeCtx(this, decl->Node()->AsScriptFunction()->Scope());
            InferFunctionDeclarationType(decl->AsFunctionDecl(), var);
            break;
        }
        case binder::DeclType::PARAM: {
            const ir::AstNode *declaration = FindAncestorUntilGivenType(decl->Node(), ir::AstNodeType::SCRIPT_FUNCTION);

            if (declaration->IsIdentifier()) {
                const ir::Identifier *ident = declaration->AsIdentifier();
                if (ident->TypeAnnotation()) {
                    ASSERT(ident->Variable() == var);
                    var->SetTsType(ident->TypeAnnotation()->AsTypeNode()->GetType(this));
                    break;
                }

                ThrowTypeError({"Parameter ", ident->Name(), " implicitly has an 'any' type."}, ident->Start());
            }

            if (declaration->IsAssignmentPattern() && declaration->AsAssignmentPattern()->Left()->IsIdentifier()) {
                const ir::Identifier *ident = declaration->AsAssignmentPattern()->Left()->AsIdentifier();

                if (ident->TypeAnnotation()) {
                    ASSERT(ident->Variable() == var);
                    var->SetTsType(ident->TypeAnnotation()->AsTypeNode()->GetType(this));
                    break;
                }

                var->SetTsType(declaration->AsAssignmentPattern()->Right()->Check(this));
            }

            CheckFunctionParameter(declaration->AsExpression(), nullptr);
            break;
        }
        case binder::DeclType::ENUM: {
            ASSERT(var->IsEnumVariable());
            binder::EnumVariable *enumVar = var->AsEnumVariable();

            if (std::holds_alternative<bool>(enumVar->Value())) {
                ThrowTypeError(
                    "A member initializer in a enum declaration cannot reference members declared after it, "
                    "including "
                    "members defined in other enums.",
                    decl->Node()->Start());
            }

            var->SetTsType(std::holds_alternative<double>(enumVar->Value()) ? GlobalNumberType() : GlobalStringType());
            break;
        }
        case binder::DeclType::ENUM_LITERAL: {
            UNREACHABLE();  // TODO(aszilagyi)
        }
        default: {
            break;
        }
    }

    typeStack_.erase(decl->Node());
    return var->TsType();
}

Type *Checker::GetTypeFromClassOrInterfaceReference([[maybe_unused]] const ir::TSTypeReference *node,
                                                    binder::Variable *var)
{
    Type *resolvedType = var->TsType();

    if (!resolvedType) {
        ObjectDescriptor *desc = allocator_->New<ObjectDescriptor>(allocator_);
        resolvedType = allocator_->New<InterfaceType>(allocator_, var->Name(), desc);
        resolvedType->SetVariable(var);
        var->SetTsType(resolvedType);
    }

    return resolvedType;
}

Type *Checker::GetTypeFromTypeAliasReference(const ir::TSTypeReference *node, binder::Variable *var)
{
    Type *resolvedType = var->TsType();

    if (!resolvedType) {
        if (!typeStack_.insert(var).second) {
            ThrowTypeError({"Type alias ", var->Name(), " circularly refences itself"}, node->Start());
        }

        ASSERT(var->Declaration()->Node() && var->Declaration()->Node()->IsTSTypeAliasDeclaration());
        const ir::TSTypeAliasDeclaration *declaration = var->Declaration()->Node()->AsTSTypeAliasDeclaration();
        resolvedType = declaration->TypeAnnotation()->AsTypeNode()->GetType(this);
        var->SetTsType(resolvedType);

        typeStack_.erase(var);
    }

    return resolvedType;
}

Type *Checker::GetTypeReferenceType(const ir::TSTypeReference *node, binder::Variable *var)
{
    ASSERT(var->Declaration());
    binder::Decl *decl = var->Declaration();

    if (decl->IsInterfaceDecl()) {
        return GetTypeFromClassOrInterfaceReference(node, var);
    }

    if (decl->IsTypeAliasDecl()) {
        return GetTypeFromTypeAliasReference(node, var);
    }

    ThrowTypeError("This reference refers to a value, but is beign used as a type here. Did you mean to use 'typeof'?",
                   node->Start());
    return nullptr;
}

}  // namespace panda::es2panda::checker
