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

#ifndef ES2PANDA_IR_TS_TYPE_ALIAS_DECLARATION_H
#define ES2PANDA_IR_TS_TYPE_ALIAS_DECLARATION_H

#include <ir/statement.h>

namespace panda::es2panda::binder {
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
class TSTypeParameterDeclaration;

class TSTypeAliasDeclaration : public Statement {
public:
    explicit TSTypeAliasDeclaration(Identifier *id, TSTypeParameterDeclaration *typeParams, Expression *typeAnnotation,
                                    bool declare)
        : Statement(AstNodeType::TS_TYPE_ALIAS_DECLARATION),
          id_(id),
          typeParams_(typeParams),
          typeAnnotation_(typeAnnotation),
          declare_(declare)
    {
    }

    const Identifier *Id() const
    {
        return id_;
    }

    const TSTypeParameterDeclaration *TypeParams() const
    {
        return typeParams_;
    }

    const Expression *TypeAnnotation() const
    {
        return typeAnnotation_;
    }

    bool Declare() const
    {
        return declare_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    Identifier *id_;
    TSTypeParameterDeclaration *typeParams_;
    Expression *typeAnnotation_;
    bool declare_;
};
}  // namespace panda::es2panda::ir

#endif
