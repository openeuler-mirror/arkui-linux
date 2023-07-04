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

#ifndef ES2PANDA_COMPILER_SCOPES_DECLARATION_H
#define ES2PANDA_COMPILER_SCOPES_DECLARATION_H

#include <binder/variableFlags.h>
#include <macros.h>
#include <util/ustring.h>

namespace panda::es2panda::ir {
class AstNode;
class ScriptFunction;
class TSInterfaceDeclaration;
class TSModuleDeclaration;
class ImportDeclaration;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::binder {

class Scope;
class LocalScope;

#define DECLARE_CLASSES(decl_kind, className) class className;
DECLARATION_KINDS(DECLARE_CLASSES)
#undef DECLARE_CLASSES

class Decl {
public:
    virtual ~Decl() = default;
    NO_COPY_SEMANTIC(Decl);
    NO_MOVE_SEMANTIC(Decl);

    virtual DeclType Type() const = 0;

    const util::StringView &Name() const
    {
        return name_;
    }

    const ir::AstNode *Node() const
    {
        return node_;
    }

#define DECLARE_CHECKS_CASTS(declKind, className)         \
    bool Is##className() const                            \
    {                                                     \
        return Type() == DeclType::declKind;              \
    }                                                     \
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
    DECLARATION_KINDS(DECLARE_CHECKS_CASTS)
#undef DECLARE_CHECKS_CASTS

    void BindNode(const ir::AstNode *node)
    {
        node_ = node;
    }

    bool IsLetOrConstOrClassDecl() const
    {
        return IsLetDecl() || IsConstDecl() || IsClassDecl();
    }

    DeclarationFlags Flags() const
    {
        return flags_;
    }

    void AddFlag(DeclarationFlags flag)
    {
        flags_ |= flag;
    }

    bool HasFlag(DeclarationFlags flag) const
    {
        return (flags_ & flag) != 0;
    }

    bool IsImportDecl() const
    {
        return HasFlag(DeclarationFlags::IMPORT);
    }

    bool IsImportOrExportDecl() const
    {
        return HasFlag(DeclarationFlags::IMPORT | DeclarationFlags::EXPORT);
    }

protected:
    explicit Decl(util::StringView name) : name_(name) {}

    util::StringView name_;
    DeclarationFlags flags_ {};
    const ir::AstNode *node_ {};
};

template <typename T>
class MultiDecl : public Decl {
public:
    explicit MultiDecl(ArenaAllocator *allocator, util::StringView name)
        : Decl(name), declarations_(allocator->Adapter())
    {
    }

    const ArenaVector<T *> &Decls() const
    {
        return declarations_;
    }

    void Add(T *decl)
    {
        declarations_.push_back(decl);
    }

private:
    ArenaVector<T *> declarations_;
};

class EnumLiteralDecl : public Decl {
public:
    explicit EnumLiteralDecl(util::StringView name, bool isConst) : Decl(name), isConst_(isConst) {}

    DeclType Type() const override
    {
        return DeclType::ENUM_LITERAL;
    }

    bool IsConst() const
    {
        return isConst_;
    }

    void BindScope(LocalScope *scope)
    {
        scope_ = scope;
    }

    LocalScope *Scope()
    {
        return scope_;
    }

private:
    LocalScope *scope_ {};
    bool isConst_ {};
};

class InterfaceDecl : public MultiDecl<ir::TSInterfaceDeclaration> {
public:
    explicit InterfaceDecl(ArenaAllocator *allocator, util::StringView name) : MultiDecl(allocator, name) {}

    DeclType Type() const override
    {
        return DeclType::INTERFACE;
    }
};

class FunctionDecl : public MultiDecl<ir::ScriptFunction> {
public:
    explicit FunctionDecl(ArenaAllocator *allocator, util::StringView name, const ir::AstNode *node)
        : MultiDecl(allocator, name)
    {
        node_ = node;
    }

    DeclType Type() const override
    {
        return DeclType::FUNC;
    }
};

class TypeParameterDecl : public Decl {
public:
    explicit TypeParameterDecl(util::StringView name, const ir::AstNode *node);

    DeclType Type() const override
    {
        return DeclType::TYPE_PARAMETER;
    }
};

class PropertyDecl : public Decl {
public:
    explicit PropertyDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::PROPERTY;
    }
};

class MethodDecl : public Decl {
public:
    explicit MethodDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::METHOD;
    }
};

class EnumDecl : public Decl {
public:
    explicit EnumDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::ENUM;
    }
};

class TypeAliasDecl : public Decl {
public:
    explicit TypeAliasDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::TYPE_ALIAS;
    }
};

class NamespaceDecl : public MultiDecl<ir::TSModuleDeclaration> {
public:
    explicit NamespaceDecl(ArenaAllocator *allocator, util::StringView name)
        : MultiDecl(allocator, name)
    {
    }

    DeclType Type() const override
    {
        return DeclType::NAMESPACE;
    }
};

class VarDecl : public Decl {
public:
    explicit VarDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::VAR;
    }
};

class LetDecl : public Decl {
public:
    explicit LetDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::LET;
    }
};

class ConstDecl : public Decl {
public:
    explicit ConstDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::CONST;
    }
};

class ClassDecl : public Decl {
public:
    explicit ClassDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::CLASS;
    }
};

class ParameterDecl : public Decl {
public:
    explicit ParameterDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::PARAM;
    }
};

class ImportEqualsDecl : public Decl {
public:
    explicit ImportEqualsDecl(util::StringView name) : Decl(name) {}

    DeclType Type() const override
    {
        return DeclType::IMPORT_EQUALS;
    }
};

}  // namespace panda::es2panda::binder

#endif
