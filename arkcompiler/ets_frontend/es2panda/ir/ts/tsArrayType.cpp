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

#include "tsArrayType.h"

#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSArrayType::Iterate(const NodeTraverser &cb) const
{
    cb(elementType_);
}

void TSArrayType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSArrayType"}, {"elementType", elementType_}});
}

void TSArrayType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSArrayType::Check(checker::Checker *checker) const
{
    elementType_->Check(checker);
    return nullptr;
}

checker::Type *TSArrayType::GetType(checker::Checker *checker) const
{
    return checker->Allocator()->New<checker::ArrayType>(elementType_->AsTypeNode()->GetType(checker));
}

void TSArrayType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    elementType_ = std::get<ir::AstNode *>(cb(elementType_))->AsExpression();
}

}  // namespace panda::es2panda::ir
