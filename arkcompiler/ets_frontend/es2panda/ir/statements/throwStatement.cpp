/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#include "throwStatement.h"

#include <compiler/core/pandagen.h>
#include <ir/astDump.h>
#include <ir/expression.h>

namespace panda::es2panda::ir {

void ThrowStatement::Iterate(const NodeTraverser &cb) const
{
    cb(argument_);
}

void ThrowStatement::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ThrowStatement"}, {"argument", argument_}});
}

void ThrowStatement::Compile(compiler::PandaGen *pg) const
{
    argument_->Compile(pg);
    pg->EmitThrow(this);
}

checker::Type *ThrowStatement::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ThrowStatement::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    argument_ = std::get<ir::AstNode *>(cb(argument_))->AsExpression();
}

}  // namespace panda::es2panda::ir
