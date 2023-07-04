/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_UNION_TYPE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_UNION_TYPE_H

#include "type.h"

namespace panda::es2panda::checker {

class GlobalTypesHolder;

class UnionType : public Type {
public:
    UnionType(ArenaAllocator *allocator, std::initializer_list<Type *> types)
        : Type(TypeFlag::UNION), constituentTypes_(allocator->Adapter())
    {
        for (auto *it : types) {
            constituentTypes_.push_back(it);
        }

        for (auto *it : constituentTypes_) {
            AddConstituentFlag(it->TypeFlags());
        }
    }

    explicit UnionType(ArenaVector<Type *> &&constituentTypes)
        : Type(TypeFlag::UNION), constituentTypes_(std::move(constituentTypes))
    {
        for (auto *it : constituentTypes_) {
            AddConstituentFlag(it->TypeFlags());
        }
    }

    explicit UnionType(ArenaVector<Type *> &constituentTypes)
        : Type(TypeFlag::UNION), constituentTypes_(constituentTypes)
    {
        for (auto *it : constituentTypes_) {
            AddConstituentFlag(it->TypeFlags());
        }
    }

    const ArenaVector<Type *> &ConstituentTypes() const
    {
        return constituentTypes_;
    }

    ArenaVector<Type *> &ConstituentTypes()
    {
        return constituentTypes_;
    }

    void AddConstituentType(Type *type, TypeRelation *relation)
    {
        if ((HasConstituentFlag(TypeFlag::NUMBER) && type->IsNumberLiteralType()) ||
            (HasConstituentFlag(TypeFlag::STRING) && type->IsStringLiteralType()) ||
            (HasConstituentFlag(TypeFlag::BIGINT) && type->IsBigintLiteralType()) ||
            (HasConstituentFlag(TypeFlag::BOOLEAN) && type->IsBooleanLiteralType())) {
            return;
        }

        for (auto *it : constituentTypes_) {
            if (relation->IsIdenticalTo(it, type)) {
                return;
            }
        }

        AddConstituentFlag(type->TypeFlags());
        constituentTypes_.push_back(type);
    }

    void AddConstituentFlag(TypeFlag flag)
    {
        constituentFlags_ |= flag;
    }

    void RemoveConstituentFlag(TypeFlag flag)
    {
        constituentFlags_ &= ~flag;
    }

    bool HasConstituentFlag(TypeFlag flag) const
    {
        return (constituentFlags_ & flag) != 0;
    }

    std::unordered_map<util::StringView, binder::Variable *> &CachedSyntheticPropertis()
    {
        return cachedSynthecticProperties_;
    }

    ObjectType *MergedObjectType()
    {
        return mergedObjectType_;
    }

    void SetMergedObjectType(ObjectType *type)
    {
        mergedObjectType_ = type;
    }

    void ToString(std::stringstream &ss) const override;
    void Identical(TypeRelation *relation, Type *other) override;
    void AssignmentTarget(TypeRelation *relation, Type *source) override;
    bool AssignmentSource(TypeRelation *relation, Type *target) override;
    TypeFacts GetTypeFacts() const override;
    Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) override;

    static void RemoveDuplicatedTypes(TypeRelation *relation, ArenaVector<Type *> &constituentTypes);
    static Type *HandleUnionType(UnionType *unionType, GlobalTypesHolder *globalTypesHolder);
    static void RemoveRedundantLiteralTypesFromUnion(UnionType *type);

private:
    static bool EachTypeRelatedToSomeType(TypeRelation *relation, UnionType *source, UnionType *target);
    static bool TypeRelatedToSomeType(TypeRelation *relation, Type *source, UnionType *target);

    ArenaVector<Type *> constituentTypes_;
    TypeFlag constituentFlags_ {TypeFlag::NONE};
    std::unordered_map<util::StringView, binder::Variable *> cachedSynthecticProperties_ {};
    ObjectType *mergedObjectType_ {nullptr};
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_UNION_TYPE_H */
