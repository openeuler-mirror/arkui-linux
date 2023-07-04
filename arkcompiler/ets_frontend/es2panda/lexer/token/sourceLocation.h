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

#ifndef ES2PANDA_LEXER_TOKEN_SOURCE_LOCATION_H
#define ES2PANDA_LEXER_TOKEN_SOURCE_LOCATION_H

#include <macros.h>
#include <util/ustring.h>

#include <cstddef>
#include <cstdint>
#include <vector>

namespace panda::es2panda::lexer {

enum class SourceLocationFlag {
    VALID_SOURCE_LOCATION,
    INVALID_SOURCE_LOCATION
};

class SourcePosition {
public:
    explicit SourcePosition() noexcept = default;
    explicit SourcePosition(size_t i, size_t l) noexcept : index(i), line(l) {}
    DEFAULT_COPY_SEMANTIC(SourcePosition);
    DEFAULT_MOVE_SEMANTIC(SourcePosition);
    ~SourcePosition() = default;

    size_t index {};
    size_t line {};
};

class SourceRange {
public:
    explicit SourceRange() noexcept = default;
    SourceRange(SourcePosition s, SourcePosition e) noexcept : start(s), end(e) {}
    DEFAULT_COPY_SEMANTIC(SourceRange);
    DEFAULT_MOVE_SEMANTIC(SourceRange);
    ~SourceRange() = default;

    SourcePosition start {};
    SourcePosition end {};
};

class SourceLocation {
public:
    explicit SourceLocation() noexcept = default;
    explicit SourceLocation(size_t l, size_t c) noexcept : line(l), col(c) {}
    DEFAULT_COPY_SEMANTIC(SourceLocation);
    DEFAULT_MOVE_SEMANTIC(SourceLocation);
    ~SourceLocation() = default;

    size_t line {};
    size_t col {};
};

class Range {
public:
    explicit Range(size_t bS) noexcept : byteSize(bS) {}

    DEFAULT_COPY_SEMANTIC(Range);
    DEFAULT_MOVE_SEMANTIC(Range);
    ~Range() = default;

    size_t byteSize {};
    size_t cnt {1};
};

class OffsetEntry {
public:
    explicit OffsetEntry(size_t l) : lineStart(l), offset_(l) {};

    DEFAULT_COPY_SEMANTIC(OffsetEntry);
    DEFAULT_MOVE_SEMANTIC(OffsetEntry);
    ~OffsetEntry() = default;

    void AddCol(size_t offset);

    std::vector<Range> ranges {};
    size_t lineStart {};

private:
    size_t offset_ {};
};

class LineIndex {
public:
    explicit LineIndex(const util::StringView &source) noexcept;
    explicit LineIndex() noexcept = default;
    DEFAULT_COPY_SEMANTIC(LineIndex);
    DEFAULT_MOVE_SEMANTIC(LineIndex);
    ~LineIndex() = default;

    SourceLocation GetLocation(SourcePosition pos) noexcept;

private:
    std::vector<OffsetEntry> entrys_;
};

}  // namespace panda::es2panda::lexer

#endif
