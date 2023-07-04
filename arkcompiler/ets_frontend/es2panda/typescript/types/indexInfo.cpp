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

#include "indexInfo.h"

#include <utility>

namespace panda::es2panda::checker {

IndexInfo *IndexInfo::Copy(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes)
{
    return allocator->New<IndexInfo>(type_->Instantiate(allocator, relation, globalTypes), paramName_, readonly_);
}

void IndexInfo::ToString(std::stringstream &ss, bool numIndex) const
{
    if (readonly_) {
        ss << "readonly ";
    }

    ss << "[" << paramName_ << ": ";

    if (numIndex) {
        ss << "number]: ";
    } else {
        ss << "string]: ";
    }

    type_->ToString(ss);
}

void IndexInfo::Identical(TypeRelation *relation, IndexInfo *other)
{
    relation->IsIdenticalTo(type_, other->GetType());
}

void IndexInfo::AssignmentTarget(TypeRelation *relation, IndexInfo *source)
{
    relation->IsAssignableTo(source->GetType(), type_);
}

}  // namespace panda::es2panda::checker
