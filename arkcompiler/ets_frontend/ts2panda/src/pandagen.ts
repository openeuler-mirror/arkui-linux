/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Implementation of bytecode generator.
 * The PandaGen works with IR and provides an API
 * to the compiler.
 *
 * This file should not contain imports of TypeScipt's AST nodes.
 */
import * as ts from "typescript";
import {
    BinaryOperator,
    PrefixUnaryOperator,
    SyntaxKind
} from "typescript";
import {
    call,
    closeIterator,
    copyDataProperties,
    creatDebugger,
    createArrayWithBuffer,
    createEmptyArray,
    createEmptyObject,
    createObjectWithBuffer,
    createObjectWithExcludedKeys,
    createRegExpWithLiteral,
    defineClassWithBuffer,
    defineFunc,
    defineGetterSetterByValue,
    defineMethod,
    deleteObjProperty,
    dynamicImport,
    getIterator,
    getNextPropName,
    getPropIterator,
    getModuleNamespace,
    isFalse,
    isTrue,
    jumpTarget,
    ldSuperByName,
    ldSuperByValue,
    loadAccumulator,
    loadAccumulatorFloat,
    loadAccumulatorInt,
    loadAccumulatorString,
    loadExternalModuleVariable,
    loadGlobalVar,
    loadLexicalVar,
    loadLocalModuleVariable,
    loadObjByIndex,
    loadObjByName,
    loadObjByValue,
    moveVreg,
    newLexicalEnv,
    newObject,
    popLexicalEnv,
    returnUndefined,
    setObjectWithProto,
    stConstToGlobalRecord,
    stLetOrClassToGlobalRecord,
    storeAccumulator,
    storeArraySpread,
    storeGlobalVar,
    storeLexicalVar,
    storeModuleVariable,
    storeObjByIndex,
    storeObjByName,
    storeObjByValue,
    storeOwnByIndex,
    storeOwnByName,
    storeOwnByValue,
    stSuperByName,
    stSuperByValue,
    superCall,
    superCallInArrow,
    superCallSpread,
    throwConstAssignment,
    throwDeleteSuperProperty,
    throwException,
    throwIfNotObject,
    throwIfSuperNotCorrectCall,
    throwObjectNonCoercible,
    throwThrowNotExists,
    throwUndefinedIfHole,
    tryLoadGlobalByName,
    tryStoreGlobalByName,
    loadAccumulatorBigInt
} from "./base/bcGenUtil";
import {
    Literal,
    LiteralBuffer,
    LiteralTag
} from "./base/literal";
import { BaseType } from "./base/typeSystem";
import { getParamLengthOfFunc, MAX_INT8 } from "./base/util";
import {
    CacheList,
    getVregisterCache,
    VregisterCache
} from "./base/vregisterCache";
import { CmdOptions } from "./cmdOptions";
import {
    DebugInfo,
    NodeKind,
    VariableDebugInfo
} from "./debuginfo";
import { isInteger } from "./expression/numericLiteral";
import {
    Asyncgeneratorreject,
    Add2,
    And2,
    Ashr2,
    Asyncfunctionawaituncaught,
    Asyncfunctionenter,
    Asyncfunctionreject,
    Asyncfunctionresolve,
    Apply,
    Copyrestargs,
    WideCopyrestargs,
    Creategeneratorobj,
    Createasyncgeneratorobj,
    Createiterresultobj,
    Asyncgeneratorresolve,
    Dec,
    Div2,
    Eq,
    Exp,
    Getasynciterator,
    Getresumemode,
    Gettemplateobject,
    Getunmappedargs,
    Greater,
    Greatereq,
    Inc,
    Instanceof,
    Isin,
    Less,
    Lesseq,
    Mod2,
    Mul2,
    Neg,
    Newobjapply,
    Not,
    Noteq,
    Or2,
    Resumegenerator,
    Setgeneratorstate,
    Shl2,
    Shr2,
    Stricteq,
    Strictnoteq,
    Sub2,
    Suspendgenerator,
    Tonumber,
    Tonumeric,
    Typeof,
    Xor2,
    Imm,
    IRNode,
    Jeqz,
    Label,
    Return,
    VReg
} from "./irnodes";
import {
    VariableAccessLoad,
    VariableAcessStore
} from "./lexenv";
import { LOGE } from "./log";
import {
    FunctionScope,
    LoopScope,
    Scope,
    VariableScope
} from "./scope";
import { CatchTable } from "./statement/tryStatement";
import { TypeRecorder } from "./typeRecorder";
import {
    MandatoryArguments,
    ModuleVariable,
    Variable
} from "./variable";
import * as jshelpers from "./jshelpers";
import { CompilerDriver } from "./compilerDriver";
import { getLiteralKey } from "./base/util";
import { AsyncGeneratorState } from "./function/asyncGeneratorFunctionBuilder";

export enum FunctionKind {
    NONE = 0, // represent method for now
    FUNCTION = 1,
    NC_FUNCTION = 2,
    GENERATOR_FUNCTION = 3,
    ASYNC_FUNCTION = 4,
    ASYNC_GENERATOR_FUNCTION = 5,
    ASYNC_NCFUNCTION = 6
}
export class PandaGen {
    // @ts-ignore
    private debugTag: string = "PandaGen";
    readonly internalName: string;
    private node: ts.SourceFile | ts.FunctionLikeDeclaration;
    private parametersCount: number;
    private locals: VReg[] = [];
    private temps: VReg[] = [];
    private insns: IRNode[] = [];
    private instTypeMap: Map<IRNode, number> = new Map<IRNode, number>();
    private scope: Scope | undefined;
    private vregisterCache: VregisterCache;
    private catchMap: Map<Label, CatchTable> = new Map<Label, CatchTable>();
    private totalRegsNum = 0;
    // for debug info
    private variableDebugInfoArray: VariableDebugInfo[] = [];
    private firstStmt: ts.Statement | undefined;
    private sourceFile: string = "";
    private sourceCode: string | undefined = undefined;
    private callType: number = 0;
    private funcKind: FunctionKind = FunctionKind.NONE;
    private icSize: number = 0;

    private static literalArrayBuffer: Array<LiteralBuffer> = new Array<LiteralBuffer>();

    constructor(internalName: string, node: ts.SourceFile | ts.FunctionLikeDeclaration,
                parametersCount: number, scope: Scope | undefined = undefined) {
        this.internalName = internalName;
        this.node = node;
        this.parametersCount = parametersCount;
        this.scope = scope;
        this.vregisterCache = new VregisterCache();
        this.setFunctionKind(node);
    }

    public appendScopeInfo(lexVarInfo: Map<string, number>): string | undefined {
        if (lexVarInfo.size == 0) {
            return undefined;
        }

        let scopeInfoId: string | undefined = undefined;
        let scopeInfo = new LiteralBuffer();
        let scopeInfoLiterals = new Array<Literal>();
        scopeInfoLiterals.push(new Literal(LiteralTag.INTEGER, lexVarInfo.size));
        lexVarInfo.forEach((slot: number, name: string) => {
            scopeInfoLiterals.push(new Literal(LiteralTag.STRING, name));
            scopeInfoLiterals.push(new Literal(LiteralTag.INTEGER, slot));
        });
        scopeInfo.addLiterals(...scopeInfoLiterals);
        scopeInfoId = PandaGen.appendLiteralArrayBuffer(scopeInfo);
        return scopeInfoId;
    }

    public setFunctionKind(node: ts.SourceFile | ts.FunctionLikeDeclaration) {
        if (ts.isSourceFile(node)) {
            this.funcKind = FunctionKind.FUNCTION;
            return;
        }

        if (ts.isMethodDeclaration(node)) {
            return;
        }

        if (node.modifiers) {
            for (let i = 0; i < node.modifiers.length; i++) {
                if (node.modifiers[i].kind == ts.SyntaxKind.AsyncKeyword) {
                    if (node.asteriskToken) {
                        this.funcKind = FunctionKind.ASYNC_GENERATOR_FUNCTION;
                        return;
                    }

                    if (ts.isArrowFunction(node)) {
                        this.funcKind = FunctionKind.ASYNC_NCFUNCTION;
                        return;
                    }

                    this.funcKind = FunctionKind.ASYNC_FUNCTION;
                    return;
                }
            }
        }

        if (node.asteriskToken) {
            this.funcKind = FunctionKind.GENERATOR_FUNCTION;
            return;
        }

        if (ts.isArrowFunction(node)) {
            this.funcKind = FunctionKind.NC_FUNCTION;
            return;
        }

        this.funcKind = FunctionKind.FUNCTION;
    }

    public getFunctionKind() {
        return this.funcKind;
    }

    public setCallType(callType: number) {
        this.callType = callType;
    }

    public getCallType(): number {
        return this.callType;
    }

    public updateIcSize(icSlot: number) {
        this.icSize += icSlot;
    }

    public getIcSize() {
        return this.icSize;
    }

    static getExportedTypes() {
        if (TypeRecorder.getInstance()) {
            return TypeRecorder.getInstance().getExportedType();
        } else {
            return new Map<string, number>();
        }
    }

    static getDeclaredTypes() {
        if (TypeRecorder.getInstance()) {
            return TypeRecorder.getInstance().getDeclaredType();
        } else {
            return new Map<string, number>();
        }
    }

    public getSourceCode(): string | undefined {
        return this.sourceCode;
    }

    public setSourceCode(code: string) {
        this.sourceCode = code;
    }

    public getSourceFileDebugInfo() {
        return this.sourceFile;
    }

    public setSourceFileDebugInfo(sourceFile: string) {
        this.sourceFile = sourceFile;
    }

    static getLiteralArrayBuffer() {
        return PandaGen.literalArrayBuffer;
    }

    static clearLiteralArrayBuffer() {
        PandaGen.literalArrayBuffer = [];
    }

    getParameterLength() {
        if (this.scope instanceof FunctionScope) {
            return this.scope.getParameterLength();
        }
    }

    getFuncName() {
        if (this.scope instanceof FunctionScope) {
            return this.scope.getFuncName();
        } else {
            return "main";
        }
    }

    static appendLiteralArrayBuffer(litBuf: LiteralBuffer): string {
        let litId = getLiteralKey(CompilerDriver.srcNode, PandaGen.literalArrayBuffer.length);
        litBuf.setKey(litId);
        PandaGen.literalArrayBuffer.push(litBuf);
        return litId;
    }

    static appendTypeArrayBuffer(type: BaseType): number {
        let index = PandaGen.literalArrayBuffer.length;
        let typeBuf = type.transfer2LiteralBuffer();
        typeBuf.setKey(getLiteralKey(CompilerDriver.srcNode, index));
        PandaGen.literalArrayBuffer.push(typeBuf);
        return index;
    }

    static setTypeArrayBuffer(type: BaseType, index: number) {
        let typeBuf = type.transfer2LiteralBuffer();
        typeBuf.setKey(getLiteralKey(CompilerDriver.srcNode, index));
        PandaGen.literalArrayBuffer[index] = typeBuf;
    }

    getFirstStmt() {
        return this.firstStmt;
    }

    setFirstStmt(firstStmt: ts.Statement) {
        if (this.firstStmt) {
            return;
        }
        this.firstStmt = firstStmt;
    }

    getVregisterCache() {
        return this.vregisterCache;
    }

    getCatchMap() {
        return this.catchMap;
    }

    getScope(): Scope | undefined {
        return this.scope;
    }

    getVariableDebugInfoArray(): VariableDebugInfo[] {
        return this.variableDebugInfoArray;
    }

    addDebugVariableInfo(variable: VariableDebugInfo) {
        this.variableDebugInfoArray.push(variable);
    }

    allocLocalVreg(): VReg {
        let vreg = new VReg();
        this.locals.push(vreg);
        return vreg;
    }

    getVregForVariable(v: Variable): VReg {
        if (v.hasAlreadyBinded()) {
            return v.getVreg();
        }
        let vreg = this.allocLocalVreg();
        v.bindVreg(vreg);
        return vreg;
    }

    getTemp(): VReg {
        let retval: VReg;
        if (this.temps.length > 0) {
            retval = this.temps.shift()!;
        } else {
            retval = new VReg();
        }

        return retval;
    }

    freeTemps(...temps: VReg[]) {
        this.temps.unshift(...temps);
    }

    getInsns(): IRNode[] {
        return this.insns;
    }

    setInsns(insns: IRNode[]) {
        this.insns = insns;
    }

    printInsns() {
        LOGE("function " + this.internalName + "() {");
        this.getInsns().forEach(ins => {
            LOGE(ins.toString());
        })
        LOGE("}");
    }

    setTotalRegsNum(num: number) {
        this.totalRegsNum = num;
    }

    getTotalRegsNum(): number {
        return this.totalRegsNum;
    }

    setParametersCount(count: number) {
        this.parametersCount = count;
    }

    getParametersCount(): number {
        return this.parametersCount;
    }

    setLocals(locals: VReg[]) {
        this.locals = locals;
    }

    getLocals(): VReg[] {
        return this.locals;
    }

    getTemps(): VReg[] {
        return this.temps;
    }

    getInstTypeMap() {
        return this.instTypeMap;
    }

    getNode() {
        return this.node;
    }

    storeAccumulator(node: ts.Node | NodeKind, vreg: VReg) {
        this.add(node, storeAccumulator(vreg));
    }

    generatorYield(node: ts.Node, genObj: VReg) {
        this.add(
            node,
            loadAccumulator(genObj),
            new Setgeneratorstate(new Imm(AsyncGeneratorState.SUSPENDYIELD))
        )
    }

    generatorComplete(node: ts.Node | NodeKind, genObj: VReg) {
        this.add(
            node,
            loadAccumulator(genObj),
            new Setgeneratorstate(new Imm(AsyncGeneratorState.COMPLETED))
        )
    }

    loadAccFromArgs(node: ts.Node) {
        if ((<VariableScope>this.scope).getUseArgs()) {
            let v = this.scope!.findLocal(MandatoryArguments);
            if (this.scope instanceof FunctionScope) {
                this.scope.setArgumentsOrRestargs();
            }
            if (v) {
                let paramVreg = this.getVregForVariable(v);
                this.getUnmappedArgs(node);
                this.add(node, storeAccumulator(paramVreg));
            } else {
                throw new Error("fail to get arguments");
            }
        }
    }

    deleteObjProperty(node: ts.Node, obj: VReg) {
        this.add(node, deleteObjProperty(obj));
    }

    loadAccumulator(node: ts.Node | NodeKind, vreg: VReg) {
        this.add(node, loadAccumulator(vreg));
    }

    createLexEnv(node: ts.Node, scope: VariableScope | LoopScope) {
        let numVars = scope.getNumLexEnv();
        let scopeInfoId: string | undefined = undefined;
        let lexVarInfo = scope.getLexVarInfo();
        if (CmdOptions.isDebugMode()) {
            scopeInfoId = this.appendScopeInfo(lexVarInfo);
        }

        this.add(
            node,
            newLexicalEnv(numVars, scopeInfoId),
        )
    }

    newLexicalEnv(node, numVars: number) {
        this.add(
            node,
            newLexicalEnv(numVars, undefined),
        )
    }

    popLexicalEnv(node: ts.Node) {
        this.add(
            node,
            popLexicalEnv()
        )
    }

    loadAccFromLexEnv(node: ts.Node, scope: Scope, level: number, v: Variable) {
        let expander = new VariableAccessLoad(scope, level, v);
        let insns = expander.expand(this);
        this.add(
            node,
            ...insns
        );
    }

    storeAccToLexEnv(node: ts.Node | NodeKind, scope: Scope, level: number, v: Variable, isDeclaration: boolean) {
        let expander = new VariableAcessStore(scope, level, v, isDeclaration, node);
        let insns = expander.expand(this);
        this.add(
            node,
            ...insns
        )
    }

    loadObjProperty(node: ts.Node, obj: VReg, prop: VReg | string | number) {
        switch (typeof (prop)) {
            case "number": {
                if (isInteger(prop)) {
                    this.loadObjByIndex(node, obj, prop);
                } else {
                    let propReg = this.getTemp();
                    this.add(
                        node,
                        loadAccumulatorFloat(prop),
                        storeAccumulator(propReg),
                    );
                    this.loadObjByValue(node, obj, propReg);
                    this.freeTemps(propReg);
                }
                break;
            }
            case "string":
                this.loadObjByName(node, obj, prop);
                break;
            default:
                this.loadObjByValue(node, obj, prop);
        }
    }

    storeObjProperty(node: ts.Node | NodeKind, obj: VReg, prop: VReg | string | number) {
        switch (typeof (prop)) {
            case "number":
                if (isInteger(prop)) {
                    this.storeObjByIndex(node, obj, prop);
                } else {
                    let valueReg = this.getTemp();
                    let propReg = this.getTemp();
                    this.storeAccumulator(node, valueReg);
                    this.add(
                        node,
                        loadAccumulatorFloat(prop),
                        storeAccumulator(propReg),
                        loadAccumulator(valueReg)
                    );
                    this.storeObjByValue(node, obj, propReg);
                    this.freeTemps(valueReg, propReg);
                }
                break;
            case "string":
                this.storeObjByName(node, obj, prop);
                break;
            default:
                this.storeObjByValue(node, obj, prop);
        }
    }

    storeOwnProperty(node: ts.Node | NodeKind, obj: VReg, prop: VReg | string | number, nameSetting: boolean = false) {
        switch (typeof prop) {
            case "number": {
                if (isInteger(prop)) {
                    this.stOwnByIndex(node, obj, prop);
                } else {
                    let valueReg = this.getTemp();
                    let propReg = this.getTemp();
                    this.storeAccumulator(node, valueReg);
                    this.add(
                        node,
                        loadAccumulatorFloat(prop),
                        storeAccumulator(propReg),
                        loadAccumulator(valueReg)
                    );
                    this.stOwnByValue(node, obj, propReg, nameSetting);
                    this.freeTemps(valueReg, propReg);
                }
                break;
            }
            case "string":
                this.stOwnByName(node, obj, prop, nameSetting);
                break;
            default:
                this.stOwnByValue(node, obj, prop, nameSetting);
        }
    }

    private loadObjByName(node: ts.Node, obj: VReg, string_id: string) {
        this.add(
            node,
            loadAccumulator(obj),
            loadObjByName(string_id)
        );
    }

    private storeObjByName(node: ts.Node | NodeKind, obj: VReg, string_id: string) {
        this.add(
            node,
            storeObjByName(obj, string_id)
        );
    }

    private loadObjByIndex(node: ts.Node, obj: VReg, index: number) {
        this.add(
            node,
            loadAccumulator(obj),
            loadObjByIndex(index)
        )
    }

    private storeObjByIndex(node: ts.Node | NodeKind, obj: VReg, index: number) {
        this.add(
            node,
            storeObjByIndex(obj, index)
        )
    }


    private loadObjByValue(node: ts.Node, obj: VReg, value: VReg) {
        this.add(
            node,
            loadAccumulator(value),
            loadObjByValue(obj)
        )
    }

    private storeObjByValue(node: ts.Node | NodeKind, obj: VReg, prop: VReg) {
        this.add(
            node,
            storeObjByValue(obj, prop)
        )
    }

    private stOwnByName(node: ts.Node | NodeKind, obj: VReg, string_id: string, nameSetting: boolean) {
        this.add(node, storeOwnByName(obj, string_id, nameSetting));
    }

    private stOwnByIndex(node: ts.Node | NodeKind, obj: VReg, index: number) {
        this.add(node, storeOwnByIndex(obj, index));
    }

    private stOwnByValue(node: ts.Node | NodeKind, obj: VReg, value: VReg, nameSetting: boolean) {
        this.add(node, storeOwnByValue(obj, value, nameSetting));
    }

    loadByNameViaDebugger(node: ts.Node, string_id: string, boolVal: CacheList) {
        this.loadObjProperty(node, getVregisterCache(this, CacheList.Global), "debuggerGetValue");
        let getValueReg = this.getTemp();
        this.storeAccumulator(node, getValueReg);
        let variableReg = this.getTemp();
        this.loadAccumulatorString(node, string_id);
        this.storeAccumulator(node, variableReg);
        let trueValueReg = this.getTemp();
        this.moveVreg(node, trueValueReg, getVregisterCache(this, boolVal));
        this.call(node, [getValueReg, variableReg, trueValueReg], false);
        this.freeTemps(getValueReg, variableReg, trueValueReg);
    }

    // eg. print
    tryLoadGlobalByName(node: ts.Node, string_id: string) {
        CmdOptions.isWatchEvaluateExpressionMode() ? this.loadByNameViaDebugger(node, string_id, CacheList.True)
                                : this.add(node, tryLoadGlobalByName(string_id));
    }

    storeByNameViaDebugger(node: ts.Node, string_id: string) {
        let valueReg = this.getTemp();
        this.storeAccumulator(node, valueReg);
        this.loadObjProperty(node, getVregisterCache(this, CacheList.Global), "debuggerSetValue");
        let setValueReg = this.getTemp();
        this.storeAccumulator(node, setValueReg);
        let variableReg = this.getTemp();
        this.loadAccumulatorString(node, string_id);
        this.storeAccumulator(node, variableReg);
        this.call(node, [setValueReg, variableReg, valueReg], false);
        this.freeTemps(valueReg, setValueReg, variableReg);
    }

    // eg. a = 1
    tryStoreGlobalByName(node: ts.Node, string_id: string) {
        CmdOptions.isWatchEvaluateExpressionMode() ? this.storeByNameViaDebugger(node, string_id)
                                : this.add(node, tryStoreGlobalByName(string_id));
    }

    // eg. var n; n;
    loadGlobalVar(node: ts.Node, string_id: string) {
        this.add(
            node,
            loadGlobalVar(string_id));
    }

    // var n = 1;
    storeGlobalVar(node: ts.Node | NodeKind, string_id: string) {
        this.add(
            node,
            storeGlobalVar(string_id));
    }

    loadAccumulatorString(node: ts.Node | NodeKind, str: string) {
        this.add(node, loadAccumulatorString(str));
    }

    loadAccumulatorFloat(node: ts.Node, num: number) {
        this.add(node, loadAccumulatorFloat(num));
    }

    loadAccumulatorInt(node: ts.Node, num: number) {
        this.add(node, loadAccumulatorInt(num));
    }

    moveVreg(node: ts.Node | NodeKind, vd: VReg, vs: VReg) {
        this.add(node, moveVreg(vd, vs));
    }

    // @ts-ignore
    label(node: ts.Node, label: Label) {
        this.add(NodeKind.Invalid, label);
    }

    branch(node: ts.Node | NodeKind, target: Label) {
        this.add(node, jumpTarget(target));
    }

    branchIfNotUndefined(node: ts.Node, target: Label) {
        // the compared value is in acc
        this.condition(node, ts.SyntaxKind.EqualsEqualsToken, getVregisterCache(this, CacheList.undefined), target);
    }

    branchIfUndefined(node: ts.Node, target: Label) {
        // the compared value is in acc
        this.condition(node, ts.SyntaxKind.ExclamationEqualsToken, getVregisterCache(this, CacheList.undefined), target)
    }

    isTrue(node: ts.Node) {
        this.add(
            node,
            isTrue()
        )
    }

    jumpIfTrue(node: ts.Node, target: Label) {
        this.isFalse(node);
        this.add(
            node,
            new Jeqz(target)
        )
    }

    isFalse(node: ts.Node) {
        this.add(
            node,
            isFalse()
        )
    }

    jumpIfFalse(node: ts.Node, target: Label) {
        this.isTrue(node);
        this.add(
            node,
            new Jeqz(target)
        )
    }

    debugger(node: ts.Node) {
        this.add(node, creatDebugger());
    }

    throwUndefinedIfHole(node: ts.Node, name: string) {
        this.add(
            node,
            throwUndefinedIfHole(name)
        )
    }

    less(node: ts.Node, lhs: VReg) {
        this.add(node, new Less(new Imm(0), lhs));
    }

    greater(node: ts.Node, lhs: VReg) {
        this.add(node, new Greater(new Imm(0), lhs));
    }

    greaterEq(node: ts.Node, lhs: VReg) {
        this.add(node, new Greatereq(new Imm(0), lhs));
    }

    lessEq(node: ts.Node, lhs: VReg) {
        this.add(node, new Lesseq(new Imm(0), lhs));
    }

    equal(node: ts.Node, lhs: VReg) {
        this.add(node, new Eq(new Imm(0), lhs));
    }

    notEqual(node: ts.Node, lhs: VReg) {
        this.add(node, new Noteq(new Imm(0), lhs));
    }

    strictEqual(node: ts.Node, lhs: VReg) {
        this.add(node, new Stricteq(new Imm(0), lhs));
    }

    strictNotEqual(node: ts.Node, lhs: VReg) {
        this.add(node, new Strictnoteq(new Imm(0), lhs));
    }

    /**
     * The method generates code for ther following cases
     *          if (lhs OP acc) {...}
     * ifFalse: ...
     */
    condition(node: ts.Node, op: SyntaxKind, lhs: VReg, ifFalse: Label) {
        // Please keep order of cases the same as in types.ts
        switch (op) {
            case SyntaxKind.LessThanToken: // line 57
                this.less(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.GreaterThanToken: // line 59
                this.greater(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.LessThanEqualsToken: // line 60
                this.lessEq(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.GreaterThanEqualsToken: // line 61
                this.greaterEq(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.EqualsEqualsToken: // line 62
                this.equal(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.ExclamationEqualsToken: // line 63
                this.notEqual(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.EqualsEqualsEqualsToken: // line 64
                this.strictEqual(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            case SyntaxKind.ExclamationEqualsEqualsToken: // line 65
                this.strictNotEqual(node, lhs);
                this.add(node, new Jeqz(ifFalse));
                break;
            default:
                break;
        }
    }

    unary(node: ts.Node, op: PrefixUnaryOperator, operand: VReg) {
        switch (op) {
            case SyntaxKind.PlusToken:
                this.toNumber(node, operand);
                break;
            case SyntaxKind.MinusToken:
                this.add(
                    node,
                    loadAccumulator(operand),
                    new Neg(new Imm(0)));
                break;
            case SyntaxKind.PlusPlusToken:
                this.add(
                    node,
                    loadAccumulator(operand),
                    new Inc(new Imm(0)));
                break;
            case SyntaxKind.MinusMinusToken:
                this.add(
                    node,
                    loadAccumulator(operand),
                    new Dec(new Imm(0)));
                break;
            case SyntaxKind.ExclamationToken:
                let falseLabel = new Label();
                let endLabel = new Label();
                this.jumpIfFalse(node, falseLabel);
                // operand is true
                this.add(node, loadAccumulator(getVregisterCache(this, CacheList.False)));
                this.branch(node, endLabel);
                // operand is false
                this.label(node, falseLabel);
                this.add(node, loadAccumulator(getVregisterCache(this, CacheList.True)));
                this.label(node, endLabel);
                break;
            case SyntaxKind.TildeToken:
                this.add(
                    node,
                    loadAccumulator(operand),
                    new Not(new Imm(0)));
                break;
            default:
                throw new Error("Unimplemented");
        }
    }

    binary(node: ts.Node, op: BinaryOperator, lhs: VReg) {
        switch (op) {
            case SyntaxKind.LessThanToken: // line 57
            case SyntaxKind.GreaterThanToken: // line 59
            case SyntaxKind.LessThanEqualsToken: // line 60
            case SyntaxKind.GreaterThanEqualsToken: // line 61
            case SyntaxKind.EqualsEqualsToken: // line 62
            case SyntaxKind.ExclamationEqualsToken: // line 63
            case SyntaxKind.EqualsEqualsEqualsToken: // line 64
            case SyntaxKind.ExclamationEqualsEqualsToken: // line 65
                this.binaryRelation(node, op, lhs);
                break;
            case SyntaxKind.PlusToken: // line 67
            case SyntaxKind.PlusEqualsToken: // line 91
                this.add(node, new Add2(new Imm(0), lhs));
                break;
            case SyntaxKind.MinusToken: // line 68
            case SyntaxKind.MinusEqualsToken: // line 92
                this.add(node, new Sub2(new Imm(0), lhs));
                break;
            case SyntaxKind.AsteriskToken: // line 69
            case SyntaxKind.AsteriskEqualsToken: // line 93
                this.add(node, new Mul2(new Imm(0), lhs));
                break;
            case SyntaxKind.AsteriskAsteriskToken: // line 70
            case SyntaxKind.AsteriskAsteriskEqualsToken: // line 94
                this.add(node, new Exp(new Imm(0), lhs));
                break;
            case SyntaxKind.SlashToken: // line 71
            case SyntaxKind.SlashEqualsToken: // line 95
                this.add(node, new Div2(new Imm(0), lhs));
                break;
            case SyntaxKind.PercentToken: // line 72
            case SyntaxKind.PercentEqualsToken: // line 96
                this.add(node, new Mod2(new Imm(0), lhs));
                break;
            case SyntaxKind.LessThanLessThanToken: // line 75
            case SyntaxKind.LessThanLessThanEqualsToken: // line 97
                this.add(node, new Shl2(new Imm(0), lhs));
                break;
            case SyntaxKind.GreaterThanGreaterThanToken: // line 76
            case SyntaxKind.GreaterThanGreaterThanEqualsToken: // line 98
                this.add(node, new Ashr2(new Imm(0), lhs));
                break;
            case SyntaxKind.GreaterThanGreaterThanGreaterThanToken: // line 77
            case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken: // line 99
                this.add(node, new Shr2(new Imm(0), lhs));
                break;
            case SyntaxKind.AmpersandToken: // line 78
            case SyntaxKind.AmpersandEqualsToken: // line 100
                this.add(node, new And2(new Imm(0), lhs));
                break;
            case SyntaxKind.BarToken: // line 79
            case SyntaxKind.BarEqualsToken: // line 101
                this.add(node, new Or2(new Imm(0), lhs));
                break;
            case SyntaxKind.CaretToken: // line 80
            case SyntaxKind.CaretEqualsToken: // line 102
                this.add(node, new Xor2(new Imm(0), lhs));
                break;
            case SyntaxKind.InKeyword: //line 125
                // The in operator returns true if the specified property is in the specified object or its prototype chain
                this.add(node, new Isin(new Imm(0), lhs));
                break;
            case SyntaxKind.InstanceOfKeyword: //line 126
                // The instanceof operator tests to see if the prototype property of
                // a constructor appears anywhere in the prototype chain of an object.
                // The return value is a boolean value.
                this.add(node, new Instanceof(new Imm(0), lhs));
                break;
            default:
                throw new Error("Unimplemented");
        }
    }

    // throw needs argument of exceptionVreg
    // to ensure rethrow the exception after finally
    throw(node: ts.Node) {
        this.add(
            node,
            throwException()
        );
    }

    throwThrowNotExist(node: ts.Node) {
        this.add(node, throwThrowNotExists());
    }

    throwDeleteSuperProperty(node: ts.Node) {
        this.add(node, throwDeleteSuperProperty());
    }

    throwConstAssignment(node: ts.Node, nameReg: VReg) {
        this.add(node, throwConstAssignment(nameReg));
    }

    return(node: ts.Node | NodeKind) {
        this.add(node, new Return());
    }

    call(node: ts.Node, args: VReg[], passThis: boolean) {
        this.add(
            node,
            loadAccumulator(args[0]), // callee is stored in acc
            call(args.slice(1), passThis)
        )
    }

    returnUndefined(node: ts.Node | NodeKind) {
        this.add(
            node,
            returnUndefined()
        )
    }

    newObject(node: ts.Node, args: VReg[]) {
        this.add(
            node,
            newObject(args)
        );
    }

    defineMethod(node: ts.FunctionLikeDeclaration, name: string, objReg: VReg) {
        let paramLength = getParamLengthOfFunc(node);
        this.add(
            node,
            loadAccumulator(objReg),
            defineMethod(name, paramLength)
        );
    }

    defineFunction(node: ts.FunctionLikeDeclaration | NodeKind, realNode: ts.FunctionLikeDeclaration, name: string) {
        let paramLength = getParamLengthOfFunc(realNode);
        this.add(
            node,
            defineFunc(name, paramLength)
        );
    }

    typeOf(node: ts.Node) {
        this.add(node, new Typeof(new Imm(0)));
    }

    callSpread(node: ts.Node, func: VReg, thisReg: VReg, args: VReg) {
        this.loadAccumulator(node, func);
        this.add(node, new Apply(new Imm(0), thisReg, args));
    }

    newObjSpread(node: ts.Node, obj: VReg) {
        this.add(node, new Newobjapply(new Imm(0), obj));
    }

    getUnmappedArgs(node: ts.Node) {
        this.add(node, new Getunmappedargs());
    }

    toNumber(node: ts.Node, arg: VReg) {
        this.loadAccumulator(node, arg);
        this.add(node, new Tonumber(new Imm(0)));
    }

    toNumeric(node: ts.Node, arg: VReg) {
        this.loadAccumulator(node, arg);
        this.add(node, new Tonumeric(new Imm(0)));
    }

    createGeneratorObj(node: ts.Node, funcObj: VReg) {
        this.add(node, new Creategeneratorobj(funcObj));
    }

    createAsyncGeneratorObj(node: ts.Node, funcObj: VReg) {
        this.add(node, new Createasyncgeneratorobj(funcObj));
    }

    Createiterresultobj(node: ts.Node, value: VReg, done: VReg) {
        this.add(node, new Createiterresultobj(value, done));
    }

    asyncgeneratorresolve(node: ts.Node | NodeKind, genObj: VReg, value: VReg, done: VReg) {
        this.add(node, new Asyncgeneratorresolve(genObj, value, done));
    }

    asyncgeneratorreject(node: ts.Node, genObj: VReg) {
        this.add(node, new Asyncgeneratorreject(genObj));
    }

    suspendGenerator(node: ts.Node | NodeKind, genObj: VReg) {
        this.add(node, new Suspendgenerator(genObj)); // promise obj is in acc
    }

    resumeGenerator(node: ts.Node | NodeKind, genObj: VReg) {
        this.add(
            node,
            loadAccumulator(genObj),
            new Resumegenerator());
    }

    getResumeMode(node: ts.Node | NodeKind, genObj: VReg) {
        this.add(
            node,
            loadAccumulator(genObj),
            new Getresumemode());
    }

    asyncFunctionEnter(node: ts.Node | NodeKind) {
        this.add(node, new Asyncfunctionenter());
    }

    asyncFunctionAwaitUncaught(node: ts.Node | NodeKind, asynFuncObj: VReg) {
        this.add(node, new Asyncfunctionawaituncaught(asynFuncObj)); // received value is in acc
    }

    asyncFunctionResolve(node: ts.Node | NodeKind, asyncObj: VReg) {
        this.add(node, new Asyncfunctionresolve(asyncObj)); // use retVal in acc
    }

    asyncFunctionReject(node: ts.Node | NodeKind, asyncObj: VReg) {
        this.add(node, new Asyncfunctionreject(asyncObj)); // exception is in acc
    }

    getTemplateObject(node: ts.Node | NodeKind, value: VReg) {
        this.loadAccumulator(node, value);
        this.add(node, new Gettemplateobject(new Imm(0)));
    }

    copyRestArgs(node: ts.Node, index: number) {
        this.add(node, 
                 index <= MAX_INT8 ? new Copyrestargs(new Imm(index)) : new WideCopyrestargs(new Imm(index)));
    }

    getPropIterator(node: ts.Node) {
        this.add(node, getPropIterator());
    }

    getNextPropName(node: ts.Node, iter: VReg) {
        this.add(node, getNextPropName(iter));
    }

    createEmptyObject(node: ts.Node) {
        this.add(node, createEmptyObject());
    }

    createObjectWithBuffer(node: ts.Node, bufferId: string) {
        this.add(node, createObjectWithBuffer(bufferId));
    }

    setObjectWithProto(node: ts.Node, proto: VReg, object: VReg) {
        this.add(
            node,
            loadAccumulator(object),
            setObjectWithProto(proto));
    }

    copyDataProperties(node: ts.Node, dstObj: VReg) {
        this.add(node, copyDataProperties(dstObj));
    }

    defineGetterSetterByValue(node: ts.Node, obj: VReg, name: VReg, getter: VReg, setter: VReg, isComputedPropertyName: boolean) {
        if (isComputedPropertyName) {
            this.add(node, loadAccumulator(getVregisterCache(this, CacheList.True)));
        } else {
            this.add(node, loadAccumulator(getVregisterCache(this, CacheList.False)));
        }
        this.add(node, defineGetterSetterByValue(obj, name, getter, setter));
    }

    createEmptyArray(node: ts.Node) {
        this.add(node, createEmptyArray());
    }

    createArrayWithBuffer(node: ts.Node, bufferId: string) {
        this.add(node, createArrayWithBuffer(bufferId));
    }

    storeArraySpreadElement(node: ts.Node, array: VReg, index: VReg) {
        this.add(node, storeArraySpread(array, index));
    }

    storeLexicalVar(node: ts.Node, level: number, slot: number, value: VReg) {
        this.loadAccumulator(node, value); // value is load to acc
        this.add(
            node,
            storeLexicalVar(level, slot)
        );
    }

    loadLexicalVar(node: ts.Node, level: number, slot: number) {
        this.add(
            node,
            loadLexicalVar(level, slot)
        )
    }

    loadModuleVariable(node: ts.Node, v: ModuleVariable, isLocal: boolean) {
        let index: number = v.getIndex();
        let typeIndex: number = v.getTypeIndex();
        // For local module variable, we bind type with storeModuleVariable instruction
        // instead of loadLocalModuleVariable instruction to avoid duplicate recording when load multi times.
        // For external module variable, we can only bind type with loadExternalModuleVariable instruction
        // because there is no storeModuleVariable instruction of the corrsponding variable in the same file.
        if (isLocal) {
            this.add(node, loadLocalModuleVariable(index));
        } else {
            let ldModuleVarInst: IRNode = loadExternalModuleVariable(index);
            this.setInstType(ldModuleVarInst, typeIndex);
            this.add(node, ldModuleVarInst);
        }
    }

    storeModuleVariable(node: ts.Node | NodeKind, v: ModuleVariable) {
        let index: number = v.getIndex();
        let typeIndex: number = v.getTypeIndex();
        let stModuleVarInst: IRNode = storeModuleVariable(index);
        this.setInstType(stModuleVarInst, typeIndex);
        this.add(node, stModuleVarInst);
    }

    getModuleNamespace(node: ts.Node, moduleRequestIdx: number) {
        this.add(node, getModuleNamespace(moduleRequestIdx));
    }

    dynamicImportCall(node: ts.Node) {
        this.add(node, dynamicImport());
    }

    defineClassWithBuffer(node: ts.Node, name: string, litId: string, parameterLength: number, base: VReg) {
        this.add(
            node,
            defineClassWithBuffer(name, litId, parameterLength, base)
        )
    }

    createObjectWithExcludedKeys(node: ts.Node, obj: VReg, args: VReg[]) {
        this.add(
            node,
            createObjectWithExcludedKeys(obj, args)
        );
    }

    throwObjectNonCoercible(node: ts.Node) {
        this.add(
            node,
            throwObjectNonCoercible()
        );
    }

    getIterator(node: ts.Node) {
        this.add(
            node,
            getIterator()
        );
    }

    getAsyncIterator(node: ts.Node) {
        this.add(
            node,
            new Getasynciterator(new Imm(0))
        )
    }

    closeIterator(node: ts.Node, iter: VReg) {
        this.add(
            node,
            closeIterator(iter)
        )
    }

    throwIfNotObject(node: ts.Node, obj: VReg) {
        this.add(
            node,
            throwIfNotObject(obj)
        );
    }

    superCall(node: ts.Node, num: number, args: Array<VReg>) {
        if (ts.isArrowFunction(jshelpers.getContainingFunction(node))) {
            this.add(
                node,
                superCallInArrow(num, args)
            )
            return;
        }

        this.add(
            node,
            superCall(num, args)
        )
    }

    superCallSpread(node: ts.Node, vs: VReg) {
        this.add(node, superCallSpread(vs));
    }

    ldSuperByName(node: ts.Node, obj: VReg, key: string) {
        this.add(
            node,
            loadAccumulator(obj),
            ldSuperByName(key)
        )
    }

    stSuperByName(node: ts.Node, obj: VReg, key: string) {
        this.add(
            node,
            stSuperByName(obj, key)
        )
    }

    ldSuperByValue(node: ts.Node, obj: VReg) {
        this.add(
            node,
            ldSuperByValue(obj)
        )
    }

    stSuperByValue(node: ts.Node, obj: VReg, prop: VReg) {
        this.add(
            node,
            stSuperByValue(obj, prop)
        )
    }

    loadSuperProperty(node: ts.Node, obj: VReg, prop: VReg | string | number) {
        switch (typeof (prop)) {
            case "string":
                this.ldSuperByName(node, obj, prop);
                break;
            case "number":
                this.loadAccumulatorInt(node, prop);
                this.ldSuperByValue(node, obj);
                break;
            default:
                this.loadAccumulator(node, prop);
                this.ldSuperByValue(node, obj);
        }
    }

    throwIfSuperNotCorrectCall(node: ts.Node, num: number) {
        this.add(node, throwIfSuperNotCorrectCall(num));
    }

    storeSuperProperty(node: ts.Node, obj: VReg, prop: VReg | string | number) {
        switch (typeof (prop)) {
            case "string":
                this.stSuperByName(node, obj, prop);
                break;
            case "number":
                let propReg = this.getTemp();
                this.loadAccumulatorInt(node, prop);
                this.storeAccumulator(node, propReg);
                this.stSuperByValue(node, obj, propReg);
                this.freeTemps(propReg)
                break;
            default:
                this.stSuperByValue(node, obj, prop);
        }
    }

    createRegExpWithLiteral(node: ts.Node, pattern: string, flags: number) {
        this.add(
            node,
            createRegExpWithLiteral(pattern, flags)
        )
    }

    stLetOrClassToGlobalRecord(node: ts.Node, string_id: string) {
        this.add(
            node,
            stLetOrClassToGlobalRecord(string_id));
    }

    stConstToGlobalRecord(node: ts.Node, string_id: string) {
        this.add(
            node,
            stConstToGlobalRecord(string_id));
    }

    loadAccumulatorBigInt(node: ts.Node | NodeKind, str: string) {
        this.add(
            node,
            loadAccumulatorBigInt(str));
    }

    storeConst(node: ts.Node | NodeKind, dst: VReg, value: CacheList) {
        this.loadAccumulator(node, getVregisterCache(this, value));
        this.storeAccumulator(node, dst);
    }

    private binaryRelation(node: ts.Node, op: BinaryOperator, lhs: VReg) {
        let falseLabel = new Label();
        let endLabel = new Label();
        switch (op) {
            case SyntaxKind.LessThanToken:
                this.less(node, lhs);
                break;
            case SyntaxKind.GreaterThanToken:
                this.greater(node, lhs);
                break;
            case SyntaxKind.LessThanEqualsToken:
                this.lessEq(node, lhs);
                break;
            case SyntaxKind.GreaterThanEqualsToken:
                this.greaterEq(node, lhs);
                break;
            case SyntaxKind.EqualsEqualsToken:
                this.equal(node, lhs);
                break;
            case SyntaxKind.ExclamationEqualsToken:
                this.notEqual(node, lhs);
                break;
            case SyntaxKind.EqualsEqualsEqualsToken:
                this.strictEqual(node, lhs);
                break;
            case SyntaxKind.ExclamationEqualsEqualsToken:
                this.strictNotEqual(node, lhs);
                break;
            default:
                break;
        }
        this.add(node, new Jeqz(falseLabel));
        this.add(node, loadAccumulator(getVregisterCache(this, CacheList.True)));
        this.branch(node, endLabel);
        this.label(node, falseLabel);
        this.add(node, loadAccumulator(getVregisterCache(this, CacheList.False)));
        this.label(node, endLabel);
    }

    private add(node: ts.Node | NodeKind, ...insns: IRNode[]): void {
        // set pos debug info if debug mode
        DebugInfo.setDebuginfoForIns(node, ...insns);

        this.insns.push(...insns);
    }

    public setInstType(inst: IRNode, typeId: number | undefined): void {
        if (typeId != undefined && TypeRecorder.getInstance() != undefined) {
            this.instTypeMap.set(inst, typeId);
        }
    }
}
