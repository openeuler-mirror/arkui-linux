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

#ifndef ES2PANDA_IR_EXPRESSION_CONDITIONAL_EXPRESSION_H
#define ES2PANDA_IR_EXPRESSION_CONDITIONAL_EXPRESSION_H

#include <ir/expression.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class ConditionalExpression : public Expression {
public:
    explicit ConditionalExpression(Expression *test, Expression *consequent, Expression *alternate)
        : Expression(AstNodeType::CONDITIONAL_EXPRESSION), test_(test), consequent_(consequent), alternate_(alternate)
    {
    }

    const Expression *Test() const
    {
        return test_;
    }

    Expression *Test()
    {
        return test_;
    }

    const Expression *Consequent() const
    {
        return consequent_;
    }

    const Expression *Alternate() const
    {
        return alternate_;
    }

    void SetTest(Expression *test)
    {
        test_ = test;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    Expression *test_;
    Expression *consequent_;
    Expression *alternate_;
};

}  // namespace panda::es2panda::ir

#endif
