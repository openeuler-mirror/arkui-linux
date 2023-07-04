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

#ifndef ES2PANDA_PARSER_CORE_CHECKER_CONTEXT_H
#define ES2PANDA_PARSER_CORE_CHECKER_CONTEXT_H

#include <macros.h>
#include <util/enumbitops.h>

#include <vector>

namespace panda::es2panda::checker {
enum class CheckerStatus {
    NO_OPTS = 0,
    FORCE_TUPLE = 1 << 0,
    IN_CONST_CONTEXT = 1 << 1,
    KEEP_LITERAL_TYPE = 1 << 2,
    IN_PARAMETER = 1 << 3,
};

DEFINE_BITOPS(CheckerStatus)

class CheckerContext {
public:
    explicit CheckerContext(CheckerStatus newStatus) : status_(newStatus) {}

    const CheckerStatus &Status() const
    {
        return status_;
    }

    CheckerStatus &Status()
    {
        return status_;
    }

    DEFAULT_COPY_SEMANTIC(CheckerContext);
    DEFAULT_MOVE_SEMANTIC(CheckerContext);
    ~CheckerContext() = default;

private:
    CheckerStatus status_;
};
}  // namespace panda::es2panda::checker

#endif
