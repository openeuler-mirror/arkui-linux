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

#include "bigintLiteralType.h"

namespace panda::es2panda::checker {

void BigintLiteralType::ToString(std::stringstream &ss) const
{
    ss << value_;
}

void BigintLiteralType::ToStringAsSrc(std::stringstream &ss) const
{
    ss << "bigint";
}

void BigintLiteralType::Identical(TypeRelation *relation, Type *other)
{
    if (other->IsBigintLiteralType()) {
        if (negative_ == other->AsBigintLiteralType()->Negative()) {
            relation->Result(value_ == other->AsBigintLiteralType()->Value());
        }
    }
}

void BigintLiteralType::AssignmentTarget([[maybe_unused]] TypeRelation *relation, [[maybe_unused]] Type *source) {}

TypeFacts BigintLiteralType::GetTypeFacts() const
{
    return value_.Is("0n") ? TypeFacts::ZERO_BIGINT_FACTS : TypeFacts::NON_ZERO_BIGINT_FACTS;
}

Type *BigintLiteralType::Instantiate([[maybe_unused]] ArenaAllocator *allocator,
                                     [[maybe_unused]] TypeRelation *relation,
                                     [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return this;
}

}  // namespace panda::es2panda::checker
