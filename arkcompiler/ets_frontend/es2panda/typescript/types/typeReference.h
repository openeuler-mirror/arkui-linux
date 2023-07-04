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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_REFERENCE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_REFERENCE_H

#include "type.h"

namespace panda::es2panda::checker {

class TypeReference : public Type {
public:
    explicit TypeReference(Type **ref) : Type(TypeFlag::TYPE_REFERENCE), ref_(ref) {}

    Type *Ref()
    {
        return *ref_;
    }

    const Type *Ref() const
    {
        return *ref_;
    }

    void ToString(std::stringstream &ss) const override;
    void Identical(TypeRelation *relation, Type *other) override;
    void AssignmentTarget(TypeRelation *relation, Type *source) override;
    TypeFacts GetTypeFacts() const override;
    Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) override;

private:
    Type **ref_;
};

}  // namespace panda::es2panda::checker

#endif /* ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_REFERENCE_H */
