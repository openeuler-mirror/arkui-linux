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

#include "switchCaseStatement.h"

#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void SwitchCaseStatement::Iterate(const NodeTraverser &cb) const
{
    if (test_) {
        cb(test_);
    }

    for (auto *it : consequent_) {
        cb(it);
    }
}

void SwitchCaseStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "SwitchCase"}, {"test", AstDumper::Nullable(test_)}, {"consequent", consequent_}});
}

void SwitchCaseStatement::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *SwitchCaseStatement::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void SwitchCaseStatement::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (test_) {
        test_ = std::get<ir::AstNode *>(cb(test_))->AsExpression();
    }

    for (auto iter = consequent_.begin(); iter != consequent_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsStatement();
    }
}

}  // namespace panda::es2panda::ir
