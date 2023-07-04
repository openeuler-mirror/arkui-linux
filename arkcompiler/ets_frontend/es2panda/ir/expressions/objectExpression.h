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

#ifndef ES2PANDA_IR_EXPRESSION_OBJECT_EXPRESSION_H
#define ES2PANDA_IR_EXPRESSION_OBJECT_EXPRESSION_H

#include <binder/variable.h>
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

namespace panda::es2panda::util {
class BitSet;
}  // namespace panda::es2panda::util

namespace panda::es2panda::ir {

class ObjectExpression : public Expression {
public:
    explicit ObjectExpression(AstNodeType nodeType, ArenaVector<Expression *> &&properties, bool trailingComma)
        : Expression(nodeType),
          properties_(std::move(properties)),
          typeAnnotation_(nullptr),
          trailingComma_(trailingComma)
    {
    }

    const ArenaVector<Expression *> &Properties() const
    {
        return properties_;
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

    ValidationInfo ValidateExpression();
    bool ConvertibleToObjectPattern();

    void SetDeclaration();
    void SetTsTypeAnnotation(Expression *typeAnnotation) override;
    void SetOptional(bool optional);
    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    checker::Type *CheckPattern(checker::Checker *checker) const;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    void FillInLiteralBuffer(compiler::LiteralBuffer *buf,
                             std::vector<std::vector<const Literal *>> &tempLiteralBuffer) const;
    void EmitCreateObjectWithBuffer(compiler::PandaGen *pg, compiler::LiteralBuffer *buf, bool hasMethod) const;
    void CompileStaticProperties(compiler::PandaGen *pg, util::BitSet *compiled) const;
    void CompileRemainingProperties(compiler::PandaGen *pg, const util::BitSet *compiled, compiler::VReg objReg) const;

    ArenaVector<Expression *> properties_;
    Expression *typeAnnotation_;
    bool isDeclaration_ {};
    bool trailingComma_ {};
    bool optional_ {false};
};

}  // namespace panda::es2panda::ir

#endif
