import { PandaGen } from "./pandagen";
import { Ins, ModuleRecord, Signature } from "./pandasm";
export declare class Ts2Panda {
    static strings: Set<string>;
    static labelPrefix: string;
    static jsonString: string;
    static moduleRecordlist: Array<ModuleRecord>;
    constructor();
    static getFuncSignature(pg: PandaGen): Signature;
    static getFuncInsnsAndRegsNum(pg: PandaGen): {
        insns: Ins[];
        regsNum: number;
        labels: string[];
    };
    static dumpStringsArray(ts2abc: any): void;
    static dumpTypeLiteralArrayBuffer(): string;
    static dumpConstantPool(ts2abc: any): void;
    static dumpCmdOptions(ts2abc: any): void;
    static dumpRecord(ts2abc: any, recordName: string): void;
    static dumpInstTypeMap(pg: PandaGen): any;
    static dumpPandaGen(pg: PandaGen, ts2abc: any, recordType?: boolean): void;
    static dumpModuleRecords(ts2abc: any): void;
    static dumpTypeInfoRecord(ts2abc: any, recordType: boolean): void;
    static dumpInputJsonFileContent(ts2abc: any, inputJsonFileContent: string): void;
    static dumpOutputFileName(ts2abc: any, outputFileName: string): void;
    static clearDumpData(): void;
}
//# sourceMappingURL=ts2panda.d.ts.map