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

#ifndef ES2PANDA_COMPILER_FUNCTION_ASYNC_GENERATOR_FUNCTION_BUILDER_H
#define ES2PANDA_COMPILER_FUNCTION_ASYNC_GENERATOR_FUNCTION_BUILDER_H

#include <ir/irnode.h>

#include <compiler/function/asyncFunctionBuilder.h>

namespace panda::es2panda::compiler {
class PandaGen;

class AsyncGeneratorFunctionBuilder : public FunctionBuilder {
public:
    explicit AsyncGeneratorFunctionBuilder(PandaGen *pg, CatchTable *catchTable) : FunctionBuilder(pg, catchTable) {}
    ~AsyncGeneratorFunctionBuilder() override = default;
    NO_COPY_SEMANTIC(AsyncGeneratorFunctionBuilder);
    NO_MOVE_SEMANTIC(AsyncGeneratorFunctionBuilder);

    void Prepare(const ir::ScriptFunction *node) override;
    void CleanUp(const ir::ScriptFunction *node) const override;

    void DirectReturn(const ir::AstNode *node) const override;
    void ImplicitReturn(const ir::AstNode *node) const override;
    void ExplicitReturn(const ir::AstNode *node) const override;

    void Yield(const ir::AstNode *node) override;

protected:
    BuilderType BuilderKind() const override
    {
        return BuilderType::ASYNC_GENERATOR;
    }

    IteratorType GeneratorKind() const override;
};
}  // namespace panda::es2panda::compiler

#endif
