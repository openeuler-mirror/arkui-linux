/**
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

#include "emitter.h"

#include <assembly-program.h>

namespace panda::es2panda::compiler {
constexpr const auto LANG_EXT = panda::pandasm::extensions::Language::ECMASCRIPT;

void Emitter::SetCommonjsField(bool isCommonjs)
{
    auto isCommonJsField = panda::pandasm::Field(LANG_EXT);
    isCommonJsField.name = "isCommonjs";
    isCommonJsField.type = panda::pandasm::Type("u8", 0);
    isCommonJsField.metadata->SetValue(
        panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(static_cast<uint8_t>(isCommonjs)));
    rec_->field_list.emplace_back(std::move(isCommonJsField));
}

void Emitter::GenCommonjsRecord() const
{
    auto commonjsRecord = panda::pandasm::Record("_CommonJsRecord", LANG_EXT);
    commonjsRecord.metadata->SetAccessFlags(panda::ACC_PUBLIC);
    auto isCommonJsField = panda::pandasm::Field(LANG_EXT);
    isCommonJsField.name = "isCommonJs";
    isCommonJsField.type = panda::pandasm::Type("u8", 0);
    isCommonJsField.metadata->SetValue(
        panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(static_cast<uint8_t>(true)));
    commonjsRecord.field_list.emplace_back(std::move(isCommonJsField));

    prog_->record_table.emplace(commonjsRecord.name, std::move(commonjsRecord));
}

}  // namespace panda::es2panda::compiler