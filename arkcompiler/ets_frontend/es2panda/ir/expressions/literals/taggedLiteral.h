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

#ifndef ES2PANDA_IR_EXPRESSION_LITERAL_TAGGED_LITERAL_H
#define ES2PANDA_IR_EXPRESSION_LITERAL_TAGGED_LITERAL_H

#include <ir/expressions/literal.h>
#include <util/ustring.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {
class TaggedLiteral : public Literal {
public:
    explicit TaggedLiteral(LiteralTag tag) : Literal(AstNodeType::TAGGED_LITERAL), tag_(tag) {}
    explicit TaggedLiteral(LiteralTag tag, util::StringView str)
        : Literal(AstNodeType::TAGGED_LITERAL), str_(str), tag_(tag)
    {
    }

    explicit TaggedLiteral(LiteralTag tag, uint16_t num)
        : Literal(AstNodeType::TAGGED_LITERAL), num_(num), tag_(tag)
    {
    }

    const util::StringView &Str() const
    {
        return str_;
    }

    bool operator==(const TaggedLiteral &other) const
    {
        return tag_ == other.tag_ && str_ == other.str_;
    }

    LiteralTag Tag() const override
    {
        return tag_;
    }

    const util::StringView &Method() const
    {
        ASSERT(tag_ == LiteralTag::ACCESSOR || tag_ == LiteralTag::METHOD || tag_ == LiteralTag::GENERATOR_METHOD ||
               tag_ == LiteralTag::ASYNC_GENERATOR_METHOD);
        return str_;
    }

    uint16_t MethodAffiliate() const
    {
        ASSERT(tag_ == LiteralTag::METHODAFFILIATE);
        return num_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    void UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    uint16_t num_ {};
    util::StringView str_ {};
    LiteralTag tag_ {LiteralTag::NULL_VALUE};
};
}  // namespace panda::es2panda::ir

#endif
