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

#include "continueStatement.h"

#include <compiler/core/pandagen.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void ContinueStatement::Iterate(const NodeTraverser &cb) const
{
    if (ident_) {
        cb(ident_);
    }
}

void ContinueStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ContinueStatement"}, {"label", AstDumper::Nullable(ident_)}});
}

void ContinueStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::Label *target = pg->ControlFlowChangeContinue(ident_);
    pg->Branch(this, target);
}

checker::Type *ContinueStatement::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ContinueStatement::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (ident_) {
        ident_ = std::get<ir::AstNode *>(cb(ident_))->AsIdentifier();
    }
}

}  // namespace panda::es2panda::ir
