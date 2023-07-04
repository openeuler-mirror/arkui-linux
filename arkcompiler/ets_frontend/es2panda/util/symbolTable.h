/*
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

#ifndef ES2PANDA_UTIL_SYMBOL_TABLE_H
#define ES2PANDA_UTIL_SYMBOL_TABLE_H

#include <libpandabase/utils/arena_containers.h>

#include <mutex>

namespace panda::es2panda::util {
class SymbolTable {
public:
    static const std::string FIRST_LEVEL_SEPERATOR;
    static const std::string SECOND_LEVEL_SEPERATOR;

    struct OriginFunctionInfo {
        std::string funcName;
        std::string funcInternalName;
        std::string funcHash;
        ArenaMap<uint32_t, std::pair<std::string, int>> lexenv;  // lexenv: <slot, <name, type>>
        ArenaMap<std::string, std::string> classHash;

        explicit OriginFunctionInfo(ArenaAllocator *allocator) : lexenv(allocator->Adapter()),
                                                                 classHash(allocator->Adapter()) {}
    };

    SymbolTable(const std::string &inputSymbolTable, const std::string &dumpSymbolTable)
        : symbolTable_(inputSymbolTable), dumpSymbolTable_(dumpSymbolTable),
        allocator_(SpaceType::SPACE_TYPE_COMPILER, nullptr, true),
        originFunctionInfo_(allocator_.Adapter()),
        originModuleInfo_(allocator_.Adapter()) {}

    bool Initialize();
    void WriteSymbolTable(const std::string &content);
    ArenaUnorderedMap<std::string, OriginFunctionInfo> *GetOriginFunctionInfo()
    {
        return &originFunctionInfo_;
    }

    ArenaUnorderedMap<std::string, std::string> *GetOriginModuleInfo()
    {
        return &originModuleInfo_;
    }

private:
    bool ReadSymbolTable(const std::string &symbolTable);
    std::vector<std::string_view> GetStringItems(std::string_view input, const std::string &separator);

    std::mutex m_;
    std::string symbolTable_;
    std::string dumpSymbolTable_;
    ArenaAllocator allocator_;
    ArenaUnorderedMap<std::string, OriginFunctionInfo> originFunctionInfo_;
    ArenaUnorderedMap<std::string, std::string> originModuleInfo_;
};
}  // namespace panda::es2panda::util

#endif  // ES2PANDA_UTIL_SYMBOL_TABLE_H