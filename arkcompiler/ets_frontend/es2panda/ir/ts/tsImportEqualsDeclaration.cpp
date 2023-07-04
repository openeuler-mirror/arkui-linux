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

#include "tsImportEqualsDeclaration.h"

#include <ir/astDump.h>
#include <ir/expression.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

void TSImportEqualsDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(id_);
    cb(moduleReference_);
}

void TSImportEqualsDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSImportEqualsDeclaration"},
                 {"id", id_},
                 {"moduleReference", moduleReference_},
                 {"isExport", isExport_}});
}

void TSImportEqualsDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSImportEqualsDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSImportEqualsDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    id_ = std::get<ir::AstNode *>(cb(id_))->AsIdentifier();
    moduleReference_ = std::get<ir::AstNode *>(cb(moduleReference_))->AsExpression();
}

}  // namespace panda::es2panda::ir
