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

#include "classDeclaration.h"

#include <compiler/base/lreference.h>
#include <compiler/core/pandagen.h>
#include <ir/astDump.h>
#include <ir/base/classDefinition.h>
#include <ir/base/decorator.h>
#include <ir/expressions/identifier.h>
#include <ir/module/exportDefaultDeclaration.h>

namespace panda::es2panda::ir {

void ClassDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(def_);

    for (auto *it : decorators_) {
        cb(it);
    }
}

void ClassDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ClassDeclaration"}, {"definition", def_}, {"decorators", decorators_}});
}

void ClassDeclaration::Compile(compiler::PandaGen *pg) const
{
    // [ClassDeclaration] without [Identifier] must have parent node
    // of [ExportDefaultDeclaration] during compiling phase. So we use
    // the parent node to create a lreference with boundName of [*default*].
    const auto *node = def_->Ident() ? def_->Ident() : this->Parent();
    auto lref = compiler::LReference::CreateLRef(pg, node, true);
    def_->Compile(pg);
    lref.SetValue();
}

checker::Type *ClassDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ClassDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    def_ = std::get<ir::AstNode *>(cb(def_))->AsClassDefinition();

    for (auto iter = decorators_.begin(); iter != decorators_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsDecorator();
    }
}

}  // namespace panda::es2panda::ir
