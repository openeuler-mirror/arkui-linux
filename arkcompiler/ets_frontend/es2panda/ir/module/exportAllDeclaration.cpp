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

#include "exportAllDeclaration.h"

#include <ir/astDump.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/stringLiteral.h>

namespace panda::es2panda::ir {

void ExportAllDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(source_);

    if (exported_) {
        cb(exported_);
    }
}

void ExportAllDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ExportAllDeclaration"}, {"source", source_}, {"exported", AstDumper::Nullable(exported_)}});
}

void ExportAllDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *ExportAllDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ExportAllDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    source_ = std::get<ir::AstNode *>(cb(source_))->AsStringLiteral();

    if (exported_) {
        exported_ = std::get<ir::AstNode *>(cb(exported_))->AsIdentifier();
    }
}

}  // namespace panda::es2panda::ir
