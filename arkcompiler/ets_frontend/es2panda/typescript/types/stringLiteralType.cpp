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

#include "stringLiteralType.h"

namespace panda::es2panda::checker {

void StringLiteralType::ToString(std::stringstream &ss) const
{
    ss << "\"" << value_ << "\"";
}

void StringLiteralType::ToStringAsSrc(std::stringstream &ss) const
{
    ss << "string";
}

void StringLiteralType::Identical(TypeRelation *relation, Type *other)
{
    if (other->IsStringLiteralType()) {
        relation->Result(value_ == other->AsStringLiteralType()->Value());
    }
}

void StringLiteralType::AssignmentTarget([[maybe_unused]] TypeRelation *relation, [[maybe_unused]] Type *source) {}

TypeFacts StringLiteralType::GetTypeFacts() const
{
    return value_.Empty() ? TypeFacts::EMPTY_STRING_FACTS : TypeFacts::NON_EMPTY_STRING_FACTS;
}

Type *StringLiteralType::Instantiate([[maybe_unused]] ArenaAllocator *allocator,
                                     [[maybe_unused]] TypeRelation *relation,
                                     [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return this;
}

}  // namespace panda::es2panda::checker
