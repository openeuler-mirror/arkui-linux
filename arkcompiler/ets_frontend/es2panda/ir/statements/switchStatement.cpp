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

#include "switchStatement.h"

#include <binder/binder.h>
#include <binder/scope.h>
#include <compiler/core/labelTarget.h>
#include <compiler/core/switchBuilder.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expression.h>
#include <ir/statements/switchCaseStatement.h>

namespace panda::es2panda::ir {

void SwitchStatement::Iterate(const NodeTraverser &cb) const
{
    cb(discriminant_);

    for (auto *it : cases_) {
        cb(it);
    }
}

void SwitchStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "SwitchStatement"}, {"discriminant", discriminant_}, {"cases", cases_}});
}

void SwitchStatement::Compile(compiler::PandaGen *pg) const
{
    compiler::SwitchBuilder builder(pg, this);
    compiler::VReg tag = pg->AllocReg();

    builder.CompileTagOfSwitch(tag);

    compiler::LocalRegScope lrs(pg, scope_);
    uint32_t defaultIndex = 0;

    for (size_t i = 0; i < cases_.size(); i++) {
        const auto *clause = cases_[i];

        if (!clause->Test()) {
            defaultIndex = i;
            continue;
        }

        builder.JumpIfCase(tag, i);
    }

    if (defaultIndex > 0) {
        builder.JumpToDefault(defaultIndex);
    } else {
        builder.Break();
    }

    for (size_t i = 0; i < cases_.size(); i++) {
        builder.SetCaseTarget(i);
        builder.CompileCaseStatements(i);
    }
}

checker::Type *SwitchStatement::Check(checker::Checker *checker) const
{
    checker::ScopeContext scopeCtx(checker, scope_);

    checker::Type *exprType = discriminant_->Check(checker);
    bool exprIsLiteral = checker::Checker::IsLiteralType(exprType);

    for (auto *it : cases_) {
        if (it->Test()) {
            checker::Type *caseType = it->Test()->Check(checker);
            bool caseIsLiteral = checker::Checker::IsLiteralType(caseType);
            checker::Type *comparedExprType = exprType;

            if (!caseIsLiteral || !exprIsLiteral) {
                caseType = caseIsLiteral ? checker->GetBaseTypeOfLiteralType(caseType) : caseType;
                comparedExprType = checker->GetBaseTypeOfLiteralType(exprType);
            }

            if (!checker->IsTypeEqualityComparableTo(comparedExprType, caseType) &&
                !checker->IsTypeComparableTo(caseType, comparedExprType)) {
                checker->ThrowTypeError({"Type ", caseType, " is not comparable to type ", comparedExprType},
                                        it->Test()->Start());
            }
        }

        for (auto *caseStmt : it->Consequent()) {
            caseStmt->Check(checker);
        }
    }

    return nullptr;
}

void SwitchStatement::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    auto scopeCtx = binder::LexicalScope<binder::LocalScope>::Enter(binder, scope_);

    discriminant_ = std::get<ir::AstNode *>(cb(discriminant_))->AsExpression();

    for (auto iter = cases_.begin(); iter != cases_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsSwitchCaseStatement();
    }
}

}  // namespace panda::es2panda::ir
