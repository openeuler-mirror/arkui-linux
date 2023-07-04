/*
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

#include "pandagen.h"

#include <binder/binder.h>
#include <util/concurrent.h>
#include <util/helpers.h>
#include <util/hotfix.h>
#include <binder/scope.h>
#include <binder/variable.h>
#include <compiler/base/catchTable.h>
#include <compiler/base/lexenv.h>
#include <compiler/base/literals.h>
#include <compiler/core/compilerContext.h>
#include <compiler/core/labelTarget.h>
#include <compiler/core/regAllocator.h>
#include <compiler/function/asyncFunctionBuilder.h>
#include <compiler/function/asyncGeneratorFunctionBuilder.h>
#include <compiler/function/functionBuilder.h>
#include <compiler/function/generatorFunctionBuilder.h>
#include <es2panda.h>
#include <gen/isa.h>
#include <ir/base/classDefinition.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/callExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/newExpression.h>
#include <ir/statement.h>
#include <typescript/extractor/typeExtractor.h>

namespace panda::es2panda::compiler {

// PandaGen

void PandaGen::SetFunctionKind()
{
    if (rootNode_->IsProgram()) {
        funcKind_ = panda::panda_file::FunctionKind::FUNCTION;
        return;
    }

    auto *func = rootNode_->AsScriptFunction();
    if (func->IsConcurrent()) {
        funcKind_ = panda::panda_file::FunctionKind::CONCURRENT_FUNCTION;
        return;
    }

    if (func->IsMethod()) {
        return;
    }

    if (func->IsAsync()) {
        if (func->IsGenerator()) {
            funcKind_ = panda::panda_file::FunctionKind::ASYNC_GENERATOR_FUNCTION;
            return;
        }

        if (func->IsArrow()) {
            funcKind_ = panda::panda_file::FunctionKind::ASYNC_NC_FUNCTION;
            return;
        }

        funcKind_ = panda::panda_file::FunctionKind::ASYNC_FUNCTION;
        return;
    }

    if (func->IsGenerator()) {
        funcKind_ = panda::panda_file::FunctionKind::GENERATOR_FUNCTION;
        return;
    }

    if (func->IsArrow()) {
        funcKind_ = panda::panda_file::FunctionKind::NC_FUNCTION;
        return;
    }

    funcKind_ = panda::panda_file::FunctionKind::FUNCTION;
}

Label *PandaGen::AllocLabel()
{
    std::string id = std::string {Label::PREFIX} + std::to_string(labelId_++);
    return ra_.AllocLabel(std::move(id));
}

bool PandaGen::IsDebug() const
{
    return context_->IsDebug();
}

bool PandaGen::isDebuggerEvaluateExpressionMode() const
{
    return context_->isDebuggerEvaluateExpressionMode();
}

std::string PandaGen::SourceFile() const
{
    return context_->SourceFile();
}

uint32_t PandaGen::ParamCount() const
{
    if (rootNode_->IsProgram()) {
        return 0;
    }

    return rootNode_->AsScriptFunction()->Params().size();
}

uint32_t PandaGen::FormalParametersCount() const
{
    if (rootNode_->IsProgram()) {
        return 0;
    }

    ASSERT(rootNode_->IsScriptFunction());

    return rootNode_->AsScriptFunction()->FormalParamsLength();
}

uint32_t PandaGen::InternalParamCount() const
{
    if (rootNode_->IsProgram() && context_->Binder()->Program()->IsCommonjs()) {
        return binder::Binder::CJS_MANDATORY_PARAMS_NUMBER;
    }
    return ParamCount() + binder::Binder::MANDATORY_PARAMS_NUMBER;
}

const util::StringView &PandaGen::InternalName() const
{
    return topScope_->InternalName();
}

const util::StringView &PandaGen::FunctionName() const
{
    return topScope_->Name();
}

binder::Binder *PandaGen::Binder() const
{
    return context_->Binder();
}

void PandaGen::FunctionInit(CatchTable *catchTable)
{
    if (rootNode_->IsProgram()) {
        builder_ = allocator_->New<FunctionBuilder>(this, catchTable);
        return;
    }

    const ir::ScriptFunction *func = rootNode_->AsScriptFunction();

    if (func->IsAsync()) {
        if (func->IsGenerator()) {
            builder_ = allocator_->New<AsyncGeneratorFunctionBuilder>(this, catchTable);
            return;
        }

        builder_ = allocator_->New<AsyncFunctionBuilder>(this, catchTable);
        return;
    }

    if (func->IsGenerator()) {
        builder_ = allocator_->New<GeneratorFunctionBuilder>(this, catchTable);
        return;
    }

    builder_ = allocator_->New<FunctionBuilder>(this, catchTable);
}

bool PandaGen::FunctionHasFinalizer() const
{
    if (rootNode_->IsProgram()) {
        return false;
    }

    const ir::ScriptFunction *func = rootNode_->AsScriptFunction();

    return func->IsAsync() || func->IsGenerator();
}

bool PandaGen::IsAsyncFunction() const
{
    const ir::ScriptFunction *func = rootNode_->AsScriptFunction();
    return func->IsAsync() && !func->IsGenerator();
}

void PandaGen::FunctionEnter()
{
    builder_->Prepare(rootNode_->AsScriptFunction());
}

void PandaGen::FunctionExit()
{
    builder_->CleanUp(rootNode_->AsScriptFunction());
}

void PandaGen::InitializeLexEnv(const ir::AstNode *node)
{
    FrontAllocator fa(this);

    if (topScope_->NeedLexEnv()) {
        NewLexicalEnv(node, topScope_->LexicalSlots(), topScope_);
    }
}

void PandaGen::CopyFunctionArguments(const ir::AstNode *node)
{
    FrontAllocator fa(this);
    VReg targetReg = totalRegs_;

    for (const auto *param : topScope_->ParamScope()->Params()) {
        if (param->LexicalBound()) {
            StoreLexicalVar(node, 0, param->LexIdx(), targetReg++);
            continue;
        }
        if (context_->IsTypeExtractorEnabled()) {
            auto typeIndex = context_->TypeRecorder()->GetVariableTypeIndex(param);
            if (typeIndex != extractor::TypeRecorder::PRIMITIVETYPE_ANY) {
                // Simply encode type index for params
                MoveVregWithType(node, -(typeIndex + 1), param->Vreg(), targetReg++);
                continue;
            }
        }
        MoveVreg(node, param->Vreg(), targetReg++);
    }
}

LiteralBuffer *PandaGen::NewLiteralBuffer()
{
    return allocator_->New<LiteralBuffer>(allocator_);
}

int32_t PandaGen::AddLiteralBuffer(LiteralBuffer *buf)
{
    buffStorage_.push_back(buf);
    buf->SetIndex(context_->NewLiteralIndex());
    return buf->Index();
}

int32_t PandaGen::AddLexicalVarNamesForDebugInfo(ArenaMap<uint32_t, std::pair<util::StringView, int>> &lexicalVars)
{
    auto *buf = NewLiteralBuffer();
    buf->Add(Allocator()->New<ir::NumberLiteral>(lexicalVars.size()));
    for (auto &iter : lexicalVars) {
        buf->Add(Allocator()->New<ir::StringLiteral>(iter.second.first));
        buf->Add(Allocator()->New<ir::NumberLiteral>(iter.first));
    }
    return AddLiteralBuffer(buf);
}

void PandaGen::GetFunctionObject(const ir::AstNode *node)
{
    LoadAccFromLexEnv(node, scope_->Find(binder::Binder::MANDATORY_PARAM_FUNC));
}

void PandaGen::GetNewTarget(const ir::AstNode *node)
{
    LoadAccFromLexEnv(node, scope_->Find(binder::Binder::MANDATORY_PARAM_NEW_TARGET));
}

void PandaGen::GetThis(const ir::AstNode *node)
{
    LoadAccFromLexEnv(node, scope_->Find(binder::Binder::MANDATORY_PARAM_THIS));
}

void PandaGen::SetThis(const ir::AstNode *node)
{
    StoreAccToLexEnv(node, scope_->Find(binder::Binder::MANDATORY_PARAM_THIS), true);
}

void PandaGen::LoadVar(const ir::Identifier *node, const binder::ScopeFindResult &result)
{
    auto *var = result.variable;

    if (!var) {
        TryLoadGlobalByName(node, result.name);
        return;
    }

    if (var->IsGlobalVariable()) {
        LoadGlobalVar(node, var->Name());
        return;
    }

    if (var->IsModuleVariable()) {
        var->HasFlag(binder::VariableFlags::LOCAL_EXPORT) ? LoadLocalModuleVariable(node, var->AsModuleVariable()) :
                                                            LoadExternalModuleVariable(node, var->AsModuleVariable());
        if (var->Declaration()->IsLetOrConstOrClassDecl()) {
            ThrowUndefinedIfHole(node, var->Name());
        }
        return;
    }

    ASSERT(var->IsLocalVariable());

    if (var->Declaration()->IsLetOrConstOrClassDecl() && result.scope->IsGlobalScope()) {
        TryLoadGlobalByName(node, result.name);
        return;
    }

    LoadAccFromLexEnv(node, result);
}

void PandaGen::StoreVar(const ir::AstNode *node, const binder::ScopeFindResult &result, bool isDeclaration)
{
    binder::Variable *var = result.variable;

    if (!var) {
        TryStoreGlobalByName(node, result.name);
        return;
    }

    if (var->IsGlobalVariable()) {
        StoreGlobalVar(node, var->Name());
        return;
    }

    if (var->IsModuleVariable()) {
        if (!isDeclaration && var->Declaration()->IsConstDecl()) {
            ThrowConstAssignment(node, var->Name());
            return;
        }

        if (!isDeclaration &&
            (var->Declaration()->IsLetDecl() || var->Declaration()->IsClassDecl())) {
            RegScope rs(this);
            VReg valueReg = AllocReg();
            StoreAccumulator(node, valueReg);
            LoadLocalModuleVariable(node, var->AsModuleVariable());
            ThrowUndefinedIfHole(node, var->Name());
            LoadAccumulator(node, valueReg);
        }

        StoreModuleVariable(node, var->AsModuleVariable());
        return;
    }

    ASSERT(var->IsLocalVariable());

    if (var->Declaration()->IsLetOrConstOrClassDecl() && result.scope->IsGlobalScope()) {
        if (!isDeclaration) {
            TryStoreGlobalByName(node, var->Name());
        } else if (var->Declaration()->IsLetDecl() || var->Declaration()->IsClassDecl()) {
            StLetOrClassToGlobalRecord(node, var->Name());
        } else if (var->Declaration()->IsConstDecl()) {
            StConstToGlobalRecord(node, var->Name());
        }

        return;
    }

    StoreAccToLexEnv(node, result, isDeclaration);
}

void PandaGen::StoreAccumulator(const ir::AstNode *node, VReg vreg)
{
    ra_.Emit<Sta>(node, vreg);
}

void PandaGen::StoreAccumulatorWithType(const ir::AstNode *node, int64_t typeIndex, VReg vreg)
{
    ra_.EmitWithType<Sta>(node, typeIndex, vreg);
}

void PandaGen::LoadAccFromArgs(const ir::AstNode *node)
{
    const auto *varScope = scope_->AsVariableScope();

    if (!varScope->HasFlag(binder::VariableScopeFlags::USE_ARGS)) {
        return;
    }

    binder::ScopeFindResult res = scope_->Find(binder::Binder::FUNCTION_ARGUMENTS);
    ASSERT(res.scope);

    GetUnmappedArgs(node);
    StoreAccToLexEnv(node, res, true);
}

void PandaGen::LoadObjProperty(const ir::AstNode *node, VReg obj, const Operand &prop)
{
    if (std::holds_alternative<VReg>(prop)) {
        LoadAccumulator(node, std::get<VReg>(prop));
        LoadObjByValue(node, obj);
        return;
    }

    if (std::holds_alternative<int64_t>(prop)) {
        LoadObjByIndex(node, obj, std::get<int64_t>(prop));
        return;
    }

    ASSERT(std::holds_alternative<util::StringView>(prop));
    LoadObjByName(node, obj, std::get<util::StringView>(prop));
}

void PandaGen::StoreObjProperty(const ir::AstNode *node, VReg obj, const Operand &prop)
{
    if (std::holds_alternative<VReg>(prop)) {
        StoreObjByValue(node, obj, std::get<VReg>(prop));
        return;
    }

    if (std::holds_alternative<int64_t>(prop)) {
        StoreObjByIndex(node, obj, std::get<int64_t>(prop));
        return;
    }

    ASSERT(std::holds_alternative<util::StringView>(prop));
    StoreObjByName(node, obj, std::get<util::StringView>(prop));
}

void PandaGen::StoreOwnProperty(const ir::AstNode *node, VReg obj, const Operand &prop, bool nameSetting)
{
    if (std::holds_alternative<VReg>(prop)) {
        StOwnByValue(node, obj, std::get<VReg>(prop), nameSetting);
        return;
    }

    if (std::holds_alternative<int64_t>(prop)) {
        StOwnByIndex(node, obj, std::get<int64_t>(prop));
        return;
    }

    ASSERT(std::holds_alternative<util::StringView>(prop));
    StOwnByName(node, obj, std::get<util::StringView>(prop), nameSetting);
}

constexpr size_t DEBUGGER_GET_SET_ARGS_NUM = 2;

void PandaGen::LoadObjByNameViaDebugger(const ir::AstNode *node, const util::StringView &name,
                                        bool throwUndefinedIfHole)
{
    RegScope rs(this);
    VReg global = AllocReg();
    LoadConst(node, compiler::Constant::JS_GLOBAL);
    StoreAccumulator(node, global);
    LoadObjByName(node, global, "debuggerGetValue");
    VReg debuggerGetValueReg = AllocReg();
    StoreAccumulator(node, debuggerGetValueReg);
    VReg variableReg = AllocReg();
    LoadAccumulatorString(node, name);
    StoreAccumulator(node, variableReg);
    VReg boolFlag = AllocReg();
    if (throwUndefinedIfHole) {
        LoadConst(node, compiler::Constant::JS_TRUE);
    } else {
        LoadConst(node, compiler::Constant::JS_FALSE);
    }
    StoreAccumulator(node, boolFlag);
    Call(node, debuggerGetValueReg, DEBUGGER_GET_SET_ARGS_NUM);
}

void PandaGen::TryLoadGlobalByName(const ir::AstNode *node, const util::StringView &name)
{
    if (isDebuggerEvaluateExpressionMode()) {
        LoadObjByNameViaDebugger(node, name, true);
    } else {
        int64_t typeIndex = extractor::TypeExtractor::GetBuiltinTypeIndex(name);
        if (context_->IsTypeExtractorEnabled() && typeIndex != extractor::TypeRecorder::PRIMITIVETYPE_ANY) {
            ra_.EmitWithType<Tryldglobalbyname>(node, typeIndex, 0, name);
        } else {
            ra_.Emit<Tryldglobalbyname>(node, 0, name);
        }
    }
    strings_.insert(name);
}

void PandaGen::StoreObjByNameViaDebugger(const ir::AstNode *node, const util::StringView &name)
{
    RegScope rs(this);
    VReg valueReg = AllocReg();
    StoreAccumulator(node, valueReg);
    VReg global = AllocReg();
    LoadConst(node, compiler::Constant::JS_GLOBAL);
    StoreAccumulator(node, global);
    LoadObjByName(node, global, "debuggerSetValue");
    VReg debuggerSetValueReg = AllocReg();
    StoreAccumulator(node, debuggerSetValueReg);
    VReg variableReg = AllocReg();
    LoadAccumulatorString(node, name);
    StoreAccumulator(node, variableReg);
    MoveVreg(node, AllocReg(), valueReg);
    Call(node, debuggerSetValueReg, DEBUGGER_GET_SET_ARGS_NUM);
}

void PandaGen::TryStoreGlobalByName(const ir::AstNode *node, const util::StringView &name)
{
    if (isDebuggerEvaluateExpressionMode()) {
        StoreObjByNameViaDebugger(node, name);
    } else {
        ra_.Emit<Trystglobalbyname>(node, 0, name);
    }
    strings_.insert(name);
}

void PandaGen::LoadObjByName(const ir::AstNode *node, VReg obj, const util::StringView &prop)
{
    LoadAccumulator(node, obj); // object is load to acc
    ra_.Emit<Ldobjbyname>(node, 0, prop);
    strings_.insert(prop);
}

void PandaGen::StoreObjByName(const ir::AstNode *node, VReg obj, const util::StringView &prop)
{
    ra_.Emit<Stobjbyname>(node, 0, prop, obj);
    strings_.insert(prop);
}

void PandaGen::LoadObjByIndex(const ir::AstNode *node, VReg obj, int64_t index)
{
    LoadAccumulator(node, obj); // object is load to acc
    if (index <= util::Helpers::MAX_INT16) {
        ra_.Emit<Ldobjbyindex>(node, 0, index);
        return;
    }

    ra_.Emit<WideLdobjbyindex>(node, index);
}

void PandaGen::LoadObjByValue(const ir::AstNode *node, VReg obj)
{
    ra_.Emit<Ldobjbyvalue>(node, 0, obj); // prop is in acc
}

void PandaGen::StoreObjByValue(const ir::AstNode *node, VReg obj, VReg prop)
{
    ra_.Emit<Stobjbyvalue>(node, 0, obj, prop);
}

void PandaGen::StoreObjByIndex(const ir::AstNode *node, VReg obj, int64_t index)
{
    if (index <= util::Helpers::MAX_INT16) {
        ra_.Emit<Stobjbyindex>(node, 0, obj, index);
        return;
    }

    ra_.Emit<WideStobjbyindex>(node, obj, index);
}

void PandaGen::StOwnByName(const ir::AstNode *node, VReg obj, const util::StringView &prop, bool nameSetting)
{
    nameSetting ? ra_.Emit<Stownbynamewithnameset>(node, 0, prop, obj) :
                  ra_.Emit<Stownbyname>(node, 0, prop, obj);
    strings_.insert(prop);
}

void PandaGen::StOwnByValue(const ir::AstNode *node, VReg obj, VReg prop, bool nameSetting)
{
    nameSetting ? ra_.Emit<Stownbyvaluewithnameset>(node, 0, obj, prop) :
                  ra_.Emit<Stownbyvalue>(node, 0, obj, prop);
}

void PandaGen::StOwnByIndex(const ir::AstNode *node, VReg obj, int64_t index)
{
    if (index <= util::Helpers::MAX_INT16) {
        ra_.Emit<Stownbyindex>(node, 0, obj, index);
        return;
    }

    ra_.Emit<WideStownbyindex>(node, obj, index);
}

void PandaGen::DeleteObjProperty(const ir::AstNode *node, VReg obj, const Operand &prop)
{
    if (std::holds_alternative<VReg>(prop)) {
        LoadAccumulator(node, std::get<VReg>(prop));
    } else if (std::holds_alternative<int64_t>(prop)) {
        LoadAccumulatorInt(node, static_cast<size_t>(std::get<int64_t>(prop)));
    } else {
        ASSERT(std::holds_alternative<util::StringView>(prop));
        LoadAccumulatorString(node, std::get<util::StringView>(prop));
    }

    ra_.Emit<Delobjprop>(node, obj); // property is load to acc
}

void PandaGen::LoadAccumulator(const ir::AstNode *node, VReg reg)
{
    ra_.Emit<Lda>(node, reg);
}

void PandaGen::LoadGlobalVar(const ir::AstNode *node, const util::StringView &name)
{
    ra_.Emit<Ldglobalvar>(node, 0, name);
    strings_.insert(name);
}

void PandaGen::StoreGlobalVar(const ir::AstNode *node, const util::StringView &name)
{
    ra_.Emit<Stglobalvar>(node, 0, name);
    strings_.insert(name);
}

void PandaGen::LoadAccFromLexEnv(const ir::AstNode *node, const binder::ScopeFindResult &result)
{
    VirtualLoadVar::Expand(this, node, result);
}

void PandaGen::StoreAccToLexEnv(const ir::AstNode *node, const binder::ScopeFindResult &result, bool isDeclaration)
{
    VirtualStoreVar::Expand(this, node, result, isDeclaration);
}

void PandaGen::LoadAccumulatorString(const ir::AstNode *node, const util::StringView &str)
{
    ra_.Emit<LdaStr>(node, str);
    strings_.insert(str);
}

void PandaGen::LoadAccumulatorFloat(const ir::AstNode *node, double num)
{
    ra_.Emit<Fldai>(node, num);
}

void PandaGen::LoadAccumulatorInt(const ir::AstNode *node, int32_t num)
{
    ra_.Emit<Ldai>(node, num);
}

void PandaGen::LoadAccumulatorInt(const ir::AstNode *node, size_t num)
{
    ra_.Emit<Ldai>(node, static_cast<int64_t>(num));
}

void PandaGen::LoadAccumulatorBigInt(const ir::AstNode *node, const util::StringView &num)
{
    ra_.Emit<Ldbigint>(node, num);
    strings_.insert(num);
}

void PandaGen::StoreConst(const ir::AstNode *node, VReg reg, Constant id)
{
    LoadConst(node, id);
    StoreAccumulator(node, reg);
}

void PandaGen::LoadConst(const ir::AstNode *node, Constant id)
{
    switch (id) {
        case Constant::JS_HOLE: {
            ra_.Emit<Ldhole>(node);
            break;
        }
        case Constant::JS_NAN: {
            ra_.Emit<Ldnan>(node);
            break;
        }
        case Constant::JS_INFINITY: {
            ra_.Emit<Ldinfinity>(node);
            break;
        }
        case Constant::JS_GLOBAL: {
            ra_.Emit<Ldglobal>(node);
            break;
        }
        case Constant::JS_UNDEFINED: {
            ra_.Emit<Ldundefined>(node);
            break;
        }
        case Constant::JS_SYMBOL: {
            ra_.Emit<Ldsymbol>(node);
            break;
        }
        case Constant::JS_NULL: {
            ra_.Emit<Ldnull>(node);
            break;
        }
        case Constant::JS_TRUE: {
            ra_.Emit<Ldtrue>(node);
            break;
        }
        case Constant::JS_FALSE: {
            ra_.Emit<Ldfalse>(node);
            break;
        }
        default: {
            UNREACHABLE();
        }
    }
}

void PandaGen::MoveVreg(const ir::AstNode *node, VReg vd, VReg vs)
{
    ra_.Emit<Mov>(node, vd, vs);
}

void PandaGen::MoveVregWithType(const ir::AstNode *node, int64_t typeIndex, VReg vd, VReg vs)
{
    ra_.EmitWithType<Mov>(node, typeIndex, vd, vs);
}

void PandaGen::SetLabel([[maybe_unused]] const ir::AstNode *node, Label *label)
{
    ra_.AddLabel(label);
}

void PandaGen::Branch(const ir::AstNode *node, Label *label)
{
    ra_.Emit<Jmp>(node, label);
}

bool PandaGen::CheckControlFlowChange() const
{
    const auto *iter = dynamicContext_;

    while (iter) {
        if (iter->HasFinalizer()) {
            return true;
        }

        iter = iter->Prev();
    }

    return false;
}

Label *PandaGen::ControlFlowChangeBreak(const ir::Identifier *label)
{
    auto *iter = dynamicContext_;

    util::StringView labelName = label ? label->Name() : LabelTarget::BREAK_LABEL;
    Label *breakTarget = nullptr;

    while (iter) {
        iter->AbortContext(ControlFlowChange::BREAK, labelName);

        const auto &labelTargetName = iter->Target().BreakLabel();

        if (iter->Target().BreakTarget()) {
            breakTarget = iter->Target().BreakTarget();
        }

        if (labelTargetName == labelName) {
            break;
        }

        iter = iter->Prev();
    }

    return breakTarget;
}

Label *PandaGen::ControlFlowChangeContinue(const ir::Identifier *label)
{
    auto *iter = dynamicContext_;
    util::StringView labelName = label ? label->Name() : LabelTarget::CONTINUE_LABEL;
    Label *continueTarget = nullptr;

    while (iter) {
        iter->AbortContext(ControlFlowChange::CONTINUE, labelName);

        const auto &labelTargetName = iter->Target().ContinueLabel();

        if (iter->Target().ContinueTarget()) {
            continueTarget = iter->Target().ContinueTarget();
        }

        if (labelTargetName == labelName) {
            break;
        }

        iter = iter->Prev();
    }

    return continueTarget;
}

void PandaGen::ControlFlowChangeReturn()
{
    auto *iter = dynamicContext_;
    while (iter) {
        iter->AbortContext(ControlFlowChange::BREAK, LabelTarget::RETURN_LABEL);
        iter = iter->Prev();
    }
}

void PandaGen::Condition(const ir::AstNode *node, lexer::TokenType op, VReg lhs, Label *ifFalse)
{
    switch (op) {
        case lexer::TokenType::PUNCTUATOR_EQUAL: {
            Equal(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_NOT_EQUAL: {
            NotEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_STRICT_EQUAL: {
            StrictEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL: {
            StrictNotEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN: {
            LessThan(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL: {
            LessEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN: {
            GreaterThan(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL: {
            GreaterEqual(node, lhs);
            break;
        }
        default: {
            UNREACHABLE();
        }
    }

    BranchIfFalse(node, ifFalse);
}

void PandaGen::Unary(const ir::AstNode *node, lexer::TokenType op, VReg operand)
{
    switch (op) {
        case lexer::TokenType::PUNCTUATOR_PLUS: {
            ToNumber(node, operand);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_MINUS: {
            LoadAccumulator(node, operand);
            ra_.Emit<Neg>(node, 0);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_TILDE: {
            LoadAccumulator(node, operand);
            ra_.Emit<Not>(node, 0);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_EXCLAMATION_MARK: {
            Negate(node);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_PLUS_PLUS: {
            LoadAccumulator(node, operand);
            ra_.Emit<Inc>(node, 0);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_MINUS_MINUS: {
            LoadAccumulator(node, operand);
            ra_.Emit<Dec>(node, 0);
            break;
        }
        case lexer::TokenType::KEYW_VOID:
        case lexer::TokenType::KEYW_DELETE: {
            LoadConst(node, Constant::JS_UNDEFINED);
            break;
        }
        default: {
            UNREACHABLE();
        }
    }
}

void PandaGen::Binary(const ir::AstNode *node, lexer::TokenType op, VReg lhs)
{
    switch (op) {
        case lexer::TokenType::PUNCTUATOR_EQUAL: {
            Equal(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_NOT_EQUAL: {
            NotEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_STRICT_EQUAL: {
            StrictEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL: {
            StrictNotEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN: {
            LessThan(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL: {
            LessEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN: {
            GreaterThan(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL: {
            GreaterEqual(node, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_PLUS:
        case lexer::TokenType::PUNCTUATOR_PLUS_EQUAL: {
            ra_.Emit<Add2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_MINUS:
        case lexer::TokenType::PUNCTUATOR_MINUS_EQUAL: {
            ra_.Emit<Sub2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_MULTIPLY:
        case lexer::TokenType::PUNCTUATOR_MULTIPLY_EQUAL: {
            ra_.Emit<Mul2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_DIVIDE:
        case lexer::TokenType::PUNCTUATOR_DIVIDE_EQUAL: {
            ra_.Emit<Div2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_MOD:
        case lexer::TokenType::PUNCTUATOR_MOD_EQUAL: {
            ra_.Emit<Mod2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL:
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION: {
            ra_.Emit<Exp>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT_EQUAL: {
            ra_.Emit<Shl2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT_EQUAL: {
            ra_.Emit<Ashr2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL: {
            ra_.Emit<Shr2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND:
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND_EQUAL: {
            ra_.Emit<And2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR_EQUAL: {
            ra_.Emit<Or2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR:
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL: {
            ra_.Emit<Xor2>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::KEYW_IN: {
            ra_.Emit<Isin>(node, 0, lhs);
            break;
        }
        case lexer::TokenType::KEYW_INSTANCEOF: {
            ra_.Emit<Instanceof>(node, 0, lhs);
            break;
        }
        default: {
            UNREACHABLE();
        }
    }
}

void PandaGen::Equal(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Eq>(node, 0, lhs);
}

void PandaGen::NotEqual(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Noteq>(node, 0, lhs);
}

void PandaGen::StrictEqual(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Stricteq>(node, 0, lhs);
}

void PandaGen::StrictNotEqual(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Strictnoteq>(node, 0, lhs);
}

void PandaGen::LessThan(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Less>(node, 0, lhs);
}

void PandaGen::LessEqual(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Lesseq>(node, 0, lhs);
}

void PandaGen::GreaterThan(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Greater>(node, 0, lhs);
}

void PandaGen::GreaterEqual(const ir::AstNode *node, VReg lhs)
{
    ra_.Emit<Greatereq>(node, 0, lhs);
}

void PandaGen::IsTrue(const ir::AstNode *node)
{
    ra_.Emit<Istrue>(node);
}

void PandaGen::BranchIfUndefined(const ir::AstNode *node, Label *target)
{
    RegScope rs(this);
    VReg tmp = AllocReg();
    StoreAccumulator(node, tmp);
    LoadConst(node, Constant::JS_UNDEFINED);
    Equal(node, tmp);
    ra_.Emit<Jnez>(node, target);
}

void PandaGen::BranchIfStrictUndefined(const ir::AstNode *node, class Label *target)
{
    RegScope rs(this);
    VReg tmp = AllocReg();
    StoreAccumulator(node, tmp);
    LoadConst(node, Constant::JS_UNDEFINED);
    StrictEqual(node, tmp);
    ra_.Emit<Jnez>(node, target);
}

void PandaGen::BranchIfNotUndefined(const ir::AstNode *node, Label *target)
{
    RegScope rs(this);
    VReg tmp = AllocReg();
    StoreAccumulator(node, tmp);
    LoadConst(node, Constant::JS_UNDEFINED);
    Equal(node, tmp);
    ra_.Emit<Jeqz>(node, target);
}

void PandaGen::BranchIfStrictNotUndefined(const ir::AstNode *node, class Label *target)
{
    RegScope rs(this);
    VReg tmp = AllocReg();
    StoreAccumulator(node, tmp);
    LoadConst(node, Constant::JS_UNDEFINED);
    StrictEqual(node, tmp);
    ra_.Emit<Jeqz>(node, target);
}

void PandaGen::BranchIfTrue(const ir::AstNode *node, Label *target)
{
    IsTrue(node);
    ra_.Emit<Jnez>(node, target);
}

void PandaGen::BranchIfNotTrue(const ir::AstNode *node, Label *target)
{
    IsTrue(node);
    BranchIfFalse(node, target);
}

void PandaGen::BranchIfFalse(const ir::AstNode *node, Label *target)
{
    ra_.Emit<Isfalse>(node);
    ra_.Emit<Jnez>(node, target);
}

void PandaGen::BranchIfStrictNull(const ir::AstNode *node, class Label *target)
{
    RegScope rs(this);
    VReg tmp = AllocReg();
    StoreAccumulator(node, tmp);
    LoadConst(node, Constant::JS_NULL);
    ra_.Emit<Stricteq>(node, 0, tmp);
    ra_.Emit<Jnez>(node, target);
}

void PandaGen::EmitThrow(const ir::AstNode *node)
{
    ra_.Emit<Throw>(node);
}

void PandaGen::EmitRethrow(const ir::AstNode *node)
{
    RegScope rs(this);
    auto *skipThrow = AllocLabel();
    auto *doThrow = AllocLabel();

    VReg exception = AllocReg();
    StoreAccumulator(node, exception);

    VReg hole = AllocReg();
    StoreConst(node, hole, Constant::JS_HOLE);

    LoadAccumulator(node, exception);
    NotEqual(node, hole);
    ra_.Emit<Jeqz>(node, skipThrow);

    SetLabel(node, doThrow);
    LoadAccumulator(node, exception);
    EmitThrow(node);

    SetLabel(node, skipThrow);
}

void PandaGen::EmitReturn(const ir::AstNode *node)
{
    ra_.Emit<Return>(node);
}

void PandaGen::EmitReturnUndefined(const ir::AstNode *node)
{
    ra_.Emit<Returnundefined>(node);
}

void PandaGen::ImplicitReturn(const ir::AstNode *node)
{
    builder_->ImplicitReturn(node);
}

void PandaGen::DirectReturn(const ir::AstNode *node)
{
    builder_->DirectReturn(node);
}

void PandaGen::ExplicitReturn(const ir::AstNode *node)
{
    builder_->ExplicitReturn(node);
}

void PandaGen::ValidateClassDirectReturn(const ir::AstNode *node)
{
    const ir::ScriptFunction *func = util::Helpers::GetContainingFunction(node);

    if (!func || !func->IsConstructor()) {
        return;
    }

    RegScope rs(this);
    VReg value = AllocReg();
    StoreAccumulator(node, value);

    auto *notUndefined = AllocLabel();
    auto *condEnd = AllocLabel();

    BranchIfStrictNotUndefined(node, notUndefined);
    GetThis(func);
    ThrowIfSuperNotCorrectCall(func, 0);
    Branch(node, condEnd);

    SetLabel(node, notUndefined);
    LoadAccumulator(node, value);

    SetLabel(node, condEnd);
}

void PandaGen::EmitAwait(const ir::AstNode *node)
{
    builder_->Await(node);
}

void PandaGen::CallThis(const ir::AstNode *node, VReg startReg, size_t argCount)
{
    LoadAccumulator(node, startReg); // callee is load to acc
    VReg thisReg = startReg + 1;
    switch (argCount) {
        case 1: { // no args
            ra_.Emit<Callthis0>(node, 0, thisReg);
            break;
        }
        case 2: { // 1 arg
            VReg arg0 = thisReg + 1;
            ra_.Emit<Callthis1>(node, 0, thisReg, arg0);
            break;
        }
        case 3: { // 2 args
            VReg arg0 = thisReg + 1;
            VReg arg1 = arg0 + 1;
            ra_.Emit<Callthis2>(node, 0, thisReg , arg0, arg1);
            break;
        }
        case 4: { // 3 args
            VReg arg0 = thisReg + 1;
            VReg arg1 = arg0 + 1;
            VReg arg2 = arg1 + 1;
            ra_.Emit<Callthis3>(node, 0, thisReg , arg0, arg1, arg2);
            break;
        }
        default: {
            int64_t actualArgs = argCount - 1;
            if (actualArgs <= util::Helpers::MAX_INT8) {
                ra_.EmitRange<Callthisrange>(node, argCount, 0, actualArgs, thisReg);
                break;
            }

            ra_.EmitRange<WideCallthisrange>(node, argCount, actualArgs, thisReg);
            break;
        }
    }
}

void PandaGen::Call(const ir::AstNode *node, VReg startReg, size_t argCount)
{
    LoadAccumulator(node, startReg); // callee is load to acc
    switch (argCount) {
        case 0: { // 0 args
            ra_.Emit<Callarg0>(node, 0);
            break;
        }
        case 1: { // 1 arg
            VReg arg0 = startReg + 1;
            ra_.Emit<Callarg1>(node, 0, arg0);
            break;
        }
        case 2: { // 2 args
            VReg arg0 = startReg + 1;
            VReg arg1 = arg0 + 1;
            ra_.Emit<Callargs2>(node, 0, arg0, arg1);
            break;
        }
        case 3: { // 3 args
            VReg arg0 = startReg + 1;
            VReg arg1 = arg0 + 1;
            VReg arg2 = arg1 + 1;
            ra_.Emit<Callargs3>(node, 0, arg0, arg1, arg2);
            break;
        }
        default: {
            VReg arg0 = startReg + 1;
            if (argCount <= util::Helpers::MAX_INT8) {
                ra_.EmitRange<Callrange>(node, argCount, 0, argCount, arg0);
                break;
            }

            ra_.EmitRange<WideCallrange>(node, argCount, argCount, arg0);
            break;
        }
    }
}

void PandaGen::SuperCall(const ir::AstNode *node, VReg startReg, size_t argCount)
{
    if (RootNode()->AsScriptFunction()->IsArrow()) {
        GetFunctionObject(node); // load funcobj to acc for super call in arrow function
        if (argCount <= util::Helpers::MAX_INT8) {
            ra_.EmitRange<Supercallarrowrange>(node, argCount, 0, static_cast<int64_t>(argCount), startReg);
        } else {
            ra_.EmitRange<WideSupercallarrowrange>(node, argCount, static_cast<int64_t>(argCount), startReg);
        }
        return;
    }

    if (argCount <= util::Helpers::MAX_INT8) {
        // no need to load funcobj to acc for super call in other kinds of functions
        ra_.EmitRange<Supercallthisrange>(node, argCount, 0, static_cast<int64_t>(argCount), startReg);
        return;
    }

    ra_.EmitRange<WideSupercallthisrange>(node, argCount, static_cast<int64_t>(argCount), startReg);
}

void PandaGen::SuperCallSpread(const ir::AstNode *node, VReg vs)
{
    ra_.Emit<Supercallspread>(node, 0, vs);
}

void PandaGen::NotifyConcurrentResult(const ir::AstNode *node)
{
    if (IsConcurrent()) {
        ra_.Emit<CallruntimeNotifyconcurrentresult>(node);
    }
}

void PandaGen::NewObject(const ir::AstNode *node, VReg startReg, size_t argCount)
{
    if (argCount <= util::Helpers::MAX_INT8) {
        ra_.EmitRange<Newobjrange>(node, argCount, 0, static_cast<int64_t>(argCount), startReg);
        return;
    }

    ra_.EmitRange<WideNewobjrange>(node, argCount, static_cast<int64_t>(argCount), startReg);
}

void PandaGen::DefineFunction(const ir::AstNode *node, const ir::ScriptFunction *realNode, const util::StringView &name)
{
    if (realNode->IsOverload() || realNode->Declare()) {
        return;
    }

    auto formalParamCnt = realNode->FormalParamsLength();
    if (realNode->IsMethod()) {
        ra_.Emit<Definemethod>(node, 0, name, static_cast<int64_t>(formalParamCnt));
    } else  {
        ra_.Emit<Definefunc>(node, 0, name, static_cast<int64_t>(formalParamCnt));
    }

    strings_.insert(name);
}

void PandaGen::TypeOf(const ir::AstNode *node)
{
    ra_.Emit<Typeof>(node, 0);
}

void PandaGen::CallSpread(const ir::AstNode *node, VReg func, VReg thisReg, VReg args)
{
    LoadAccumulator(node, func); // callee is load to acc
    ra_.Emit<Apply>(node, 0, thisReg, args);
}

void PandaGen::NewObjSpread(const ir::AstNode *node, VReg obj)
{
    ra_.Emit<Newobjapply>(node, 0, obj);
}

void PandaGen::GetUnmappedArgs(const ir::AstNode *node)
{
    ra_.Emit<Getunmappedargs>(node);
}

void PandaGen::Negate(const ir::AstNode *node)
{
    auto *falseLabel = AllocLabel();
    auto *endLabel = AllocLabel();
    BranchIfTrue(node, falseLabel);
    LoadConst(node, Constant::JS_TRUE);
    Branch(node, endLabel);
    SetLabel(node, falseLabel);
    LoadConst(node, Constant::JS_FALSE);
    SetLabel(node, endLabel);
}

void PandaGen::ToNumber(const ir::AstNode *node, VReg arg)
{
    LoadAccumulator(node, arg);
    ra_.Emit<Tonumber>(node, 0);
}

void PandaGen::ToNumeric(const ir::AstNode *node, VReg arg)
{
    LoadAccumulator(node, arg);
    ra_.Emit<Tonumeric>(node, 0);
}

void PandaGen::CreateGeneratorObj(const ir::AstNode *node, VReg funcObj)
{
    ra_.Emit<Creategeneratorobj>(node, funcObj);
}

void PandaGen::CreateAsyncGeneratorObj(const ir::AstNode *node, VReg funcObj)
{
    ra_.Emit<Createasyncgeneratorobj>(node, funcObj);
}

void PandaGen::CreateIterResultObject(const ir::AstNode *node, VReg value, VReg done)
{
    ra_.Emit<Createiterresultobj>(node, value, done);
}

void PandaGen::SuspendGenerator(const ir::AstNode *node, VReg genObj)
{
    ra_.Emit<Suspendgenerator>(node, genObj); // iterResult is in acc
}

void PandaGen::SuspendAsyncGenerator(const ir::AstNode *node, VReg asyncGenObj)
{
    /*
     *  TODO: suspend async generator
     *  ra_.Emit<EcmaSuspendasyncgenerator>(node, asyncGenObj);
     */
}

void PandaGen::GeneratorYield(const ir::AstNode *node, VReg genObj)
{
    LoadAccumulator(node, genObj);
    ra_.Emit<Setgeneratorstate>(node, static_cast<int32_t>(GeneratorState::SUSPENDED_YIELD));
}

void PandaGen::GeneratorComplete(const ir::AstNode *node, VReg genObj)
{
    LoadAccumulator(node, genObj);
    ra_.Emit<Setgeneratorstate>(node, static_cast<int32_t>(GeneratorState::COMPLETED));
}

void PandaGen::ResumeGenerator(const ir::AstNode *node, VReg genObj)
{
    LoadAccumulator(node, genObj);
    ra_.Emit<Resumegenerator>(node);
}

void PandaGen::GetResumeMode(const ir::AstNode *node, VReg genObj)
{
    LoadAccumulator(node, genObj);
    ra_.Emit<Getresumemode>(node);
}

void PandaGen::AsyncFunctionEnter(const ir::AstNode *node)
{
    ra_.Emit<Asyncfunctionenter>(node);
}

void PandaGen::AsyncFunctionAwait(const ir::AstNode *node, VReg asyncFuncObj)
{
    ra_.Emit<Asyncfunctionawaituncaught>(node, asyncFuncObj); // receivedValue is in acc
}

void PandaGen::AsyncFunctionResolve(const ir::AstNode *node, VReg asyncFuncObj)
{
    ra_.Emit<Asyncfunctionresolve>(node, asyncFuncObj); // use retVal in acc
}

void PandaGen::AsyncFunctionReject(const ir::AstNode *node, VReg asyncFuncObj)
{
    ra_.Emit<Asyncfunctionreject>(node, asyncFuncObj); // exception is in acc
}

void PandaGen::AsyncGeneratorResolve(const ir::AstNode *node, VReg asyncGenObj, VReg value, VReg canSuspend)
{
    ra_.Emit<Asyncgeneratorresolve>(node, asyncGenObj, value, canSuspend);
}

void PandaGen::AsyncGeneratorReject(const ir::AstNode *node, VReg asyncGenObj)
{
    ra_.Emit<Asyncgeneratorreject>(node, asyncGenObj); // value is in acc
}

void PandaGen::GetTemplateObject(const ir::AstNode *node, VReg value)
{
    LoadAccumulator(node, value);
    ra_.Emit<Gettemplateobject>(node, 0);
}

void PandaGen::CopyRestArgs(const ir::AstNode *node, uint32_t index)
{
    index <= util::Helpers::MAX_INT8 ? ra_.Emit<Copyrestargs>(node, index) : ra_.Emit<WideCopyrestargs>(node, index);
}

void PandaGen::GetPropIterator(const ir::AstNode *node)
{
    ra_.Emit<Getpropiterator>(node);
}

void PandaGen::GetNextPropName(const ir::AstNode *node, VReg iter)
{
    ra_.Emit<Getnextpropname>(node, iter);
}

void PandaGen::CreateEmptyObject(const ir::AstNode *node)
{
    ra_.Emit<Createemptyobject>(node);
}

void PandaGen::CreateObjectWithBuffer(const ir::AstNode *node, uint32_t idx)
{
    ASSERT(util::Helpers::IsInteger<uint32_t>(idx));
    std::string idxStr = std::string(context_->Binder()->Program()->RecordName()) + "_" + std::to_string(idx);
    util::UString litId(idxStr, allocator_);
    ra_.Emit<Createobjectwithbuffer>(node, 0, litId.View());
}

void PandaGen::SetObjectWithProto(const ir::AstNode *node, VReg proto, VReg obj)
{
    LoadAccumulator(node, obj);
    ra_.Emit<Setobjectwithproto>(node, 0, proto);
}

void PandaGen::CopyDataProperties(const ir::AstNode *node, VReg dst)
{
    ra_.Emit<Copydataproperties>(node, dst); // use acc as srcObj
}

void PandaGen::DefineGetterSetterByValue(const ir::AstNode *node, VReg obj, VReg name, VReg getter, VReg setter,
                                         bool setName)
{
    LoadConst(node, setName ? Constant::JS_TRUE : Constant::JS_FALSE);
    ra_.Emit<Definegettersetterbyvalue>(node, obj, name, getter, setter);
}

void PandaGen::CreateEmptyArray(const ir::AstNode *node)
{
    ra_.Emit<Createemptyarray>(node, 0);
}

void PandaGen::CreateArrayWithBuffer(const ir::AstNode *node, uint32_t idx)
{
    ASSERT(util::Helpers::IsInteger<uint32_t>(idx));
    std::string idxStr = std::string(context_->Binder()->Program()->RecordName()) + "_" + std::to_string(idx);
    util::UString litId(idxStr, allocator_);
    ra_.Emit<Createarraywithbuffer>(node, 0, litId.View());
}

void PandaGen::CreateArray(const ir::AstNode *node, const ArenaVector<ir::Expression *> &elements, VReg obj)
{
    if (elements.empty()) {
        CreateEmptyArray(node);
        StoreAccumulator(node, obj);
        return;
    }

    auto *buf = NewLiteralBuffer();

    size_t i = 0;
    // This loop handles constant literal data by collecting it into a literal buffer
    // until a non-constant element is encountered.
    while (i < elements.size() && util::Helpers::IsConstantExpr(elements[i])) {
        buf->Add(elements[i]->AsLiteral());
        i++;
    }

    if (buf->IsEmpty()) {
        CreateEmptyArray(node);
    } else {
        uint32_t bufIdx = AddLiteralBuffer(buf);
        CreateArrayWithBuffer(node, bufIdx);
    }

    StoreAccumulator(node, obj);

    if (i == elements.size()) {
        return;
    }

    bool hasSpread = false;

    // This loop handles array elements until a spread element is encountered
    for (; i < elements.size(); i++) {
        const ir::Expression *elem = elements[i];

        if (elem->IsOmittedExpression()) {
            continue;
        }

        if (elem->IsSpreadElement()) {
            // The next loop will handle arrays that have a spread element
            hasSpread = true;
            break;
        }

        elem->Compile(this);
        StOwnByIndex(elem, obj, i);
    }

    RegScope rs(this);
    VReg idxReg {};

    if (hasSpread) {
        idxReg = AllocReg();
        LoadAccumulatorInt(node, i);
        StoreAccumulator(node, idxReg);
    }

    // This loop handles arrays that contain spread elements
    for (; i < elements.size(); i++) {
        const ir::Expression *elem = elements[i];

        if (elem->IsSpreadElement()) {
            elem->AsSpreadElement()->Argument()->Compile(this);

            StoreArraySpread(elem, obj, idxReg);

            LoadObjByName(node, obj, "length");
            StoreAccumulator(elem, idxReg);
            continue;
        }

        if (!elem->IsOmittedExpression()) {
            elem->Compile(this);
            StOwnByValue(elem, obj, idxReg);
        }

        Unary(elem, lexer::TokenType::PUNCTUATOR_PLUS_PLUS, idxReg);
        StoreAccumulator(elem, idxReg);
    }

    // If the last element is omitted, we also have to update the length property
    if (elements.back()->IsOmittedExpression()) {
        // if there was a spread value then acc already contains the length
        if (!hasSpread) {
            LoadAccumulatorInt(node, i);
        }

        StOwnByName(node, obj, "length");
    }

    LoadAccumulator(node, obj);
}

void PandaGen::StoreArraySpread(const ir::AstNode *node, VReg array, VReg index)
{
    ra_.Emit<Starrayspread>(node, array, index);
}

void PandaGen::ThrowIfNotObject(const ir::AstNode *node, VReg obj)
{
    ra_.Emit<ThrowIfnotobject>(node, obj);
}

void PandaGen::ThrowThrowNotExist(const ir::AstNode *node)
{
    ra_.Emit<ThrowNotexists>(node);
}

void PandaGen::GetIterator(const ir::AstNode *node)
{
    ra_.Emit<Getiterator>(node, 0);
}

void PandaGen::GetAsyncIterator(const ir::AstNode *node)
{
    ra_.Emit<Getasynciterator>(node, 0);
}

void PandaGen::CreateObjectWithExcludedKeys(const ir::AstNode *node, VReg obj, VReg argStart, size_t argCount)
{
    ASSERT(argStart == obj + 1);
    if (argCount == 0) {
        LoadConst(node, Constant::JS_UNDEFINED);
        StoreAccumulator(node, argStart);
    }

    size_t argRegCnt = (argCount == 0 ? argCount : argCount - 1);

    if (argRegCnt <= util::Helpers::MAX_INT8) {
        ra_.EmitRange<Createobjectwithexcludedkeys>(node, argCount, static_cast<int64_t>(argRegCnt), obj, argStart);
        return;
    }

    ra_.EmitRange<WideCreateobjectwithexcludedkeys>(node, argCount, static_cast<int64_t>(argRegCnt), obj, argStart);
}

void PandaGen::ThrowObjectNonCoercible(const ir::AstNode *node)
{
    ra_.Emit<ThrowPatternnoncoercible>(node);
}

void PandaGen::CloseIterator(const ir::AstNode *node, VReg iter)
{
    ra_.Emit<Closeiterator>(node, 0, iter);
}

void PandaGen::DefineClassWithBuffer(const ir::AstNode *node, const util::StringView &ctorId, int32_t litIdx, VReg base)
{
    auto formalParamCnt = node->AsClassDefinition()->Ctor()->Function()->FormalParamsLength();
    std::string idxStr = std::string(context_->Binder()->Program()->RecordName()) + "_" + std::to_string(litIdx);
    util::UString litId(idxStr, allocator_);
    ra_.Emit<Defineclasswithbuffer>(node, 0, ctorId, litId.View(), static_cast<int64_t>(formalParamCnt), base);
    strings_.insert(ctorId);
}

void PandaGen::LoadLocalModuleVariable(const ir::AstNode *node, const binder::ModuleVariable *variable)
{
    auto index = variable->Index();
    index <= util::Helpers::MAX_INT8 ? ra_.Emit<Ldlocalmodulevar>(node, index) :
                                       ra_.Emit<WideLdlocalmodulevar>(node, index);
}

void PandaGen::LoadExternalModuleVariable(const ir::AstNode *node, const binder::ModuleVariable *variable)
{
    auto index = variable->Index();
    index <= util::Helpers::MAX_INT8 ? ra_.Emit<Ldexternalmodulevar>(node, index) :
                                       ra_.Emit<WideLdexternalmodulevar>(node, index);
}

void PandaGen::StoreModuleVariable(const ir::AstNode *node, const binder::ModuleVariable *variable)
{
    auto index = variable->Index();
    index <= util::Helpers::MAX_INT8 ? ra_.Emit<Stmodulevar>(node, index) :
                                       ra_.Emit<WideStmodulevar>(node, index);
}

void PandaGen::GetModuleNamespace(const ir::AstNode *node, uint32_t index)
{
    index <= util::Helpers::MAX_INT8 ? ra_.Emit<Getmodulenamespace>(node, index) :
                                       ra_.Emit<WideGetmodulenamespace>(node, index);
}

void PandaGen::DynamicImportCall(const ir::AstNode *node)
{
    ra_.Emit<Dynamicimport>(node);
}

void PandaGen::StSuperByName(const ir::AstNode *node, VReg obj, const util::StringView &key)
{
    ra_.Emit<Stsuperbyname>(node, 0, key, obj);
    strings_.insert(key);
}

void PandaGen::LdSuperByName(const ir::AstNode *node, VReg obj, const util::StringView &key)
{
    LoadAccumulator(node, obj); // object is load to acc
    ra_.Emit<Ldsuperbyname>(node, 0, key);
    strings_.insert(key);
}

void PandaGen::StSuperByValue(const ir::AstNode *node, VReg obj, VReg prop)
{
    ra_.Emit<Stsuperbyvalue>(node, 0, obj, prop);
}

void PandaGen::LdSuperByValue(const ir::AstNode *node, VReg obj)
{
    ra_.Emit<Ldsuperbyvalue>(node, 0, obj); // prop is in acc
}

void PandaGen::StoreSuperProperty(const ir::AstNode *node, VReg obj, const Operand &prop)
{
    if (std::holds_alternative<util::StringView>(prop)) {
        StSuperByName(node, obj, std::get<util::StringView>(prop));
        return;
    }

    if (std::holds_alternative<VReg>(prop)) {
        StSuperByValue(node, obj, std::get<VReg>(prop));
        return;
    }

    ASSERT(std::holds_alternative<int64_t>(prop));
    RegScope rs(this);
    VReg property = AllocReg();
    VReg value = AllocReg();

    StoreAccumulator(node, value);
    LoadAccumulatorInt(node, static_cast<size_t>(std::get<int64_t>(prop)));
    StoreAccumulator(node, property);
    LoadAccumulator(node, value);
    StSuperByValue(node, obj, property);
}

void PandaGen::LoadSuperProperty(const ir::AstNode *node, VReg obj, const Operand &prop)
{
    if (std::holds_alternative<util::StringView>(prop)) {
        LdSuperByName(node, obj, std::get<util::StringView>(prop));
        return;
    }

    if (std::holds_alternative<VReg>(prop)) {
        LoadAccumulator(node, std::get<VReg>(prop));
        LdSuperByValue(node, obj);
        return;
    }

    ASSERT(std::holds_alternative<int64_t>(prop));

    LoadAccumulatorInt(node, static_cast<size_t>(std::get<int64_t>(prop)));
    LdSuperByValue(node, obj);
}

void PandaGen::LoadLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot)
{
    if ((level > util::Helpers::MAX_INT8) || (slot > util::Helpers::MAX_INT8)) {
        ra_.Emit<WideLdlexvar>(node, level, slot);
        return;
    }

    ra_.Emit<Ldlexvar>(node, level, slot);
}

void PandaGen::LoadLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot, const util::StringView &name)
{
    if (context_->HotfixHelper() && context_->HotfixHelper()->IsPatchVar(slot)) {
        uint32_t patchSlot = context_->HotfixHelper()->GetPatchLexicalIdx(std::string(name));
        ra_.Emit<WideLdpatchvar>(node, patchSlot);
        return;
    }

    if ((level > util::Helpers::MAX_INT8) || (slot > util::Helpers::MAX_INT8)) {
        ra_.Emit<WideLdlexvar>(node, level, slot);
        return;
    }

    ra_.Emit<Ldlexvar>(node, level, slot);
}

void PandaGen::StoreLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot)
{
    if ((level > util::Helpers::MAX_INT8) || (slot > util::Helpers::MAX_INT8)) {
        ra_.Emit<WideStlexvar>(node, level, slot);
        return;
    }

    ra_.Emit<Stlexvar>(node, level, slot);
}

void PandaGen::StoreLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot, VReg value)
{
    LoadAccumulator(node, value);
    if ((level > util::Helpers::MAX_INT8) || (slot > util::Helpers::MAX_INT8)) {
        ra_.Emit<WideStlexvar>(node, level, slot);
        return;
    }

    ra_.Emit<Stlexvar>(node, level, slot);
}

void PandaGen::StoreLexicalVar(const ir::AstNode *node, uint32_t level, uint32_t slot, const util::StringView &name)
{
    if (context_->HotfixHelper() && context_->HotfixHelper()->IsPatchVar(slot)) {
        uint32_t patchSlot = context_->HotfixHelper()->GetPatchLexicalIdx(std::string(name));
        ra_.Emit<WideStpatchvar>(node, patchSlot);
        return;
    }
    RegScope rs(this);
    VReg value = AllocReg();
    StoreAccumulator(node, value);
    StoreLexicalVar(node, level, slot, value);
}

void PandaGen::ThrowIfSuperNotCorrectCall(const ir::AstNode *node, int64_t num)
{
    ra_.Emit<ThrowIfsupernotcorrectcall>(node, num);
}

void PandaGen::ThrowUndefinedIfHole(const ir::AstNode *node, const util::StringView &name)
{
    ra_.Emit<ThrowUndefinedifholewithname>(node, name);
    strings_.insert(name);
}

void PandaGen::ThrowConstAssignment(const ir::AstNode *node, const util::StringView &name)
{
    RegScope rs(this);
    LoadAccumulatorString(node, name);
    VReg nameReg = AllocReg();
    StoreAccumulator(node, nameReg);
    ra_.Emit<ThrowConstassignment>(node, nameReg);
    strings_.insert(name);
}

void PandaGen::PopLexEnv(const ir::AstNode *node)
{
    ra_.Emit<Poplexenv>(node);
}

void PandaGen::CopyLexEnv(const ir::AstNode *node)
{
    /*
     *  TODO: add copy lexenv to optimize the loop env creation
     *  ra_.Emit<EcmaCopylexenvdyn>(node);
     */
}

void PandaGen::NewLexicalEnv(const ir::AstNode *node, uint32_t num, binder::VariableScope *scope)
{
    if (IsDebug()) {
        int32_t scopeInfoIdx = AddLexicalVarNamesForDebugInfo(scope->GetLexicalVarNameAndTypes());
        NewLexEnvWithScopeInfo(node, num, scopeInfoIdx);
        return;
    }

    NewLexEnv(node, num);
}

void PandaGen::NewLexEnv(const ir::AstNode *node, uint32_t num)
{
    num <= util::Helpers::MAX_INT8 ? ra_.Emit<Newlexenv>(node, num) : ra_.Emit<WideNewlexenv>(node, num);
}

void PandaGen::NewLexEnvWithScopeInfo(const ir::AstNode *node, uint32_t num, int32_t scopeInfoIdx)
{
    std::string idxStr = std::string(context_->Binder()->Program()->RecordName()) + "_" + std::to_string(scopeInfoIdx);
    util::UString litId(idxStr, allocator_);
    num <= util::Helpers::MAX_INT8 ? ra_.Emit<Newlexenvwithname>(node, num, litId.View()) :
                                     ra_.Emit<WideNewlexenvwithname>(node, num, litId.View());
}

uint32_t PandaGen::TryDepth() const
{
    const auto *iter = dynamicContext_;
    uint32_t depth = 0;

    while (iter) {
        if (iter->HasTryCatch()) {
            depth++;
        }

        iter = iter->Prev();
    }

    return depth;
}

CatchTable *PandaGen::CreateCatchTable()
{
    auto *catchTable = allocator_->New<CatchTable>(this, TryDepth());
    catchList_.push_back(catchTable);
    return catchTable;
}

void PandaGen::SortCatchTables()
{
    std::sort(catchList_.begin(), catchList_.end(),
              [](const CatchTable *a, const CatchTable *b) { return b->Depth() < a->Depth(); });
}

Operand PandaGen::ToNamedPropertyKey(const ir::Expression *prop, bool isComputed)
{
    VReg res {0};

    if (isComputed) {
        return res;
    }

    if (prop->IsIdentifier()) {
        return prop->AsIdentifier()->Name();
    }

    if (prop->IsStringLiteral()) {
        const util::StringView &str = prop->AsStringLiteral()->Str();

        /* TODO(dbatyai): remove this when runtime handles __proto__ as property name correctly */
        if (str.Is("__proto__")) {
            return res;
        }

        int64_t index = util::Helpers::GetIndex(str);
        if (index != util::Helpers::INVALID_INDEX) {
            return index;
        }

        return str;
    }

    if (prop->IsNumberLiteral()) {
        auto num = prop->AsNumberLiteral()->Number<double>();
        if (util::Helpers::IsIndex(num)) {
            return static_cast<int64_t>(num);
        }

        return prop->AsNumberLiteral()->Str();
    }

    return res;
}

Operand PandaGen::ToPropertyKey(const ir::Expression *prop, bool isComputed)
{
    Operand op = ToNamedPropertyKey(prop, isComputed);
    if (std::holds_alternative<util::StringView>(op) || (std::holds_alternative<int64_t>(op) &&
        (std::get<int64_t>(op) <= util::Helpers::MAX_INT32))) {
        return op;
    }

    VReg propReg = AllocReg();

    /**
     * Store index to vreg when index > MAX_INT32 to simplify ASM interpreter If byindex-related instructions support
     * index > MAX_INT32, ASM interpreter will have to add a judgment whether index needs more than 32 bits which will
     * cause inefficiency of it since cases when index > MAX_INT32 can be quite rare
     **/
    if (std::holds_alternative<int64_t>(op) && (std::get<int64_t>(op) > util::Helpers::MAX_INT32)) {
        LoadAccumulatorFloat(prop, std::get<int64_t>(op));
        StoreAccumulator(prop, propReg);
        return propReg;
    }

    ASSERT(std::holds_alternative<VReg>(op));
    prop->Compile(this);
    StoreAccumulator(prop, propReg);

    return propReg;
}

VReg PandaGen::LoadPropertyKey(const ir::Expression *prop, bool isComputed)
{
    Operand op = ToNamedPropertyKey(prop, isComputed);

    if (std::holds_alternative<util::StringView>(op)) {
        LoadAccumulatorString(prop, std::get<util::StringView>(op));
    } else if (std::holds_alternative<int64_t>(op)) {
        LoadAccumulatorInt(prop, static_cast<size_t>(std::get<int64_t>(op)));
    } else {
        prop->Compile(this);
    }

    VReg propReg = AllocReg();
    StoreAccumulator(prop, propReg);

    return propReg;
}

void PandaGen::StLetOrClassToGlobalRecord(const ir::AstNode *node, const util::StringView &name)
{
    ra_.Emit<Sttoglobalrecord>(node, 0, name);
    strings_.insert(name);
}

void PandaGen::StConstToGlobalRecord(const ir::AstNode *node, const util::StringView &name)
{
    ra_.Emit<Stconsttoglobalrecord>(node, 0, name);
    strings_.insert(name);
}

bool PandaGen::TryCompileFunctionCallOrNewExpression(const ir::Expression *expr)
{
    ASSERT(expr->IsCallExpression() || expr->IsNewExpression());
    const auto *callee = expr->IsCallExpression() ? expr->AsCallExpression()->Callee() :
                         expr->AsNewExpression()->Callee();

    if (!callee->IsIdentifier()) {
        return false;
    }

    if (callee->AsIdentifier()->Name().Is("Function")) {
        auto arguments = expr->IsCallExpression() ? expr->AsCallExpression()->Arguments() :
                         expr->AsNewExpression()->Arguments();
        if (arguments.empty()) {
            return false;
        }

        auto *arg = arguments[arguments.size() - 1];
        if (!arg->IsStringLiteral()) {
            return false;
        }

        if (std::regex_match(arg->AsStringLiteral()->Str().Mutf8(), std::regex(" *return +this[;]? *$"))) {
            LoadConst(arg, Constant::JS_GLOBAL);
            return true;
        }
    }

    return false;
}

}  // namespace panda::es2panda::compiler
