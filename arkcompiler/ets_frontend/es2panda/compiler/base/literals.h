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

#ifndef ES2PANDA_COMPILER_BASE_LITERALS_H
#define ES2PANDA_COMPILER_BASE_LITERALS_H

#include <ir/expressions/literal.h>
#include <util/ustring.h>

#include <variant>

namespace panda::es2panda::ir {
class Literal;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::compiler {

class PandaGen;

class LiteralBuffer {
public:
    explicit LiteralBuffer(ArenaAllocator *allocator) : literals_(allocator->Adapter()) {}
    ~LiteralBuffer() = default;
    NO_COPY_SEMANTIC(LiteralBuffer);
    NO_MOVE_SEMANTIC(LiteralBuffer);

    void Add(const ir::Literal *lit)
    {
        literals_.push_back(lit);
    }

    bool IsEmpty() const
    {
        return literals_.empty();
    }

    size_t Size() const
    {
        return literals_.size();
    }

    int32_t Index() const
    {
        return index_;
    }

    void ResetLiteral(size_t index, const ir::Literal *literal)
    {
        literals_[index] = literal;
    }

    const ArenaVector<const ir::Literal *> &Literals() const
    {
        return literals_;
    }

    void Insert(LiteralBuffer *other)
    {
        literals_.insert(literals_.end(), other->literals_.begin(), other->literals_.end());
        other->literals_.clear();
    }

    void SetIndex(int32_t index)
    {
        index_ = index;
    }

private:
    ArenaVector<const ir::Literal *> literals_;
    int32_t index_ {};
};

class Literals {
public:
    Literals() = delete;

    static void GetTemplateObject(PandaGen *pg, const ir::TaggedTemplateExpression *lit);
};

}  // namespace panda::es2panda::compiler

#endif
