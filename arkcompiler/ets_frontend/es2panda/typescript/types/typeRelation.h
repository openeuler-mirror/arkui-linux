/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_RELATION_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_RELATION_H

#include <lexer/token/sourceLocation.h>
#include <lexer/token/tokenType.h>
#include <macros.h>
#include <util/ustring.h>

#include <unordered_map>
#include <variant>

namespace panda::es2panda::checker {

class Signature;
class IndexInfo;
class Type;
class Checker;

enum class RelationResult { TRUE, FALSE, UNKNOWN, MAYBE, CACHE_MISS };

enum class RelationType { COMPARABLE, ASSIGNABLE, IDENTICAL };

class RelationKey {
public:
    uint64_t sourceId;
    uint64_t targetId;
};

class RelationKeyHasher {
public:
    size_t operator()(const RelationKey &key) const noexcept
    {
        return static_cast<size_t>(key.sourceId ^ key.targetId);
    }
};

class RelationKeyComparator {
public:
    bool operator()(const RelationKey &lhs, const RelationKey &rhs) const
    {
        return lhs.sourceId == rhs.sourceId && lhs.targetId == rhs.targetId;
    }
};

class RealtionEntry {
public:
    RelationResult result;
    RelationType type;
};

using RelationMap = std::unordered_map<RelationKey, RealtionEntry, RelationKeyHasher, RelationKeyComparator>;

class RelationHolder {
public:
    RelationMap cached;
    RelationType type {};
};

class AsSrc {
public:
    explicit AsSrc(const Type *type) : type_(const_cast<Type *>(type)) {}

    const Type *GetType() const;

private:
    Type *type_;
};

using TypeErrorMessageElement = std::variant<const Type *, AsSrc, char *, util::StringView, lexer::TokenType, size_t>;

class TypeRelation {
public:
    explicit TypeRelation(Checker *checker);

    bool IsIdenticalTo(Type *source, Type *target);
    bool IsIdenticalTo(Signature *source, Signature *target);
    bool IsIdenticalTo(IndexInfo *source, IndexInfo *target);
    bool IsAssignableTo(Type *source, Type *target);
    bool IsComparableTo(Type *source, Type *target);
    void RaiseError(const std::string &errMsg, const lexer::SourcePosition &loc) const;
    void RaiseError(std::initializer_list<TypeErrorMessageElement> list, const lexer::SourcePosition &loc) const;

    void Result(bool res);
    const Checker *GetChecker() const;
    Checker *GetChecker();
    ArenaAllocator *Allocator();
    bool IsTrue() const;

private:
    RelationResult CacheLookup(const Type *source, const Type *target, const RelationHolder &holder,
                               RelationType type) const;

    Checker *checker_;
    RelationResult result_;
};  // namespace panda::es2panda::checker

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_TYPE_RELATION_H */
