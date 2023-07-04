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

#ifndef ES2PANDA_IR_EXPRESSION_ASSIGNMENT_EXPRESSION_H
#define ES2PANDA_IR_EXPRESSION_ASSIGNMENT_EXPRESSION_H

#include <ir/expression.h>
#include <lexer/token/tokenType.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class AssignmentExpression : public Expression {
public:
    explicit AssignmentExpression(Expression *left, Expression *right, lexer::TokenType assignmentOperator)
        : AssignmentExpression(AstNodeType::ASSIGNMENT_EXPRESSION, left, right, assignmentOperator)
    {
    }

    explicit AssignmentExpression(AstNodeType type, Expression *left, Expression *right,
                                  lexer::TokenType assignmentOperator)
        : Expression(type), left_(left), right_(right), operator_(assignmentOperator)
    {
    }

    const Expression *Left() const
    {
        return left_;
    }

    Expression *Left()
    {
        return left_;
    }

    Expression *Right()
    {
        return right_;
    }

    const Expression *Right() const
    {
        return right_;
    }

    lexer::TokenType OperatorType() const
    {
        return operator_;
    }

    bool ConvertibleToAssignmentPattern(bool mustBePattern = true);

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    void CompilePattern(compiler::PandaGen *pg) const;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    Expression *left_;
    Expression *right_;
    lexer::TokenType operator_;
};

}  // namespace panda::es2panda::ir

#endif
