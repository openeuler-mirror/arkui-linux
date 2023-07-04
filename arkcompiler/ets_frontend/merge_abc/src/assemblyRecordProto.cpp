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

#include "assemblyRecordProto.h"

namespace panda::proto {
void Record::Serialize(const panda::pandasm::Record &record, protoPanda::Record &protoRecord)
{
    protoRecord.set_name(record.name);
    protoRecord.set_conflict(record.conflict);
    protoRecord.set_language(static_cast<uint32_t>(record.language));
    auto *proto_record_meta = protoRecord.mutable_metadata();
    RecordMetadata::Serialize(*record.metadata, *proto_record_meta);

    for (const auto &field : record.field_list) {
        auto *proto_field = protoRecord.add_fieldlist();
        Field::Serialize(field, *proto_field);
    }

    protoRecord.set_paramsnum(record.params_num);
    protoRecord.set_bodypresence(record.body_presence);
    protoRecord.set_sourcefile(record.source_file);

    const auto &location = record.file_location;
    if (location.has_value()) {
        auto *proto_location = protoRecord.mutable_filelocation();
        FileLocation::Serialize(location.value(), *proto_location);
    }
}

void Record::Deserialize(const protoPanda::Record &protoRecord, panda::pandasm::Record &record,
                         panda::ArenaAllocator *allocator)
{
    record.conflict = protoRecord.conflict();
    RecordMetadata::Deserialize(protoRecord.metadata(), record.metadata, allocator);
    record.field_list.reserve(protoRecord.fieldlist_size());
    for (const auto &protoField : protoRecord.fieldlist()) {
        auto recordField = panda::pandasm::Field(panda::panda_file::SourceLang::ECMASCRIPT);
        Field::Deserialize(protoField, recordField, allocator);
        record.field_list.emplace_back(std::move(recordField));
    }
    record.params_num = protoRecord.paramsnum();
    record.body_presence = protoRecord.bodypresence();
    record.source_file = protoRecord.sourcefile();
    if (protoRecord.has_filelocation()) {
        const auto &protoLocation = protoRecord.filelocation();
        FileLocation::Deserialize(protoLocation, record.file_location);
    }
}
} // panda::proto
