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

#include "regExpLiteral.h"

#include <binder/variable.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void RegExpLiteral::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void RegExpLiteral::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "RegExpLiteral"}, {"source", pattern_}, {"flags", flags_}});
}

void RegExpLiteral::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    /* [ ctor, newTarget, regexpPattern(, regexpFlags) ] */
    compiler::VReg ctor = pg->AllocReg();
    compiler::VReg pattern = pg->AllocReg();
    size_t argCount = 2;

    pg->TryLoadGlobalByName(this, "RegExp");
    pg->StoreAccumulator(this, ctor);

    pg->LoadAccumulatorString(this, pattern_);
    pg->StoreAccumulator(this, pattern);

    if (!flags_.Empty()) {
        compiler::VReg flag = pg->AllocReg();
        pg->LoadAccumulatorString(this, flags_);
        pg->StoreAccumulator(this, flag);
        argCount++;
    }

    pg->NewObject(this, ctor, argCount);
}

checker::Type *RegExpLiteral::Check(checker::Checker *checker) const
{
    return checker->GlobalAnyType();
}

void RegExpLiteral::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
