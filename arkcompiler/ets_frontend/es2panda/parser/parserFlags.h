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

#ifndef ES2PANDA_PARSER_PARSER_FLAGS_H
#define ES2PANDA_PARSER_PARSER_FLAGS_H

#include <util/enumbitops.h>

namespace panda::es2panda::parser {

enum class LexicalScopeType {
    BLOCK,
    STRICT_BLOCK,
    CATCH,
    FUNCTION_PARAM,
    TS_TYPE_LITERAL,
};

DEFINE_BITOPS(LexicalScopeType)

enum class VariableParsingFlags {
    NO_OPTS = 0,
    NO_SKIP_VAR_KIND = (1 << 0),
    ACCEPT_CONST_NO_INIT = (1 << 1),
    DISALLOW_INIT = (1 << 2),
    VAR = (1 << 3),
    LET = (1 << 4),
    CONST = (1 << 5),
    STOP_AT_IN = (1 << 6),
    EXPORTED = (1 << 7),
    IN_FOR = (1 << 8),
};

DEFINE_BITOPS(VariableParsingFlags)

enum class ExpressionParseFlags {
    NO_OPTS = 0,
    ACCEPT_COMMA = 1 << 0,
    ACCEPT_REST = 1 << 1,
    EXP_DISALLOW_AS = 1 << 2,
    DISALLOW_ASSIGNMENT = 1 << 3,
    DISALLOW_YIELD = 1 << 4,
    STOP_AT_IN = 1 << 5,
    ALLOW_TS_PARAM_TOKEN = 1 << 6,
    MUST_BE_PATTERN = 1 << 7,
    POTENTIALLY_IN_PATTERN = 1 << 8,
    OBJECT_PATTERN = 1 << 9,
    IN_REST = 1 << 10,
};

DEFINE_BITOPS(ExpressionParseFlags)

enum class StatementParsingFlags {
    NONE = 0,
    ALLOW_LEXICAL = 1 << 0,
    GLOBAL = 1 << 1,
    IF_ELSE = 1 << 2,
    LABELLED = 1 << 3,

    STMT_LEXICAL_SCOPE_NEEDED = IF_ELSE | LABELLED,
    STMT_GLOBAL_LEXICAL = GLOBAL | ALLOW_LEXICAL,
};

DEFINE_BITOPS(StatementParsingFlags)

enum class ForStatementKind {
    UPDATE,
    IN,
    OF,
};

}  // namespace panda::es2panda::parser

#endif
