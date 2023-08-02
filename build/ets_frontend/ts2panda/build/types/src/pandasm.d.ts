import { LiteralBuffer } from "./base/literal";
import { DebugPosInfo, VariableDebugInfo } from "./debuginfo";
export declare class Metadata {
    attribute: string;
    constructor(attribute?: string);
}
export declare class Signature {
    p: number;
    rt: string | undefined;
    constructor(params?: number, retType?: string | undefined);
}
export declare class Ins {
    o: number | undefined;
    r: Array<number> | undefined;
    id: Array<string> | undefined;
    im: Array<number> | undefined;
    l: string | undefined;
    d: DebugPosInfo | undefined;
    constructor(op?: number | undefined, regs?: Array<number> | undefined, ids?: Array<string> | undefined, imms?: Array<number> | undefined, label?: string | undefined, dbg_pos?: DebugPosInfo | undefined);
}
export declare class Function {
    n: string;
    s: Signature;
    r: number;
    i: Array<Ins>;
    l: Array<string> | undefined;
    ca_tab: Array<CatchTable> | undefined;
    v: Array<VariableDebugInfo> | undefined;
    sf: string;
    sc: string | undefined;
    ct: number | undefined;
    ti: Array<number> | undefined;
    es2t: Array<ExportedSymbol2Type> | undefined;
    ds2t: Array<DeclaredSymbol2Type> | undefined;
    kind: number;
    icSize: number;
    constructor(name: string, signature: Signature, regs_num: number, ins: Array<Ins>, labs: Array<string> | undefined, vars: Array<VariableDebugInfo> | undefined, catchTables: Array<CatchTable> | undefined, sourceFiles: string, sourceCodes: string | undefined, callType: number | undefined, typeInfo: Array<number> | undefined, exportedSymbol2Types: Array<ExportedSymbol2Type> | undefined, declaredSymbol2Types: Array<DeclaredSymbol2Type> | undefined, kind: number, icSize: number);
}
export declare class Record {
    name: string;
    constructor(name: string);
}
export declare class Program {
    functions: Array<Function>;
    records: Array<Record>;
    strings: Set<string>;
    strings_arr: Array<string>;
    literalArrays: Array<LiteralBuffer>;
    module_mode: boolean;
    debug_mode: boolean;
    log_enabled: boolean;
    opt_level: number;
    opt_log_level: string;
    constructor();
    finalize(): void;
}
export declare class CatchTable {
    tb_lab: string;
    te_lab: string;
    cb_lab: string;
    constructor(tryBeginLabel: string, tryEndLabel: string, catchBeginLabel: string);
}
export declare class TypeOfVreg {
    private vregNum;
    private typeIndex;
    constructor(vregNum: number, typeIndex: number);
}
export declare class ExportedSymbol2Type {
    private symbol;
    private type;
    constructor(symbol: string, type: number);
}
export declare class DeclaredSymbol2Type {
    private symbol;
    private type;
    constructor(symbol: string, type: number);
}
export declare class RegularImportEntry {
    localName: string;
    importName: string;
    moduleRequest: number;
    constructor(localName: string, importName: string, moduleRequest: number);
}
export declare class NamespaceImportEntry {
    localName: string;
    moduleRequest: number;
    constructor(localName: string, moduleRequest: number);
}
export declare class LocalExportEntry {
    localName: string;
    exportName: string;
    constructor(localName: string, exportName: string);
}
export declare class IndirectExportEntry {
    exportName: string;
    importName: string;
    moduleRequest: number;
    constructor(exportName: string, importName: string, moduleRequest: number);
}
export declare class ModuleRecord {
    moduleName: string;
    moduleRequests: Array<string>;
    regularImportEntries: Array<RegularImportEntry>;
    namespaceImportEntries: Array<NamespaceImportEntry>;
    localExportEntries: Array<LocalExportEntry>;
    indirectExportEntries: Array<IndirectExportEntry>;
    starExportEntries: Array<number>;
}
export interface Emmiter {
    generate_program: (filename: string, program: Program) => string;
}
//# sourceMappingURL=pandasm.d.ts.map