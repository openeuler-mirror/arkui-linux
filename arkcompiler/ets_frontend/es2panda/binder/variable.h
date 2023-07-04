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

#ifndef ES2PANDA_COMPILER_SCOPES_VARIABLE_H
#define ES2PANDA_COMPILER_SCOPES_VARIABLE_H

#include <binder/enumMemberResult.h>
#include <binder/variableFlags.h>
#include <ir/irnode.h>
#include <macros.h>
#include <util/hotfix.h>
#include <util/ustring.h>

#include <limits>

namespace panda::es2panda::checker {
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::binder {

class Decl;
class Scope;
class VariableScope;
class ExportBindings;

#define DECLARE_CLASSES(type, className) class className;
VARIABLE_TYPES(DECLARE_CLASSES)
#undef DECLARE_CLASSES

class Variable {
public:
    virtual ~Variable() = default;
    NO_COPY_SEMANTIC(Variable);
    NO_MOVE_SEMANTIC(Variable);

    VariableType virtual Type() const = 0;

#define DECLARE_CHECKS_CASTS(variableType, className)     \
    bool Is##className() const                            \
    {                                                     \
        return Type() == VariableType::variableType;      \
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
    VARIABLE_TYPES(DECLARE_CHECKS_CASTS)
#undef DECLARE_CHECKS_CASTS

    Decl *Declaration() const
    {
        return decl_;
    }

    VariableFlags Flags() const
    {
        return flags_;
    }

    checker::Type *TsType() const
    {
        return tsType_;
    }

    void SetTsType(checker::Type *tsType)
    {
        tsType_ = tsType;
    }

    void AddFlag(VariableFlags flag)
    {
        flags_ |= flag;
    }

    bool HasFlag(VariableFlags flag) const
    {
        return (flags_ & flag) != 0;
    }

    void RemoveFlag(VariableFlags flag)
    {
        flags_ &= ~flag;
    }

    void Reset(Decl *decl, VariableFlags flags)
    {
        decl_ = decl;
        flags_ = flags;
    }

    bool LexicalBound() const
    {
        return HasFlag(VariableFlags::LEXICAL_BOUND);
    }

    const util::StringView &Name() const;
    virtual void SetLexical(Scope *scope, util::Hotfix *hotfixHelper = nullptr) = 0;

protected:
    explicit Variable(Decl *decl, VariableFlags flags) : decl_(decl), flags_(flags) {}

    Decl *decl_;
    VariableFlags flags_ {};
    checker::Type *tsType_ {};
};

class LocalVariable : public Variable {
public:
    explicit LocalVariable(Decl *decl, VariableFlags flags);

    VariableType Type() const override
    {
        return VariableType::LOCAL;
    }

    void BindVReg(compiler::VReg vreg)
    {
        ASSERT(!LexicalBound());
        vreg_ = vreg;
    }

    void BindLexEnvSlot(uint32_t slot)
    {
        ASSERT(!LexicalBound());
        AddFlag(VariableFlags::LEXICAL_BOUND);
        vreg_ = slot;
    }

    compiler::VReg Vreg() const
    {
        return vreg_;
    }

    uint32_t LexIdx() const
    {
        ASSERT(LexicalBound());
        return vreg_;
    }

    void SetLexical([[maybe_unused]] Scope *scope, [[maybe_unused]] util::Hotfix *hotfixHelper = nullptr) override;
    LocalVariable *Copy(ArenaAllocator *allocator, Decl *decl) const;

private:
    uint32_t vreg_ {};
};

class GlobalVariable : public Variable {
public:
    explicit GlobalVariable(Decl *decl, VariableFlags flags) : Variable(decl, flags) {}

    VariableType Type() const override
    {
        return VariableType::GLOBAL;
    }

    void SetLexical([[maybe_unused]] Scope *scope, [[maybe_unused]] util::Hotfix *hotfixHelper = nullptr) override;
};

class ModuleVariable : public Variable {
public:
    explicit ModuleVariable(Decl *decl, VariableFlags flags) : Variable(decl, flags) {}

    VariableType Type() const override
    {
        return VariableType::MODULE;
    }

    void SetLexical([[maybe_unused]] Scope *scope, [[maybe_unused]] util::Hotfix *hotfixHelper = nullptr) override;

    void AssignIndex(uint32_t index)
    {
        index_ = index;
    }

    uint32_t Index() const
    {
        return index_;
    }

private:
    uint32_t index_;
};

class EnumVariable : public Variable {
public:
    explicit EnumVariable(Decl *decl, bool backReference = false)
        : Variable(decl, VariableFlags::NONE), backReference_(backReference)
    {
    }

    VariableType Type() const override
    {
        return VariableType::ENUM;
    }

    void SetValue(EnumMemberResult value)
    {
        value_ = value;
    }

    const EnumMemberResult &Value() const
    {
        return value_;
    }

    bool BackReference() const
    {
        return backReference_;
    }

    void SetBackReference()
    {
        backReference_ = true;
    }

    void ResetDecl(Decl *decl);

    void SetLexical([[maybe_unused]] Scope *scope, [[maybe_unused]] util::Hotfix *hotfixHelper = nullptr) override;

private:
    EnumMemberResult value_ {false};
    bool backReference_ {};
};

class NamespaceVariable : public Variable {
public:
    explicit NamespaceVariable(Decl *decl, VariableFlags flags) : Variable(decl, flags) {}

    VariableType Type() const override
    {
        return VariableType::NAMESPACE;
    }

    void SetLexical([[maybe_unused]] Scope *scope, [[maybe_unused]] util::Hotfix *hotfixHelper = nullptr) override;

    ExportBindings *GetExportBindings()
    {
        return exportBindings_;
    }

    void SetExportBindings(ExportBindings *exportBindings)
    {
        exportBindings_ = exportBindings;
    }

private:
    ExportBindings *exportBindings_ {nullptr};
};

class ImportEqualsVariable : public Variable {
public:
    explicit ImportEqualsVariable(Decl *decl, VariableFlags flags) : Variable(decl, flags) {}

    VariableType Type() const override
    {
        return VariableType::IMPORT_EQUALS;
    }

    void SetLexical([[maybe_unused]] Scope *scope, [[maybe_unused]] util::Hotfix *hotfixHelper = nullptr) override;

    Scope *GetScope()
    {
        return scope_;
    }

    void SetScope(Scope *scope)
    {
        scope_ = scope;
    }

private:
    Scope *scope_ {nullptr};
};

}  // namespace panda::es2panda::binder
#endif
