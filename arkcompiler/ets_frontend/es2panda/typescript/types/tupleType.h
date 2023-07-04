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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TUPLE_TYPE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TUPLE_TYPE_H

#include <macros.h>

#include <binder/variable.h>
#include <typescript/types/elementFlags.h>
#include <typescript/types/objectType.h>

namespace panda::es2panda::checker {

using NamedTupleMemberPool = std::unordered_map<binder::LocalVariable *, util::StringView>;

class TupleType : public ObjectType {
public:
    explicit TupleType(ArenaAllocator *allocator)
        : ObjectType(ObjectTypeKind::TUPLE), elementFlags_(allocator->Adapter())
    {
    }

    TupleType(ObjectDescriptor *desc, ArenaVector<ElementFlags> &&elementFlags, ElementFlags combinedFlags,
              uint32_t minLength, uint32_t fixedLength, bool readonly)
        : ObjectType(ObjectType::ObjectTypeKind::TUPLE, desc),
          elementFlags_(std::move(elementFlags)),
          combinedFlags_(combinedFlags),
          minLength_(minLength),
          fixedLength_(fixedLength),
          readonly_(readonly)
    {
        if (readonly_) {
            for (auto *it : Properties()) {
                it->AddFlag(binder::VariableFlags::READONLY);
            }
        }
    }

    TupleType(ObjectDescriptor *desc, ArenaVector<ElementFlags> &&elementFlags, ElementFlags combinedFlags,
              uint32_t minLength, uint32_t fixedLength, bool readonly, NamedTupleMemberPool &&namedMembers)
        : ObjectType(ObjectType::ObjectTypeKind::TUPLE, desc),
          elementFlags_(std::move(elementFlags)),
          combinedFlags_(combinedFlags),
          minLength_(minLength),
          fixedLength_(fixedLength),
          namedMembers_(std::move(namedMembers)),
          readonly_(readonly)
    {
        if (readonly_) {
            for (auto *it : Properties()) {
                it->AddFlag(binder::VariableFlags::READONLY);
            }
        }
    }

    ElementFlags CombinedFlags() const
    {
        return combinedFlags_;
    }

    uint32_t MinLength() const
    {
        return minLength_;
    }

    uint32_t FixedLength() const
    {
        return fixedLength_;
    }

    bool HasCombinedFlag(ElementFlags combinedFlag) const
    {
        return (combinedFlags_ & combinedFlag) != 0;
    }

    bool IsReadOnly() const
    {
        return readonly_;
    }

    const NamedTupleMemberPool &NamedMembers() const
    {
        return namedMembers_;
    }

    const util::StringView &FindNamedMemberName(binder::LocalVariable *member) const
    {
        auto res = namedMembers_.find(member);
        return res->second;
    }

    Type *ConvertToArrayType(Checker *checker);

    void ToString(std::stringstream &ss) const override;
    void Identical(TypeRelation *relation, Type *other) override;
    void AssignmentTarget(TypeRelation *relation, Type *source) override;
    TypeFacts GetTypeFacts() const override;
    Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) override;

private:
    ArenaVector<ElementFlags> elementFlags_;
    ElementFlags combinedFlags_ {};
    uint32_t minLength_ {};
    uint32_t fixedLength_ {};
    NamedTupleMemberPool namedMembers_ {};
    bool readonly_ {};
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_TUPLE_TYPE_H */
