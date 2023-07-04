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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_FLAG_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_FLAG_H

#include <util/enumbitops.h>

#include <cinttypes>

namespace panda::es2panda::checker {

enum class TypeFlag : uint64_t {
    NONE = 0,
    NUMBER = 1ULL << 0,             // x: number
    STRING = 1ULL << 1,             // x: string
    BOOLEAN = 1ULL << 2,            // x: boolean
    VOID = 1ULL << 3,               // x: void
    NULL_TYPE = 1ULL << 4,          // x: null
    UNDEFINED = 1ULL << 5,          // x: undefined
    UNKNOWN = 1ULL << 6,            // x: unknown
    NEVER = 1ULL << 7,              // x: never
    UNION = 1ULL << 8,              // x: a | b
    OBJECT = 1ULL << 9,             // x: object
    BIGINT = 1ULL << 10,            // x: bigint
    BOOLEAN_LITERAL = 1ULL << 11,   // x: true
    NUMBER_LITERAL = 1ULL << 12,    // x: 10
    STRING_LITERAL = 1ULL << 13,    // x: "foo"
    BIGINT_LITERAL = 1ULL << 14,    // x: 10n
    ENUM = 1ULL << 15,              // enum x
    ENUM_LITERAL = 1ULL << 16,      // member of enum
    SYMBOL = 1ULL << 17,            // x: symbol
    UNIQUE_SYMBOL = 1ULL << 18,     // one of JS unique symbols
    TYPE_PARAMETER = 1ULL << 19,    // function<x>
    INTERSECTION = 1ULL << 20,      // x: a & b
    INDEX = 1ULL << 21,             // keyof x
    INDEX_ACCESS = 1ULL << 22,      // x[a]
    CONDITIONAL = 1ULL << 23,       // x extends a ? b : c
    SUBSTITUTION = 1ULL << 24,      // type parameter substitution
    TEMPLATE_LITERAL = 1ULL << 25,  // x: `hello ${World}`
    STRING_MAPPING = 1ULL << 27,    // Uppercase/Lowercase type
    ANY = 1ULL << 28,               // x: any
    ARRAY = 1ULL << 29,             // x: number[]
    FUNCTION = 1ULL << 30,          // x: (a) => b
    NON_PRIMITIVE = 1ULL << 31,     // x: object
    TYPE_REFERENCE = 1ULL << 32,
    READONLY = 1ULL << 33,
    COMPUTED_TYPE_LITERAL_NAME = STRING_LITERAL | NUMBER_LITERAL | ENUM,
    COMPUTED_NAME = COMPUTED_TYPE_LITERAL_NAME | STRING | NUMBER | ANY | SYMBOL,
    ANY_OR_UNKNOWN = ANY | UNKNOWN,
    ANY_OR_VOID = ANY | VOID,
    NULLABLE = UNDEFINED | NULL_TYPE,
    ANY_OR_NULLABLE = ANY | NULLABLE,
    LITERAL = NUMBER_LITERAL | BOOLEAN_LITERAL | STRING_LITERAL | BIGINT_LITERAL,
    NUMBER_LIKE = NUMBER | NUMBER_LITERAL,
    NUMBER_LIKE_ENUM = NUMBER_LIKE | ENUM,
    STRING_LIKE = STRING | STRING_LITERAL,
    BOOLEAN_LIKE = BOOLEAN | BOOLEAN_LITERAL,
    BIGINT_LIKE = BIGINT | BIGINT_LITERAL,
    VOID_LIKE = VOID | UNDEFINED,
    NUMBER_OR_ANY = NUMBER | ANY,
    PRIMITIVE = STRING | NUMBER | BIGINT | BOOLEAN | ENUM | ENUM_LITERAL | SYMBOL | VOID | UNDEFINED | NULL_TYPE |
                LITERAL | UNIQUE_SYMBOL,
    PRIMITIVE_OR_ANY = PRIMITIVE | ANY,
    UNION_OR_INTERSECTION = UNION | INTERSECTION,
    DEFINITELY_FALSY =
        STRING_LITERAL | NUMBER_LITERAL | BOOLEAN_LITERAL | BIGINT_LITERAL | VOID | UNDEFINED | NULL_TYPE,
    POSSIBLY_FALSY = DEFINITELY_FALSY | STRING | NUMBER | BOOLEAN | BIGINT,
    VALID_ARITHMETIC_TYPE = ANY | NUMBER_LIKE | BIGINT_LIKE | ENUM,
    UNIT = LITERAL | UNIQUE_SYMBOL | NULLABLE,
};

DEFINE_BITOPS(TypeFlag)

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_TYPE_FLAG_H */
