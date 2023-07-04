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

#include "tsIndexedAccessType.h"

#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>

namespace panda::es2panda::ir {

void TSIndexedAccessType::Iterate(const NodeTraverser &cb) const
{
    cb(objectType_);
    cb(indexType_);
}

void TSIndexedAccessType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSIndexedAccessType"}, {"objectType", objectType_}, {"indexType", indexType_}});
}

void TSIndexedAccessType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSIndexedAccessType::Check(checker::Checker *checker) const
{
    objectType_->Check(checker);
    indexType_->Check(checker);
    checker::Type *resolved = GetType(checker);

    if (resolved) {
        return nullptr;
    }

    checker::Type *indexType = checker->CheckTypeCached(indexType_);

    if (!indexType->HasTypeFlag(checker::TypeFlag::STRING_LIKE | checker::TypeFlag::NUMBER_LIKE)) {
        checker->ThrowTypeError({"Type ", indexType, " cannot be used as index type"}, indexType_->Start());
    }

    if (indexType->IsNumberType()) {
        checker->ThrowTypeError("Type has no matching singature for type 'number'", Start());
    }

    checker->ThrowTypeError("Type has no matching singature for type 'string'", Start());
    return nullptr;
}

checker::Type *TSIndexedAccessType::GetType(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::Type *baseType = objectType_->AsTypeNode()->GetType(checker);
    checker::Type *indexType = indexType_->AsTypeNode()->GetType(checker);
    checker::Type *resolved = checker->GetPropertyTypeForIndexType(baseType, indexType);

    checker->NodeCache().insert({this, resolved});

    return resolved;
}

void TSIndexedAccessType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    objectType_ = std::get<ir::AstNode *>(cb(objectType_))->AsExpression();
    indexType_ = std::get<ir::AstNode *>(cb(indexType_))->AsExpression();
}

}  // namespace panda::es2panda::ir
