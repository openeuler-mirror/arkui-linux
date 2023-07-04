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

#include <ir/expressions/literals/bigIntLiteral.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/statements/variableDeclarator.h>
#include <ir/base/property.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/ts/tsIndexSignature.h>
#include <ir/ts/tsMethodSignature.h>
#include <ir/ts/tsTypeLiteral.h>
#include <ir/ts/tsPropertySignature.h>
#include <ir/ts/tsSignatureDeclaration.h>
#include <ir/ts/tsInterfaceDeclaration.h>
#include <ir/ts/tsInterfaceHeritage.h>
#include <ir/ts/tsInterfaceBody.h>
#include <util/helpers.h>
#include <binder/variable.h>
#include <binder/scope.h>

#include <typescript/checker.h>
#include <typescript/types/indexInfo.h>

namespace panda::es2panda::checker {

void Checker::CheckIndexConstraints(Type *type)
{
    if (!type->IsObjectType()) {
        return;
    }

    ObjectType *objType = type->AsObjectType();
    ResolveStructuredTypeMembers(objType);

    IndexInfo *numberInfo = objType->NumberIndexInfo();
    IndexInfo *stringInfo = objType->StringIndexInfo();
    const ArenaVector<binder::LocalVariable *> &properties = objType->Properties();

    if (numberInfo) {
        for (auto *it : properties) {
            if (it->HasFlag(binder::VariableFlags::NUMERIC_NAME)) {
                Type *propType = GetTypeOfVariable(it);
                IsTypeAssignableTo(propType, numberInfo->GetType(),
                                   {"Property '", it->Name(), "' of type '", propType,
                                    "' is not assignable to numeric index type '", numberInfo->GetType(), "'."},
                                   it->Declaration()->Node()->Start());
            }
        }
    }

    if (stringInfo) {
        for (auto *it : properties) {
            Type *propType = GetTypeOfVariable(it);
            IsTypeAssignableTo(propType, stringInfo->GetType(),
                               {"Property '", it->Name(), "' of type '", propType,
                                "' is not assignable to string index type '", stringInfo->GetType(), "'."},
                               it->Declaration()->Node()->Start());
        }

        if (numberInfo && !IsTypeAssignableTo(numberInfo->GetType(), stringInfo->GetType())) {
            ThrowTypeError({"Number index info type ", numberInfo->GetType(),
                            " is not assignable to string index info type ", stringInfo->GetType(), "."},
                           numberInfo->Pos());
        }
    }
}

void Checker::ResolveStructuredTypeMembers(Type *type)
{
    if (type->IsObjectType()) {
        ObjectType *objType = type->AsObjectType();

        if (objType->IsObjectLiteralType()) {
            ResolveObjectTypeMembers(objType);
            return;
        }

        if (objType->IsInterfaceType()) {
            ResolveInterfaceOrClassTypeMembers(objType->AsInterfaceType());
            return;
        }
    }

    if (type->IsUnionType()) {
        ResolveUnionTypeMembers(type->AsUnionType());
        return;
    }
}

void Checker::ResolveUnionTypeMembers(UnionType *type)
{
    if (type->MergedObjectType()) {
        return;
    }

    ObjectDescriptor *desc = allocator_->New<ObjectDescriptor>(allocator_);
    ArenaVector<Type *> stringInfoTypes(allocator_->Adapter());
    ArenaVector<Type *> numberInfoTypes(allocator_->Adapter());
    ArenaVector<Signature *> callSignatures(allocator_->Adapter());
    ArenaVector<Signature *> constructSignatures(allocator_->Adapter());

    for (auto *it : type->AsUnionType()->ConstituentTypes()) {
        if (!it->IsObjectType()) {
            continue;
        }

        ObjectType *objType = it->AsObjectType();
        ResolveObjectTypeMembers(objType);

        if (!objType->CallSignatures().empty()) {
            for (auto *signature : objType->CallSignatures()) {
                callSignatures.push_back(signature);
            }
        }

        if (!objType->ConstructSignatures().empty()) {
            for (auto *signature : objType->ConstructSignatures()) {
                constructSignatures.push_back(signature);
            }
        }

        if (objType->StringIndexInfo()) {
            stringInfoTypes.push_back(objType->StringIndexInfo()->GetType());
        }

        if (objType->NumberIndexInfo()) {
            numberInfoTypes.push_back(objType->NumberIndexInfo()->GetType());
        }
    }

    desc->callSignatures = callSignatures;
    desc->constructSignatures = constructSignatures;

    if (!stringInfoTypes.empty()) {
        desc->stringIndexInfo = allocator_->New<IndexInfo>(CreateUnionType(std::move(stringInfoTypes)), "x", false);
    }

    if (!numberInfoTypes.empty()) {
        desc->numberIndexInfo = allocator_->New<IndexInfo>(CreateUnionType(std::move(numberInfoTypes)), "x", false);
    }

    ObjectType *mergedType = allocator_->New<ObjectLiteralType>(desc);
    mergedType->AddObjectFlag(ObjectFlags::RESOLVED_MEMBERS);
    type->SetMergedObjectType(mergedType);
}

void Checker::ResolveInterfaceOrClassTypeMembers(InterfaceType *type)
{
    if (type->HasObjectFlag(ObjectFlags::RESOLVED_MEMBERS)) {
        return;
    }

    ResolveDeclaredMembers(type);
    GetBaseTypes(type);

    type->AddObjectFlag(ObjectFlags::RESOLVED_MEMBERS);
}

void Checker::ResolveObjectTypeMembers(ObjectType *type)
{
    if (!type->IsObjectLiteralType() || type->HasObjectFlag(ObjectFlags::RESOLVED_MEMBERS)) {
        return;
    }

    ASSERT(type->Variable() && type->Variable()->Declaration()->Node()->IsTSTypeLiteral());
    const ir::TSTypeLiteral *typeLiteral = type->Variable()->Declaration()->Node()->AsTSTypeLiteral();
    ArenaVector<const ir::TSSignatureDeclaration *> signatureDeclarations(allocator_->Adapter());
    ArenaVector<const ir::TSIndexSignature *> indexDeclarations(allocator_->Adapter());

    for (auto *it : typeLiteral->Members()) {
        ResolvePropertiesOfObjectType(type, it, signatureDeclarations, indexDeclarations, false);
    }

    type->AddObjectFlag(ObjectFlags::RESOLVED_MEMBERS);

    ResolveSignaturesOfObjectType(type, signatureDeclarations);
    ResolveIndexInfosOfObjectType(type, indexDeclarations);
}

void Checker::ResolvePropertiesOfObjectType(ObjectType *type, const ir::Expression *member,
                                            ArenaVector<const ir::TSSignatureDeclaration *> &signatureDeclarations,
                                            ArenaVector<const ir::TSIndexSignature *> &indexDeclarations,
                                            bool isInterface)
{
    if (member->IsTSPropertySignature()) {
        binder::Variable *prop = member->AsTSPropertySignature()->Variable();

        if (!isInterface ||
            ValidateInterfaceMemberRedeclaration(type, prop, member->AsTSPropertySignature()->Key()->Start())) {
            type->AddProperty(prop->AsLocalVariable());
        }

        return;
    }

    if (member->IsTSMethodSignature()) {
        binder::Variable *method = member->AsTSMethodSignature()->Variable();

        if (!isInterface ||
            ValidateInterfaceMemberRedeclaration(type, method, member->AsTSMethodSignature()->Key()->Start())) {
            type->AddProperty(method->AsLocalVariable());
        }

        return;
    }

    if (member->IsTSSignatureDeclaration()) {
        signatureDeclarations.push_back(member->AsTSSignatureDeclaration());
        return;
    }

    ASSERT(member->IsTSIndexSignature());
    indexDeclarations.push_back(member->AsTSIndexSignature());
}

void Checker::ResolveSignaturesOfObjectType(ObjectType *type,
                                            ArenaVector<const ir::TSSignatureDeclaration *> &signatureDeclarations)
{
    for (auto *it : signatureDeclarations) {
        Type *placeholderObj = it->Check(this);

        if (it->AsTSSignatureDeclaration()->Kind() ==
            ir::TSSignatureDeclaration::TSSignatureDeclarationKind::CALL_SIGNATURE) {
            type->AddCallSignature(placeholderObj->AsObjectType()->CallSignatures()[0]);
            continue;
        }

        type->AddConstructSignature(placeholderObj->AsObjectType()->ConstructSignatures()[0]);
    }
}
void Checker::ResolveIndexInfosOfObjectType(ObjectType *type,
                                            ArenaVector<const ir::TSIndexSignature *> &indexDeclarations)
{
    for (auto *it : indexDeclarations) {
        Type *placeholderObj = it->Check(this);

        if (it->AsTSIndexSignature()->Kind() == ir::TSIndexSignature::TSIndexSignatureKind::NUMBER) {
            IndexInfo *numberInfo = placeholderObj->AsObjectType()->NumberIndexInfo();

            if (type->NumberIndexInfo()) {
                ThrowTypeError("Duplicated index signature for type 'number'", it->Start());
            }

            type->Desc()->numberIndexInfo = numberInfo;
            continue;
        }

        IndexInfo *stringInfo = placeholderObj->AsObjectType()->StringIndexInfo();

        if (type->StringIndexInfo()) {
            ThrowTypeError("Duplicated index signature for type 'string'", it->Start());
        }

        type->Desc()->stringIndexInfo = stringInfo;
    }
}

binder::Variable *Checker::GetPropertyOfType(Type *type, const util::StringView &name, bool getPartial,
                                             binder::VariableFlags propagateFlags)
{
    if (type->IsObjectType()) {
        ResolveObjectTypeMembers(type->AsObjectType());
        return type->AsObjectType()->GetProperty(name, true);
    }

    if (type->IsUnionType()) {
        return GetPropertyOfUnionType(type->AsUnionType(), name, getPartial, propagateFlags);
    }

    return nullptr;
}

binder::Variable *Checker::GetPropertyOfUnionType(UnionType *type, const util::StringView &name, bool getPartial,
                                                  binder::VariableFlags propagateFlags)
{
    auto found = type->CachedSyntheticPropertis().find(name);

    if (found != type->CachedSyntheticPropertis().end()) {
        return found->second;
    }

    binder::VariableFlags flags = binder::VariableFlags::PROPERTY;
    ArenaVector<Type *> collectedTypes(allocator_->Adapter());

    for (auto *it : type->ConstituentTypes()) {
        binder::Variable *prop = GetPropertyOfType(it, name);

        if (!prop) {
            if (it->IsArrayType()) {
                collectedTypes.push_back(it->AsArrayType()->ElementType());
                continue;
            }

            if (!it->IsObjectType()) {
                if (getPartial) {
                    continue;
                }

                return nullptr;
            }

            ObjectType *objType = it->AsObjectType();

            if (!objType->StringIndexInfo()) {
                if (getPartial) {
                    continue;
                }

                return nullptr;
            }

            collectedTypes.push_back(objType->StringIndexInfo()->GetType());
            continue;
        }

        prop->AddFlag(propagateFlags);

        if (prop->HasFlag(binder::VariableFlags::OPTIONAL)) {
            flags |= binder::VariableFlags::OPTIONAL;
        }

        collectedTypes.push_back(GetTypeOfVariable(prop));
    }

    if (collectedTypes.empty()) {
        return nullptr;
    }

    binder::Variable *syntheticProp = binder::Scope::CreateVar(allocator_, name, flags, nullptr);
    syntheticProp->SetTsType(CreateUnionType(std::move(collectedTypes)));
    type->CachedSyntheticPropertis().insert({name, syntheticProp});
    return syntheticProp;
}

Type *Checker::CheckComputedPropertyName(const ir::Expression *key)
{
    auto found = nodeCache_.find(key);

    if (found != nodeCache_.end()) {
        return found->second;
    }

    Type *keyType = key->Check(this);

    if (!keyType->HasTypeFlag(TypeFlag::STRING_LIKE | TypeFlag::NUMBER_LIKE)) {
        ThrowTypeError(
            "A computed property name in a type literal must refer to an expression whose type is a literal "
            "type "
            "or a 'unique symbol' type",
            key->Start());
    }

    nodeCache_.insert({key, keyType});
    return keyType;
}

IndexInfo *Checker::GetApplicableIndexInfo(Type *type, Type *indexType)
{
    ResolveStructuredTypeMembers(type);
    bool getNumberInfo = indexType->HasTypeFlag(TypeFlag::NUMBER_LIKE);

    if (type->IsObjectType()) {
        if (getNumberInfo) {
            return type->AsObjectType()->NumberIndexInfo();
        }

        return type->AsObjectType()->StringIndexInfo();
    }

    if (type->IsUnionType()) {
        ASSERT(type->AsUnionType()->MergedObjectType());

        if (getNumberInfo) {
            return type->AsUnionType()->MergedObjectType()->NumberIndexInfo();
        }

        return type->AsUnionType()->MergedObjectType()->StringIndexInfo();
    }

    return nullptr;
}

Type *Checker::GetPropertyTypeForIndexType(Type *type, Type *indexType)
{
    if (type->IsArrayType()) {
        return type->AsArrayType()->ElementType();
    }

    if (indexType->HasTypeFlag(TypeFlag::STRING_LITERAL | TypeFlag::NUMBER_LITERAL)) {
        binder::Variable *prop = nullptr;

        if (indexType->IsStringLiteralType()) {
            prop = GetPropertyOfType(type, indexType->AsStringLiteralType()->Value());
        } else {
            util::StringView propName =
                util::Helpers::ToStringView(allocator_, indexType->AsNumberLiteralType()->Value());
            prop = GetPropertyOfType(type, propName);
        }

        if (prop) {
            Type *propType = GetTypeOfVariable(prop);

            if (prop->HasFlag(binder::VariableFlags::READONLY)) {
                propType->AddTypeFlag(TypeFlag::READONLY);
            }

            return propType;
        }
    }

    if (indexType->HasTypeFlag(TypeFlag::STRING_LIKE | TypeFlag::NUMBER_LIKE)) {
        IndexInfo *indexInfo = GetApplicableIndexInfo(type, indexType);

        if (indexInfo) {
            Type *indexInfoType = indexInfo->GetType();

            if (indexInfo->Readonly()) {
                indexInfoType->AddTypeFlag(TypeFlag::READONLY);
            }

            return indexInfoType;
        }
    }

    return nullptr;
}

ArenaVector<ObjectType *> Checker::GetBaseTypes(InterfaceType *type)
{
    if (type->HasObjectFlag(ObjectFlags::RESOLVED_BASE_TYPES)) {
        return type->Bases();
    }

    ASSERT(type->Variable() && type->Variable()->Declaration()->IsInterfaceDecl());
    binder::InterfaceDecl *decl = type->Variable()->Declaration()->AsInterfaceDecl();

    if (!typeStack_.insert(type).second) {
        ThrowTypeError({"Type ", type->Name(), " recursively references itself as a base type."},
                       decl->Node()->AsTSInterfaceDeclaration()->Id()->Start());
    }

    for (const auto *declaration : decl->Decls()) {
        if (declaration->Extends().empty()) {
            continue;
        }

        for (const auto *extends : declaration->Extends()) {
            Type *baseType = extends->Expr()->AsTypeNode()->GetType(this);

            if (!baseType->HasTypeFlag(TypeFlag::OBJECT | TypeFlag::NON_PRIMITIVE | TypeFlag::ANY)) {
                ThrowTypeError(
                    "An interface can only extend an object type or intersection of object types with statically "
                    "known "
                    "members",
                    extends->Start());
            }

            if (!baseType->IsObjectType()) {
                continue;
            }

            ObjectType *baseObj = baseType->AsObjectType();

            if (baseType == type) {
                ThrowTypeError({"Type ", type->Name(), " recursively references itself as a base type."},
                               decl->Node()->AsTSInterfaceDeclaration()->Id()->Start());
            }

            type->AddBase(baseObj);

            if (!baseObj->IsInterfaceType()) {
                continue;
            }

            ArenaVector<ObjectType *> extendsBases = GetBaseTypes(baseObj->AsInterfaceType());
            for (auto *extendBase : extendsBases) {
                if (extendBase == type) {
                    ThrowTypeError({"Type ", type->Name(), " recursively references itself as a base type."},
                                   decl->Node()->AsTSInterfaceDeclaration()->Id()->Start());
                }
            }
        }
    }

    type->AddObjectFlag(ObjectFlags::RESOLVED_BASE_TYPES);
    typeStack_.erase(type);
    return type->Bases();
}

void Checker::ResolveDeclaredMembers(InterfaceType *type)
{
    if (type->HasObjectFlag(ObjectFlags::RESOLVED_DECLARED_MEMBERS)) {
        return;
    }

    ASSERT(type->Variable() && type->Variable()->Declaration()->IsInterfaceDecl());
    binder::InterfaceDecl *decl = type->Variable()->Declaration()->AsInterfaceDecl();

    ArenaVector<const ir::TSSignatureDeclaration *> signatureDeclarations(allocator_->Adapter());
    ArenaVector<const ir::TSIndexSignature *> indexDeclarations(allocator_->Adapter());

    for (const auto *declaration : decl->Decls()) {
        for (const auto *member : declaration->Body()->Body()) {
            ResolvePropertiesOfObjectType(type, member, signatureDeclarations, indexDeclarations, true);
        }

        type->AddObjectFlag(ObjectFlags::RESOLVED_DECLARED_MEMBERS);

        ResolveSignaturesOfObjectType(type, signatureDeclarations);
        ResolveIndexInfosOfObjectType(type, indexDeclarations);
    }
}

bool Checker::ValidateInterfaceMemberRedeclaration(ObjectType *type, binder::Variable *prop,
                                                   const lexer::SourcePosition &locInfo)
{
    if (prop->HasFlag(binder::VariableFlags::COMPUTED)) {
        return true;
    }

    binder::Variable *found = type->GetProperty(prop->Name(), false);

    if (!found) {
        return true;
    }

    Type *targetType = GetTypeOfVariable(prop);
    Type *sourceType = GetTypeOfVariable(found);
    IsTypeIdenticalTo(targetType, sourceType,
                      {"Subsequent property declarations must have the same type.  Property ", prop->Name(),
                       " must be of type ", sourceType, ", but here has type ", targetType, "."},
                      locInfo);
    return false;
}

}  // namespace panda::es2panda::checker
