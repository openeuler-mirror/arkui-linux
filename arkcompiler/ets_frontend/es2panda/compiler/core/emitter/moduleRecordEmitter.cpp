/*
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

#include "moduleRecordEmitter.h"

namespace panda::es2panda::compiler {
void ModuleRecordEmitter::GenModuleRequests()
{
    ASSERT(moduleRecord_ != nullptr);
    auto &moduleRequests = moduleRecord_->GetModuleRequests();
    panda::pandasm::LiteralArray::Literal moduleSize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(moduleRequests.size())};
    buffer_.emplace_back(moduleSize);
    for (auto request : moduleRequests) {
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = request.Mutf8()};
        buffer_.emplace_back(moduleRequest);
    }
}

void ModuleRecordEmitter::GenRegularImportEntries()
{
    ASSERT(moduleRecord_ != nullptr);
    auto &regularImportEntries = moduleRecord_->GetRegularImportEntries();
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER,
        .value_ = static_cast<uint32_t>(regularImportEntries.size())};
    buffer_.emplace_back(entrySize);
    for (auto it = regularImportEntries.begin(); it != regularImportEntries.end(); ++it) {
        auto *entry = it->second;
        panda::pandasm::LiteralArray::Literal localName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->localName_.Mutf8()};
        buffer_.emplace_back(localName);
        panda::pandasm::LiteralArray::Literal importName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->importName_.Mutf8()};
        buffer_.emplace_back(importName);
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry->moduleRequestIdx_)};
        buffer_.emplace_back(moduleRequest);
    }
}

void ModuleRecordEmitter::GenNamespaceImportEntries()
{
    ASSERT(moduleRecord_ != nullptr);
    auto &namespaceImportEntries = moduleRecord_->GetNamespaceImportEntries();
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER,
        .value_ = static_cast<uint32_t>(namespaceImportEntries.size())};
    buffer_.emplace_back(entrySize);
    for (const auto *entry : namespaceImportEntries) {
        panda::pandasm::LiteralArray::Literal localName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->localName_.Mutf8()};
        buffer_.emplace_back(localName);
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry->moduleRequestIdx_)};
        buffer_.emplace_back(moduleRequest);
    }
}

void ModuleRecordEmitter::GenLocalExportEntries()
{
    ASSERT(moduleRecord_ != nullptr);
    auto &localExportEntries = moduleRecord_->GetLocalExportEntries();
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(localExportEntries.size())};
    buffer_.emplace_back(entrySize);
    for (auto it = localExportEntries.begin(); it != localExportEntries.end(); ++it) {
        auto *entry = it->second;
        panda::pandasm::LiteralArray::Literal localName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->localName_.Mutf8()};
        buffer_.emplace_back(localName);
        panda::pandasm::LiteralArray::Literal exportName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->exportName_.Mutf8()};
        buffer_.emplace_back(exportName);
    }
}

void ModuleRecordEmitter::GenIndirectExportEntries()
{
    ASSERT(moduleRecord_ != nullptr);
    auto &indirectExportEntries = moduleRecord_->GetIndirectExportEntries();
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(indirectExportEntries.size())};
    buffer_.emplace_back(entrySize);
    for (const auto *entry : indirectExportEntries) {
        panda::pandasm::LiteralArray::Literal exportName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->exportName_.Mutf8()};
        buffer_.emplace_back(exportName);
        panda::pandasm::LiteralArray::Literal importName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = entry->importName_.Mutf8()};
        buffer_.emplace_back(importName);
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry->moduleRequestIdx_)};
        buffer_.emplace_back(moduleRequest);
    }
}

void ModuleRecordEmitter::GenStarExportEntries()
{
    ASSERT(moduleRecord_ != nullptr);
    auto &starExportEntries = moduleRecord_->GetStarExportEntries();
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(starExportEntries.size())};
    buffer_.emplace_back(entrySize);
    for (const auto *entry : starExportEntries) {
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry->moduleRequestIdx_)};
        buffer_.emplace_back(moduleRequest);
    }
}

void ModuleRecordEmitter::Generate()
{
    GenModuleRequests();
    GenRegularImportEntries();
    GenNamespaceImportEntries();
    GenLocalExportEntries();
    GenIndirectExportEntries();
    GenStarExportEntries();
}
}  // namespace panda::es2panda::compiler
