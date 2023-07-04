/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "symbolType.h"

namespace panda::es2panda::checker {

void SymbolType::ToString(std::stringstream &ss) const
{
    ss << "symbol";
}

void SymbolType::Identical(TypeRelation *relation, Type *other)
{
    if (other->IsSymbolType()) {
        relation->Result(true);
    }
}

void SymbolType::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (source->IsSymbolType()) {
        relation->Result(true);
    }
}

TypeFacts SymbolType::GetTypeFacts() const
{
    return TypeFacts::SYMBOL_FACTS;
}

Type *SymbolType::Instantiate([[maybe_unused]] ArenaAllocator *allocator, [[maybe_unused]] TypeRelation *relation,
                              [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return this;
}

}  // namespace panda::es2panda::checker
