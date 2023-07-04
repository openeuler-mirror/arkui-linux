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

#include "assemblyProgramProto.h"

namespace panda::proto {
void Program::Serialize(const panda::pandasm::Program &program, protoPanda::Program &protoProgram)
{
    protoProgram.set_lang(static_cast<uint32_t>(program.lang));

    for (const auto &[name, record] : program.record_table) {
        auto *recordMap = protoProgram.add_recordtable();
        recordMap->set_key(name);
        auto *protoRecord = recordMap->mutable_value();
        Record::Serialize(record, *protoRecord);
    }

    for (const auto &[name, func] : program.function_table) {
        auto *functionMap = protoProgram.add_functiontable();
        functionMap->set_key(name);
        auto *protoFunc = functionMap->mutable_value();
        Function::Serialize(func, *protoFunc);
    }

    for (const auto &[name, array] : program.literalarray_table) {
        auto *literalarrayMap = protoProgram.add_literalarraytable();
        literalarrayMap->set_key(name);
        auto *protoArray = literalarrayMap->mutable_value();
        LiteralArray::Serialize(array, *protoArray);
    }
    for (const auto &str : program.strings) {
        protoProgram.add_strings(str);
    }
    for (const auto &type : program.array_types) {
        auto *protoType = protoProgram.add_arraytypes();
        Type::Serialize(type, *protoType);
    }
}

void Program::Deserialize(const protoPanda::Program &protoProgram, panda::pandasm::Program &program,
                          panda::ArenaAllocator *allocator)
{
    program.lang = static_cast<panda::panda_file::SourceLang>(protoProgram.lang());

    for (const auto &recordUnit : protoProgram.recordtable()) {
        auto &name = recordUnit.key();
        auto &protoRecord = recordUnit.value();
        auto record = panda::pandasm::Record(protoRecord.name(),
                                             static_cast<panda::panda_file::SourceLang>(protoRecord.language()));
        Record::Deserialize(protoRecord, record, allocator);
        program.record_table.insert({name, std::move(record)});
    }

    for (const auto &functionUnit : protoProgram.functiontable()) {
        auto &name = functionUnit.key();
        auto &protoFunction = functionUnit.value();
        auto *function = allocator->New<panda::pandasm::Function>(protoFunction.name(),
            static_cast<panda::panda_file::SourceLang>(protoFunction.language()));
        Function::Deserialize(protoFunction, *function, allocator);
        program.function_table.insert({name, std::move(*function)});
    }

    for (const auto &literalUnit : protoProgram.literalarraytable()) {
        auto &name = literalUnit.key();
        auto &protoLiteralArray = literalUnit.value();
        panda::pandasm::LiteralArray literalArray;
        LiteralArray::Deserialize(protoLiteralArray, literalArray);
        program.literalarray_table.insert({name, std::move(literalArray)});
    }

    for (const auto &protoString : protoProgram.strings()) {
        program.strings.insert(protoString);
    }

    for (const auto &protoArrayType : protoProgram.arraytypes()) {
        auto &arrayType = Type::Deserialize(protoArrayType, allocator);
        program.array_types.insert(std::move(arrayType));
    }
}
} // panda::proto
