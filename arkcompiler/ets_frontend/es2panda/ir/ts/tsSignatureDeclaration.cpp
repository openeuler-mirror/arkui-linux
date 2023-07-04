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

#include "tsSignatureDeclaration.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>
#include <typescript/checker.h>

namespace panda::es2panda::ir {

void TSSignatureDeclaration::Iterate(const NodeTraverser &cb) const
{
    if (typeParams_) {
        cb(typeParams_);
    }

    for (auto *it : params_) {
        cb(it);
    }

    if (returnTypeAnnotation_) {
        cb(returnTypeAnnotation_);
    }
}

void TSSignatureDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", (kind_ == TSSignatureDeclaration::TSSignatureDeclarationKind::CALL_SIGNATURE)
                              ? "TSCallSignatureDeclaration"
                              : "TSConstructSignatureDeclaration"},
                 {"params", params_},
                 {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"returnType", AstDumper::Optional(returnTypeAnnotation_)}});
}

void TSSignatureDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSSignatureDeclaration::Check(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::ScopeContext scopeCtx(checker, scope_);

    auto *signatureInfo = checker->Allocator()->New<checker::SignatureInfo>(checker->Allocator());
    checker->CheckFunctionParameterDeclarations(params_, signatureInfo);

    bool isCallSignature = (Kind() == ir::TSSignatureDeclaration::TSSignatureDeclarationKind::CALL_SIGNATURE);

    if (!returnTypeAnnotation_) {
        if (isCallSignature) {
            checker->ThrowTypeError(
                "Call signature, which lacks return-type annotation, implicitly has an 'any' return type.", Start());
        }

        checker->ThrowTypeError(
            "Construct signature, which lacks return-type annotation, implicitly has an 'any' return type.", Start());
    }

    returnTypeAnnotation_->Check(checker);
    checker::Type *returnType = returnTypeAnnotation_->AsTypeNode()->GetType(checker);

    auto *signature = checker->Allocator()->New<checker::Signature>(signatureInfo, returnType);

    checker::Type *placeholderObj = nullptr;

    if (isCallSignature) {
        placeholderObj = checker->CreateObjectTypeWithCallSignature(signature);
    } else {
        placeholderObj = checker->CreateObjectTypeWithConstructSignature(signature);
    }

    checker->NodeCache().insert({this, placeholderObj});

    return placeholderObj;
}

void TSSignatureDeclaration::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto scopeCtx = binder::LexicalScope<binder::Scope>::Enter(binder, scope_);

    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterDeclaration();
    }

    for (auto iter = params_.begin(); iter != params_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }

    if (returnTypeAnnotation_) {
        returnTypeAnnotation_ = std::get<ir::AstNode *>(cb(returnTypeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
