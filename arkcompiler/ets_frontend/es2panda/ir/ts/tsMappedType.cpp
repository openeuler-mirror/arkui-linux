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

#include "tsMappedType.h"

#include <ir/astDump.h>
#include <ir/ts/tsTypeParameter.h>

namespace panda::es2panda::ir {

void TSMappedType::Iterate(const NodeTraverser &cb) const
{
    cb(typeParameter_);
    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }
}

void TSMappedType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add(
        {{"type", "TSMappedType"},
         {"typeParameter", typeParameter_},
         {"nameKeyType", AstDumper::Optional(nameKeyType_)},
         {"typeAnnotation", AstDumper::Optional(typeAnnotation_)},
         {"readonly", readonly_ == MappedOption::NO_OPTS
                          ? AstDumper::Optional(false)
                          : readonly_ == MappedOption::PLUS ? AstDumper::Optional("+") : AstDumper::Optional("-")},
         {"optional", optional_ == MappedOption::NO_OPTS
                          ? AstDumper::Optional(false)
                          : optional_ == MappedOption::PLUS ? AstDumper::Optional("+") : AstDumper::Optional("-")}});
}

void TSMappedType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSMappedType::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

checker::Type *TSMappedType::GetType([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void TSMappedType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    typeParameter_ = std::get<ir::AstNode *>(cb(typeParameter_))->AsTSTypeParameter();

    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
