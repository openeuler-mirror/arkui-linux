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

#include "blockStatement.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void BlockStatement::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : statements_) {
        cb(it);
    }
}

void BlockStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", IsProgram() ? "Program" : "BlockStatement"}, {"statements", statements_}});
}

void BlockStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::LocalRegScope lrs(pg, scope_);

    for (const auto *it : statements_) {
        it->Compile(pg);
    }
}

checker::Type *BlockStatement::Check(checker::Checker *checker) const
{
    checker::ScopeContext scopeCtx(checker, scope_);

    for (const auto *it : statements_) {
        it->Check(checker);
    }

    return nullptr;
}

void BlockStatement::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto scopeCtx = binder::LexicalScope<binder::Scope>::Enter(binder, scope_);

    for (auto iter = statements_.begin(); iter != statements_.end();) {
        auto newStatements = cb(*iter);
        if (std::holds_alternative<ir::AstNode *>(newStatements)) {
            auto statement = std::get<ir::AstNode *>(newStatements);
            if (statement == *iter) {
                iter++;
            } else if (statement == nullptr) {
                iter = statements_.erase(iter);
            } else {
                *iter = statement->AsStatement();
                iter++;
            }
        } else {
            auto statements = std::get<std::vector<ir::AstNode *>>(newStatements);
            for (auto *it : statements) {
                iter = statements_.insert(iter, it->AsStatement());
                iter++;
            }
            iter = statements_.erase(iter);
        }
    }
}

}  // namespace panda::es2panda::ir
