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

#ifndef ES2PANDA_IR_EXPRESSION_MEMBER_EXPRESSION_H
#define ES2PANDA_IR_EXPRESSION_MEMBER_EXPRESSION_H

#include <binder/variable.h>
#include <ir/expression.h>
#include <ir/irnode.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class MemberExpression : public Expression {
public:
    enum class MemberExpressionKind { ELEMENT_ACCESS, PROPERTY_ACCESS };

    explicit MemberExpression(Expression *object, Expression *property, MemberExpressionKind kind,
                              bool computed, bool optional)
        : Expression(AstNodeType::MEMBER_EXPRESSION),
          object_(object),
          property_(property),
          kind_(kind),
          computed_(computed),
          optional_(optional)
    {
    }

    const Expression *Object() const
    {
        return object_;
    }

    const Expression *Property() const
    {
        return property_;
    }

    bool IsComputed() const
    {
        return computed_;
    }

    bool IsOptional() const
    {
        return optional_;
    }

    MemberExpressionKind Kind() const
    {
        return kind_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    void Compile(compiler::PandaGen *pg, compiler::VReg objReg) const;
    void CompileObject(compiler::PandaGen *pg, compiler::VReg dest) const;
    compiler::Operand CompileKey(compiler::PandaGen *pg) const;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    Expression *object_;
    Expression *property_;
    MemberExpressionKind kind_;
    bool computed_;
    bool optional_;
};

}  // namespace panda::es2panda::ir

#endif
