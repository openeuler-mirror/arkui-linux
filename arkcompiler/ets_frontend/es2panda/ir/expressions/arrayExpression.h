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

#ifndef ES2PANDA_IR_EXPRESSION_ARRAY_EXPRESSION_H
#define ES2PANDA_IR_EXPRESSION_ARRAY_EXPRESSION_H

#include <ir/expression.h>
#include <ir/validationInfo.h>

namespace panda::es2panda::compiler {
class PandaGen;
class LiteralBuffer;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class ArrayExpression : public Expression {
public:
    explicit ArrayExpression(AstNodeType nodeType, ArenaVector<Expression *> &&elements, bool trailingComma)
        : Expression(nodeType), elements_(std::move(elements)), typeAnnotation_(nullptr), trailingComma_(trailingComma)
    {
    }

    const ArenaVector<Expression *> &Elements() const
    {
        return elements_;
    }

    const Expression *TypeAnnotation() const
    {
        return typeAnnotation_;
    }

    Expression *TypeAnnotation()
    {
        return typeAnnotation_;
    }

    bool IsDeclaration() const
    {
        return isDeclaration_;
    }

    bool Optional() const
    {
        return optional_;
    }

    void SetDeclaration()
    {
        isDeclaration_ = true;
    }

    void SetOptional(bool optional)
    {
        optional_ = optional;
    }

    bool ConvertibleToArrayPattern();
    ValidationInfo ValidateExpression();

    void SetTsTypeAnnotation(Expression *typeAnnotation) override
    {
        typeAnnotation_ = typeAnnotation;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    checker::Type *CheckPattern(checker::Checker *checker) const;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    ArenaVector<Expression *> elements_;
    Expression *typeAnnotation_;
    bool isDeclaration_ {};
    bool trailingComma_;
    bool optional_ {false};
};

}  // namespace panda::es2panda::ir

#endif
