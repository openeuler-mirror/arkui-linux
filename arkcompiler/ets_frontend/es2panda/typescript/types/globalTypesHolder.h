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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_GLOBAL_TYPES_HOLDER_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_GLOBAL_TYPES_HOLDER_H

#include "type.h"

namespace panda::es2panda::checker {

enum class GlobalTypeId {
    NUMBER,
    ANY,
    STRING,
    SYMBOL,
    BOOLEAN,
    VOID,
    NULL_ID,
    UNDEFINED,
    UNKNOWN,
    NEVER,
    NON_PRIMITIVE,
    BIGINT,
    FALSE_ID,
    TRUE_ID,
    NUMBER_OR_BIGINT,
    STRING_OR_NUMBER,
    ZERO,
    EMPTY_STRING,
    ZERO_BIGINT,
    PRIMITIVE,
    EMPTY_TUPLE,
    EMPTY_OBJECT,
    RESOLVING_RETURN_TYPE,
    ERROR_TYPE,
    COUNT
};

class GlobalTypesHolder {
public:
    explicit GlobalTypesHolder(ArenaAllocator *allocator);
    ~GlobalTypesHolder() = default;
    NO_COPY_SEMANTIC(GlobalTypesHolder);
    NO_MOVE_SEMANTIC(GlobalTypesHolder);

    Type *GlobalNumberType();
    Type *GlobalAnyType();
    Type *GlobalStringType();
    Type *GlobalSymbolType();
    Type *GlobalBooleanType();
    Type *GlobalVoidType();
    Type *GlobalNullType();
    Type *GlobalUndefinedType();
    Type *GlobalUnknownType();
    Type *GlobalNeverType();
    Type *GlobalNonPrimitiveType();
    Type *GlobalBigintType();
    Type *GlobalFalseType();
    Type *GlobalTrueType();
    Type *GlobalNumberOrBigintType();
    Type *GlobalStringOrNumberType();
    Type *GlobalZeroType();
    Type *GlobalEmptyStringType();
    Type *GlobalZeroBigintType();
    Type *GlobalPrimitiveType();
    Type *GlobalEmptyTupleType();
    Type *GlobalEmptyObjectType();
    Type *GlobalResolvingReturnType();
    Type *GlobalErrorType();

private:
    std::array<Type *, static_cast<size_t>(GlobalTypeId::COUNT)> globalTypes_ {};
};

}  // namespace panda::es2panda::checker

#endif /* ES2PANDA_COMPILER_TYPESCRIPT_TYPES_GLOBAL_TYPES_HOLDER_H */
