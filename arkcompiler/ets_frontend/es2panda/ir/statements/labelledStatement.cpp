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

#include "labelledStatement.h"

#include <compiler/core/pandagen.h>
#include <compiler/core/labelTarget.h>
#include <ir/astDump.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

void LabelledStatement::Iterate(const NodeTraverser &cb) const
{
    cb(ident_);
    cb(body_);
}

void LabelledStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "LabelledStatement"}, {"label", ident_}, {"body", body_}});
}

void LabelledStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::LabelContext labelCtx(pg, this);
    body_->Compile(pg);
}

checker::Type *LabelledStatement::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void LabelledStatement::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    ident_ = std::get<ir::AstNode *>(cb(ident_))->AsIdentifier();
    body_ = std::get<ir::AstNode *>(cb(body_))->AsStatement();
}

}  // namespace panda::es2panda::ir
