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

#include "tsInterfaceBody.h"

#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSInterfaceBody::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : body_) {
        cb(it);
    }
}

void TSInterfaceBody::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSInterfaceBody"}, {"body", body_}});
}

void TSInterfaceBody::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSInterfaceBody::Check(checker::Checker *checker) const
{
    for (auto *it : body_) {
        it->Check(checker);
    }

    return nullptr;
}

void TSInterfaceBody::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = body_.begin(); iter != body_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
