/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#include "tsModuleBlock.h"

#include <binder/scope.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSModuleBlock::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : statements_) {
        cb(it);
    }
}

void TSModuleBlock::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSModuleBlock"}, {"body", statements_}});
}

void TSModuleBlock::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSModuleBlock::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSModuleBlock::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
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
