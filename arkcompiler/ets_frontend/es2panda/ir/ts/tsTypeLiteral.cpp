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

#include "tsTypeLiteral.h"

#include <ir/astDump.h>
#include <ir/ts/tsPropertySignature.h>
#include <ir/expressions/identifier.h>
#include <binder/variable.h>
#include <binder/declaration.h>
#include <typescript/checker.h>
#include <typescript/types/signature.h>

namespace panda::es2panda::ir {

void TSTypeLiteral::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : members_) {
        cb(it);
    }
}

void TSTypeLiteral::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTypeLiteral"}, {"members", members_}});
}

void TSTypeLiteral::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTypeLiteral::Check(checker::Checker *checker) const
{
    for (auto *it : members_) {
        it->Check(checker);
    }

    checker::Type *type = GetType(checker);
    checker->CheckIndexConstraints(type);

    return nullptr;
}

checker::Type *TSTypeLiteral::GetType(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
    checker::Type *type = checker->Allocator()->New<checker::ObjectLiteralType>(desc);
    type->SetVariable(Variable());

    checker->NodeCache().insert({this, type});

    return type;
}

void TSTypeLiteral::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = members_.begin(); iter != members_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
