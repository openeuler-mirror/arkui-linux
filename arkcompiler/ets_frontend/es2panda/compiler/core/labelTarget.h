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

#ifndef ES2PANDA_COMPILER_CORE_LABEL_TARGET_H
#define ES2PANDA_COMPILER_CORE_LABEL_TARGET_H

#include <ir/irnode.h>
#include <compiler/core/labelPair.h>

#include <unordered_map>

namespace panda::es2panda::ir {
class AstNode;
class Identifier;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class LabelTarget;
class PandaGen;

enum class ControlFlowChange {
    CONTINUE,
    BREAK,
};

class LabelTarget : public LabelPair {
public:
    explicit LabelTarget(PandaGen *pg);
    explicit LabelTarget(const util::StringView &label) : LabelTarget(nullptr, label) {}
    explicit LabelTarget(Label *target, const util::StringView &label)
        : LabelPair(target, nullptr), breakLabel_(label), continueLabel_(label)
    {
    }
    LabelTarget() : LabelPair(nullptr, nullptr) {};

    ~LabelTarget() = default;
    DEFAULT_COPY_SEMANTIC(LabelTarget);
    DEFAULT_MOVE_SEMANTIC(LabelTarget);

    const util::StringView &BreakLabel() const
    {
        return breakLabel_;
    }

    Label *BreakTarget() const
    {
        return begin_;
    }

    void SetBreakTarget(Label *label)
    {
        begin_ = label;
    }

    const util::StringView &ContinueLabel() const
    {
        return continueLabel_;
    }

    Label *ContinueTarget() const
    {
        return end_;
    }

    static constexpr std::string_view BREAK_LABEL = "#b";
    static constexpr std::string_view CONTINUE_LABEL = "#c";
    static constexpr std::string_view RETURN_LABEL = "#r";

private:
    util::StringView breakLabel_ {};
    util::StringView continueLabel_ {};
};

}  // namespace panda::es2panda::compiler

#endif
