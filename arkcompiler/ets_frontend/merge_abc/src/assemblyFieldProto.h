/**
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#ifndef MERGE_ABC_ASSEMBLY_FIELD_H
#define MERGE_ABC_ASSEMBLY_FIELD_H

#include "assemblyField.pb.h"
#include "assemblyTypeProto.h"
#include "assembly-program.h"
#include "metaProto.h"

namespace panda::proto {
class Field {
public:
    static void Serialize(const panda::pandasm::Field &field, protoPanda::Field &protoField);
    static void Deserialize(const protoPanda::Field &protoField, panda::pandasm::Field &field,
                            panda::ArenaAllocator *allocator);
};
} // panda::proto
#endif
