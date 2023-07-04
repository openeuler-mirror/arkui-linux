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

#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/callExpression.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/literals/bigIntLiteral.h>
#include <ir/statements/blockStatement.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/property.h>
#include <ir/base/spreadElement.h>
#include <ir/typeNode.h>

#include <ir/statements/returnStatement.h>
#include <ir/statements/functionDeclaration.h>
#include <binder/variable.h>
#include <binder/scope.h>
#include <binder/declaration.h>

#include <util/helpers.h>

#include <typescript/checker.h>
#include <typescript/core/destructuringContext.h>
#include <typescript/types/objectDescriptor.h>
#include <typescript/types/objectType.h>

#include <cstddef>
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

namespace panda::es2panda::checker {
Type *Checker::HandleFunctionReturn(const ir::ScriptFunction *func)
{
    if (func->ReturnTypeAnnotation()) {
        func->ReturnTypeAnnotation()->Check(this);
        Type *returnType = func->ReturnTypeAnnotation()->AsTypeNode()->GetType(this);

        if (func->IsArrow() && func->Body()->IsExpression()) {
            ElaborateElementwise(returnType, func->Body()->AsExpression(), func->Body()->Start());
        }

        if (returnType->IsNeverType()) {
            ThrowTypeError("A function returning 'never' cannot have a reachable end point.",
                           func->ReturnTypeAnnotation()->Start());
        }

        if (!MaybeTypeOfKind(returnType, TypeFlag::ANY_OR_VOID)) {
            CheckAllCodePathsInNonVoidFunctionReturnOrThrow(
                func, func->ReturnTypeAnnotation()->Start(),
                "A function whose declared type is neither 'void' nor 'any' must return a value.");
        }

        return returnType;
    }

    if (func->Declare()) {
        return GlobalAnyType();
    }

    if (func->IsArrow() && func->Body()->IsExpression()) {
        return func->Body()->Check(this);
    }

    ArenaVector<Type *> returnTypes(allocator_->Adapter());
    CollectTypesFromReturnStatements(func->Body(), &returnTypes);

    if (returnTypes.empty()) {
        return GlobalVoidType();
    }

    if (returnTypes.size() == 1 && returnTypes[0] == GlobalResolvingReturnType()) {
        ThrowReturnTypeCircularityError(func);
    }

    for (auto *it : returnTypes) {
        if (it == GlobalResolvingReturnType()) {
            ThrowReturnTypeCircularityError(func);
        }
    }

    return CreateUnionType(std::move(returnTypes));
}

void Checker::ThrowReturnTypeCircularityError(const ir::ScriptFunction *func)
{
    if (func->ReturnTypeAnnotation()) {
        ThrowTypeError("Return type annotation circularly reference itself", func->ReturnTypeAnnotation()->Start());
    }

    if (func->Id()) {
        ThrowTypeError({func->Id()->AsIdentifier()->Name(),
                        " implicitly has return type 'any' because it does not have a return type annotation and is "
                        "referenced directly or indirectly in one of its return expressions."},
                       func->Id()->Start());
    }

    ThrowTypeError(
        "Function implicitly has return type 'any' because it does not have a return type annotation and is "
        "referenced directly or indirectly in one of its return expressions.",
        func->Start());
}

std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> Checker::CheckFunctionIdentifierParameter(
    const ir::Identifier *param)
{
    ASSERT(param->Variable());
    binder::Variable *paramVar = param->Variable();
    bool isOptional = param->IsOptional();

    if (!param->TypeAnnotation()) {
        ThrowTypeError({"Parameter ", param->Name(), " implicitly has any type."}, param->Start());
    }

    if (isOptional) {
        paramVar->AddFlag(binder::VariableFlags::OPTIONAL);
    }

    param->TypeAnnotation()->Check(this);
    paramVar->SetTsType(param->TypeAnnotation()->AsTypeNode()->GetType(this));
    return {paramVar->AsLocalVariable(), nullptr, isOptional};
}

Type *Checker::CreateParameterTypeForArrayAssignmentPattern(const ir::ArrayExpression *arrayPattern, Type *inferedType)
{
    if (!inferedType->IsObjectType()) {
        return inferedType;
    }

    ASSERT(inferedType->AsObjectType()->IsTupleType());
    TupleType *inferedTuple = inferedType->AsObjectType()->AsTupleType();

    if (inferedTuple->FixedLength() > arrayPattern->Elements().size()) {
        return inferedType;
    }

    TupleType *newTuple = inferedTuple->Instantiate(allocator_, relation_, globalTypes_)->AsObjectType()->AsTupleType();

    for (uint32_t index = inferedTuple->FixedLength(); index < arrayPattern->Elements().size(); index++) {
        util::StringView memberIndex = util::Helpers::ToStringView(allocator_, index);
        binder::LocalVariable *newMember = binder::Scope::CreateVar(
            allocator_, memberIndex, binder::VariableFlags::PROPERTY | binder::VariableFlags::OPTIONAL, nullptr);
        newMember->SetTsType(GlobalAnyType());
        newTuple->AddProperty(newMember);
    }

    return newTuple;
}

Type *Checker::CreateParameterTypeForObjectAssignmentPattern(const ir::ObjectExpression *objectPattern,
                                                             Type *inferedType)
{
    if (!inferedType->IsObjectType()) {
        return inferedType;
    }

    ObjectType *newObject = inferedType->Instantiate(allocator_, relation_, globalTypes_)->AsObjectType();

    for (const auto *it : objectPattern->Properties()) {
        if (it->IsRestElement()) {
            continue;
        }

        const ir::Property *prop = it->AsProperty();
        binder::LocalVariable *foundVar = newObject->GetProperty(prop->Key()->AsIdentifier()->Name(), true);

        if (foundVar) {
            if (prop->Value()->IsAssignmentPattern()) {
                foundVar->AddFlag(binder::VariableFlags::OPTIONAL);
            }

            continue;
        }

        ASSERT(prop->Value()->IsAssignmentPattern());
        const ir::AssignmentExpression *assignmentPattern = prop->Value()->AsAssignmentPattern();

        binder::LocalVariable *newProp =
            binder::Scope::CreateVar(allocator_, prop->Key()->AsIdentifier()->Name(),
                                     binder::VariableFlags::PROPERTY | binder::VariableFlags::OPTIONAL, nullptr);
        newProp->SetTsType(GetBaseTypeOfLiteralType(CheckTypeCached(assignmentPattern->Right())));
        newObject->AddProperty(newProp);
    }

    newObject->AddObjectFlag(ObjectFlags::RESOLVED_MEMBERS);
    return newObject;
}

std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> Checker::CheckFunctionAssignmentPatternParameter(
    const ir::AssignmentExpression *param)
{
    if (param->Left()->IsIdentifier()) {
        const ir::Identifier *paramIdent = param->Left()->AsIdentifier();
        binder::Variable *paramVar = paramIdent->Variable();
        ASSERT(paramVar);

        if (paramIdent->TypeAnnotation()) {
            paramIdent->TypeAnnotation()->Check(this);
            Type *paramType = paramIdent->TypeAnnotation()->AsTypeNode()->GetType(this);
            paramVar->SetTsType(paramType);
            ElaborateElementwise(paramType, param->Right(), paramIdent->Start());
            return {paramVar->AsLocalVariable(), nullptr, true};
        }

        paramVar->SetTsType(GetBaseTypeOfLiteralType(param->Right()->Check(this)));
        paramVar->AddFlag(binder::VariableFlags::OPTIONAL);
        return {paramVar->AsLocalVariable(), nullptr, true};
    }

    Type *paramType = nullptr;
    std::stringstream ss;

    auto savedContext = SavedCheckerContext(this, CheckerStatus::FORCE_TUPLE | CheckerStatus::IN_PARAMETER);

    if (param->Left()->IsArrayPattern()) {
        const ir::ArrayExpression *arrayPattern = param->Left()->AsArrayPattern();
        auto context =
            ArrayDestructuringContext(this, arrayPattern, false, true, arrayPattern->TypeAnnotation(), param->Right());
        context.Start();
        paramType = CreateParameterTypeForArrayAssignmentPattern(arrayPattern, context.InferedType());
        CreatePatternParameterName(param->Left(), ss);
    } else {
        const ir::ObjectExpression *objectPattern = param->Left()->AsObjectPattern();
        auto context = ObjectDestructuringContext(this, objectPattern, false, true, objectPattern->TypeAnnotation(),
                                                  param->Right());
        context.Start();
        paramType = CreateParameterTypeForObjectAssignmentPattern(objectPattern, context.InferedType());
        CreatePatternParameterName(param->Left(), ss);
    }

    util::UString pn(ss.str(), allocator_);
    binder::LocalVariable *patternVar =
        binder::Scope::CreateVar(allocator_, pn.View(), binder::VariableFlags::NONE, param);
    patternVar->SetTsType(paramType);
    patternVar->AddFlag(binder::VariableFlags::OPTIONAL);
    return {patternVar->AsLocalVariable(), nullptr, true};
}

std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> Checker::CheckFunctionRestParameter(
    const ir::SpreadElement *param, SignatureInfo *signatureInfo)
{
    const ir::Expression *typeAnnotation = nullptr;
    switch (param->Argument()->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            typeAnnotation = param->Argument()->AsIdentifier()->TypeAnnotation();
            break;
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            typeAnnotation = param->Argument()->AsArrayPattern()->TypeAnnotation();
            break;
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            typeAnnotation = param->Argument()->AsObjectPattern()->TypeAnnotation();
            break;
        }
        default: {
            UNREACHABLE();
        }
    }

    Type *restType = allocator_->New<ArrayType>(GlobalAnyType());

    if (typeAnnotation) {
        typeAnnotation->Check(this);
        restType = typeAnnotation->AsTypeNode()->GetType(this);

        if (!restType->IsArrayType()) {
            // TODO(aszilagyi): handle tuple type for rest
            ThrowTypeError("A rest parameter must be of an array type", param->Start());
        }
    }

    switch (param->Argument()->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            const ir::Identifier *restIdent = param->Argument()->AsIdentifier();
            ASSERT(restIdent->Variable());
            restIdent->Variable()->SetTsType(restType->AsArrayType()->ElementType());
            return {nullptr, restIdent->Variable()->AsLocalVariable(), false};
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            ASSERT(param->Argument()->IsObjectPattern());
            auto savedContext = SavedCheckerContext(this, CheckerStatus::FORCE_TUPLE);
            auto destructuringContext =
                ObjectDestructuringContext(this, param->Argument(), false, false, nullptr, nullptr);
            destructuringContext.SetInferedType(restType);
            destructuringContext.SetSignatureInfo(signatureInfo);
            destructuringContext.Start();
            return {nullptr, nullptr, false};
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            auto savedContext = SavedCheckerContext(this, CheckerStatus::FORCE_TUPLE);
            auto destructuringContext =
                ArrayDestructuringContext(this, param->Argument(), false, false, nullptr, nullptr);
            destructuringContext.SetInferedType(restType);
            destructuringContext.SetSignatureInfo(signatureInfo);
            destructuringContext.Start();
            return {nullptr, nullptr, false};
        }
        default: {
            UNREACHABLE();
        }
    }
}

std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> Checker::CheckFunctionArrayPatternParameter(
    const ir::ArrayExpression *param)
{
    std::stringstream ss;
    CreatePatternParameterName(param, ss);
    util::UString pn(ss.str(), allocator_);
    binder::LocalVariable *patternVar =
        binder::Scope::CreateVar(allocator_, pn.View(), binder::VariableFlags::NONE, param);

    if (param->TypeAnnotation()) {
        auto savedContext = SavedCheckerContext(this, CheckerStatus::FORCE_TUPLE);
        auto destructuringContext =
            ArrayDestructuringContext(this, param->AsArrayPattern(), false, false, param->TypeAnnotation(), nullptr);
        destructuringContext.Start();
        patternVar->SetTsType(destructuringContext.InferedType());
        return {patternVar->AsLocalVariable(), nullptr, false};
    }

    patternVar->SetTsType(param->CheckPattern(this));
    return {patternVar->AsLocalVariable(), nullptr, false};
}

std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> Checker::CheckFunctionObjectPatternParameter(
    const ir::ObjectExpression *param)
{
    std::stringstream ss;
    CreatePatternParameterName(param, ss);
    util::UString pn(ss.str(), allocator_);
    binder::LocalVariable *patternVar =
        binder::Scope::CreateVar(allocator_, pn.View(), binder::VariableFlags::NONE, param);

    if (param->TypeAnnotation()) {
        auto savedContext = SavedCheckerContext(this, CheckerStatus::FORCE_TUPLE);
        auto destructuringContext =
            ObjectDestructuringContext(this, param->AsObjectPattern(), false, false, param->TypeAnnotation(), nullptr);
        destructuringContext.Start();
        patternVar->SetTsType(destructuringContext.InferedType());
        return {patternVar->AsLocalVariable(), nullptr, false};
    }

    patternVar->SetTsType(param->CheckPattern(this));
    return {patternVar->AsLocalVariable(), nullptr, false};
}

std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> Checker::CheckFunctionParameter(
    const ir::Expression *param, SignatureInfo *signatureInfo)
{
    auto found = nodeCache_.find(param);

    if (found != nodeCache_.end()) {
        ASSERT(found->second->Variable());
        binder::Variable *var = found->second->Variable();
        return {var->AsLocalVariable(), nullptr, var->HasFlag(binder::VariableFlags::OPTIONAL)};
    }

    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> result;
    bool cache = true;

    switch (param->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            result = CheckFunctionIdentifierParameter(param->AsIdentifier());
            break;
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            result = CheckFunctionAssignmentPatternParameter(param->AsAssignmentPattern());
            break;
        }
        case ir::AstNodeType::REST_ELEMENT: {
            result = CheckFunctionRestParameter(param->AsRestElement(), signatureInfo);
            cache = false;
            break;
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            result = CheckFunctionArrayPatternParameter(param->AsArrayPattern());
            break;
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            result = CheckFunctionObjectPatternParameter(param->AsObjectPattern());
            break;
        }
        default: {
            UNREACHABLE();
        }
    }

    if (cache) {
        Type *placeholder = allocator_->New<ArrayType>(GlobalAnyType());
        placeholder->SetVariable(std::get<0>(result));
        nodeCache_.insert({param, placeholder});
    }

    return result;
}

void Checker::CheckFunctionParameterDeclarations(const ArenaVector<ir::Expression *> &params,
                                                 SignatureInfo *signatureInfo)
{
    signatureInfo->restVar = nullptr;
    signatureInfo->minArgCount = 0;

    for (auto it = params.rbegin(); it != params.rend(); it++) {
        auto [paramVar, restVar, isOptional] = CheckFunctionParameter(*it, signatureInfo);

        if (restVar) {
            signatureInfo->restVar = restVar;
            continue;
        }

        if (!paramVar) {
            continue;
        }

        signatureInfo->params.insert(signatureInfo->params.begin(), paramVar);

        if (!isOptional) {
            signatureInfo->minArgCount++;
        }
    }
}

bool ShouldCreatePropertyValueName(const ir::Expression *propValue)
{
    return propValue->IsArrayPattern() || propValue->IsObjectPattern() ||
           (propValue->IsAssignmentPattern() && (propValue->AsAssignmentPattern()->Left()->IsArrayPattern() ||
                                                  propValue->AsAssignmentPattern()->Left()->IsObjectPattern()));
}

void Checker::CreatePatternParameterName(const ir::AstNode *node, std::stringstream &ss)
{
    switch (node->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            ss << node->AsIdentifier()->Name();
            break;
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            ss << "[";

            const auto &elements = node->AsArrayPattern()->Elements();
            for (auto it = elements.begin(); it != elements.end(); it++) {
                CreatePatternParameterName(*it, ss);
                if (std::next(it) != elements.end()) {
                    ss << ", ";
                }
            }

            ss << "]";
            break;
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            ss << "{ ";

            const auto &properties = node->AsObjectPattern()->Properties();
            for (auto it = properties.begin(); it != properties.end(); it++) {
                CreatePatternParameterName(*it, ss);
                if (std::next(it) != properties.end()) {
                    ss << ", ";
                }
            }

            ss << " }";
            break;
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            CreatePatternParameterName(node->AsAssignmentPattern()->Left(), ss);
            break;
        }
        case ir::AstNodeType::PROPERTY: {
            const ir::Property *prop = node->AsProperty();
            util::StringView propName;

            if (prop->Key()->IsIdentifier()) {
                propName = prop->Key()->AsIdentifier()->Name();
            } else {
                switch (prop->Key()->Type()) {
                    case ir::AstNodeType::NUMBER_LITERAL: {
                        propName = util::Helpers::ToStringView(allocator_, prop->Key()->AsNumberLiteral()->Number());
                        break;
                    }
                    case ir::AstNodeType::BIGINT_LITERAL: {
                        propName = prop->Key()->AsBigIntLiteral()->Str();
                        break;
                    }
                    case ir::AstNodeType::STRING_LITERAL: {
                        propName = prop->Key()->AsStringLiteral()->Str();
                        break;
                    }
                    default: {
                        UNREACHABLE();
                        break;
                    }
                }
            }

            ss << propName;

            if (ShouldCreatePropertyValueName(prop->Value())) {
                ss << ": ";
                Checker::CreatePatternParameterName(prop->Value(), ss);
            }

            break;
        }
        case ir::AstNodeType::REST_ELEMENT: {
            ss << "...";
            Checker::CreatePatternParameterName(node->AsRestElement()->Argument(), ss);
            break;
        }
        default:
            break;
    }
}

const ir::Statement *FindSubsequentFunctionNode(const ir::BlockStatement *block, const ir::ScriptFunction *node)
{
    for (auto it = block->Statements().begin(); it != block->Statements().end(); it++) {
        if ((*it)->IsFunctionDeclaration() && (*it)->AsFunctionDeclaration()->Function() == node) {
            return *(++it);
        }
    }

    UNREACHABLE();
    return nullptr;
}

void Checker::InferFunctionDeclarationType(const binder::FunctionDecl *decl, binder::Variable *funcVar)
{
    const ir::ScriptFunction *bodyDeclaration = decl->Decls().back();

    if (bodyDeclaration->IsOverload()) {
        ThrowTypeError("Function implementation is missing or not immediately following the declaration.",
                       bodyDeclaration->Id()->Start());
    }

    ObjectDescriptor *descWithOverload = allocator_->New<ObjectDescriptor>(allocator_);

    for (auto it = decl->Decls().begin(); it != decl->Decls().end() - 1; it++) {
        const ir::ScriptFunction *func = *it;
        ASSERT(func->IsOverload() && (*it)->Parent()->Parent()->IsBlockStatement());
        const ir::Statement *subsequentNode =
            FindSubsequentFunctionNode((*it)->Parent()->Parent()->AsBlockStatement(), func);
        ASSERT(subsequentNode);

        if (!subsequentNode->IsFunctionDeclaration()) {
            ThrowTypeError("Function implementation is missing or not immediately following the declaration.",
                           func->Id()->Start());
        }

        const ir::ScriptFunction *subsequentFunc = subsequentNode->AsFunctionDeclaration()->Function();

        if (subsequentFunc->Id()->Name() != func->Id()->Name()) {
            ThrowTypeError("Function implementation is missing or not immediately following the declaration.",
                           func->Id()->Start());
        }

        if (subsequentFunc->Declare() != func->Declare()) {
            ThrowTypeError("Overload signatures must all be ambient or non-ambient.", func->Id()->Start());
        }

        ScopeContext scopeCtx(this, func->Scope());

        auto *overloadSignatureInfo = allocator_->New<checker::SignatureInfo>(allocator_);
        CheckFunctionParameterDeclarations(func->Params(), overloadSignatureInfo);

        Type *returnType = GlobalAnyType();

        if (func->ReturnTypeAnnotation()) {
            func->ReturnTypeAnnotation()->Check(this);
            returnType = func->ReturnTypeAnnotation()->AsTypeNode()->GetType(this);
        }

        Signature *overloadSignature = allocator_->New<checker::Signature>(overloadSignatureInfo, returnType);
        overloadSignature->SetNode(func);
        descWithOverload->callSignatures.push_back(overloadSignature);
    }

    ScopeContext scopeCtx(this, bodyDeclaration->Scope());

    auto *signatureInfo = allocator_->New<checker::SignatureInfo>(allocator_);
    CheckFunctionParameterDeclarations(bodyDeclaration->Params(), signatureInfo);
    auto *bodyCallSignature = allocator_->New<checker::Signature>(signatureInfo, GlobalResolvingReturnType());

    if (descWithOverload->callSignatures.empty()) {
        Type *funcType = CreateFunctionTypeWithSignature(bodyCallSignature);
        funcType->SetVariable(funcVar);
        funcVar->SetTsType(funcType);
    }

    bodyCallSignature->SetReturnType(HandleFunctionReturn(bodyDeclaration));

    if (!descWithOverload->callSignatures.empty()) {
        Type *funcType = allocator_->New<FunctionType>(descWithOverload);
        funcType->SetVariable(funcVar);
        funcVar->SetTsType(funcType);

        for (auto *iter : descWithOverload->callSignatures) {
            if (bodyCallSignature->ReturnType()->IsVoidType() ||
                IsTypeAssignableTo(bodyCallSignature->ReturnType(), iter->ReturnType()) ||
                IsTypeAssignableTo(iter->ReturnType(), bodyCallSignature->ReturnType())) {
                bodyCallSignature->AssignmentTarget(relation_, iter);

                if (relation_->IsTrue()) {
                    continue;
                }
            }

            ASSERT(iter->Node() && iter->Node()->IsScriptFunction());
            ThrowTypeError("This overload signature is not compatible with its implementation signature",
                           iter->Node()->AsScriptFunction()->Id()->Start());
        }
    }
}

void Checker::CollectTypesFromReturnStatements(const ir::AstNode *parent, ArenaVector<Type *> *returnTypes)
{
    parent->Iterate([this, returnTypes](ir::AstNode *childNode) -> void {
        if (childNode->IsScriptFunction()) {
            return;
        }

        if (childNode->IsReturnStatement()) {
            ir::ReturnStatement *returnStmt = childNode->AsReturnStatement();

            if (!returnStmt->Argument()) {
                return;
            }

            returnTypes->push_back(
                GetBaseTypeOfLiteralType(CheckTypeCached(childNode->AsReturnStatement()->Argument())));
        }

        CollectTypesFromReturnStatements(childNode, returnTypes);
    });
}

static bool SearchForReturnOrThrow(const ir::AstNode *parent)
{
    bool found = false;

    parent->Iterate([&found](const ir::AstNode *childNode) -> void {
        if (childNode->IsThrowStatement() || childNode->IsReturnStatement()) {
            found = true;
            return;
        }

        if (childNode->IsScriptFunction()) {
            return;
        }

        SearchForReturnOrThrow(childNode);
    });

    return found;
}

void Checker::CheckAllCodePathsInNonVoidFunctionReturnOrThrow(const ir::ScriptFunction *func,
                                                              lexer::SourcePosition lineInfo, const char *errMsg)
{
    if (!SearchForReturnOrThrow(func->Body())) {
        ThrowTypeError(errMsg, lineInfo);
    }
    // TODO(aszilagyi): this function is not fully implement the TSC one, in the future if we will have a
    // noImplicitReturn compiler option for TypeScript we should update this function
}

ArgRange Checker::GetArgRange(const ArenaVector<Signature *> &signatures, ArenaVector<Signature *> *potentialSignatures,
                              uint32_t callArgsSize, bool *haveSignatureWithRest)
{
    uint32_t minArg = UINT32_MAX;
    uint32_t maxArg = 0;

    for (auto *it : signatures) {
        if (it->RestVar()) {
            *haveSignatureWithRest = true;
        }

        if (it->MinArgCount() < minArg) {
            minArg = it->MinArgCount();
        }

        if (it->Params().size() > maxArg) {
            maxArg = it->Params().size();
        }

        if (callArgsSize >= it->MinArgCount() && (callArgsSize <= it->Params().size() || it->RestVar())) {
            potentialSignatures->push_back(it);
        }
    }

    return {minArg, maxArg};
}

bool Checker::CallMatchesSignature(const ArenaVector<ir::Expression *> &args, Signature *signature, bool throwError)
{
    for (size_t index = 0; index < args.size(); index++) {
        checker::Type *sigArgType = nullptr;
        bool validateRestArg = false;

        if (index >= signature->Params().size()) {
            ASSERT(signature->RestVar());
            validateRestArg = true;
            sigArgType = signature->RestVar()->TsType();
        } else {
            sigArgType = signature->Params()[index]->TsType();
        }

        if (validateRestArg || !throwError) {
            checker::Type *callArgType = GetBaseTypeOfLiteralType(args[index]->Check(this));
            if (!IsTypeAssignableTo(callArgType, sigArgType)) {
                if (throwError) {
                    ThrowTypeError({"Argument of type '", callArgType, "' is not assignable to parameter of type '",
                                    sigArgType, "'."},
                                   args[index]->Start());
                }

                return false;
            }

            continue;
        }

        ElaborateElementwise(sigArgType, args[index], args[index]->Start());
    }

    return true;
}

Type *Checker::resolveCallOrNewExpression(const ArenaVector<Signature *> &signatures,
                                          ArenaVector<ir::Expression *> arguments, const lexer::SourcePosition &errPos)
{
    if (signatures.empty()) {
        ThrowTypeError("This expression is not callable.", errPos);
    }

    ArenaVector<checker::Signature *> potentialSignatures(allocator_->Adapter());
    bool haveSignatureWithRest = false;

    auto argRange = GetArgRange(signatures, &potentialSignatures, arguments.size(), &haveSignatureWithRest);

    if (potentialSignatures.empty()) {
        if (haveSignatureWithRest) {
            ThrowTypeError({"Expected at least ", argRange.first, " arguments, but got ", arguments.size(), "."},
                           errPos);
        }

        if (signatures.size() == 1 && argRange.first == argRange.second) {
            lexer::SourcePosition loc =
                (argRange.first > arguments.size()) ? errPos : arguments[argRange.second]->Start();
            ThrowTypeError({"Expected ", argRange.first, " arguments, but got ", arguments.size(), "."}, loc);
        }

        ThrowTypeError({"Expected ", argRange.first, "-", argRange.second, " arguments, but got ", arguments.size()},
                       errPos);
    }

    checker::Type *returnType = nullptr;
    for (auto *it : potentialSignatures) {
        if (CallMatchesSignature(arguments, it, potentialSignatures.size() == 1)) {
            returnType = it->ReturnType();
            break;
        }
    }

    if (!returnType) {
        ThrowTypeError("No overload matches this call.", errPos);
    }

    return returnType;
}

}  // namespace panda::es2panda::checker
