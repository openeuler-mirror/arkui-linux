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

#include "exportNamedDeclaration.h"

#include <compiler/core/pandagen.h>
#include <ir/astDump.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/module/exportSpecifier.h>

namespace panda::es2panda::ir {

void ExportNamedDeclaration::Iterate(const NodeTraverser &cb) const
{
    if (decl_) {
        cb(decl_);
    } else {
        if (source_) {
            cb(source_);
        }

        for (auto *it : specifiers_) {
            cb(it);
        }
    }
}

void ExportNamedDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ExportNamedDeclaration"},
                 {"declaration", AstDumper::Nullable(decl_)},
                 {"source", AstDumper::Nullable(source_)},
                 {"specifiers", specifiers_}});
}

void ExportNamedDeclaration::Compile(compiler::PandaGen *pg) const
{
    if (!decl_) {
        return;
    }

    decl_->Compile(pg);
}

checker::Type *ExportNamedDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ExportNamedDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (decl_) {
        decl_ = std::get<ir::AstNode *>(cb(decl_))->AsStatement();
    } else {
        if (source_) {
            source_ = std::get<ir::AstNode *>(cb(source_))->AsStringLiteral();
        }
        
        for (auto iter = specifiers_.begin(); iter != specifiers_.end(); iter++) {
            *iter = std::get<ir::AstNode *>(cb(*iter))->AsExportSpecifier();
        }
    }
}

}  // namespace panda::es2panda::ir
