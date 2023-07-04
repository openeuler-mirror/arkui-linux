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

#include "thisExpression.h"

#include <util/helpers.h>
#include <binder/binder.h>
#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void ThisExpression::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void ThisExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ThisExpression"}});
}

void ThisExpression::Compile(compiler::PandaGen *pg) const
{
    binder::ScopeFindResult res = pg->Scope()->Find(binder::Binder::MANDATORY_PARAM_THIS);

    ASSERT(res.variable && res.variable->IsLocalVariable());
    if (pg->isDebuggerEvaluateExpressionMode()) {
        pg->LoadObjByNameViaDebugger(this, binder::Binder::MANDATORY_PARAM_THIS, true);
    } else {
        pg->LoadAccFromLexEnv(this, res);
    }

    const ir::ScriptFunction *func = util::Helpers::GetContainingConstructor(this);

    if (func) {
        pg->ThrowIfSuperNotCorrectCall(this, 0);
    }
}

checker::Type *ThisExpression::Check(checker::Checker *checker) const
{
    // TODO(aszilagyi)
    return checker->GlobalAnyType();
}

void ThisExpression::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
