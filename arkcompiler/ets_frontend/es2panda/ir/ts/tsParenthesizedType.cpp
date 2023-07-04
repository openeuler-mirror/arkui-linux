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

#include "tsParenthesizedType.h"

#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSParenthesizedType::Iterate(const NodeTraverser &cb) const
{
    cb(type_);
}

void TSParenthesizedType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSParenthesizedType"}, {"typeAnnotation", type_}});
}

void TSParenthesizedType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSParenthesizedType::Check(checker::Checker *checker) const
{
    type_->Check(checker);
    return nullptr;
}

checker::Type *TSParenthesizedType::GetType(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::Type *type = type_->AsTypeNode()->GetType(checker);
    checker->NodeCache().insert({this, type});
    return type;
}

void TSParenthesizedType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    type_ = std::get<ir::AstNode *>(cb(type_))->AsExpression();
}

}  // namespace panda::es2panda::ir
