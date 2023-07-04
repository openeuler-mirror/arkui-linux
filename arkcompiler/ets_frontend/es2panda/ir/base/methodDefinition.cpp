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

#include "methodDefinition.h"

#include <ir/astDump.h>
#include <ir/base/decorator.h>
#include <ir/base/scriptFunction.h>
#include <ir/expression.h>
#include <ir/expressions/functionExpression.h>

#include <utility>

namespace panda::es2panda::ir {

const ScriptFunction *MethodDefinition::Function() const
{
    return value_->Function();
}

void MethodDefinition::Iterate(const NodeTraverser &cb) const
{
    cb(key_);
    cb(value_);

    for (auto *it : overloads_) {
        cb(it);
    }

    for (auto *it : decorators_) {
        cb(it);
    }
}

void MethodDefinition::Dump(ir::AstDumper *dumper) const
{
    const char *kind = nullptr;

    switch (kind_) {
        case MethodDefinitionKind::CONSTRUCTOR: {
            kind = "constructor";
            break;
        }
        case MethodDefinitionKind::METHOD: {
            kind = "method";
            break;
        }
        case MethodDefinitionKind::GET: {
            kind = "get";
            break;
        }
        case MethodDefinitionKind::SET: {
            kind = "set";
            break;
        }
        default: {
            UNREACHABLE();
        }
    }

    dumper->Add({{"type", "MethodDefinition"},
                 {"key", key_},
                 {"kind", kind},
                 {"accessibility", AstDumper::Optional(AstDumper::ModifierToString(modifiers_))},
                 {"static", (modifiers_ & ModifierFlags::STATIC) != 0},
                 {"optional", (modifiers_ & ModifierFlags::OPTIONAL) != 0},
                 {"computed", isComputed_},
                 {"value", value_},
                 {"overloads", overloads_},
                 {"decorators", decorators_}});
}

void MethodDefinition::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *MethodDefinition::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

void MethodDefinition::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    key_ = std::get<ir::AstNode *>(cb(key_))->AsExpression();
    value_ = std::get<ir::AstNode *>(cb(value_))->AsFunctionExpression();

    for (auto iter = overloads_.begin(); iter != overloads_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsMethodDefinition();
    }

    for (auto iter = decorators_.begin(); iter != decorators_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsDecorator();
    }
}

}  // namespace panda::es2panda::ir
