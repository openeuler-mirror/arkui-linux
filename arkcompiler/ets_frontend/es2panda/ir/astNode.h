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

#ifndef ES2PANDA_IR_ASTNODE_H
#define ES2PANDA_IR_ASTNODE_H

#include <functional>
#include <macros.h>

#include <binder/binder.h>
#include <binder/scope.h>
#include <ir/astNodeMapping.h>
#include <lexer/token/sourceLocation.h>
#include <util/enumbitops.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class AstNode;

using NodeTraverser = std::function<void(AstNode *)>;

using UpdateNodes = std::variant<AstNode *, std::vector<AstNode *>>;
using NodeUpdater = std::function<UpdateNodes(AstNode *)>;

enum class AstNodeType {
#define DECLARE_NODE_TYPES(nodeType, className) nodeType,
    AST_NODE_MAPPING(DECLARE_NODE_TYPES)
#undef DECLARE_NODE_TYPES
#define DECLARE_NODE_TYPES(nodeType1, nodeType2, baseClass, reinterpretClass) nodeType1, nodeType2,
        AST_NODE_REINTERPRET_MAPPING(DECLARE_NODE_TYPES)
#undef DECLARE_NODE_TYPES
};

enum class AstNodeFlags {
    NO_OPTS = 0,
    STRICT = (1U << 0U),
    PARAMETER = (1U << 1U),
};

DEFINE_BITOPS(AstNodeFlags)

enum class ModifierFlags {
    NONE = 0,
    STATIC = 1 << 0,
    ASYNC = 1 << 1,
    PUBLIC = 1 << 2,
    PROTECTED = 1 << 3,
    PRIVATE = 1 << 4,
    DECLARE = 1 << 5,
    READONLY = 1 << 6,
    OPTIONAL = 1 << 7,
    DEFINITE = 1 << 8,
    ABSTRACT = 1 << 9,
    ACCESS = PUBLIC | PROTECTED | PRIVATE,
    ALL = STATIC | ASYNC | ACCESS | DECLARE | READONLY | ABSTRACT,
    ALLOWED_IN_CTOR_PARAMETER = ACCESS | READONLY,
};

DEFINE_BITOPS(ModifierFlags)

enum class ScriptFunctionFlags {
    NONE = 0,
    GENERATOR = 1 << 0,
    ASYNC = 1 << 1,
    ARROW = 1 << 2,
    EXPRESSION = 1 << 3,
    OVERLOAD = 1 << 4,
    CONSTRUCTOR = 1 << 5,
    METHOD = 1 << 6,
    CONCURRENT = 1 << 7
};

DEFINE_BITOPS(ScriptFunctionFlags)

enum class TSOperatorType { READONLY, KEYOF, UNIQUE };
enum class MappedOption { NO_OPTS, PLUS, MINUS };

// Predefinitions
class AstDumper;
class Expression;
class Statement;

#define DECLARE_CLASSES(nodeType, className) class className;
AST_NODE_MAPPING(DECLARE_CLASSES)
#undef DECLARE_CLASSES

#define DECLARE_CLASSES(nodeType1, nodeType2, baseClass, reinterpretClass) class baseClass;
AST_NODE_REINTERPRET_MAPPING(DECLARE_CLASSES)
#undef DECLARE_CLASSES

class AstNode {
public:
    explicit AstNode(AstNodeType type) : type_(type) {};
    virtual ~AstNode() = default;
    NO_COPY_SEMANTIC(AstNode);
    NO_MOVE_SEMANTIC(AstNode);

    bool IsProgram() const
    {
        return parent_ == nullptr;
    }

#define DECLARE_IS_CHECKS(nodeType, className) \
    bool Is##className() const                 \
    {                                          \
        return type_ == AstNodeType::nodeType; \
    }
    AST_NODE_MAPPING(DECLARE_IS_CHECKS)
#undef DECLARE_IS_CHECKS

#define DECLARE_IS_CHECKS(nodeType1, nodeType2, baseClass, reinterpretClass) \
    bool Is##baseClass() const                                               \
    {                                                                        \
        return type_ == AstNodeType::nodeType1;                              \
    }                                                                        \
    bool Is##reinterpretClass() const                                        \
    {                                                                        \
        return type_ == AstNodeType::nodeType2;                              \
    }
    AST_NODE_REINTERPRET_MAPPING(DECLARE_IS_CHECKS)
#undef DECLARE_IS_CHECKS

    virtual bool IsStatement() const
    {
        return false;
    }

    virtual bool IsExpression() const
    {
        return false;
    }

#define DECLARE_AS_CASTS(nodeType, className)             \
    className *As##className()                            \
    {                                                     \
        ASSERT(Is##className());                          \
        return reinterpret_cast<className *>(this);       \
    }                                                     \
    const className *As##className() const                \
    {                                                     \
        ASSERT(Is##className());                          \
        return reinterpret_cast<const className *>(this); \
    }
    AST_NODE_MAPPING(DECLARE_AS_CASTS)
#undef DECLARE_AS_CASTS

#define DECLARE_AS_CASTS(nodeType1, nodeType2, baseClass, reinterpretClass) \
    baseClass *As##baseClass()                                              \
    {                                                                       \
        ASSERT(Is##baseClass());                                            \
        return reinterpret_cast<baseClass *>(this);                         \
    }                                                                       \
    baseClass *As##reinterpretClass()                                       \
    {                                                                       \
        ASSERT(Is##reinterpretClass());                                     \
        return reinterpret_cast<baseClass *>(this);                         \
    }                                                                       \
    const baseClass *As##baseClass() const                                  \
    {                                                                       \
        ASSERT(Is##baseClass());                                            \
        return reinterpret_cast<const baseClass *>(this);                   \
    }                                                                       \
    const baseClass *As##reinterpretClass() const                           \
    {                                                                       \
        ASSERT(Is##reinterpretClass());                                     \
        return reinterpret_cast<const baseClass *>(this);                   \
    }
    AST_NODE_REINTERPRET_MAPPING(DECLARE_AS_CASTS)
#undef DECLARE_AS_CASTS

    Expression *AsExpression()
    {
        ASSERT(IsExpression());
        return reinterpret_cast<Expression *>(this);
    }

    const Expression *AsExpression() const
    {
        ASSERT(IsExpression());
        return reinterpret_cast<const Expression *>(this);
    }

    Statement *AsStatement()
    {
        ASSERT(IsStatement());
        return reinterpret_cast<Statement *>(this);
    }

    const Statement *AsStatement() const
    {
        ASSERT(IsStatement());
        return reinterpret_cast<const Statement *>(this);
    }

    void SetRange(const lexer::SourceRange &loc)
    {
        range_ = loc;
    }

    void SetStart(const lexer::SourcePosition &start)
    {
        range_.start = start;
    }

    void SetEnd(const lexer::SourcePosition &end)
    {
        range_.end = end;
    }

    const lexer::SourcePosition &Start() const
    {
        return range_.start;
    }

    const lexer::SourcePosition &End() const
    {
        return range_.end;
    }

    const lexer::SourceRange &Range() const
    {
        return range_;
    }

    AstNodeType Type() const
    {
        return type_;
    }

    const AstNode *Parent()
    {
        return parent_;
    }

    const AstNode *Parent() const
    {
        return parent_;
    }

    void SetParent(const AstNode *parent)
    {
        parent_ = parent;
    }

    const AstNode *Original() const
    {
        return original_;
    }

    void SetOriginal(const AstNode *original)
    {
        original_ = original;
    }

    binder::Variable *Variable() const
    {
        return variable_;
    }

    void SetVariable(binder::Variable *variable)
    {
        variable_ = variable;
    }

    virtual void Iterate(const NodeTraverser &cb) const = 0;
    virtual void Dump(ir::AstDumper *dumper) const = 0;
    virtual void Compile([[maybe_unused]] compiler::PandaGen *pg) const = 0;
    virtual checker::Type *Check([[maybe_unused]] checker::Checker *checker) const = 0;
    virtual void UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) = 0;

protected:
    void SetType(AstNodeType type)
    {
        type_ = type;
    }

    const AstNode *parent_ {};
    lexer::SourceRange range_ {};
    AstNodeType type_;
    binder::Variable *variable_ {nullptr};
    const AstNode *original_ {nullptr};
};

}  // namespace panda::es2panda::ir
#endif
