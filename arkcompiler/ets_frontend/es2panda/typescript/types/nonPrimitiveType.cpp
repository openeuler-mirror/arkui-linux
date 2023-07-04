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

#include "nonPrimitiveType.h"

namespace panda::es2panda::checker {

void NonPrimitiveType::ToString(std::stringstream &ss) const
{
    ss << "object";
}

void NonPrimitiveType::Identical(TypeRelation *relation, Type *other)
{
    if (other->IsNonPrimitiveType()) {
        relation->Result(true);
    }
}

void NonPrimitiveType::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (source->IsObjectType()) {
        relation->Result(true);
    }
}

TypeFacts NonPrimitiveType::GetTypeFacts() const
{
    return TypeFacts::OBJECT_FACTS;
}

Type *NonPrimitiveType::Instantiate([[maybe_unused]] ArenaAllocator *allocator, [[maybe_unused]] TypeRelation *relation,
                                    [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return this;
}

}  // namespace panda::es2panda::checker
