import * as ts from "typescript";
import { CompilerStatistics } from "./compilerStatistics";
import { PandaGen } from "./pandagen";
import { Pass } from "./pass";
import { Recorder } from "./recorder";
import { GlobalScope, Scope, VariableScope } from "./scope";
import { LiteralBuffer } from "./base/literal";
export declare class PendingCompilationUnit {
    readonly decl: ts.FunctionLikeDeclaration;
    readonly scope: Scope;
    readonly internalName: string;
    constructor(decl: ts.FunctionLikeDeclaration, scope: Scope, internalName: string);
}
/**
 * The class which drives the compilation process.
 * It handles all dependencies and run passes.
 */
export declare class CompilerDriver {
    static srcNode: ts.SourceFile | undefined;
    static isTsFile: boolean;
    private fileName;
    private recordName;
    private passes;
    private compilationUnits;
    pendingCompilationUnits: PendingCompilationUnit[];
    private functionId;
    private funcIdMap;
    private statistics;
    private needDumpHeader;
    private ts2abcProcess;
    constructor(fileName: string, recordName: string);
    initiateTs2abcChildProcess(args: Array<string>): void;
    getTs2abcProcess(): any;
    getStatistics(): CompilerStatistics;
    setCustomPasses(passes: Pass[]): void;
    addCompilationUnit(decl: ts.FunctionLikeDeclaration, scope: Scope, recorder: Recorder): string;
    getCompilationUnits(): PandaGen[];
    kind2String(kind: ts.SyntaxKind): string;
    getASTStatistics(node: ts.Node, statics: number[]): void;
    postOrderAnalysis(scope: GlobalScope): VariableScope[];
    compileForSyntaxCheck(node: ts.SourceFile): void;
    compile(node: ts.SourceFile, ts2abcProcess?: any | undefined): void;
    dumpInputJsonFileContent(ts2abcProc: any, jsonFileName: string, recordName: string): void;
    private compileImpl;
    compileUnitTest(node: ts.SourceFile, literalBufferArray?: Array<LiteralBuffer>): void;
    private compileUnitTestImpl;
    static isTypeScriptSourceFile(node: ts.SourceFile): boolean;
    private compilePrologue;
    showStatistics(): void;
    getFuncId(node: ts.SourceFile | ts.FunctionLikeDeclaration | ts.ClassLikeDeclaration): number;
    getFormatedRecordName(): string;
    /**
     * Internal name is used to indentify a function in panda file
     * Runtime uses this name to bind code and a Function object
     */
    getFuncInternalName(node: ts.SourceFile | ts.FunctionLikeDeclaration, recorder: Recorder): string;
    getInternalNameForCtor(node: ts.ClassLikeDeclaration, ctor: ts.ConstructorDeclaration): string;
    writeBinaryFile(pandaGen: PandaGen): void;
    private getParametersCount;
    private setTypeInfoBeforeRecord;
    private setTypeInfoAfterRecord;
}
//# sourceMappingURL=compilerDriver.d.ts.map