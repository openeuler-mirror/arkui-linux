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

#ifndef ES2PANDA_TYPESCIRPT_CORE_TYPE_ELABORATION_CONTEXT_H
#define ES2PANDA_TYPESCIRPT_CORE_TYPE_ELABORATION_CONTEXT_H

#include <typescript/checker.h>
#include <ir/expression.h>

#include <macros.h>

namespace panda::es2panda::ir {
class Expression;
class SpreadElement;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::checker {
class Type;

class ElaborationContext {
public:
    ElaborationContext(Checker *checker, Type *targetType, Type *sourceType, const ir::Expression *sourceNode,
                       const lexer::SourcePosition &startPos)
        : checker_(checker),
          targetType_(targetType),
          sourceType_(sourceType),
          sourceNode_(sourceNode),
          startPos_(startPos),
          potentialTypes_(checker->Allocator()->Adapter())
    {
    }

    virtual void Start() = 0;
    virtual void RemoveUnnecessaryTypes() = 0;

    Type *GetBestMatchingType(Type *indexType, const ir::Expression *sourceNode);

protected:
    Checker *checker_;
    Type *targetType_;
    Type *sourceType_;
    const ir::Expression *sourceNode_;
    const lexer::SourcePosition startPos_;
    ArenaVector<Type *> potentialTypes_;
};

class ArrayElaborationContext : public ElaborationContext {
public:
    ArrayElaborationContext(Checker *checker, Type *targetType, Type *sourceType, const ir::Expression *sourceNode,
                            const lexer::SourcePosition &startPos)
        : ElaborationContext(checker, targetType, sourceType, sourceNode, startPos)
    {
    }

    void Start() override;
    void RemoveUnnecessaryTypes() override;

private:
    uint32_t index_ {0};
};

class ObjectElaborationContext : public ElaborationContext {
public:
    ObjectElaborationContext(Checker *checker, Type *targetType, Type *sourceType, const ir::Expression *sourceNode,
                             const lexer::SourcePosition &startPos)
        : ElaborationContext(checker, targetType, sourceType, sourceNode, startPos)
    {
    }

    void Start() override;
    void RemoveUnnecessaryTypes() override;
};
}  // namespace panda::es2panda::checker

#endif
