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

#include "typeReference.h"

namespace panda::es2panda::checker {

void TypeReference::ToString(std::stringstream &ss) const
{
    if (*ref_) {
        (*ref_)->ToString(ss);
    }
}

void TypeReference::Identical(TypeRelation *relation, Type *other)
{
    if (*ref_) {
        (*ref_)->Identical(relation, other);
    }
}

void TypeReference::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (*ref_) {
        (*ref_)->AssignmentTarget(relation, source->IsTypeReference() ? source->AsTypeReference()->Ref() : source);
    }
}

TypeFacts TypeReference::GetTypeFacts() const
{
    if (*ref_) {
        return (*ref_)->GetTypeFacts();
    }

    return TypeFacts::NONE;
}

Type *TypeReference::Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes)
{
    if (*ref_) {
        return (*ref_)->Instantiate(allocator, relation, globalTypes);
    }

    UNREACHABLE();
    return nullptr;
}

}  // namespace panda::es2panda::checker
