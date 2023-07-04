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

#ifndef ES2PANDA_COMPILER_CORE_SWITCH_BUILDER_H
#define ES2PANDA_COMPILER_CORE_SWITCH_BUILDER_H

#include <ir/irnode.h>
#include <compiler/core/dynamicContext.h>

namespace panda::es2panda::ir {
class SwitchStatement;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {
class PandaGen;
class Label;

class SwitchBuilder {
public:
    SwitchBuilder(PandaGen *pg, const ir::SwitchStatement *stmt);
    NO_COPY_SEMANTIC(SwitchBuilder);
    NO_MOVE_SEMANTIC(SwitchBuilder);
    ~SwitchBuilder();

    void SetCaseTarget(uint32_t index);
    void CompileTagOfSwitch(VReg tag);
    void CompileCaseStatements(uint32_t index);
    void JumpIfCase(VReg tag, uint32_t index);
    void JumpToDefault(uint32_t defaultIndex);
    void Break();

private:
    PandaGen *pg_;
    Label *end_;
    LabelContext labelCtx_;
    const ir::SwitchStatement *stmt_;
    std::vector<Label *> caseLabels_;
};
}  // namespace panda::es2panda::compiler

#endif
