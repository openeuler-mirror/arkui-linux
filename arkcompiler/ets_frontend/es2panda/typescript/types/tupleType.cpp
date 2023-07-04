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

#include "tupleType.h"

#include <typescript/checker.h>

namespace panda::es2panda::checker {

Type *TupleType::ConvertToArrayType(Checker *checker)
{
    ArenaVector<Type *> unionTypes(checker->Allocator()->Adapter());

    for (const auto *it : desc_->properties) {
        unionTypes.push_back(it->TsType());
    }

    Type *arrayType = checker->CreateUnionType(std::move(unionTypes));
    return checker->Allocator()->New<ArrayType>(arrayType);
}

void TupleType::ToString(std::stringstream &ss) const
{
    if (readonly_) {
        ss << "readonly ";
    }
    ss << "[";

    if (namedMembers_.empty()) {
        for (auto it = desc_->properties.begin(); it != desc_->properties.end(); it++) {
            (*it)->TsType()->ToString(ss);
            if ((*it)->HasFlag(binder::VariableFlags::OPTIONAL)) {
                ss << "?";
            }

            if (std::next(it) != desc_->properties.end()) {
                ss << ", ";
            }
        }
    } else {
        for (auto it = desc_->properties.begin(); it != desc_->properties.end(); it++) {
            const util::StringView &memberName = FindNamedMemberName(*it);
            ss << memberName;

            if ((*it)->HasFlag(binder::VariableFlags::OPTIONAL)) {
                ss << "?";
            }

            ss << ": ";
            (*it)->TsType()->ToString(ss);
            if (std::next(it) != desc_->properties.end()) {
                ss << ", ";
            }
        }
    }

    ss << "]";
}

void TupleType::Identical(TypeRelation *relation, Type *other)
{
    if (other->IsObjectType() && other->AsObjectType()->IsTupleType()) {
        TupleType *otherTuple = other->AsObjectType()->AsTupleType();
        if (kind_ == otherTuple->Kind() && desc_->properties.size() == otherTuple->Properties().size()) {
            for (size_t i = 0; i < desc_->properties.size(); i++) {
                binder::LocalVariable *targetProp = desc_->properties[i];
                binder::LocalVariable *sourceProp = otherTuple->Properties()[i];

                if (targetProp->Flags() != sourceProp->Flags()) {
                    relation->Result(false);
                    return;
                }

                relation->IsIdenticalTo(targetProp->TsType(), sourceProp->TsType());

                if (!relation->IsTrue()) {
                    return;
                }
            }
            relation->Result(true);
        }
    }
}

void TupleType::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (!source->IsObjectType() || !source->AsObjectType()->IsTupleType()) {
        relation->Result(false);
        return;
    }

    TupleType *sourceTuple = source->AsObjectType()->AsTupleType();
    if (FixedLength() < sourceTuple->MinLength()) {
        relation->Result(false);
        return;
    }

    relation->Result(true);

    const auto &sourceProperties = sourceTuple->Properties();
    for (size_t i = 0; i < desc_->properties.size(); i++) {
        auto *targetProp = desc_->properties[i];

        if (i < sourceProperties.size()) {
            if (!targetProp->HasFlag(binder::VariableFlags::OPTIONAL) &&
                sourceProperties[i]->HasFlag(binder::VariableFlags::OPTIONAL)) {
                relation->Result(false);
                return;
            }

            Type *targetPropType = targetProp->TsType();
            Type *sourcePropType = sourceProperties[i]->TsType();
            if (!relation->IsAssignableTo(sourcePropType, targetPropType)) {
                return;
            }

            continue;
        }

        if (!targetProp->HasFlag(binder::VariableFlags::OPTIONAL)) {
            relation->Result(false);
            return;
        }
    }

    if (relation->IsTrue()) {
        AssignIndexInfo(relation, sourceTuple);
    }
}

TypeFacts TupleType::GetTypeFacts() const
{
    if (desc_->properties.empty()) {
        return TypeFacts::EMPTY_OBJECT_FACTS;
    }

    return TypeFacts::OBJECT_FACTS;
}

Type *TupleType::Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes)
{
    ObjectDescriptor *copiedDesc = allocator->New<ObjectDescriptor>(allocator);

    desc_->Copy(allocator, copiedDesc, relation, globalTypes);

    NamedTupleMemberPool copiedNamedMemberPool = namedMembers_;
    ArenaVector<ElementFlags> copiedElementFlags(allocator->Adapter());

    for (auto it : elementFlags_) {
        copiedElementFlags.push_back(it);
    }

    return allocator->New<TupleType>(copiedDesc, std::move(copiedElementFlags), combinedFlags_, minLength_,
                                     fixedLength_, readonly_, std::move(copiedNamedMemberPool));
}

}  // namespace panda::es2panda::checker
