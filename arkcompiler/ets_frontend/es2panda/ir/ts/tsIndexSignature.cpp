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

#include "tsIndexSignature.h"

#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

TSIndexSignature::TSIndexSignatureKind TSIndexSignature::Kind() const
{
    return param_->AsIdentifier()->TypeAnnotation()->IsTSNumberKeyword() ? TSIndexSignatureKind::NUMBER
                                                                         : TSIndexSignatureKind::STRING;
}

void TSIndexSignature::Iterate(const NodeTraverser &cb) const
{
    cb(param_);
    cb(typeAnnotation_);
}

void TSIndexSignature::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSIndexSignature"},
                 {"parameters", param_},
                 {"typeAnnotation", typeAnnotation_},
                 {"readonly", readonly_}});
}

void TSIndexSignature::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSIndexSignature::Check(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    const util::StringView &paramName = param_->AsIdentifier()->Name();
    typeAnnotation_->Check(checker);
    checker::Type *indexType = typeAnnotation_->AsTypeNode()->GetType(checker);
    checker::IndexInfo *info =
        checker->Allocator()->New<checker::IndexInfo>(indexType, paramName, readonly_, this->Start());
    checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
    checker::ObjectType *placeholder = checker->Allocator()->New<checker::ObjectLiteralType>(desc);

    if (Kind() == ir::TSIndexSignature::TSIndexSignatureKind::NUMBER) {
        placeholder->Desc()->numberIndexInfo = info;
    } else {
        placeholder->Desc()->stringIndexInfo = info;
    }

    checker->NodeCache().insert({this, placeholder});

    return placeholder;
}

void TSIndexSignature::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    param_ = std::get<ir::AstNode *>(cb(param_))->AsExpression();
    typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
}

}  // namespace panda::es2panda::ir
