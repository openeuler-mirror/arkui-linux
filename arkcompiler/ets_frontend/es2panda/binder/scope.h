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

#ifndef ES2PANDA_COMPILER_SCOPES_SCOPE_H
#define ES2PANDA_COMPILER_SCOPES_SCOPE_H

#include <binder/declaration.h>
#include <binder/variable.h>
#include <parser/program/program.h>
#include <util/enumbitops.h>
#include <util/ustring.h>

#include <map>
#include <unordered_map>
#include <vector>

namespace panda::es2panda::compiler {
class IRNode;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::binder {

#define DECLARE_CLASSES(type, className) class className;
SCOPE_TYPES(DECLARE_CLASSES)
#undef DECLARE_CLASSES

class Scope;
class VariableScope;
class Variable;

using VariableMap = ArenaUnorderedMap<util::StringView, Variable *>;

class TSBindings {
public:
    explicit TSBindings(ArenaAllocator *allocator) : allocator_(allocator) {}

    template <TSBindingType type>
    bool AddTSVariable(const util::StringView &name, Variable *variable)
    {
        static_assert(type < TSBindingType::COUNT);
        size_t index = GetIndex(type);
        if (tsBindings_[index] == nullptr) {
            tsBindings_[index] = allocator_->New<VariableMap>(allocator_->Adapter());
        }
        return tsBindings_[index]->insert({name, variable}).second;
    }

    template <TSBindingType type>
    Variable *FindTSVariable(const util::StringView &name) const
    {
        static_assert(type < TSBindingType::COUNT);
        size_t index = GetIndex(type);
        if (tsBindings_[index] == nullptr) {
            return nullptr;
        }
        auto res = tsBindings_[index]->find(name);
        if (res == tsBindings_[index]->end()) {
            return nullptr;
        }
        return res->second;
    }

    bool InTSBindings(const util::StringView &name) const
    {
        for (size_t i = 0; i < GetIndex(TSBindingType::COUNT); i++) {
            if (tsBindings_[i] && tsBindings_[i]->find(name) != tsBindings_[i]->end()) {
                return true;
            }
        }
        return false;
    }

private:
    size_t GetIndex(TSBindingType type) const
    {
        return static_cast<size_t>(type);
    }

    ArenaAllocator *allocator_;
    std::array<VariableMap *, static_cast<size_t>(TSBindingType::COUNT)> tsBindings_ {};
};

class ExportBindings {
public:
    explicit ExportBindings(ArenaAllocator *allocator)
        : exportBindings_(allocator->Adapter()),
          exportTSBindings_(allocator)
    {
    }

    Variable *FindExportVariable(const util::StringView &name) const
    {
        auto res = exportBindings_.find(name);
        if (res == exportBindings_.end()) {
            return nullptr;
        }
        return res->second;
    }

    bool AddExportVariable(const util::StringView &name, Variable *var)
    {
        return exportBindings_.insert({name, var}).second;
    }

    bool InExportBindings(const util::StringView &name) const
    {
        auto res = FindExportVariable(name);
        return res != nullptr || exportTSBindings_.InTSBindings(name);
    }

    template <TSBindingType type>
    Variable *FindExportTSVariable(const util::StringView &name) const
    {
        return exportTSBindings_.FindTSVariable<type>(name);
    }

    template <TSBindingType type>
    bool AddExportTSVariable(const util::StringView &name, Variable *var)
    {
        return exportTSBindings_.AddTSVariable<type>(name, var);
    }

private:
    VariableMap exportBindings_;
    TSBindings exportTSBindings_;
};

class ScopeFindResult {
public:
    ScopeFindResult() = default;
    ScopeFindResult(util::StringView n, Scope *s, uint32_t l, Variable *v) : ScopeFindResult(n, s, l, l, v, false) {}
    ScopeFindResult(Scope *s, uint32_t l, uint32_t ll, Variable *v) : scope(s), level(l), lexLevel(ll), variable(v) {}
    ScopeFindResult(util::StringView n, Scope *s, uint32_t l, uint32_t ll, Variable *v, bool c)
        : name(n), scope(s), level(l), lexLevel(ll), variable(v), crossConcurrent(c)
    {
    }

    util::StringView name {};
    Scope *scope {};
    uint32_t level {};
    uint32_t lexLevel {};
    Variable *variable {};
    bool crossConcurrent {false};
};

class Scope {
public:
    virtual ~Scope() = default;
    NO_COPY_SEMANTIC(Scope);
    NO_MOVE_SEMANTIC(Scope);

    virtual ScopeType Type() const = 0;

#define DECLARE_CHECKS_CASTS(scopeType, className)        \
    bool Is##className() const                            \
    {                                                     \
        return Type() == ScopeType::scopeType;            \
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
    SCOPE_TYPES(DECLARE_CHECKS_CASTS)
#undef DECLARE_CHECKS_CASTS

    bool IsVariableScope() const
    {
        return Type() > ScopeType::LOCAL;
    }

    bool IsFunctionVariableScope() const
    {
        return Type() >= ScopeType::FUNCTION;
    }

    FunctionScope *AsFunctionVariableScope()
    {
        ASSERT(IsFunctionVariableScope());
        return reinterpret_cast<FunctionScope *>(this);
    }

    const FunctionScope *AsFunctionVariableScope() const
    {
        ASSERT(IsFunctionVariableScope());
        return reinterpret_cast<const FunctionScope *>(this);
    }

    VariableScope *AsVariableScope()
    {
        ASSERT(IsVariableScope());
        return reinterpret_cast<VariableScope *>(this);
    }

    const VariableScope *AsVariableScope() const
    {
        ASSERT(IsVariableScope());
        return reinterpret_cast<const VariableScope *>(this);
    }

    VariableScope *EnclosingVariableScope();

    FunctionScope *EnclosingFunctionVariableScope();

    const ArenaVector<Decl *> &Decls() const
    {
        return decls_;
    }

    Scope *Parent()
    {
        return parent_;
    }

    const Scope *Parent() const
    {
        return parent_;
    }

    const compiler::IRNode *ScopeStart() const
    {
        return startIns_;
    }

    const compiler::IRNode *ScopeEnd() const
    {
        return endIns_;
    }

    void SetScopeStart(const compiler::IRNode *ins)
    {
        startIns_ = ins;
    }

    void SetScopeEnd(const compiler::IRNode *ins)
    {
        endIns_ = ins;
    }

    const ir::AstNode *Node() const
    {
        return node_;
    }

    void BindNode(const ir::AstNode *node)
    {
        node_ = node;
    }

    bool AddDecl(ArenaAllocator *allocator, Decl *decl, [[maybe_unused]] ScriptExtension extension)
    {
        decls_.push_back(decl);
        return AddBinding(allocator, FindLocal(decl->Name()), decl, extension);
    }

    bool AddTsDecl(ArenaAllocator *allocator, Decl *decl, [[maybe_unused]] ScriptExtension extension)
    {
        decls_.push_back(decl);
        return AddBinding(allocator, FindLocal(decl->Name(), ResolveBindingOptions::ALL), decl, extension);
    }

    template <typename T, typename... Args>
    T *NewDecl(ArenaAllocator *allocator, Args &&... args);

    template <typename DeclType, typename VariableType>
    VariableType *AddDecl(ArenaAllocator *allocator, util::StringView name, VariableFlags flags);

    template <typename DeclType = binder::LetDecl, typename VariableType = binder::LocalVariable>
    static VariableType *CreateVar(ArenaAllocator *allocator, util::StringView name, VariableFlags flags,
                                   const ir::AstNode *node);

    template <typename T, typename... Args>
    void PropagateBinding(ArenaAllocator *allocator, util::StringView name, Args &&... args);

    VariableMap &Bindings()
    {
        return bindings_;
    }

    const VariableMap &Bindings() const
    {
        return bindings_;
    }

    virtual bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                            [[maybe_unused]] ScriptExtension extension) = 0;

    Variable *FindLocal(const util::StringView &name,
                        ResolveBindingOptions options = ResolveBindingOptions::BINDINGS) const;

    ScopeFindResult Find(const util::StringView &name,
                         ResolveBindingOptions options = ResolveBindingOptions::BINDINGS) const;

    Decl *FindDecl(const util::StringView &name) const;

    bool HasVarDecl(const util::StringView &name) const;

    template <TSBindingType type>
    Variable *FindLocalTSVariable(const util::StringView &name) const
    {
        return tsBindings_.FindTSVariable<type>(name);
    }

    template <TSBindingType type>
    void AddLocalTSVariable(const util::StringView &name, Variable *var)
    {
        tsBindings_.AddTSVariable<type>(name, var);
    }

    bool InLocalTSBindings(const util::StringView &name) const
    {
        return tsBindings_.InTSBindings(name);
    }

protected:
    explicit Scope(ArenaAllocator *allocator, Scope *parent)
        : parent_(parent), decls_(allocator->Adapter()), bindings_(allocator->Adapter()), tsBindings_(allocator)
    {
    }

    /**
     * @return true - if the variable is shadowed
     *         false - otherwise
     */
    using VariableVisitior = std::function<bool(const Variable *)>;

    /**
     * @return true - if the variable is shadowed
     *         false - otherwise
     */
    std::tuple<Scope *, bool> IterateShadowedVariables(const util::StringView &name, const VariableVisitior &visitor);

    bool AddLocal(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                  [[maybe_unused]] ScriptExtension extension);

    void SetParent(Scope *parent)
    {
        parent_ = parent;
    }

    Scope *parent_ {};
    ArenaVector<Decl *> decls_;
    VariableMap bindings_;
    TSBindings tsBindings_;
    const ir::AstNode *node_ {};
    const compiler::IRNode *startIns_ {};
    const compiler::IRNode *endIns_ {};
};

class VariableScope : public Scope {
public:
    ~VariableScope() override = default;
    NO_COPY_SEMANTIC(VariableScope);
    NO_MOVE_SEMANTIC(VariableScope);

    void AddFlag(VariableScopeFlags flag)
    {
        flags_ |= flag;
    }

    void ClearFlag(VariableScopeFlags flag)
    {
        flags_ &= ~flag;
    }

    bool HasFlag(VariableScopeFlags flag) const
    {
        return (flags_ & flag) != 0;
    }

    uint32_t NextSlot()
    {
        return slotIndex_++;
    }

    uint32_t LexicalSlots() const
    {
        return slotIndex_;
    }

    bool NeedLexEnv() const
    {
        return slotIndex_ != 0;
    }

    void AddLexicalVarNameAndType(uint32_t slot, util::StringView name, int type)
    {
        lexicalVarNameAndTypes_.emplace(slot, std::pair<util::StringView, int>(name, type));
    }

    ArenaMap<uint32_t, std::pair<util::StringView, int>> &GetLexicalVarNameAndTypes()
    {
        return lexicalVarNameAndTypes_;
    }

protected:
    explicit VariableScope(ArenaAllocator *allocator, Scope *parent) : Scope(allocator, parent),
                                                                       lexicalVarNameAndTypes_(allocator->Adapter()) {}

    inline VariableFlags DeclFlagToVariableFlag(DeclarationFlags declFlag);

    template <typename T>
    bool AddVar(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl);

    template <typename T>
    bool AddFunction(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                     [[maybe_unused]] ScriptExtension extension);

    template <typename T>
    bool AddTSBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl, VariableFlags flags);

    template <typename T>
    bool AddTSBinding(ArenaAllocator *allocator, Decl *newDecl, VariableFlags flags);

    template <typename T>
    bool AddLexical(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl);

    VariableScopeFlags flags_ {};
    uint32_t slotIndex_ {};
    ArenaMap<uint32_t, std::pair<util::StringView, int>> lexicalVarNameAndTypes_; // for debuginfo and hotfix
};

class ParamScope : public Scope {
public:
    ScopeType Type() const override
    {
        return ScopeType::PARAM;
    }

    ArenaVector<LocalVariable *> &Params()
    {
        return params_;
    }

    const ArenaVector<LocalVariable *> &Params() const
    {
        return params_;
    }

    bool HasParam(util::StringView name) const
    {
        for (auto *param : params_) {
            if (param->Name() == name) {
                return true;
            }
        }

        return false;
    }

    std::tuple<ParameterDecl *, const ir::AstNode *> AddParamDecl(ArenaAllocator *allocator, const ir::AstNode *param);

protected:
    explicit ParamScope(ArenaAllocator *allocator, Scope *parent)
        : Scope(allocator, parent), params_(allocator->Adapter())
    {
    }

    bool AddParam(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl, VariableFlags flags);

    ArenaVector<LocalVariable *> params_;
};

class FunctionScope;

class FunctionParamScope : public ParamScope {
public:
    explicit FunctionParamScope(ArenaAllocator *allocator, Scope *parent) : ParamScope(allocator, parent) {}

    FunctionScope *GetFunctionScope() const
    {
        return functionScope_;
    }

    void BindFunctionScope(FunctionScope *funcScope)
    {
        functionScope_ = funcScope;
    }

    LocalVariable *NameVar() const
    {
        return nameVar_;
    }

    void BindName(ArenaAllocator *allocator, util::StringView name);

    ScopeType Type() const override
    {
        return ScopeType::FUNCTION_PARAM;
    }

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;

    void RemoveThisParam()
    {
        params_.erase(params_.begin());
    }

    friend class FunctionScope;
    template <typename E, typename T>
    friend class ScopeWithParamScope;

private:
    FunctionScope *functionScope_ {};
    LocalVariable *nameVar_ {};
};

template <typename E, typename T>
class ScopeWithParamScope : public E {
public:
    explicit ScopeWithParamScope(ArenaAllocator *allocator, Scope *parent) : E(allocator, parent) {}

    void BindParamScope(T *paramScope)
    {
        AssignParamScope(paramScope);
        this->bindings_ = paramScope->Bindings();
    }

    void AssignParamScope(T *paramScope)
    {
        ASSERT(this->parent_ == paramScope);
        ASSERT(this->bindings_.empty());

        paramScope_ = paramScope;
    }

    T *ParamScope()
    {
        return paramScope_;
    }

    const T *ParamScope() const
    {
        return paramScope_;
    }

    void AddBindsFromParam()
    {
        ASSERT(paramScope_);
        this->bindings_.insert(paramScope_->Bindings().begin(), paramScope_->Bindings().end());
    }

protected:
    T *paramScope_;
};

class FunctionScope : public ScopeWithParamScope<VariableScope, FunctionParamScope> {
public:
    explicit FunctionScope(ArenaAllocator *allocator, Scope *parent) : ScopeWithParamScope(allocator, parent) {}

    ScopeType Type() const override
    {
        return ScopeType::FUNCTION;
    }

    void BindName(util::StringView name, util::StringView internalName)
    {
        name_ = name;
        internalName_ = internalName;
    }

    const util::StringView &Name() const
    {
        return name_;
    }

    const util::StringView &InternalName() const
    {
        return internalName_;
    }

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;

private:
    util::StringView name_ {};
    util::StringView internalName_ {};
};

class LocalScope : public Scope {
public:
    explicit LocalScope(ArenaAllocator *allocator, Scope *parent) : Scope(allocator, parent) {}

    ScopeType Type() const override
    {
        return ScopeType::LOCAL;
    }

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;
};

class CatchParamScope : public ParamScope {
public:
    explicit CatchParamScope(ArenaAllocator *allocator, Scope *parent) : ParamScope(allocator, parent) {}

    ScopeType Type() const override
    {
        return ScopeType::CATCH_PARAM;
    }

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;

    friend class CatchScope;
};

class CatchScope : public ScopeWithParamScope<LocalScope, CatchParamScope> {
public:
    explicit CatchScope(ArenaAllocator *allocator, Scope *parent) : ScopeWithParamScope(allocator, parent) {}

    ScopeType Type() const override
    {
        return ScopeType::CATCH;
    }

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;
};

class LoopScope : public VariableScope {
public:
    explicit LoopScope(ArenaAllocator *allocator, Scope *parent) : VariableScope(allocator, parent) {}

    ScopeType Type() const override
    {
        return loopType_;
    }

    void InitVariable();

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override
    {
        return AddLocal(allocator, currentVariable, newDecl, extension);
    }

protected:
    ScopeType loopType_ {ScopeType::LOOP};
};

class GlobalScope : public FunctionScope {
public:
    explicit GlobalScope(ArenaAllocator *allocator) : FunctionScope(allocator, nullptr)
    {
        paramScope_ = allocator->New<FunctionParamScope>(allocator, this);
    }

    ScopeType Type() const override
    {
        return ScopeType::GLOBAL;
    }

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;
};

class ModuleScope : public FunctionScope {
public:
    explicit ModuleScope(ArenaAllocator *allocator) : FunctionScope(allocator, nullptr)
    {
        paramScope_ = allocator->New<FunctionParamScope>(allocator, this);
    }

    ScopeType Type() const override
    {
        return ScopeType::MODULE;
    }

    void AssignIndexToModuleVariable(util::StringView name, uint32_t index);

    void ConvertLocalVariableToModuleVariable(ArenaAllocator *allocator, util::StringView localName);

    bool AddBinding(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                    [[maybe_unused]] ScriptExtension extension) override;
};

class TSModuleScope : public FunctionScope {
public:
    explicit TSModuleScope(ArenaAllocator *allocator, Scope *parent, ExportBindings *exportBindings)
        : FunctionScope(allocator, nullptr), exportBindings_(exportBindings), variableNames_(allocator->Adapter())
    {
        paramScope_ = allocator->New<FunctionParamScope>(allocator, parent);
        paramScope_->BindFunctionScope(this);
        SetParent(paramScope_);
    }

    ScopeType Type() const override
    {
        return ScopeType::TSMODULE;
    }

    template <TSBindingType type>
    Variable *FindExportTSVariable(const util::StringView &name) const
    {
        return exportBindings_->FindExportTSVariable<type>(name);
    }

    template <TSBindingType type>
    bool AddExportTSVariable(const util::StringView &name, Variable *var)
    {
        return exportBindings_->AddExportTSVariable<type>(name, var);
    }

    Variable *FindExportVariable(const util::StringView &name) const
    {
        return exportBindings_->FindExportVariable(name);
    }

    bool AddExportVariable(const util::StringView &name, Variable *var)
    {
        return exportBindings_->AddExportVariable(name, var);
    }

    bool AddExportVariable(const util::StringView &name)
    {
        return exportBindings_->AddExportVariable(name, FindLocal(name));
    }

    bool InExportBindings(const util::StringView &name) const
    {
        return exportBindings_->InExportBindings(name);
    }

    void AddDeclarationName(const util::StringView &name)
    {
        variableNames_.insert(name);
    }

    bool HasVariableName(const util::StringView &name) const
    {
        return variableNames_.find(name) != variableNames_.end();
    }

private:
    ExportBindings *exportBindings_;
    ArenaSet<util::StringView> variableNames_;
};

inline VariableFlags VariableScope::DeclFlagToVariableFlag(DeclarationFlags declFlag)
{
    VariableFlags varFlag = VariableFlags::NONE;
    if (declFlag & DeclarationFlags::EXPORT) {
        varFlag = VariableFlags::LOCAL_EXPORT;
    } else if (declFlag & DeclarationFlags::IMPORT) {
        varFlag = VariableFlags::IMPORT;
    }
    return varFlag;
}

template <typename T>
bool VariableScope::AddVar(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl)
{
    VariableFlags flags = VariableFlags::HOIST_VAR;
    flags |= DeclFlagToVariableFlag(newDecl->Flags());

    if (!currentVariable) {
        bindings_.insert({newDecl->Name(), allocator->New<T>(newDecl, flags)});
        return true;
    }

    switch (currentVariable->Declaration()->Type()) {
        case DeclType::VAR: {
            currentVariable->Reset(newDecl, flags);
            break;
        }
        case DeclType::PARAM:
        case DeclType::FUNC: {
            break;
        }
        default: {
            return false;
        }
    }

    return true;
}

template <typename T>
bool VariableScope::AddFunction(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl,
                                [[maybe_unused]] ScriptExtension extension)
{
    VariableFlags flags = (extension == ScriptExtension::JS) ? VariableFlags::HOIST_VAR : VariableFlags::HOIST;
    flags |= DeclFlagToVariableFlag(newDecl->Flags());

    if (!currentVariable) {
        bindings_.insert({newDecl->Name(), allocator->New<T>(newDecl, flags)});
        return true;
    }

    if (extension != ScriptExtension::JS) {
        return false;
    }

    switch (currentVariable->Declaration()->Type()) {
        case DeclType::VAR:
        case DeclType::FUNC: {
            currentVariable->Reset(newDecl, flags);
            break;
        }
        default: {
            return false;
        }
    }

    return true;
}

template <typename T>
bool VariableScope::AddTSBinding(ArenaAllocator *allocator, [[maybe_unused]] Variable *currentVariable, Decl *newDecl,
                                 VariableFlags flags)
{
    ASSERT(!currentVariable);
    // TODO(xucheng): move the ts variables to tsBindings_
    bindings_.insert({newDecl->Name(), allocator->New<T>(newDecl, flags)});
    return true;
}

template <typename T>
bool VariableScope::AddTSBinding(ArenaAllocator *allocator, Decl *newDecl, VariableFlags flags)
{
    switch (flags) {
        case VariableFlags::NAMESPACE: {
            return tsBindings_.AddTSVariable<TSBindingType::NAMESPACE>(
                newDecl->Name(), allocator->New<T>(newDecl, flags));
        }
        case VariableFlags::ENUM_LITERAL: {
            return tsBindings_.AddTSVariable<TSBindingType::ENUM>(
                newDecl->Name(), allocator->New<T>(newDecl, flags));
        }
        case VariableFlags::INTERFACE: {
            return tsBindings_.AddTSVariable<TSBindingType::INTERFACE>(
                newDecl->Name(), allocator->New<T>(newDecl, flags));
        }
        case VariableFlags::IMPORT_EQUALS: {
            return tsBindings_.AddTSVariable<TSBindingType::IMPORT_EQUALS>(
                newDecl->Name(), allocator->New<T>(newDecl, flags));
        }
        default: {
            break;
        }
    }
    return false;
}

template <typename T>
bool VariableScope::AddLexical(ArenaAllocator *allocator, Variable *currentVariable, Decl *newDecl)
{
    VariableFlags flags = DeclFlagToVariableFlag(newDecl->Flags());

    if (currentVariable) {
        return false;
    }

    bindings_.insert({newDecl->Name(), allocator->New<T>(newDecl, flags)});
    return true;
}

template <typename T, typename... Args>
T *Scope::NewDecl(ArenaAllocator *allocator, Args &&... args)
{
    T *decl = allocator->New<T>(std::forward<Args>(args)...);
    decls_.push_back(decl);

    return decl;
}

template <typename DeclType, typename VariableType>
VariableType *Scope::AddDecl(ArenaAllocator *allocator, util::StringView name, VariableFlags flags)
{
    if (FindLocal(name)) {
        return nullptr;
    }

    auto *decl = allocator->New<DeclType>(name);
    auto *variable = allocator->New<VariableType>(decl, flags);

    decls_.push_back(decl);
    bindings_.insert({decl->Name(), variable});

    return variable;
}

template <typename DeclType, typename VariableType>
VariableType *Scope::CreateVar(ArenaAllocator *allocator, util::StringView name, VariableFlags flags,
                               const ir::AstNode *node)
{
    auto *decl = allocator->New<DeclType>(name);
    auto *variable = allocator->New<VariableType>(decl, flags);
    decl->BindNode(node);
    return variable;
}

template <typename T, typename... Args>
void Scope::PropagateBinding(ArenaAllocator *allocator, util::StringView name, Args &&... args)
{
    auto res = bindings_.find(name);
    if (res == bindings_.end()) {
        bindings_.insert({name, allocator->New<T>(std::forward<Args>(args)...)});
        return;
    }

    if (!res->second->Declaration()->IsParameterDecl()) {
        res->second->Reset(std::forward<Args>(args)...);
    }
}

}  // namespace panda::es2panda::binder

#endif
