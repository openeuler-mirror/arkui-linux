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

import { readFileSync, writeFileSync } from "fs";
import * as ts from "typescript";
import { addVariableToScope } from "./addVariable2Scope";
import { AssemblyDumper } from "./assemblyDumper";
import {
    hasDefaultKeywordModifier, hasExportKeywordModifier, initiateTs2abc, listenChildExit,
    listenErrorEvent, terminateWritePipe, getRecordTypeFlag
} from "./base/util";
import { CmdOptions } from "./cmdOptions";
import {
    Compiler
} from "./compiler";
import { CompilerStatistics } from "./compilerStatistics";
import { DebugInfo } from "./debuginfo";
import { hoisting } from "./hoisting";
import { LOGD } from "./log";
import { setModuleNamespaceImports, assignIndexToModuleVariable } from "./ecmaModule";
import { PandaGen } from "./pandagen";
import { Pass } from "./pass";
import { CacheExpander } from "./pass/cacheExpander";
import { Recorder } from "./recorder";
import { RegAlloc } from "./regAllocator";
import {
    FunctionScope,
    GlobalScope,
    ModuleScope,
    Scope,
    VariableScope
} from "./scope";
import { getClassNameForConstructor } from "./statement/classStatement";
import { checkDuplicateDeclaration } from "./syntaxChecker";
import { Ts2Panda } from "./ts2panda";
import { TypeRecorder } from "./typeRecorder";
import { LiteralBuffer } from "./base/literal";
import { findOuterNodeOfParenthesis } from "./expression/parenthesizedExpression";
import {
    Label,
    IRNode
} from "./irnodes";
import { LexicalBinder } from "./lexicalBinder";

export class PendingCompilationUnit {
    constructor(
        readonly decl: ts.FunctionLikeDeclaration,
        readonly scope: Scope,
        readonly internalName: string
    ) { }
}

/**
 * The class which drives the compilation process.
 * It handles all dependencies and run passes.
 */
export class CompilerDriver {
    static srcNode: ts.SourceFile | undefined = undefined;
    static isTsFile: boolean = false;
    private fileName: string;
    private recordName: string;
    private passes: Pass[] = [];
    private compilationUnits: PandaGen[];
    pendingCompilationUnits: PendingCompilationUnit[];
    private functionId: number = 1; // 0 reserved for main
    private funcIdMap: Map<ts.Node, number> = new Map<ts.Node, number>();
    private statistics: CompilerStatistics | undefined;
    private needDumpHeader: boolean = true;
    private ts2abcProcess: any = undefined;

    constructor(fileName: string, recordName: string) {
        this.fileName = fileName;
        this.recordName = recordName;
        // register passes here
        this.passes = [
            new CacheExpander(),
            new RegAlloc()
        ];
        this.compilationUnits = [];
        this.pendingCompilationUnits = [];
        if (CmdOptions.showHistogramStatistics() || CmdOptions.showHoistingStatistics()) {
            this.statistics = new CompilerStatistics();
        }
    }

    initiateTs2abcChildProcess(args: Array<string>) {
        this.ts2abcProcess = initiateTs2abc(args);
        listenChildExit(this.getTs2abcProcess());
        listenErrorEvent(this.getTs2abcProcess());
    }

    getTs2abcProcess(): any {
        if (this.ts2abcProcess === undefined) {
            throw new Error("ts2abc hasn't been initiated")
        }
        return this.ts2abcProcess;
    }

    getStatistics() {
        return this.statistics;
    }

    setCustomPasses(passes: Pass[]) {
        this.passes = passes;
    }

    addCompilationUnit(decl: ts.FunctionLikeDeclaration, scope: Scope, recorder: Recorder): string {
        let internalName = this.getFuncInternalName(decl, recorder);
        this.pendingCompilationUnits.push(
            new PendingCompilationUnit(decl, scope, internalName)
        );
        return internalName;
    }

    getCompilationUnits() {
        return this.compilationUnits;
    }

    kind2String(kind: ts.SyntaxKind) {
        return ts.SyntaxKind[kind];
    }

    getASTStatistics(node: ts.Node, statics: number[]) {
        node.forEachChild(childNode => {
            statics[<number>childNode.kind] = statics[<number>childNode.kind] + 1;
            this.getASTStatistics(childNode, statics);
        })
    }

    // sort all function in post order
    postOrderAnalysis(scope: GlobalScope): VariableScope[] {
        let spArray: VariableScope[] = [];
        let stack: VariableScope[] = [];

        stack.push(scope);
        while (stack.length > 0) {
            let temp: VariableScope | undefined = stack.pop();
            if (temp == undefined) {
                break;
            }
            spArray.push(temp);

            for (let childVariableScope of temp.getChildVariableScope()) {
                stack.push(childVariableScope);
            }
        }

        return spArray.reverse();
    }

    compileForSyntaxCheck(node: ts.SourceFile): void {
        if (CompilerDriver.isTypeScriptSourceFile(node)) {
            return;
        }
        let recorder = this.compilePrologue(node, false, true);
        checkDuplicateDeclaration(recorder);
    }

    compile(node: ts.SourceFile, ts2abcProcess?: any | undefined): void {
        CompilerDriver.isTsFile = CompilerDriver.isTypeScriptSourceFile(node);
        if (CmdOptions.showASTStatistics()) {
            let statics: number[] = new Array(ts.SyntaxKind.Count).fill(0);

            this.getASTStatistics(node, statics);
            statics.forEach((element, idx) => {
                if (element > 0) {
                    LOGD(this.kind2String(idx) + " = " + element);
                }
            });
        }
        Label.resetGlobalId();

        let recorder = this.compilePrologue(node, true, false);
        let lexBinder = new LexicalBinder(node, recorder);
        lexBinder.resolve();

        // initiate ts2abc
        if (!CmdOptions.isAssemblyMode()) {
            if (ts2abcProcess) {
                this.ts2abcProcess = ts2abcProcess;
            } else {
                this.initiateTs2abcChildProcess([this.fileName]);
            }
            let ts2abcProc = this.getTs2abcProcess();

            try {
                if (CmdOptions.isMergeAbc()) {
                    // must keep [dumpRecord] at first
                    Ts2Panda.dumpRecord(ts2abcProc, this.recordName);
                }
                Ts2Panda.dumpCmdOptions(ts2abcProc);

                for (let i = 0; i < this.pendingCompilationUnits.length; i++) {
                    let unit: PendingCompilationUnit = this.pendingCompilationUnits[i];
                    this.compileImpl(unit.decl, unit.scope, unit.internalName, recorder);
                }

                Ts2Panda.dumpStringsArray(ts2abcProc);
                Ts2Panda.dumpConstantPool(ts2abcProc);
                Ts2Panda.dumpModuleRecords(ts2abcProc);
                Ts2Panda.dumpTypeInfoRecord(ts2abcProc, true);

                if (ts2abcProcess) {
                    Ts2Panda.dumpOutputFileName(ts2abcProc, this.fileName);
                } else {
                    terminateWritePipe(ts2abcProc);
                }

                if (CmdOptions.isEnableDebugLog()) {
                    let jsonFileName = this.fileName.substring(0, this.fileName.lastIndexOf(".")).concat(".json");
                    writeFileSync(jsonFileName, Ts2Panda.jsonString);
                    LOGD("Successfully generate ", `${jsonFileName}`);
                }
                if (CmdOptions.isOutputType()) {
                    let typeFileName = this.fileName.substring(0, this.fileName.lastIndexOf(".")).concat(".txt");
                    writeFileSync(typeFileName, Ts2Panda.dumpTypeLiteralArrayBuffer());
                }

                Ts2Panda.clearDumpData();
            } catch (err) {
                terminateWritePipe(ts2abcProc);
                throw err;
            }
        } else {
            for (let i = 0; i < this.pendingCompilationUnits.length; i++) {
                let unit: PendingCompilationUnit = this.pendingCompilationUnits[i];
                this.compileImpl(unit.decl, unit.scope, unit.internalName, recorder);
            }
        }

        PandaGen.clearLiteralArrayBuffer();
    }

    dumpInputJsonFileContent(ts2abcProc: any, jsonFileName: string, recordName: string): void {
        Ts2Panda.dumpRecord(ts2abcProc, recordName);
        Ts2Panda.dumpCmdOptions(ts2abcProc);
        Ts2Panda.dumpInputJsonFileContent(ts2abcProc, readFileSync(jsonFileName).toString());
        Ts2Panda.dumpOutputFileName(ts2abcProc, jsonFileName.substring(0, jsonFileName.lastIndexOf(".")).concat(".abc"));
    }

    private compileImpl(node: ts.SourceFile | ts.FunctionLikeDeclaration, scope: Scope,
        internalName: string, recorder: Recorder): void {

        let pandaGen = new PandaGen(internalName, node, this.getParametersCount(node), scope);
        IRNode.pg = pandaGen;

        if (CmdOptions.needRecordSourceCode() && !ts.isSourceFile(node)) {
            // souceCode of [ts.sourceFile] will be record in debugInfo later.
            pandaGen.setSourceCode(node.getText());
        }
        // for debug info
        DebugInfo.addDebugIns(scope, pandaGen, true);

        let compiler = new Compiler(node, pandaGen, this, recorder);

        // because of para vreg, don't change hosting's position
        hoisting(node, pandaGen, recorder, compiler);
        setModuleNamespaceImports(compiler, scope, pandaGen);
        compiler.compile();

        this.passes.forEach((pass) => pass.run(pandaGen));

        // for debug info
        DebugInfo.addDebugIns(scope, pandaGen, false);
        DebugInfo.setDebugInfo(pandaGen);
        DebugInfo.setSourceFileDebugInfo(pandaGen, node);

        if (CmdOptions.isAssemblyMode()) {
            this.writeBinaryFile(pandaGen);
        } else {
            Ts2Panda.dumpPandaGen(pandaGen, this.getTs2abcProcess(), recorder.recordType);
        }

        if (CmdOptions.showHistogramStatistics()) {
            this.statistics!.getInsHistogramStatistics(pandaGen);
        }
    }

    compileUnitTest(node: ts.SourceFile, literalBufferArray?: Array<LiteralBuffer>): void {
        CompilerDriver.isTsFile = CompilerDriver.isTypeScriptSourceFile(node);
        let recorder = this.compilePrologue(node, true, true);
        let lexBinder = new LexicalBinder(node, recorder);
        lexBinder.resolve();

        for (let i = 0; i < this.pendingCompilationUnits.length; i++) {
            let unit: PendingCompilationUnit = this.pendingCompilationUnits[i];
            this.compileUnitTestImpl(unit.decl, unit.scope, unit.internalName, recorder);
        }
        if (literalBufferArray) {
            PandaGen.getLiteralArrayBuffer().forEach(val => literalBufferArray.push(val));
        }

        PandaGen.clearLiteralArrayBuffer();
    }

    private compileUnitTestImpl(node: ts.SourceFile | ts.FunctionLikeDeclaration, scope: Scope,
        internalName: string, recorder: Recorder) {
        let pandaGen = new PandaGen(internalName, node, this.getParametersCount(node), scope);
        IRNode.pg = pandaGen;
        if (CmdOptions.needRecordSourceCode() && !ts.isSourceFile(node)) {
            pandaGen.setSourceCode(node.getText());
        }
        let compiler = new Compiler(node, pandaGen, this, recorder);

        hoisting(node, pandaGen, recorder, compiler);
        setModuleNamespaceImports(compiler, scope, pandaGen);
        compiler.compile();

        this.passes.forEach((pass) => pass.run(pandaGen));

        this.compilationUnits.push(pandaGen);
    }

    static isTypeScriptSourceFile(node: ts.SourceFile) {
        let fileName = node.fileName;
        if (fileName && fileName.endsWith(".ts")) {
            return true;
        } else {
            return false;
        }
    }

    private compilePrologue(node: ts.SourceFile, recordType: boolean, syntaxCheckStatus: boolean) {
        let topLevelScope: GlobalScope | ModuleScope;
        if (CmdOptions.isModules()) {
            topLevelScope = new ModuleScope(node);
        } else {
            topLevelScope = new GlobalScope(node);
        }

        let enableTypeRecord = getRecordTypeFlag(recordType);
        this.setTypeInfoBeforeRecord(enableTypeRecord);
        let recorder = new Recorder(node, topLevelScope, this, enableTypeRecord, CompilerDriver.isTsFile, syntaxCheckStatus);
        recorder.record();
        this.setTypeInfoAfterRecord(enableTypeRecord);
        if (topLevelScope instanceof ModuleScope) {
            topLevelScope.module().setModuleEnvironment(topLevelScope);
        }
        addVariableToScope(recorder, enableTypeRecord);
        assignIndexToModuleVariable(topLevelScope);

        let postOrderVariableScopes = this.postOrderAnalysis(topLevelScope);

        for (let variableScope of postOrderVariableScopes) {
            this.addCompilationUnit(<ts.FunctionLikeDeclaration>variableScope.getBindingNode(), variableScope, recorder);
        }

        return recorder;
    }

    showStatistics(): void {
        if (CmdOptions.showHistogramStatistics()) {
            this.statistics!.printHistogram(false);
        }

        if (CmdOptions.showHoistingStatistics()) {
            this.statistics!.printHoistStatistics();
        }
    }

    getFuncId(node: ts.SourceFile | ts.FunctionLikeDeclaration | ts.ClassLikeDeclaration): number {
        if (this.funcIdMap.has(node)) {
            return this.funcIdMap.get(node)!;
        }

        if (ts.isSourceFile(node)) {
            this.funcIdMap.set(node, 0);
            return 0;
        }

        let idx = this.functionId++;

        this.funcIdMap.set(node, idx);
        return idx;
    }

    getFormatedRecordName() {
        let formatedRecordName: string = '';
        if (CmdOptions.isMergeAbc()) {
            formatedRecordName = this.recordName + '.';
        }
        return formatedRecordName;
    }

    /**
     * Internal name is used to indentify a function in panda file
     * Runtime uses this name to bind code and a Function object
     */
    getFuncInternalName(node: ts.SourceFile | ts.FunctionLikeDeclaration, recorder: Recorder): string {
        let name: string;
        if (ts.isSourceFile(node)) {
            name = "func_main_0";
        } else if (ts.isConstructorDeclaration(node)) {
            let classNode = node.parent;
            return this.getInternalNameForCtor(classNode, node);
        } else {
            let funcNode = <ts.FunctionLikeDeclaration>node;
            name = (<FunctionScope>recorder.getScopeOfNode(funcNode)).getFuncName();
            if (name == '') {
                if ((ts.isFunctionDeclaration(node) && hasExportKeywordModifier(node) && hasDefaultKeywordModifier(node))
                    || ts.isExportAssignment(findOuterNodeOfParenthesis(node))) {
                    return `${this.getFormatedRecordName()}default`;
                }
                return `${this.getFormatedRecordName()}#${this.getFuncId(funcNode)}#`;
            }

            if (name == "func_main_0") {
                return `${this.getFormatedRecordName()}#${this.getFuncId(funcNode)}#${name}`;
            }

            let funcNameMap = recorder.getFuncNameMap();
            if (funcNameMap.has(name)) {
                let freq = <number>funcNameMap.get(name);
                if (freq > 1) {
                    name = `#${this.getFuncId(funcNode)}#${name}`;
                }
            } else {
                throw new Error("the function name is missing from the name map");
            }

            if (name.lastIndexOf(".") != -1 || name.lastIndexOf("\\") != -1) {
                name = `#${this.getFuncId(funcNode)}#`
            }
        }
        return `${this.getFormatedRecordName()}${name}`;
    }

    getInternalNameForCtor(node: ts.ClassLikeDeclaration, ctor: ts.ConstructorDeclaration) {
        let name = getClassNameForConstructor(node);
        name = `#${this.getFuncId(ctor)}#${name}`
        if (name.lastIndexOf(".") != -1) {
            name = `#${this.getFuncId(ctor)}#`
        }
        return `${this.getFormatedRecordName()}${name}`;
    }

    writeBinaryFile(pandaGen: PandaGen) {
        if (this.needDumpHeader) {
            AssemblyDumper.dumpHeader();
            this.needDumpHeader = false;
        }
        new AssemblyDumper(pandaGen).dump();
    }

    private getParametersCount(node: ts.SourceFile | ts.FunctionLikeDeclaration): number {
        // each function and global scope accepts three parameters - funcObj + newTarget + this.
        // the runtime passes these to global scope when calls it
        let parametersCount = 3;
        if (node.kind == ts.SyntaxKind.SourceFile) {
            if (CmdOptions.isCommonJs()) {
                // global scope accepts 5 additional parameters:
                // "exports", "require", "module", "__filename","__dirname"
                // when compiled as commonjs
                parametersCount += 5;
            }
            return parametersCount;
        }
        let decl = <ts.FunctionLikeDeclaration>node;
        parametersCount += decl.parameters.length;
        return parametersCount;
    }

    private setTypeInfoBeforeRecord(enableTypeRecord: boolean) {
        if (enableTypeRecord) {
            TypeRecorder.createInstance();
        }
    }

    private setTypeInfoAfterRecord(enableTypeRecord: boolean) {
        if (enableTypeRecord) {
            TypeRecorder.getInstance().setTypeSummary();
            if (CmdOptions.enableTypeLog()) {
                TypeRecorder.getInstance().getLog();
            }
        } else {
            PandaGen.clearLiteralArrayBuffer();
        }

    }
}
