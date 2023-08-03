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

import * as ts from "typescript";
import { CmdOptions } from "./cmdOptions";
import {
    Callrange,
    DebugInsStartPlaceHolder,
    DebugInsEndPlaceHolder,
    IRNode,
    Label,
    VReg,
    WideCallrange
} from "./irnodes";
import * as jshelpers from "./jshelpers";
import { PandaGen } from "./pandagen";
import { Scope } from "./scope";
import {
    Variable
} from "./variable";

export class DebugPosInfo {
    private bl: number | undefined;  // bound left
    private br: number | undefined;  // bound right
    private l: number = -1;  // line number
    private c: number = -1;  // column number
    private nodeKind: NodeKind | undefined = NodeKind.FirstNodeOfFunction;

    constructor() { }

    public setDebugPosInfoNodeState(extendedNode: ts.Node | NodeKind): void {
        if (DebugInfo.isNode(extendedNode)) {
            this.nodeKind = NodeKind.Normal;
        } else {
            this.nodeKind = <NodeKind>extendedNode;
        }
    }

    public getDebugPosInfoNodeState(): NodeKind | undefined {
        return this.nodeKind;
    }

    public setBoundLeft(boundLeft: number): void {
        this.bl = boundLeft;
    }

    public getBoundLeft(): number | undefined {
        return this.bl;
    }

    public setBoundRight(boundRight: number): void {
        this.br = boundRight;
    }

    public getBoundRight(): number | undefined {
        return this.br;
    }

    public setSourecLineNum(lineNum: number): void {
        this.l = lineNum;
    }

    public getSourceLineNum(): number {
        return this.l;
    }

    public setSourecColumnNum(columnNum: number): void {
        this.c = columnNum;
    }

    public getSourceColumnNum(): number {
        return this.c;
    }

    public ClearNodeKind(): void {
        this.nodeKind = undefined;
    }
}

export class VariableDebugInfo {
    // @ts-ignore
    private n = "";  // name
    // @ts-ignore
    private v: Variable | undefined;  // variables
    // @ts-ignore
    private s = "";  // signature
    // @ts-ignore
    private st = "";  // signature type
    // @ts-ignore
    private r: number = -1;
    private start: number = -1;
    // @ts-ignore
    private len: number = -1;

    constructor(name: string, signature: string, signatureType: string,
        reg: number, start: number = 0, length: number = 0) {
        this.n = name;
        this.s = signature;
        this.st = signatureType;
        this.r = reg;
        this.start = start;
        this.len = length;
    }

    public setStart(start: number): void {
        this.start = start;
    }

    public getStart(): number {
        return this.start;
    }

    public setLength(length: number): void {
        this.len = length;
    }
}

export enum NodeKind {
    Normal,
    Invalid,
    FirstNodeOfFunction,
}

export class DebugInfo {
    private static scopeArray: Scope[] = [];
    private static lastNode: ts.Node;
    constructor() { }

    public static isNode(extendedNode: ts.Node | NodeKind) {
        if (extendedNode != NodeKind.Invalid &&
            extendedNode != NodeKind.FirstNodeOfFunction &&
            extendedNode != NodeKind.Normal) {
            return true;
        }

        return false;
    }

    public static updateLastNode(lastNode: ts.Node | NodeKind) {
        if (DebugInfo.isNode(lastNode)) {
            DebugInfo.lastNode = <ts.Node>lastNode;
        }
    }

    public static getLastNode() {
        return DebugInfo.lastNode;
    }

    public static searchForPos(node: ts.Node) {
        let file = jshelpers.getSourceFileOfNode(node);
        if (!file) {
            return undefined;
        }

        let pos : number = 0;
        if (node.pos === -1 || node.end === -1) {
            return {
                loc: {
                    line : -1,
                    character : -1
                }
            }
        }

        pos = node.getStart();
        let loc = file.getLineAndCharacterOfPosition(pos); 
        return {
            loc: loc
        }
    }

    public static setPosInfoForUninitializeIns(posInfo: DebugPosInfo, pandaGen: PandaGen) {
        let firstStmt = pandaGen.getFirstStmt();
        if (firstStmt) {
            let res = this.searchForPos(firstStmt);
            if (!res) {
                return;
            }
            posInfo.setSourecLineNum(res.loc.line);
            posInfo.setSourecColumnNum(res.loc.character);
        }
    }

    public static setInvalidPosInfoForUninitializeIns(posInfo: DebugPosInfo, pandaGen: PandaGen) {
        posInfo.setSourecLineNum(-1);
        posInfo.setSourecColumnNum(-1);
    }

    public static addScope(scope: Scope) {
        DebugInfo.scopeArray.push(scope);
    }

    public static getScopeArray() {
        return DebugInfo.scopeArray;
    }

    public static clearScopeArray() {
        DebugInfo.scopeArray = [];
    }

    public static setDebuginfoForIns(node: ts.Node | NodeKind, ...insns: IRNode[]): void {
        DebugInfo.updateLastNode(node);

        let lineNumber = -1;
        let columnNumber = -1;
        if (DebugInfo.isNode(node)) {
            let tsNode = <ts.Node>(node);
            let res = this.searchForPos(tsNode);
            if (!res) {
                return;
            }
            lineNumber = res.loc.line;
            columnNumber = res.loc.character;
        }

        insns.forEach(insn => {
            insn.debugPosInfo.setSourecLineNum(lineNumber);
            insn.debugPosInfo.setSourecColumnNum(columnNumber);
            insn.debugPosInfo.setDebugPosInfoNodeState(node);
        })
    }

    private static matchFormat(irnode: IRNode): number {
        let formatIndex = 0;
        let formats = irnode.getFormats();
        for (let i = 0; i < formats[0].length; i++) {
            if (irnode.operands[i] instanceof VReg) {
                for (let j = 0; j < formats.length; j++) {
                    // formats[j][i][1] is vreg’s bitwidth
                    if ((<VReg>irnode.operands[i]).num < (1 << formats[j][i][1])) {
                        formatIndex = j > formatIndex ? j : formatIndex;
                        continue;
                    }
                }
            }
        }
        return formatIndex;
    }

    private static getIRNodeWholeLength(irnode: IRNode): number {
        if (irnode instanceof Label ||
            irnode instanceof DebugInsStartPlaceHolder ||
            irnode instanceof DebugInsEndPlaceHolder) {
            return 0;
        }
        let length = 1;
        if (!irnode.getFormats()[0]) {
            return 0;
        }
        let formatIndex = this.matchFormat(irnode);
        let formats = irnode.getFormats()[formatIndex];
        // count operands length
        for (let i = 0; i < formats.length; i++) {
            if ((irnode instanceof WideCallrange) || (irnode instanceof Callrange)) {
                length += formats[0][1] / 8; // 8 indicates that one byte is composed of 8 bits
                length += formats[1][1] / 8;
                break;
            }

            length += (formats[i][1] / 8);
        }

        return length;
    }

    private static setPosDebugInfo(pandaGen: PandaGen) {
        let insns: IRNode[] = pandaGen.getInsns();
        let offset = 0;

        // count pos offset
        for (let i = 0; i < insns.length; i++) {
            if (insns[i].debugPosInfo.getDebugPosInfoNodeState() == NodeKind.FirstNodeOfFunction) {
                DebugInfo.setInvalidPosInfoForUninitializeIns(insns[i].debugPosInfo, pandaGen);
            }

            let insLength = DebugInfo.getIRNodeWholeLength(insns[i]);
            let insnsDebugPosInfo = insns[i].debugPosInfo;

            if (insnsDebugPosInfo && CmdOptions.isDebugMode()) {
                insnsDebugPosInfo.setBoundLeft(offset);
                insnsDebugPosInfo.setBoundRight(offset + insLength);
            }

            offset += insLength;

            if (i > 0 && insns[i - 1] instanceof Label) {
                insns[i - 1].debugPosInfo = insns[i].debugPosInfo;
            }
        }
    }

    private static setVariablesDebugInfo(pandaGen: PandaGen) {
        let insns = pandaGen.getInsns();

        for (let i = 0; i < insns.length; i++) {
            if (insns[i] instanceof DebugInsStartPlaceHolder) {
                (<DebugInsStartPlaceHolder> insns[i]).getScope().setScopeStartInsIdx(i);
                // delete ins placeholder
                insns.splice(i, 1);
                if (i > 0) {
                    i--;
                }
            }
            if (insns[i] instanceof DebugInsEndPlaceHolder) {
                (<DebugInsEndPlaceHolder> insns[i]).getScope().setScopeEndInsIdx(i > 0 ? i - 1 : 0);
                // delete ins placeholder
                insns.splice(i, 1);
                if (i > 0) {
                    i--;
                }
            }
        }

        let recordArray = DebugInfo.getScopeArray();
        recordArray.forEach(scope => {
            let name2variable = scope.getName2variable();
            name2variable.forEach((value, key) => {
                if (!value.hasAlreadyBinded()) {
                    return;
                }
                if (value.getName() == "0this" || value.getName() == "0newTarget") {
                    return;
                }
                let variableInfo = new VariableDebugInfo(key, "any", "any", (value.getVreg().num));
                variableInfo.setStart(scope.getScopeStartInsIdx());
                variableInfo.setLength(scope.getScopeEndInsIdx() - scope.getScopeStartInsIdx() + 1);
                pandaGen.addDebugVariableInfo(variableInfo);
            });
        });
    }

    public static setDebugInfo(pandaGen: PandaGen) {
        // set position debug info
        DebugInfo.setPosDebugInfo(pandaGen);
        if (CmdOptions.isDebugMode()) {
            // set variable debug info
            DebugInfo.setVariablesDebugInfo(pandaGen);

            // clear scope array
            DebugInfo.clearScopeArray();
            return;
        }
    }

    public static setSourceFileDebugInfo(pandaGen: PandaGen, node: ts.SourceFile | ts.FunctionLikeDeclaration) {
        let sourceFile = jshelpers.getSourceFileOfNode(node);
        if (CmdOptions.getSourceFile().length > 0) {
            pandaGen.setSourceFileDebugInfo(CmdOptions.getSourceFile());
        } else {
            pandaGen.setSourceFileDebugInfo(sourceFile.fileName);
        }

        if (CmdOptions.isDebugMode() && ts.isSourceFile(node)) {
            pandaGen.setSourceCode(node.text);
        }
    }

    public static copyDebugInfo(insn: IRNode, expansion: IRNode[]) {
        expansion.forEach(irNode => irNode.debugPosInfo = insn.debugPosInfo);
    }

    public static addDebugIns(scope: Scope, pandaGen: PandaGen, isStart: boolean) {
        if (!CmdOptions.isDebugMode()) {
            return;
        }

        let insns = pandaGen.getInsns();
        let placeHolder: IRNode;
        if (isStart) {
            placeHolder = new DebugInsStartPlaceHolder(scope);
            DebugInfo.addScope(scope);
        } else {
            placeHolder = new DebugInsEndPlaceHolder(scope);
        }
        insns.push(placeHolder);
    }
}
