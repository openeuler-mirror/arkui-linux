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

#ifndef ES2PANDA_IR_STATEMENT_TRY_STATEMENT_H
#define ES2PANDA_IR_STATEMENT_TRY_STATEMENT_H

#include <ir/statement.h>

namespace panda::es2panda::compiler {
class PandaGen;
class TryLabelSet;
class TryContext;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class BlockStatement;
class CatchClause;

class TryStatement : public Statement {
public:
    explicit TryStatement(BlockStatement *block, CatchClause *catchClause, BlockStatement *finalizer)
        : Statement(AstNodeType::TRY_STATEMENT), block_(block), catchClause_(catchClause), finalizer_(finalizer)
    {
    }

    const BlockStatement *FinallyBlock() const
    {
        return finalizer_;
    }

    BlockStatement *Block() const
    {
        return block_;
    }

    CatchClause *GetCatchClause() const
    {
        return catchClause_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    void CompileTryCatch(compiler::PandaGen *pg) const;
    void CompileTryFinally(compiler::PandaGen *pg) const;
    void CompileTryCatchFinally(compiler::PandaGen *pg) const;
    void CompileFinally(compiler::PandaGen *pg, compiler::TryContext *tryCtx,
                        const compiler::TryLabelSet &labelSet) const;

    BlockStatement *block_;
    CatchClause *catchClause_;
    BlockStatement *finalizer_;
};

}  // namespace panda::es2panda::ir

#endif
