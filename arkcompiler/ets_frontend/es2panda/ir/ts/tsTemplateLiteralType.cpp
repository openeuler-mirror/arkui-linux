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

#include "tsTemplateLiteralType.h"

#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSTemplateLiteralType::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : references_) {
        cb(it);
    }

    for (auto *it : quasis_) {
        cb(it);
    }
}

void TSTemplateLiteralType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTemplateLiteralType"}, {"references", references_}, {"quasis", quasis_}});
}

void TSTemplateLiteralType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTemplateLiteralType::Check([[maybe_unused]] checker::Checker *checker) const
{
    // TODO(huangyu): Implement checker for template literal type
    return nullptr;
}

checker::Type *TSTemplateLiteralType::GetType(checker::Checker *checker) const
{
    // TODO(huangyu): Implement GetType for template literal type
    return nullptr;
}

void TSTemplateLiteralType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = references_.begin(); iter != references_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }

    for (auto iter = quasis_.begin(); iter != quasis_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsTemplateElement();
    }
}

}  // namespace panda::es2panda::ir
