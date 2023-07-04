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

#include "tsTypeParameter.h"

#include <ir/astDump.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

void TSTypeParameter::Iterate(const NodeTraverser &cb) const
{
    cb(name_);

    if (constraint_) {
        cb(constraint_);
    }

    if (defaultType_) {
        cb(defaultType_);
    }
}

void TSTypeParameter::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({
        {"type", "TSTypeParameter"},
        {"name", name_},
        {"constraint", AstDumper::Optional(constraint_)},
        {"default", AstDumper::Optional(defaultType_)},
    });
}

void TSTypeParameter::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTypeParameter::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSTypeParameter::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    name_ = std::get<ir::AstNode *>(cb(name_))->AsIdentifier();

    if (constraint_) {
        constraint_ = std::get<ir::AstNode *>(cb(constraint_))->AsExpression();
    }

    if (defaultType_) {
        defaultType_ = std::get<ir::AstNode *>(cb(defaultType_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
