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

#include "constructorType.h"

#include <typescript/types/signature.h>

namespace panda::es2panda::checker {

void ConstructorType::ToString(std::stringstream &ss) const
{
    if (desc_->constructSignatures.size() > 1) {
        ss << "{ ";
    }

    for (auto it = desc_->constructSignatures.begin(); it != desc_->constructSignatures.end(); it++) {
        (*it)->ToString(ss, variable_);
        if (std::next(it) != desc_->constructSignatures.end()) {
            ss << ", ";
        }
    }

    if (desc_->constructSignatures.size() > 1) {
        ss << " }";
    }
}

TypeFacts ConstructorType::GetTypeFacts() const
{
    return TypeFacts::FUNCTION_FACTS;
}

Type *ConstructorType::Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes)
{
    ObjectDescriptor *copiedDesc = allocator->New<ObjectDescriptor>(allocator);
    desc_->Copy(allocator, copiedDesc, relation, globalTypes);
    return allocator->New<ConstructorType>(copiedDesc);
}

}  // namespace panda::es2panda::checker
