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

#include "importDeclaration.h"

#include <ir/astDump.h>
#include <ir/expressions/literals/stringLiteral.h>

namespace panda::es2panda::ir {

void ImportDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(source_);

    for (auto *it : specifiers_) {
        cb(it);
    }
}

void ImportDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ImportDeclaration"}, {"source", source_}, {"specifiers", specifiers_}});
}

void ImportDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *ImportDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ImportDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    source_ = std::get<ir::AstNode *>(cb(source_))->AsStringLiteral();

    for (auto iter = specifiers_.begin(); iter != specifiers_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter));
    }
}

}  // namespace panda::es2panda::ir
