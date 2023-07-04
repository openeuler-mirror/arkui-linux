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

#include "typeExtractorEmitter.h"

#include <assembly-emitter.h>
#include <binder/binder.h>
#include <compiler/core/compilerContext.h>
#include <compiler/core/emitter/emitter.h>

namespace panda::es2panda::compiler {

using AnnotationData = panda::pandasm::AnnotationData;
using AnnotationElement = panda::pandasm::AnnotationElement;
using ArrayValue = panda::pandasm::ArrayValue;
using Field = panda::pandasm::Field;
using ScalarValue = panda::pandasm::ScalarValue;
using ValueType = panda::pandasm::Value::Type;
using Type = panda::pandasm::Type;

TypeExtractorEmitter::TypeExtractorEmitter(const PandaGen *pg, panda::pandasm::Function *func) : pg_(pg), func_(func)
{
    GenFunctionTypeInfo();
    if (func->name == binder::Binder::MAIN_FUNC_NAME) {
        if (pg_->Context()->TypeRecorder()->ExportType().size() > 0U) {
            GenExportTypeInfo();
        }
        if (pg_->Context()->TypeRecorder()->DeclareType().size() > 0U) {
            GenDeclareTypeInfo();
        }
    }
}

void TypeExtractorEmitter::GenFunctionTypeInfo() const
{
    std::vector<ScalarValue> typedInsns;
    typedInsns.reserve(pg_->TypedInsns().size());
    size_t index = 0U;
    for (const auto *ins : pg_->Insns()) {
        auto t = pg_->TypedInsns().find(ins);
        if (t != pg_->TypedInsns().end()) {
            const auto &insn = func_->ins[index];
            int64_t typeIndex = t->second;
            int32_t orderIndex = index;
            if (typeIndex < extractor::TypeRecorder::PRIMITIVETYPE_ANY) {
                // Decode type and order index for params
                typeIndex = -(typeIndex + 1);
                orderIndex = static_cast<int32_t>(func_->regs_num) - static_cast<int32_t>(insn.regs[1]) - 1;
            }
            if (typeIndex > extractor::TypeRecorder::PRIMITIVETYPE_ANY) {
                ScalarValue insnOrder(ScalarValue::Create<ValueType::I32>(orderIndex));
                typedInsns.emplace_back(std::move(insnOrder));
                ScalarValue insnType(ScalarValue::Create<ValueType::I32>(typeIndex));
                typedInsns.emplace_back(std::move(insnType));
#ifndef NDEBUG
                std::cout << "[LOG]" << func_->name << ": " << insn.ToString("", true, func_->regs_num) << " | "
                    << orderIndex << " | " << typeIndex << std::endl;
#endif
            }
        }
        index++;
    }

    AnnotationData funcTypeAnnotation(TypeExtractorEmitter::TYPE_ANNOTATION);
    AnnotationElement funcTypeAnnotationElement(TypeExtractorEmitter::TYPE_INSTRUCTION,
        std::make_unique<ArrayValue>(ArrayValue(ValueType::U32, typedInsns)));
    funcTypeAnnotation.AddElement(std::move(funcTypeAnnotationElement));
    func_->metadata->AddAnnotations({ funcTypeAnnotation });
}

template <bool isExport, typename M, typename F>
static void GenTypeInfo(const M &map, F &funcTypeAnnotation)
{
    std::string symbolStr;
    std::string symbolTypeStr;
    if constexpr (isExport) {
        symbolStr = TypeExtractorEmitter::EXPORTED_SYMBOLS;
        symbolTypeStr = TypeExtractorEmitter::EXPORTED_SYMBOL_TYPES;
    } else {
        symbolStr = TypeExtractorEmitter::DECLARED_SYMBOLS;
        symbolTypeStr = TypeExtractorEmitter::DECLARED_SYMBOL_TYPES;
    }

    std::vector<ScalarValue> symbolElements;
    std::vector<ScalarValue> symbolTypeElements;
    for (const auto &t : map) {
        ScalarValue symbol(ScalarValue::Create<ValueType::STRING>(t.first));
        symbolElements.emplace_back(std::move(symbol));
        ScalarValue symbolType(ScalarValue::Create<ValueType::U32>(t.second));
        symbolTypeElements.emplace_back(std::move(symbolType));
    }

    AnnotationElement funcSymbolsElements(symbolStr,
        std::make_unique<ArrayValue>(ArrayValue(ValueType::STRING, symbolElements)));
    AnnotationElement funcSymbolTypeElement(symbolTypeStr,
        std::make_unique<ArrayValue>(ArrayValue(ValueType::U32, symbolTypeElements)));

    funcTypeAnnotation.AddElement(std::move(funcSymbolsElements));
    funcTypeAnnotation.AddElement(std::move(funcSymbolTypeElement));
}

void TypeExtractorEmitter::GenExportTypeInfo() const
{
    AnnotationData funcTypeAnnotation(TypeExtractorEmitter::TYPE_ANNOTATION);
    GenTypeInfo<true>(pg_->Context()->TypeRecorder()->ExportType(), funcTypeAnnotation);
    func_->metadata->AddAnnotations({ funcTypeAnnotation });
}

void TypeExtractorEmitter::GenDeclareTypeInfo() const
{
    AnnotationData funcTypeAnnotation(TypeExtractorEmitter::TYPE_ANNOTATION);
    GenTypeInfo<false>(pg_->Context()->TypeRecorder()->DeclareType(), funcTypeAnnotation);
    func_->metadata->AddAnnotations({ funcTypeAnnotation });
}

// static
void TypeExtractorEmitter::GenTypeInfoRecord(panda::pandasm::Program *prog, bool typeFlag, int64_t typeSummaryIndex)
{
    constexpr const auto LANG_EXT = panda::pandasm::extensions::Language::ECMASCRIPT;
    auto &typeInfoRecord = prog->record_table.find(TypeExtractorEmitter::TYPE_INFO_RECORD)->second;

    auto typeFlagField = Field(LANG_EXT);
    typeFlagField.name = TypeExtractorEmitter::TYPE_FLAG;
    typeFlagField.type = Type("u8", 0);
    typeFlagField.metadata->SetValue(ScalarValue::Create<ValueType::U8>(static_cast<uint8_t>(typeFlag)));
    typeInfoRecord.field_list.emplace_back(std::move(typeFlagField));

    auto typeSummaryIndexField = Field(LANG_EXT);
    typeSummaryIndexField.name = TypeExtractorEmitter::TYPE_SUMMARY;
    typeSummaryIndexField.type = Type("u32", 0);
    typeSummaryIndexField.metadata->SetValue(ScalarValue::Create<ValueType::U32>(
        static_cast<uint32_t>(typeSummaryIndex)));
    typeInfoRecord.field_list.emplace_back(std::move(typeSummaryIndexField));
}

void TypeExtractorEmitter::GenTypeLiteralBuffers(panda::pandasm::Program *prog,
                                                 const extractor::TypeRecorder *recorder)
{
    ArenaVector<std::pair<int32_t, std::vector<Literal>>> literalBuffers(recorder->Allocator()->Adapter());
    for (const auto *buff : recorder->BuffStorage()) {
        Emitter::GenBufferLiterals(literalBuffers, buff);
    }

    for (auto &[idx, buf] : literalBuffers) {
        auto literalArrayInstance = panda::pandasm::LiteralArray(std::move(buf));
        prog->literalarray_table.emplace(std::to_string(idx), std::move(literalArrayInstance));
    }
}

}  // namespace panda::es2panda::compiler
