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

// singleton to parse commandLine infos
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import * as ts from "typescript";
import { LOGE } from "./log";
import * as path from "path";
import { execute } from "./base/util";

export const ts2pandaOptions = [
    { name: 'commonjs', alias: 'c', type: Boolean, defaultValue: false, description: "compile as commonJs module." },
    { name: 'modules', alias: 'm', type: Boolean, defaultValue: false, description: "compile as module." },
    { name: 'debug-log', alias: 'l', type: Boolean, defaultValue: false, description: "show info debug log and generate the json file." },
    { name: 'dump-assembly', alias: 'a', type: Boolean, defaultValue: false, description: "dump assembly to file." },
    { name: 'debug', alias: 'd', type: Boolean, defaultValue: false, description: "compile with debug info." },
    { name: 'debug-add-watch', alias: 'w', type: String, lazyMultiple: true, defaultValue: [], description: "watch expression, abc file path and maybe watchTimeOut(in seconds) in debug mode." },
    { name: 'keep-persistent-watch', alias: 'k', type: String, lazyMultiple: true, defaultValue: [], description: "keep persistent watch on js file with watched expression." },
    { name: 'show-statistics', alias: 's', type: String, lazyMultiple: true, defaultValue: "", description: "show compile statistics(ast, histogram, hoisting, all)." },
    { name: 'output', alias: 'o', type: String, defaultValue: "", description: "set output file." },
    { name: 'timeout', alias: 't', type: Number, defaultValue: 0, description: "js to abc timeout threshold(unit: seconds)." },
    { name: 'opt-log-level', type: String, defaultValue: "error", description: "specifie optimizer log level. Possible values: ['debug', 'info', 'error', 'fatal']" },
    {
        name: 'opt-level', type: Number, defaultValue: 2, description: "Optimization level. Possible values: [0, 1, 2]. Default: 0\n    0: no optimizations\n    \
                                                                    1: basic bytecode optimizations, including valueNumber, lowering, constantResolver, regAccAllocator\n    \
                                                                    2: other bytecode optimizations, unimplemented yet"},
    { name: 'help', alias: 'h', type: Boolean, description: "Show usage guide." },
    { name: 'bc-version', alias: 'v', type: Boolean, defaultValue: false, description: "Print ark bytecode version" },
    { name: 'bc-min-version', type: Boolean, defaultValue: false, description: "Print ark bytecode minimum supported version" },
    { name: 'included-files', alias: 'i', type: String, lazyMultiple: true, defaultValue: [], description: "The list of dependent files." },
    { name: 'record-type', alias: 'p', type: Boolean, defaultValue: false, description: "Record type info. Default: true" },
    { name: 'dts-type-record', alias: 'q', type: Boolean, defaultValue: false, description: "Record type info for .d.ts files. Default: false" },
    { name: 'dts-builtin-type-record', alias: 'b', type: Boolean, defaultValue: false, description: "Recognize builtin types for .d.ts files. Default: false" },
    { name: 'debug-type', alias: 'g', type: Boolean, defaultValue: false, description: "Print type-related log. Default: false" },
    { name: 'output-type', type: Boolean, defaultValue: false, description: "set output type."},
    { name: 'display-typeinfo', type: Boolean, defaultValue: false, description: "Display typeinfo of pairs of instruction orders and types when enable-typeinfo is true" },
    { name: 'function-sourcecode', type: Boolean, defaultValue: false, description: "Record functions' sourceCode to support the feature of [function].toString()" },
    { name: 'expression-watch-toolchain', type: String, defaultValue: "es2panda", description: "Specify the tool chain used to transform the expression" },
    { name: 'source-file', type: String, defaultValue: "", description: "specify the file path info recorded in generated abc" },
    { name: 'generate-tmp-file', type: Boolean, defaultValue: false, description: "whether to generate intermediate temporary files"},
    { name: 'record-name', type: String, defaultValue: "", description: "specify the record name, this option can only be used when [merge-abc] is enabled." },
    { name: 'package-name', type: String, defaultValue: "", description: "specify the package that the compiling file belongs to." },
    { name: 'output-proto', type: Boolean, defaultValue: false, description: "Output protoBin file. Default: false" },
    { name: 'merge-abc', type: Boolean, defaultValue: false, description: "Compile as merge abc" },
    { name: 'input-file', type: String, defaultValue: "", description: "A file containing a list of source files to be compiled. Each line of this file should be constructed in such format: fileName;recordName;moduleType;sourceFile;packageName" },
    { name: 'oh-modules', type: Boolean, defaultValue: false, description: "Set oh-modules as typescript compiler's package manager type. Default: false" }
]



export class CmdOptions {
    private static parsedResult: ts.ParsedCommandLine;
    private static options: commandLineArgs.CommandLineOptions;

    static getDisplayTypeinfo(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["display-typeinfo"];
    }

    static isEnableDebugLog(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["debug-log"];
    }

    static isAssemblyMode(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["dump-assembly"];
    }

    static isDebugMode(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["debug"];
    }

    static setWatchEvaluateExpressionArgs(watchArgs: string[]) {
        this.options["debug-add-watch"] = watchArgs;
    }

    static getDeamonModeArgs(): string[] {
        if (!this.options) {
            return [];
        }
        return this.options["keep-persistent-watch"];
    }

    static isWatchEvaluateDeamonMode(): boolean {
        return CmdOptions.getDeamonModeArgs()[0] == "start";
    }

    static isStopEvaluateDeamonMode(): boolean {
        return CmdOptions.getDeamonModeArgs()[0] == "stop";
    }

    static getEvaluateDeamonPath(): string {
        return CmdOptions.getDeamonModeArgs()[1];
    }

    static isWatchEvaluateExpressionMode(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["debug-add-watch"].length != 0;
    }

    static getEvaluateExpression(): string {
        return this.options["debug-add-watch"][0];
    }

    static getWatchJsPath(): string {
        return this.options["debug-add-watch"][1];
    }

    static getWatchTimeOutValue(): number {
        if (this.options["debug-add-watch"].length == 2) {
            return 0;
        }
        return this.options["debug-add-watch"][2];
    }

    static watchViaEs2pandaToolchain(): boolean {
        if (!this.options) {
            return false;
        }
        if (this.options["expression-watch-toolchain"] && this.options["expression-watch-toolchain"] != "es2panda") {
            return false;
        }
        return true;
    }

    static isCompileFilesList(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["input-file"].length != 0;
    }

    static getCompileFilesList(): string {
        return this.options["input-file"];
    }

    static isCommonJs(): boolean {
        if (!this.options) {
            return false;
        }

        if (this.options["commonjs"] && this.options["modules"]) {
            throw new Error("Can not compile with [-c] and [-m] options at the same time");
        }

        return this.options["commonjs"];
    }

    static isModules(): boolean {
        if (!this.options) {
            return false;
        }

        if (this.options["modules"] && this.options["commonjs"]) {
            throw new Error("Can not compile with [-m] and [-c] options at the same time");
        }

        return this.options["modules"];
    }

    static getOptLevel(): number {
        return this.options["opt-level"];
    }

    static getOptLogLevel(): string {
        return this.options["opt-log-level"];
    }

    static showASTStatistics(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["show-statistics"].includes("ast") || this.options["show-statistics"].includes("all");
    }

    static showHistogramStatistics(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["show-statistics"].includes("all") || this.options["show-statistics"].includes("histogram");
    }

    static showHoistingStatistics(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["show-statistics"].includes("all") || this.options["show-statistics"].includes("hoisting");
    }

    static getInputFileName(): string {
        let path = this.parsedResult.fileNames[0];
        let inputFile = path.substring(0, path.lastIndexOf('.'));
        return inputFile;
    }

    static getOutputBinName(): string {
        let outputFile = this.options.output;
        if (outputFile == "") {
            outputFile = CmdOptions.getInputFileName() + ".abc";
        }
        return outputFile;
    }

    static setMergeAbc(mergeAbcMode: Boolean): void {
        if (!this.options) {
            return;
        }
        this.options["merge-abc"] = mergeAbcMode;
    }

    static getRecordName(): string {
        if (!this.options || !this.options["merge-abc"]) {
            return "";
        }

        return this.options["record-name"];
    }

    static getTimeOut(): Number {
        if (!this.options) {
            return 0;
        }
        return this.options["timeout"];
    }

    static isOutputType(): false {
        if (!this.options) {
            return false;
        }
        return this.options["output-type"];
    }

    static showHelp(): void {
        const usage = commandLineUsage([
            {
                header: "Ark JavaScript Compiler",
                content: 'node --expose-gc index.js [options] file.js'
            },
            {
                header: 'Options',
                optionList: ts2pandaOptions
            },
            {
                content: 'Project Ark'
            }
        ])
        LOGE(usage);
    }

    static isBcVersion(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["bc-version"];
    }

    static getVersion(isBcVersion: boolean = true): void {
        let js2abc = path.join(path.resolve(__dirname, '../bin'), "js2abc");
        let version_arg = isBcVersion ? "--bc-version" : "--bc-min-version"
        execute(`${js2abc}`, [version_arg]);
    }

    static isBcMinVersion(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["bc-min-version"];
    }

    static getIncludedFiles(): string[] {
        if (!this.options) {
            return [];
        }

        return this.options["included-files"];
    }

    static needRecordType(): boolean {
        if (!this.options) {
            return false;
        }

        return !this.options["record-type"];
    }

    static needRecordDtsType(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["dts-type-record"];
    }

    static needRecordBuiltinDtsType(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["dts-builtin-type-record"];
    }

    static enableTypeLog(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["debug-type"];
    }

    static needRecordSourceCode(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["function-sourcecode"];
    }

    static getSourceFile(): string {
        return this.options["source-file"];
    }

    static getPackageName(): string {
        if (!this.options || !this.options["merge-abc"]) {
            return "";
        }

        return this.options["package-name"];
    }

    static needGenerateTmpFile(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["generate-tmp-file"];
    }

    static isOutputproto(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["output-proto"];
    }

    static isMergeAbc(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["merge-abc"]
    }

    static isOhModules(): boolean {
        if (!this.options) {
            return false;
        }
        return this.options["oh-modules"]
    }

    // @ts-ignore
    static parseUserCmd(args: string[]): ts.ParsedCommandLine | undefined {
        this.options = commandLineArgs(ts2pandaOptions, { partial: true });
        if (this.options.help) {
            this.showHelp();
            return undefined;
        }

        if (this.isBcVersion() || this.isBcMinVersion()) {
            this.getVersion(this.isBcVersion());
            return undefined;
        }

        if (!this.options._unknown) {
            LOGE("options at least one file is needed");
            this.showHelp();
            return undefined;
        }

        this.parsedResult = ts.parseCommandLine(this.options._unknown!);
        return this.parsedResult;
    }

    static parseCustomLibrary(args: string[]): string[] | undefined {
        this.options = commandLineArgs(ts2pandaOptions, { partial: true });
        if (this.options.help || this.isBcVersion() || this.isBcMinVersion() || !this.options._unknown) {
            return undefined;
        }
        this.parsedResult = ts.parseCommandLine(this.options._unknown!);
        return this.parsedResult.options["lib"];
    }
}
