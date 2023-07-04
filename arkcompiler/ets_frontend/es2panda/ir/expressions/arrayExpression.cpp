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

#include "arrayExpression.h"

#include <util/helpers.h>
#include <typescript/checker.h>
#include <typescript/core/destructuringContext.h>
#include <compiler/base/literals.h>
#include <compiler/core/pandagen.h>
#include <ir/astDump.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

bool ArrayExpression::ConvertibleToArrayPattern()
{
    bool restFound = false;
    bool convResult = true;
    for (auto *it : elements_) {
        switch (it->Type()) {
            case AstNodeType::ARRAY_EXPRESSION: {
                convResult = it->AsArrayExpression()->ConvertibleToArrayPattern();
                break;
            }
            case AstNodeType::SPREAD_ELEMENT: {
                if (!restFound && it == elements_.back() && !trailingComma_) {
                    convResult = it->AsSpreadElement()->ConvertibleToRest(isDeclaration_);
                } else {
                    convResult = false;
                }
                restFound = true;
                break;
            }
            case AstNodeType::OBJECT_EXPRESSION: {
                convResult = it->AsObjectExpression()->ConvertibleToObjectPattern();
                break;
            }
            case AstNodeType::ASSIGNMENT_EXPRESSION: {
                convResult = it->AsAssignmentExpression()->ConvertibleToAssignmentPattern();
                break;
            }
            case AstNodeType::META_PROPERTY_EXPRESSION:
            case AstNodeType::CHAIN_EXPRESSION:
            case AstNodeType::SEQUENCE_EXPRESSION: {
                convResult = false;
                break;
            }
            default: {
                break;
            }
        }

        if (!convResult) {
            break;
        }
    }

    SetType(AstNodeType::ARRAY_PATTERN);
    return convResult;
}

ValidationInfo ArrayExpression::ValidateExpression()
{
    ValidationInfo info;

    for (auto *it : elements_) {
        switch (it->Type()) {
            case AstNodeType::OBJECT_EXPRESSION: {
                info = it->AsObjectExpression()->ValidateExpression();
                break;
            }
            case AstNodeType::ARRAY_EXPRESSION: {
                info = it->AsArrayExpression()->ValidateExpression();
                break;
            }
            case AstNodeType::ASSIGNMENT_EXPRESSION: {
                auto *assignmentExpr = it->AsAssignmentExpression();

                if (assignmentExpr->Left()->IsArrayExpression()) {
                    info = assignmentExpr->Left()->AsArrayExpression()->ValidateExpression();
                } else if (assignmentExpr->Left()->IsObjectExpression()) {
                    info = assignmentExpr->Left()->AsObjectExpression()->ValidateExpression();
                }

                break;
            }
            case AstNodeType::SPREAD_ELEMENT: {
                info = it->AsSpreadElement()->ValidateExpression();
                break;
            }
            default: {
                break;
            }
        }

        if (info.Fail()) {
            break;
        }
    }

    return info;
}

void ArrayExpression::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : elements_) {
        cb(it);
    }

    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void ArrayExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", type_ == AstNodeType::ARRAY_EXPRESSION ? "ArrayExpression" : "ArrayPattern"},
                 {"elements", elements_},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)},
                 {"optional", AstDumper::Optional(optional_)}});
}

void ArrayExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::VReg arrayObj = pg->AllocReg();

    pg->CreateArray(this, elements_, arrayObj);
}

void GetSpreadElementType(checker::Checker *checker, checker::Type *spreadType,
                          ArenaVector<checker::Type *> &elementTypes, const lexer::SourcePosition &loc)
{
    bool inConstContext = checker->HasStatus(checker::CheckerStatus::IN_CONST_CONTEXT);

    if (spreadType->IsObjectType() && spreadType->AsObjectType()->IsTupleType()) {
        ArenaVector<checker::Type *> tupleElementTypes(checker->Allocator()->Adapter());
        checker::TupleType *spreadTuple = spreadType->AsObjectType()->AsTupleType();

        for (auto *it : spreadTuple->Properties()) {
            if (inConstContext) {
                elementTypes.push_back(it->TsType());
                continue;
            }

            tupleElementTypes.push_back(it->TsType());
        }

        if (inConstContext) {
            return;
        }

        elementTypes.push_back(checker->CreateUnionType(std::move(tupleElementTypes)));
        return;
    }

    // TODO(aszilagyi) handle const context cases in case of union spread type
    if (spreadType->IsUnionType()) {
        ArenaVector<checker::Type *> spreadTypes(checker->Allocator()->Adapter());
        bool throwError = false;

        for (auto *type : spreadType->AsUnionType()->ConstituentTypes()) {
            if (type->IsArrayType()) {
                spreadTypes.push_back(type->AsArrayType()->ElementType());
                continue;
            }

            if (type->IsObjectType() && type->AsObjectType()->IsTupleType()) {
                checker::TupleType *tuple = type->AsObjectType()->AsTupleType();

                for (auto *it : tuple->Properties()) {
                    spreadTypes.push_back(it->TsType());
                }

                continue;
            }

            throwError = true;
            break;
        }

        if (!throwError) {
            elementTypes.push_back(checker->CreateUnionType(std::move(spreadTypes)));
            return;
        }
    }

    checker->ThrowTypeError(
        {"Type '", spreadType, "' must have a '[Symbol.iterator]()' method that returns an iterator."}, loc);
}

checker::Type *ArrayExpression::Check(checker::Checker *checker) const
{
    ArenaVector<checker::Type *> elementTypes(checker->Allocator()->Adapter());
    ArenaVector<checker::ElementFlags> elementFlags(checker->Allocator()->Adapter());
    bool inConstContext = checker->HasStatus(checker::CheckerStatus::IN_CONST_CONTEXT);
    bool createTuple = checker->HasStatus(checker::CheckerStatus::FORCE_TUPLE);

    for (auto *it : elements_) {
        if (it->IsSpreadElement()) {
            checker::Type *spreadType = it->AsSpreadElement()->Argument()->Check(checker);

            if (spreadType->IsArrayType()) {
                elementTypes.push_back(inConstContext ? spreadType : spreadType->AsArrayType()->ElementType());
                elementFlags.push_back(checker::ElementFlags::VARIADIC);
                continue;
            }

            GetSpreadElementType(checker, spreadType, elementTypes, it->Start());
            elementFlags.push_back(checker::ElementFlags::REST);
            continue;
        }

        checker::Type *elementType = it->Check(checker);

        if (!inConstContext) {
            elementType = checker->GetBaseTypeOfLiteralType(elementType);
        }

        elementFlags.push_back(checker::ElementFlags::REQUIRED);
        elementTypes.push_back(elementType);
    }

    if (inConstContext || createTuple) {
        checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
        uint32_t index = 0;

        for (auto it = elementTypes.begin(); it != elementTypes.end(); it++, index++) {
            util::StringView memberIndex = util::Helpers::ToStringView(checker->Allocator(), index);
            binder::LocalVariable *tupleMember =
                binder::Scope::CreateVar(checker->Allocator(), memberIndex, binder::VariableFlags::PROPERTY, nullptr);

            if (inConstContext) {
                tupleMember->AddFlag(binder::VariableFlags::READONLY);
            }

            tupleMember->SetTsType(*it);
            desc->properties.push_back(tupleMember);
        }

        return checker->CreateTupleType(desc, std::move(elementFlags), checker::ElementFlags::REQUIRED, index, index,
                                        inConstContext);
    }

    checker::Type *arrayElementType = nullptr;
    if (elementTypes.empty()) {
        arrayElementType = checker->GlobalAnyType();
    } else {
        arrayElementType = checker->CreateUnionType(std::move(elementTypes));
    }

    return checker->Allocator()->New<checker::ArrayType>(arrayElementType);
}

checker::Type *ArrayExpression::CheckPattern(checker::Checker *checker) const
{
    checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
    ArenaVector<checker::ElementFlags> elementFlags(checker->Allocator()->Adapter());
    checker::ElementFlags combinedFlags = checker::ElementFlags::NO_OPTS;
    uint32_t minLength = 0;
    uint32_t index = elements_.size();
    bool addOptional = true;

    for (auto it = elements_.rbegin(); it != elements_.rend(); it++) {
        checker::Type *elementType = nullptr;
        checker::ElementFlags memberFlag = checker::ElementFlags::NO_OPTS;

        switch ((*it)->Type()) {
            case ir::AstNodeType::REST_ELEMENT: {
                elementType = checker->Allocator()->New<checker::ArrayType>(checker->GlobalAnyType());
                memberFlag = checker::ElementFlags::REST;
                addOptional = false;
                break;
            }
            case ir::AstNodeType::OBJECT_PATTERN: {
                elementType = (*it)->AsObjectPattern()->CheckPattern(checker);
                memberFlag = checker::ElementFlags::REQUIRED;
                addOptional = false;
                break;
            }
            case ir::AstNodeType::ARRAY_PATTERN: {
                elementType = (*it)->AsArrayPattern()->CheckPattern(checker);
                memberFlag = checker::ElementFlags::REQUIRED;
                addOptional = false;
                break;
            }
            case ir::AstNodeType::ASSIGNMENT_PATTERN: {
                const ir::AssignmentExpression *assignmentPattern = (*it)->AsAssignmentPattern();

                if (assignmentPattern->Left()->IsIdentifier()) {
                    const ir::Identifier *ident = assignmentPattern->Left()->AsIdentifier();
                    ASSERT(ident->Variable());
                    binder::Variable *bindingVar = ident->Variable();
                    checker::Type *initializerType =
                        checker->GetBaseTypeOfLiteralType(assignmentPattern->Right()->Check(checker));
                    bindingVar->SetTsType(initializerType);
                    elementType = initializerType;
                } else if (assignmentPattern->Left()->IsArrayPattern()) {
                    auto savedContext = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
                    auto destructuringContext =
                        checker::ArrayDestructuringContext(checker, assignmentPattern->Left()->AsArrayPattern(), false,
                                                           true, nullptr, assignmentPattern->Right());
                    destructuringContext.Start();
                    elementType = destructuringContext.InferedType();
                } else {
                    ASSERT(assignmentPattern->Left()->IsObjectPattern());
                    auto savedContext = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
                    auto destructuringContext =
                        checker::ObjectDestructuringContext(checker, assignmentPattern->Left()->AsObjectPattern(),
                                                            false, true, nullptr, assignmentPattern->Right());
                    destructuringContext.Start();
                    elementType = destructuringContext.InferedType();
                }

                if (addOptional) {
                    memberFlag = checker::ElementFlags::OPTIONAL;
                } else {
                    memberFlag = checker::ElementFlags::REQUIRED;
                }

                break;
            }
            case ir::AstNodeType::OMITTED_EXPRESSION: {
                elementType = checker->GlobalAnyType();
                memberFlag = checker::ElementFlags::REQUIRED;
                addOptional = false;
                break;
            }
            case ir::AstNodeType::IDENTIFIER: {
                const ir::Identifier *ident = (*it)->AsIdentifier();
                ASSERT(ident->Variable());
                elementType = checker->GlobalAnyType();
                ident->Variable()->SetTsType(elementType);
                memberFlag = checker::ElementFlags::REQUIRED;
                addOptional = false;
                break;
            }
            default: {
                UNREACHABLE();
            }
        }

        util::StringView memberIndex = util::Helpers::ToStringView(checker->Allocator(), index - 1);

        auto *memberVar =
            binder::Scope::CreateVar(checker->Allocator(), memberIndex, binder::VariableFlags::PROPERTY, *it);

        if (memberFlag == checker::ElementFlags::OPTIONAL) {
            memberVar->AddFlag(binder::VariableFlags::OPTIONAL);
        } else {
            minLength++;
        }

        memberVar->SetTsType(elementType);
        elementFlags.push_back(memberFlag);
        desc->properties.insert(desc->properties.begin(), memberVar);

        combinedFlags |= memberFlag;
        index--;
    }

    return checker->CreateTupleType(desc, std::move(elementFlags), combinedFlags, minLength, desc->properties.size(),
                                    false);
}

void ArrayExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = elements_.begin(); iter != elements_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
