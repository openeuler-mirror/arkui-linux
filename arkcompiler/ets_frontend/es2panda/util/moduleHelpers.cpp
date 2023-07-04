/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.Apache.Org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "moduleHelpers.h"

#include <util/helpers.h>
#include <libpandabase/utils/hash.h>
#include <protobufSnapshotGenerator.h>

namespace panda::es2panda::util {
void ModuleHelpers::CompileNpmModuleEntryList(const std::string &entriesInfo,
    panda::es2panda::CompilerOptions &options, std::map<std::string, panda::es2panda::util::ProgramCache*> &progsInfo,
    panda::ArenaAllocator *allocator)
{
    std::stringstream ss;
    if (!util::Helpers::ReadFileToBuffer(entriesInfo, ss)) {
        return;
    }

    uint32_t hash = 0;
    auto cacheFileIter = options.cacheFiles.find(entriesInfo);
    if (cacheFileIter != options.cacheFiles.end()) {
        hash = GetHash32String(reinterpret_cast<const uint8_t *>(ss.str().c_str()));

        auto cacheProgramInfo = panda::proto::ProtobufSnapshotGenerator::GetCacheContext(cacheFileIter->second,
            allocator);
        if (cacheProgramInfo != nullptr && cacheProgramInfo->hashCode == hash) {
            auto *cache = allocator->New<util::ProgramCache>(hash, std::move(cacheProgramInfo->program));
            progsInfo.insert({entriesInfo, cache});
            return;
        }
    }

    auto *prog = allocator->New<panda::pandasm::Program>();
    std::string line;
    while (getline(ss, line)) {
        std::size_t pos = line.find(":");
        std::string recordName = line.substr(0, pos);
        std::string field = line.substr(pos + 1);

        auto langExt = panda::pandasm::extensions::Language::ECMASCRIPT;
        auto entryNameField = panda::pandasm::Field(langExt);
        entryNameField.name = field;
        entryNameField.type = panda::pandasm::Type("u8", 0);
        entryNameField.metadata->SetValue(panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(
            static_cast<bool>(0)));

        panda::pandasm::Record *entryRecord = new panda::pandasm::Record(recordName, langExt);
        entryRecord->field_list.emplace_back(std::move(entryNameField));
        prog->record_table.emplace(recordName, std::move(*entryRecord));
    }

    auto *cache = allocator->New<util::ProgramCache>(hash, std::move(*prog), true);
    progsInfo.insert({entriesInfo, cache});
}
}  // namespace panda::es2panda::util
