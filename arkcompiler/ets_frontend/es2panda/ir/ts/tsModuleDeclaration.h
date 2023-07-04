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

#ifndef ES2PANDA_IR_TS_MODULE_DECLARATION_H
#define ES2PANDA_IR_TS_MODULE_DECLARATION_H

#include <binder/scope.h>
#include <ir/statement.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class Expression;

class TSModuleDeclaration : public Statement {
public:
    explicit TSModuleDeclaration(binder::TSModuleScope *scope, Expression *name, Statement *body, bool declare,
                                 bool global, bool isInstantiated = true)
        : Statement(AstNodeType::TS_MODULE_DECLARATION),
          scope_(scope),
          name_(name),
          body_(body),
          declare_(declare),
          global_(global),
          isInstantiated_(isInstantiated)
    {
    }

    binder::TSModuleScope *Scope() const
    {
        return scope_;
    }

    const Expression *Name() const
    {
        return name_;
    }

    const Statement *Body() const
    {
        return body_;
    }

    Statement *Body()
    {
        return body_;
    }

    bool Declare() const
    {
        return declare_;
    }

    bool Global() const
    {
        return global_;
    }

    bool IsInstantiated() const
    {
        return isInstantiated_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, binder::Binder *binder) override;

private:
    binder::TSModuleScope *scope_;
    Expression *name_;
    Statement *body_;
    bool declare_;
    bool global_;
    bool isInstantiated_;
};
}  // namespace panda::es2panda::ir

#endif
