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

#include "tsTypeQuery.h"

#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSTypeQuery::Iterate(const NodeTraverser &cb) const
{
    cb(exprName_);
}

void TSTypeQuery::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTypeQuery"}, {"exprName", exprName_}});
}

void TSTypeQuery::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTypeQuery::Check(checker::Checker *checker) const
{
    GetType(checker);
    return nullptr;
}

checker::Type *TSTypeQuery::GetType(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::Type *type = exprName_->Check(checker);

    checker->NodeCache().insert({this, type});

    return type;
}

void TSTypeQuery::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    exprName_ = std::get<ir::AstNode *>(cb(exprName_))->AsExpression();
}

}  // namespace panda::es2panda::ir
