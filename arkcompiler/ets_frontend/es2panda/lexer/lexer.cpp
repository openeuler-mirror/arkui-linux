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

#include "lexer.h"

#include <es2panda.h>
#include <gen/keywords.h>
#include <lexer/token/letters.h>
#include <lexer/token/tokenType.h>
#include <parser/context/parserContext.h>

#include <array>

namespace panda::es2panda::lexer {

LexerPosition::LexerPosition(const util::StringView &source) : iterator(source) {}

Lexer::Lexer(const parser::ParserContext *parserContext)
    : allocator_(parserContext->GetProgram()->Allocator()),
      parserContext_(parserContext),
      source_(parserContext->GetProgram()->SourceCode()),
      pos_(source_)
{
    SkipWhiteSpaces();
}

char32_t Lexer::ScanUnicodeEscapeSequence()
{
    ASSERT(Iterator().Peek() == LEX_CHAR_LOWERCASE_U);

    Iterator().Forward(1);

    if (Iterator().Peek() == LEX_CHAR_LEFT_BRACE) {
        Iterator().Forward(1);
        return ScanUnicodeCodePointEscape();
    }

    return ScanHexEscape<4>();
}

char32_t Lexer::ScanUnicodeCodePointEscape()
{
    double code = 0;
    char32_t cp {};

    while (true) {
        cp = Iterator().Peek();
        if (!IsHexDigit(cp)) {
            break;
        }

        Iterator().Forward(1);

        constexpr auto multiplier = 16;
        code = code * multiplier + HexValue(cp);
        if (code > UNICODE_CODE_POINT_MAX) {
            ThrowError("Invalid unicode escape sequence");
        }
    }

    if (cp != LEX_CHAR_RIGHT_BRACE) {
        ThrowError("Invalid unicode escape sequence");
    }

    Iterator().Forward(1);
    return static_cast<char32_t>(code);
}

ArenaAllocator *Lexer::Allocator()
{
    return allocator_;
}

Token &Lexer::GetToken()
{
    return pos_.token;
}

const Token &Lexer::GetToken() const
{
    return pos_.token;
}

size_t Lexer::Line() const
{
    return pos_.line;
}

LexerPosition Lexer::Save() const
{
    return pos_;
}

void Lexer::BackwardToken(TokenType type, size_t offset)
{
    pos_.token.type_ = type;
    pos_.iterator.Reset(GetToken().End().index - offset);
    pos_.nextTokenLine = 0;
}

void Lexer::ForwardToken(TokenType type, size_t offset)
{
    pos_.token.type_ = type;
    pos_.iterator.Forward(offset);
    SkipWhiteSpaces();
}

void Lexer::Rewind(const LexerPosition &pos)
{
    pos_ = pos;
}

char32_t Lexer::Lookahead()
{
    return Iterator().Peek();
}

util::StringView Lexer::SourceView(const util::StringView::Iterator &begin, const util::StringView::Iterator &end) const
{
    return SourceView(begin.Index(), end.Index());
}

util::StringView Lexer::SourceView(size_t begin, size_t end) const
{
    return source_.Substr(begin, end);
}

void Lexer::SkipMultiLineComment()
{
    while (true) {
        switch (Iterator().Next()) {
            case util::StringView::Iterator::INVALID_CP: {
                ThrowError("Unterminated multi-line comment");
                break;
            }
            case LEX_CHAR_CR: {
                if (Iterator().Peek() == LEX_CHAR_LF) {
                    Iterator().Forward(1);
                }

                [[fallthrough]];
            }
            case LEX_CHAR_LF:
            case LEX_CHAR_LS:
            case LEX_CHAR_PS: {
                pos_.nextTokenLine++;
                continue;
            }
            case LEX_CHAR_ASTERISK: {
                if (Iterator().Peek() == LEX_CHAR_SLASH) {
                    Iterator().Forward(1);
                    return;
                }

                break;
            }
            default: {
                break;
            }
        }
    }
}

/* New line character is not processed */
void Lexer::SkipSingleLineComment()
{
    while (true) {
        switch (Iterator().Next()) {
            case util::StringView::Iterator::INVALID_CP:
            case LEX_CHAR_CR: {
                if (Iterator().Peek() == LEX_CHAR_LF) {
                    Iterator().Forward(1);
                }

                [[fallthrough]];
            }
            case LEX_CHAR_LF:
            case LEX_CHAR_LS:
            case LEX_CHAR_PS: {
                pos_.nextTokenLine++;
                return;
            }
            default: {
                break;
            }
        }
    }
}

void Lexer::ThrowError(std::string_view message)
{
    throw es2panda::Error(es2panda::ErrorType::SYNTAX, message, pos_.line, Iterator().Index());
}

void Lexer::CheckNumberLiteralEnd()
{
    if (Iterator().Peek() == LEX_CHAR_LOWERCASE_N) {
        Iterator().Forward(1);
        GetToken().flags_ |= TokenFlags::NUMBER_BIGINT;
    }

    GetToken().src_ = SourceView(GetToken().Start().index, Iterator().Index());
    const auto nextCp = Iterator().PeekCp();
    if (KeywordsUtil::IsIdentifierStart(nextCp) || IsDecimalDigit(nextCp)) {
        ThrowError("Invalid numeric literal");
    }
}

void Lexer::ScanNumberLeadingZero()
{
    GetToken().type_ = TokenType::LITERAL_NUMBER;

    switch (Iterator().Peek()) {
        case LEX_CHAR_LOWERCASE_X:
        case LEX_CHAR_UPPERCASE_X: {
            Iterator().Forward(1);
            constexpr auto RADIX = 16;
            ScanNumberRadix<IsHexDigit, RADIX>();
            CheckNumberLiteralEnd();
            return;
        }
        case LEX_CHAR_LOWERCASE_B:
        case LEX_CHAR_UPPERCASE_B: {
            Iterator().Forward(1);
            constexpr auto RADIX = 2;
            ScanNumberRadix<IsBinaryDigit, RADIX>();
            CheckNumberLiteralEnd();
            return;
        }
        case LEX_CHAR_LOWERCASE_O:
        case LEX_CHAR_UPPERCASE_O: {
            Iterator().Forward(1);
            constexpr auto RADIX = 8;
            ScanNumberRadix<IsOctalDigit, RADIX>();

            switch (Iterator().Peek()) {
                case LEX_CHAR_8:
                case LEX_CHAR_9: {
                    ThrowError("Invalid octal digit");

                    [[fallthrough]];
                }
                default: {
                    break;
                }
            }

            CheckNumberLiteralEnd();
            return;
        }
        case LEX_CHAR_0:
        case LEX_CHAR_1:
        case LEX_CHAR_2:
        case LEX_CHAR_3:
        case LEX_CHAR_4:
        case LEX_CHAR_5:
        case LEX_CHAR_6:
        case LEX_CHAR_7: {
            ThrowError("Implicit octal literal not allowed");
            break;
        }
        case LEX_CHAR_8:
        case LEX_CHAR_9: {
            ThrowError("NonOctalDecimalIntegerLiteral is not enabled in strict mode code");
            break;
        }
        default: {
            break;
        }
    }

    ScanNumber(Iterator().Peek() == LEX_CHAR_0);
}

void Lexer::ScanDecimalNumbers(bool allowNumericSeparator)
{
    bool allowNumericOnNext = true;

    while (true) {
        switch (Iterator().Peek()) {
            case LEX_CHAR_0:
            case LEX_CHAR_1:
            case LEX_CHAR_2:
            case LEX_CHAR_3:
            case LEX_CHAR_4:
            case LEX_CHAR_5:
            case LEX_CHAR_6:
            case LEX_CHAR_7:
            case LEX_CHAR_8:
            case LEX_CHAR_9: {
                Iterator().Forward(1);
                allowNumericOnNext = true;
                break;
            }
            case LEX_CHAR_UNDERSCORE: {
                Iterator().Backward(1);
                isUnderscore_ = true;

                if (Iterator().Peek() == LEX_CHAR_DOT || !allowNumericSeparator || !allowNumericOnNext) {
                    Iterator().Forward(1);
                    ThrowError("Invalid numeric separator");
                }

                GetToken().flags_ |= TokenFlags::NUMBER_HAS_UNDERSCORE;
                Iterator().Forward(2);
                allowNumericOnNext = false;
                break;
            }
            default: {
                if (!allowNumericOnNext) {
                    ThrowError("Numeric separators are not allowed at the end of numeric literals");
                }
                return;
            }
        }
    }
}

void Lexer::ConvertNumber(size_t exponentSignPos)
{
    util::StringView sv = SourceView(GetToken().Start().index, Iterator().Index());
    std::string utf8 = std::string {sv.Utf8()};
    bool needConversion = false;

    if (exponentSignPos != std::numeric_limits<size_t>::max()) {
        utf8.insert(exponentSignPos, 1, '+');
        needConversion = true;
    }

    if (GetToken().flags_ & TokenFlags::NUMBER_HAS_UNDERSCORE) {
        utf8.erase(std::remove(utf8.begin(), utf8.end(), LEX_CHAR_UNDERSCORE), utf8.end());
        needConversion = true;
    }

    if (needConversion) {
        util::UString converted(utf8, Allocator());
        GetToken().src_ = converted.View();
    } else {
        GetToken().src_ = sv;
    }

    try {
        GetToken().number_ = static_cast<double>(std::stold(utf8, nullptr));
    } catch (const std::invalid_argument &) {
        ThrowError("Invalid number");
    } catch (const std::out_of_range &) {
        // TODO(frobert): look for a more elegant solution to this
        GetToken().number_ = std::numeric_limits<double>::infinity();
    }
}
void Lexer::ScanNumber(bool allowNumericSeparator, bool allowBigInt)
{
    GetToken().type_ = TokenType::LITERAL_NUMBER;

    ScanDecimalNumbers(allowNumericSeparator);

    size_t exponentSignPos = std::numeric_limits<size_t>::max();
    bool parseExponent = true;

    if (Iterator().Peek() == LEX_CHAR_DOT) {
        allowBigInt = false;
        Iterator().Forward(1);

        auto cp = Iterator().Peek();
        if (IsDecimalDigit(cp) || cp == LEX_CHAR_LOWERCASE_E || LEX_CHAR_UPPERCASE_E) {
            ScanDecimalNumbers(allowNumericSeparator);
        } else {
            parseExponent = false;
        }
    }

    switch (Iterator().Peek()) {
        case LEX_CHAR_LOWERCASE_E:
        case LEX_CHAR_UPPERCASE_E: {
            allowBigInt = false;

            if (!parseExponent) {
                break;
            }

            Iterator().Forward(1);

            switch (Iterator().Peek()) {
                case LEX_CHAR_UNDERSCORE: {
                    break;
                }
                case LEX_CHAR_PLUS:
                case LEX_CHAR_MINUS: {
                    Iterator().Forward(1);
                    break;
                }
                default: {
                    exponentSignPos = Iterator().Index() - GetToken().Start().index;
                    break;
                }
            }

            if (!IsDecimalDigit(Iterator().Peek())) {
                ThrowError("Invalid numeric literal");
            }
            ScanDecimalNumbers(allowNumericSeparator);
            break;
        }
        default: {
            break;
        }
    }

    CheckNumberLiteralEnd();

    if (GetToken().flags_ & TokenFlags::NUMBER_BIGINT) {
        if (!allowBigInt) {
            ThrowError("Invalid BigInt number");
        }
        if (isUnderscore_) {
            ConvertNumber(exponentSignPos);
            isUnderscore_ = false;
        }

        return;
    }

    ConvertNumber(exponentSignPos);
}

void Lexer::PushTemplateContext(TemplateLiteralParserContext *ctx)
{
    tlCtx_ = ctx;
}

void Lexer::ScanTemplateStringEnd()
{
    ASSERT(Iterator().Peek() == LEX_CHAR_BACK_TICK);
    Iterator().Forward(1);
    SetTokenEnd();
    SkipWhiteSpaces();
}

LexerTemplateString Lexer::ScanTemplateString()
{
    LexerTemplateString templateStr(Allocator());
    size_t cpSize = 0;

    while (true) {
        char32_t cp = Iterator().PeekCp(&cpSize);

        switch (cp) {
            case util::StringView::Iterator::INVALID_CP: {
                ThrowError("Unexpected token, expected '${' or '`'");
                break;
            }
            case LEX_CHAR_BACK_TICK: {
                templateStr.end = Iterator().Index();
                return templateStr;
            }
            case LEX_CHAR_CR: {
                Iterator().Forward(1);

                if (Iterator().Peek() != LEX_CHAR_LF) {
                    Iterator().Backward(1);
                }

                [[fallthrough]];
            }
            case LEX_CHAR_LF: {
                pos_.line++;
                templateStr.str.Append(LEX_CHAR_LF);
                Iterator().Forward(1);
                continue;
            }
            case LEX_CHAR_BACKSLASH: {
                Iterator().Forward(1);

                char32_t nextCp = Iterator().Peek();
                if (nextCp == LEX_CHAR_BACK_TICK || nextCp == LEX_CHAR_BACKSLASH || nextCp == LEX_CHAR_DOLLAR_SIGN) {
                    templateStr.str.Append(cp);
                    templateStr.str.Append(nextCp);
                    Iterator().Forward(1);
                    continue;
                }

                Iterator().Backward(1);
                break;
            }
            case LEX_CHAR_DOLLAR_SIGN: {
                templateStr.end = Iterator().Index();
                Iterator().Forward(1);

                if (Iterator().Peek() == LEX_CHAR_LEFT_BRACE) {
                    Iterator().Forward(1);
                    templateStr.scanExpression = true;
                    SkipWhiteSpaces();
                    return templateStr;
                }

                templateStr.str.Append(cp);
                continue;
            }
            default: {
                break;
            }
        }

        templateStr.str.Append(cp);
        Iterator().Forward(cpSize);
    }

    UNREACHABLE();
    return templateStr;
}

void Lexer::ResetTokenEnd()
{
    SetTokenStart();
    pos_.iterator.Reset(GetToken().End().index);
    pos_.line = GetToken().End().line;
    pos_.nextTokenLine = 0;
}

void Lexer::ScanStringUnicodePart(util::UString *str)
{
    size_t cpSize {};
    char32_t cp = Iterator().PeekCp(&cpSize);

    switch (cp) {
        case util::StringView::Iterator::INVALID_CP: {
            ThrowError("Unterminated string");
            break;
        }
        case LEX_CHAR_CR: {
            Iterator().Forward(1);
            if (Iterator().Peek() != LEX_CHAR_LF) {
                Iterator().Backward(1);
            }

            [[fallthrough]];
        }
        case LEX_CHAR_LS:
        case LEX_CHAR_PS:
        case LEX_CHAR_LF: {
            pos_.line++;
            Iterator().Forward(cpSize);
            return;
        }
        case LEX_CHAR_LOWERCASE_B: {
            cp = LEX_CHAR_BS;
            break;
        }
        case LEX_CHAR_LOWERCASE_T: {
            cp = LEX_CHAR_TAB;
            break;
        }
        case LEX_CHAR_LOWERCASE_N: {
            cp = LEX_CHAR_LF;
            break;
        }
        case LEX_CHAR_LOWERCASE_V: {
            cp = LEX_CHAR_VT;
            break;
        }
        case LEX_CHAR_LOWERCASE_F: {
            cp = LEX_CHAR_FF;
            break;
        }
        case LEX_CHAR_LOWERCASE_R: {
            cp = LEX_CHAR_CR;
            break;
        }
        case LEX_CHAR_LOWERCASE_X: {
            Iterator().Forward(1);
            str->Append(ScanHexEscape<2>());
            return;
        }
        case LEX_CHAR_LOWERCASE_U: {
            cp = ScanUnicodeEscapeSequence();
            str->Append(cp);
            return;
        }
        case LEX_CHAR_0: {
            Iterator().Forward(1);
            bool isDecimal = IsDecimalDigit(Iterator().Peek());
            bool isOctal = IsOctalDigit(Iterator().Peek());
            Iterator().Backward(1);

            if (!isDecimal) {
                cp = LEX_CHAR_NULL;
                break;
            }

            if (isOctal) {
                ThrowError("Octal escape sequences are not allowed in strict mode");
            }

            [[fallthrough]];
        }
        default: {
            if (IsDecimalDigit(Iterator().Peek())) {
                ThrowError("Invalid character escape sequence in strict mode");
            }

            break;
        }
    }

    Iterator().Forward(cpSize);
    str->Append(cp);
}

void Lexer::ScanQuestionPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_QUESTION_MARK;

    switch (Iterator().Peek()) {
        case LEX_CHAR_QUESTION: {
            GetToken().type_ = TokenType::PUNCTUATOR_NULLISH_COALESCING;
            Iterator().Forward(1);

            switch (Iterator().Peek()) {
                case LEX_CHAR_EQUALS: {
                    GetToken().type_ = TokenType::PUNCTUATOR_LOGICAL_NULLISH_EQUAL;
                    Iterator().Forward(1);
                    break;
                }
                default: {
                    break;
                }
            }

            break;
        }
        case LEX_CHAR_DOT: {
            Iterator().Forward(1);

            if (!IsDecimalDigit(Iterator().Peek())) {
                GetToken().type_ = TokenType::PUNCTUATOR_QUESTION_DOT;
                return;
            }

            Iterator().Backward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanLessThanPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_LESS_THAN;

    switch (Iterator().Peek()) {
        case LEX_CHAR_LESS_THAN: {
            GetToken().type_ = TokenType::PUNCTUATOR_LEFT_SHIFT;
            Iterator().Forward(1);

            if (Iterator().Peek() == LEX_CHAR_EQUALS) {
                GetToken().type_ = TokenType::PUNCTUATOR_LEFT_SHIFT_EQUAL;
                Iterator().Forward(1);
            }
            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_LESS_THAN_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanGreaterThanPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_GREATER_THAN;

    switch (Iterator().Peek()) {
        case LEX_CHAR_GREATER_THAN: {
            GetToken().type_ = TokenType::PUNCTUATOR_RIGHT_SHIFT;
            Iterator().Forward(1);

            switch (Iterator().Peek()) {
                case LEX_CHAR_GREATER_THAN: {
                    GetToken().type_ = TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT;
                    Iterator().Forward(1);

                    if (Iterator().Peek() == LEX_CHAR_EQUALS) {
                        GetToken().type_ = TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL;
                        Iterator().Forward(1);
                    }
                    break;
                }
                case LEX_CHAR_EQUALS: {
                    GetToken().type_ = TokenType::PUNCTUATOR_RIGHT_SHIFT_EQUAL;
                    Iterator().Forward(1);
                    break;
                }
                default: {
                    break;
                }
            }
            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_GREATER_THAN_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanEqualsPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_SUBSTITUTION;

    switch (Iterator().Peek()) {
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_EQUAL;
            Iterator().Forward(1);

            if (Iterator().Peek() == LEX_CHAR_EQUALS) {
                GetToken().type_ = TokenType::PUNCTUATOR_STRICT_EQUAL;
                Iterator().Forward(1);
            }
            break;
        }
        case LEX_CHAR_GREATER_THAN: {
            GetToken().type_ = TokenType::PUNCTUATOR_ARROW;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanExclamationPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_EXCLAMATION_MARK;

    switch (Iterator().Peek()) {
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_NOT_EQUAL;
            Iterator().Forward(1);

            if (Iterator().Peek() == LEX_CHAR_EQUALS) {
                GetToken().type_ = TokenType::PUNCTUATOR_NOT_STRICT_EQUAL;
                Iterator().Forward(1);
            }
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanAmpersandPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_BITWISE_AND;

    switch (Iterator().Peek()) {
        case LEX_CHAR_AMPERSAND: {
            GetToken().type_ = TokenType::PUNCTUATOR_LOGICAL_AND;
            Iterator().Forward(1);

            switch (Iterator().Peek()) {
                case LEX_CHAR_EQUALS: {
                    GetToken().type_ = TokenType::PUNCTUATOR_LOGICAL_AND_EQUAL;
                    Iterator().Forward(1);
                    break;
                }
                default: {
                    break;
                }
            }

            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_BITWISE_AND_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanVLinePunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_BITWISE_OR;

    switch (Iterator().Peek()) {
        case LEX_CHAR_VLINE: {
            GetToken().type_ = TokenType::PUNCTUATOR_LOGICAL_OR;
            Iterator().Forward(1);

            switch (Iterator().Peek()) {
                case LEX_CHAR_EQUALS: {
                    GetToken().type_ = TokenType::PUNCTUATOR_LOGICAL_OR_EQUAL;
                    Iterator().Forward(1);
                    break;
                }
                default: {
                    break;
                }
            }

            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_BITWISE_OR_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanCircumflexPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_BITWISE_XOR;

    switch (Iterator().Peek()) {
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanPlusPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_PLUS;

    switch (Iterator().Peek()) {
        case LEX_CHAR_PLUS: {
            GetToken().type_ = TokenType::PUNCTUATOR_PLUS_PLUS;
            Iterator().Forward(1);
            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_PLUS_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanMinusPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_MINUS;

    switch (Iterator().Peek()) {
        case LEX_CHAR_MINUS: {
            GetToken().type_ = TokenType::PUNCTUATOR_MINUS_MINUS;
            Iterator().Forward(1);
            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_MINUS_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanSlashPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_DIVIDE;

    switch (Iterator().Peek()) {
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_DIVIDE_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanDotPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_PERIOD;

    switch (Iterator().Peek()) {
        case LEX_CHAR_0:
        case LEX_CHAR_1:
        case LEX_CHAR_2:
        case LEX_CHAR_3:
        case LEX_CHAR_4:
        case LEX_CHAR_5:
        case LEX_CHAR_6:
        case LEX_CHAR_7:
        case LEX_CHAR_8:
        case LEX_CHAR_9: {
            ScanNumber();
            break;
        }
        case LEX_CHAR_QUESTION: {
            GetToken().type_ = TokenType::PUNCTUATOR_PERIOD_QUESTION;
            Iterator().Forward(1);
            break;
        }
        case LEX_CHAR_DOT: {
            Iterator().Forward(1);

            if (Iterator().Peek() == LEX_CHAR_DOT) {
                GetToken().type_ = TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD;
                Iterator().Forward(1);
                break;
            }

            Iterator().Backward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanAsterixPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_MULTIPLY;

    switch (Iterator().Peek()) {
        case LEX_CHAR_ASTERISK: {
            GetToken().type_ = TokenType::PUNCTUATOR_EXPONENTIATION;
            Iterator().Forward(1);

            if (Iterator().Peek() == LEX_CHAR_EQUALS) {
                GetToken().type_ = TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL;
                Iterator().Forward(1);
            }
            break;
        }
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_MULTIPLY_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

void Lexer::ScanPercentPunctuator()
{
    GetToken().type_ = TokenType::PUNCTUATOR_MOD;

    switch (Iterator().Peek()) {
        case LEX_CHAR_EQUALS: {
            GetToken().type_ = TokenType::PUNCTUATOR_MOD_EQUAL;
            Iterator().Forward(1);
            break;
        }
        default: {
            break;
        }
    }
}

bool Lexer::IsLineTerminatorOrEos() const
{
    switch (Iterator().PeekCp()) {
        case util::StringView::Iterator::INVALID_CP:
        case LEX_CHAR_LF:
        case LEX_CHAR_CR:
        case LEX_CHAR_LS:
        case LEX_CHAR_PS: {
            return true;
        }
        default: {
            break;
        }
    }

    return false;
}

void Lexer::ScanRegExpPattern()
{
    bool isCharClass = false;
    size_t cpSize {};

    while (true) {
        switch (Iterator().PeekCp(&cpSize)) {
            case util::StringView::Iterator::INVALID_CP:
            case LEX_CHAR_LF:
            case LEX_CHAR_CR:
            case LEX_CHAR_LS:
            case LEX_CHAR_PS: {
                ThrowError("Unterminated RegExp");
                break;
            }
            case LEX_CHAR_SLASH: {
                if (!isCharClass) {
                    return;
                }

                break;
            }
            case LEX_CHAR_LEFT_SQUARE: {
                isCharClass = true;
                break;
            }
            case LEX_CHAR_RIGHT_SQUARE: {
                isCharClass = false;
                break;
            }
            case LEX_CHAR_BACKSLASH: {
                Iterator().Forward(1);

                if (IsLineTerminatorOrEos()) {
                    continue;
                }

                break;
            }
            default: {
                break;
            }
        }

        Iterator().Forward(cpSize);
    }
}

RegExpFlags Lexer::ScanRegExpFlags()
{
    RegExpFlags resultFlags = RegExpFlags::EMPTY;

    while (true) {
        size_t cpSize {};
        auto cp = Iterator().PeekCp(&cpSize);
        if (!KeywordsUtil::IsIdentifierPart(cp)) {
            break;
        }

        Iterator().Forward(cpSize);

        RegExpFlags flag = RegExpFlags::EMPTY;

        switch (cp) {
            case LEX_CHAR_LOWERCASE_G: {
                flag = RegExpFlags::GLOBAL;
                break;
            }
            case LEX_CHAR_LOWERCASE_I: {
                flag = RegExpFlags::IGNORE_CASE;
                break;
            }
            case LEX_CHAR_LOWERCASE_M: {
                flag = RegExpFlags::MULTILINE;
                break;
            }
            case LEX_CHAR_LOWERCASE_S: {
                flag = RegExpFlags::DOTALL;
                break;
            }
            case LEX_CHAR_LOWERCASE_U: {
                flag = RegExpFlags::UNICODE;
                break;
            }
            case LEX_CHAR_LOWERCASE_Y: {
                flag = RegExpFlags::STICKY;
                break;
            }
            case LEX_CHAR_SP: {
                return resultFlags;
            }
            default: {
                ThrowError("Invalid RegExp flag");
            }
        }

        if (flag == RegExpFlags::EMPTY || (resultFlags & flag) != 0) {
            ThrowError("Invalid RegExp flag");
        }

        resultFlags = resultFlags | flag;
    }

    return resultFlags;
}

RegExp Lexer::ScanRegExp()
{
    GetToken().type_ = TokenType::LITERAL_REGEXP;

    const auto patternStart = Iterator().Index();
    ScanRegExpPattern();
    const auto pattern = SourceView(patternStart, Iterator().Index());

    ASSERT(Iterator().Peek() == LEX_CHAR_SLASH);
    Iterator().Forward(1);

    const auto flagsStart = Iterator().Index();
    RegExpFlags resultFlags = ScanRegExpFlags();
    const auto flags = SourceView(flagsStart, Iterator().Index());

    SkipWhiteSpaces();
    SetTokenEnd();

    return {pattern, flags, resultFlags};
}

bool Lexer::CheckArrow()
{
    if (Iterator().Peek() != LEX_CHAR_EQUALS) {
        return false;
    }
    Iterator().Forward(1);

    bool res = Iterator().Peek() == LEX_CHAR_GREATER_THAN;
    Iterator().Backward(1);

    return res;
}

void Lexer::SetTokenStart()
{
    if (pos_.nextTokenLine != 0) {
        pos_.line += pos_.nextTokenLine;
        pos_.nextTokenLine = 0;
        GetToken().flags_ = TokenFlags::NEW_LINE;
    } else {
        GetToken().flags_ = TokenFlags::NONE;
    }

    pos_.token.loc_.start = SourcePosition {Iterator().Index(), pos_.line};
}

void Lexer::SetTokenEnd()
{
    pos_.token.loc_.end = SourcePosition {Iterator().Index(), pos_.line};
}

void Lexer::CheckAwaitKeyword()
{
    if (!parserContext_->IsAsync()) {
        GetToken().type_ = TokenType::LITERAL_IDENT;
        return;
    }

    if (parserContext_->DisallowAwait()) {
        ThrowError("'await' is not allowed");
    }

    GetToken().type_ = TokenType::KEYW_AWAIT;
}

void Lexer::CheckKeywordEscape(TokenType type)
{
    if (GetToken().flags_ & TokenFlags::HAS_ESCAPE) {
        ThrowError("Escape sequences are not allowed in keywords");
    }

    GetToken().type_ = type;
}

void Lexer::CheckEnumKeyword()
{
    if (parserContext_->GetProgram()->Extension() == ScriptExtension::JS) {
        ThrowError("Unexpected reserved keyword");
    }

    if (GetToken().flags_ & TokenFlags::HAS_ESCAPE) {
        ThrowError("Escape sequences are not allowed in keywords");
    }

    GetToken().type_ = TokenType::LITERAL_IDENT;
}

void Lexer::CheckLetKeyword()
{
    GetToken().type_ = TokenType::KEYW_LET;
}

void Lexer::CheckYieldKeyword()
{
    if (!parserContext_->AllowYield()) {
        ThrowError("'yield' is not allowed");
    }

    GetToken().type_ = TokenType::KEYW_YIELD;
}

void Lexer::CheckFutureReservedKeyword(TokenType keywordType)
{
    GetToken().type_ = TokenType::LITERAL_IDENT;

    if (parserContext_->GetProgram()->Extension() == ScriptExtension::TS && keywordType <= TokenType::KEYW_INTERFACE) {
        return;
    }

    ThrowError("Unexpected strict mode reserved keyword");
}

void Lexer::SkipWhiteSpaces()
{
    while (true) {
        auto cp = Iterator().Peek();

        switch (cp) {
            case LEX_CHAR_HASH_MARK: {
                Iterator().Forward(1);
                cp = Iterator().Peek();
                if (cp == LEX_CHAR_EXCLAMATION) {
                    Iterator().Forward(1);
                    SkipSingleLineComment();
                    continue;
                }

                Iterator().Backward(1);
                return;
            }
            case LEX_CHAR_CR: {
                Iterator().Forward(1);

                if (Iterator().Peek() != LEX_CHAR_LF) {
                    Iterator().Backward(1);
                }

                [[fallthrough]];
            }
            case LEX_CHAR_LF: {
                Iterator().Forward(1);
                pos_.nextTokenLine++;
                continue;
            }
            case LEX_CHAR_VT:
            case LEX_CHAR_FF:
            case LEX_CHAR_SP:
            case LEX_CHAR_TAB: {
                Iterator().Forward(1);
                continue;
            }
            case LEX_CHAR_SLASH: {
                Iterator().Forward(1);
                cp = Iterator().Peek();
                if (cp == LEX_CHAR_SLASH) {
                    Iterator().Forward(1);
                    SkipSingleLineComment();
                    continue;
                }
                if (cp == LEX_CHAR_ASTERISK) {
                    Iterator().Forward(1);
                    SkipMultiLineComment();
                    continue;
                }

                Iterator().Backward(1);
                return;
            }
            default: {
                if (cp < LEX_ASCII_MAX_BITS) {
                    return;
                }

                size_t cpSize {};
                cp = Iterator().PeekCp(&cpSize);

                switch (cp) {
                    case LEX_CHAR_LS:
                    case LEX_CHAR_PS: {
                        pos_.nextTokenLine++;
                        [[fallthrough]];
                    }
                    case LEX_CHAR_NBSP:
                    case LEX_CHAR_NLINE:
                    case LEX_CHAR_IGSP:
                    case LEX_CHAR_ZWNBSP: {
                        Iterator().Forward(cpSize);
                        continue;
                    }
                    default: {
                        return;
                    }
                }
            }
        }
    }
}

// NOLINTNEXTLINE(readability-function-size)
void Lexer::NextToken(LexerNextTokenFlags flags)
{
    Keywords kws(this, flags);
    KeywordsUtil &kwu = kws.Util();

    SetTokenStart();

    auto cp = Iterator().Peek();
    Iterator().Forward(1);

    switch (cp) {
        case LEX_CHAR_EXCLAMATION: {
            ScanExclamationPunctuator();
            break;
        }
        case LEX_CHAR_SINGLE_QUOTE: {
            ScanString<LEX_CHAR_SINGLE_QUOTE>();
            break;
        }
        case LEX_CHAR_DOUBLE_QUOTE: {
            ScanString<LEX_CHAR_DOUBLE_QUOTE>();
            break;
        }
        case LEX_CHAR_HASH_MARK: {
            GetToken().type_ = TokenType::PUNCTUATOR_HASH_MARK;
            break;
        }
        case LEX_CHAR_PERCENT: {
            ScanPercentPunctuator();
            break;
        }
        case LEX_CHAR_AMPERSAND: {
            ScanAmpersandPunctuator();
            break;
        }
        case LEX_CHAR_LEFT_PAREN: {
            GetToken().type_ = TokenType::PUNCTUATOR_LEFT_PARENTHESIS;
            break;
        }
        case LEX_CHAR_RIGHT_PAREN: {
            GetToken().type_ = TokenType::PUNCTUATOR_RIGHT_PARENTHESIS;
            break;
        }
        case LEX_CHAR_ASTERISK: {
            ScanAsterixPunctuator();
            break;
        }
        case LEX_CHAR_PLUS: {
            ScanPlusPunctuator();
            break;
        }
        case LEX_CHAR_COMMA: {
            GetToken().type_ = TokenType::PUNCTUATOR_COMMA;
            break;
        }
        case LEX_CHAR_MINUS: {
            ScanMinusPunctuator();
            break;
        }
        case LEX_CHAR_DOT: {
            ScanDotPunctuator();
            break;
        }
        case LEX_CHAR_SLASH: {
            ScanSlashPunctuator();
            break;
        }
        case LEX_CHAR_0: {
            ScanNumberLeadingZero();
            break;
        }
        case LEX_CHAR_1:
        case LEX_CHAR_2:
        case LEX_CHAR_3:
        case LEX_CHAR_4:
        case LEX_CHAR_5:
        case LEX_CHAR_6:
        case LEX_CHAR_7:
        case LEX_CHAR_8:
        case LEX_CHAR_9: {
            ScanNumber();
            break;
        }
        case LEX_CHAR_COLON: {
            GetToken().type_ = TokenType::PUNCTUATOR_COLON;
            break;
        }
        case LEX_CHAR_SEMICOLON: {
            GetToken().type_ = TokenType::PUNCTUATOR_SEMI_COLON;
            break;
        }
        case LEX_CHAR_LESS_THAN: {
            ScanLessThanPunctuator();
            break;
        }
        case LEX_CHAR_EQUALS: {
            ScanEqualsPunctuator();
            break;
        }
        case LEX_CHAR_GREATER_THAN: {
            ScanGreaterThanPunctuator();
            break;
        }
        case LEX_CHAR_QUESTION: {
            ScanQuestionPunctuator();
            break;
        }
        case LEX_CHAR_AT: {
            GetToken().type_ = TokenType::PUNCTUATOR_AT;
            break;
        }
        case LEX_CHAR_DOLLAR_SIGN:
        case LEX_CHAR_UPPERCASE_A:
        case LEX_CHAR_UPPERCASE_B:
        case LEX_CHAR_UPPERCASE_C:
        case LEX_CHAR_UPPERCASE_D:
        case LEX_CHAR_UPPERCASE_E:
        case LEX_CHAR_UPPERCASE_F:
        case LEX_CHAR_UPPERCASE_G:
        case LEX_CHAR_UPPERCASE_H:
        case LEX_CHAR_UPPERCASE_I:
        case LEX_CHAR_UPPERCASE_J:
        case LEX_CHAR_UPPERCASE_K:
        case LEX_CHAR_UPPERCASE_L:
        case LEX_CHAR_UPPERCASE_M:
        case LEX_CHAR_UPPERCASE_N:
        case LEX_CHAR_UPPERCASE_O:
        case LEX_CHAR_UPPERCASE_P:
        case LEX_CHAR_UPPERCASE_Q:
        case LEX_CHAR_UPPERCASE_R:
        case LEX_CHAR_UPPERCASE_S:
        case LEX_CHAR_UPPERCASE_T:
        case LEX_CHAR_UPPERCASE_U:
        case LEX_CHAR_UPPERCASE_V:
        case LEX_CHAR_UPPERCASE_W:
        case LEX_CHAR_UPPERCASE_X:
        case LEX_CHAR_UPPERCASE_Y:
        case LEX_CHAR_UPPERCASE_Z:
        case LEX_CHAR_UNDERSCORE:
        case LEX_CHAR_LOWERCASE_H:
        case LEX_CHAR_LOWERCASE_J:
        case LEX_CHAR_LOWERCASE_Q:
        case LEX_CHAR_LOWERCASE_X:
        case LEX_CHAR_LOWERCASE_Z: {
            kwu.ScanIdContinue();
            break;
        }
        case LEX_CHAR_LEFT_SQUARE: {
            GetToken().type_ = TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET;
            break;
        }
        case LEX_CHAR_BACKSLASH: {
            GetToken().flags_ |= TokenFlags::HAS_ESCAPE;

            if (Iterator().Peek() != LEX_CHAR_LOWERCASE_U) {
                ThrowError("Invalid character");
            }

            cp = ScanUnicodeEscapeSequence();

            kwu.ScanIdentifierStart(cp);
            break;
        }
        case LEX_CHAR_RIGHT_SQUARE: {
            GetToken().type_ = TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET;
            break;
        }
        case LEX_CHAR_CIRCUMFLEX: {
            ScanCircumflexPunctuator();
            break;
        }
        case LEX_CHAR_BACK_TICK: {
            GetToken().type_ = TokenType::PUNCTUATOR_BACK_TICK;
            SetTokenEnd();
            return;
        }
        case LEX_CHAR_LOWERCASE_A: {
            kws.ScanA();
            break;
        }
        case LEX_CHAR_LOWERCASE_B: {
            kws.ScanB();
            break;
        }
        case LEX_CHAR_LOWERCASE_C: {
            kws.ScanC();
            break;
        }
        case LEX_CHAR_LOWERCASE_D: {
            kws.ScanD();
            break;
        }
        case LEX_CHAR_LOWERCASE_E: {
            kws.ScanE();
            break;
        }
        case LEX_CHAR_LOWERCASE_F: {
            kws.ScanF();
            break;
        }
        case LEX_CHAR_LOWERCASE_G: {
            kws.ScanG();
            break;
        }
        case LEX_CHAR_LOWERCASE_I: {
            kws.ScanI();
            break;
        }
        case LEX_CHAR_LOWERCASE_K: {
            kws.ScanK();
            break;
        }
        case LEX_CHAR_LOWERCASE_L: {
            kws.ScanL();
            break;
        }
        case LEX_CHAR_LOWERCASE_M: {
            kws.ScanM();
            break;
        }
        case LEX_CHAR_LOWERCASE_N: {
            kws.ScanN();
            break;
        }
        case LEX_CHAR_LOWERCASE_O: {
            kws.ScanO();
            break;
        }
        case LEX_CHAR_LOWERCASE_P: {
            kws.ScanP();
            break;
        }
        case LEX_CHAR_LOWERCASE_R: {
            kws.ScanR();
            break;
        }
        case LEX_CHAR_LOWERCASE_S: {
            kws.ScanS();
            break;
        }
        case LEX_CHAR_LOWERCASE_T: {
            kws.ScanT();
            break;
        }
        case LEX_CHAR_LOWERCASE_U: {
            kws.ScanU();
            break;
        }
        case LEX_CHAR_LOWERCASE_V: {
            kws.ScanV();
            break;
        }
        case LEX_CHAR_LOWERCASE_W: {
            kws.ScanW();
            break;
        }
        case LEX_CHAR_LOWERCASE_Y: {
            kws.ScanY();
            break;
        }
        case LEX_CHAR_LEFT_BRACE: {
            GetToken().type_ = TokenType::PUNCTUATOR_LEFT_BRACE;

            if (tlCtx_) {
                tlCtx_->ConsumeLeftBrace();
            }

            break;
        }
        case LEX_CHAR_VLINE: {
            ScanVLinePunctuator();
            break;
        }
        case LEX_CHAR_RIGHT_BRACE: {
            GetToken().type_ = TokenType::PUNCTUATOR_RIGHT_BRACE;

            if (tlCtx_ && tlCtx_->ConsumeRightBrace()) {
                SetTokenEnd();
                return;
            }

            break;
        }
        case LEX_CHAR_TILDE: {
            GetToken().type_ = TokenType::PUNCTUATOR_TILDE;
            break;
        }
        default: {
            Iterator().Backward(1);

            if (cp == util::StringView::Iterator::INVALID_CP) {
                GetToken().type_ = TokenType::EOS;
                break;
            }

            cp = Iterator().Next();
            kwu.ScanIdentifierStart(cp);
            break;
        }
    }

    SetTokenEnd();
    SkipWhiteSpaces();
}

}  // namespace panda::es2panda::lexer
