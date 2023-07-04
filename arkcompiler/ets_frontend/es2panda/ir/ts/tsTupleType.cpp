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

#include "tsTupleType.h"

#include <util/helpers.h>
#include <binder/scope.h>
#include <typescript/checker.h>
#include <typescript/types/indexInfo.h>
#include <ir/astDump.h>
#include <ir/typeNode.h>
#include <ir/expressions/identifier.h>
#include <ir/ts/tsNamedTupleMember.h>

namespace panda::es2panda::ir {

void TSTupleType::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : elementTypes_) {
        cb(it);
    }
}

void TSTupleType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSTupleType"}, {"elementTypes", elementTypes_}});
}

void TSTupleType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSTupleType::GetType(checker::Checker *checker) const
{
    auto found = checker->NodeCache().find(this);

    if (found != checker->NodeCache().end()) {
        return found->second;
    }

    checker::ObjectDescriptor *desc = checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
    checker::NamedTupleMemberPool namedMembers;
    ArenaVector<checker::ElementFlags> elementFlags(checker->Allocator()->Adapter());
    checker::ElementFlags combinedFlags = checker::ElementFlags::NO_OPTS;
    uint32_t minLength = 0;
    uint32_t index = 0;
    ArenaVector<checker::Type *> numberIndexTypes(checker->Allocator()->Adapter());
    for (auto *it : elementTypes_) {
        util::StringView memberIndex = util::Helpers::ToStringView(checker->Allocator(), index);

        auto *memberVar =
            binder::Scope::CreateVar(checker->Allocator(), memberIndex, binder::VariableFlags::PROPERTY, it);

        checker::ElementFlags memberFlag = checker::ElementFlags::NO_OPTS;
        if (it->IsTSNamedTupleMember()) {
            const ir::TSNamedTupleMember *namedMember = it->AsTSNamedTupleMember();
            checker::Type *memberType = namedMember->ElementType()->AsTypeNode()->GetType(checker);

            if (namedMember->IsOptional()) {
                memberVar->AddFlag(binder::VariableFlags::OPTIONAL);
                memberFlag = checker::ElementFlags::OPTIONAL;
            } else {
                memberFlag = checker::ElementFlags::REQUIRED;
                minLength++;
            }

            memberType->SetVariable(memberVar);
            memberVar->SetTsType(memberType);
            numberIndexTypes.push_back(memberType);
            namedMembers.insert({memberVar, namedMember->Label()->AsIdentifier()->Name()});
        } else {
            checker::Type *memberType = it->AsTypeNode()->GetType(checker);
            memberType->SetVariable(memberVar);
            memberVar->SetTsType(memberType);
            memberFlag = checker::ElementFlags::REQUIRED;
            numberIndexTypes.push_back(memberType);
            minLength++;
        }

        combinedFlags |= memberFlag;

        elementFlags.push_back(memberFlag);
        desc->properties.push_back(memberVar);
        index++;
    }

    uint32_t fixedLength = desc->properties.size();

    checker::Type *numberIndexType = nullptr;

    if (numberIndexTypes.empty()) {
        numberIndexType = checker->GlobalNeverType();
    } else if (numberIndexTypes.size() == 1) {
        numberIndexType = numberIndexTypes[0];
    } else {
        numberIndexType = checker->CreateUnionType(std::move(numberIndexTypes));
    }

    desc->numberIndexInfo = checker->Allocator()->New<checker::IndexInfo>(numberIndexType, "x", false);

    checker::Type *tupleType = checker->CreateTupleType(desc, std::move(elementFlags), combinedFlags, minLength,
                                                        fixedLength, false, std::move(namedMembers));

    checker->NodeCache().insert({this, tupleType});
    return tupleType;
}

checker::Type *TSTupleType::Check(checker::Checker *checker) const
{
    for (const auto *it : elementTypes_) {
        it->Check(checker);
    }

    GetType(checker);
    return nullptr;
}

void TSTupleType::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    for (auto iter = elementTypes_.begin(); iter != elementTypes_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsExpression();
    }
}

}  // namespace panda::es2panda::ir
