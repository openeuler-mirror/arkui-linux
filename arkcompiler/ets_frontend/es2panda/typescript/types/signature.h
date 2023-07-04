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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_SIGNATURE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_SIGNATURE_H

#include "type.h"

#include <binder/variable.h>

namespace panda::es2panda::binder {
class LocalVariable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::checker {

class SignatureInfo {
public:
    explicit SignatureInfo(ArenaAllocator *allocator) : params(allocator->Adapter()) {}

    SignatureInfo(const SignatureInfo *other, ArenaAllocator *allocator) : params(allocator->Adapter())
    {
        for (auto *it : other->params) {
            params.push_back(it->Copy(allocator, it->Declaration()));
        }

        minArgCount = other->minArgCount;

        if (other->restVar) {
            restVar = other->restVar->Copy(allocator, other->restVar->Declaration());
        }
    }

    ~SignatureInfo() = default;
    NO_COPY_SEMANTIC(SignatureInfo);
    NO_MOVE_SEMANTIC(SignatureInfo);

    uint32_t minArgCount {};
    binder::LocalVariable *restVar {};
    ArenaVector<binder::LocalVariable *> params;
};

class Signature {
public:
    Signature(SignatureInfo *signatureInfo, Type *returnType) : signatureInfo_(signatureInfo), returnType_(returnType)
    {
    }

    ~Signature() = default;
    NO_COPY_SEMANTIC(Signature);
    NO_MOVE_SEMANTIC(Signature);

    const SignatureInfo *GetSignatureInfo() const
    {
        return signatureInfo_;
    }

    const ArenaVector<binder::LocalVariable *> &Params() const
    {
        return signatureInfo_->params;
    }

    const Type *ReturnType() const
    {
        return returnType_;
    }

    Type *ReturnType()
    {
        return returnType_;
    }

    uint32_t MinArgCount() const
    {
        return signatureInfo_->minArgCount;
    }

    uint32_t OptionalArgCount() const
    {
        return signatureInfo_->params.size() - signatureInfo_->minArgCount;
    }

    void SetReturnType(Type *type)
    {
        returnType_ = type;
    }

    void SetNode(const ir::AstNode *node)
    {
        node_ = node;
    }

    const ir::AstNode *Node() const
    {
        return node_;
    }

    const binder::LocalVariable *RestVar() const
    {
        return signatureInfo_->restVar;
    }

    Signature *Copy(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes);

    void ToString(std::stringstream &ss, const binder::Variable *variable, bool printAsMethod = false) const;
    void Identical(TypeRelation *relation, Signature *other);
    void AssignmentTarget(TypeRelation *relation, Signature *source);

private:
    checker::SignatureInfo *signatureInfo_;
    Type *returnType_;
    const ir::AstNode *node_ {nullptr};
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_SIGNATURE_H */
