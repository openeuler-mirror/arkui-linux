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

#ifndef ES2PANDA_COMPILER_IR_INLINE_CACHE_H
#define ES2PANDA_COMPILER_IR_INLINE_CACHE_H

#include <macros.h>

namespace panda::es2panda::compiler {

class InlineCache {
public:
    explicit InlineCache() = default;

    size_t Size() const;
    uint32_t Offset(uint32_t slotSize);

private:
    size_t size_ {};
};

}  // namespace panda::es2panda::compiler

#endif
