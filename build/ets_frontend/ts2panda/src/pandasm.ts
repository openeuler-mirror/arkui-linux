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

import { LiteralBuffer } from "./base/literal";
import { DebugPosInfo, VariableDebugInfo } from "./debuginfo";

export class Metadata {
    public attribute: string;

    constructor(
        attribute: string = ""
    ) {
        this.attribute = attribute;
    }
}

export class Signature {
    public p: number;  // parameters
    public rt: string | undefined; // return type is always 'any', so we ignore it in json

    constructor(params: number = 0, retType?: string | undefined) {
        this.p = params;
        this.rt = retType;
    }
}

export class Ins {
    public o: number | undefined;  // op
    public r: Array<number> | undefined;  // resgs
    public id: Array<string> | undefined;  // ids
    public im: Array<number> | undefined;  // imms
    public l: string | undefined;  // label

    public d: DebugPosInfo | undefined;  // debug position info
    constructor(
        op: number | undefined = undefined,
        regs: Array<number> | undefined = undefined,
        ids: Array<string> | undefined = undefined,
        imms: Array<number> | undefined = undefined,
        label: string | undefined = undefined,
        dbg_pos: DebugPosInfo | undefined = undefined,
    ) {
        this.o = op;
        this.r = regs;
        this.id = ids;
        this.im = imms;
        this.l = label;
        this.d = dbg_pos;
    }
}

export class Function {
    public n: string;  // name
    public s: Signature;  // signature
    public r: number;  // regs number
    public i: Array<Ins>;  // ins
    public l: Array<string> | undefined;  // labels
    public ca_tab: Array<CatchTable> | undefined;  // catch tabels
    public v: Array<VariableDebugInfo> | undefined;  // variables
    public sf: string;  // source file
    public sc: string | undefined;  // source code
    public ct: number | undefined;  // call type
    public ti: Array<number> | undefined;  // typeinfo: record type index array, starts from reg_0
    public es2t: Array<ExportedSymbol2Type> | undefined;  // exportedSymbol2Types
    public ds2t: Array<DeclaredSymbol2Type> | undefined;  // declaredSymbol2Types
    public kind: number;
    public icSize: number;

    constructor(
        name: string,
        signature: Signature,
        regs_num: number = 0,
        ins: Array<Ins> = [],
        labs: Array<string> | undefined = undefined,
        vars: Array<VariableDebugInfo> | undefined = undefined,
        catchTables: Array<CatchTable> | undefined = undefined,
        sourceFiles: string = "",
        sourceCodes: string | undefined = undefined,
        callType: number | undefined = undefined,
        typeInfo: Array<number> | undefined = undefined,
        exportedSymbol2Types: Array<ExportedSymbol2Type> | undefined = undefined,
        declaredSymbol2Types: Array<DeclaredSymbol2Type> | undefined = undefined,
        kind: number,
        icSize: number
    ) {
        this.n = name;
        this.s = signature;
        this.i = ins;
        this.l = labs;
        this.r = regs_num;
        this.ca_tab = catchTables;
        this.v = vars;
        this.sf = sourceFiles;
        this.sc = sourceCodes;
        this.ct = callType;
        this.ti = typeInfo;
        this.es2t = exportedSymbol2Types;
        this.ds2t = declaredSymbol2Types;
        this.kind = kind;
        this.icSize = icSize;
    }
}

export class Record {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class Program {
    public functions: Array<Function>;
    public records: Array<Record>;
    public strings: Set<string>;
    public strings_arr: Array<string>;
    public literalArrays: Array<LiteralBuffer>;
    public module_mode: boolean;
    public debug_mode: boolean;
    public log_enabled: boolean;
    public opt_level: number;
    public opt_log_level: string;

    constructor() {
        this.functions = [];
        this.records = [];
        this.strings = new Set();
        this.strings_arr = [];
        this.literalArrays = [];
        this.module_mode = false;
        this.debug_mode = false;
        this.log_enabled = false;
        this.opt_level = 1;
        this.opt_log_level = "error";
    }

    finalize(): void {
        this.strings_arr = Array.from(this.strings);
    }
}

export class CatchTable {
    public tb_lab: string;  // try begine label
    public te_lab: string;  // try end label
    public cb_lab: string;  // catch begin label

    constructor(
        tryBeginLabel: string,
        tryEndLabel: string,
        catchBeginLabel: string
    ) {
        this.tb_lab = tryBeginLabel;
        this.te_lab = tryEndLabel;
        this.cb_lab = catchBeginLabel;
    }
}

export class TypeOfVreg {
    // @ts-ignore
    private vregNum: number;
    // @ts-ignore
    private typeIndex: number;

    constructor(vregNum: number, typeIndex: number) {
        this.vregNum = vregNum;
        this.typeIndex = typeIndex;
    }
}

export class ExportedSymbol2Type {
    // @ts-ignore
    private symbol: string;
    // @ts-ignore
    private type: number;

    constructor(symbol: string, type: number) {
        this.symbol = symbol;
        this.type = type;
    }
}

export class DeclaredSymbol2Type {
    // @ts-ignore
    private symbol: string;
    // @ts-ignore
    private type: number;

    constructor(symbol: string, type: number) {
        this.symbol = symbol;
        this.type = type;
    }
}

export class RegularImportEntry {
    public localName: string;
    public importName: string;
    public moduleRequest: number;

    constructor(localName: string, importName: string, moduleRequest: number) {
        this.localName = localName;
        this.importName = importName;
        this.moduleRequest = moduleRequest;
    }
}

export class NamespaceImportEntry {
    public localName: string;
    public moduleRequest: number;

    constructor(localName: string, moduleRequest: number) {
        this.localName = localName;
        this.moduleRequest = moduleRequest;
    }
}

export class LocalExportEntry {
    public localName: string;
    public exportName: string;

    constructor(localName: string, exportName: string) {
        this.localName = localName;
        this.exportName = exportName;
    }
}

export class IndirectExportEntry {
    public exportName: string;
    public importName: string;
    public moduleRequest: number;

    constructor(exportName: string, importName: string, moduleRequest: number) {
        this.exportName = exportName;
        this.importName = importName;
        this.moduleRequest = moduleRequest;
    }
}

export class ModuleRecord {
    public moduleName: string = "";
    public moduleRequests: Array<string> = [];
    public regularImportEntries: Array<RegularImportEntry> = [];
    public namespaceImportEntries: Array<NamespaceImportEntry> = [];
    public localExportEntries: Array<LocalExportEntry> = [];
    public indirectExportEntries: Array<IndirectExportEntry> = [];
    public starExportEntries: Array<number> = [];
}

export interface Emmiter {
    generate_program: (filename: string, program: Program) => string;
}
