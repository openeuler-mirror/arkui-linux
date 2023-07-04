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

#ifndef ES2PANDA_IR_EXPRESSION_CALL_EXPRESSION_H
#define ES2PANDA_IR_EXPRESSION_CALL_EXPRESSION_H

#include <binder/variable.h>
#include <ir/expression.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class TSTypeParameterInstantiation;

class CallExpression : public Expression {
public:
    explicit CallExpression(Expression *callee, ArenaVector<Expression *> &&arguments,
                            TSTypeParameterInstantiation *typeParams, bool optional)
        : Expression(AstNodeType::CALL_EXPRESSION),
          callee_(callee),
          arguments_(std::move(arguments)),
          typeParams_(typeParams),
          optional_(optional)
    {
    }

    const Expression *Callee() const
    {
        return callee_;
    }

    const TSTypeParameterInstantiation *TypeParams() const
    {
        return typeParams_;
    }

    const ArenaVector<Expression *> &Arguments() const
    {
        return arguments_;
    }

    ArenaVector<Expression *> &Arguments()
    {
        return arguments_;
    }

    void SetTypeParams(TSTypeParameterInstantiation *typeParams)
    {
        typeParams_ = typeParams;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    compiler::VReg CreateSpreadArguments(compiler::PandaGen *pg) const;

    Expression *callee_;
    ArenaVector<Expression *> arguments_;
    TSTypeParameterInstantiation *typeParams_;
    bool optional_;
};

}  // namespace panda::es2panda::ir

#endif
