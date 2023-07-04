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

#ifndef ES2PANDA_COMPILER_BASE_ITERATORS_H
#define ES2PANDA_COMPILER_BASE_ITERATORS_H

#include <ir/irnode.h>

namespace panda::es2panda::ir {
class AstNode;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class PandaGen;

enum class IteratorType { SYNC, ASYNC };

class Iterator {
public:
    Iterator(PandaGen *pg, const ir::AstNode *node, IteratorType type);
    DEFAULT_COPY_SEMANTIC(Iterator);
    DEFAULT_MOVE_SEMANTIC(Iterator);
    ~Iterator() = default;

    IteratorType Type() const
    {
        return type_;
    }

    VReg Method() const
    {
        return method_;
    }

    VReg NextResult() const
    {
        return nextResult_;
    }

    const ir::AstNode *Node() const
    {
        return node_;
    }

    void GetMethod(util::StringView name) const;
    void CallMethod() const;
    void CallMethodWithValue() const;

    void Next() const;
    void Complete() const;
    void Value() const;
    void Close(bool abruptCompletion) const;

protected:
    PandaGen *pg_;
    const ir::AstNode *node_;
    VReg closed_;
    // These 3 regs must be allocated continuously
    VReg method_;
    VReg iterator_;
    VReg nextResult_;
    IteratorType type_;
};

class DestructuringIterator : public Iterator {
public:
    explicit DestructuringIterator(PandaGen *pg, const ir::AstNode *node);

    DEFAULT_COPY_SEMANTIC(DestructuringIterator);
    DEFAULT_MOVE_SEMANTIC(DestructuringIterator);
    ~DestructuringIterator() = default;

    VReg Done() const
    {
        return done_;
    }

    VReg Result() const
    {
        return result_;
    }

    void Step(Label *doneTarget = nullptr) const;

    virtual void OnIterDone([[maybe_unused]] Label *doneTarget) const;

    friend class DestructuringRestIterator;

protected:
    VReg done_;
    VReg result_;
};

class DestructuringRestIterator : public DestructuringIterator {
public:
    explicit DestructuringRestIterator(const DestructuringIterator &iterator) : DestructuringIterator(iterator) {}

    DEFAULT_COPY_SEMANTIC(DestructuringRestIterator);
    DEFAULT_MOVE_SEMANTIC(DestructuringRestIterator);
    ~DestructuringRestIterator() = default;

    void OnIterDone([[maybe_unused]] Label *doneTarget) const override;
};

}  // namespace panda::es2panda::compiler

#endif
