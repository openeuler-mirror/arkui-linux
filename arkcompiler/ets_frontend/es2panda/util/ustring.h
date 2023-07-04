/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_UTIL_INCLUDE_USTRING_H
#define ES2PANDA_UTIL_INCLUDE_USTRING_H

#include <macros.h>
#include <utils/arena_containers.h>

#include <cstddef>
#include <limits>
#include <memory>
#include <string>
#include <string_view>

namespace panda::es2panda::util {

class StringView {
public:
    explicit StringView() noexcept = default;
    explicit StringView(const ArenaString *str) noexcept : sv_(*str) {}
    // NOLINTNEXTLINE(google-explicit-constructor)
    StringView(std::string_view sv) noexcept : sv_(sv) {}
    // NOLINTNEXTLINE(google-explicit-constructor)
    StringView(const char *str) noexcept : sv_(str) {}
    DEFAULT_COPY_SEMANTIC(StringView);
    DEFAULT_MOVE_SEMANTIC(StringView);
    ~StringView() = default;

    bool operator==(const StringView &rhs) const noexcept
    {
        return sv_ == rhs.sv_;
    }

    bool operator!=(const StringView &rhs) const noexcept
    {
        return sv_ != rhs.sv_;
    }

    bool operator<(const StringView &rhs) const noexcept
    {
        return sv_ < rhs.sv_;
    }

    bool operator>(const StringView &rhs) const noexcept
    {
        return sv_ > rhs.sv_;
    }

    int Compare(const StringView &other) const noexcept
    {
        return sv_.compare(other.sv_);
    }

    int Compare(const std::string_view &other) const noexcept
    {
        return sv_.compare(other);
    }

    bool Is(const char *str) const noexcept
    {
        return sv_ == str;
    }

    bool Is(const std::string_view &str) const noexcept
    {
        return sv_ == str;
    }

    size_t Length() const noexcept
    {
        return sv_.length();
    }

    bool Empty() const noexcept
    {
        return sv_.empty();
    }

    const std::string_view &Utf8() const noexcept
    {
        return sv_;
    }

    explicit operator std::string() const noexcept
    {
        return std::string {sv_};
    }

    const char *Bytes() const noexcept
    {
        return sv_.data();
    }

    StringView Substr(size_t begin, size_t end) const noexcept
    {
        return StringView(std::string_view(sv_.data() + begin, end - begin));
    }

    constexpr size_t Find(const char *str)
    {
        return sv_.find(str);
    }

    static bool IsHighSurrogate(char32_t cp)
    {
        return (cp >= Constants::SURROGATE_HIGH_MIN && cp < Constants::SURROGATE_HIGH_MAX);
    }

    static bool IsLowSurrogate(char32_t cp)
    {
        return (cp >= Constants::SURROGATE_LOW_MIN && cp < Constants::SURROGATE_LOW_MAX);
    }

    std::string Mutf8() const noexcept;
    static char32_t DecodeSurrogates(char32_t high, char32_t low);
    static std::tuple<char32_t, char32_t> EncodeSurrogate(char32_t cp);

    template <void encoder(std::string *, char32_t)>
    std::string EscapeSymbol() const;

    template <typename T>
    static void Utf8Encode(T *str, char32_t cu);
    template <typename T>
    static void Mutf8Encode(T *str, char32_t cu);

    class Iterator {
    public:
        static char32_t constexpr INVALID_CP = std::numeric_limits<char32_t>::max();

        explicit Iterator(const StringView &sv) noexcept : sv_(sv.sv_), iter_(sv_.begin()) {}
        DEFAULT_COPY_SEMANTIC(Iterator);
        DEFAULT_MOVE_SEMANTIC(Iterator);
        ~Iterator() = default;

        inline size_t Index() const
        {
            return static_cast<size_t>(iter_ - sv_.begin());
        }

        inline char32_t Next()
        {
            return DecodeCP<true>(nullptr);
        }

        inline char32_t Peek() const
        {
            return HasNext() ? *iter_ : INVALID_CP;
        }

        inline char32_t PeekCp() const
        {
            return DecodeCP<false>(nullptr);
        }

        inline char32_t PeekCp(size_t *cpSize) const
        {
            return DecodeCP<false, true>(cpSize);
        }

        inline void Forward(size_t offset) const
        {
            iter_ += offset;
        }

        inline void Backward(size_t offset) const
        {
            iter_ -= offset;
        }

        inline void Reset(size_t offset)
        {
            iter_ = sv_.begin() + offset;
        }

        inline void Rewind(std::string_view::const_iterator pos) const
        {
            iter_ = pos;
        }

        inline std::string_view::const_iterator Save() const
        {
            return iter_;
        }

        inline bool HasNext() const
        {
            return iter_ != sv_.end();
        }

        void SkipCp() const;

    private:
        template <bool moveIter, bool setCpSize = false>
        char32_t DecodeCP([[maybe_unused]] size_t *cpSize) const;

        std::string_view sv_;
        mutable std::string_view::const_iterator iter_;
    };

private:
    class Constants {
    public:
        static constexpr uint16_t UTF8_1BYTE_LIMIT = 0x80;
        static constexpr uint16_t UTF8_2BYTE_LIMIT = 0x800;
        static constexpr uint32_t UTF8_3BYTE_LIMIT = 0x10000;

        static constexpr uint16_t UTF8_2BYTE_MASK = 0x1F;
        static constexpr uint16_t UTF8_3BYTE_MASK = 0x0F;
        static constexpr uint16_t UTF8_4BYTE_MASK = 0x07;

        static constexpr uint16_t UTF8_DECODE_4BYTE_MASK = 0xf8;
        static constexpr uint16_t UTF8_DECODE_4BYTE_LIMIT = 0xf4;

        static constexpr uint16_t UTF8_2BYTE_HEADER = 0xC0;
        static constexpr uint16_t UTF8_3BYTE_HEADER = 0xE0;
        static constexpr uint16_t UTF8_4BYTE_HEADER = 0xF0;

        static constexpr uint16_t UTF8_2BYTE_SHIFT = 6U;
        static constexpr uint16_t UTF8_3BYTE_SHIFT = 12U;
        static constexpr uint16_t UTF8_4BYTE_SHIFT = 18U;

        static constexpr uint16_t UTF8_CONT_MASK = 0x3F;
        static constexpr uint16_t UTF8_CONT_HEADER = 0x80;

        static constexpr char32_t SURROGATE_HIGH_MIN = 0xD800;
        static constexpr char32_t SURROGATE_HIGH_MAX = 0xDC00;
        static constexpr char32_t SURROGATE_LOW_MIN = 0xDC00;
        static constexpr char32_t SURROGATE_LOW_MAX = 0xE000;
        static constexpr char32_t SURROGATE_LOW_MARKER = 0x3ff;
        static constexpr char32_t CELESTIAL_OFFSET = UTF8_3BYTE_LIMIT;
    };

    friend class Iterator;
    std::string_view sv_;
};

class UString {
public:
    UString() = default;
    explicit UString(ArenaAllocator *allocator) : allocator_(allocator) {}
    explicit UString(const std::string &str, ArenaAllocator *allocator) : UString(allocator)
    {
        Alloc();
        *str_ = str;
    }

    DEFAULT_COPY_SEMANTIC(UString);
    DEFAULT_MOVE_SEMANTIC(UString);
    ~UString() = default;

    util::StringView View() const
    {
        if (!str_) {
            return util::StringView();
        }

        return util::StringView(str_);
    }

    void Append(char32_t ch) noexcept
    {
        if (!str_) {
            Alloc();
        }

        StringView::Utf8Encode<ArenaString>(str_, ch);
    }

    void Append(const StringView &other) noexcept
    {
        if (!str_) {
            Alloc();
        }

        *str_ += other.Utf8();
    }

    void Append(const char *other) noexcept
    {
        if (!str_) {
            Alloc();
        }
        *str_ += other;
    }

private:
    void Alloc()
    {
        str_ = allocator_->New<ArenaString>(allocator_->Adapter());
    }

protected:
    ArenaString *str_ {};
    ArenaAllocator *allocator_ {};
};

template <bool moveIter, bool setCpSize>
char32_t StringView::Iterator::DecodeCP([[maybe_unused]] size_t *cpSize) const
{
    if (!HasNext()) {
        return INVALID_CP;
    }

    const auto *iterNext = iter_;

    char32_t cu0 = static_cast<uint8_t>(*iterNext++);
    char32_t res {};

    if (cu0 < Constants::UTF8_1BYTE_LIMIT) {
        res = cu0;
    } else if ((cu0 & Constants::UTF8_3BYTE_HEADER) == Constants::UTF8_2BYTE_HEADER) {
        char32_t cu1 = static_cast<uint8_t>(*iterNext++);
        res = ((cu0 & Constants::UTF8_2BYTE_MASK) << Constants::UTF8_2BYTE_SHIFT) | (cu1 & Constants::UTF8_CONT_MASK);
    } else if ((cu0 & Constants::UTF8_4BYTE_HEADER) == Constants::UTF8_3BYTE_HEADER) {
        char32_t cu1 = static_cast<uint8_t>(*iterNext++);
        char32_t cu2 = static_cast<uint8_t>(*iterNext++);
        res = ((cu0 & Constants::UTF8_3BYTE_MASK) << Constants::UTF8_3BYTE_SHIFT) |
              ((cu1 & Constants::UTF8_CONT_MASK) << Constants::UTF8_2BYTE_SHIFT) | (cu2 & Constants::UTF8_CONT_MASK);
    } else if (((cu0 & Constants::UTF8_DECODE_4BYTE_MASK) == Constants::UTF8_4BYTE_HEADER) &&
               (cu0 <= Constants::UTF8_DECODE_4BYTE_LIMIT)) {
        char32_t cu1 = static_cast<uint8_t>(*iterNext++);
        char32_t cu2 = static_cast<uint8_t>(*iterNext++);
        char32_t cu3 = static_cast<uint8_t>(*iterNext++);
        res = ((cu0 & Constants::UTF8_4BYTE_MASK) << Constants::UTF8_4BYTE_SHIFT) |
              ((cu1 & Constants::UTF8_CONT_MASK) << Constants::UTF8_3BYTE_SHIFT) |
              ((cu2 & Constants::UTF8_CONT_MASK) << Constants::UTF8_2BYTE_SHIFT) | (cu3 & Constants::UTF8_CONT_MASK);
    } else {
        res = INVALID_CP;
    }

    // NOLINTNEXTLINE(readability-braces-around-statements,bugprone-suspicious-semicolon)
    if constexpr (moveIter) {
        iter_ = iterNext;
        return res;
    }

    // NOLINTNEXTLINE(readability-braces-around-statements,bugprone-suspicious-semicolon)
    if constexpr (setCpSize) {
        *cpSize = iterNext - iter_;
    }

    return res;
}

template <void encoder(std::string *, char32_t)>
std::string StringView::EscapeSymbol() const
{
    std::string str;
    str.reserve(Length());

    Iterator iter(*this);

    while (iter.HasNext()) {
        auto cp = iter.Next();

        switch (cp) {
            case '\r': {
                if (iter.HasNext()) {
                    iter.Forward(1);

                    if (iter.Peek() != '\n') {
                        iter.Backward(1);
                    }
                }

                [[fallthrough]];
            }
            case '\n': {
                str += "\\n";
                break;
            }
            case '\b': {
                str += "\\b";
                break;
            }
            case '\t': {
                str += "\\t";
                break;
            }
            case '\f': {
                str += "\\f";
                break;
            }
            case '"': {
                str += "\\\"";
                break;
            }
            case '\\': {
                str += "\\\\";
                break;
            }
            default: {
                encoder(&str, cp);
            }
        }
    }

    return str;
}

template <typename T>
void StringView::Utf8Encode(T *str, char32_t cu)
{
    if (cu < Constants::UTF8_1BYTE_LIMIT) {
        str->push_back(static_cast<char>(cu));
    } else if (cu < Constants::UTF8_2BYTE_LIMIT) {
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_2BYTE_SHIFT) & Constants::UTF8_2BYTE_MASK) |
                                         Constants::UTF8_2BYTE_HEADER));
        str->push_back(static_cast<char>((cu & Constants::UTF8_CONT_MASK) | Constants::UTF8_CONT_HEADER));
    } else if (cu < Constants::UTF8_3BYTE_LIMIT) {
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_3BYTE_SHIFT) & Constants::UTF8_3BYTE_MASK) |
                                         Constants::UTF8_3BYTE_HEADER));
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_2BYTE_SHIFT) & Constants::UTF8_CONT_MASK) |
                                         Constants::UTF8_CONT_HEADER));
        str->push_back(static_cast<char>((cu & Constants::UTF8_CONT_MASK) | Constants::UTF8_CONT_HEADER));
    } else {
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_4BYTE_SHIFT) & Constants::UTF8_4BYTE_MASK) |
                                         Constants::UTF8_4BYTE_HEADER));
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_3BYTE_SHIFT) & Constants::UTF8_CONT_MASK) |
                                         Constants::UTF8_CONT_HEADER));
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_2BYTE_SHIFT) & Constants::UTF8_CONT_MASK) |
                                         Constants::UTF8_CONT_HEADER));
        str->push_back(static_cast<char>((cu & Constants::UTF8_CONT_MASK) | Constants::UTF8_CONT_HEADER));
    }
}

template <typename T>
void StringView::Mutf8Encode(T *str, char32_t cu)
{
    if (cu == 0) {
        str->push_back(static_cast<char>(Constants::UTF8_2BYTE_HEADER));
        str->push_back(static_cast<char>(Constants::UTF8_CONT_HEADER));
    } else if (cu < Constants::UTF8_1BYTE_LIMIT) {
        str->push_back(static_cast<char>(cu));
    } else if (cu < Constants::UTF8_2BYTE_LIMIT) {
        str->push_back(static_cast<char>((cu >> Constants::UTF8_2BYTE_SHIFT) | Constants::UTF8_2BYTE_HEADER));
        str->push_back(static_cast<char>((cu & Constants::UTF8_CONT_MASK) | Constants::UTF8_CONT_HEADER));
    } else if (cu < Constants::UTF8_3BYTE_LIMIT) {
        str->push_back(static_cast<char>((cu >> Constants::UTF8_3BYTE_SHIFT) | Constants::UTF8_3BYTE_HEADER));
        str->push_back(static_cast<char>(((cu >> Constants::UTF8_2BYTE_SHIFT) & Constants::UTF8_CONT_MASK) |
                                         Constants::UTF8_CONT_HEADER));
        str->push_back(static_cast<char>((cu & Constants::UTF8_CONT_MASK) | Constants::UTF8_CONT_HEADER));
    } else {
        auto [cu1, cu2] = EncodeSurrogate(cu);
        Mutf8Encode(str, cu1);
        Mutf8Encode(str, cu2);
    }
}

}  // namespace panda::es2panda::util

// NOLINTNEXTLINE(cert-dcl58-cpp)
namespace std {

template <>
// NOLINTNEXTLINE(altera-struct-pack-align)
struct hash<panda::es2panda::util::StringView> {
    std::size_t operator()(const panda::es2panda::util::StringView &str) const
    {
        return std::hash<std::string_view> {}(str.Utf8());
    }
};

ostream &operator<<(ostream &os, const panda::es2panda::util::StringView &us);

}  // namespace std

#endif
