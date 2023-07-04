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

#include "taggedTemplateExpression.h"

#include <binder/variable.h>
#include <compiler/base/literals.h>
#include <compiler/core/pandagen.h>
#include <compiler/core/regScope.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/templateLiteral.h>
#include <ir/ts/tsTypeParameterInstantiation.h>

namespace panda::es2panda::ir {

void TaggedTemplateExpression::Iterate(const NodeTraverser &cb) const
{
    if (typeParams_) {
        cb(typeParams_);
    }

    cb(tag_);
    cb(quasi_);
}

void TaggedTemplateExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TaggedTemplateExpression"},
                 {"tag", tag_},
                 {"quasi", quasi_},
                 {"typeParameters", AstDumper::Optional(typeParams_)}});
}

void TaggedTemplateExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::VReg callee = pg->AllocReg();
    bool hasThis = false;

    if (tag_->IsMemberExpression()) {
        hasThis = true;
        compiler::VReg thisReg = pg->AllocReg();

        compiler::RegScope mrs(pg);
        tag_->AsMemberExpression()->Compile(pg, thisReg);
    } else {
        tag_->Compile(pg);
    }

    pg->StoreAccumulator(this, callee);

    compiler::Literals::GetTemplateObject(pg, this);
    compiler::VReg arg0 = pg->AllocReg();
    pg->StoreAccumulator(this, arg0);

    for (const auto *element : quasi_->Expressions()) {
        element->Compile(pg);
        compiler::VReg arg = pg->AllocReg();
        pg->StoreAccumulator(element, arg);
    }

    if (hasThis) {
        constexpr auto extraParams = 2;
        pg->CallThis(this, callee, static_cast<int64_t>(quasi_->Expressions().size() + extraParams));
        return;
    }

    constexpr auto extraParams = 1;
    pg->Call(this, callee, quasi_->Expressions().size() + extraParams);
}

checker::Type *TaggedTemplateExpression::Check(checker::Checker *checker) const
{
    // TODO(aszilagyi)
    return checker->GlobalAnyType();
}

void TaggedTemplateExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterInstantiation();
    }

    tag_ = std::get<ir::AstNode *>(cb(tag_))->AsExpression();
    quasi_ = std::get<ir::AstNode *>(cb(quasi_))->AsTemplateLiteral();
}

}  // namespace panda::es2panda::ir
