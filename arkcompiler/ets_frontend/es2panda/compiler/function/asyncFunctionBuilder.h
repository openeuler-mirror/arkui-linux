/*
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

#ifndef ES2PANDA_COMPILER_FUNCTION_ASYNC_FUNCTION_BUILDER_H
#define ES2PANDA_COMPILER_FUNCTION_ASYNC_FUNCTION_BUILDER_H

#include <ir/irnode.h>
#include <compiler/function/functionBuilder.h>

namespace panda::es2panda::compiler {

class PandaGen;

class AsyncFunctionBuilder : public FunctionBuilder {
public:
    explicit AsyncFunctionBuilder(PandaGen *pg, CatchTable *catchTable) : FunctionBuilder(pg, catchTable) {}
    ~AsyncFunctionBuilder() override = default;
    NO_COPY_SEMANTIC(AsyncFunctionBuilder);
    NO_MOVE_SEMANTIC(AsyncFunctionBuilder);

    void Prepare(const ir::ScriptFunction *node) override;
    void CleanUp(const ir::ScriptFunction *node) const override;

    void DirectReturn(const ir::AstNode *node) const override;
    void ImplicitReturn(const ir::AstNode *node) const override;
    void ExplicitReturn(const ir::AstNode *node) const override;

protected:
    BuilderType BuilderKind() const override
    {
        return BuilderType::ASYNC;
    }
};

}  // namespace panda::es2panda::compiler

#endif
