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

#include "catchClause.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/core/pandagen.h>
#include <compiler/base/lreference.h>
#include <typescript/checker.h>
#include <typescript/types/type.h>
#include <ir/astDump.h>
#include <ir/expression.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/objectExpression.h>
#include <ir/statements/blockStatement.h>

namespace panda::es2panda::ir {

void CatchClause::Iterate(const NodeTraverser &cb) const
{
    if (param_) {
        cb(param_);
    }

    cb(body_);
}

void CatchClause::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "CatchClause"}, {"body", body_}, {"param", AstDumper::Nullable(param_)}});
}

void CatchClause::Compile(compiler::PandaGen *pg) const
{
    compiler::LocalRegScope lrs(pg, scope_->ParamScope());

    if (param_) {
        auto lref = compiler::LReference::CreateLRef(pg, param_, true);
        lref.SetValue();
    }

    ASSERT(scope_ == body_->Scope());
    body_->Compile(pg);
}

checker::Type *CatchClause::Check(checker::Checker *checker) const
{
    const ir::Expression *typeAnnotation = nullptr;

    if (param_->IsIdentifier()) {
        typeAnnotation = param_->AsIdentifier()->TypeAnnotation();
    } else if (param_->IsArrayPattern()) {
        typeAnnotation = param_->AsArrayPattern()->TypeAnnotation();
    } else {
        ASSERT(param_->IsObjectPattern());
        typeAnnotation = param_->AsObjectPattern()->TypeAnnotation();
    }

    if (typeAnnotation) {
        checker::Type *catchParamType = typeAnnotation->Check(checker);

        if (!catchParamType->HasTypeFlag(checker::TypeFlag::ANY_OR_UNKNOWN)) {
            checker->ThrowTypeError("Catch clause variable type annotation must be 'any' or 'unknown' if specified",
                                    Start());
        }
    }

    body_->Check(checker);

    return nullptr;
}

void CatchClause::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    if (param_) {
        auto paramScopeCtx = binder::LexicalScope<binder::CatchParamScope>::Enter(binder, scope_->ParamScope());
        param_ = std::get<ir::AstNode *>(cb(param_))->AsExpression();
    }

    auto scopeCtx = binder::LexicalScope<binder::CatchScope>::Enter(binder, scope_);
    body_ = std::get<ir::AstNode *>(cb(body_))->AsBlockStatement();
}

}  // namespace panda::es2panda::ir
