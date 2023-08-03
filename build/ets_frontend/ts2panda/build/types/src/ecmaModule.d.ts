import * as ts from "typescript";
import { PandaGen } from "./pandagen";
import { ModuleScope, Scope } from "./scope";
import { Compiler } from "./compiler";
declare class Entry {
    node: ts.Node;
    exportName: string | undefined;
    localName: string | undefined;
    importName: string | undefined;
    moduleRequest: number;
    constructor(node: ts.Node, exportName: string | undefined, localName: string | undefined, importName: string | undefined, moduleRequest?: number);
}
export declare class SourceTextModuleRecord {
    private moduleName;
    private moduleRequests;
    private moduleRequestIdxMap;
    private regularImportEntries;
    private namespaceImportEntries;
    private localExportEntries;
    private starExportEntries;
    private indirectExportEntries;
    constructor(moduleName: string);
    addModuleRequest(moduleRequest: string): number;
    addImportEntry(node: ts.Node, importName: string, localName: string, moduleRequest: string): void;
    addEmptyImportEntry(moduleRequest: string): void;
    addStarImportEntry(node: ts.Node, localName: string, moduleRequest: string): void;
    addLocalExportEntry(node: ts.Node, exportName: string, localName: string): void;
    addIndirectExportEntry(node: ts.Node, importName: string, exportName: string, moduleRequest: string): void;
    addStarExportEntry(node: ts.Node, moduleRequest: string): void;
    getModuleName(): string;
    getModuleRequests(): string[];
    getRegularImportEntries(): Map<string, Entry>;
    getNamespaceImportEntries(): Entry[];
    getLocalExportEntries(): Map<string, Entry[]>;
    getStarExportEntries(): Entry[];
    getIndirectExportEntries(): Entry[];
    makeIndirectExportsExplicit(): void;
    nextDuplicateExportEntry(candidate: Entry, exportNameEntry: Map<string, Entry>, currentCandidate: Entry | undefined): Entry;
    searchDuplicateExport(): Entry | undefined;
    validateModuleRecordEntries(moduleScope: ModuleScope): void;
    setExportedDecls(moduleScope: ModuleScope): void;
    setModuleEnvironment(moduleScope: ModuleScope): void;
}
export declare function setModuleNamespaceImports(compiler: Compiler, moduleScope: Scope, pandagen: PandaGen): void;
export declare function assignIndexToModuleVariable(moduleScope: Scope): void;
export {};
//# sourceMappingURL=ecmaModule.d.ts.map