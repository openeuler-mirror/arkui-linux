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

#include "token.h"

namespace panda::es2panda::lexer {

bool Token::IsAccessability() const
{
    return (type_ == TokenType::LITERAL_IDENT &&
            (keywordType_ == TokenType::KEYW_PUBLIC || keywordType_ == TokenType::KEYW_PROTECTED ||
             keywordType_ == TokenType::KEYW_PRIVATE) &&
            !(flags_ & TokenFlags::HAS_ESCAPE));
}

bool Token::IsAsyncModifier() const
{
    return (type_ == TokenType::LITERAL_IDENT && keywordType_ == TokenType::KEYW_ASYNC &&
            !(flags_ & TokenFlags::HAS_ESCAPE));
}

bool Token::IsStaticModifier() const
{
    return (type_ == TokenType::LITERAL_IDENT && keywordType_ == TokenType::KEYW_STATIC &&
            !(flags_ & TokenFlags::HAS_ESCAPE));
}

bool Token::IsDeclareModifier() const
{
    return (type_ == TokenType::LITERAL_IDENT && keywordType_ == TokenType::KEYW_DECLARE &&
            !(flags_ & TokenFlags::HAS_ESCAPE));
}

bool Token::IsReadonlyModifier() const
{
    return (type_ == TokenType::LITERAL_IDENT && keywordType_ == TokenType::KEYW_READONLY &&
            !(flags_ & TokenFlags::HAS_ESCAPE));
}

bool Token::IsUpdate() const
{
    return (type_ == TokenType::PUNCTUATOR_MINUS_MINUS || type_ == TokenType::PUNCTUATOR_PLUS_PLUS);
}

bool Token::IsUnary() const
{
    return (type_ == TokenType::PUNCTUATOR_MINUS || type_ == TokenType::PUNCTUATOR_PLUS ||
            type_ == TokenType::PUNCTUATOR_TILDE || type_ == TokenType::PUNCTUATOR_EXCLAMATION_MARK ||
            type_ == TokenType::PUNCTUATOR_PLUS_PLUS || type_ == TokenType::PUNCTUATOR_MINUS_MINUS ||
            type_ == TokenType::KEYW_TYPEOF || type_ == TokenType::KEYW_VOID || type_ == TokenType::KEYW_DELETE ||
            type_ == TokenType::KEYW_AWAIT);
}

bool Token::IsPropNameLiteral() const
{
    return (type_ == TokenType::LITERAL_STRING || type_ == TokenType::LITERAL_NUMBER ||
            type_ == TokenType::LITERAL_TRUE || type_ == TokenType::LITERAL_FALSE);
}

bool Token::IsKeyword() const
{
    return (type_ >= TokenType::FIRST_KEYW);
}

bool Token::IsReservedTypeName() const
{
    switch (keywordType_) {
        case TokenType::KEYW_ANY:
        case TokenType::KEYW_UNKNOWN:
        case TokenType::KEYW_NEVER:
        case TokenType::KEYW_NUMBER:
        case TokenType::KEYW_BIGINT:
        case TokenType::KEYW_BOOLEAN:
        case TokenType::KEYW_STRING:
        case TokenType::KEYW_VOID:
        case TokenType::KEYW_OBJECT:
            return true;
        default:
            return false;
    }
}

bool Token::IsJsStrictReservedWord() const
{
    switch (keywordType_) {
        case TokenType::KEYW_ARGUMENTS:
        case TokenType::KEYW_EVAL:
        case TokenType::KEYW_STATIC:
        case TokenType::KEYW_PRIVATE:
        case TokenType::KEYW_PROTECTED:
        case TokenType::KEYW_PUBLIC:
        case TokenType::KEYW_IMPLEMENTS:
        case TokenType::KEYW_INTERFACE:
        case TokenType::KEYW_PACKAGE:
        case TokenType::KEYW_LET:
        case TokenType::KEYW_YIELD:
            return true;
        default:
            return false;
    }
}

bool Token::IsBinaryToken(TokenType type)
{
    return (type >= TokenType::PUNCTUATOR_NULLISH_COALESCING && type <= TokenType::PUNCTUATOR_EXPONENTIATION);
}

bool Token::IsBinaryLvalueToken(TokenType type)
{
    return (type >= TokenType::PUNCTUATOR_SUBSTITUTION && type <= TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL);
}

bool Token::IsUpdateToken(TokenType type)
{
    return (type == TokenType::PUNCTUATOR_MINUS_MINUS || type == TokenType::PUNCTUATOR_PLUS_PLUS);
}

bool Token::IsPunctuatorToken(TokenType type)
{
    return (type >= TokenType::PUNCTUATOR_NULLISH_COALESCING && type <= TokenType::PUNCTUATOR_ARROW);
}

bool Token::IsTsParamToken(TokenType type)
{
    return (type == TokenType::PUNCTUATOR_COLON || type == TokenType::PUNCTUATOR_QUESTION_MARK);
}

const char *TokenToString(TokenType type)
{
    switch (type) {
        case TokenType::PUNCTUATOR_BITWISE_AND:
            return "&";
        case TokenType::PUNCTUATOR_BITWISE_OR:
            return "|";
        case TokenType::PUNCTUATOR_MULTIPLY:
            return "*";
        case TokenType::PUNCTUATOR_DIVIDE:
            return "/";
        case TokenType::PUNCTUATOR_MINUS:
            return "-";
        case TokenType::PUNCTUATOR_EXCLAMATION_MARK:
            return "!";
        case TokenType::PUNCTUATOR_TILDE:
            return "~";
        case TokenType::PUNCTUATOR_MINUS_MINUS:
            return "--";
        case TokenType::PUNCTUATOR_LEFT_SHIFT:
            return "<<";
        case TokenType::PUNCTUATOR_RIGHT_SHIFT:
            return ">>";
        case TokenType::PUNCTUATOR_LESS_THAN_EQUAL:
            return "<=";
        case TokenType::PUNCTUATOR_GREATER_THAN_EQUAL:
            return ">=";
        case TokenType::PUNCTUATOR_MOD:
            return "%";
        case TokenType::PUNCTUATOR_BITWISE_XOR:
            return "^";
        case TokenType::PUNCTUATOR_EXPONENTIATION:
            return "**";
        case TokenType::PUNCTUATOR_MULTIPLY_EQUAL:
            return "*=";
        case TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL:
            return "**=";
        case TokenType::PUNCTUATOR_DIVIDE_EQUAL:
            return "/=";
        case TokenType::PUNCTUATOR_MOD_EQUAL:
            return "%=";
        case TokenType::PUNCTUATOR_MINUS_EQUAL:
            return "-=";
        case TokenType::PUNCTUATOR_LEFT_SHIFT_EQUAL:
            return "<<=";
        case TokenType::PUNCTUATOR_RIGHT_SHIFT_EQUAL:
            return ">>=";
        case TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT:
            return ">>>";
        case TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL:
            return ">>>=";
        case TokenType::PUNCTUATOR_BITWISE_AND_EQUAL:
            return "&=";
        case TokenType::PUNCTUATOR_BITWISE_OR_EQUAL:
            return "|=";
        case TokenType::PUNCTUATOR_LOGICAL_AND_EQUAL:
            return "&&=";
        case TokenType::PUNCTUATOR_NULLISH_COALESCING:
            return "??";
        case TokenType::PUNCTUATOR_LOGICAL_OR_EQUAL:
            return "||=";
        case TokenType::PUNCTUATOR_LOGICAL_NULLISH_EQUAL:
            return "\?\?=";
        case TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL:
            return "^=";
        case TokenType::PUNCTUATOR_PLUS:
            return "+";
        case TokenType::PUNCTUATOR_PLUS_PLUS:
            return "++";
        case TokenType::PUNCTUATOR_PLUS_EQUAL:
            return "+=";
        case TokenType::PUNCTUATOR_LESS_THAN:
            return "<";
        case TokenType::PUNCTUATOR_GREATER_THAN:
            return ">";
        case TokenType::PUNCTUATOR_EQUAL:
            return "==";
        case TokenType::PUNCTUATOR_NOT_EQUAL:
            return "!=";
        case TokenType::PUNCTUATOR_STRICT_EQUAL:
            return "===";
        case TokenType::PUNCTUATOR_NOT_STRICT_EQUAL:
            return "!==";
        case TokenType::KEYW_INSTANCEOF:
            return "instanceof";
        case TokenType::KEYW_IN:
            return "in";
        case TokenType::PUNCTUATOR_LOGICAL_AND:
            return "&&";
        case TokenType::PUNCTUATOR_LOGICAL_OR:
            return "||";
        case TokenType::PUNCTUATOR_SUBSTITUTION:
            return "=";
        case TokenType::PUNCTUATOR_QUESTION_MARK:
            return "?";
        case TokenType::PUNCTUATOR_AT:
            return "@";
        case TokenType::KEYW_ANY:
            return "any";
        case TokenType::KEYW_UNKNOWN:
            return "unknown";
        case TokenType::KEYW_NEVER:
            return "never";
        case TokenType::KEYW_NUMBER:
            return "number";
        case TokenType::KEYW_BIGINT:
            return "bigint";
        case TokenType::KEYW_BOOLEAN:
            return "boolean";
        case TokenType::KEYW_STRING:
            return "string";
        case TokenType::KEYW_VOID:
            return "void";
        case TokenType::KEYW_OBJECT:
            return "object";
        case TokenType::KEYW_TYPEOF:
            return "typeof";
        case TokenType::KEYW_DELETE:
            return "delete";
        default:
            UNREACHABLE();
    }
}

}  // namespace panda::es2panda::lexer
