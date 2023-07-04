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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_OBJECT_DESCRIPTOR_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_OBJECT_DESCRIPTOR_H

#include <macros.h>
#include <util/ustring.h>
#include <vector>

namespace panda::es2panda::binder {
class LocalVariable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::checker {

class Signature;
class IndexInfo;
class Type;
class TypeRelation;
class GlobalTypesHolder;

class ObjectDescriptor {
public:
    explicit ObjectDescriptor(ArenaAllocator *allocator)
        : properties(allocator->Adapter()),
          callSignatures(allocator->Adapter()),
          constructSignatures(allocator->Adapter())
    {
    }

    ~ObjectDescriptor() = default;
    NO_COPY_SEMANTIC(ObjectDescriptor);
    NO_MOVE_SEMANTIC(ObjectDescriptor);

    binder::LocalVariable *FindProperty(const util::StringView &name) const;
    void Copy(ArenaAllocator *allocator, ObjectDescriptor *copiedDesc, TypeRelation *relation,
              GlobalTypesHolder *globalTypes);

    ArenaVector<binder::LocalVariable *> properties;
    ArenaVector<Signature *> callSignatures;
    ArenaVector<Signature *> constructSignatures;
    IndexInfo *stringIndexInfo {};
    IndexInfo *numberIndexInfo {};
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_OBJECT_DESCRIPTOR_H */
