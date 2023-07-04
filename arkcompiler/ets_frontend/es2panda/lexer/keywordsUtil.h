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

#ifndef ES2PANDA_PARSER_CORE_KEYWORDS_UTIL_H
#define ES2PANDA_PARSER_CORE_KEYWORDS_UTIL_H

#include <lexer/keywordString.h>
#include <lexer/lexer.h>
#include <lexer/token/letters.h>
#include <lexer/token/tokenType.h>
#include <macros.h>
#include <util/ustring.h>
#include <utils/span.h>

namespace panda::es2panda::lexer {

class Lexer;

class KeywordsUtil {
public:
    explicit KeywordsUtil(Lexer *lexer, lexer::LexerNextTokenFlags flags) : lexer_(lexer), flags_(flags) {}
    explicit KeywordsUtil(Lexer *lexer, lexer::LexerNextTokenFlags flags, char32_t cp)
        : lexer_(lexer), flags_(flags), cp_(cp)
    {
    }
    NO_COPY_SEMANTIC(KeywordsUtil);
    DEFAULT_MOVE_SEMANTIC(KeywordsUtil);
    ~KeywordsUtil() = default;

    inline bool HasEscape() const
    {
        return (lexer_->GetToken().flags_ & lexer::TokenFlags::HAS_ESCAPE) != 0;
    }

    template <TokenType keyword_type>
    inline void SetKeyword(std::string_view str, TokenType type);

    inline util::StringView::Iterator &Iterator()
    {
        return lexer_->Iterator();
    }

    void ScanIdentifierStart(char32_t cp);
    void ScanIdContinue();

    void ScanIdContinueMaybeKeyword(Span<const KeywordString> map);
    char32_t ScanUnicodeEscapeSequence();

    static bool IsIdentifierStart(char32_t cp);
    static bool IsIdentifierPart(char32_t cp);

private:
    Lexer *lexer_;
    lexer::LexerNextTokenFlags flags_ {};
    char32_t cp_ {util::StringView::Iterator::INVALID_CP};
};

template <TokenType keyword_type>
inline void KeywordsUtil::SetKeyword(std::string_view str, TokenType type)
{
    lexer_->GetToken().src_ = util::StringView(str);
    // NOLINTNEXTLINE
    lexer_->GetToken().keywordType_ = keyword_type;

    if (flags_ & lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT) {
        lexer_->GetToken().type_ = TokenType::LITERAL_IDENT;
    } else {
        // NOLINTNEXTLINE
        lexer_->CheckKeyword<keyword_type>(type, flags_);
    }
}

}  // namespace panda::es2panda::lexer

#endif
