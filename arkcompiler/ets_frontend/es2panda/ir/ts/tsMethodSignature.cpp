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

#include "tsMethodSignature.h"

#include <typescript/checker.h>
#include <binder/binder.h>
#include <binder/scope.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>
#include <ir/expressions/literals/numberLiteral.h>

namespace panda::es2panda::ir {

void TSMethodSignature::Iterate(const NodeTraverser &cb) const
{
    cb(key_);

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

void TSMethodSignature::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSMethodSignature"},
                 {"computed", computed_},
                 {"optional", optional_},
                 {"key", key_},
                 {"params", params_},
                 {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"typeAnnotation", AstDumper::Optional(returnTypeAnnotation_)}});
}

void TSMethodSignature::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSMethodSignature::Check(checker::Checker *checker) const
{
    if (computed_) {
        checker->CheckComputedPropertyName(key_);
    }

    checker::ScopeContext scopeCtx(checker, scope_);

    auto *signatureInfo = checker->Allocator()->New<checker::SignatureInfo>(checker->Allocator());
    checker->CheckFunctionParameterDeclarations(params_, signatureInfo);

    auto *callSignature = checker->Allocator()->New<checker::Signature>(signatureInfo, checker->GlobalAnyType());
    Variable()->SetTsType(checker->CreateFunctionTypeWithSignature(callSignature));

    if (!returnTypeAnnotation_) {
        checker->ThrowTypeError(
            "Method signature, which lacks return-type annotation, implicitly has an 'any' return type.", Start());
    }

    returnTypeAnnotation_->Check(checker);
    callSignature->SetReturnType(returnTypeAnnotation_->AsTypeNode()->GetType(checker));

    return nullptr;
}

void TSMethodSignature::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto scopeCtx = binder::LexicalScope<binder::Scope>::Enter(binder, scope_);

    key_ = std::get<ir::AstNode *>(cb(key_))->AsExpression();

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
