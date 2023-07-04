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

#ifndef ES2PANDA_IR_BASE_CATCH_CLAUSE_H
#define ES2PANDA_IR_BASE_CATCH_CLAUSE_H

#include <ir/statement.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::binder {
class CatchScope;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::ir {

class BlockStatement;
class Expression;

class CatchClause : public Statement {
public:
    explicit CatchClause(binder::CatchScope *scope, Expression *param, BlockStatement *body)
        : Statement(AstNodeType::CATCH_CLAUSE), scope_(scope), param_(param), body_(body)
    {
    }

    Expression *Param()
    {
        return param_;
    }

    const Expression *Param() const
    {
        return param_;
    }

    BlockStatement *Body()
    {
        return body_;
    }

    const BlockStatement *Body() const
    {
        return body_;
    }

    binder::CatchScope *Scope() const
    {
        return scope_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, binder::Binder *binder) override;

protected:
    binder::CatchScope *scope_;
    Expression *param_;
    BlockStatement *body_;
};

}  // namespace panda::es2panda::ir

#endif
