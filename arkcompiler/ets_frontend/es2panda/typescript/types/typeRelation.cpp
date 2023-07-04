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

#include "typeRelation.h"

#include <typescript/checker.h>
#include <typescript/types/indexInfo.h>
#include <typescript/types/signature.h>

namespace panda::es2panda::checker {

const Type *AsSrc::GetType() const
{
    return type_;
}

TypeRelation::TypeRelation(Checker *checker) : checker_(checker), result_(RelationResult::FALSE) {}

bool TypeRelation::IsTrue() const
{
    return result_ == RelationResult::TRUE;
}

const Checker *TypeRelation::GetChecker() const
{
    return checker_;
}

Checker *TypeRelation::GetChecker()
{
    return checker_;
}

ArenaAllocator *TypeRelation::Allocator()
{
    return checker_->Allocator();
}

RelationResult TypeRelation::CacheLookup(const Type *source, const Type *target, const RelationHolder &holder,
                                         RelationType type) const
{
    if (result_ == RelationResult::CACHE_MISS) {
        return result_;
    }

    RelationKey relationKey {source->Id(), target->Id()};
    auto res = holder.cached.find(relationKey);
    if (res == holder.cached.end()) {
        return RelationResult::CACHE_MISS;
    }

    if (res->second.type >= type && res->second.result == RelationResult::TRUE) {
        return RelationResult::TRUE;
    }

    if (res->second.type <= type && res->second.result == RelationResult::FALSE) {
        return RelationResult::FALSE;
    }

    return RelationResult::CACHE_MISS;
}

bool TypeRelation::IsIdenticalTo(Type *source, Type *target)
{
    if (source == target) {
        Result(true);
        return true;
    }

    result_ = CacheLookup(source, target, checker_->IdenticalResults(), RelationType::IDENTICAL);
    if (result_ == RelationResult::CACHE_MISS) {
        checker_->ResolveStructuredTypeMembers(source);
        checker_->ResolveStructuredTypeMembers(target);
        result_ = RelationResult::FALSE;
        target->Identical(this, source);
        checker_->IdenticalResults().cached.insert({{source->Id(), target->Id()}, {result_, RelationType::IDENTICAL}});
    }

    return result_ == RelationResult::TRUE;
}

bool TypeRelation::IsIdenticalTo(Signature *source, Signature *target)
{
    if (source == target) {
        Result(true);
        return true;
    }

    result_ = RelationResult::FALSE;
    target->Identical(this, source);

    return result_ == RelationResult::TRUE;
}

bool TypeRelation::IsIdenticalTo(IndexInfo *source, IndexInfo *target)
{
    if (source == target) {
        Result(true);
        return true;
    }

    result_ = RelationResult::FALSE;
    target->Identical(this, source);

    return result_ == RelationResult::TRUE;
}

bool TypeRelation::IsAssignableTo(Type *source, Type *target)
{
    result_ = CacheLookup(source, target, checker_->AssignableResults(), RelationType::ASSIGNABLE);
    if (result_ == RelationResult::CACHE_MISS) {
        if (IsIdenticalTo(source, target)) {
            return true;
        }

        result_ = RelationResult::FALSE;

        if (!source->AssignmentSource(this, target)) {
            target->AssignmentTarget(this, source);
        }

        checker_->AssignableResults().cached.insert(
            {{source->Id(), target->Id()}, {result_, RelationType::ASSIGNABLE}});
    }

    return result_ == RelationResult::TRUE;
}

bool TypeRelation::IsComparableTo(Type *source, Type *target)
{
    result_ = CacheLookup(source, target, checker_->ComparableResults(), RelationType::COMPARABLE);

    if (result_ == RelationResult::CACHE_MISS) {
        if (IsAssignableTo(source, target)) {
            return true;
        }

        result_ = RelationResult::FALSE;
        target->Compare(this, source);
        checker_->ComparableResults().cached.insert(
            {{source->Id(), target->Id()}, {result_, RelationType::COMPARABLE}});
    }

    return result_ == RelationResult::TRUE;
}

void TypeRelation::RaiseError(const std::string &errMsg, const lexer::SourcePosition &loc) const
{
    checker_->ThrowTypeError(errMsg, loc);
}

void TypeRelation::RaiseError(std::initializer_list<TypeErrorMessageElement> list,
                              const lexer::SourcePosition &loc) const
{
    checker_->ThrowTypeError(list, loc);
}

void TypeRelation::Result(bool res)
{
    result_ = res ? RelationResult::TRUE : RelationResult::FALSE;
}

}  // namespace panda::es2panda::checker
