/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

import * as path from "path";
import * as ts from "typescript";
import * as fs from "fs";
import { CmdOptions, ts2pandaOptions } from "./cmdOptions";
import commandLineArgs from "command-line-args";
import { CompilerDriver } from "./compilerDriver";
import * as diag from "./diagnostic";
import * as jshelpers from "./jshelpers";
import {
    LOGE,
    printAstRecursively
} from "./log";
import {
    setGlobalDeclare,
    setGlobalStrict
} from "./strictMode";
import { TypeChecker } from "./typeChecker";
import { IGNORE_ERROR_CODE } from './ignoreSyntaxError';
import {
    setPos,
    isBase64Str,
    transformCommonjsModule,
    getRecordName,
    getOutputBinName,
    terminateWritePipe,
    makeNameForGeneratedNode,
    resetUniqueNameIndex
} from "./base/util";

function checkIsGlobalDeclaration(sourceFile: ts.SourceFile) {
    for (let statement of sourceFile.statements) {
        if (statement.modifiers) {
            for (let modifier of statement.modifiers) {
                if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
                    return false;
                }
            }
        } else if (statement.kind === ts.SyntaxKind.ExportAssignment) {
            return false;
        } else if (statement.kind === ts.SyntaxKind.ImportKeyword || statement.kind === ts.SyntaxKind.ImportDeclaration) {
            return false;
        }
    }
    return true;
}

function generateDTs(node: ts.SourceFile, options: ts.CompilerOptions) {
    let outputBinName = getOutputBinName(node);
    let compilerDriver = new CompilerDriver(outputBinName, getRecordName(node));
    CompilerDriver.srcNode = node;
    setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, options));
    compilerDriver.compile(node);
    compilerDriver.showStatistics();
}

function main(fileNames: string[], options: ts.CompilerOptions, inputJsonFiles?: string[], cmdArgsSet?: Map<string, string[]>) {
    const host = ts.createCompilerHost(options);
    if (!CmdOptions.needGenerateTmpFile()) {
        host.writeFile = () => {};
    }

    let program = ts.createProgram(fileNames, options, host);
    let typeChecker = TypeChecker.getInstance();
    typeChecker.setTypeChecker(program.getTypeChecker());

    if (CmdOptions.needRecordDtsType()) {
        for (let sourceFile of program.getSourceFiles()) {
            let originFileNames;
            if (!Compiler.Options.Default["lib"]) {
                originFileNames = new Set(fileNames.slice(0, fileNames.length - dtsFiles.length));
            } else {
                originFileNames = new Set(fileNames.slice(0, fileNames.length));
            }
            if (sourceFile.isDeclarationFile && !program.isSourceFileDefaultLibrary(sourceFile) && originFileNames.has(sourceFile.fileName)) {
                setGlobalDeclare(checkIsGlobalDeclaration(sourceFile));
                generateDTs(sourceFile, options);
            }
        }
    }

    if (checkDiagnosticsError(program)) {
        return;
    }

    let initCompilerDriver = new CompilerDriver("", "");
    let initTs2abcProcessState = false;

    let emitResult = program.emit(
        undefined,
        undefined,
        undefined,
        undefined,
        {
            before: [
                // @ts-ignore
                (ctx: ts.TransformationContext) => {
                    return (node: ts.SourceFile) => {
                        if (CmdOptions.isCompileFilesList()) {
                            let specifiedCmdArgs = cmdArgsSet.get(node.fileName);
                            if (specifiedCmdArgs === undefined) {
                                return node;
                            }
                            let originProcessArgs = process.argv.slice(0);
                            // insert specifiedCmdArgs's elements ahead the process.argv's element
                            // whose index is 2 (count from 0)
                            Array.prototype.splice.apply(process.argv, specifiedCmdArgs);
                            //@ts-ignore
                            CmdOptions.options = commandLineArgs(ts2pandaOptions, { partial: true });
                            process.argv = originProcessArgs.slice(0);
                        }
                        let outputBinName = getOutputBinName(node);
                        let compilerDriver = new CompilerDriver(outputBinName, getRecordName(node));
                        compilerDriver.compileForSyntaxCheck(node);
                        return node;
                    }
                }
            ],
            after: [
                // @ts-ignore
                (ctx: ts.TransformationContext) => {
                    return (node: ts.SourceFile) => {
                        if (CmdOptions.isCompileFilesList()) {
                            if (!initTs2abcProcessState) {
                                initCompilerDriver.initiateTs2abcChildProcess(["--multi-programs-pipe"]);
                                initTs2abcProcessState = true;
                            }
                            let specifiedCmdArgs = cmdArgsSet.get(node.fileName);
                            if (specifiedCmdArgs == undefined) {
                                return node;
                            }
                        }
                        resetUniqueNameIndex();
                        makeNameForGeneratedNode(node);
                        printAstRecursively(node, 0, node);

                        if (ts.getEmitHelpers(node)) {
                            let newStatements = [];
                            ts.getEmitHelpers(node)?.forEach(
                                item => {
                                    let emitHelperSourceFile = ts.createSourceFile(node.fileName, <string>item.text, options.target!, true, ts.ScriptKind.JS);
                                    emitHelperSourceFile.statements.forEach(emitStatement => {
                                        let emitNode = setPos(emitStatement);
                                        newStatements.push(emitNode);
                                    });
                                }
                            )
                            newStatements.push(...node.statements);
                            node = ts.factory.updateSourceFile(node, newStatements);
                        }
                        if (CmdOptions.isCommonJs()) {
                            node = transformCommonjsModule(node);
                        }
                        let outputBinName = getOutputBinName(node);
                        let compilerDriver = new CompilerDriver(outputBinName, getRecordName(node));
                        CompilerDriver.srcNode = node;
                        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, options));
                        if (CmdOptions.isCompileFilesList()) {
                            compilerDriver.compile(node, initCompilerDriver.getTs2abcProcess());
                        } else {
                            compilerDriver.compile(node);
                        }
                        compilerDriver.showStatistics();
                        return node;
                    }
                }
            ]
        }
    );

    if (CmdOptions.isCompileFilesList()) {
        if (!initTs2abcProcessState) {
            initCompilerDriver.initiateTs2abcChildProcess(["--multi-programs-pipe"]);
        }
        for (let i = 0; i < inputJsonFiles.length; i++) {
            let jsonFileName = inputJsonFiles[i];
            let originProcessArgs = process.argv.slice(0);
            Array.prototype.splice.apply(process.argv, cmdArgsSet.get(jsonFileName));
            //@ts-ignore
            CmdOptions.options = commandLineArgs(ts2pandaOptions, { partial: true });
            process.argv = originProcessArgs.slice(0);
            initCompilerDriver.dumpInputJsonFileContent(initCompilerDriver.getTs2abcProcess(), jsonFileName, CmdOptions.getRecordName());
        }
        terminateWritePipe(initCompilerDriver.getTs2abcProcess());
    }

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        let ignoerErrorSet = new Set(IGNORE_ERROR_CODE);
        if (ignoerErrorSet.has(diagnostic.code)) {
          return;
        }
        diag.printDiagnostic(diagnostic);
    });
}

function transformSourcefilesList(parsed: ts.ParsedCommandLine | undefined) {
    let inputFile = CmdOptions.getCompileFilesList();
    let sourceFileInfoArray = [];
    try {
        sourceFileInfoArray = fs.readFileSync(inputFile).toString().split("\n");
    } catch(err) {
        throw err;
    }
    if (sourceFileInfoArray.length == 0) return;

    let files: string[] = parsed.fileNames;
    let inputJsonFiles: string[] = [];
    let cmdArgsSet = new Map();

    for (let i = 0; i < sourceFileInfoArray.length; i++) {
        let sourceFileInfo = sourceFileInfoArray[i].split(";");
        if (sourceFileInfo.length != 5) {
            throw new Error(
                "Input info for each file need \"fileName;recordName;moduleType;sourceFile;packageName\" style.");
        }

        let inputFileName = sourceFileInfo[0];
        let inputFileSuffix = inputFileName.substring(inputFileName.lastIndexOf(".") + 1);
        if (inputFileSuffix == "json") {
            inputJsonFiles.push(inputFileName);
        } else {
            files.unshift(inputFileName);
        }

        let specifiedCmdArgs = ["--record-name", sourceFileInfo[1]];
        switch (sourceFileInfo[2]) {
            case "esm":
                specifiedCmdArgs.push.apply(specifiedCmdArgs, ["-m"]);
                break;
            case "commonjs":
                specifiedCmdArgs.push.apply(specifiedCmdArgs, ["-c"]);
                break;
            case "na":
                break;
            default:
                throw new Error("The third info should be \"esm\", \"commonjs\" or \"na\".");
        }
        specifiedCmdArgs.push.apply(specifiedCmdArgs, ["--source-file", sourceFileInfo[3]]);
        specifiedCmdArgs.push.apply(specifiedCmdArgs, ["--package-name", sourceFileInfo[4]]);
        // insert two elements 2 and 0 at the beginning of the specifiedCmdArgs array,
        // useful for Array.prototype.splice.apply
        specifiedCmdArgs.unshift(2, 0);
        cmdArgsSet.set(inputFileName, specifiedCmdArgs);
    }

    main(files, parsed.options, inputJsonFiles, cmdArgsSet);
}

function getDtsFiles(libDir: string): string[] {
    let dtsFiles:string[] = [];
    function finDtsFile(dir){
        let files = fs.readdirSync(dir);
        files.forEach(function (item, _) {
            let fPath = path.join(dir,item);
            let stat = fs.statSync(fPath);
            if(stat.isDirectory() === true) {
                finDtsFile(fPath);
            }
            if (stat.isFile() === true && item.endsWith(".d.ts") === true) {
                dtsFiles.push(fPath);
            }
        });
    }
    finDtsFile(libDir);
    return dtsFiles;
}

function specifyCustomLib(customLib) {
    Compiler.Options.Default["lib"] = customLib;
    let curFiles = fs.readdirSync(__dirname);
    const { execSync } = require('child_process');
    dtsFiles.forEach(function (dtsFile, _) {
        let target = dtsFile.split(path.sep).pop();
        if (curFiles.indexOf(target) === -1){
            let createSymlinkCmd;
            if (/^win/.test(require('os').platform())) {
                // On windows platform, administrator permission is needed to create Symlink.
                createSymlinkCmd = `mklink ${__dirname}${path.sep}${target} ${dtsFile}`;
            } else {
                createSymlinkCmd = `ln -s ${dtsFile} ${__dirname}${path.sep}${target}`;
            }
            execSync(createSymlinkCmd, (err, stdout, stderr) => {
                if (err) {
                    LOGE(err);
                }
            });
        }
    });
}

const stopWatchingStr = "####";
const watchAbcFileDefaultTimeOut = 10;
const watchFileName = "watch_expressions";
const watchOutputFileName = "Base64Output";
// this path is only available in sdk
const es2abcBinaryPath = path["join"](__dirname, "..", "bin", path.sep);
const es2abcBinaryName = /^win/.test(require('os').platform()) ? "es2abc.exe" : "es2abc";
const es2abcBase64Input = "--base64Input";
const es2abcDebuggerEvaluateFlag = "--debugger-evaluate-expression";
const es2abcBase64Output = "--base64Output";
// need to specify the record name as 'Base64Output' in es2abc's commandline; cancel the opMergeAbc option

function callEs2pandaToolChain(ideInputStr: string) {
    let commandLine = "\"" + es2abcBinaryPath + es2abcBinaryName + "\" " + es2abcBase64Input + " \"" + ideInputStr
                      + "\" " + es2abcDebuggerEvaluateFlag + " " + es2abcBase64Output;
    var exec = require('child_process').exec;
    exec(`${commandLine}`, function(error, stdout) {
        if (error) {
            console.log("generate abc file failed, please check the input string and syntax of the expression");
            return;
        }
        process.stdout.write(stdout);
    });
}

function updateWatchJsFile() {
    let ideInputStr = CmdOptions.getEvaluateExpression();
    if (CmdOptions.watchViaEs2pandaToolchain()) {
        callEs2pandaToolChain(ideInputStr);
        return;
    }
    if (!isBase64Str(ideInputStr)) {
        throw new Error("Passed expression string for evaluating is not base64 style.");
    }
    let watchAbcFileTimeOut = watchAbcFileDefaultTimeOut;
    if (CmdOptions.getWatchTimeOutValue() != 0) { watchAbcFileTimeOut = CmdOptions.getWatchTimeOutValue(); }
    let watchFilePrefix = CmdOptions.getWatchJsPath() + path.sep + watchFileName;
    let originExpre = Buffer.from(ideInputStr, 'base64').toString();
    let jsFileName = watchFilePrefix + ".js";
    let abcFileName = watchFilePrefix + ".abc";
    let errorMsgFileName = watchFilePrefix + ".err";

    fs.watchFile(errorMsgFileName, { persistent: true, interval: 50 }, (curr, prev) => {
        if (+curr.mtime <= +prev.mtime) {
            fs.unwatchFile(jsFileName);
            fs.unwatchFile(abcFileName);
            throw new Error("watched errMsg file has not been initialized");
        }
        console.log("error in genarate abc file for this expression.");
        fs.unwatchFile(abcFileName);
        fs.unwatchFile(errorMsgFileName);
        process.exit();
    });
    fs.watchFile(abcFileName, { persistent: true, interval: 50 }, (curr, prev) => {
        if (+curr.mtime <= +prev.mtime) {
            fs.unwatchFile(jsFileName);
            fs.unwatchFile(errorMsgFileName);
            throw new Error("watched abc file has not been initialized");
        }
        let base64data = fs.readFileSync(abcFileName);
        let watchResStr = Buffer.from(base64data).toString('base64');
        console.log(watchResStr);
        fs.unwatchFile(abcFileName);
        fs.unwatchFile(errorMsgFileName);
        process.exit();
    });
    fs.writeFileSync(jsFileName, originExpre);
    setTimeout(() => {
        fs.unwatchFile(jsFileName);
        fs.unwatchFile(abcFileName);
        fs.unwatchFile(errorMsgFileName);
        fs.unlinkSync(jsFileName);
        fs.unlinkSync(abcFileName);
        fs.unlinkSync(errorMsgFileName);
        throw new Error("watchFileServer has not been initialized");
    }, watchAbcFileTimeOut*1000);
}

function compileWatchExpression(jsFileName: string, errorMsgFileName: string, options: ts.CompilerOptions,
                                watchedProgram: ts.Program) {
    CmdOptions.setWatchEvaluateExpressionArgs(['','']);
    let fileName = watchFileName + ".js";
    let errorMsgRecordFlag = false;
    let sourceFile = ts.createSourceFile(fileName, fs.readFileSync(jsFileName).toString(), ts.ScriptTarget.ES2017);
    let jsFileDiagnostics = watchedProgram.getSyntacticDiagnostics(sourceFile);
    jsFileDiagnostics.forEach(diagnostic => {
        if (!errorMsgRecordFlag) {
            fs.writeFileSync(errorMsgFileName, "There are syntax errors in input expression.\n");
            errorMsgRecordFlag = true;
        }
        diag.printDiagnostic(diagnostic);
        return;
    });
    if (errorMsgRecordFlag) {
        return;
    }
    watchedProgram.emit(
        undefined,
        undefined,
        undefined,
        undefined,
        {
            before: [
                // @ts-ignore
                (ctx: ts.TransformationContext) => {
                    return (node: ts.SourceFile) => {
                        if (path.basename(node.fileName) == fileName) { node = sourceFile; }
                        let outputBinName = getOutputBinName(node);
                        let compilerDriver = new CompilerDriver(outputBinName, watchOutputFileName);
                        compilerDriver.compileForSyntaxCheck(node);
                        return node;
                    }
                }
            ],
            after: [
                // @ts-ignore
                (ctx: ts.TransformationContext) => {
                    return (node: ts.SourceFile) => {
                        resetUniqueNameIndex();
                        makeNameForGeneratedNode(node);
                        if (ts.getEmitHelpers(node)) {
                            let newStatements = [];
                            ts.getEmitHelpers(node)?.forEach(
                                item => {
                                    let emitHelperSourceFile = ts.createSourceFile(node.fileName, <string>item.text, options.target!, true, ts.ScriptKind.JS);
                                    emitHelperSourceFile.statements.forEach(emitStatement => {
                                        let emitNode = setPos(emitStatement);
                                        newStatements.push(emitNode);
                                    });
                                }
                            )
                            newStatements.push(...node.statements);
                            node = ts.factory.updateSourceFile(node, newStatements);
                        }
                        let outputBinName = getOutputBinName(node);
                        let compilerDriver = new CompilerDriver(outputBinName, watchOutputFileName);
                        CompilerDriver.srcNode = node;
                        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, options));
                        compilerDriver.compile(node);
                        return node;
                    }
                }
            ]
        }
    );
}

function launchWatchEvaluateDeamon(parsed: ts.ParsedCommandLine | undefined) {
    if (CmdOptions.watchViaEs2pandaToolchain()) {
        console.log("startWatchingSuccess supportTimeout");
        return;
    }
    let deamonJSFilePrefix = CmdOptions.getEvaluateDeamonPath() + path.sep + watchFileName;
    let deamonABCFilePrefix = CmdOptions.getEvaluateDeamonPath() + path.sep + watchOutputFileName;
    let jsFileName = deamonJSFilePrefix + ".js";
    let abcFileName = deamonABCFilePrefix + ".abc";
    let errorMsgFileName = deamonJSFilePrefix + ".err";

    if (fs.existsSync(jsFileName)) {
        console.log("watchFileServer has been initialized supportTimeout");
        return;
    }
    let files: string[] = parsed.fileNames;
    fs.writeFileSync(jsFileName, "initJsFile\n");
    fs.writeFileSync(errorMsgFileName, "initErrMsgFile\n");
    files.unshift(jsFileName);
    let watchedProgram = ts.createProgram(files, parsed.options);
    compileWatchExpression(jsFileName, errorMsgFileName, parsed.options, watchedProgram);

    fs.watchFile(jsFileName, { persistent: true, interval: 50 }, (curr, prev) => {
        if (+curr.mtime <= +prev.mtime) {
            throw new Error("watched js file has not been initialized");
        }
        if (fs.readFileSync(jsFileName).toString() == stopWatchingStr) {
            fs.unwatchFile(jsFileName);
            console.log("stopWatchingSuccess");
            return;
        }
        compileWatchExpression(jsFileName, errorMsgFileName, parsed.options, watchedProgram);
    });
    console.log("startWatchingSuccess supportTimeout");

    process.on("exit", () => {
        fs.unlinkSync(jsFileName);
        fs.unlinkSync(abcFileName);
        fs.unlinkSync(errorMsgFileName);
    });
}

function checkDiagnosticsError(program: ts.Program) {
    let diagnosticsFlag = false;
    let allDiagnostics = ts
        .getPreEmitDiagnostics(program);
    allDiagnostics.forEach(diagnostic => {
        let ignoerErrorSet = new Set(IGNORE_ERROR_CODE);
        if (ignoerErrorSet.has(diagnostic.code)) {
            diagnosticsFlag = false;
            return;
        }
        diagnosticsFlag = true;
        diag.printDiagnostic(diagnostic);
    });

    return diagnosticsFlag;
}

namespace Compiler {
    export namespace Options {
        export let Default: ts.CompilerOptions = {
            outDir: "../tmp/build",
            allowJs: true,
            noEmitOnError: false,
            noImplicitAny: false,
            target: ts.ScriptTarget.ES2018,
            module: ts.ModuleKind.ES2015,
            strictNullChecks: false,
            skipLibCheck: true,
            alwaysStrict: true,
            importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
            experimentalDecorators: true,
            preserveConstEnums: true
        };
    }
}

function run(args: string[], options?: ts.CompilerOptions): void {
    let parsed = CmdOptions.parseUserCmd(args);
    if (!parsed) {
        return;
    }

    if (options) {
        if (!((parsed.options.project) || (parsed.options.build))) {
            parsed.options = options;
        }
    }
    if (CmdOptions.isOhModules()) {
        parsed.options["packageManagerType"] = "ohpm";
    }
    try {
        if (CmdOptions.isWatchEvaluateDeamonMode()) {
            launchWatchEvaluateDeamon(parsed);
            return;
        }
        if (CmdOptions.isStopEvaluateDeamonMode()) {
            if (CmdOptions.watchViaEs2pandaToolchain()) {
                console.log("stopWatchingSuccess");
            } else {
                fs.writeFileSync(CmdOptions.getEvaluateDeamonPath() + path.sep + watchFileName + ".js", stopWatchingStr);
            }
            return;
        }
        if (CmdOptions.isWatchEvaluateExpressionMode()) {
            updateWatchJsFile();
            return;
        }
        if (CmdOptions.isCompileFilesList()) {
            transformSourcefilesList(parsed);
            return;
        }

        main(parsed.fileNames.concat(CmdOptions.getIncludedFiles()), parsed.options);
    } catch (err) {
        if (err instanceof diag.DiagnosticError) {
            let diagnostic = diag.getDiagnostic(err.code);
            if (diagnostic != undefined) {
                let diagnosticLog = diag.createDiagnostic(err.file, err.irnode, diagnostic, ...err.args);
                diag.printDiagnostic(diagnosticLog);
            }
        } else if (err instanceof SyntaxError) {
            LOGE(err.name, err.message);
        } else {
            throw err;
        }
    }
}

let dtsFiles = getDtsFiles(path["join"](__dirname, "../node_modules/typescript/lib"));
let customLib = CmdOptions.parseCustomLibrary(process.argv);
if (!customLib || customLib.length === 0) {
    process.argv.push(...dtsFiles);
} else {
    specifyCustomLib(customLib);
}

run(process.argv.slice(2), Compiler.Options.Default);
global.gc();
