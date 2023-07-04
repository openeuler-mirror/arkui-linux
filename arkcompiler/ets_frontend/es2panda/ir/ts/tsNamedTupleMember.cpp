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

#include "tsNamedTupleMember.h"

#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSNamedTupleMember::Iterate(const NodeTraverser &cb) const
{
    cb(label_);
    cb(elementType_);
}

void TSNamedTupleMember::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSNamedTupleMember"},
                 {"elementType", elementType_},
                 {"label", label_},
                 {"optional", AstDumper::Optional(optional_)},
                 {"rest", AstDumper::Optional(rest_)}});
}

void TSNamedTupleMember::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSNamedTupleMember::Check(checker::Checker *checker) const
{
    elementType_->Check(checker);
    return nullptr;
}

void TSNamedTupleMember::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    label_ = std::get<ir::AstNode *>(cb(label_))->AsExpression();
    elementType_ = std::get<ir::AstNode *>(cb(elementType_))->AsExpression();
}

}  // namespace panda::es2panda::ir
