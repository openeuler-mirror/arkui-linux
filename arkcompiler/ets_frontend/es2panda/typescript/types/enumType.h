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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_ENUM_TYPE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_ENUM_TYPE_H

#include "type.h"

namespace panda::es2panda::binder {
class EnumVariable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::checker {

class EnumType : public Type {
public:
    EnumType(binder::Variable *enumLiteralVar, binder::EnumVariable *enumVar)
        : Type(TypeFlag::ENUM), enumLiteralVar_(enumLiteralVar), enumVar_(enumVar)
    {
    }

    const binder::Variable *EnumLiteralVar() const
    {
        return enumLiteralVar_;
    }

    const binder::EnumVariable *EnumVar() const
    {
        return enumVar_;
    }

    void ToString(std::stringstream &ss) const override;
    void Identical(TypeRelation *relation, Type *other) override;
    void AssignmentTarget(TypeRelation *relation, Type *source) override;
    TypeFacts GetTypeFacts() const override;
    Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) override;

private:
    binder::Variable *enumLiteralVar_;
    binder::EnumVariable *enumVar_;
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_ENUM_TYPE_H */
