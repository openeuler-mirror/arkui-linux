/*
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

#ifndef ES2PANDA_UTIL_INCLUDE_BITSET_H
#define ES2PANDA_UTIL_INCLUDE_BITSET_H

#include <macros.h>

#include <cstddef>
#include <cstdint>

namespace panda::es2panda::util {

class BitSet {
public:
    explicit BitSet(size_t size);
    NO_COPY_SEMANTIC(BitSet);
    DEFAULT_MOVE_SEMANTIC(BitSet);
    ~BitSet();

    void Clear(bool value) noexcept;
    void Set(size_t pos) noexcept;
    void Set(size_t pos, bool value) noexcept;
    bool Test(size_t pos) const noexcept;

private:
    static const size_t shiftOffset = 3;
    static const size_t shiftMask = (1U << shiftOffset) - 1;
    size_t DataSize() const noexcept;

    uint8_t *data_;
    size_t size_;
};

}  // namespace panda::es2panda::util

#endif
