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

#ifndef ES2PANDA_COMPILER_CORE_PANDAGEN_H
#define ES2PANDA_COMPILER_CORE_PANDAGEN_H

#include <compiler/base/optionalChain.h>
#include <compiler/core/envScope.h>
#include <compiler/core/inlineCache.h>
#include <compiler/core/regAllocator.h>
#include <compiler/core/regScope.h>
#include <ir/irnode.h>
#include <lexer/token/tokenType.h>
#include <libpandafile/file_items.h>
#include <macros.h>

#include <regex>

namespace panda::es2panda::binder {
class FunctionScope;
class ModuleVaribale;
class ScopeFindResult;
class Scope;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::ir {
class AstNode;
class ScriptFunction;
class Statement;
class Expression;
class Identifier;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class FunctionBuilder;
class CompilerContext;
class LiteralBuffer;
class DynamicContext;
class CatchTable;

enum class Constant {
    JS_NAN,
    JS_HOLE,
    JS_INFINITY,
    JS_UNDEFINED,
    JS_NULL,
    JS_TRUE,
    JS_FALSE,
    JS_SYMBOL,
    JS_GLOBAL,
};

class DebugInfo {
public:
    explicit DebugInfo(ArenaAllocator *allocator) : variableDebugInfo(allocator->Adapter()) {};
    DEFAULT_COPY_SEMANTIC(DebugInfo);
    DEFAULT_MOVE_SEMANTIC(DebugInfo);
    ~DebugInfo() = default;

    ArenaVector<const binder::Scope *> variableDebugInfo;
    const ir::Statement *firstStmt {};
};

class PandaGen {
public:
    explicit PandaGen(ArenaAllocator *allocator, CompilerContext *context, binder::FunctionScope *scope)
        : allocator_(allocator),
          context_(context),
          builder_(nullptr),
          debugInfo_(allocator_),
          topScope_(scope),
          scope_(topScope_),
          rootNode_(scope->Node()),
          insns_(allocator_->Adapter()),
          typedInsns_(allocator_->Adapter()),
          catchList_(allocator_->Adapter()),
          strings_(allocator_->Adapter()),
          buffStorage_(allocator_->Adapter()),
          ra_(this)
    {
    }
    ~PandaGen() = default;
    NO_COPY_SEMANTIC(PandaGen);
    NO_MOVE_SEMANTIC(PandaGen);

    inline ArenaAllocator *Allocator() const
    {
        return allocator_;
    }

    inline CompilerContext *Context() const
    {
        return context_;
    }

    const ArenaSet<util::StringView> &Strings() const
    {
        return strings_;
    }

    const ArenaVector<CatchTable *> &CatchList() const
    {
        return catchList_;
    }

    binder::FunctionScope *TopScope() const
    {
        return topScope_;
    }

    binder::Scope *Scope() const
    {
        return scope_;
    }

    const ir::AstNode *RootNode() const
    {
        return rootNode_;
    }

    ArenaList<IRNode *> &Insns()
    {
        return insns_;
    }

    const ArenaList<IRNode *> &Insns() const
    {
        return insns_;
    }

    void SetInsns(ArenaList<IRNode *> &newInsns)
    {
        insns_.assign(newInsns.begin(), newInsns.end());
    }

    ArenaMap<const IRNode *, int64_t> &TypedInsns()
    {
        return typedInsns_;
    }

    const ArenaMap<const IRNode *, int64_t> &TypedInsns() const
    {
        return typedInsns_;
    }

    VReg AllocReg()
    {
        if (usedRegs_ > UINT16_MAX) {
            throw Error(ErrorType::GENERIC, "Can't alloc new reg because all regs ran out");
        }
        return usedRegs_++;
    }

    VReg NextReg() const
    {
        return usedRegs_;
    }

    uint32_t TotalRegsNum() const
    {
        return totalRegs_;
    }

    size_t LabelCount() const
    {
        return labelId_;
    }

    const DebugInfo &Debuginfo() const
    {
        return debugInfo_;
    }

    FunctionBuilder *FuncBuilder() const
    {
        return builder_;
    }

    EnvScope *GetEnvScope() const
    {
        return envScope_;
    }

    const ArenaVector<compiler::LiteralBuffer *> &BuffStorage() const
    {
        return buffStorage_;
    }

    OptionalChain *GetOptionalChain() const
    {
        return optionalChain_;
    }

    uint32_t IcSize() const
    {
        return ic_.Size();
    }

    void SetSourceLocationFlag(lexer::SourceLocationFlag flag)
    {
        ra_.SetSourceLocationFlag(flag);
    }

    void AdjustSpillInsns()
    {
        ra_.AdjustInsRegWhenHasSpill();
        totalRegs_ += ra_.GetSpillRegsCount();
    }

    panda::panda_file::FunctionKind GetFunctionKind() const
    {
        return funcKind_;
    }

    bool IsConcurrent() const
    {
        return funcKind_ == panda::panda_file::FunctionKind::CONCURRENT_FUNCTION;
    }

    void SetFunctionKind();

    bool IsDebug() const;
    bool isDebuggerEvaluateExpressionMode() const;
    std::string SourceFile() const;
    uint32_t ParamCount() const;
    uint32_t FormalParametersCount() const;
    uint32_t InternalParamCount() const;
    const util::StringView &InternalName() const;
    const util::StringView &FunctionName() const;
    binder::Binder *Binder() const;

    Label *AllocLabel();

    bool FunctionHasFinalizer() const;
    bool IsAsyncFunction() const;
    void FunctionInit(CatchTable* catchTable);
    void FunctionEnter();
    void FunctionExit();

    LiteralBuffer *NewLiteralBuffer();
    int32_t AddLiteralBuffer(LiteralBuffer *buf);
    int32_t AddLexicalVarNamesForDebugInfo(ArenaMap<uint32_t, std::pair<util::StringView, int>> &lexicalVars);

    void InitializeLexEnv(const ir::AstNode *node);
    void CopyFunctionArguments(const ir::AstNode *node);
    void GetFunctionObject(const ir::AstNode *node);
    void GetNewTarget(const ir::AstNode *node);
    void GetThis(const ir::AstNode *node);
    void SetThis(const ir::AstNode *node);
    void LoadVar(const ir::Identifier *node, const binder::ScopeFindResult &result);
    void StoreVar(const ir::AstNode *node, const binder::ScopeFindResult &result, bool isDeclaration);

    void StLetOrClassToGlobalRecord(const ir::AstNode *node, const util::StringView &name);
    void StConstToGlobalRecord(const ir::AstNode *node, const util::StringView &name);

    void StoreAccumulator(const ir::AstNode *node, VReg vreg);
    void StoreAccumulatorWithType(const ir::AstNode *node, int64_t typeIndex, VReg vreg);
    void LoadAccFromArgs(const ir::AstNode *node);
    void LoadObjProperty(const ir::AstNode *node, VReg obj, const Operand &prop);

    void LoadObjByName(const ir::AstNode *node, VReg obj, const util::StringView &prop);

    void StoreObjProperty(const ir::AstNode *node, VReg obj, const Operand &prop);
    void StoreOwnProperty(const ir::AstNode *node, VReg obj, const Operand &prop, bool nameSetting = false);
    void DeleteObjProperty(const ir::AstNode *node, VReg obj, const Operand &prop);
    void LoadAccumulator(const ir::AstNode *node, VReg reg);
    void LoadGlobalVar(const ir::AstNode *node, const util::StringView &name);
    void StoreGlobalVar(const ir::AstNode *node, const util::StringView &name);

    void TryLoadGlobalByValue(const ir::AstNode *node, VReg key);
    void TryStoreGlobalByValue(const ir::AstNode *node, VReg key);
    void LoadObjByNameViaDebugger(const ir::AstNode *node, const util::StringView &name, bool throwUndefinedIfHole);
    void TryLoadGlobalByName(const ir::AstNode *node, const util::StringView &name);
    void StoreObjByNameViaDebugger(const ir::AstNode *node, const util::StringView &name);
    void TryStoreGlobalByName(const ir::AstNode *node, const util::StringView &name);

    void LoadAccFromLexEnv(const ir::AstNode *node, const binder::ScopeFindResult &result);
    void StoreAccToLexEnv(const ir::AstNode *node, const binder::ScopeFindResult &result, bool isDeclaration);

    void LoadAccumulatorString(const ir::AstNode *node, const util::StringView &str);
    void LoadAccumulatorFloat(const ir::AstNode *node, double num);
    void LoadAccumulatorInt(const ir::AstNode *node, int32_t num);
    void LoadAccumulatorInt(const ir::AstNode *node, size_t num);
    void LoadAccumulatorBigInt(const ir::AstNode *node, const util::StringView &num);

    void LoadConst(const ir::AstNode *node, Constant id);
    void StoreConst(const ir::AstNode *node, VReg reg, Constant id);
    void MoveVreg(const ir::AstNode *node, VReg vd, VReg vs);
    void MoveVregWithType(const ir::AstNode *node, int64_t typeIndex, VReg vd, VReg vs);

    void SetLabel(const ir::AstNode *node, Label *label);
    void Branch(const ir::AstNode *node, class Label *label);
    bool CheckControlFlowChange() const;
    Label *ControlFlowChangeBreak(const ir::Identifier *label = nullptr);
    Label *ControlFlowChangeContinue(const ir::Identifier *label);
    void ControlFlowChangeReturn();

    void Condition(const ir::AstNode *node, lexer::TokenType op, VReg lhs, class Label *ifFalse);
    void Unary(const ir::AstNode *node, lexer::TokenType op, VReg operand);
    void Binary(const ir::AstNode *node, lexer::TokenType op, VReg lhs);
    void Equal(const ir::AstNode *node, VReg lhs);
    void NotEqual(const ir::AstNode *node, VReg lhs);
    void StrictEqual(const ir::AstNode *node, VReg lhs);
    void StrictNotEqual(const ir::AstNode *node, VReg lhs);
    void LessThan(const ir::AstNode *node, VReg lhs);
    void LessEqual(const ir::AstNode *node, VReg lhs);
    void GreaterThan(const ir::AstNode *node, VReg lhs);
    void GreaterEqual(const ir::AstNode *node, VReg lhs);
    void IsTrue(const ir::AstNode *node);

    void BranchIfUndefined(const ir::AstNode *node, class Label *target);
    void BranchIfStrictUndefined(const ir::AstNode *node, class Label *target);
    void BranchIfStrictNotUndefined(const ir::AstNode *node, class Label *target);
    void BranchIfNotUndefined(const ir::AstNode *node, class Label *target);
    void BranchIfHole(const ir::AstNode *node, class Label *target);
    void BranchIfTrue(const ir::AstNode *node, class Label *target);
    void BranchIfNotTrue(const ir::AstNode *node, class Label *target);
    void BranchIfFalse(const ir::AstNode *node, class Label *target);
    void BranchIfNotFalse(const ir::AstNode *node, class Label *target);
    void BranchIfStrictNull(const ir::AstNode *node, class Label *target);

    void EmitThrow(const ir::AstNode *node);
    void EmitRethrow(const ir::AstNode *node);
    void EmitReturn(const ir::AstNode *node);
    void EmitReturnUndefined(const ir::AstNode *node);
    void ValidateClassDirectReturn(const ir::AstNode *node);
    void DirectReturn(const ir::AstNode *node);
    void ExplicitReturn(const ir::AstNode *node);
    void ImplicitReturn(const ir::AstNode *node);
    void EmitAwait(const ir::AstNode *node);

    void CallThis(const ir::AstNode *node, VReg startReg, size_t argCount);
    void Call(const ir::AstNode *node, VReg startReg, size_t argCount);
    void CallSpread(const ir::AstNode *node, VReg func, VReg thisReg, VReg args);
    void SuperCall(const ir::AstNode *node, VReg startReg, size_t argCount);
    void SuperCallSpread(const ir::AstNode *node, VReg vs);
    void NotifyConcurrentResult(const ir::AstNode *node);

    void NewObject(const ir::AstNode *node, VReg startReg, size_t argCount);
    void DefineFunction(const ir::AstNode *node, const ir::ScriptFunction *realNode, const util::StringView &name);

    void TypeOf(const ir::AstNode *node);
    void NewObjSpread(const ir::AstNode *node, VReg obj);
    void GetUnmappedArgs(const ir::AstNode *node);

    void Negate(const ir::AstNode *node);
    void ToNumber(const ir::AstNode *node, VReg arg);
    void ToNumeric(const ir::AstNode *node, VReg arg);

    void CreateGeneratorObj(const ir::AstNode *node, VReg funcObj);
    void ResumeGenerator(const ir::AstNode *node, VReg genObj);
    void GetResumeMode(const ir::AstNode *node, VReg genObj);

    void AsyncFunctionEnter(const ir::AstNode *node);
    void AsyncFunctionAwait(const ir::AstNode *node, VReg asyncFuncObj);
    void AsyncFunctionResolve(const ir::AstNode *node, VReg asyncFuncObj);
    void AsyncFunctionReject(const ir::AstNode *node, VReg asyncFuncObj);

    void GeneratorYield(const ir::AstNode *node, VReg genObj);
    void GeneratorComplete(const ir::AstNode *node, VReg genObj);
    void CreateAsyncGeneratorObj(const ir::AstNode *node, VReg funcObj);
    void CreateIterResultObject(const ir::AstNode *node, VReg value, VReg done);
    void SuspendGenerator(const ir::AstNode *node, VReg genObj);
    void SuspendAsyncGenerator(const ir::AstNode *node, VReg asyncGenObj);

    void AsyncGeneratorResolve(const ir::AstNode *node, VReg asyncGenObj, VReg value, VReg canSuspend);
    void AsyncGeneratorReject(const ir::AstNode *node, VReg asyncGenObj);

    void GetTemplateObject(const ir::AstNode *node, VReg value);
    void CopyRestArgs(const ir::AstNode *node, uint32_t index);

    void GetPropIterator(const ir::AstNode *node);
    void GetNextPropName(const ir::AstNode *node, VReg iter);
    void CreateEmptyObject(const ir::AstNode *node);
    void CreateObjectWithBuffer(const ir::AstNode *node, uint32_t idx);
    void SetObjectWithProto(const ir::AstNode *node, VReg proto, VReg obj);
    void CopyDataProperties(const ir::AstNode *node, VReg dst);
    void DefineGetterSetterByValue(const ir::AstNode *node, VReg obj, VReg name, VReg getter, VReg setter,
                                   bool setName);
    void CreateEmptyArray(const ir::AstNode *node);
    void CreateArray(const ir::AstNode *node, const ArenaVector<ir::Expression *> &elements, VReg obj);
    void CreateArrayWithBuffer(const ir::AstNode *node, uint32_t idx);
    void StoreArraySpread(const ir::AstNode *node, VReg array, VReg index);

    void ThrowIfNotObject(const ir::AstNode *node, VReg obj);
    void ThrowThrowNotExist(const ir::AstNode *node);
    void GetIterator(const ir::AstNode *node);
    void GetAsyncIterator(const ir::AstNode *node);

    void CreateObjectWithExcludedKeys(const ir::AstNode *node, VReg obj, VReg argStart, size_t argCount);
    void ThrowObjectNonCoercible(const ir::AstNode *node);
    void CloseIterator(const ir::AstNode *node, VReg iter);
    void DefineClassWithBuffer(const ir::AstNode *node, const util::StringView &ctorId, int32_t litIdx, VReg base);

    void LoadLocalModuleVariable(const ir::AstNode *node, const binder::ModuleVariable *variable);
    void LoadExternalModuleVariable(const ir::AstNode *node, const binder::ModuleVariable *variable);
    void StoreModuleVariable(const ir::AstNode *node, const binder::ModuleVariable *variable);
    void GetModuleNamespace(const ir::AstNode *node, uint32_t index);
    void DynamicImportCall(const ir::AstNode *node);

    void StSuperByName(const ir::AstNode *node, VReg obj, const util::StringView &key);
    void LdSuperByName(const ir::AstNode *node, VReg obj, const util::StringView &key);
    void StSuperByValue(const ir::AstNode *node, VReg obj, VReg prop);
    void LdSuperByValue(const ir::AstNode *node, VReg obj);
    void StoreSuperProperty(const ir::AstNode *node, VReg obj, const Operand &prop);
    void LoadSuperProperty(const ir::AstNode *node, VReg obj, const Operand &prop);

    void PopLexEnv(const ir::AstNode *node);
    void CopyLexEnv(const ir::AstNode *node);
    void NewLexicalEnv(const ir::AstNode *node, uint32_t num, binder::VariableScope *scope);
    void NewLexEnv(const ir::AstNode *node, uint32_t num);
    void NewLexEnvWithScopeInfo(const ir::AstNode *node, uint32_t num, int32_t scopeInfoIdx);
    void LoadLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot);
    void LoadLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot, const util::StringView &name);
    void StoreLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot);
    void StoreLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot, const util::StringView &name);
    void StoreLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot, VReg value);

    void ThrowIfSuperNotCorrectCall(const ir::AstNode *node, int64_t num);
    void ThrowUndefinedIfHole(const ir::AstNode *node, const util::StringView &name);
    void ThrowConstAssignment(const ir::AstNode *node, const util::StringView &name);

    uint32_t TryDepth() const;
    CatchTable *CreateCatchTable();
    void SortCatchTables();

    void LoadObjByIndex(const ir::AstNode *node, VReg obj, int64_t index);
    void LoadObjByValue(const ir::AstNode *node, VReg obj);

    void StoreObjByName(const ir::AstNode *node, VReg obj, const util::StringView &prop);
    void StoreObjByIndex(const ir::AstNode *node, VReg obj, int64_t index);
    void StoreObjByValue(const ir::AstNode *node, VReg obj, VReg prop);

    void StOwnByName(const ir::AstNode *node, VReg obj, const util::StringView &prop, bool nameSetting = false);
    void StOwnByValue(const ir::AstNode *node, VReg obj, VReg prop, bool nameSetting = false);
    void StOwnByIndex(const ir::AstNode *node, VReg obj, int64_t index);

    static Operand ToNamedPropertyKey(const ir::Expression *prop, bool isComputed);
    Operand ToPropertyKey(const ir::Expression *prop, bool isComputed);
    VReg LoadPropertyKey(const ir::Expression *prop, bool isComputed);

    /*
     * Since the [Function] is not implemented yet, We compile the test262's framework code
     * which obtains the [global] Object as following into [LoadConst.Global] directly.
     * ```
     *    var __globalObject = Function("return this;")();
     *    var __globalObject = new Function("return this;")();
     * ```
     */
    bool TryCompileFunctionCallOrNewExpression(const ir::Expression *expr);

    void SetFirstStmt(const ir::Statement *stmt)
    {
        debugInfo_.firstStmt = stmt;
    }

    [[noreturn]] static void Unimplemented()
    {
        throw Error(ErrorType::GENERIC, "Unimplemented code path");
    }

    IcSizeType GetCurrentSlot() const
    {
        return currentSlot_;
    }

    void IncreaseCurrentSlot(ICSlot inc)
    {
        currentSlot_ += inc;
    }

private:
    ArenaAllocator *allocator_;
    CompilerContext *context_;
    FunctionBuilder *builder_;
    DebugInfo debugInfo_;
    binder::FunctionScope *topScope_;
    binder::Scope *scope_;
    const ir::AstNode *rootNode_;
    ArenaList<IRNode *> insns_;
    ArenaMap<const IRNode *, int64_t> typedInsns_;
    ArenaVector<CatchTable *> catchList_;
    ArenaSet<util::StringView> strings_;
    ArenaVector<LiteralBuffer *> buffStorage_;
    EnvScope *envScope_ {};
    DynamicContext *dynamicContext_ {};
    OptionalChain *optionalChain_ {};
    InlineCache ic_;
    RegAllocator ra_;
    IcSizeType currentSlot_ {0};

    uint32_t usedRegs_ {0};
    uint32_t totalRegs_ {0};
    friend class ScopeContext;
    friend class RegScope;
    friend class LocalRegScope;
    friend class LoopRegScope;
    friend class ParamRegScope;
    friend class FunctionRegScope;
    friend class EnvScope;
    friend class LoopEnvScope;
    friend class DynamicContext;
    friend class OptionalChain;
    size_t labelId_ {0};
    panda::panda_file::FunctionKind funcKind_ {panda::panda_file::FunctionKind::NONE};
};
}  // namespace panda::es2panda::compiler

#endif
