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

#include "tsFunctionType.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <typescript/checker.h>
#include <typescript/types/signature.h>
#include <ir/astDump.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>

namespace panda::es2panda::ir {

void TSFunctionType::Iterate(const NodeTraverser &cb) const
{
    if (typeParams_) {
        cb(typeParams_);
    }

    for (auto *it : params_) {
        cb(it);
    }

    cb(returnType_);
}

void TSFunctionType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSFunctionType"},
                 {"params", params_},
                 {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"returnType", returnType_}});
}

void TSFunctionType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSFunctionType::Check(checker::Checker *checker) const
{
    checker::ScopeContext scopeCtx(checker, scope_);

    auto *signatureInfo = checker->Allocator()->New<checker::SignatureInfo>(checker->Allocator());
    checker->CheckFunctionParameterDeclarations(params_, signatureInfo);
    returnType_->Check(checker);
    auto *callSignature =
        checker->Allocator()->New<checker::Signature>(signatureInfo, returnType_->AsTypeNode()->GetType(checker));

    return checker->CreateFunctionTypeWithSignature(callSignature);
}

checker::Type *TSFunctionType::GetType(checker::Checker *checker) const
{
    return checker->CheckTypeCached(this);
}

void TSFunctionType::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto scopeCtx = binder::LexicalScope<binder::Scope>::Enter(binder, scope_);

    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterDeclaration();
    }

    for (auto iter = params_.begin(); iter != params_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }

    returnType_ = std::get<ir::AstNode *>(cb(returnType_))->AsExpression();
}

}  // namespace panda::es2panda::ir
