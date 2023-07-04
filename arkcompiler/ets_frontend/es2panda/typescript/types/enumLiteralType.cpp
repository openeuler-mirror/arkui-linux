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

#include "enumLiteralType.h"

#include <binder/variable.h>
#include <typescript/types/enumType.h>

namespace panda::es2panda::checker {

void EnumLiteralType::ToString(std::stringstream &ss) const
{
    ss << name_;
}

void EnumLiteralType::ToStringAsSrc(std::stringstream &ss) const
{
    ss << "typeof " << name_;
}

void EnumLiteralType::Identical([[maybe_unused]] TypeRelation *relation, [[maybe_unused]] Type *other) {}

void EnumLiteralType::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (source->IsEnumType()) {
        const EnumType *sourceEnumType = source->AsEnumType();

        if (variable_ == sourceEnumType->EnumVar()) {
            relation->Result(true);
        }
    } else if (source->HasTypeFlag(TypeFlag::NUMBER_LIKE)) {
        relation->Result(true);
    }
}

TypeFacts EnumLiteralType::GetTypeFacts() const
{
    return TypeFacts::NUMBER_FACTS;
}

Type *EnumLiteralType::Instantiate([[maybe_unused]] ArenaAllocator *allocator, [[maybe_unused]] TypeRelation *relation,
                                   [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return allocator->New<EnumLiteralType>(name_, scope_, kind_);
}

}  // namespace panda::es2panda::checker
