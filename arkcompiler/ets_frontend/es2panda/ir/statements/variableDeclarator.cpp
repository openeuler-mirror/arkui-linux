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

#include "variableDeclarator.h"

#include <compiler/base/lreference.h>
#include <compiler/core/pandagen.h>
#include <ir/astDump.h>
#include <ir/expression.h>
#include <ir/typeNode.h>
#include <ir/statements/variableDeclaration.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/objectExpression.h>
#include <typescript/checker.h>
#include <typescript/core/destructuringContext.h>

namespace panda::es2panda::ir {

void VariableDeclarator::Iterate(const NodeTraverser &cb) const
{
    cb(id_);

    if (init_) {
        cb(init_);
    }
}

void VariableDeclarator::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "VariableDeclarator"}, {"id", id_}, {"init", AstDumper::Nullable(init_)}});
}

void VariableDeclarator::Compile(compiler::PandaGen *pg) const
{
    compiler::LReference lref = compiler::LReference::CreateLRef(pg, id_, true);
    const ir::VariableDeclaration *decl = parent_->AsVariableDeclaration();

    if (init_) {
        init_->Compile(pg);
    } else {
        if (decl->Kind() == ir::VariableDeclaration::VariableDeclarationKind::VAR) {
            return;
        }
        if (decl->Kind() == ir::VariableDeclaration::VariableDeclarationKind::LET && !decl->Parent()->IsCatchClause()) {
            pg->LoadConst(this, compiler::Constant::JS_UNDEFINED);
        }
    }

    lref.SetValue();
}

static void CheckSimpleVariableDeclaration(checker::Checker *checker, const ir::VariableDeclarator *declarator)
{
    binder::Variable *bindingVar = declarator->Id()->AsIdentifier()->Variable();
    checker::Type *previousType = bindingVar->TsType();
    const ir::Expression *typeAnnotation = declarator->Id()->AsIdentifier()->TypeAnnotation();
    const ir::Expression *initializer = declarator->Init();
    bool isConst = declarator->Parent()->AsVariableDeclaration()->Kind() ==
                   ir::VariableDeclaration::VariableDeclarationKind::CONST;

    if (isConst) {
        checker->AddStatus(checker::CheckerStatus::IN_CONST_CONTEXT);
    }

    if (typeAnnotation) {
        typeAnnotation->Check(checker);
    }

    if (typeAnnotation && initializer) {
        checker::Type *annotationType = typeAnnotation->AsTypeNode()->GetType(checker);
        checker->ElaborateElementwise(annotationType, initializer, declarator->Id()->Start());
        bindingVar->SetTsType(annotationType);
    } else if (typeAnnotation) {
        bindingVar->SetTsType(typeAnnotation->AsTypeNode()->GetType(checker));
    } else if (initializer) {
        checker::Type *initializerType = checker->CheckTypeCached(initializer);

        if (!isConst) {
            initializerType = checker->GetBaseTypeOfLiteralType(initializerType);
        }

        bindingVar->SetTsType(initializerType);
    } else {
        checker->ThrowTypeError({"Variable ", declarator->Id()->AsIdentifier()->Name(), " implicitly has an any type."},
                                declarator->Id()->Start());
    }

    if (previousType) {
        checker->IsTypeIdenticalTo(bindingVar->TsType(), previousType,
                                   {"Subsequent variable declaration must have the same type. Variable '",
                                    bindingVar->Name(), "' must be of type '", previousType, "', but here has type '",
                                    bindingVar->TsType(), "'."},
                                   declarator->Id()->Start());
    }

    checker->RemoveStatus(checker::CheckerStatus::IN_CONST_CONTEXT);
}

checker::Type *VariableDeclarator::Check(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return nullptr;
    }

    if (id_->IsIdentifier()) {
        CheckSimpleVariableDeclaration(checker, this);
        checker->NodeCache().insert({this, nullptr});
        return nullptr;
    }

    if (id_->IsArrayPattern()) {
        auto context = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
        checker::ArrayDestructuringContext(checker, id_, false, id_->AsArrayPattern()->TypeAnnotation() == nullptr,
                                           id_->AsArrayPattern()->TypeAnnotation(), init_)
            .Start();

        checker->NodeCache().insert({this, nullptr});
        return nullptr;
    }

    ASSERT(id_->IsObjectPattern());
    auto context = checker::SavedCheckerContext(checker, checker::CheckerStatus::FORCE_TUPLE);
    checker::ObjectDestructuringContext(checker, id_, false, id_->AsObjectPattern()->TypeAnnotation() == nullptr,
                                        id_->AsObjectPattern()->TypeAnnotation(), init_)
        .Start();

    checker->NodeCache().insert({this, nullptr});
    return nullptr;
}

void VariableDeclarator::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    id_ = std::get<ir::AstNode *>(cb(id_))->AsExpression();

    if (init_) {
        init_ = std::get<ir::AstNode *>(cb(init_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
