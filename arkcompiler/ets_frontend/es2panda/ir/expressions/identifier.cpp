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

#include "identifier.h"

#include <binder/scope.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>
#include <ir/base/decorator.h>
#include <ir/base/scriptFunction.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/statements/functionDeclaration.h>
#include <ir/statements/variableDeclarator.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void Identifier::Iterate(const NodeTraverser &cb) const
{
    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }

    for (auto *it : decorators_) {
        cb(it);
    }
}

void Identifier::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "Identifier"},
                 {"name", name_},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)},
                 {"optional", AstDumper::Optional(IsOptional())},
                 {"decorators", decorators_}});
}

void Identifier::Compile(compiler::PandaGen *pg) const
{
    binder::ScopeFindResult res = pg->Scope()->Find(name_);
    if (res.variable) {
        pg->LoadVar(this, res);
        return;
    }

    if (name_.Is("NaN")) {
        pg->LoadConst(this, compiler::Constant::JS_NAN);
        return;
    }

    if (name_.Is("Infinity")) {
        pg->LoadConst(this, compiler::Constant::JS_INFINITY);
        return;
    }

    if (name_.Is("globalThis")) {
        pg->LoadConst(this, compiler::Constant::JS_GLOBAL);
        return;
    }

    if (name_.Is("undefined")) {
        pg->LoadConst(this, compiler::Constant::JS_UNDEFINED);
        return;
    }

    pg->TryLoadGlobalByName(this, name_);
}

checker::Type *Identifier::Check(checker::Checker *checker) const
{
    if (!Variable()) {
        if (name_.Is("undefined")) {
            return checker->GlobalUndefinedType();
        }

        checker->ThrowTypeError({"Cannot find name ", name_}, Start());
    }

    const binder::Decl *decl = Variable()->Declaration();

    if (decl->IsTypeAliasDecl() || decl->IsInterfaceDecl()) {
        checker->ThrowTypeError({name_, " only refers to a type, but is being used as a value here."}, Start());
    }

    return checker->GetTypeOfVariable(Variable());
}

void Identifier::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }

    for (auto iter = decorators_.begin(); iter != decorators_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsDecorator();
    }
}

}  // namespace panda::es2panda::ir
