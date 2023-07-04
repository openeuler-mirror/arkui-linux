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

#ifndef ES2PANDA_PARSER_CORE_KEYWORD_STRING_H
#define ES2PANDA_PARSER_CORE_KEYWORD_STRING_H

#include <lexer/token/tokenType.h>
#include <macros.h>
#include <util/ustring.h>

namespace panda::es2panda::lexer {

struct KeywordString {
    constexpr KeywordString(std::string_view s, TokenType t, TokenType k) : str(s), tokenType(t), keywordType(k) {}

    explicit KeywordString(std::string_view &s) : str(s) {}

    std::string_view str;
    TokenType tokenType {};
    TokenType keywordType {};
};

}  // namespace panda::es2panda::lexer

#endif
