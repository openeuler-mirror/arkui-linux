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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_OBJECT_TYPE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_OBJECT_TYPE_H

#include "type.h"

#include <typescript/types/objectDescriptor.h>
#include <binder/variable.h>

#include <util/ustring.h>
#include <util/enumbitops.h>

namespace panda::es2panda::binder {
class LocalVariable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::checker {

class Signature;
class IndexInfo;

#define DECLARE_OBJECT_TYPENAMES(objectKind, typeName) class typeName;
OBJECT_TYPE_MAPPING(DECLARE_OBJECT_TYPENAMES)
#undef DECLARE_OBJECT_TYPENAMES

enum class ObjectFlags {
    NO_OPTS = 0,
    CHECK_EXCESS_PROPS = 1 << 0,
    RESOLVED_MEMBERS = 1 << 1,
    RESOLVED_BASE_TYPES = 1 << 2,
    RESOLVED_DECLARED_MEMBERS = 1 << 3,
};

DEFINE_BITOPS(ObjectFlags)

class ObjectType : public Type {
public:
    enum class ObjectTypeKind {
        LITERAL,
        CLASS,
        INTERFACE,
        TUPLE,
        FUNCTION,
    };

#define OBJECT_TYPE_IS_CHECKS(objectKind, typeName)  \
    bool Is##typeName() const                        \
    {                                                \
        return kind_ == objectKind;                  \
    }
    OBJECT_TYPE_MAPPING(OBJECT_TYPE_IS_CHECKS)
#undef OBJECT_TYPE_IS_CHECKS

#define OBJECT_TYPE_AS_CASTS(objectKind, typeName)       \
    typeName *As##typeName()                             \
    {                                                    \
        ASSERT(Is##typeName());                          \
        return reinterpret_cast<typeName *>(this);       \
    }                                                    \
    const typeName *As##typeName() const                 \
    {                                                    \
        ASSERT(Is##typeName());                          \
        return reinterpret_cast<const typeName *>(this); \
    }
    OBJECT_TYPE_MAPPING(OBJECT_TYPE_AS_CASTS)
#undef OBJECT_TYPE_AS_CASTS

    explicit ObjectType(ObjectType::ObjectTypeKind kind)
        : Type(TypeFlag::OBJECT), kind_(kind), desc_(nullptr), objFlag_(ObjectFlags::NO_OPTS)
    {
    }

    ObjectType(ObjectType::ObjectTypeKind kind, ObjectDescriptor *desc)
        : Type(TypeFlag::OBJECT), kind_(kind), desc_(desc), objFlag_(ObjectFlags::NO_OPTS)
    {
    }

    ObjectType::ObjectTypeKind Kind() const
    {
        return kind_;
    }

    virtual ArenaVector<Signature *> CallSignatures()
    {
        return desc_->callSignatures;
    }

    virtual ArenaVector<Signature *> ConstructSignatures()
    {
        return desc_->constructSignatures;
    }

    virtual const IndexInfo *StringIndexInfo() const
    {
        return desc_->stringIndexInfo;
    }

    virtual const IndexInfo *NumberIndexInfo() const
    {
        return desc_->numberIndexInfo;
    }

    virtual IndexInfo *StringIndexInfo()
    {
        return desc_->stringIndexInfo;
    }

    virtual IndexInfo *NumberIndexInfo()
    {
        return desc_->numberIndexInfo;
    }

    virtual ArenaVector<binder::LocalVariable *> Properties()
    {
        return desc_->properties;
    }

    ObjectDescriptor *Desc()
    {
        return desc_;
    }

    const ObjectDescriptor *Desc() const
    {
        return desc_;
    }

    void AddProperty(binder::LocalVariable *prop)
    {
        desc_->properties.push_back(prop);
    }

    virtual binder::LocalVariable *GetProperty(const util::StringView &name, [[maybe_unused]] bool searchInBase) const
    {
        for (auto *it : desc_->properties) {
            if (name == it->Name()) {
                return it;
            }
        }

        return nullptr;
    }

    void AddCallSignature(Signature *signature)
    {
        desc_->callSignatures.push_back(signature);
    }

    void AddConstructSignature(Signature *signature)
    {
        desc_->constructSignatures.push_back(signature);
    }

    void AddObjectFlag(ObjectFlags flag)
    {
        objFlag_ |= flag;
    }

    void RemoveObjectFlag(ObjectFlags flag)
    {
        flag &= ~flag;
    }

    bool HasObjectFlag(ObjectFlags flag) const
    {
        return (objFlag_ & flag) != 0;
    }

    static bool SignatureRelatedToSomeSignature(TypeRelation *relation, Signature *sourceSignature,
                                                ArenaVector<Signature *> *targetSignatures);

    static bool EachSignatureRelatedToSomeSignature(TypeRelation *relation,
                                                    const ArenaVector<Signature *> &sourceSignatures,
                                                    const ArenaVector<Signature *> &targetSignatures);

    void Identical(TypeRelation *relation, Type *other) override;
    void AssignmentTarget(TypeRelation *relation, Type *source) override;

    void checkExcessProperties(TypeRelation *relation, ObjectType *source);
    void AssignProperties(TypeRelation *relation, ObjectType *source);
    void AssignSignatures(TypeRelation *relation, ObjectType *source, bool assignCallSignatures = true);
    void AssignIndexInfo(TypeRelation *relation, ObjectType *source, bool assignNumberInfo = true);

protected:
    ObjectTypeKind kind_;
    ObjectDescriptor *desc_;
    ObjectFlags objFlag_;
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_OBJECT_TYPE_H */
