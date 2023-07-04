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

#include "tsModuleDeclaration.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void TSModuleDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(name_);

    if (body_) {
        cb(body_);
    }
}

void TSModuleDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSModuleDeclaration"},
                 {"id", name_},
                 {"body", AstDumper::Optional(body_)},
                 {"declare", declare_},
                 {"global", global_}});
}

void TSModuleDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSModuleDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSModuleDeclaration::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    name_ = std::get<ir::AstNode *>(cb(name_))->AsExpression();

    if (body_) {
        auto scopeCtx = binder::LexicalScope<binder::TSModuleScope>::Enter(binder, scope_);
        body_ = std::get<ir::AstNode *>(cb(body_))->AsStatement();
    }
}

}  // namespace panda::es2panda::ir
