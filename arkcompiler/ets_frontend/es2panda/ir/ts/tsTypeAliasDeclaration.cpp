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

#include "tsTypeAliasDeclaration.h"

#include <binder/scope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expressions/identifier.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>

namespace panda::es2panda::ir {

void TSTypeAliasDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(id_);

    if (typeParams_) {
        cb(typeParams_);
    }

    cb(typeAnnotation_);
}

void TSTypeAliasDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTypeAliasDeclaration"},
                 {"id", id_},
                 {"typeAnnotation", typeAnnotation_},
                 {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"declare", AstDumper::Optional(declare_)}});
}

void TSTypeAliasDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTypeAliasDeclaration::Check(checker::Checker *checker) const
{
    typeAnnotation_->Check(checker);
    return nullptr;
}

void TSTypeAliasDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    id_ = std::get<ir::AstNode *>(cb(id_))->AsIdentifier();

    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterDeclaration();
    }

    typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
}

}  // namespace panda::es2panda::ir
