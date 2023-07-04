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

#include "assemblyFunctionProto.h"
#include "libpandafile/file_items.h"

namespace panda::proto {
void CatchBlock::Serialize(const panda::pandasm::Function::CatchBlock &block, protoPanda::CatchBlock &protoBlock)
{
    protoBlock.set_wholeline(block.whole_line);
    protoBlock.set_exceptionrecord(block.exception_record);
    protoBlock.set_trybeginlabel(block.try_begin_label);
    protoBlock.set_tryendlabel(block.try_end_label);
    protoBlock.set_catchbeginlabel(block.catch_begin_label);
    protoBlock.set_catchendlabel(block.catch_end_label);
}

void CatchBlock::Deserialize(const protoPanda::CatchBlock &protoBlock, panda::pandasm::Function::CatchBlock &block)
{
    block.whole_line = protoBlock.wholeline();
    block.exception_record = protoBlock.exceptionrecord();
    block.try_begin_label = protoBlock.trybeginlabel();
    block.try_end_label = protoBlock.tryendlabel();
    block.catch_begin_label = protoBlock.catchbeginlabel();
    block.catch_end_label = protoBlock.catchendlabel();
}

void Parameter::Serialize(const panda::pandasm::Function::Parameter &param, protoPanda::Parameter &protoParam)
{
    auto *type = protoParam.mutable_type();
    Type::Serialize(param.type, *type);
    auto *metadata = protoParam.mutable_metadata();
    ParamMetadata::Serialize(*(param.metadata), *metadata);
}

void Parameter::Deserialize(const protoPanda::Parameter &protoParam, panda::pandasm::Function::Parameter &param,
                            panda::ArenaAllocator *allocator)
{
    ParamMetadata::Deserialize(protoParam.metadata(), param.metadata, allocator);
}

void Function::Serialize(const panda::pandasm::Function &function, protoPanda::Function &protoFunction)
{
    protoFunction.set_name(function.name);
    protoFunction.set_language(static_cast<uint32_t>(function.language));

    auto *protoFuncMeta = protoFunction.mutable_metadata();
    FunctionMetadata::Serialize(*function.metadata, *protoFuncMeta);

    for (const auto &[name, label] : function.label_table) {
        auto *labelMap = protoFunction.add_labeltable();
        labelMap->set_key(name);
        auto *protoLabel = labelMap->mutable_value();
        Label::Serialize(label, *protoLabel);
    }

    for (const auto &insn : function.ins) {
        auto *protoIns = protoFunction.add_ins();
        Ins::Serialize(insn, *protoIns);
    }

    for (const auto &debug : function.local_variable_debug) {
        auto *protoDebug = protoFunction.add_localvariabledebug();
        LocalVariable::Serialize(debug, *protoDebug);
    }

    protoFunction.set_sourcefile(function.source_file);
    protoFunction.set_sourcecode(function.source_code);

    for (const auto &block : function.catch_blocks) {
        auto *protoBlock = protoFunction.add_catchblocks();
        CatchBlock::Serialize(block, *protoBlock);
    }

    protoFunction.set_valueoffirstparam(function.value_of_first_param);
    protoFunction.set_regsnum(function.regs_num);

    for (const auto &param : function.params) {
        auto *protoParam = protoFunction.add_params();
        Parameter::Serialize(param, *protoParam);
    }

    protoFunction.set_bodypresence(function.body_presence);

    auto *protoReturnType = protoFunction.mutable_returntype();
    Type::Serialize(function.return_type, *protoReturnType);

    auto *protoBodyLocation = protoFunction.mutable_bodylocation();
    SourceLocation::Serialize(function.body_location, *protoBodyLocation);

    const auto &fileLocation = function.file_location;
    if (fileLocation.has_value()) {
        auto *protoFileLocation = protoFunction.mutable_filelocation();
        FileLocation::Serialize(fileLocation.value(), *protoFileLocation);
    }
    protoFunction.set_function_kind(static_cast<uint8_t>(function.function_kind));
    protoFunction.set_slotsnum(function.slots_num);
}

void Function::Deserialize(const protoPanda::Function &protoFunction, panda::pandasm::Function &function,
                           panda::ArenaAllocator *allocator)
{
    FunctionMetadata::Deserialize(protoFunction.metadata(), function.metadata, allocator);
    function.label_table.reserve(protoFunction.labeltable_size());
    for (const auto &labelUnit : protoFunction.labeltable()) {
        auto &name = labelUnit.key();
        auto &protoLabel = labelUnit.value();
        panda::pandasm::Label label(name);
        Label::Deserialize(protoLabel, label);
        function.label_table.insert({name, label});
    }

    function.ins.reserve(protoFunction.ins_size());
    for (const auto &protoIns : protoFunction.ins()) {
        panda::pandasm::Ins ins;
        Ins::Deserialize(protoIns, ins);
        function.ins.emplace_back(std::move(ins));
    }

    function.local_variable_debug.reserve(protoFunction.localvariabledebug_size());
    for (const auto &protoLocalVariable : protoFunction.localvariabledebug()) {
        panda::pandasm::debuginfo::LocalVariable localVariable;
        LocalVariable::Deserialize(protoLocalVariable, localVariable);
        function.local_variable_debug.emplace_back(std::move(localVariable));
    }

    function.source_file = protoFunction.sourcefile();
    function.source_code = protoFunction.sourcecode();

    function.catch_blocks.reserve(protoFunction.catchblocks_size());
    for (const auto &protoCatchBlock : protoFunction.catchblocks()) {
        auto *catchBlock = allocator->New<panda::pandasm::Function::CatchBlock>();
        CatchBlock::Deserialize(protoCatchBlock, *catchBlock);
        function.catch_blocks.emplace_back(std::move(*catchBlock));
    }

    function.value_of_first_param = protoFunction.valueoffirstparam();
    function.regs_num = protoFunction.regsnum();

    function.params.reserve(protoFunction.params_size());
    for (const auto &protoParam : protoFunction.params()) {
        auto &paramType = Type::Deserialize(protoParam.type(), allocator);
        panda::pandasm::Function::Parameter param(paramType, panda::panda_file::SourceLang::ECMASCRIPT);
        Parameter::Deserialize(protoParam, param, allocator);
        function.params.emplace_back(std::move(param));
    }

    function.body_presence = protoFunction.bodypresence();
    function.return_type = Type::Deserialize(protoFunction.returntype(), allocator);
    SourceLocation::Deserialize(protoFunction.bodylocation(), function.body_location);

    if (protoFunction.has_filelocation()) {
        FileLocation::Deserialize(protoFunction.filelocation(), function.file_location);
    }
    function.SetFunctionKind(static_cast<panda::panda_file::FunctionKind>(protoFunction.function_kind()));
    function.SetSlotsNum(protoFunction.slotsnum());
}
} // panda::proto
