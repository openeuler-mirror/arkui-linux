/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "tsSymbolKeyword.h"

#include <ir/astDump.h>
#include <typescript/checker.h>

namespace panda::es2panda::ir {

void TSSymbolKeyword::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void TSSymbolKeyword::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSSymbolKeyword"}});
}

void TSSymbolKeyword::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSSymbolKeyword::Check([[maybe_unused]] checker::Checker *checker) const
{
    // TODO(xucheng): Implement checker for ts symbol keyword
    return nullptr;
}

checker::Type *TSSymbolKeyword::GetType(checker::Checker *checker) const
{
    return checker->GlobalSymbolType();
}

void TSSymbolKeyword::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
