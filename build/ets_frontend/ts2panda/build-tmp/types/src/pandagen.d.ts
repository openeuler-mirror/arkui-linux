/**
 * Implementation of bytecode generator.
 * The PandaGen works with IR and provides an API
 * to the compiler.
 *
 * This file should not contain imports of TypeScipt's AST nodes.
 */
import * as ts from "typescript";
import { BinaryOperator, PrefixUnaryOperator, SyntaxKind } from "typescript";
import { LiteralBuffer } from "./base/literal";
import { BaseType } from "./base/typeSystem";
import { CacheList, VregisterCache } from "./base/vregisterCache";
import { NodeKind, VariableDebugInfo } from "./debuginfo";
import { IRNode, Label, VReg } from "./irnodes";
import { LoopScope, Scope, VariableScope } from "./scope";
import { CatchTable } from "./statement/tryStatement";
import { ModuleVariable, Variable } from "./variable";
export declare enum FunctionKind {
    NONE = 0,
    FUNCTION = 1,
    NC_FUNCTION = 2,
    GENERATOR_FUNCTION = 3,
    ASYNC_FUNCTION = 4,
    ASYNC_GENERATOR_FUNCTION = 5,
    ASYNC_NCFUNCTION = 6
}
export declare class PandaGen {
    private debugTag;
    readonly internalName: string;
    private node;
    private parametersCount;
    private locals;
    private temps;
    private insns;
    private instTypeMap;
    private scope;
    private vregisterCache;
    private catchMap;
    private totalRegsNum;
    private variableDebugInfoArray;
    private firstStmt;
    private sourceFile;
    private sourceCode;
    private callType;
    private funcKind;
    private icSize;
    private static literalArrayBuffer;
    constructor(internalName: string, node: ts.SourceFile | ts.FunctionLikeDeclaration, parametersCount: number, scope?: Scope | undefined);
    appendScopeInfo(lexVarInfo: Map<string, number>): string | undefined;
    setFunctionKind(node: ts.SourceFile | ts.FunctionLikeDeclaration): void;
    getFunctionKind(): FunctionKind;
    setCallType(callType: number): void;
    getCallType(): number;
    updateIcSize(icSlot: number): void;
    getIcSize(): number;
    static getExportedTypes(): Map<string, number>;
    static getDeclaredTypes(): Map<string, number>;
    getSourceCode(): string | undefined;
    setSourceCode(code: string): void;
    getSourceFileDebugInfo(): string;
    setSourceFileDebugInfo(sourceFile: string): void;
    static getLiteralArrayBuffer(): LiteralBuffer[];
    static clearLiteralArrayBuffer(): void;
    getParameterLength(): number;
    getFuncName(): string;
    static appendLiteralArrayBuffer(litBuf: LiteralBuffer): string;
    static appendTypeArrayBuffer(type: BaseType): number;
    static setTypeArrayBuffer(type: BaseType, index: number): void;
    getFirstStmt(): ts.Statement;
    setFirstStmt(firstStmt: ts.Statement): void;
    getVregisterCache(): VregisterCache;
    getCatchMap(): Map<Label, CatchTable>;
    getScope(): Scope | undefined;
    getVariableDebugInfoArray(): VariableDebugInfo[];
    addDebugVariableInfo(variable: VariableDebugInfo): void;
    allocLocalVreg(): VReg;
    getVregForVariable(v: Variable): VReg;
    getTemp(): VReg;
    freeTemps(...temps: VReg[]): void;
    getInsns(): IRNode[];
    setInsns(insns: IRNode[]): void;
    printInsns(): void;
    setTotalRegsNum(num: number): void;
    getTotalRegsNum(): number;
    setParametersCount(count: number): void;
    getParametersCount(): number;
    setLocals(locals: VReg[]): void;
    getLocals(): VReg[];
    getTemps(): VReg[];
    getInstTypeMap(): Map<IRNode, number>;
    getNode(): ts.SourceFile | ts.FunctionLikeDeclaration;
    storeAccumulator(node: ts.Node | NodeKind, vreg: VReg): void;
    generatorYield(node: ts.Node, genObj: VReg): void;
    generatorComplete(node: ts.Node | NodeKind, genObj: VReg): void;
    loadAccFromArgs(node: ts.Node): void;
    deleteObjProperty(node: ts.Node, obj: VReg): void;
    loadAccumulator(node: ts.Node | NodeKind, vreg: VReg): void;
    createLexEnv(node: ts.Node, scope: VariableScope | LoopScope): void;
    newLexicalEnv(node: any, numVars: number): void;
    popLexicalEnv(node: ts.Node): void;
    loadAccFromLexEnv(node: ts.Node, scope: Scope, level: number, v: Variable): void;
    storeAccToLexEnv(node: ts.Node | NodeKind, scope: Scope, level: number, v: Variable, isDeclaration: boolean): void;
    loadObjProperty(node: ts.Node, obj: VReg, prop: VReg | string | number): void;
    storeObjProperty(node: ts.Node | NodeKind, obj: VReg, prop: VReg | string | number): void;
    storeOwnProperty(node: ts.Node | NodeKind, obj: VReg, prop: VReg | string | number, nameSetting?: boolean): void;
    private loadObjByName;
    private storeObjByName;
    private loadObjByIndex;
    private storeObjByIndex;
    private loadObjByValue;
    private storeObjByValue;
    private stOwnByName;
    private stOwnByIndex;
    private stOwnByValue;
    loadByNameViaDebugger(node: ts.Node, string_id: string, boolVal: CacheList): void;
    tryLoadGlobalByName(node: ts.Node, string_id: string): void;
    storeByNameViaDebugger(node: ts.Node, string_id: string): void;
    tryStoreGlobalByName(node: ts.Node, string_id: string): void;
    loadGlobalVar(node: ts.Node, string_id: string): void;
    storeGlobalVar(node: ts.Node | NodeKind, string_id: string): void;
    loadAccumulatorString(node: ts.Node | NodeKind, str: string): void;
    loadAccumulatorFloat(node: ts.Node, num: number): void;
    loadAccumulatorInt(node: ts.Node, num: number): void;
    moveVreg(node: ts.Node | NodeKind, vd: VReg, vs: VReg): void;
    label(node: ts.Node, label: Label): void;
    branch(node: ts.Node | NodeKind, target: Label): void;
    branchIfNotUndefined(node: ts.Node, target: Label): void;
    branchIfUndefined(node: ts.Node, target: Label): void;
    isTrue(node: ts.Node): void;
    jumpIfTrue(node: ts.Node, target: Label): void;
    isFalse(node: ts.Node): void;
    jumpIfFalse(node: ts.Node, target: Label): void;
    debugger(node: ts.Node): void;
    throwUndefinedIfHole(node: ts.Node, name: string): void;
    less(node: ts.Node, lhs: VReg): void;
    greater(node: ts.Node, lhs: VReg): void;
    greaterEq(node: ts.Node, lhs: VReg): void;
    lessEq(node: ts.Node, lhs: VReg): void;
    equal(node: ts.Node, lhs: VReg): void;
    notEqual(node: ts.Node, lhs: VReg): void;
    strictEqual(node: ts.Node, lhs: VReg): void;
    strictNotEqual(node: ts.Node, lhs: VReg): void;
    /**
     * The method generates code for ther following cases
     *          if (lhs OP acc) {...}
     * ifFalse: ...
     */
    condition(node: ts.Node, op: SyntaxKind, lhs: VReg, ifFalse: Label): void;
    unary(node: ts.Node, op: PrefixUnaryOperator, operand: VReg): void;
    binary(node: ts.Node, op: BinaryOperator, lhs: VReg): void;
    throw(node: ts.Node): void;
    throwThrowNotExist(node: ts.Node): void;
    throwDeleteSuperProperty(node: ts.Node): void;
    throwConstAssignment(node: ts.Node, nameReg: VReg): void;
    return(node: ts.Node | NodeKind): void;
    call(node: ts.Node, args: VReg[], passThis: boolean): void;
    returnUndefined(node: ts.Node | NodeKind): void;
    newObject(node: ts.Node, args: VReg[]): void;
    defineMethod(node: ts.FunctionLikeDeclaration, name: string, objReg: VReg): void;
    defineFunction(node: ts.FunctionLikeDeclaration | NodeKind, realNode: ts.FunctionLikeDeclaration, name: string): void;
    typeOf(node: ts.Node): void;
    callSpread(node: ts.Node, func: VReg, thisReg: VReg, args: VReg): void;
    newObjSpread(node: ts.Node, obj: VReg): void;
    getUnmappedArgs(node: ts.Node): void;
    toNumber(node: ts.Node, arg: VReg): void;
    toNumeric(node: ts.Node, arg: VReg): void;
    createGeneratorObj(node: ts.Node, funcObj: VReg): void;
    createAsyncGeneratorObj(node: ts.Node, funcObj: VReg): void;
    Createiterresultobj(node: ts.Node, value: VReg, done: VReg): void;
    asyncgeneratorresolve(node: ts.Node | NodeKind, genObj: VReg, value: VReg, done: VReg): void;
    asyncgeneratorreject(node: ts.Node, genObj: VReg): void;
    suspendGenerator(node: ts.Node | NodeKind, genObj: VReg): void;
    resumeGenerator(node: ts.Node | NodeKind, genObj: VReg): void;
    getResumeMode(node: ts.Node | NodeKind, genObj: VReg): void;
    asyncFunctionEnter(node: ts.Node | NodeKind): void;
    asyncFunctionAwaitUncaught(node: ts.Node | NodeKind, asynFuncObj: VReg): void;
    asyncFunctionResolve(node: ts.Node | NodeKind, asyncObj: VReg): void;
    asyncFunctionReject(node: ts.Node | NodeKind, asyncObj: VReg): void;
    getTemplateObject(node: ts.Node | NodeKind, value: VReg): void;
    copyRestArgs(node: ts.Node, index: number): void;
    getPropIterator(node: ts.Node): void;
    getNextPropName(node: ts.Node, iter: VReg): void;
    createEmptyObject(node: ts.Node): void;
    createObjectWithBuffer(node: ts.Node, bufferId: string): void;
    setObjectWithProto(node: ts.Node, proto: VReg, object: VReg): void;
    copyDataProperties(node: ts.Node, dstObj: VReg): void;
    defineGetterSetterByValue(node: ts.Node, obj: VReg, name: VReg, getter: VReg, setter: VReg, isComputedPropertyName: boolean): void;
    createEmptyArray(node: ts.Node): void;
    createArrayWithBuffer(node: ts.Node, bufferId: string): void;
    storeArraySpreadElement(node: ts.Node, array: VReg, index: VReg): void;
    storeLexicalVar(node: ts.Node, level: number, slot: number, value: VReg): void;
    loadLexicalVar(node: ts.Node, level: number, slot: number): void;
    loadModuleVariable(node: ts.Node, v: ModuleVariable, isLocal: boolean): void;
    storeModuleVariable(node: ts.Node | NodeKind, v: ModuleVariable): void;
    getModuleNamespace(node: ts.Node, moduleRequestIdx: number): void;
    dynamicImportCall(node: ts.Node): void;
    defineClassWithBuffer(node: ts.Node, name: string, litId: string, parameterLength: number, base: VReg): void;
    createObjectWithExcludedKeys(node: ts.Node, obj: VReg, args: VReg[]): void;
    throwObjectNonCoercible(node: ts.Node): void;
    getIterator(node: ts.Node): void;
    getAsyncIterator(node: ts.Node): void;
    closeIterator(node: ts.Node, iter: VReg): void;
    throwIfNotObject(node: ts.Node, obj: VReg): void;
    superCall(node: ts.Node, num: number, args: Array<VReg>): void;
    superCallSpread(node: ts.Node, vs: VReg): void;
    ldSuperByName(node: ts.Node, obj: VReg, key: string): void;
    stSuperByName(node: ts.Node, obj: VReg, key: string): void;
    ldSuperByValue(node: ts.Node, obj: VReg): void;
    stSuperByValue(node: ts.Node, obj: VReg, prop: VReg): void;
    loadSuperProperty(node: ts.Node, obj: VReg, prop: VReg | string | number): void;
    throwIfSuperNotCorrectCall(node: ts.Node, num: number): void;
    storeSuperProperty(node: ts.Node, obj: VReg, prop: VReg | string | number): void;
    createRegExpWithLiteral(node: ts.Node, pattern: string, flags: number): void;
    stLetOrClassToGlobalRecord(node: ts.Node, string_id: string): void;
    stConstToGlobalRecord(node: ts.Node, string_id: string): void;
    loadAccumulatorBigInt(node: ts.Node | NodeKind, str: string): void;
    storeConst(node: ts.Node | NodeKind, dst: VReg, value: CacheList): void;
    private binaryRelation;
    private add;
    setInstType(inst: IRNode, typeId: number | undefined): void;
}
//# sourceMappingURL=pandagen.d.ts.map