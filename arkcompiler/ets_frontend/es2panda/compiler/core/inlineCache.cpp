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

#include "inlineCache.h"

#include <limits>

namespace panda::es2panda::compiler {

size_t InlineCache::Size() const
{
    return size_;
}

uint32_t InlineCache::Offset(uint32_t slotSize)
{
    uint32_t offset = size_ + slotSize;

    constexpr uint32_t LIMIT = std::numeric_limits<uint16_t>::max();
    if (offset > LIMIT) {
        return LIMIT;
    }

    size_ = offset;
    return offset;
}

}  // namespace panda::es2panda::compiler
