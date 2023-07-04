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

#include <typescript/checker.h>
#include <typescript/types/indexInfo.h>

namespace panda::es2panda::checker {

Type *Checker::CreateNumberLiteralType(double value)
{
    auto search = numberLiteralMap_.find(value);
    if (search != numberLiteralMap_.end()) {
        return search->second;
    }

    auto *newNumLiteralType = allocator_->New<NumberLiteralType>(value);
    numberLiteralMap_.insert({value, newNumLiteralType});
    return newNumLiteralType;
}

Type *Checker::CreateBigintLiteralType(const util::StringView &str, bool negative)
{
    auto search = bigintLiteralMap_.find(str);
    if (search != bigintLiteralMap_.end()) {
        return search->second;
    }

    auto *newBigiLiteralType = allocator_->New<BigintLiteralType>(str, negative);
    bigintLiteralMap_.insert({str, newBigiLiteralType});
    return newBigiLiteralType;
}

Type *Checker::CreateStringLiteralType(const util::StringView &str)
{
    auto search = stringLiteralMap_.find(str);
    if (search != stringLiteralMap_.end()) {
        return search->second;
    }

    auto *newStrLiteralType = allocator_->New<StringLiteralType>(str);
    stringLiteralMap_.insert({str, newStrLiteralType});
    return newStrLiteralType;
}

Type *Checker::CreateUnionType(std::initializer_list<Type *> constituentTypes)
{
    ArenaVector<Type *> newConstituentTypes(allocator_->Adapter());

    for (auto *it : constituentTypes) {
        newConstituentTypes.push_back(it);
    }

    return CreateUnionType(std::move(newConstituentTypes));
}

Type *Checker::CreateUnionType(ArenaVector<Type *> &constituentTypes)
{
    ArenaVector<Type *> newConstituentTypes(allocator_->Adapter());

    for (auto *it : constituentTypes) {
        if (it->IsUnionType()) {
            for (auto *type : it->AsUnionType()->ConstituentTypes()) {
                newConstituentTypes.push_back(type);
            }

            continue;
        }

        newConstituentTypes.push_back(it);
    }

    UnionType::RemoveDuplicatedTypes(relation_, newConstituentTypes);

    if (newConstituentTypes.size() == 1) {
        return newConstituentTypes[0];
    }

    auto *newUnionType = allocator_->New<UnionType>(newConstituentTypes);

    return UnionType::HandleUnionType(newUnionType, globalTypes_);
}

Type *Checker::CreateUnionType(ArenaVector<Type *> &&constituentTypes)
{
    if (constituentTypes.empty()) {
        return nullptr;
    }

    ArenaVector<Type *> newConstituentTypes(allocator_->Adapter());

    for (auto *it : constituentTypes) {
        if (it->IsUnionType()) {
            for (auto *type : it->AsUnionType()->ConstituentTypes()) {
                newConstituentTypes.push_back(type);
            }

            continue;
        }

        newConstituentTypes.push_back(it);
    }

    UnionType::RemoveDuplicatedTypes(relation_, newConstituentTypes);

    if (newConstituentTypes.size() == 1) {
        return newConstituentTypes[0];
    }

    auto *newUnionType = allocator_->New<UnionType>(std::move(newConstituentTypes));

    return UnionType::HandleUnionType(newUnionType, globalTypes_);
}

Type *Checker::CreateObjectTypeWithCallSignature(Signature *callSignature)
{
    auto *objType = allocator_->New<ObjectLiteralType>(allocator_->New<ObjectDescriptor>(allocator_));
    objType->AddCallSignature(callSignature);
    return objType;
}

Type *Checker::CreateObjectTypeWithConstructSignature(Signature *constructSignature)
{
    auto *objType = allocator_->New<ObjectLiteralType>(allocator_->New<ObjectDescriptor>(allocator_));
    objType->AddConstructSignature(constructSignature);
    return objType;
}

Type *Checker::CreateFunctionTypeWithSignature(Signature *callSignature)
{
    auto *funcObjType = allocator_->New<FunctionType>(allocator_->New<ObjectDescriptor>(allocator_));
    funcObjType->AddCallSignature(callSignature);
    return funcObjType;
}

Type *Checker::CreateConstructorTypeWithSignature(Signature *constructSignature)
{
    auto *constructObjType = allocator_->New<ConstructorType>(allocator_->New<ObjectDescriptor>(allocator_));
    constructObjType->AddConstructSignature(constructSignature);
    return constructObjType;
}

Type *Checker::CreateTupleType(ObjectDescriptor *desc, ArenaVector<ElementFlags> &&elementFlags,
                               ElementFlags combinedFlags, uint32_t minLength, uint32_t fixedLength, bool readonly)
{
    desc->stringIndexInfo = allocator_->New<IndexInfo>(GlobalAnyType(), "x", readonly);
    return allocator_->New<TupleType>(desc, std::move(elementFlags), combinedFlags, minLength, fixedLength, readonly);
}

Type *Checker::CreateTupleType(ObjectDescriptor *desc, ArenaVector<ElementFlags> &&elementFlags,
                               ElementFlags combinedFlags, uint32_t minLength, uint32_t fixedLength, bool readonly,
                               NamedTupleMemberPool &&namedMembers)
{
    desc->stringIndexInfo = allocator_->New<IndexInfo>(GlobalAnyType(), "x", readonly);

    if (!namedMembers.empty()) {
        return allocator_->New<TupleType>(desc, std::move(elementFlags), combinedFlags, minLength, fixedLength,
                                          readonly, std::move(namedMembers));
    }

    return allocator_->New<TupleType>(desc, std::move(elementFlags), combinedFlags, minLength, fixedLength, readonly);
}
}  // namespace panda::es2panda::checker
