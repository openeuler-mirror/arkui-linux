import * as ts from "typescript";
export declare const ts2pandaOptions: ({
    name: string;
    alias: string;
    type: BooleanConstructor;
    defaultValue: boolean;
    description: string;
    lazyMultiple?: undefined;
} | {
    name: string;
    alias: string;
    type: StringConstructor;
    lazyMultiple: boolean;
    defaultValue: any[];
    description: string;
} | {
    name: string;
    alias: string;
    type: StringConstructor;
    lazyMultiple: boolean;
    defaultValue: string;
    description: string;
} | {
    name: string;
    alias: string;
    type: StringConstructor;
    defaultValue: string;
    description: string;
    lazyMultiple?: undefined;
} | {
    name: string;
    alias: string;
    type: NumberConstructor;
    defaultValue: number;
    description: string;
    lazyMultiple?: undefined;
} | {
    name: string;
    type: StringConstructor;
    defaultValue: string;
    description: string;
    alias?: undefined;
    lazyMultiple?: undefined;
} | {
    name: string;
    type: NumberConstructor;
    defaultValue: number;
    description: string;
    alias?: undefined;
    lazyMultiple?: undefined;
} | {
    name: string;
    alias: string;
    type: BooleanConstructor;
    description: string;
    defaultValue?: undefined;
    lazyMultiple?: undefined;
} | {
    name: string;
    type: BooleanConstructor;
    defaultValue: boolean;
    description: string;
    alias?: undefined;
    lazyMultiple?: undefined;
})[];
export declare class CmdOptions {
    private static parsedResult;
    private static options;
    static getDisplayTypeinfo(): boolean;
    static isEnableDebugLog(): boolean;
    static isAssemblyMode(): boolean;
    static isDebugMode(): boolean;
    static setWatchEvaluateExpressionArgs(watchArgs: string[]): void;
    static getDeamonModeArgs(): string[];
    static isWatchEvaluateDeamonMode(): boolean;
    static isStopEvaluateDeamonMode(): boolean;
    static getEvaluateDeamonPath(): string;
    static isWatchEvaluateExpressionMode(): boolean;
    static getEvaluateExpression(): string;
    static getWatchJsPath(): string;
    static getWatchTimeOutValue(): number;
    static watchViaEs2pandaToolchain(): boolean;
    static isCompileFilesList(): boolean;
    static getCompileFilesList(): string;
    static isCommonJs(): boolean;
    static isModules(): boolean;
    static getOptLevel(): number;
    static getOptLogLevel(): string;
    static showASTStatistics(): boolean;
    static showHistogramStatistics(): boolean;
    static showHoistingStatistics(): boolean;
    static getInputFileName(): string;
    static getOutputBinName(): string;
    static setMergeAbc(mergeAbcMode: Boolean): void;
    static getRecordName(): string;
    static getTimeOut(): Number;
    static isOutputType(): false;
    static showHelp(): void;
    static isBcVersion(): boolean;
    static getVersion(isBcVersion?: boolean): void;
    static isBcMinVersion(): boolean;
    static getIncludedFiles(): string[];
    static needRecordType(): boolean;
    static needRecordDtsType(): boolean;
    static needRecordBuiltinDtsType(): boolean;
    static enableTypeLog(): boolean;
    static needRecordSourceCode(): boolean;
    static getSourceFile(): string;
    static getPackageName(): string;
    static needGenerateTmpFile(): boolean;
    static isOutputproto(): boolean;
    static isMergeAbc(): boolean;
    static isOhModules(): boolean;
    static parseUserCmd(args: string[]): ts.ParsedCommandLine | undefined;
    static parseCustomLibrary(args: string[]): string[] | undefined;
}
//# sourceMappingURL=cmdOptions.d.ts.map