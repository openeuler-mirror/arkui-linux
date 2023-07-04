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

#include "tsImportType.h"

#include <ir/astDump.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterInstantiation.h>

namespace panda::es2panda::ir {

void TSImportType::Iterate(const NodeTraverser &cb) const
{
    cb(param_);

    if (typeParams_) {
        cb(typeParams_);
    }

    if (qualifier_) {
        cb(qualifier_);
    }
}

void TSImportType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSImportType"},
                 {"parameter", param_},
                 {"qualifier", AstDumper::Optional(qualifier_)},
                 {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"isTypeOf", isTypeof_}});
}

void TSImportType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSImportType::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

checker::Type *TSImportType::GetType([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSImportType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    param_ = std::get<ir::AstNode *>(cb(param_))->AsExpression();

    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterInstantiation();
    }

    if (qualifier_) {
        qualifier_ = std::get<ir::AstNode *>(cb(qualifier_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
