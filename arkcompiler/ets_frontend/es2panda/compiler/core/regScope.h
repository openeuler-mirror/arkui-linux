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

#ifndef ES2PANDA_COMPILER_CORE_REG_SCOPE_H
#define ES2PANDA_COMPILER_CORE_REG_SCOPE_H

#include <macros.h>
#include <binder/scope.h>

namespace panda::es2panda::ir {
class AstNode;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class EnvScope;
class PandaGen;

class RegScope {
public:
    explicit RegScope(PandaGen *pg);
    NO_COPY_SEMANTIC(RegScope);
    NO_MOVE_SEMANTIC(RegScope);
    ~RegScope();

    void *operator new(size_t) = delete;
    void *operator new[](size_t) = delete;

protected:
    void DebuggerCloseScope();

    PandaGen *pg_;
    uint32_t regBase_;
};

class LocalRegScope : public RegScope {
public:
    explicit LocalRegScope(PandaGen *pg, binder::Scope *scope);
    explicit LocalRegScope(PandaGen *pg);
    NO_COPY_SEMANTIC(LocalRegScope);
    NO_MOVE_SEMANTIC(LocalRegScope);
    ~LocalRegScope();

    void *operator new(size_t) = delete;
    void *operator new[](size_t) = delete;

private:
    binder::Scope *prevScope_ {};
};

class LoopRegScope : public RegScope {
public:
    explicit LoopRegScope(PandaGen *pg, binder::LoopScope *scope);
    NO_COPY_SEMANTIC(LoopRegScope);
    NO_MOVE_SEMANTIC(LoopRegScope);
    ~LoopRegScope();

    void *operator new(size_t) = delete;
    void *operator new[](size_t) = delete;

private:
    binder::Scope *prevScope_ {};
};

class FunctionRegScope : public RegScope {
public:
    explicit FunctionRegScope(PandaGen *pg);
    NO_COPY_SEMANTIC(FunctionRegScope);
    NO_MOVE_SEMANTIC(FunctionRegScope);
    ~FunctionRegScope();

    void *operator new(size_t) = delete;
    void *operator new[](size_t) = delete;

private:
    EnvScope *envScope_;
};

}  // namespace panda::es2panda::compiler

#endif
