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

#ifndef ES2PANDA_TYPESCIRPT_CORE_DESTRUCTURING_CONTEXT_H
#define ES2PANDA_TYPESCIRPT_CORE_DESTRUCTURING_CONTEXT_H

#include <typescript/checker.h>
#include <ir/expression.h>

#include <macros.h>

namespace panda::es2panda::ir {
class Expression;
class SpreadElement;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::checker {
class Type;

class DestructuringContext {
public:
    DestructuringContext(Checker *checker, const ir::Expression *id, bool inAssignment, bool convertTupleToArray,
                         const ir::Expression *typeAnnotation, const ir::Expression *initializer)
        : checker_(checker), id_(id), inAssignment_(inAssignment), convertTupleToArray_(convertTupleToArray)
    {
        Prepare(typeAnnotation, initializer, id->Start());
    }

    void SetInferedType(Type *type)
    {
        inferedType_ = type;
    }

    void SetSignatureInfo(SignatureInfo *info)
    {
        signatureInfo_ = info;
    }

    Type *InferedType()
    {
        return inferedType_;
    }

    void ValidateObjectLiteralType(ObjectType *objType, const ir::ObjectExpression *objPattern);
    void HandleDestructuringAssignment(const ir::Identifier *ident, Type *inferedType, Type *defaultType);
    void HandleAssignmentPattern(const ir::AssignmentExpression *assignmentPattern, Type *inferedType,
                                 bool validateDefault);
    void SetInferedTypeForVariable(binder::Variable *var, Type *inferedType, const lexer::SourcePosition &loc);
    void Prepare(const ir::Expression *typeAnnotation, const ir::Expression *initializer,
                 const lexer::SourcePosition &loc);

    DEFAULT_COPY_SEMANTIC(DestructuringContext);
    DEFAULT_MOVE_SEMANTIC(DestructuringContext);
    virtual ~DestructuringContext() = default;

    virtual void Start() = 0;
    virtual void ValidateInferedType() = 0;
    virtual Type *NextInferedType([[maybe_unused]] const util::StringView &searchName, bool throwError) = 0;
    virtual void HandleRest(const ir::SpreadElement *rest) = 0;
    virtual Type *GetRestType([[maybe_unused]] const lexer::SourcePosition &loc) = 0;
    virtual Type *ConvertTupleTypeToArrayTypeIfNecessary(const ir::AstNode *node, Type *type) = 0;

protected:
    Checker *checker_;
    const ir::Expression *id_;
    bool inAssignment_;
    bool convertTupleToArray_;
    Type *inferedType_ {nullptr};
    SignatureInfo *signatureInfo_ {nullptr};
    bool validateObjectPatternInitializer_ {true};
    bool validateTypeAnnotation_ {false};
};

class ArrayDestructuringContext : public DestructuringContext {
public:
    ArrayDestructuringContext(Checker *checker, const ir::Expression *id, bool inAssignment, bool convertTupleToArray,
                              const ir::Expression *typeAnnotation, const ir::Expression *initializer)
        : DestructuringContext(checker, id, inAssignment, convertTupleToArray, typeAnnotation, initializer)
    {
    }

    Type *GetTypeFromTupleByIndex(TupleType *tuple);
    Type *CreateArrayTypeForRest(UnionType *inferedType);
    Type *CreateTupleTypeForRest(TupleType *tuple);
    void SetRemainingPatameterTypes();

    void Start() override;
    void ValidateInferedType() override;
    Type *NextInferedType([[maybe_unused]] const util::StringView &searchName, bool throwError) override;
    void HandleRest(const ir::SpreadElement *rest) override;
    Type *GetRestType([[maybe_unused]] const lexer::SourcePosition &loc) override;
    Type *ConvertTupleTypeToArrayTypeIfNecessary(const ir::AstNode *node, Type *type) override;

private:
    uint32_t index_ {0};
};

class ObjectDestructuringContext : public DestructuringContext {
public:
    ObjectDestructuringContext(Checker *checker, const ir::Expression *id, bool inAssignment, bool convertTupleToArray,
                               const ir::Expression *typeAnnotation, const ir::Expression *initializer)
        : DestructuringContext(checker, id, inAssignment, convertTupleToArray, typeAnnotation, initializer)
    {
    }

    Type *CreateObjectTypeForRest(ObjectType *objType);

    void Start() override;
    void ValidateInferedType() override;
    Type *NextInferedType([[maybe_unused]] const util::StringView &searchName, bool throwError) override;
    void HandleRest(const ir::SpreadElement *rest) override;
    Type *GetRestType([[maybe_unused]] const lexer::SourcePosition &loc) override;
    Type *ConvertTupleTypeToArrayTypeIfNecessary(const ir::AstNode *node, Type *type) override;
};
}  // namespace panda::es2panda::checker

#endif
