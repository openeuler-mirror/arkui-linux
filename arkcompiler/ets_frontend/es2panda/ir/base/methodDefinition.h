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

#ifndef ES2PANDA_PARSER_INCLUDE_AST_METHOD_DEFINITION_H
#define ES2PANDA_PARSER_INCLUDE_AST_METHOD_DEFINITION_H

#include <ir/statement.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class Expression;
class FunctionExpression;

enum class MethodDefinitionKind { CONSTRUCTOR, METHOD, GET, SET };

class MethodDefinition : public Statement {
public:
    explicit MethodDefinition(MethodDefinitionKind kind, Expression *key, FunctionExpression *value,
                              ModifierFlags modifiers, ArenaAllocator *allocator, ArenaVector<Decorator *> &&decorators,
                              bool isComputed)
        : Statement(AstNodeType::METHOD_DEFINITION),
          kind_(kind),
          key_(key),
          value_(value),
          modifiers_(modifiers),
          overloads_(allocator->Adapter()),
          decorators_(std::move(decorators)),
          isComputed_(isComputed)
    {
    }

    MethodDefinitionKind Kind() const
    {
        return kind_;
    }

    ModifierFlags Modifiers() const
    {
        return modifiers_;
    }

    const Expression *Key() const
    {
        return key_;
    }

    const FunctionExpression *Value() const
    {
        return value_;
    }

    bool Computed() const
    {
        return isComputed_;
    }

    bool IsStatic() const
    {
        return (modifiers_ & ModifierFlags::STATIC) != 0;
    }

    bool IsAccessor() const
    {
        return (kind_ == MethodDefinitionKind::GET) || (kind_ == MethodDefinitionKind::SET);
    }

    bool IsOptional() const
    {
        return (modifiers_ & ModifierFlags::OPTIONAL) != 0;
    }

    const ArenaVector<MethodDefinition *> &Overloads() const
    {
        return overloads_;
    }

    const ArenaVector<Decorator *> &Decorators() const
    {
        return decorators_;
    }

    void SetOverloads(ArenaVector<MethodDefinition *> &&overloads)
    {
        overloads_ = std::move(overloads);
    }

    void AddOverload(MethodDefinition *overload)
    {
        overloads_.push_back(overload);
    }

    const ScriptFunction *Function() const;

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    MethodDefinitionKind kind_;
    Expression *key_;
    FunctionExpression *value_;
    ModifierFlags modifiers_;
    ArenaVector<MethodDefinition *> overloads_;
    ArenaVector<Decorator *> decorators_;
    bool isComputed_;
};

}  // namespace panda::es2panda::ir

#endif
