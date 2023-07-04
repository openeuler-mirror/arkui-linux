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

#include "bitset.h"
#include "securec.h"

#include <macros.h>

#include <cstring>
#include <utility>

namespace panda::es2panda::util {
BitSet::BitSet(size_t size) : size_(size)
{
    size_t dataSize = DataSize();
    data_ = new uint8_t[dataSize];
    memset_s(data_, dataSize, 0, dataSize);
}

BitSet::~BitSet()
{
    delete[] data_;
}

size_t BitSet::DataSize() const noexcept
{
    return (size_ >> shiftOffset) + 1;
}

void BitSet::Clear(bool value) noexcept
{
    memset_s(data_, DataSize(), value ? ((sizeof(uint8_t) << 8U) - 1) : 0, DataSize());
}

void BitSet::Set(size_t pos) noexcept
{
    Set(pos, true);
}

void BitSet::Set(size_t pos, bool value) noexcept
{
    ASSERT(pos < size_);
    size_t idx = pos >> shiftOffset;
    size_t slot = pos & shiftMask;

    if (value) {
        data_[idx] |= 1U << slot;
    } else {
        data_[idx] &= ~(1U << slot);
    }
}

bool BitSet::Test(size_t pos) const noexcept
{
    ASSERT(pos < size_);
    size_t idx = pos >> shiftOffset;
    size_t slot = pos & shiftMask;

    return (data_[idx] & (1U << slot)) != 0;
}

}  // namespace panda::es2panda::util
