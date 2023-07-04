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

#include "arrayType.h"

#include <binder/variable.h>
#include <typescript/types/objectType.h>

namespace panda::es2panda::checker {

void ArrayType::ToString(std::stringstream &ss) const
{
    bool elemIsUnion = (element_->TypeFlags() == TypeFlag::UNION);
    if (elemIsUnion) {
        ss << "(";
    }
    ElementType()->ToString(ss);
    if (elemIsUnion) {
        ss << ")";
    }
    ss << "[]";
}

void ArrayType::Identical(TypeRelation *relation, Type *other)
{
    if (other->IsArrayType()) {
        relation->IsIdenticalTo(element_, other->AsArrayType()->ElementType());
    }
}

void ArrayType::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (source->IsArrayType()) {
        relation->IsAssignableTo(source->AsArrayType()->ElementType(), element_);
    } else if (source->IsObjectType() && source->AsObjectType()->IsTupleType()) {
        ObjectType *sourceObj = source->AsObjectType();
        for (auto *it : sourceObj->Properties()) {
            if (!relation->IsAssignableTo(it->TsType(), element_)) {
                return;
            }
        }
        relation->Result(true);
    }
}

TypeFacts ArrayType::GetTypeFacts() const
{
    return TypeFacts::OBJECT_FACTS;
}

Type *ArrayType::Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes)
{
    return allocator->New<ArrayType>(element_->Instantiate(allocator, relation, globalTypes));
}

}  // namespace panda::es2panda::checker
