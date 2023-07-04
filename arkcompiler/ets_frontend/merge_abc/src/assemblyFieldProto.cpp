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

#include "assemblyFieldProto.h"

namespace panda::proto {
void Field::Serialize(const panda::pandasm::Field &field, protoPanda::Field &protoField)
{
    auto *protoType = protoField.mutable_type();
    Type::Serialize(field.type, *protoType);
    protoField.set_name(field.name);
    auto *protoFieldmeta = protoField.mutable_metadata();
    FieldMetadata::Serialize(*field.metadata, *protoFieldmeta);
    protoField.set_lineofdef(field.line_of_def);
    protoField.set_wholeline(field.whole_line);
    protoField.set_boundleft(field.bound_left);
    protoField.set_boundright(field.bound_right);
    protoField.set_isdefined(field.is_defined);
}

void Field::Deserialize(const protoPanda::Field &protoField, panda::pandasm::Field &field,
                        panda::ArenaAllocator *allocator)
{
    field.type = Type::Deserialize(protoField.type(), allocator);
    field.name = protoField.name();
    FieldMetadata::Deserialize(protoField.metadata(), field.metadata, allocator);
    field.line_of_def = protoField.lineofdef();
    field.whole_line = protoField.wholeline();
    field.bound_left = protoField.boundleft();
    field.bound_right = protoField.boundright();
    field.is_defined = protoField.isdefined();
}
} // panda::proto
