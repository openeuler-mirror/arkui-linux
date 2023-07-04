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

#ifndef ES2PANDA_IR_EXPRESSION_IDENTIFIER_H
#define ES2PANDA_IR_EXPRESSION_IDENTIFIER_H

#include <ir/expression.h>
#include <util/ustring.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::binder {
class Variable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::ir {

enum class IdentifierFlags {
    NONE,
    OPTIONAL = 1 << 0,
    REFERENCE = 1 << 1,
    TDZ = 1 << 2,
};

DEFINE_BITOPS(IdentifierFlags)

class Identifier : public Expression {
public:
    explicit Identifier(util::StringView name, ArenaAllocator *allocator)
        : Expression(AstNodeType::IDENTIFIER), name_(name), decorators_(allocator->Adapter())
    {
    }

    explicit Identifier(util::StringView name, ArenaVector<Decorator *> &&decorators)
        : Expression(AstNodeType::IDENTIFIER), name_(name), decorators_(std::move(decorators))
    {
    }

    explicit Identifier(util::StringView name, Expression *typeAnnotation, ArenaAllocator *allocator)
        : Expression(AstNodeType::IDENTIFIER),
          name_(name),
          typeAnnotation_(typeAnnotation),
          decorators_(allocator->Adapter())
    {
    }

    const Expression *TypeAnnotation() const
    {
        return typeAnnotation_;
    }

    Expression *TypeAnnotation()
    {
        return typeAnnotation_;
    }

    const util::StringView &Name() const
    {
        return name_;
    }

    const ArenaVector<Decorator *> &Decorators() const
    {
        return decorators_;
    }

    bool IsOptional() const
    {
        return (flags_ & IdentifierFlags::OPTIONAL) != 0;
    }

    void SetOptional(bool optional)
    {
        if (optional) {
            flags_ |= IdentifierFlags::OPTIONAL;
        } else {
            flags_ &= ~IdentifierFlags::OPTIONAL;
        }
    }

    bool IsReference() const
    {
        return (flags_ & IdentifierFlags::REFERENCE) != 0;
    }

    void SetReference()
    {
        flags_ |= IdentifierFlags::REFERENCE;
    }

    bool IsTdz() const
    {
        return (flags_ & IdentifierFlags::TDZ) != 0;
    }

    void SetTdz()
    {
        flags_ |= IdentifierFlags::TDZ;
    }

    void SetTsTypeAnnotation(Expression *typeAnnotation) override
    {
        typeAnnotation_ = typeAnnotation;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    util::StringView name_;
    Expression *typeAnnotation_ {};
    IdentifierFlags flags_ {IdentifierFlags::NONE};
    ArenaVector<Decorator *> decorators_;
};

}  // namespace panda::es2panda::ir

#endif
