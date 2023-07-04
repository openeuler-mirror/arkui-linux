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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_FACTS_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_FACTS_H

#include <util/enumbitops.h>

namespace panda::es2panda::checker {

enum class TypeFacts {
    NONE = 0,
    TYPEOF_EQ_STRING = 1 << 0,        // typeof x === "string"
    TYPEOF_EQ_NUMBER = 1 << 1,        // typeof x === "number"
    TYPEOF_EQ_BIGINT = 1 << 2,        // typeof x === "bigint"
    TYPEOF_EQ_BOOLEAN = 1 << 3,       // typeof x === "boolean"
    TYPEOF_EQ_SYMBOL = 1 << 4,        // typeof x === "symbol"
    TYPEOF_EQ_OBJECT = 1 << 5,        // typeof x === "object"
    TYPEOF_EQ_FUNCTION = 1 << 6,      // typeof x === "function"
    TYPEOF_EQ_HOST_OBJECT = 1 << 7,   // typeof x === "xxx"
    TYPEOF_NE_STRING = 1 << 8,        // typeof x !== "string"
    TYPEOF_NE_NUMBER = 1 << 9,        // typeof x !== "number"
    TYPEOF_NE_BIGINT = 1 << 10,       // typeof x !== "bigint"
    TYPEOF_NE_BOOLEAN = 1 << 11,      // typeof x !== "boolean"
    TYPEOF_NE_SYMBOL = 1 << 12,       // typeof x !== "symbol"
    TYPEOF_NE_OBJECT = 1 << 13,       // typeof x !== "object"
    TYPEOF_NE_FUNCTION = 1 << 14,     // typeof x !== "function"
    TYPEOF_NE_HOST_OBJECT = 1 << 15,  // typeof x !== "xxx"
    EQ_UNDEFINED = 1 << 16,           // x === undefined
    EQ_NULL = 1 << 17,                // x === null
    EQ_UNDEFINED_OR_NULL = 1 << 18,   // x === undefined / x === null
    NE_UNDEFINED = 1 << 19,           // x !== undefined
    NE_NULL = 1 << 20,                // x !== null
    NE_UNDEFINED_OR_NULL = 1 << 21,   // x != undefined / x != null
    TRUTHY = 1 << 22,                 // x
    FALSY = 1 << 23,                  // !x
    ALL = (1 << 24) - 1,

    // Number facts
    BASE_NUMBER_STRICT_FACTS = TYPEOF_EQ_NUMBER | TYPEOF_NE_STRING | TYPEOF_NE_BIGINT | TYPEOF_NE_BOOLEAN |
                               TYPEOF_NE_SYMBOL | TYPEOF_NE_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT |
                               NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL,
    BASE_NUMBER_FACTS = BASE_NUMBER_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,
    NUMBER_FACTS = BASE_NUMBER_FACTS | TRUTHY,
    ZERO_NUMBER_STRICT_FACTS = BASE_NUMBER_STRICT_FACTS | FALSY,
    ZERO_NUMBER_FACTS = BASE_NUMBER_FACTS,
    NON_ZERO_NUMBER_FACTS = BASE_NUMBER_FACTS | TRUTHY,

    // String facts
    BASE_STRING_STRICT_FACTS = TYPEOF_EQ_STRING | TYPEOF_NE_NUMBER | TYPEOF_NE_BIGINT | TYPEOF_NE_BOOLEAN |
                               TYPEOF_NE_SYMBOL | TYPEOF_NE_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT |
                               NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL,
    BASE_STRING_FACTS = BASE_STRING_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,
    STRING_FACTS = BASE_STRING_FACTS | TRUTHY,
    EMPTY_STRING_STRICT_FACTS = BASE_STRING_STRICT_FACTS | FALSY | TRUTHY,
    EMPTY_STRING_FACTS = BASE_STRING_FACTS,
    NON_EMPTY_STRING_FACTS = BASE_STRING_FACTS | TRUTHY,

    // Symbol facts
    BASE_SYMBOL_STRICT_FACTS = TYPEOF_EQ_SYMBOL | TYPEOF_NE_NUMBER | TYPEOF_NE_BIGINT | TYPEOF_NE_BOOLEAN |
                               TYPEOF_NE_STRING | TYPEOF_NE_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT |
                               NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL,
    BASE_SYMBOL_FACTS = BASE_SYMBOL_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,
    SYMBOL_FACTS = BASE_SYMBOL_FACTS | TRUTHY,

    // Bigint facts
    BASE_BIGINT_STRICT_FACTS = TYPEOF_EQ_BIGINT | TYPEOF_NE_STRING | TYPEOF_NE_NUMBER | TYPEOF_NE_BOOLEAN |
                               TYPEOF_NE_SYMBOL | TYPEOF_NE_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT |
                               NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL,
    BASE_BIGINT_FACTS = BASE_BIGINT_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,
    BIGINT_FACTS = BASE_BIGINT_FACTS | TRUTHY,
    ZERO_BIGINT_STRICT_FACTS = BASE_BIGINT_STRICT_FACTS | FALSY,
    ZERO_BIGINT_FACTS = BASE_BIGINT_FACTS,
    NON_ZERO_BIGINT_FACTS = BASE_BIGINT_FACTS | TRUTHY,

    // Boolean facts
    BASE_BOOLEAN_STRICT_FACTS = TYPEOF_NE_BIGINT | TYPEOF_NE_STRING | TYPEOF_NE_NUMBER | TYPEOF_EQ_BOOLEAN |
                                TYPEOF_NE_SYMBOL | TYPEOF_NE_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT |
                                NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL,
    BASE_BOOLEAN_FACTS = BASE_BOOLEAN_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,
    BOOLEAN_FACTS = BASE_BOOLEAN_FACTS | TRUTHY,
    FALSE_STRICT_FACTS = BASE_BOOLEAN_STRICT_FACTS | FALSY,
    FALSE_FACTS = BASE_BOOLEAN_FACTS,
    TRUE_STRICT_FACTS = BASE_BOOLEAN_STRICT_FACTS | TRUTHY,
    TRUE_FACTS = BASE_BOOLEAN_FACTS | TRUTHY,

    // Object facts
    OBJECT_STRICT_FACTS = TYPEOF_NE_BIGINT | TYPEOF_NE_STRING | TYPEOF_NE_NUMBER | TYPEOF_NE_BOOLEAN |
                          TYPEOF_NE_SYMBOL | TYPEOF_EQ_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_EQ_HOST_OBJECT |
                          NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL | TRUTHY,
    OBJECT_FACTS = OBJECT_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,
    EMPTY_OBJECT_STRICT_FACTS = ALL & ~(EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL),
    EMPTY_OBJECT_FACTS = ALL,

    // Function facts
    FUNCTION_STRICT_FACTS = TYPEOF_NE_BIGINT | TYPEOF_NE_STRING | TYPEOF_NE_NUMBER | TYPEOF_NE_BOOLEAN |
                            TYPEOF_NE_SYMBOL | TYPEOF_NE_OBJECT | TYPEOF_EQ_FUNCTION | TYPEOF_EQ_HOST_OBJECT |
                            NE_UNDEFINED | NE_NULL | NE_UNDEFINED_OR_NULL | TRUTHY,
    FUNCTION_FACTS = FUNCTION_STRICT_FACTS | EQ_UNDEFINED | EQ_NULL | EQ_UNDEFINED_OR_NULL | FALSY,

    // Undefined facts
    UNDEFINED_FACTS = TYPEOF_NE_BIGINT | TYPEOF_NE_STRING | TYPEOF_NE_NUMBER | TYPEOF_NE_BOOLEAN | TYPEOF_NE_SYMBOL |
                      TYPEOF_NE_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT | EQ_UNDEFINED | NE_NULL |
                      EQ_UNDEFINED_OR_NULL | FALSY,

    // Null facts
    NULL_FACTS = TYPEOF_NE_BIGINT | TYPEOF_NE_STRING | TYPEOF_NE_NUMBER | TYPEOF_NE_BOOLEAN | TYPEOF_NE_SYMBOL |
                 TYPEOF_EQ_OBJECT | TYPEOF_NE_FUNCTION | TYPEOF_NE_HOST_OBJECT | NE_UNDEFINED | EQ_NULL |
                 EQ_UNDEFINED_OR_NULL | FALSY,
};

DEFINE_BITOPS(TypeFacts)

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_TYPE_FACTS_H */
