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

#ifndef ES2PANDA_PARSER_CORE_PARSER_PRIVATE_CONTEXT_H
#define ES2PANDA_PARSER_CORE_PARSER_PRIVATE_CONTEXT_H

#include <macros.h>
#include <parser/program/program.h>
#include <util/enumbitops.h>
#include <util/ustring.h>

#include <vector>

namespace panda::es2panda::parser {
enum class ParserStatus {
    NO_OPTS = 0,
    STRICT = (1 << 0),

    FUNCTION = (1 << 1),
    ARROW_FUNCTION = (1 << 2),
    GENERATOR_FUNCTION = (1 << 3),
    ASYNC_FUNCTION = (1 << 4),
    CONSTRUCTOR_FUNCTION = (1 << 5),
    FUNCTION_PARAM = (1 << 6),
    IS_SPREAD = (1 << 7),
    ACCESSOR_FUNCTION = (1 << 8),
    FUNCTION_DECLARATION = (1 << 9),

    ALLOW_SUPER = (1 << 10),
    ALLOW_SUPER_CALL = (1 << 11),

    DISALLOW_AWAIT = (1 << 12),
    ALLOW_YIELD = (1 << 13),
    IN_ITERATION = (1 << 14),
    IN_LABELED = (1 << 15),

    EXPORT_REACHED = (1 << 16),
    HAS_COMPLEX_PARAM = (1 << 17),
    IN_SWITCH = (1 << 18),

    MODULE = (1 << 19),
    ALLOW_NEW_TARGET = (1 << 20),

    IN_EXTENDS = (1 << 21),
    ALLOW_THIS_TYPE = (1 << 22),
    IN_METHOD_DEFINITION = (1 << 23),
    IN_AMBIENT_CONTEXT = (1 << 24),
    IN_CLASS_BODY = (1 << 25),
    IN_DECORATOR = (1 << 26),
    DISALLOW_CONTINUE = (1 << 27),

    TS_MODULE = (1 << 28),
};

DEFINE_BITOPS(ParserStatus)

class ParserContext {
public:
    explicit ParserContext(const Program *program) : program_(program) {}
    explicit ParserContext(ParserContext *current, ParserStatus newStatus, util::StringView label = "")
        : program_(current->program_), prev_(current), label_(label)
    {
        ParserStatus currentStatus = current->status_;
        currentStatus &= (ParserStatus::MODULE | ParserStatus::ALLOW_NEW_TARGET | ParserStatus::IN_EXTENDS |
                          ParserStatus::ALLOW_THIS_TYPE | ParserStatus::IN_CLASS_BODY | ParserStatus::FUNCTION);
        status_ = currentStatus | newStatus;
    }

    DEFAULT_COPY_SEMANTIC(ParserContext);
    DEFAULT_MOVE_SEMANTIC(ParserContext);
    ~ParserContext() = default;

    const Program *GetProgram() const
    {
        return program_;
    }

    ParserContext *Prev() const
    {
        return prev_;
    }

    const ParserStatus &Status() const
    {
        return status_;
    }

    ParserStatus &Status()
    {
        return status_;
    }

    bool IsGenerator() const
    {
        return (status_ & ParserStatus::GENERATOR_FUNCTION) != 0;
    }

    bool AllowYield() const
    {
        return (status_ & ParserStatus::ALLOW_YIELD) != 0;
    }

    bool DisallowAwait() const
    {
        return (status_ & ParserStatus::DISALLOW_AWAIT) != 0;
    }

    bool IsAsync() const
    {
        return (status_ & ParserStatus::ASYNC_FUNCTION) != 0;
    }

    bool IsModule() const
    {
        return (status_ & ParserStatus::MODULE) != 0;
    }

    bool IsTsModule() const
    {
        return (status_ & ParserStatus::TS_MODULE) != 0;
    }

    const ParserContext *FindLabel(const util::StringView &label) const;

private:
    const Program *program_;
    ParserContext *prev_ {};
    ParserStatus status_ {};
    util::StringView label_ {};
};
}  // namespace panda::es2panda::parser

#endif
