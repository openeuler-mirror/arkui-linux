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

#include "type.h"

#include <typescript/types/typeFlag.h>
#include <typescript/types/typeFacts.h>
#include <typescript/types/typeRelation.h>

namespace panda::es2panda::checker {

void Type::ToStringAsSrc(std::stringstream &ss) const
{
    ToString(ss);
}

void Type::Identical(TypeRelation *relation, Type *other)
{
    relation->Result(typeFlags_ == other->TypeFlags());
}

bool Type::AssignmentSource([[maybe_unused]] TypeRelation *relation, [[maybe_unused]] Type *target)
{
    return false;
}

void Type::Compare([[maybe_unused]] TypeRelation *relation, [[maybe_unused]] Type *other) {}

Type *Type::Instantiate([[maybe_unused]] ArenaAllocator *allocator, [[maybe_unused]] TypeRelation *relation,
                        [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return nullptr;
}

}  // namespace panda::es2panda::checker
