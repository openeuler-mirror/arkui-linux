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

#include "objectType.h"

#include <typescript/types/indexInfo.h>
#include <typescript/types/interfaceType.h>
#include <typescript/types/signature.h>
#include <typescript/checker.h>

namespace panda::es2panda::checker {

bool ObjectType::EachSignatureRelatedToSomeSignature(TypeRelation *relation,
                                                     const ArenaVector<Signature *> &sourceSignatures,
                                                     const ArenaVector<Signature *> &targetSignatures)
{
    ArenaVector<Signature *> targetCopy = targetSignatures;

    return std::all_of(sourceSignatures.begin(), sourceSignatures.end(), [relation, &targetCopy](Signature *source) {
        return SignatureRelatedToSomeSignature(relation, source, &targetCopy);
    });
}

bool ObjectType::SignatureRelatedToSomeSignature(TypeRelation *relation, Signature *sourceSignature,
                                                 ArenaVector<Signature *> *targetSignatures)
{
    for (auto it = targetSignatures->begin(); it != targetSignatures->end();) {
        if (relation->IsIdenticalTo(sourceSignature, *it)) {
            targetSignatures->erase(it);
            return true;
        }

        it++;
    }

    return false;
}

void ObjectType::Identical(TypeRelation *relation, Type *other)
{
    if (!other->IsObjectType() || kind_ != other->AsObjectType()->Kind()) {
        return;
    }

    ObjectType *otherObj = other->AsObjectType();

    if (desc_->properties.size() != otherObj->Properties().size() ||
        CallSignatures().size() != otherObj->CallSignatures().size() ||
        ConstructSignatures().size() != otherObj->ConstructSignatures().size() ||
        (desc_->numberIndexInfo && !otherObj->NumberIndexInfo()) ||
        (!desc_->numberIndexInfo && otherObj->NumberIndexInfo()) ||
        (desc_->stringIndexInfo && !otherObj->StringIndexInfo()) ||
        (!desc_->stringIndexInfo && otherObj->StringIndexInfo())) {
        relation->Result(false);
        return;
    }

    for (auto *it : desc_->properties) {
        binder::LocalVariable *found = otherObj->Desc()->FindProperty(it->Name());
        if (!found) {
            relation->Result(false);
            return;
        }

        relation->IsIdenticalTo(it->TsType(), found->TsType());

        if (!relation->IsTrue()) {
            return;
        }

        if (it->Flags() != found->Flags()) {
            relation->Result(false);
            return;
        }
    }

    if (!EachSignatureRelatedToSomeSignature(relation, CallSignatures(), otherObj->CallSignatures()) ||
        !EachSignatureRelatedToSomeSignature(relation, otherObj->CallSignatures(), CallSignatures())) {
        return;
    }

    if (!EachSignatureRelatedToSomeSignature(relation, ConstructSignatures(), otherObj->ConstructSignatures()) ||
        !EachSignatureRelatedToSomeSignature(relation, otherObj->ConstructSignatures(), ConstructSignatures())) {
        return;
    }

    if (desc_->numberIndexInfo) {
        relation->IsIdenticalTo(desc_->numberIndexInfo, otherObj->NumberIndexInfo());
        if (!relation->IsTrue()) {
            return;
        }
    }

    if (desc_->stringIndexInfo) {
        relation->IsIdenticalTo(desc_->stringIndexInfo, otherObj->StringIndexInfo());
        if (!relation->IsTrue()) {
            return;
        }
    }
}

void ObjectType::AssignProperties(TypeRelation *relation, ObjectType *source)
{
    const ArenaVector<binder::LocalVariable *> &targetProperties = Properties();
    IndexInfo *numberInfo = NumberIndexInfo();
    IndexInfo *stringInfo = StringIndexInfo();

    for (auto *it : targetProperties) {
        binder::LocalVariable *found = source->GetProperty(it->Name(), true);
        Type *targetType = relation->GetChecker()->GetTypeOfVariable(it);

        if (found) {
            Type *sourceType = relation->GetChecker()->GetTypeOfVariable(found);

            if (!relation->IsAssignableTo(sourceType, targetType)) {
                return;
            }

            if (found->HasFlag(binder::VariableFlags::OPTIONAL) && !it->HasFlag(binder::VariableFlags::OPTIONAL)) {
                relation->Result(false);
                return;
            }

            continue;
        }

        if (numberInfo && it->HasFlag(binder::VariableFlags::NUMERIC_NAME) &&
            !relation->IsAssignableTo(numberInfo->GetType(), targetType)) {
            return;
        }

        if (stringInfo && !relation->IsAssignableTo(stringInfo->GetType(), targetType)) {
            return;
        }

        if (!it->HasFlag(binder::VariableFlags::OPTIONAL)) {
            relation->Result(false);
            return;
        }
    }
}

void ObjectType::AssignSignatures(TypeRelation *relation, ObjectType *source, bool assignCallSignatures)
{
    ArenaVector<Signature *> targetSignatures = assignCallSignatures ? CallSignatures() : ConstructSignatures();
    ArenaVector<Signature *> sourceSignatures =
        assignCallSignatures ? source->CallSignatures() : source->ConstructSignatures();

    for (auto *targetSignature : targetSignatures) {
        bool foundCompatible = false;
        for (auto *sourceSignature : sourceSignatures) {
            targetSignature->AssignmentTarget(relation, sourceSignature);

            if (relation->IsTrue()) {
                foundCompatible = true;
                break;
            }
        }

        if (!foundCompatible) {
            relation->Result(false);
            return;
        }
    }
}

void ObjectType::AssignIndexInfo([[maybe_unused]] TypeRelation *relation, ObjectType *source, bool assignNumberInfo)
{
    IndexInfo *targetInfo = assignNumberInfo ? NumberIndexInfo() : StringIndexInfo();
    IndexInfo *sourceInfo = assignNumberInfo ? source->NumberIndexInfo() : source->StringIndexInfo();

    if (targetInfo) {
        if (sourceInfo) {
            targetInfo->AssignmentTarget(relation, sourceInfo);
            return;
        }

        for (auto *it : source->Properties()) {
            if (assignNumberInfo && !it->HasFlag(binder::VariableFlags::NUMERIC_NAME)) {
                continue;
            }

            if (!relation->IsAssignableTo(relation->GetChecker()->GetTypeOfVariable(it), targetInfo->GetType())) {
                return;
            }
        }
    }
}

void ObjectType::checkExcessProperties(TypeRelation *relation, ObjectType *source)
{
    for (auto *it : source->Properties()) {
        auto *found = GetProperty(it->Name(), true);

        if (found || (it->HasFlag(binder::VariableFlags::NUMERIC_NAME) && NumberIndexInfo()) || StringIndexInfo()) {
            continue;
        }

        relation->Result(false);
        return;
    }
}

void ObjectType::AssignmentTarget(TypeRelation *relation, Type *source)
{
    if (!source->IsObjectType()) {
        relation->Result(false);
        return;
    }

    relation->Result(true);

    ObjectType *sourceObj = source->AsObjectType();

    if (sourceObj->HasObjectFlag(ObjectFlags::CHECK_EXCESS_PROPS)) {
        checkExcessProperties(relation, sourceObj);
    }

    if (relation->IsTrue()) {
        AssignProperties(relation, sourceObj);

        if (relation->IsTrue()) {
            AssignSignatures(relation, sourceObj);

            if (relation->IsTrue()) {
                AssignSignatures(relation, sourceObj, false);

                if (relation->IsTrue()) {
                    AssignIndexInfo(relation, sourceObj);

                    if (relation->IsTrue()) {
                        AssignIndexInfo(relation, sourceObj, false);
                    }
                }
            }
        }
    }
}

}  // namespace panda::es2panda::checker
