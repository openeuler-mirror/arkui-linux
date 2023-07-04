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

#include "sequenceExpression.h"

#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void SequenceExpression::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : sequence_) {
        cb(it);
    }
}

void SequenceExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "SequenceExpression"}, {"expressions", sequence_}});
}

void SequenceExpression::Compile(compiler::PandaGen *pg) const
{
    for (const auto *it : sequence_) {
        it->Compile(pg);
    }
}

checker::Type *SequenceExpression::Check(checker::Checker *checker) const
{
    // TODO(aszilagyi)
    return checker->GlobalAnyType();
}

void SequenceExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = sequence_.begin(); iter != sequence_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
