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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_ELEMENT_FLAGS_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_ELEMENT_FLAGS_H

#include <util/enumbitops.h>

namespace panda::es2panda::checker {

enum class ElementFlags {
    NO_OPTS = 0,
    REQUIRED = 1 << 0,  // T
    OPTIONAL = 1 << 1,  // T?
    REST = 1 << 2,      // ...T[]
    VARIADIC = 1 << 3,  // ...T
    FIXED = REQUIRED | OPTIONAL,
    VARIABLE = REST | VARIADIC,
    NON_REQUIRED = OPTIONAL | REST | VARIADIC,
    NON_REST = REQUIRED | OPTIONAL | VARIADIC,
};

DEFINE_BITOPS(ElementFlags)

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_ELEMENT_FLAGS_H */
