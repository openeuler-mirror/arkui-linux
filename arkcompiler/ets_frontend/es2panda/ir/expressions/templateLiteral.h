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

#ifndef ES2PANDA_PARSER_INCLUDE_AST_TEMPLATE_LITERAL_H
#define ES2PANDA_PARSER_INCLUDE_AST_TEMPLATE_LITERAL_H

#include <ir/base/templateElement.h>
#include <ir/expression.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class TemplateLiteral : public Expression {
public:
    explicit TemplateLiteral(ArenaVector<TemplateElement *> &&quasis, ArenaVector<Expression *> &&expressions)
        : Expression(AstNodeType::TEMPLATE_LITERAL), quasis_(std::move(quasis)), expressions_(std::move(expressions))
    {
    }

    const ArenaVector<TemplateElement *> &Quasis() const
    {
        return quasis_;
    }

    const ArenaVector<Expression *> &Expressions() const
    {
        return expressions_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

protected:
    ArenaVector<TemplateElement *> quasis_;
    ArenaVector<Expression *> expressions_;
};

}  // namespace panda::es2panda::ir

#endif
