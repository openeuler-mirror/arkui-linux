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

#ifndef MERGE_ABC_ASSEMBLY_LITERALS_H
#define MERGE_ABC_ASSEMBLY_LITERALS_H

#include "assemblyLiterals.pb.h"
#include "assembly-program.h"

namespace panda::proto {
class VariantValue {
public:
    using LiteralValueType = std::variant<bool, uint8_t, uint16_t, uint32_t, uint64_t, float, double, std::string>;
    static void Serialize(const LiteralValueType &value, protoPanda::VariantValue &protoValue);
    static void Deserialize(const protoPanda::VariantValue &protoValue, LiteralValueType &value);
};

class LiteralArray {
public:
    static void Serialize(const panda::pandasm::LiteralArray &array, protoPanda::LiteralArray &protoArray);
    static void Deserialize(const protoPanda::LiteralArray &protoArray, panda::pandasm::LiteralArray &array);
};

class Literal {
public:
    static void Serialize(const panda::pandasm::LiteralArray::Literal &literal, protoPanda::Literal &protoLiteral);
    static void Deserialize(const protoPanda::Literal &protoLiteral, panda::pandasm::LiteralArray::Literal &literal);
};
} // panda::proto
#endif
