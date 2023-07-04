/**
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

#ifndef ES2PANDA_PARSER_CORE_LEXER_H
#define ES2PANDA_PARSER_CORE_LEXER_H

#include <lexer/regexp/regexp.h>
#include <lexer/token/letters.h>
#include <lexer/token/token.h>
#include <util/enumbitops.h>

namespace panda::es2panda::parser {
class ParserContext;
}  // namespace panda::es2panda::parser

namespace panda::es2panda::lexer {

enum class LexerNextTokenFlags {
    NONE = 0,
    KEYWORD_TO_IDENT = 1 << 0,
    NUMERIC_SEPARATOR_ALLOWED = 1 << 1,
    BIGINT_ALLOWED = 1 << 2,
};

DEFINE_BITOPS(LexerNextTokenFlags)

class LexerPosition {
public:
    explicit LexerPosition(const util::StringView &source);
    DEFAULT_COPY_SEMANTIC(LexerPosition);
    DEFAULT_MOVE_SEMANTIC(LexerPosition);
    ~LexerPosition() = default;

    Token token {};
    util::StringView::Iterator iterator;
    size_t line {};
    size_t nextTokenLine {};
};

class LexerTemplateString {
public:
    explicit LexerTemplateString(ArenaAllocator *allocator) : str(allocator) {}
    DEFAULT_COPY_SEMANTIC(LexerTemplateString);
    DEFAULT_MOVE_SEMANTIC(LexerTemplateString);
    ~LexerTemplateString() = default;

    util::UString str;
    size_t end {};
    bool scanExpression {};
};

class TemplateLiteralParserContext;

class Lexer {
public:
    explicit Lexer(const parser::ParserContext *parserContext);
    NO_COPY_SEMANTIC(Lexer);
    NO_MOVE_SEMANTIC(Lexer);
    ~Lexer() = default;

    void NextToken(LexerNextTokenFlags flags = LexerNextTokenFlags::NONE);

    Token &GetToken();
    const Token &GetToken() const;
    size_t Line() const;

    LexerPosition Save() const;
    void Rewind(const LexerPosition &pos);
    void BackwardToken(TokenType type, size_t offset);
    void ForwardToken(TokenType type, size_t offset);

    char32_t Lookahead();
    bool CheckArrow();

    RegExp ScanRegExp();
    template <char32_t end>
    void ScanString();
    void ResetTokenEnd();
    LexerTemplateString ScanTemplateString();
    void ScanTemplateStringEnd();
    void PushTemplateContext(TemplateLiteralParserContext *ctx);

private:
    ArenaAllocator *Allocator();
    bool IsLineTerminatorOrEos() const;
    void ScanRegExpPattern();
    RegExpFlags ScanRegExpFlags();

    void ThrowError(std::string_view message);

    void SetTokenStart();
    void SetTokenEnd();

    inline util::StringView::Iterator &Iterator()
    {
        return pos_.iterator;
    }

    inline const util::StringView::Iterator &Iterator() const
    {
        return pos_.iterator;
    }

    util::StringView SourceView(const util::StringView::Iterator &begin, const util::StringView::Iterator &end) const;
    util::StringView SourceView(size_t begin, size_t end) const;

    void SkipWhiteSpaces();
    void SkipSingleLineComment();
    void SkipMultiLineComment();
    template <TokenType keyword_type>
    void CheckKeyword([[maybe_unused]] TokenType type, [[maybe_unused]] LexerNextTokenFlags flags);
    void CheckKeywordEscape(TokenType type);
    void CheckAwaitKeyword();
    void CheckEnumKeyword();
    void CheckLetKeyword();
    void CheckYieldKeyword();
    void CheckFutureReservedKeyword(TokenType keywordType);

    bool ScanPunctuator();
    void ScanQuestionPunctuator();
    void ScanLessThanPunctuator();
    void ScanGreaterThanPunctuator();
    void ScanEqualsPunctuator();
    void ScanExclamationPunctuator();
    void ScanAmpersandPunctuator();
    void ScanVLinePunctuator();
    void ScanCircumflexPunctuator();
    void ScanPlusPunctuator();
    void ScanMinusPunctuator();
    void ScanAsterixPunctuator();
    void ScanSlashPunctuator();
    void ScanPercentPunctuator();
    void ScanDotPunctuator();

    char32_t ScanUnicodeEscapeSequence();
    template <int N>
    char32_t ScanHexEscape();
    char32_t ScanUnicodeCodePointEscape();

    void ScanStringUnicodePart(util::UString *str);

    void ScanNumberLeadingZero();
    void ScanDecimalNumbers(bool allowNumericSeparator);
    template <bool rangeCheck(char32_t), int radix>
    void ScanNumberRadix(bool allowNumericSeparator = true);
    void ScanNumber(bool allowNumericSeparator = true, bool allowBigInt = true);
    void ConvertNumber(size_t exponentSignPos);
    void ScanDecimalLiteral();
    void ScanDecimalDigits(bool allowNumericSeparator);
    void CheckNumberLiteralEnd();

    inline static uint32_t HexValue(char32_t ch);
    inline static bool IsDecimalDigit(uint32_t cp);
    inline static bool IsHexDigit(char32_t ch);
    inline static bool IsBinaryDigit(char32_t ch);
    inline static bool IsOctalDigit(char32_t ch);

    friend class KeywordsUtil;
    friend class TemplateLiteralParserContext;
    TemplateLiteralParserContext *tlCtx_ {};
    ArenaAllocator *allocator_;
    const parser::ParserContext *parserContext_;
    util::StringView source_;
    LexerPosition pos_;
    bool isUnderscore_ = false;
};

class TemplateLiteralParserContext {
public:
    explicit TemplateLiteralParserContext(Lexer *lexer) : lexer_(lexer), prev_(lexer_->tlCtx_) {}
    NO_MOVE_SEMANTIC(TemplateLiteralParserContext);
    NO_COPY_SEMANTIC(TemplateLiteralParserContext);

    ~TemplateLiteralParserContext()
    {
        lexer_->tlCtx_ = prev_;
    }

    void ConsumeLeftBrace()
    {
        braceDepth_++;
    }

    bool ConsumeRightBrace()
    {
        braceDepth_--;

        return braceDepth_ == 0;
    }

private:
    Lexer *lexer_;
    TemplateLiteralParserContext *prev_ {};
    size_t braceDepth_ {1};
};

template <char32_t end>
void Lexer::ScanString()
{
    util::UString str(Allocator());
    GetToken().type_ = TokenType::LITERAL_STRING;

    const auto startPos = Iterator().Index();
    auto escapeEnd = startPos;

    do {
        char32_t cp = Iterator().Peek();

        switch (cp) {
            case util::StringView::Iterator::INVALID_CP: {
                ThrowError("Unterminated string");
                break;
            }
            case LEX_CHAR_CR:
            case LEX_CHAR_LF: {
                // NOLINTNEXTLINE(readability-braces-around-statements,bugprone-suspicious-semicolon)
                if constexpr (end != LEX_CHAR_BACK_TICK) {
                    ThrowError("Newline is not allowed in strings");
                }

                GetToken().flags_ |= TokenFlags::HAS_ESCAPE;
                str.Append(SourceView(escapeEnd, Iterator().Index()));

                if (cp == LEX_CHAR_CR) {
                    Iterator().Forward(1);

                    if (Iterator().Peek() != LEX_CHAR_LF) {
                        Iterator().Backward(1);
                    }
                }

                pos_.line++;
                str.Append(LEX_CHAR_LF);
                Iterator().Forward(1);
                escapeEnd = Iterator().Index();
                continue;
            }
            case LEX_CHAR_BACKSLASH: {
                GetToken().flags_ |= TokenFlags::HAS_ESCAPE;
                str.Append(SourceView(escapeEnd, Iterator().Index()));

                Iterator().Forward(1);
                ScanStringUnicodePart(&str);
                escapeEnd = Iterator().Index();
                continue;
            }
            case LEX_CHAR_BACK_TICK:
            case LEX_CHAR_SINGLE_QUOTE:
            case LEX_CHAR_DOUBLE_QUOTE: {
                if (end == cp) {
                    break;
                }

                Iterator().Forward(1);
                continue;
            }
            case LEX_CHAR_DOLLAR_SIGN: {
                Iterator().Forward(1);

                // NOLINTNEXTLINE(readability-braces-around-statements,bugprone-suspicious-semicolon)
                if constexpr (end == LEX_CHAR_BACK_TICK) {
                    if (Iterator().Peek() == LEX_CHAR_LEFT_BRACE) {
                        Iterator().Backward(1);
                        break;
                    }
                }

                continue;
            }
            default: {
                Iterator().SkipCp();
                continue;
            }
        }

        if (GetToken().flags_ & TokenFlags::HAS_ESCAPE) {
            str.Append(SourceView(escapeEnd, Iterator().Index()));
            GetToken().src_ = str.View();
        } else {
            GetToken().src_ = SourceView(startPos, Iterator().Index());
        }

        break;
    } while (true);

    // NOLINTNEXTLINE(readability-braces-around-statements,bugprone-suspicious-semicolon)
    if constexpr (end != LEX_CHAR_BACK_TICK) {
        Iterator().Forward(1);
    }
}

template <int N>
char32_t Lexer::ScanHexEscape()
{
    char32_t code = 0;

    for (size_t i = 0; i < N; ++i) {
        const auto cp = Iterator().Peek();
        Iterator().Forward(1);

        if (!IsHexDigit(cp)) {
            ThrowError("Invalid unicode escape sequence");
        }

        constexpr auto MULTIPLIER = 16;
        code = code * MULTIPLIER + HexValue(cp);
    }

    return code;
}

template <bool rangeCheck(char32_t), int radix>
void Lexer::ScanNumberRadix(bool allowNumericSeparator)
{
    double number = 0.0;

    auto cp = Iterator().Peek();
    if (!rangeCheck(cp)) {
        ThrowError("Invalid digit");
    }

    bool allowNumericOnNext = true;

    do {
        cp = Iterator().Peek();
        if (rangeCheck(cp)) {
            number = number * radix + HexValue(cp);
            Iterator().Forward(1);
            allowNumericOnNext = true;
            continue;
        }

        if (cp == LEX_CHAR_UNDERSCORE) {
            if (!allowNumericSeparator || !allowNumericOnNext) {
                ThrowError("Invalid numeric separator");
            }

            GetToken().flags_ |= TokenFlags::NUMBER_HAS_UNDERSCORE;
            Iterator().Forward(1);
            allowNumericOnNext = false;
            continue;
        }

        if (!allowNumericOnNext) {
            Iterator().Backward(1);
            ThrowError("Numeric separators are not allowed at the end of numeric literals");
        }

        break;
    } while (true);

    GetToken().number_ = number;
}

template <TokenType keyword_type>
void Lexer::CheckKeyword([[maybe_unused]] TokenType type, [[maybe_unused]] LexerNextTokenFlags flags)
{
    // NOLINTNEXTLINE
    if constexpr (keyword_type == TokenType::KEYW_AWAIT) {
        CheckAwaitKeyword();
        return;
    }

    // NOLINTNEXTLINE
    if constexpr (keyword_type == TokenType::KEYW_ENUM) {
        CheckEnumKeyword();
        return;
    }

    // NOLINTNEXTLINE
    if constexpr (keyword_type == TokenType::KEYW_YIELD) {
        CheckYieldKeyword();
        return;
    }

    // NOLINTNEXTLINE
    if constexpr (keyword_type == TokenType::KEYW_LET) {
        CheckLetKeyword();
        return;
    }

    // NOLINTNEXTLINE
    if constexpr (keyword_type <= TokenType::KEYW_ASYNC) {
        CheckKeywordEscape(type);
        return;
    }

    // NOLINTNEXTLINE
    if constexpr (keyword_type >= TokenType::KEYW_PUBLIC) {
        // NOLINTNEXTLINE
        CheckFutureReservedKeyword(keyword_type);
        return;
    }

    GetToken().type_ = TokenType::LITERAL_IDENT;
}

inline uint32_t Lexer::HexValue(char32_t ch)
{
    constexpr uint32_t HEX_MASK = 0xF;
    constexpr uint32_t DEC_OFFSET = 10;
    return ch < LEX_CHAR_UPPERCASE_A ? ch - LEX_CHAR_0 : ((ch - LEX_CHAR_UPPERCASE_A + DEC_OFFSET) & HEX_MASK);
}

inline bool Lexer::IsDecimalDigit(uint32_t cp)
{
    return (cp >= LEX_CHAR_0 && cp <= LEX_CHAR_9);
}

inline bool Lexer::IsHexDigit(char32_t ch)
{
    return ch < LEX_ASCII_MAX_BITS && std::isxdigit(static_cast<unsigned char>(ch));
}

inline bool Lexer::IsBinaryDigit(char32_t ch)
{
    return ch == LEX_CHAR_0 || ch == LEX_CHAR_1;
}

inline bool Lexer::IsOctalDigit(char32_t ch)
{
    return (ch >= LEX_CHAR_0 && ch <= LEX_CHAR_7);
}

}  // namespace panda::es2panda::lexer

#endif
