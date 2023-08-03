import { VReg } from "./irnodes";
import { InitStatus, LoopScope, VariableScope } from "./scope";
export declare enum VarDeclarationKind {
    NONE = 0,
    LET = 1,
    CONST = 2,
    VAR = 3,
    FUNCTION = 4,
    CLASS = 5
}
export declare abstract class Variable {
    readonly declKind: VarDeclarationKind;
    private vreg;
    private name;
    private typeIndex;
    isLexVar: boolean;
    idxLex: number;
    constructor(declKind: VarDeclarationKind, name: string);
    bindVreg(vreg: VReg): void;
    hasAlreadyBinded(): boolean;
    getVreg(): VReg;
    getName(): string;
    getTypeIndex(): number;
    setTypeIndex(typeIndex: number): number;
    setLexVar(scope: VariableScope | LoopScope): number;
    clearLexVar(): void;
    lexical(): boolean;
    lexIndex(): number;
    isLet(): boolean;
    isConst(): boolean;
    isLetOrConst(): boolean;
    isVar(): boolean;
    isNone(): boolean;
    isClass(): boolean;
}
export declare class LocalVariable extends Variable {
    status: InitStatus | null;
    constructor(declKind: VarDeclarationKind, name: string, status?: InitStatus);
    initialize(): void;
    isInitialized(): boolean;
}
export declare class ModuleVariable extends Variable {
    private isExport;
    private status;
    private index;
    constructor(declKind: VarDeclarationKind, name: string, status?: InitStatus);
    initialize(): void;
    isInitialized(): boolean;
    setExport(): void;
    isExportVar(): boolean;
    assignIndex(index: number): void;
    getIndex(): number;
}
export declare class GlobalVariable extends Variable {
    constructor(declKind: VarDeclarationKind, name: string);
}
export declare const MandatoryFuncObj = "4funcObj";
export declare const MandatoryNewTarget = "4newTarget";
export declare const MandatoryThis = "this";
export declare const MandatoryArguments = "arguments";
export declare function isMandatoryParam(name: string): boolean;
//# sourceMappingURL=variable.d.ts.map