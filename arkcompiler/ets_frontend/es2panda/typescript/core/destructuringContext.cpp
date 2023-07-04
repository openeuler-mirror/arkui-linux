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

#include "destructuringContext.h"

#include <util/helpers.h>
#include <binder/scope.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/base/spreadElement.h>
#include <ir/base/property.h>
#include <ir/typeNode.h>

namespace panda::es2panda::checker {
void DestructuringContext::Prepare(const ir::Expression *typeAnnotation, const ir::Expression *initializer,
                                   const lexer::SourcePosition &loc)
{
    if (typeAnnotation) {
        typeAnnotation->Check(checker_);
        Type *annotationType = typeAnnotation->AsTypeNode()->GetType(checker_);

        if (initializer) {
            checker_->ElaborateElementwise(annotationType, initializer, loc);
        }

        validateTypeAnnotation_ = true;
        inferedType_ = annotationType;
        return;
    }

    if (initializer) {
        if (!initializer->IsObjectExpression()) {
            validateObjectPatternInitializer_ = false;
        }

        inferedType_ = initializer->Check(checker_);
    }
}

void DestructuringContext::HandleDestructuringAssignment(const ir::Identifier *ident, Type *inferedType,
                                                         Type *defaultType)
{
    if (!ident->Variable()) {
        checker_->ThrowTypeError({"Cannot find name '", ident->Name(), "'."}, ident->Start());
    }

    binder::Variable *variable = ident->Variable();
    ASSERT(variable->TsType());

    if (defaultType && !checker_->IsTypeAssignableTo(defaultType, variable->TsType())) {
        checker_->ThrowAssignmentError(defaultType, variable->TsType(), ident->Start());
    }

    if (inferedType && !checker_->IsTypeAssignableTo(inferedType, variable->TsType())) {
        checker_->ThrowAssignmentError(inferedType, variable->TsType(), ident->Start());
    }
}

void DestructuringContext::SetInferedTypeForVariable(binder::Variable *var, Type *inferedType,
                                                     const lexer::SourcePosition &loc)
{
    ASSERT(var);

    if (!checker_->HasStatus(CheckerStatus::IN_CONST_CONTEXT)) {
        inferedType = checker_->GetBaseTypeOfLiteralType(inferedType);
    }

    if (var->TsType()) {
        checker_->IsTypeIdenticalTo(var->TsType(), inferedType,
                                    {"Subsequent variable declaration must have the same type. Variable '", var->Name(),
                                     "' must be of type '", var->TsType(), "', but here has type '", inferedType, "'."},
                                    loc);
        return;
    }

    if (signatureInfo_) {
        signatureInfo_->params.push_back(var->AsLocalVariable());
        signatureInfo_->minArgCount++;
    }

    var->SetTsType(inferedType);
}

void DestructuringContext::ValidateObjectLiteralType(ObjectType *objType, const ir::ObjectExpression *objPattern)
{
    for (const auto *sourceProp : objType->Properties()) {
        const util::StringView &sourceName = sourceProp->Name();
        bool found = false;

        for (const auto *targetProp : objPattern->Properties()) {
            if (targetProp->IsRestElement()) {
                continue;
            }

            ASSERT(targetProp->IsProperty());
            const util::StringView &targetName = targetProp->AsProperty()->Key()->AsIdentifier()->Name();

            if (sourceName == targetName) {
                found = true;
                break;
            }
        }

        if (!found) {
            checker_->ThrowTypeError({"Object literal may only specify known properties, and property '", sourceName,
                                      "' does not exist in the pattern."},
                                     objPattern->Start());
        }
    }
}

void DestructuringContext::HandleAssignmentPattern(const ir::AssignmentExpression *assignmentPattern, Type *inferedType,
                                                   bool validateDefault)
{
    if (!assignmentPattern->Left()->IsArrayPattern()) {
        checker_->RemoveStatus(CheckerStatus::FORCE_TUPLE);
    }

    Type *defaultType = assignmentPattern->Right()->Check(checker_);

    if (!checker_->HasStatus(CheckerStatus::IN_CONST_CONTEXT)) {
        defaultType = checker_->GetBaseTypeOfLiteralType(defaultType);
    }

    if (validateDefault && assignmentPattern->Right()->IsObjectExpression() &&
        assignmentPattern->Left()->IsObjectPattern()) {
        ValidateObjectLiteralType(defaultType->AsObjectType(), assignmentPattern->Left()->AsObjectPattern());
    }

    Type *initType = inferedType;
    checker_->AddStatus(CheckerStatus::FORCE_TUPLE);

    if (validateTypeAnnotation_) {
        if (!inferedType) {
            inferedType = checker_->GlobalUndefinedType();
        }
    } else {
        if (!inferedType) {
            inferedType = defaultType;
        } else if (inferedType->IsUnionType()) {
            inferedType->AsUnionType()->AddConstituentType(defaultType, checker_->Relation());
        } else {
            inferedType = checker_->CreateUnionType({inferedType, defaultType});
        }
    }

    if (assignmentPattern->Left()->IsIdentifier()) {
        if (inAssignment_) {
            HandleDestructuringAssignment(assignmentPattern->Left()->AsIdentifier(), initType, defaultType);
            return;
        }

        if (validateTypeAnnotation_ && !checker_->IsTypeAssignableTo(defaultType, inferedType)) {
            checker_->ThrowAssignmentError(defaultType, inferedType, assignmentPattern->Left()->Start());
        }

        SetInferedTypeForVariable(assignmentPattern->Left()->AsIdentifier()->Variable(), inferedType,
                                  assignmentPattern->Start());
        return;
    }

    if (assignmentPattern->Left()->IsArrayPattern()) {
        ArrayDestructuringContext nextContext = ArrayDestructuringContext(
            checker_, assignmentPattern->Left(), inAssignment_, convertTupleToArray_, nullptr, nullptr);
        nextContext.SetInferedType(inferedType);
        nextContext.Start();
        return;
    }

    ASSERT(assignmentPattern->Left()->IsObjectPattern());
    ObjectDestructuringContext nextContext = ObjectDestructuringContext(
        checker_, assignmentPattern->Left(), inAssignment_, convertTupleToArray_, nullptr, nullptr);
    nextContext.SetInferedType(inferedType);
    nextContext.Start();
}

void ArrayDestructuringContext::ValidateInferedType()
{
    if (!inferedType_->IsArrayType() && !inferedType_->IsUnionType() &&
        (!inferedType_->IsObjectType() || !inferedType_->AsObjectType()->IsTupleType())) {
        checker_->ThrowTypeError(
            {"Type ", inferedType_, " must have a '[Symbol.iterator]()' method that returns an iterator."},
            id_->Start());
    }

    if (inferedType_->IsUnionType()) {
        for (auto *it : inferedType_->AsUnionType()->ConstituentTypes()) {
            if (!it->IsArrayType() && (!it->IsObjectType() || !it->AsObjectType()->IsTupleType())) {
                checker_->ThrowTypeError(
                    {"Type ", inferedType_, " must have a '[Symbol.iterator]()' method that returns an iterator."},
                    id_->Start());
            }
        }
    }
}

Type *ArrayDestructuringContext::GetTypeFromTupleByIndex(TupleType *tuple)
{
    util::StringView memberIndex = util::Helpers::ToStringView(checker_->Allocator(), index_);
    binder::Variable *memberVar = tuple->GetProperty(memberIndex, false);

    if (!memberVar) {
        return nullptr;
    }

    return memberVar->TsType();
}

Type *ArrayDestructuringContext::NextInferedType([[maybe_unused]] const util::StringView &searchName, bool throwError)
{
    if (inferedType_->IsArrayType()) {
        return inferedType_->AsArrayType()->ElementType();
    }

    if (inferedType_->IsObjectType()) {
        ASSERT(inferedType_->AsObjectType()->IsTupleType());
        Type *returnType = GetTypeFromTupleByIndex(inferedType_->AsObjectType()->AsTupleType());

        if (!returnType && throwError) {
            if (!validateTypeAnnotation_ && checker_->HasStatus(CheckerStatus::IN_PARAMETER)) {
                return returnType;
            }

            checker_->ThrowTypeError({"Tuple type ", inferedType_, " of length ",
                                      inferedType_->AsObjectType()->AsTupleType()->FixedLength(),
                                      " has no element at index ", index_, "."},
                                     id_->Start());
        }

        return returnType;
    }

    ASSERT(inferedType_->IsUnionType());

    ArenaVector<Type *> unionTypes(checker_->Allocator()->Adapter());

    for (auto *type : inferedType_->AsUnionType()->ConstituentTypes()) {
        if (type->IsArrayType()) {
            unionTypes.push_back(type->AsArrayType()->ElementType());
            continue;
        }

        ASSERT(type->IsObjectType() && type->AsObjectType()->IsTupleType());
        Type *elementType = GetTypeFromTupleByIndex(type->AsObjectType()->AsTupleType());

        if (!elementType) {
            continue;
        }

        unionTypes.push_back(elementType);
    }

    if (unionTypes.empty()) {
        if (throwError) {
            checker_->ThrowTypeError({"Property ", index_, " does not exist on type ", inferedType_, "."},
                                     id_->Start());
        }

        return nullptr;
    }

    return checker_->CreateUnionType(std::move(unionTypes));
}

Type *ArrayDestructuringContext::CreateArrayTypeForRest(UnionType *inferedType)
{
    ArenaVector<Type *> unionTypes(checker_->Allocator()->Adapter());
    uint32_t savedIdx = index_;

    for (auto *it : inferedType->ConstituentTypes()) {
        if (it->IsArrayType()) {
            unionTypes.push_back(it->AsArrayType()->ElementType());
            continue;
        }

        ASSERT(it->IsObjectType() && it->AsObjectType()->IsTupleType());
        Type *tupleElementType = GetTypeFromTupleByIndex(it->AsObjectType()->AsTupleType());

        while (tupleElementType) {
            unionTypes.push_back(tupleElementType);
            index_++;
            tupleElementType = GetTypeFromTupleByIndex(it->AsObjectType()->AsTupleType());
        }

        index_ = savedIdx;
    }

    Type *restArrayElementType = checker_->CreateUnionType(std::move(unionTypes));
    return checker_->Allocator()->New<ArrayType>(restArrayElementType);
}

Type *ArrayDestructuringContext::CreateTupleTypeForRest(TupleType *tuple)
{
    ObjectDescriptor *desc = checker_->Allocator()->New<ObjectDescriptor>(checker_->Allocator());
    ArenaVector<ElementFlags> elementFlags(checker_->Allocator()->Adapter());
    uint32_t savedIdx = index_;
    uint32_t iterIndex = 0;

    Type *tupleElementType = GetTypeFromTupleByIndex(tuple);

    while (tupleElementType) {
        ElementFlags memberFlag = ElementFlags::REQUIRED;
        util::StringView memberIndex = util::Helpers::ToStringView(checker_->Allocator(), iterIndex);
        auto *memberVar =
            binder::Scope::CreateVar(checker_->Allocator(), memberIndex, binder::VariableFlags::PROPERTY, nullptr);
        memberVar->SetTsType(tupleElementType);
        elementFlags.push_back(memberFlag);
        desc->properties.push_back(memberVar);

        index_++;
        iterIndex++;

        tupleElementType = GetTypeFromTupleByIndex(tuple);
    }

    index_ = savedIdx;
    return checker_->CreateTupleType(desc, std::move(elementFlags), ElementFlags::REQUIRED, iterIndex, iterIndex,
                                     false);
}

Type *ArrayDestructuringContext::GetRestType([[maybe_unused]] const lexer::SourcePosition &loc)
{
    if (inferedType_->IsArrayType()) {
        return inferedType_;
    }

    if (inferedType_->IsObjectType() && inferedType_->AsObjectType()->IsTupleType()) {
        return CreateTupleTypeForRest(inferedType_->AsObjectType()->AsTupleType());
    }

    ASSERT(inferedType_->IsUnionType());
    bool createArrayType = false;

    for (auto *it : inferedType_->AsUnionType()->ConstituentTypes()) {
        if (it->IsArrayType()) {
            createArrayType = true;
            break;
        }
    }

    if (createArrayType) {
        return CreateArrayTypeForRest(inferedType_->AsUnionType());
    }

    ArenaVector<Type *> tupleUnion(checker_->Allocator()->Adapter());

    for (auto *it : inferedType_->AsUnionType()->ConstituentTypes()) {
        ASSERT(it->IsObjectType() && it->AsObjectType()->IsTupleType());
        Type *newTuple = CreateTupleTypeForRest(it->AsObjectType()->AsTupleType());
        tupleUnion.push_back(newTuple);
    }

    return checker_->CreateUnionType(std::move(tupleUnion));
}

void ArrayDestructuringContext::HandleRest(const ir::SpreadElement *rest)
{
    Type *inferedRestType = GetRestType(rest->Start());

    if (rest->Argument()->IsIdentifier()) {
        if (inAssignment_) {
            HandleDestructuringAssignment(rest->Argument()->AsIdentifier(), inferedRestType, nullptr);
            return;
        }

        SetInferedTypeForVariable(rest->Argument()->AsIdentifier()->Variable(), inferedRestType, rest->Start());
        return;
    }

    if (rest->Argument()->IsArrayPattern()) {
        ArrayDestructuringContext nextContext = ArrayDestructuringContext(checker_, rest->Argument(), inAssignment_,
                                                                          convertTupleToArray_, nullptr, nullptr);
        nextContext.SetInferedType(inferedRestType);
        nextContext.Start();
        return;
    }

    ASSERT(rest->Argument()->IsObjectPattern());
    ObjectDestructuringContext nextContext =
        ObjectDestructuringContext(checker_, rest->Argument(), inAssignment_, convertTupleToArray_, nullptr, nullptr);
    nextContext.SetInferedType(inferedRestType);
    nextContext.Start();
}

Type *ArrayDestructuringContext::ConvertTupleTypeToArrayTypeIfNecessary(const ir::AstNode *node, Type *type)
{
    if (!convertTupleToArray_) {
        return type;
    }

    if (!type) {
        return type;
    }

    if (node->IsArrayPattern() ||
        (node->IsAssignmentPattern() && node->AsAssignmentPattern()->Left()->IsArrayPattern())) {
        return type;
    }

    if (type->IsObjectType() && type->AsObjectType()->IsTupleType()) {
        return type->AsObjectType()->AsTupleType()->ConvertToArrayType(checker_);
    }

    return type;
}

static void SetParameterType(const ir::AstNode *parent, Type *type)
{
    parent->Iterate([type](ir::AstNode *childNode) -> void {
        if (childNode->IsIdentifier() && childNode->AsIdentifier()->Variable()) {
            childNode->AsIdentifier()->Variable()->SetTsType(type);
            return;
        }

        SetParameterType(childNode, type);
    });
}

void ArrayDestructuringContext::SetRemainingPatameterTypes()
{
    do {
        const auto *it = id_->AsArrayPattern()->Elements()[index_];
        ASSERT(it);
        SetParameterType(it, checker_->GlobalAnyType());
    } while (++index_ != id_->AsArrayPattern()->Elements().size());
}

void ArrayDestructuringContext::Start()
{
    ASSERT(id_->IsArrayPattern());

    ValidateInferedType();

    util::StringView name = util::Helpers::ToStringView(checker_->Allocator(), 0);

    for (const auto *it : id_->AsArrayPattern()->Elements()) {
        if (it->IsRestElement()) {
            HandleRest(it->AsRestElement());
            break;
        }

        Type *nextInferedType =
            ConvertTupleTypeToArrayTypeIfNecessary(it, NextInferedType(name, !it->IsAssignmentPattern()));

        if (!nextInferedType && checker_->HasStatus(CheckerStatus::IN_PARAMETER)) {
            SetRemainingPatameterTypes();
            return;
        }

        if (convertTupleToArray_ && nextInferedType && inferedType_->IsObjectType()) {
            ASSERT(inferedType_->AsObjectType()->IsTupleType());

            binder::Variable *currentTupleElement = inferedType_->AsObjectType()->Properties()[index_];

            if (currentTupleElement) {
                currentTupleElement->SetTsType(nextInferedType);
            }
        }

        switch (it->Type()) {
            case ir::AstNodeType::IDENTIFIER: {
                if (inAssignment_) {
                    HandleDestructuringAssignment(it->AsIdentifier(), nextInferedType, nullptr);
                    break;
                }

                SetInferedTypeForVariable(it->AsIdentifier()->Variable(), nextInferedType, it->Start());
                break;
            }
            case ir::AstNodeType::ARRAY_PATTERN: {
                ArrayDestructuringContext nextContext =
                    ArrayDestructuringContext(checker_, it, inAssignment_, convertTupleToArray_, nullptr, nullptr);
                nextContext.SetInferedType(nextInferedType);
                nextContext.Start();
                break;
            }
            case ir::AstNodeType::OBJECT_PATTERN: {
                ObjectDestructuringContext nextContext =
                    ObjectDestructuringContext(checker_, it, inAssignment_, convertTupleToArray_, nullptr, nullptr);
                nextContext.SetInferedType(nextInferedType);
                nextContext.Start();
                break;
            }
            case ir::AstNodeType::ASSIGNMENT_PATTERN: {
                HandleAssignmentPattern(it->AsAssignmentPattern(), nextInferedType, false);
                break;
            }
            case ir::AstNodeType::OMITTED_EXPRESSION: {
                break;
            }
            default: {
                UNREACHABLE();
            }
        }

        index_++;
    }
}

void ObjectDestructuringContext::ValidateInferedType()
{
    if (!inferedType_->IsObjectType()) {
        return;
    }

    ValidateObjectLiteralType(inferedType_->AsObjectType(), id_->AsObjectPattern());
}

void ObjectDestructuringContext::HandleRest(const ir::SpreadElement *rest)
{
    Type *inferedRestType = GetRestType(rest->Start());
    ASSERT(rest->Argument()->IsIdentifier());

    if (inAssignment_) {
        HandleDestructuringAssignment(rest->Argument()->AsIdentifier(), inferedRestType, nullptr);
        return;
    }

    SetInferedTypeForVariable(rest->Argument()->AsIdentifier()->Variable(), inferedRestType, rest->Start());
}

Type *ObjectDestructuringContext::CreateObjectTypeForRest(ObjectType *objType)
{
    ObjectDescriptor *desc = checker_->Allocator()->New<ObjectDescriptor>(checker_->Allocator());

    for (auto *it : objType->AsObjectType()->Properties()) {
        if (!it->HasFlag(binder::VariableFlags::INFERED_IN_PATTERN)) {
            auto *memberVar =
                binder::Scope::CreateVar(checker_->Allocator(), it->Name(), binder::VariableFlags::NONE, nullptr);
            memberVar->SetTsType(it->TsType());
            memberVar->AddFlag(it->Flags());
            desc->properties.push_back(memberVar);
        }
    }

    Type *returnType = checker_->Allocator()->New<ObjectLiteralType>(desc);
    returnType->AsObjectType()->AddObjectFlag(ObjectFlags::RESOLVED_MEMBERS);
    return returnType;
}

Type *ObjectDestructuringContext::GetRestType([[maybe_unused]] const lexer::SourcePosition &loc)
{
    if (inferedType_->IsUnionType()) {
        ArenaVector<Type *> unionTypes(checker_->Allocator()->Adapter());

        for (auto *it : inferedType_->AsUnionType()->ConstituentTypes()) {
            if (it->IsObjectType()) {
                unionTypes.push_back(CreateObjectTypeForRest(it->AsObjectType()));
                continue;
            }

            checker_->ThrowTypeError("Rest types may only be created from object types.", loc);
        }

        return checker_->CreateUnionType(std::move(unionTypes));
    }

    if (inferedType_->IsObjectType()) {
        return CreateObjectTypeForRest(inferedType_->AsObjectType());
    }

    checker_->ThrowTypeError("Rest types may only be created from object types.", loc);
}

Type *ObjectDestructuringContext::ConvertTupleTypeToArrayTypeIfNecessary(const ir::AstNode *node, Type *type)
{
    if (!convertTupleToArray_) {
        return type;
    }

    if (!type) {
        return type;
    }

    ASSERT(node->IsProperty());

    const ir::Property *property = node->AsProperty();

    if (property->Value()->IsArrayPattern()) {
        return type;
    }

    if (property->Value()->IsAssignmentPattern() &&
        property->Value()->AsAssignmentPattern()->Left()->IsArrayPattern()) {
        return type;
    }

    if (type->IsObjectType() && type->AsObjectType()->IsTupleType()) {
        return type->AsObjectType()->AsTupleType()->ConvertToArrayType(checker_);
    }

    return type;
}

Type *ObjectDestructuringContext::NextInferedType([[maybe_unused]] const util::StringView &searchName, bool throwError)
{
    binder::Variable *prop =
        checker_->GetPropertyOfType(inferedType_, searchName, !throwError, binder::VariableFlags::INFERED_IN_PATTERN);

    if (prop) {
        prop->AddFlag(binder::VariableFlags::INFERED_IN_PATTERN);
        return prop->TsType();
    }

    if (inferedType_->IsObjectType()) {
        checker::ObjectType *objType = inferedType_->AsObjectType();

        if (objType->StringIndexInfo()) {
            return objType->StringIndexInfo()->GetType();
        }
    }

    if (throwError) {
        checker_->ThrowTypeError({"Property ", searchName, " does not exist on type ", inferedType_, "."},
                                 id_->Start());
    }

    return nullptr;
}

void ObjectDestructuringContext::Start()
{
    ASSERT(id_->IsObjectPattern());

    if (!id_->AsObjectPattern()->Properties().back()->IsRestElement() && validateObjectPatternInitializer_) {
        ValidateInferedType();
    }

    for (const auto *it : id_->AsObjectPattern()->Properties()) {
        switch (it->Type()) {
            case ir::AstNodeType::PROPERTY: {
                const ir::Property *property = it->AsProperty();

                if (property->IsComputed()) {
                    // TODO(aszilagyi)
                    return;
                }

                Type *nextInferedType = ConvertTupleTypeToArrayTypeIfNecessary(
                    it->AsProperty(),
                    NextInferedType(property->Key()->AsIdentifier()->Name(),
                                    (!property->Value()->IsAssignmentPattern() || validateTypeAnnotation_)));

                if (property->Value()->IsIdentifier()) {
                    if (inAssignment_) {
                        HandleDestructuringAssignment(property->Value()->AsIdentifier(), nextInferedType, nullptr);
                        break;
                    }

                    SetInferedTypeForVariable(property->Value()->AsIdentifier()->Variable(), nextInferedType,
                                              it->Start());
                    break;
                }

                if (property->Value()->IsArrayPattern()) {
                    ArrayDestructuringContext nextContext =
                        ArrayDestructuringContext(checker_, property->Value()->AsArrayPattern(), inAssignment_,
                                                  convertTupleToArray_, nullptr, nullptr);
                    nextContext.SetInferedType(nextInferedType);
                    nextContext.Start();
                    break;
                }

                if (property->Value()->IsObjectPattern()) {
                    ObjectDestructuringContext nextContext =
                        ObjectDestructuringContext(checker_, property->Value()->AsObjectPattern(), inAssignment_,
                                                   convertTupleToArray_, nullptr, nullptr);
                    nextContext.SetInferedType(nextInferedType);
                    nextContext.Start();
                    break;
                }

                ASSERT(property->Value()->IsAssignmentPattern());
                HandleAssignmentPattern(property->Value()->AsAssignmentPattern(), nextInferedType, true);
                break;
            }
            case ir::AstNodeType::REST_ELEMENT: {
                HandleRest(it->AsRestElement());
                break;
            }
            default: {
                UNREACHABLE();
            }
        }
    }
}
}  // namespace panda::es2panda::checker
