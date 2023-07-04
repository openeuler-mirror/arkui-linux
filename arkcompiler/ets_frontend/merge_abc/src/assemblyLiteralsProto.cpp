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

#include "assemblyLiteralsProto.h"

namespace panda::proto {
void VariantValue::Serialize(const LiteralValueType &value, protoPanda::VariantValue &protoValue)
{
    const auto type = static_cast<protoPanda::VariantValue_VariantValueType>(value.index());
    protoValue.set_type(type);
    switch (type) {
        case protoPanda::VariantValue_VariantValueType_BOOL: {
            protoValue.set_valueint(static_cast<uint64_t>(std::get<bool>(value)));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U8: {
            protoValue.set_valueint(static_cast<uint64_t>(std::get<uint8_t>(value)));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U16: {
            protoValue.set_valueint(static_cast<uint64_t>(std::get<uint16_t>(value)));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U32: {
            protoValue.set_valueint(static_cast<uint64_t>(std::get<uint32_t>(value)));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U64: {
            protoValue.set_valueint(std::get<uint64_t>(value));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_F32: {
            protoValue.set_valuefloat(std::get<float>(value));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_F64: {
            protoValue.set_valuedouble(std::get<double>(value));
            return;
        }
        case protoPanda::VariantValue_VariantValueType_STRING: {
            protoValue.set_valuestr(std::get<std::string>(value));
            return;
        }
        default:
            UNREACHABLE();
    }
}

void VariantValue::Deserialize(const protoPanda::VariantValue &protoValue, LiteralValueType &value)
{
    auto type = protoValue.type();
    switch (type) {
        case protoPanda::VariantValue_VariantValueType_BOOL: {
            value = static_cast<bool>(protoValue.valueint());
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U8: {
            value = static_cast<uint8_t>(protoValue.valueint());
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U16: {
            value = static_cast<uint16_t>(protoValue.valueint());
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U32: {
            value = static_cast<uint32_t>(protoValue.valueint());
            return;
        }
        case protoPanda::VariantValue_VariantValueType_U64: {
            value = static_cast<uint64_t>(protoValue.valueint());
            return;
        }
        case protoPanda::VariantValue_VariantValueType_F32: {
            value = protoValue.valuefloat();
            return;
        }
        case protoPanda::VariantValue_VariantValueType_F64: {
            value = protoValue.valuedouble();
            return;
        }
        case protoPanda::VariantValue_VariantValueType_STRING: {
            value = protoValue.valuestr();
            return;
        }
        default:
            UNREACHABLE();
    }
}

void LiteralArray::Serialize(const panda::pandasm::LiteralArray &array, protoPanda::LiteralArray &protoArray)
{
    for (const auto &literal : array.literals_) {
        auto *protoLiteral = protoArray.add_literals();
        Literal::Serialize(literal, *protoLiteral);
    }
}

void LiteralArray::Deserialize(const protoPanda::LiteralArray &protoArray, panda::pandasm::LiteralArray &array)
{
    array.literals_.reserve(protoArray.literals_size());
    for (const auto &protoLiteral : protoArray.literals()) {
        panda::pandasm::LiteralArray::Literal literal;
        Literal::Deserialize(protoLiteral, literal);
        array.literals_.emplace_back(literal);
    }
}

void Literal::Serialize(const panda::pandasm::LiteralArray::Literal &literal, protoPanda::Literal &protoLiteral)
{
    protoLiteral.set_tag(static_cast<uint32_t>(literal.tag_));
    auto *value = protoLiteral.mutable_value();
    VariantValue::Serialize(literal.value_, *value);
}

void Literal::Deserialize(const protoPanda::Literal &protoLiteral, panda::pandasm::LiteralArray::Literal &literal)
{
    literal.tag_ = static_cast<panda::panda_file::LiteralTag>(protoLiteral.tag());
    VariantValue::Deserialize(protoLiteral.value(), literal.value_);
}
} // panda::proto
