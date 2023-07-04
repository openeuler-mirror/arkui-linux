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

#include "exportDefaultDeclaration.h"

#include <compiler/core/pandagen.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void ExportDefaultDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(decl_);
}

void ExportDefaultDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add(
        {{"type", IsExportEquals() ? "TSExportAssignment" : "ExportDefaultDeclaration"}, {"declaration", decl_}});
}

void ExportDefaultDeclaration::Compile(compiler::PandaGen *pg) const
{
    decl_->Compile(pg);
    if (decl_->IsExpression()) {
        // export default [AssignmentExpression]
        // e.g. export default 42 (42 be exported as [default])
        ASSERT(pg->Scope()->IsModuleScope());
        auto *var = pg->Scope()->FindLocal(parser::SourceTextModuleRecord::DEFAULT_LOCAL_NAME);
        ASSERT(var->IsModuleVariable());
        pg->StoreModuleVariable(this, var->AsModuleVariable());
    }
}

checker::Type *ExportDefaultDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ExportDefaultDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    decl_ = std::get<ir::AstNode *>(cb(decl_));
}

}  // namespace panda::es2panda::ir
