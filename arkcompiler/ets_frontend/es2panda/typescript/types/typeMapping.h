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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPE_MAPPING_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPE_MAPPING_H

#include "typeFlag.h"

#define TYPE_MAPPING(_)                              \
    _(TypeFlag::ARRAY, ArrayType)                    \
    _(TypeFlag::ANY, AnyType)                        \
    _(TypeFlag::BIGINT_LITERAL, BigintLiteralType)   \
    _(TypeFlag::NUMBER, NumberType)                  \
    _(TypeFlag::STRING, StringType)                  \
    _(TypeFlag::SYMBOL, SymbolType)                  \
    _(TypeFlag::BOOLEAN, BooleanType)                \
    _(TypeFlag::VOID, VoidType)                      \
    _(TypeFlag::NULL_TYPE, NullType)                 \
    _(TypeFlag::UNDEFINED, UndefinedType)            \
    _(TypeFlag::UNKNOWN, UnknownType)                \
    _(TypeFlag::NEVER, NeverType)                    \
    _(TypeFlag::UNION, UnionType)                    \
    _(TypeFlag::OBJECT, ObjectType)                  \
    _(TypeFlag::BIGINT, BigintType)                  \
    _(TypeFlag::BOOLEAN_LITERAL, BooleanLiteralType) \
    _(TypeFlag::NUMBER_LITERAL, NumberLiteralType)   \
    _(TypeFlag::STRING_LITERAL, StringLiteralType)   \
    _(TypeFlag::ENUM, EnumType)                      \
    _(TypeFlag::ENUM_LITERAL, EnumLiteralType)       \
    _(TypeFlag::TYPE_PARAMETER, TypeParameter)       \
    _(TypeFlag::TYPE_REFERENCE, TypeReference)       \
    _(TypeFlag::NON_PRIMITIVE, NonPrimitiveType)

#define OBJECT_TYPE_MAPPING(_)                      \
    _(ObjectType::ObjectTypeKind::FUNCTION, FunctionType)     \
    _(ObjectType::ObjectTypeKind::TUPLE, TupleType)           \
    _(ObjectType::ObjectTypeKind::LITERAL, ObjectLiteralType) \
    _(ObjectType::ObjectTypeKind::INTERFACE, InterfaceType)

#endif /* TYPE_MAPPING_H */
