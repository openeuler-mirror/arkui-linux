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

#ifndef ES2PANDA_COMPILER_CORE_ENV_SCOPE_H
#define ES2PANDA_COMPILER_CORE_ENV_SCOPE_H

#include <binder/scope.h>
#include <ir/irnode.h>
#include <compiler/core/dynamicContext.h>
#include <compiler/core/regScope.h>
#include <compiler/core/labelTarget.h>

namespace panda::es2panda::ir {
class AstNode;
class Statement;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class PandaGen;

class ScopeContext {
public:
    explicit ScopeContext(PandaGen *pg, binder::Scope *newScope);
    ~ScopeContext();

    NO_COPY_SEMANTIC(ScopeContext);
    NO_MOVE_SEMANTIC(ScopeContext);

private:
    PandaGen *pg_;
    binder::Scope *prevScope_;
};

class EnvScope {
public:
    explicit EnvScope() = default;

    NO_COPY_SEMANTIC(EnvScope);
    NO_MOVE_SEMANTIC(EnvScope);
    ~EnvScope();

    void Initialize(PandaGen *pg);

    EnvScope *Prev() const
    {
        return prev_;
    }

protected:
    friend class PandaGen;

    PandaGen *pg_ {};
    EnvScope *prev_ {};
};

class LoopEnvScope : public EnvScope {
public:
    explicit LoopEnvScope(PandaGen *pg, binder::LoopScope *scope, LabelTarget target)
        : scope_(NeedEnv(scope) ? scope : nullptr), regScope_(pg, scope), lexEnvCtx_(this, pg, target)
    {
        InitLoopContext(pg, scope);
    }

    explicit LoopEnvScope(PandaGen *pg, LabelTarget target, binder::LoopScope *scope)
        : scope_(NeedEnv(scope) ? scope : nullptr), regScope_(pg), lexEnvCtx_(this, pg, target)
    {
        InitLoopContext(pg, scope);
    }

    binder::VariableScope *Scope() const
    {
        ASSERT(HasEnv());
        return scope_;
    }

    bool HasEnv() const
    {
        return scope_ != nullptr;
    }

    void CopyPerIterationCtx();

private:
    static bool NeedEnv(binder::VariableScope *scope)
    {
        return scope->IsVariableScope() && scope->AsVariableScope()->NeedLexEnv();
    }

    void InitLoopContext(PandaGen *pg, binder::VariableScope *scope);

    binder::VariableScope *scope_ {};
    LocalRegScope regScope_;
    LexEnvContext lexEnvCtx_;
};

}  // namespace panda::es2panda::compiler

#endif
