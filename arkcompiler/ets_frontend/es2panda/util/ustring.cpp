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

#include "ustring.h"

#include <iterator>

namespace panda::es2panda::util {

std::string StringView::Mutf8() const noexcept
{
    std::string mutf8;
    mutf8.reserve(sv_.size());

    Iterator iter(*this);

    while (iter.HasNext()) {
        Mutf8Encode(&mutf8, iter.Next());
    }

    return mutf8;
}

char32_t StringView::DecodeSurrogates(char32_t high, char32_t low)
{
    constexpr auto OFFSET = 10;
    char32_t result = (high - Constants::SURROGATE_HIGH_MIN) << OFFSET;
    result += low - Constants::SURROGATE_LOW_MAX;
    result += Constants::CELESTIAL_OFFSET;
    return result;
}

std::tuple<char32_t, char32_t> StringView::EncodeSurrogate(char32_t cp)
{
    constexpr auto OFFSET = 10;
    char32_t cu1 = ((cp - Constants::CELESTIAL_OFFSET) >> OFFSET) | Constants::SURROGATE_HIGH_MIN;
    char32_t cu2 = (cp & Constants::SURROGATE_LOW_MARKER) | Constants::SURROGATE_HIGH_MAX;

    return {cu1, cu2};
}

void StringView::Iterator::SkipCp() const
{
    if (!HasNext()) {
        return;
    }

    char32_t cu0 = static_cast<uint8_t>(*iter_++);

    if (cu0 < Constants::UTF8_1BYTE_LIMIT) {
        return;
    }

    if ((cu0 & Constants::UTF8_3BYTE_HEADER) == Constants::UTF8_2BYTE_HEADER) {
        iter_ += 1U;
        return;
    }

    if ((cu0 & Constants::UTF8_4BYTE_HEADER) == Constants::UTF8_3BYTE_HEADER) {
        iter_ += 2U;
        return;
    }

    if (((cu0 & Constants::UTF8_DECODE_4BYTE_MASK) == Constants::UTF8_4BYTE_HEADER) &&
        (cu0 <= Constants::UTF8_DECODE_4BYTE_LIMIT)) {
        iter_ += 3U;
        return;
    }
}

}  // namespace panda::es2panda::util

// NOLINTNEXTLINE(cert-dcl58-cpp)
namespace std {

ostream &operator<<(ostream &os, const panda::es2panda::util::StringView &us)
{
    os << us.Utf8();
    return os;
}

}  // namespace std
