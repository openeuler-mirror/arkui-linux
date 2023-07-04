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

#include "literal.h"

#include <ir/expressions/literals/bigIntLiteral.h>
#include <ir/expressions/literals/booleanLiteral.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/literals/taggedLiteral.h>

namespace panda::es2panda::ir {

bool Literal::GetBoolean() const
{
    ASSERT(IsBooleanLiteral());
    return AsBooleanLiteral()->Value();
}

uint32_t Literal::GetInt() const
{
    ASSERT(IsNumberLiteral() && AsNumberLiteral()->IsInteger());
    return AsNumberLiteral()->Number<uint32_t>();
}

double Literal::GetDouble() const
{
    ASSERT(IsNumberLiteral());
    return AsNumberLiteral()->Number<double>();
}

const util::StringView &Literal::GetString() const
{
    ASSERT(IsStringLiteral());
    return AsStringLiteral()->Str();
}

const util::StringView &Literal::GetMethod() const
{
    ASSERT(IsTaggedLiteral());
    return AsTaggedLiteral()->Method();
}

uint16_t Literal::GetMethodAffiliate() const
{
    ASSERT(IsTaggedLiteral());
    return AsTaggedLiteral()->MethodAffiliate();
}

std::optional<util::StringView> Literal::GetName() const
{
    if (IsStringLiteral()) {
        return GetString();
    }
    if (IsNumberLiteral()) {
        return AsNumberLiteral()->Str();
    }
    if (IsBigIntLiteral()) {
        return AsBigIntLiteral()->Str();
    }
    if (IsTaggedLiteral()) {
        return AsTaggedLiteral()->Str();
    }
    return std::nullopt;
}

}  // namespace panda::es2panda::ir
