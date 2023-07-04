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

#ifndef ES2PANDA_COMPILER_FUNCTION_FUNCTION_BUILDER_H
#define ES2PANDA_COMPILER_FUNCTION_FUNCTION_BUILDER_H

#include <macros.h>
#include <ir/irnode.h>

namespace panda::es2panda::ir {
class ScriptFunction;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class PandaGen;
class CatchTable;
enum class IteratorType;

enum class ResumeMode {
    RETURN,
    THROW,
    NEXT,
};

class FunctionBuilder {
public:
    enum class BuilderType {
        NORMAL,
        GENERATOR,
        ASYNC,
        ASYNC_GENERATOR,
    };

    explicit FunctionBuilder(PandaGen *pg, CatchTable *catchTable);
    virtual ~FunctionBuilder() = default;
    NO_COPY_SEMANTIC(FunctionBuilder);
    NO_MOVE_SEMANTIC(FunctionBuilder);

    virtual void Prepare([[maybe_unused]] const ir::ScriptFunction *node) {};
    virtual void CleanUp([[maybe_unused]] const ir::ScriptFunction *node) const {};

    virtual void DirectReturn(const ir::AstNode *node) const;
    virtual void ImplicitReturn(const ir::AstNode *node) const;
    virtual void ExplicitReturn(const ir::AstNode *node) const;

    virtual void Await(const ir::AstNode *node);
    virtual void YieldStar(const ir::AstNode *node);

    virtual void Yield([[maybe_unused]] const ir::AstNode *node)
    {
        UNREACHABLE();
    };

protected:
    virtual BuilderType BuilderKind() const
    {
        return BuilderType::NORMAL;
    }

    virtual IteratorType GeneratorKind() const;

    void SuspendResumeExecution(const ir::AstNode *node, VReg completionType, VReg completionValue) const;
    void AsyncYield(const ir::AstNode *node, VReg value, VReg completionType, VReg completionValue) const;

    VReg FunctionReg(const ir::ScriptFunction *node) const;
    void HandleCompletion(const ir::AstNode *node, VReg completionType, VReg completionValue);

    PandaGen *pg_;
    CatchTable *catchTable_;
    VReg funcObj_ {};
    bool handleReturn_ {};

private:
    void resumeGenerator(const ir::AstNode *node, VReg completionType, VReg completionValue) const;
};

}  // namespace panda::es2panda::compiler

#endif
