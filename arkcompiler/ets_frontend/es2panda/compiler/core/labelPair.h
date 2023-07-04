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

#ifndef ES2PANDA_COMPILER_CORE_LABEL_PAIR_H
#define ES2PANDA_COMPILER_CORE_LABEL_PAIR_H

#include <macros.h>
#include <ir/irnode.h>

namespace panda::es2panda::compiler {
class LabelPair {
public:
    LabelPair(Label *begin, Label *end) : begin_(begin), end_(end) {}

    Label *Begin() const
    {
        return begin_;
    }

    Label *End() const
    {
        return end_;
    }

protected:
    Label *begin_ {};
    Label *end_ {};
};
}  // namespace panda::es2panda::compiler

#endif
