import * as ts from "typescript";
import { SourceTextModuleRecord } from "./ecmaModule";
import { LocalVariable, VarDeclarationKind, Variable } from "./variable";
export declare enum InitStatus {
    INITIALIZED = 0,
    UNINITIALIZED = 1
}
export declare enum ModuleVarKind {
    IMPORTED = 0,
    EXPORTED = 1,
    NOT = 2
}
export declare abstract class Decl {
    name: string;
    node: ts.Node;
    isModule: ModuleVarKind;
    constructor(name: string, node: ts.Node, isModule: ModuleVarKind);
}
export declare class VarDecl extends Decl {
    constructor(varName: string, node: ts.Node, isModule: ModuleVarKind);
}
export declare class LetDecl extends Decl {
    constructor(letName: string, node: ts.Node, isModule: ModuleVarKind);
}
export declare class ConstDecl extends Decl {
    constructor(constName: string, node: ts.Node, isModule: ModuleVarKind);
}
export declare class FuncDecl extends Decl {
    constructor(funcName: string, node: ts.Node, isModule: ModuleVarKind);
}
export declare class ClassDecl extends Decl {
    constructor(className: string, node: ts.Node, isModule: ModuleVarKind);
}
export declare class CatchParameter extends Decl {
    constructor(CpName: string, node: ts.Node, isModule?: ModuleVarKind);
}
export declare class FunctionParameter extends Decl {
    constructor(FpName: string, node: ts.Node, isModule?: ModuleVarKind);
}
export declare abstract class Scope {
    protected debugTag: string;
    protected name2variable: Map<string, Variable>;
    protected decls: Decl[];
    protected parent: Scope | undefined;
    protected startInsIdx: number | undefined;
    protected endInsIdx: number | undefined;
    private isArgumentsOrRestargs;
    constructor();
    abstract add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined;
    getName2variable(): Map<string, Variable>;
    getScopeStartInsIdx(): number;
    setScopeStartInsIdx(startInsIdx: number): void;
    setScopeEndInsIdx(endInsIdx: number): void;
    getScopeEndInsIdx(): number;
    setParent(parentScope: Scope | undefined): void;
    getParent(): Scope | undefined;
    getRootScope(): Scope;
    getNearestVariableScope(): VariableScope | undefined;
    getNearestLexicalScope(): VariableScope | LoopScope | undefined;
    getNthVariableScope(level: number): VariableScope | undefined;
    findLocal(name: string): Variable | undefined;
    find(name: string): {
        scope: Scope | undefined;
        level: number;
        v: Variable | undefined;
    };
    findDeclPos(name: string): Scope | undefined;
    resolveDeclPos(name: string): {
        isLexical: boolean;
        scope: Scope;
        defLexicalScope: VariableScope | LoopScope;
        v: Variable;
    };
    setDecls(decl: Decl): void;
    hasDecl(name: string): boolean;
    getDecl(name: string): Decl | undefined;
    getDecls(): Decl[];
    setArgumentsOrRestargs(): void;
    getArgumentsOrRestargs(): boolean;
    isLexicalScope(): boolean;
}
export declare abstract class VariableScope extends Scope {
    protected startLexIdx: number;
    protected needCreateLexEnv: boolean;
    protected parameters: LocalVariable[];
    protected useArgs: boolean;
    protected node: ts.Node | undefined;
    protected parentVariableScope: VariableScope | null;
    protected childVariableScope: VariableScope[];
    protected lexVarInfo: Map<string, number>;
    getLexVarInfo(): Map<string, number>;
    addLexVarInfo(name: string, slot: number): void;
    getBindingNode(): ts.Node;
    setParentVariableScope(scope: VariableScope): void;
    getParentVariableScope(): VariableScope;
    getChildVariableScope(): VariableScope[];
    addChildVariableScope(scope: VariableScope): void;
    addParameter(name: string, declKind: VarDeclarationKind, argIdx: number): Variable | undefined;
    addFuncName(funcName: string): void;
    need2CreateLexEnv(): boolean;
    pendingCreateEnv(): void;
    getNumLexEnv(): number;
    getParametersCount(): number;
    getParameters(): LocalVariable[];
    getLexVarIdx(): number;
    setUseArgs(value: boolean): void;
    getUseArgs(): boolean;
    hasAfChild(): boolean;
}
export declare class GlobalScope extends VariableScope {
    constructor(node?: ts.SourceFile);
    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined;
}
export declare class ModuleScope extends VariableScope {
    private moduleRecord;
    constructor(node: ts.SourceFile);
    setExportDecl(exportedLocalName: string): void;
    module(): SourceTextModuleRecord;
    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined;
}
export declare class FunctionScope extends VariableScope {
    private parameterLength;
    private funcName;
    constructor(parent?: Scope, node?: ts.FunctionLikeDeclaration);
    setParameterLength(length: number): void;
    getParameterLength(): number;
    setFuncName(name: string): void;
    getFuncName(): string;
    getParent(): Scope | undefined;
    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined;
}
export declare class LocalScope extends Scope {
    constructor(parent: Scope);
    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined;
}
export declare class LoopScope extends LocalScope {
    protected startLexIdx: number;
    protected needCreateLexEnv: boolean;
    protected lexVarInfo: Map<string, number>;
    constructor(parent: Scope);
    getLexVarInfo(): Map<string, number>;
    addLexVarInfo(name: string, slot: number): void;
    need2CreateLexEnv(): boolean;
    pendingCreateEnv(): void;
    getLexVarIdx(): number;
    getNumLexEnv(): number;
}
//# sourceMappingURL=scope.d.ts.map