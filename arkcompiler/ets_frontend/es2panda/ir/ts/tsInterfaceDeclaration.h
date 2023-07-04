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

#ifndef ES2PANDA_IR_TS_INTERFACE_DECLARATION_H
#define ES2PANDA_IR_TS_INTERFACE_DECLARATION_H

#include <ir/statement.h>

namespace panda::es2panda::binder {
class LocalScope;
class Variable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class Identifier;
class TSInterfaceBody;
class TSInterfaceHeritage;
class TSTypeParameterDeclaration;

class TSInterfaceDeclaration : public Statement {
public:
    explicit TSInterfaceDeclaration(binder::LocalScope *scope, Identifier *id, TSTypeParameterDeclaration *typeParams,
                                    TSInterfaceBody *body, ArenaVector<TSInterfaceHeritage *> &&extends)
        : Statement(AstNodeType::TS_INTERFACE_DECLARATION),
          scope_(scope),
          id_(id),
          typeParams_(typeParams),
          body_(body),
          extends_(std::move(extends))
    {
    }

    binder::LocalScope *Scope() const
    {
        return scope_;
    }

    const TSInterfaceBody *Body() const
    {
        return body_;
    }

    const Identifier *Id() const
    {
        return id_;
    }

    const TSTypeParameterDeclaration *TypeParams() const
    {
        return typeParams_;
    }

    const ArenaVector<TSInterfaceHeritage *> &Extends() const
    {
        return extends_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    checker::Type *InferType(checker::Checker *checker, binder::Variable *bindingVar) const;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    binder::LocalScope *scope_;
    Identifier *id_;
    TSTypeParameterDeclaration *typeParams_;
    TSInterfaceBody *body_;
    ArenaVector<TSInterfaceHeritage *> extends_;
};
}  // namespace panda::es2panda::ir

#endif
