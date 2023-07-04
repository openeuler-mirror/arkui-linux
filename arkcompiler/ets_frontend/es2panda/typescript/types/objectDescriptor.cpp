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

#include "objectDescriptor.h"

#include <binder/variable.h>
#include <typescript/types/indexInfo.h>
#include <typescript/types/signature.h>

namespace panda::es2panda::checker {

binder::LocalVariable *ObjectDescriptor::FindProperty(const util::StringView &name) const
{
    for (auto *it : properties) {
        if (it->Name() == name) {
            return it;
        }
    }

    return nullptr;
}

void ObjectDescriptor::Copy(ArenaAllocator *allocator, ObjectDescriptor *copiedDesc, TypeRelation *relation,
                            GlobalTypesHolder *globalTypes)
{
    // kézzel másolás
    for (auto *it : properties) {
        auto *copiedProp = it->Copy(allocator, it->Declaration());
        copiedProp->SetTsType(it->TsType()->Instantiate(allocator, relation, globalTypes));
        copiedDesc->properties.push_back(copiedProp);
    }

    for (auto *it : callSignatures) {
        copiedDesc->callSignatures.push_back(it->Copy(allocator, relation, globalTypes));
    }

    for (auto *it : constructSignatures) {
        copiedDesc->constructSignatures.push_back(it->Copy(allocator, relation, globalTypes));
    }

    if (numberIndexInfo) {
        copiedDesc->numberIndexInfo = numberIndexInfo->Copy(allocator, relation, globalTypes);
    }

    if (stringIndexInfo) {
        copiedDesc->stringIndexInfo = stringIndexInfo->Copy(allocator, relation, globalTypes);
    }
}

}  // namespace panda::es2panda::checker
