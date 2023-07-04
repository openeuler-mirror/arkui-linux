/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "tsOptionalType.h"

#include <ir/astDump.h>
#include <typescript/checker.h>

namespace panda::es2panda::ir {

void TSOptionalType::Iterate(const NodeTraverser &cb) const
{
    cb(type_);
}

void TSOptionalType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSOptionalType"}, {"typeAnnotation", type_}});
}

void TSOptionalType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSOptionalType::Check([[maybe_unused]] checker::Checker *checker) const
{
    // TODO(xucheng): Implement checker for ts optional type
    return nullptr;
}

checker::Type *TSOptionalType::GetType(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);
    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::Type *type = type_->AsTypeNode()->GetType(checker);
    checker->NodeCache().insert({this, type});
    return type;
}

void TSOptionalType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    type_ = std::get<ir::AstNode *>(cb(type_))->AsExpression();
}

}  // namespace panda::es2panda::ir
