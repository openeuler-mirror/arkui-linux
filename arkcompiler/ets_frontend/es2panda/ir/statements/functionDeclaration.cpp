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

#include "functionDeclaration.h"

#include <binder/variable.h>
#include <binder/scope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/base/scriptFunction.h>
#include <ir/expressions/identifier.h>

namespace panda::es2panda::ir {

void FunctionDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(func_);
}

void FunctionDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", func_->IsOverload() ? "TSDeclareFunction" : "FunctionDeclaration"}, {"function", func_}});
}

void FunctionDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *FunctionDeclaration::Check(checker::Checker *checker) const
{
    if (func_->IsOverload()) {
        return nullptr;
    }

    const util::StringView &funcName = func_->Id()->Name();
    binder::ScopeFindResult result = checker->Scope()->Find(funcName);
    ASSERT(result.variable);

    checker::ScopeContext scopeCtx(checker, func_->Scope());

    if (!result.variable->TsType()) {
        checker->InferFunctionDeclarationType(result.variable->Declaration()->AsFunctionDecl(), result.variable);
    }

    func_->Body()->Check(checker);

    return nullptr;
}

void FunctionDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (func_) {
        func_ = std::get<ir::AstNode *>(cb(func_))->AsScriptFunction();
    }
}

}  // namespace panda::es2panda::ir
