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

#include "sourceLocation.h"

#include <lexer/token/letters.h>

#include <cstdint>

namespace panda::es2panda::lexer {

void OffsetEntry::AddCol(size_t offset)
{
    size_t diff = offset - offset_;
    offset_ = offset;

    if (ranges.empty()) {
        ranges.emplace_back(Range {diff});
        return;
    }

    auto &range = ranges.back();

    if (diff == range.byteSize) {
        range.cnt++;
    } else {
        ranges.emplace_back(Range {diff});
    }
}

LineIndex::LineIndex(const util::StringView &source) noexcept
{
    auto iter = util::StringView::Iterator(source);
    entrys_.emplace_back(0);

    while (true) {
        switch (iter.Next()) {
            case util::StringView::Iterator::INVALID_CP: {
                return;
            }
            case LEX_CHAR_CR: {
                if (iter.HasNext() && iter.Peek() == LEX_CHAR_LF) {
                    iter.Forward(1);
                }

                [[fallthrough]];
            }
            case LEX_CHAR_LF:
            case LEX_CHAR_PS:
            case LEX_CHAR_LS: {
                entrys_.emplace_back(iter.Index());
                break;
            }
            default: {
                entrys_.back().AddCol(iter.Index());
            }
        }
    }
}

SourceLocation LineIndex::GetLocation(SourcePosition pos) noexcept
{
    size_t line = pos.line;

    size_t col = 0;
    const auto &entry = entrys_[pos.line];
    size_t diff = pos.index - entry.lineStart;

    for (const auto &range : entry.ranges) {
        if (diff < (range.cnt * range.byteSize)) {
            col += (diff / range.byteSize) ;
            break;
        }

        diff -= range.cnt * range.byteSize;
        col += range.cnt;
    }

    return SourceLocation(line + 1, col + 1);
}

}  // namespace panda::es2panda::lexer
