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

#include "objectExpression.h"

#include <util/helpers.h>
#include <compiler/base/literals.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <typescript/core/destructuringContext.h>
#include <ir/astDump.h>
#include <ir/base/classDefinition.h>
#include <ir/base/property.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/arrowFunctionExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/classExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/nullLiteral.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/literals/taggedLiteral.h>
#include <ir/statements/classDeclaration.h>
#include <ir/validationInfo.h>
#include <util/bitset.h>

namespace panda::es2panda::ir {

static bool IsAnonClassOrFuncExpr(const ir::Expression *expr)
{
    const ir::Identifier *identifier;
    switch (expr->Type()) {
        case ir::AstNodeType::FUNCTION_EXPRESSION: {
            identifier = expr->AsFunctionExpression()->Function()->Id();
            break;
        }
        case ir::AstNodeType::ARROW_FUNCTION_EXPRESSION: {
            identifier = expr->AsArrowFunctionExpression()->Function()->Id();
            break;
        }
        case ir::AstNodeType::CLASS_EXPRESSION: {
            identifier = expr->AsClassExpression()->Definition()->Ident();
            break;
        }
        default: {
            return false;
        }
    }
    return identifier == nullptr || identifier->Name().Empty();
}

static bool IsLegalNameFormat(const ir::Expression *expr)
{
    util::StringView name;
    if (expr->IsIdentifier()) {
        name = expr->AsIdentifier()->Name();
    } else if (expr->IsStringLiteral()) {
        name = expr->AsStringLiteral()->Str();
    } else if (expr->IsNumberLiteral()) {
        name = expr->AsNumberLiteral()->Str();
    } else {
        UNREACHABLE();
    }
    return name.Find(".") != std::string::npos && name.Find("\\") != std::string::npos;
}


ValidationInfo ObjectExpression::ValidateExpression()
{
    ValidationInfo info;
    bool foundProto = false;

    for (auto *it : properties_) {
        switch (it->Type()) {
            case AstNodeType::OBJECT_EXPRESSION:
            case AstNodeType::ARRAY_EXPRESSION: {
                return {"Unexpected token.", it->Start()};
            }
            case AstNodeType::SPREAD_ELEMENT: {
                info = it->AsSpreadElement()->ValidateExpression();
                break;
            }
            case AstNodeType::PROPERTY: {
                auto *prop = it->AsProperty();
                info = prop->ValidateExpression();

                if (prop->Kind() == PropertyKind::PROTO) {
                    if (foundProto) {
                        return {"Duplicate __proto__ fields are not allowed in object literals", prop->Key()->Start()};
                    }

                    foundProto = true;
                }

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

bool ObjectExpression::ConvertibleToObjectPattern()
{
    // TODO(rsipka): throw more precise messages in case of false results
    bool restFound = false;
    bool convResult = true;

    for (auto *it : properties_) {
        switch (it->Type()) {
            case AstNodeType::ARRAY_EXPRESSION: {
                convResult = it->AsArrayExpression()->ConvertibleToArrayPattern();
                break;
            }
            case AstNodeType::SPREAD_ELEMENT: {
                if (!restFound && it == properties_.back() && !trailingComma_) {
                    convResult = it->AsSpreadElement()->ConvertibleToRest(isDeclaration_, false);
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
            case AstNodeType::PROPERTY: {
                convResult = it->AsProperty()->ConventibleToPatternProperty();
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

    SetType(AstNodeType::OBJECT_PATTERN);
    return convResult;
}

void ObjectExpression::SetDeclaration()
{
    isDeclaration_ = true;
}

void ObjectExpression::SetOptional(bool optional)
{
    optional_ = optional;
}

void ObjectExpression::SetTsTypeAnnotation(Expression *typeAnnotation)
{
    typeAnnotation_ = typeAnnotation;
}

void ObjectExpression::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : properties_) {
        cb(it);
    }

    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void ObjectExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", (type_ == AstNodeType::OBJECT_EXPRESSION) ? "ObjectExpression" : "ObjectPattern"},
                 {"properties", properties_},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)},
                 {"optional", AstDumper::Optional(optional_)}});
}

void ObjectExpression::FillInLiteralBuffer(compiler::LiteralBuffer *buf,
                                           std::vector<std::vector<const Literal *>> &tempLiteralBuffer) const
{
    for (size_t i = 0 ; i < tempLiteralBuffer.size(); i++) {
        if (tempLiteralBuffer[i].size() == 0) {
            continue;
        }

        auto propBuf = tempLiteralBuffer[i];
        for (size_t j = 0; j < propBuf.size(); j++) {
            buf->Add(propBuf[j]);
        }
    }
}

void ObjectExpression::EmitCreateObjectWithBuffer(compiler::PandaGen *pg, compiler::LiteralBuffer *buf,
                                                  bool hasMethod) const
{
    if (buf->IsEmpty()) {
        pg->CreateEmptyObject(this);
        return;
    }

    uint32_t bufIdx = pg->AddLiteralBuffer(buf);
    pg->CreateObjectWithBuffer(this, bufIdx);
}

static const Literal *CreateLiteral(compiler::PandaGen *pg, const ir::Property *prop, util::BitSet *compiled,
                                    size_t propIndex)
{
    if (util::Helpers::IsConstantExpr(prop->Value())) {
        compiled->Set(propIndex);
        return prop->Value()->AsLiteral();
    }

    if (prop->Kind() != ir::PropertyKind::INIT) {
        ASSERT(prop->IsAccessor());
        return pg->Allocator()->New<TaggedLiteral>(LiteralTag::ACCESSOR);
    }

    if (prop->IsMethod()) {
        const ir::ScriptFunction *method = prop->Value()->AsFunctionExpression()->Function();

        LiteralTag tag = LiteralTag::METHOD;

        if (method->IsGenerator()) {
            tag = LiteralTag::GENERATOR_METHOD;

            if (method->IsAsync()) {
                tag = LiteralTag::ASYNC_GENERATOR_METHOD;
            }
        }

        compiled->Set(propIndex);
        return pg->Allocator()->New<TaggedLiteral>(tag, method->Scope()->InternalName());
    }

    return pg->Allocator()->New<NullLiteral>();
}

void ObjectExpression::CompileStaticProperties(compiler::PandaGen *pg, util::BitSet *compiled) const
{
    bool hasMethod = false;
    bool seenComputed = false;
    auto *buf = pg->NewLiteralBuffer();
    std::vector<std::vector<const Literal *>> tempLiteralBuffer(properties_.size());
    std::unordered_map<util::StringView, size_t> propNameMap;
    std::unordered_map<util::StringView, size_t> getterIndxNameMap;
    std::unordered_map<util::StringView, size_t> setterIndxNameMap;

    for (size_t i = 0; i < properties_.size(); i++) {
        if (properties_[i]->IsSpreadElement()) {
            seenComputed = true;
            continue;
        }

        const ir::Property *prop = properties_[i]->AsProperty();

        if (!util::Helpers::IsConstantPropertyKey(prop->Key(), prop->IsComputed()) ||
            prop->Kind() == ir::PropertyKind::PROTO) {
            seenComputed = true;
            continue;
        }

        std::vector<const Literal *> propBuf;
        util::StringView name = util::Helpers::LiteralToPropName(prop->Key());
        size_t propIndex = i;
        auto res = propNameMap.insert({name, propIndex});
        if (res.second) {    // name not found in map
            if (seenComputed) {
                break;
            }
        } else {
            propIndex = res.first->second;

            if (prop->Kind() != ir::PropertyKind::SET && getterIndxNameMap.find(name) != getterIndxNameMap.end()) {
                compiled->Set(getterIndxNameMap[name]);
            }

            if (prop->Kind() != ir::PropertyKind::GET && setterIndxNameMap.find(name) != setterIndxNameMap.end()) {
                compiled->Set(setterIndxNameMap[name]);
            }
        }

        if (prop->Kind() == ir::PropertyKind::GET) {
            getterIndxNameMap[name] = i;
        } else if (prop->Kind() == ir::PropertyKind::SET) {
            setterIndxNameMap[name] = i;
        }

        propBuf.push_back(pg->Allocator()->New<StringLiteral>(name));
        propBuf.push_back(CreateLiteral(pg, prop, compiled, i));

        if (prop->IsMethod()) {
            hasMethod = true;
            const ir::FunctionExpression *func = prop->Value()->AsFunctionExpression();
            size_t paramNum = func->Function()->FormalParamsLength();
            Literal *methodAffiliate = pg->Allocator()->New<TaggedLiteral>(LiteralTag::METHODAFFILIATE, paramNum);
            propBuf.push_back(methodAffiliate);
        }

        tempLiteralBuffer[propIndex] = propBuf;
    }

    FillInLiteralBuffer(buf, tempLiteralBuffer);
    EmitCreateObjectWithBuffer(pg, buf, hasMethod);
}

void ObjectExpression::CompileRemainingProperties(compiler::PandaGen *pg, const util::BitSet *compiled,
                                                  compiler::VReg objReg) const
{
    for (size_t i = 0; i < properties_.size(); i++) {
        // TODO: Compile and store only the last one of re-declared prop
        if (compiled->Test(i)) {
            continue;
        }

        compiler::RegScope rs(pg);

        if (properties_[i]->IsSpreadElement()) {
            const ir::SpreadElement *spread = properties_[i]->AsSpreadElement();

            spread->Argument()->Compile(pg);
            // srcObj is now stored in acc
            pg->CopyDataProperties(spread, objReg);
            continue;
        }

        const ir::Property *prop = properties_[i]->AsProperty();

        switch (prop->Kind()) {
            case ir::PropertyKind::GET:
            case ir::PropertyKind::SET: {
                compiler::VReg key = pg->LoadPropertyKey(prop->Key(), prop->IsComputed());

                compiler::VReg undef = pg->AllocReg();
                pg->LoadConst(this, compiler::Constant::JS_UNDEFINED);
                pg->StoreAccumulator(this, undef);

                compiler::VReg getter = undef;
                compiler::VReg setter = undef;

                compiler::VReg accessor = pg->AllocReg();
                pg->LoadAccumulator(prop->Value(), objReg);
                prop->Value()->Compile(pg);
                pg->StoreAccumulator(prop->Value(), accessor);

                if (prop->Kind() == ir::PropertyKind::GET) {
                    getter = accessor;
                } else {
                    setter = accessor;
                }

                pg->DefineGetterSetterByValue(this, objReg, key, getter, setter, prop->IsComputed());
                break;
            }
            case ir::PropertyKind::INIT: {
                compiler::Operand key = pg->ToPropertyKey(prop->Key(), prop->IsComputed());

                bool nameSetting = false;
                if (prop->IsMethod()) {
                    pg->LoadAccumulator(prop->Value(), objReg);
                    if (prop->IsComputed()) {
                        nameSetting = true;
                    }
                } else {
                    if (prop->IsComputed()) {
                        nameSetting = IsAnonClassOrFuncExpr(prop->Value());
                    } else {
                        nameSetting = IsAnonClassOrFuncExpr(prop->Value()) && IsLegalNameFormat(prop->Key());
                    }
                }

                prop->Value()->Compile(pg);
                pg->StoreOwnProperty(this, objReg, key, nameSetting);
                break;
            }
            case ir::PropertyKind::PROTO: {
                prop->Value()->Compile(pg);
                compiler::VReg proto = pg->AllocReg();
                pg->StoreAccumulator(this, proto);

                pg->SetObjectWithProto(this, proto, objReg);
                break;
            }
            default: {
                UNREACHABLE();
            }
        }
    }

    pg->LoadAccumulator(this, objReg);
}

void ObjectExpression::Compile(compiler::PandaGen *pg) const
{
    if (properties_.empty()) {
        pg->CreateEmptyObject(this);
        return;
    }

    util::BitSet compiled(properties_.size());
    CompileStaticProperties(pg, &compiled);

    compiler::RegScope rs(pg);
    compiler::VReg objReg = pg->AllocReg();

    pg->StoreAccumulator(this, objReg);

    CompileRemainingProperties(pg, &compiled, objReg);
}

checker::Type *ObjectExpression::CheckPattern(checker::Checker *checker) const
{
    checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());

    bool isOptional = false;

    for (auto it = properties_.rbegin(); it != properties_.rend(); it++) {
        if ((*it)->IsRestElement()) {
            ASSERT((*it)->AsRestElement()->Argument()->IsIdentifier());
            util::StringView indexInfoName("x");
            auto *newIndexInfo =
                checker->Allocator()->New<checker::IndexInfo>(checker->GlobalAnyType(), indexInfoName, false);
            desc->stringIndexInfo = newIndexInfo;
            continue;
        }

        ASSERT((*it)->IsProperty());
        const ir::Property *prop = (*it)->AsProperty();

        if (prop->IsComputed()) {
            // TODO(aszilagyi)
            continue;
        }

        binder::LocalVariable *foundVar = desc->FindProperty(prop->Key()->AsIdentifier()->Name());
        checker::Type *patternParamType = checker->GlobalAnyType();
        binder::Variable *bindingVar = nullptr;

        if (prop->IsShorthand()) {
            switch (prop->Value()->Type()) {
                case ir::AstNodeType::IDENTIFIER: {
                    const ir::Identifier *ident = prop->Value()->AsIdentifier();
                    ASSERT(ident->Variable());
                    bindingVar = ident->Variable();
                    break;
                }
                case ir::AstNodeType::ASSIGNMENT_PATTERN: {
                    const ir::AssignmentExpression *assignmentPattern = prop->Value()->AsAssignmentPattern();
                    patternParamType = assignmentPattern->Right()->Check(checker);
                    ASSERT(assignmentPattern->Left()->AsIdentifier()->Variable());
                    bindingVar = assignmentPattern->Left()->AsIdentifier()->Variable();
                    isOptional = true;
                    break;
                }
                default: {
                    UNREACHABLE();
                }
            }
        } else {
            switch (prop->Value()->Type()) {
                case ir::AstNodeType::IDENTIFIER: {
                    bindingVar = prop->Value()->AsIdentifier()->Variable();
                    break;
                }
                case ir::AstNodeType::ARRAY_PATTERN: {
                    patternParamType = prop->Value()->AsArrayPattern()->CheckPattern(checker);
                    break;
                }
                case ir::AstNodeType::OBJECT_PATTERN: {
                    patternParamType = prop->Value()->AsObjectPattern()->CheckPattern(checker);
                    break;
                }
                case ir::AstNodeType::ASSIGNMENT_PATTERN: {
                    const ir::AssignmentExpression *assignmentPattern = prop->Value()->AsAssignmentPattern();

                    if (assignmentPattern->Left()->IsIdentifier()) {
                        bindingVar = assignmentPattern->Left()->AsIdentifier()->Variable();
                        patternParamType =
                            checker->GetBaseTypeOfLiteralType(assignmentPattern->Right()->Check(checker));
                        isOptional = true;
                        break;
                    }

                    if (assignmentPattern->Left()->IsArrayPattern()) {
                        auto savedContext = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
                        auto destructuringContext =
                            checker::ArrayDestructuringContext(checker, assignmentPattern->Left()->AsArrayPattern(),
                                                               false, true, nullptr, assignmentPattern->Right());

                        if (foundVar) {
                            destructuringContext.SetInferedType(
                                checker->CreateUnionType({foundVar->TsType(), destructuringContext.InferedType()}));
                        }

                        destructuringContext.Start();
                        patternParamType = destructuringContext.InferedType();
                        isOptional = true;
                        break;
                    }

                    ASSERT(assignmentPattern->Left()->IsObjectPattern());
                    auto savedContext = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
                    auto destructuringContext =
                        checker::ObjectDestructuringContext(checker, assignmentPattern->Left()->AsObjectPattern(),
                                                            false, true, nullptr, assignmentPattern->Right());

                    if (foundVar) {
                        destructuringContext.SetInferedType(
                            checker->CreateUnionType({foundVar->TsType(), destructuringContext.InferedType()}));
                    }

                    destructuringContext.Start();
                    patternParamType = destructuringContext.InferedType();
                    isOptional = true;
                    break;
                }
                default: {
                    UNREACHABLE();
                }
            }
        }

        if (bindingVar) {
            bindingVar->SetTsType(patternParamType);
        }

        if (foundVar) {
            continue;
        }

        binder::LocalVariable *patternVar = binder::Scope::CreateVar(
            checker->Allocator(), prop->Key()->AsIdentifier()->Name(), binder::VariableFlags::PROPERTY, *it);
        patternVar->SetTsType(patternParamType);

        if (isOptional) {
            patternVar->AddFlag(binder::VariableFlags::OPTIONAL);
        }

        desc->properties.insert(desc->properties.begin(), patternVar);
    }

    checker::Type *returnType = checker->Allocator()->New<checker::ObjectLiteralType>(desc);
    returnType->AsObjectType()->AddObjectFlag(checker::ObjectFlags::RESOLVED_MEMBERS);
    return returnType;
}

const util::StringView &GetPropertyName(const ir::Expression *key)
{
    if (key->IsIdentifier()) {
        return key->AsIdentifier()->Name();
    }

    if (key->IsStringLiteral()) {
        return key->AsStringLiteral()->Str();
    }

    ASSERT(key->IsNumberLiteral());
    return key->AsNumberLiteral()->Str();
}

binder::VariableFlags GetFlagsForProperty(const ir::Property *prop)
{
    if (!prop->IsMethod()) {
        return binder::VariableFlags::PROPERTY;
    }

    binder::VariableFlags propFlags = binder::VariableFlags::METHOD;

    if (prop->IsAccessor() && prop->Kind() == PropertyKind::GET) {
        propFlags |= binder::VariableFlags::READONLY;
    }

    return propFlags;
}

checker::Type *GetTypeForProperty(const ir::Property *prop, checker::Checker *checker)
{
    if (prop->IsAccessor()) {
        checker::Type *funcType = prop->Value()->Check(checker);

        if (prop->Kind() == PropertyKind::SET) {
            return checker->GlobalAnyType();
        }

        ASSERT(funcType->IsObjectType() && funcType->AsObjectType()->IsFunctionType());
        return funcType->AsObjectType()->CallSignatures()[0]->ReturnType();
    }

    if (prop->IsShorthand()) {
        return prop->Key()->Check(checker);
    }

    return prop->Value()->Check(checker);
}

checker::Type *ObjectExpression::Check(checker::Checker *checker) const
{
    checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
    std::unordered_map<util::StringView, lexer::SourcePosition> allPropertiesMap;
    bool inConstContext = checker->HasStatus(checker::CheckerStatus::IN_CONST_CONTEXT);
    ArenaVector<checker::Type *> computedNumberPropTypes(checker->Allocator()->Adapter());
    ArenaVector<checker::Type *> computedStringPropTypes(checker->Allocator()->Adapter());
    bool hasComputedNumberProperty = false;
    bool hasComputedStringProperty = false;
    bool seenSpread = false;

    for (const auto *it : properties_) {
        if (it->IsProperty()) {
            const ir::Property *prop = it->AsProperty();

            if (prop->IsComputed()) {
                checker::Type *computedNameType = checker->CheckComputedPropertyName(prop->Key());

                if (computedNameType->IsNumberType()) {
                    hasComputedNumberProperty = true;
                    computedNumberPropTypes.push_back(prop->Value()->Check(checker));
                    continue;
                }

                if (computedNameType->IsStringType()) {
                    hasComputedStringProperty = true;
                    computedStringPropTypes.push_back(prop->Value()->Check(checker));
                    continue;
                }
            }

            checker::Type *propType = GetTypeForProperty(prop, checker);
            binder::VariableFlags flags = GetFlagsForProperty(prop);
            const util::StringView &propName = GetPropertyName(prop->Key());

            auto *memberVar = binder::Scope::CreateVar(checker->Allocator(), propName, flags, it);

            if (inConstContext) {
                memberVar->AddFlag(binder::VariableFlags::READONLY);
            } else {
                propType = checker->GetBaseTypeOfLiteralType(propType);
            }

            memberVar->SetTsType(propType);

            if (prop->Key()->IsNumberLiteral()) {
                memberVar->AddFlag(binder::VariableFlags::NUMERIC_NAME);
            }

            binder::LocalVariable *foundMember = desc->FindProperty(propName);
            allPropertiesMap.insert({propName, it->Start()});

            if (foundMember) {
                foundMember->SetTsType(propType);
                continue;
            }

            desc->properties.push_back(memberVar);
            continue;
        }

        ASSERT(it->IsSpreadElement());

        checker::Type *spreadType = it->AsSpreadElement()->Argument()->Check(checker);
        seenSpread = true;

        // TODO(aszilagyi): handle union of object types
        if (!spreadType->IsObjectType()) {
            checker->ThrowTypeError("Spread types may only be created from object types.", it->Start());
        }

        for (auto *spreadProp : spreadType->AsObjectType()->Properties()) {
            auto found = allPropertiesMap.find(spreadProp->Name());

            if (found != allPropertiesMap.end()) {
                checker->ThrowTypeError(
                    {found->first, " is specified more than once, so this usage will be overwritten."}, found->second);
            }

            binder::LocalVariable *foundMember = desc->FindProperty(spreadProp->Name());

            if (foundMember) {
                foundMember->SetTsType(spreadProp->TsType());
                continue;
            }

            desc->properties.push_back(spreadProp);
        }
    }

    if (!seenSpread && (hasComputedNumberProperty || hasComputedStringProperty)) {
        for (auto *it : desc->properties) {
            computedStringPropTypes.push_back(it->TsType());

            if (hasComputedNumberProperty && it->HasFlag(binder::VariableFlags::NUMERIC_NAME)) {
                computedNumberPropTypes.push_back(it->TsType());
            }
        }

        if (hasComputedNumberProperty) {
            desc->numberIndexInfo = checker->Allocator()->New<checker::IndexInfo>(
                checker->CreateUnionType(std::move(computedNumberPropTypes)), "x", inConstContext);
        }

        if (hasComputedStringProperty) {
            desc->stringIndexInfo = checker->Allocator()->New<checker::IndexInfo>(
                checker->CreateUnionType(std::move(computedStringPropTypes)), "x", inConstContext);
        }
    }

    checker::Type *returnType = checker->Allocator()->New<checker::ObjectLiteralType>(desc);
    returnType->AsObjectType()->AddObjectFlag(checker::ObjectFlags::RESOLVED_MEMBERS |
                                              checker::ObjectFlags::CHECK_EXCESS_PROPS);
    return returnType;
}

void ObjectExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = properties_.begin(); iter != properties_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }

    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
