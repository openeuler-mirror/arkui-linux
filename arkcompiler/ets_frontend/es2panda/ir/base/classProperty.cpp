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

#include "classProperty.h"

#include <cstdint>
#include <string>

#include "binder/binder.h"
#include "ir/astDump.h"
#include "ir/base/decorator.h"
#include "ir/base/scriptFunction.h"
#include "ir/expression.h"
#include "util/helpers.h"

namespace panda::es2panda::ir {

void ClassProperty::Iterate(const NodeTraverser &cb) const
{
    cb(key_);

    if (value_) {
        cb(value_);
    }

    if (typeAnnotation_) {
        cb(typeAnnotation_);
    }

    for (auto *it : decorators_) {
        cb(it);
    }
}

void ClassProperty::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "ClassProperty"},
                 {"key", key_},
                 {"value", AstDumper::Optional(value_)},
                 {"accessibility", AstDumper::Optional(AstDumper::ModifierToString(modifiers_))},
                 {"abstract", AstDumper::Optional((modifiers_ & ModifierFlags::ABSTRACT) != 0)},
                 {"static", (modifiers_ & ModifierFlags::STATIC) != 0},
                 {"readonly", (modifiers_ & ModifierFlags::READONLY) != 0},
                 {"declare", (modifiers_ & ModifierFlags::DECLARE) != 0},
                 {"optional", (modifiers_ & ModifierFlags::OPTIONAL) != 0},
                 {"computed", isComputed_},
                 {"typeAnnotation", AstDumper::Optional(typeAnnotation_)},
                 {"definite", AstDumper::Optional(definite_)},
                 {"decorators", decorators_}});
}

void ClassProperty::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *ClassProperty::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void ClassProperty::UpdateSelf(const NodeUpdater &cb, binder::Binder *binder)
{
    const ir::ScriptFunction *ctor = util::Helpers::GetContainingConstructor(this);
    auto scopeCtx = binder::LexicalScope<binder::FunctionScope>::Enter(binder, ctor->Scope());

    key_ = std::get<ir::AstNode *>(cb(key_))->AsExpression();

    if (value_) {
        value_ = std::get<ir::AstNode *>(cb(value_))->AsExpression();
    }

    if (typeAnnotation_) {
        typeAnnotation_ = std::get<ir::AstNode *>(cb(typeAnnotation_))->AsExpression();
    }

    for (auto iter = decorators_.begin(); iter != decorators_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsDecorator();
    }
}

}  // namespace panda::es2panda::ir
