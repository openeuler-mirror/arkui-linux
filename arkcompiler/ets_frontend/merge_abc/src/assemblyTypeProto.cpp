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

#include "assemblyTypeProto.h"

namespace panda::proto {
void Type::Serialize(const panda::pandasm::Type type, protoPanda::Type &protoType)
{
    protoType.set_componentname(type.GetComponentName());
    protoType.set_rank(type.GetRank());
    protoType.set_name(type.GetName());
    protoType.set_typeid_(static_cast<uint32_t>(type.GetId()));
}

panda::pandasm::Type &Type::Deserialize(const protoPanda::Type &protoType,
                                        panda::ArenaAllocator *allocator)
{
    auto *type = allocator->New<panda::pandasm::Type>(protoType.componentname(), protoType.rank());
    return *type;
}
} // panda::proto
