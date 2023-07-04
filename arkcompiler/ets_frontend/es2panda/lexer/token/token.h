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

#ifndef ES2PANDA_PARSER_CORE_TOKEN_H
#define ES2PANDA_PARSER_CORE_TOKEN_H

#include <lexer/token/sourceLocation.h>
#include <lexer/token/tokenType.h>
#include <macros.h>
#include <util/enumbitops.h>
#include <util/ustring.h>

namespace panda::es2panda::lexer {

enum class TokenFlags {
    NONE,
    NEW_LINE = (1 << 0),
    HAS_ESCAPE = (1 << 2),
    NUMBER_BIGINT = (1 << 3),
    NUMBER_HAS_UNDERSCORE = (1 << 4),
};

DEFINE_BITOPS(TokenFlags)

class Token {
public:
    Token() = default;
    DEFAULT_COPY_SEMANTIC(Token);
    DEFAULT_MOVE_SEMANTIC(Token);
    ~Token() = default;

    friend class Lexer;

    TokenType Type() const
    {
        return type_;
    }

    TokenFlags Flags() const
    {
        return flags_;
    }

    void SetTokenType(TokenType type)
    {
        type_ = type;
    }

    TokenType KeywordType() const
    {
        return keywordType_;
    }

    const SourcePosition &Start() const
    {
        return loc_.start;
    }

    const SourcePosition &End() const
    {
        return loc_.end;
    }

    const SourceRange &Loc() const
    {
        return loc_;
    }

    const util::StringView &Ident() const
    {
        return src_;
    }

    const util::StringView &BigInt() const
    {
        ASSERT(type_ == TokenType::LITERAL_NUMBER && (flags_ & TokenFlags::NUMBER_BIGINT));
        return src_;
    }

    double Number() const
    {
        ASSERT(type_ == TokenType::LITERAL_NUMBER && !(flags_ & TokenFlags::NUMBER_BIGINT));
        return number_;
    }

    const util::StringView &String() const
    {
        ASSERT(type_ == TokenType::LITERAL_STRING || type_ == TokenType::LITERAL_NUMBER);
        return src_;
    }

    bool NewLine() const
    {
        return flags_ & TokenFlags::NEW_LINE;
    }

    bool IsAccessability() const;
    bool IsAsyncModifier() const;
    bool IsStaticModifier() const;
    bool IsDeclareModifier() const;
    bool IsReadonlyModifier() const;
    bool IsUpdate() const;
    bool IsUnary() const;
    bool IsPropNameLiteral() const;
    bool IsKeyword() const;
    bool IsReservedTypeName() const;
    bool IsJsStrictReservedWord() const;

    static bool IsBinaryToken(TokenType type);
    static bool IsBinaryLvalueToken(TokenType type);
    static bool IsUpdateToken(TokenType type);
    static bool IsPunctuatorToken(TokenType type);
    static bool IsTsParamToken(TokenType type);

private:
    friend class KeywordsUtil;
    TokenType type_ {TokenType::EOS};
    TokenType keywordType_ {TokenType::EOS};
    TokenFlags flags_ {TokenFlags::NONE};
    SourceRange loc_ {};
    double number_ {};
    util::StringView src_ {};
};

}  // namespace panda::es2panda::lexer

#endif /* TOKEN_H */
