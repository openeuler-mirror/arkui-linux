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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_INTERFACE_TYPE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_INTERFACE_TYPE_H

#include "objectType.h"

namespace panda::es2panda::checker {

class InterfaceType : public ObjectType {
public:
    InterfaceType(ArenaAllocator *allocator, util::StringView name, ObjectDescriptor *desc)
        : ObjectType(ObjectType::ObjectTypeKind::INTERFACE, desc),
          name_(name),
          bases_(allocator->Adapter()),
          allocator_(allocator)
    {
    }

    void AddBase(ObjectType *base)
    {
        bases_.push_back(base);
    }

    ArenaVector<ObjectType *> &Bases()
    {
        return bases_;
    }

    const util::StringView &Name() const
    {
        return name_;
    }

    void SetMergedTypeParams(std::pair<std::vector<binder::Variable *>, size_t> &&mergedTypeParams)
    {
        mergedTypeParams_ = std::move(mergedTypeParams);
    }

    const std::pair<std::vector<binder::Variable *>, size_t> &GetMergedTypeParams() const
    {
        return mergedTypeParams_;
    }

    void SetTypeParamTypes(std::vector<Type *> &&typeParamTypes)
    {
        typeParamTypes_ = std::move(typeParamTypes);
    }

    const std::vector<Type *> &GetTypeParamTypes() const
    {
        return typeParamTypes_;
    }

    binder::LocalVariable *GetProperty(const util::StringView &name, [[maybe_unused]] bool searchInBase) const override
    {
        binder::LocalVariable *resultProp = ObjectType::GetProperty(name, false);

        if (resultProp) {
            return resultProp;
        }

        if (!searchInBase) {
            return nullptr;
        }

        for (auto *base : bases_) {
            resultProp = base->GetProperty(name, true);

            if (resultProp) {
                return resultProp;
            }
        }

        return nullptr;
    }

    ArenaVector<Signature *> CallSignatures() override
    {
        ArenaVector<Signature *> signatures(allocator_->Adapter());
        CollectSignatures(&signatures, true);
        return signatures;
    }

    ArenaVector<Signature *> ConstructSignatures() override
    {
        ArenaVector<Signature *> signatures(allocator_->Adapter());
        CollectSignatures(&signatures, false);
        return signatures;
    }

    const IndexInfo *StringIndexInfo() const override
    {
        return FindIndexInfo(false);
    }

    const IndexInfo *NumberIndexInfo() const override
    {
        return FindIndexInfo(true);
    }

    IndexInfo *StringIndexInfo() override
    {
        return FindIndexInfo(false);
    }

    IndexInfo *NumberIndexInfo() override
    {
        return FindIndexInfo(true);
    }

    ArenaVector<binder::LocalVariable *> Properties() override
    {
        ArenaVector<binder::LocalVariable *> properties(allocator_->Adapter());
        CollectProperties(&properties);
        return properties;
    }

    void ToString(std::stringstream &ss) const override;
    TypeFacts GetTypeFacts() const override;
    void Identical(TypeRelation *relation, Type *other) override;
    Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) override;

    void CollectSignatures(ArenaVector<Signature *> *collectedSignatures, bool collectCallSignatures) const;
    void CollectProperties(ArenaVector<binder::LocalVariable *> *collectedPropeties) const;
    const IndexInfo *FindIndexInfo(bool findNumberInfo) const;
    IndexInfo *FindIndexInfo(bool findNumberInfo);

private:
    util::StringView name_;
    ArenaVector<ObjectType *> bases_;
    ArenaAllocator *allocator_;
    std::pair<std::vector<binder::Variable *>, size_t> mergedTypeParams_ {};
    std::vector<Type *> typeParamTypes_ {};
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_INTERFACE_TYPE_H */
