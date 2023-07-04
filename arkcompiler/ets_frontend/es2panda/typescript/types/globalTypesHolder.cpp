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

#include "globalTypesHolder.h"

#include <typescript/types/numberType.h>
#include <typescript/types/anyType.h>
#include <typescript/types/stringType.h>
#include <typescript/types/symbolType.h>
#include <typescript/types/booleanType.h>
#include <typescript/types/voidType.h>
#include <typescript/types/nullType.h>
#include <typescript/types/undefinedType.h>
#include <typescript/types/unknownType.h>
#include <typescript/types/neverType.h>
#include <typescript/types/nonPrimitiveType.h>
#include <typescript/types/bigintType.h>
#include <typescript/types/booleanLiteralType.h>
#include <typescript/types/bigintLiteralType.h>
#include <typescript/types/numberLiteralType.h>
#include <typescript/types/stringLiteralType.h>
#include <typescript/types/tupleType.h>
#include <typescript/types/objectLiteralType.h>
#include <typescript/types/unionType.h>

namespace panda::es2panda::checker {

GlobalTypesHolder::GlobalTypesHolder(ArenaAllocator *allocator)
{
    globalTypes_[static_cast<size_t>(GlobalTypeId::NUMBER)] = allocator->New<NumberType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::ANY)] = allocator->New<AnyType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::STRING)] = allocator->New<StringType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::SYMBOL)] = allocator->New<SymbolType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::BOOLEAN)] = allocator->New<BooleanType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::VOID)] = allocator->New<VoidType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::NULL_ID)] = allocator->New<NullType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::UNDEFINED)] = allocator->New<UndefinedType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::UNKNOWN)] = allocator->New<UnknownType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::NEVER)] = allocator->New<NeverType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::NON_PRIMITIVE)] = allocator->New<NonPrimitiveType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::BIGINT)] = allocator->New<BigintType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::FALSE_ID)] = allocator->New<BooleanLiteralType>(false);
    globalTypes_[static_cast<size_t>(GlobalTypeId::TRUE_ID)] = allocator->New<BooleanLiteralType>(true);
    globalTypes_[static_cast<size_t>(GlobalTypeId::NUMBER_OR_BIGINT)] =
        allocator->New<UnionType>(allocator, std::initializer_list<Type *> {GlobalNumberType(), GlobalBigintType()});
    globalTypes_[static_cast<size_t>(GlobalTypeId::STRING_OR_NUMBER)] =
        allocator->New<UnionType>(allocator, std::initializer_list<Type *> {GlobalStringType(), GlobalNumberType()});
    globalTypes_[static_cast<size_t>(GlobalTypeId::ZERO)] = allocator->New<NumberLiteralType>(0);
    globalTypes_[static_cast<size_t>(GlobalTypeId::EMPTY_STRING)] = allocator->New<StringLiteralType>("");
    globalTypes_[static_cast<size_t>(GlobalTypeId::ZERO_BIGINT)] = allocator->New<BigintLiteralType>("0n", false);
    globalTypes_[static_cast<size_t>(GlobalTypeId::PRIMITIVE)] = allocator->New<UnionType>(
        allocator,
        std::initializer_list<Type *> {GlobalNumberType(), GlobalStringType(), GlobalBigintType(), GlobalBooleanType(),
                                       GlobalVoidType(), GlobalUndefinedType(), GlobalNullType(), GlobalSymbolType()});
    globalTypes_[static_cast<size_t>(GlobalTypeId::EMPTY_TUPLE)] = allocator->New<TupleType>(allocator);
    globalTypes_[static_cast<size_t>(GlobalTypeId::EMPTY_OBJECT)] = allocator->New<ObjectLiteralType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::RESOLVING_RETURN_TYPE)] = allocator->New<AnyType>();
    globalTypes_[static_cast<size_t>(GlobalTypeId::ERROR_TYPE)] = allocator->New<AnyType>();
}

Type *GlobalTypesHolder::GlobalNumberType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::NUMBER));
}

Type *GlobalTypesHolder::GlobalAnyType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::ANY));
}

Type *GlobalTypesHolder::GlobalStringType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::STRING));
}

Type *GlobalTypesHolder::GlobalSymbolType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::SYMBOL));
}

Type *GlobalTypesHolder::GlobalBooleanType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::BOOLEAN));
}

Type *GlobalTypesHolder::GlobalVoidType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::VOID));
}

Type *GlobalTypesHolder::GlobalNullType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::NULL_ID));
}

Type *GlobalTypesHolder::GlobalUndefinedType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::UNDEFINED));
}

Type *GlobalTypesHolder::GlobalUnknownType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::UNKNOWN));
}

Type *GlobalTypesHolder::GlobalNeverType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::NEVER));
}

Type *GlobalTypesHolder::GlobalNonPrimitiveType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::NON_PRIMITIVE));
}

Type *GlobalTypesHolder::GlobalBigintType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::BIGINT));
}

Type *GlobalTypesHolder::GlobalFalseType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::FALSE_ID));
}

Type *GlobalTypesHolder::GlobalTrueType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::TRUE_ID));
}

Type *GlobalTypesHolder::GlobalNumberOrBigintType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::NUMBER_OR_BIGINT));
}

Type *GlobalTypesHolder::GlobalStringOrNumberType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::STRING_OR_NUMBER));
}

Type *GlobalTypesHolder::GlobalZeroType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::ZERO));
}

Type *GlobalTypesHolder::GlobalEmptyStringType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::EMPTY_STRING));
}

Type *GlobalTypesHolder::GlobalZeroBigintType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::ZERO_BIGINT));
}

Type *GlobalTypesHolder::GlobalPrimitiveType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::PRIMITIVE));
}

Type *GlobalTypesHolder::GlobalEmptyTupleType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::EMPTY_TUPLE));
}

Type *GlobalTypesHolder::GlobalEmptyObjectType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::EMPTY_OBJECT));
}

Type *GlobalTypesHolder::GlobalResolvingReturnType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::RESOLVING_RETURN_TYPE));
}

Type *GlobalTypesHolder::GlobalErrorType()
{
    return globalTypes_.at(static_cast<size_t>(GlobalTypeId::ERROR_TYPE));
}

}  // namespace panda::es2panda::checker
