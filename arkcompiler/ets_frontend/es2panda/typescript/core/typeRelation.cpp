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

#include <typescript/checker.h>

#include <algorithm>

namespace panda::es2panda::checker {

bool Checker::IsAllTypesAssignableTo(Type *source, Type *target)
{
    if (source->TypeFlags() == TypeFlag::UNION) {
        auto &types = source->AsUnionType()->ConstituentTypes();

        return std::all_of(types.begin(), types.end(),
                           [this, target](auto *it) { return IsAllTypesAssignableTo(it, target); });
    }

    return relation_->IsAssignableTo(source, target);
}

bool Checker::IsTypeIdenticalTo(Type *source, Type *target)
{
    return relation_->IsIdenticalTo(source, target);
}

bool Checker::IsTypeIdenticalTo(Type *source, Type *target, const std::string &errMsg,
                                const lexer::SourcePosition &errPos)
{
    if (!IsTypeIdenticalTo(source, target)) {
        relation_->RaiseError(errMsg, errPos);
    }

    return true;
}

bool Checker::IsTypeIdenticalTo(Type *source, Type *target, std::initializer_list<TypeErrorMessageElement> list,
                                const lexer::SourcePosition &errPos)
{
    if (!IsTypeIdenticalTo(source, target)) {
        relation_->RaiseError(list, errPos);
    }

    return true;
}

bool Checker::IsTypeAssignableTo(Type *source, Type *target)
{
    return relation_->IsAssignableTo(source, target);
}

bool Checker::IsTypeAssignableTo(Type *source, Type *target, const std::string &errMsg,
                                 const lexer::SourcePosition &errPos)
{
    if (!IsTypeAssignableTo(source, target)) {
        relation_->RaiseError(errMsg, errPos);
    }

    return true;
}

bool Checker::IsTypeAssignableTo(Type *source, Type *target, std::initializer_list<TypeErrorMessageElement> list,
                                 const lexer::SourcePosition &errPos)
{
    if (!IsTypeAssignableTo(source, target)) {
        relation_->RaiseError(list, errPos);
    }

    return true;
}

bool Checker::IsTypeComparableTo(Type *source, Type *target)
{
    return relation_->IsComparableTo(source, target);
}

bool Checker::IsTypeComparableTo(Type *source, Type *target, const std::string &errMsg,
                                 const lexer::SourcePosition &errPos)
{
    if (!IsTypeComparableTo(source, target)) {
        relation_->RaiseError(errMsg, errPos);
    }

    return true;
}

bool Checker::IsTypeComparableTo(Type *source, Type *target, std::initializer_list<TypeErrorMessageElement> list,
                                 const lexer::SourcePosition &errPos)
{
    if (!IsTypeComparableTo(source, target)) {
        relation_->RaiseError(list, errPos);
    }

    return true;
}

bool Checker::AreTypesComparable(Type *source, Type *target)
{
    return IsTypeComparableTo(source, target) || IsTypeComparableTo(target, source);
}

bool Checker::IsTypeEqualityComparableTo(Type *source, Type *target)
{
    return target->HasTypeFlag(TypeFlag::NULLABLE) || IsTypeComparableTo(source, target);
}

}  // namespace panda::es2panda::checker
