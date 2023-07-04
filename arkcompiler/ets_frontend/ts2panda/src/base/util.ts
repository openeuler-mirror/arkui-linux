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
import { extractCtorOfClass } from "../statement/classStatement";
import * as ts from "typescript";
import {
    Callrange,
    Callthisrange,
    Createobjectwithexcludedkeys,
    Newobjrange,
    IRNode,
    WideCallthisrange,
    WideCallrange,
    WideCreateobjectwithexcludedkeys,
    Supercallthisrange,
    WideSupercallthisrange,
    Supercallarrowrange,
    WideSupercallarrowrange,
    WideNewobjrange
} from "../irnodes";
import * as jshelpers from "../jshelpers";
import { LOGD } from "../log";
import { isFunctionLikeDeclaration } from "../syntaxCheckHelper";
import { CmdOptions } from "../cmdOptions";
import { CompilerDriver } from "../compilerDriver";

export function containSpreadElement(args?: ts.NodeArray<ts.Expression>): boolean {
    if (!args) {
        return false;
    }

    for (let i = 0; i < args.length; i++) {
        if (args[i].kind === ts.SyntaxKind.SpreadElement) {
            return true;
        }
    }

    return false;
}

export function hasExportKeywordModifier(node: ts.Node): boolean {
    let hasExport: boolean = false;
    if (node.modifiers) {
        node.modifiers.forEach((mod) => {
            if (mod.kind == ts.SyntaxKind.ExportKeyword) {
                hasExport = true;
            }
        });
    }

    return hasExport;
}

export function hasDefaultKeywordModifier(node: ts.Node): boolean {
    let hasDefault: boolean = false;
    if (node.modifiers) {
        node.modifiers.forEach((mod) => {
            if (mod.kind == ts.SyntaxKind.DefaultKeyword) {
                hasDefault = true;
            }
        });
    }

    return hasDefault;
}

export function execute(cmd: string, args: Array<string>) {
    var spawn = require('child_process').spawn;

    let child = spawn(cmd, [...args], {
        stdio: ['pipe', 'inherit', 'inherit']
    });

    child.on('exit', (code: any) => {
        if (code === 1) {
            LOGD("fail to execute cmd: ", cmd);
            return 0;
        }
        LOGD("execute cmd successfully: ", cmd);
        return 1;
    });

    return 1;
}

export function addUnicodeEscape(text: string) {
    let firstIdx = 0;
    let secondIdx = 0;
    let len = text.length;
    let newText = "";
    while (secondIdx != len) {
        if (text[secondIdx] == '\\' && secondIdx + 1 != len && text[secondIdx + 1] == 'u') {
            if (secondIdx != 0 && text[secondIdx - 1] == '\\') {
                newText += text.substr(firstIdx, secondIdx - firstIdx) + "\\\\" + "\\u";
            } else {
                newText += text.substr(firstIdx, secondIdx - firstIdx) + "\\" + "\\u";
            }
            secondIdx += 2;
            firstIdx = secondIdx;
        } else {
            secondIdx++;
        }
    }

    if (secondIdx == len && firstIdx != secondIdx) {
        newText += text.substr(firstIdx);
    }

    return newText;
}

export function isBindingPattern(node: ts.Node) {
    return ts.isArrayBindingPattern(node) || ts.isObjectBindingPattern(node);
}

export function isObjectBindingOrAssignmentPattern(node: ts.Node) {
    return ts.isObjectLiteralExpression(node) || ts.isObjectBindingPattern(node);
}

export function isArrayBindingOrAssignmentPattern(node: ts.Node) {
    return ts.isArrayLiteralExpression(node) || ts.isArrayBindingPattern(node);
}

export function isBindingOrAssignmentPattern(node: ts.Node) {
    return isArrayBindingOrAssignmentPattern(node) || isObjectBindingOrAssignmentPattern(node);
}

export function isMemberExpression(node: ts.Node) {
    if (ts.isPropertyAccessExpression(node)
        || ts.isElementAccessExpression(node)) {
        return true;
    }

    return false;
}

export function isUndefinedIdentifier(node: ts.Node) {
    if (!ts.isIdentifier(node)) {
        return false;
    }

    if (jshelpers.getTextOfIdentifierOrLiteral(node) != "undefined") {
        return false;
    }

    return true;
}

export function isAnonymousFunctionDefinition(node: ts.Node) {
    if (!isFunctionLikeDeclaration(node)) {
        return false;
    }

    if (node.name) {
        return false;
    } else {
        return true;
    }
}

export function escapeUnicode(data: string) {
    let char = '\n';
    let i = 0;
    let j = 0;
    let new_data = ""
    while ((j = data.indexOf(char, i)) !== -1) {
        let tmp = data.substring(i, j);
        if (tmp.indexOf("\\u") != -1) {
            tmp = addUnicodeEscape(tmp);
        }
        new_data = new_data.concat(tmp, "\n");
        i = j + 1;
    }

    new_data = new_data.concat("}\n");
    return new_data
}

export function initiateTs2abc(args: Array<string>) {
    let js2abc = path.join(path.resolve(__dirname, '../bin'), "js2abc");
    args.unshift("--compile-by-pipe");
    // @ts-ignore
    var spawn = require('child_process').spawn;
    let child = spawn(js2abc, [...args], {
        stdio: ['pipe', 'inherit', 'inherit', 'pipe']
    });

    return child;
}

export function terminateWritePipe(ts2abc: any) {
    if (!ts2abc) {
        LOGD("ts2abc is not a valid object");
    }

    ts2abc.stdio[3].end();
}

export function listenChildExit(child: any) {
    if (!child) {
        LOGD("child is not a valid object");
    }

    child.on('exit', (code: any) => {
        if (code === 1) {
            LOGD("fail to generate panda binary file");
        }
        LOGD("success to generate panda binary file");
    });
}

export function listenErrorEvent(child: any) {
    if (!child) {
        LOGD("child is not a valid object");
    }

    child.on('error', (err: any) => {
        LOGD(err.toString());
    });
}

export function isRangeInst(ins: IRNode) {
    if (ins instanceof Callthisrange ||
        ins instanceof WideCallthisrange ||
        ins instanceof Callrange ||
        ins instanceof WideCallrange ||
        ins instanceof Newobjrange ||
        ins instanceof WideNewobjrange ||
        ins instanceof Createobjectwithexcludedkeys ||
        ins instanceof WideCreateobjectwithexcludedkeys ||
        ins instanceof Supercallthisrange ||
        ins instanceof WideSupercallthisrange ||
        ins instanceof Supercallarrowrange ||
        ins instanceof WideSupercallarrowrange) {
        return true;
    }
    return false;
}

export function getRangeStartVregPos(ins: IRNode): number {
    if (!isRangeInst(ins)) {
        return -1;
    }

    if (ins instanceof Callthisrange ||
        ins instanceof Callrange ||
        ins instanceof Newobjrange ||
        ins instanceof Supercallthisrange ||
        ins instanceof Supercallarrowrange ||
        ins instanceof Createobjectwithexcludedkeys ||
        ins instanceof WideCreateobjectwithexcludedkeys) {
        return 2;
    }

    if (ins instanceof WideCallthisrange ||
        ins instanceof WideCallrange ||
        ins instanceof WideNewobjrange ||
        ins instanceof WideSupercallthisrange ||
        ins instanceof WideSupercallarrowrange) {
        return 1;
    }
}

export function getRangeExplicitVregNums(ins: IRNode): number {
    if (!isRangeInst(ins)) {
        return -1;
    }
    return ins instanceof Createobjectwithexcludedkeys ? 2 : 1;
}

export function isRestParameter(parameter: ts.ParameterDeclaration) {
    return parameter.dotDotDotToken ? true : false;
}

export function getParamLengthOfFunc(node: ts.FunctionLikeDeclaration) {
    let length = 0;
    let validLengthRange = true;
    let parameters = node.parameters;
    if (parameters) {
        parameters.forEach(parameter => {
            if (parameter.initializer || isRestParameter(parameter)) {
                validLengthRange = false;
            }

            if (validLengthRange) {
                length++;
            }
        })
    }

    return length;
}

export function getParameterLength4Ctor(node: ts.ClassLikeDeclaration) {
    if (!extractCtorOfClass(node)) {
        return 0;
    }

    let members = node.members;
    let ctorNode: ts.ConstructorDeclaration;
    for (let index = 0; index < members.length; index++) {
        let member = members[index];
        if (ts.isConstructorDeclaration(member)) {
            ctorNode = member;
        }
    }

    return getParamLengthOfFunc(ctorNode!);
}

export function setPos(node: ts.Node) {
    ts.setTextRange(node, {pos:-1, end:-1});
    node.forEachChild(childNode => {
        setPos(childNode);
    });
    return node;
}

export function getRecordTypeFlag(recordType: boolean) {
    return recordType && CmdOptions.needRecordType() && CompilerDriver.isTsFile;
}

export function isBase64Str(input: string): boolean {
    if (input == '' || input.trim() == '') {
        return false;
    }
    return Buffer.from(Buffer.from(input, 'base64').toString()).toString('base64') == input;
}

export function transformCommonjsModule(sourceFile: ts.SourceFile) {
    /*
     * Transform the commonjs module's AST by wrap the sourceCode & use Reflect.apply to invoke this wrapper with [this]
     * pointing to [exports] object
     *
     * Reflect.apply(function (exports, require, module, __filename, __dirname) {
     *   [SourceCode]
     * }, exports, [exports, require, module, __filename, __dirname]);
     */
    let newStatements = [ts.factory.createExpressionStatement(ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("Reflect"), ts.factory.createIdentifier("apply")
        ),
        undefined,
        [
            ts.factory.createFunctionExpression(
                undefined, undefined, undefined, undefined,
                [
                    ts.factory.createParameterDeclaration(undefined, undefined, undefined, ts.factory.createIdentifier("exports"), undefined, undefined, undefined),
                    ts.factory.createParameterDeclaration(undefined, undefined, undefined, ts.factory.createIdentifier("require"), undefined, undefined, undefined),
                    ts.factory.createParameterDeclaration(undefined, undefined, undefined, ts.factory.createIdentifier("module"), undefined, undefined, undefined),
                    ts.factory.createParameterDeclaration(undefined, undefined, undefined, ts.factory.createIdentifier("__filename"), undefined, undefined, undefined),
                    ts.factory.createParameterDeclaration(undefined, undefined, undefined, ts.factory.createIdentifier("__dirname"), undefined, undefined, undefined)
                ],
                undefined,
                ts.factory.createBlock(sourceFile.statements)
            ),
            ts.factory.createIdentifier("exports"),
            ts.factory.createArrayLiteralExpression(
                [
                    ts.factory.createIdentifier("exports"),
                    ts.factory.createIdentifier("require"),
                    ts.factory.createIdentifier("module"),
                    ts.factory.createIdentifier("__filename"),
                    ts.factory.createIdentifier("__dirname")
                ]
            )
        ]
    ))];

    return ts.factory.updateSourceFile(sourceFile, newStatements);
}

export function hasAbstractModifier(node: ts.Node): boolean {
    if (!node.modifiers) {
        return false;
    }
    for (let modifier of node.modifiers) {
        switch (modifier.kind) {
            case ts.SyntaxKind.AbstractKeyword: {
                return true;
            }
            default:
                break;
        }
    }
    return false;
}

export const MAX_INT8 = 127;
export const MAX_INT16 = 32767;

export function getOutputBinName(node: ts.SourceFile) {
    let outputBinName = CmdOptions.getOutputBinName();
    let fileName = node.fileName.substring(0, node.fileName.lastIndexOf('.'));
    let inputFileName = CmdOptions.getInputFileName();
    if (/^win/.test(require('os').platform())) {
        var inputFileTmps = inputFileName.split(path.sep);
        inputFileName = path.posix.join(...inputFileTmps);
    }

    if (fileName != inputFileName) {
        outputBinName = fileName + ".abc";
    }
    return outputBinName;
}

export function getRecordName(node: ts.SourceFile): string {
    let recordName = CmdOptions.getRecordName();

    if (recordName == "" && CmdOptions.isMergeAbc()) {
        let outputBinName = getOutputBinName(node);
        recordName = path.basename(outputBinName, path.extname(outputBinName));
    }

    return recordName;
}

export function getLiteralKey(node: ts.SourceFile, idx:number): string {
    return `${getRecordName(node)}_${idx}`;
}

/**
 * Gets the node from which a name should be generated, from tsc logic
 */
function getNodeForGeneratedName(
    // @ts-ignore
    name: ts.GeneratedIdentifier) {
    const autoGenerateId = name.autoGenerateId;
    let node = name as ts.Node;
    // @ts-ignore
    let original = node.original;
    while (original) {
        node = original;

        // if "node" is a different generated name (having a different "autoGenerateId"), use it and stop traversing.
        if (ts.isIdentifier(node)
            // @ts-ignore
            && !!(node.autoGenerateFlags! & ts.GeneratedIdentifierFlags.Node)
            // @ts-ignore
            && node.autoGenerateId !== autoGenerateId) {
            break;
        }
        // @ts-ignore
        original = node.original;
    }

    // otherwise, return the original node for the source;
    return node;
}

let uniqueNameIndex = 0;
let nodeIdNameMap = new Map<number, string>();
let tempAndLoopVariablesNameMap = new Map<number, string>();

function generateUniqueName(): string {
    if (uniqueNameIndex < 26) {  // #a ~ #z
        return "#" + String.fromCharCode(97 /* a */ + uniqueNameIndex++);
    }
    return "#" + (uniqueNameIndex++ - 26);
}

function generateNameCached(node: ts.Node): string {
    // @ts-ignore
    const nodeId = ts.getNodeId(node);
    if (nodeIdNameMap.get(nodeId)) {
        return nodeIdNameMap.get(nodeId);
    }
    let generatedName = generateUniqueName();
    nodeIdNameMap.set(nodeId, generatedName);
    return generatedName;
}

function generateNameForTempAndLoopVariable(node: ts.Node): string {
    // Auto, Loop and Unique names are generated and cached based on their unique autoGenerateId.
    // @ts-ignore
    const autoGenerateId = node.autoGenerateId!;
    if (tempAndLoopVariablesNameMap.get(autoGenerateId)) {
        return tempAndLoopVariablesNameMap.get(autoGenerateId);
    }
    let generatedName = generateUniqueName();
    // @ts-ignore
    if ((node.autoGenerateFlags & ts.GeneratedIdentifierFlags.KindMask) == ts.GeneratedIdentifierFlags.Unique) {
        // Unique names are generated and cached based on their unique autoGenerateId and original idText.
        // @ts-ignore
        generatedName = (<ts.Identifier>node).escapedText + generatedName;
    }
    tempAndLoopVariablesNameMap.set(autoGenerateId, generatedName);
    return generatedName;
}

export function resetUniqueNameIndex() {
    uniqueNameIndex = 0;
}

export function makeNameForGeneratedNode(node: ts.Node) {
    node.forEachChild(childNode => {
        switch (childNode.kind) {
            case ts.SyntaxKind.Identifier: {
                // @ts-ignore
                if (ts.isGeneratedIdentifier(childNode)) {
                    // Node names generate unique names based on their original node and are cached based on that node's id.
                    // @ts-ignore
                    if ((childNode.autoGenerateFlags & ts.GeneratedIdentifierFlags.KindMask) ===
                        // @ts-ignore
                        ts.GeneratedIdentifierFlags.Node) {
                        let originalNode = getNodeForGeneratedName(childNode);
                        // @ts-ignore
                        (<ts.Identifier>childNode).escapedText = generateNameCached(originalNode);
                    } else {
                        // @ts-ignore
                        (<ts.Identifier>childNode).escapedText = generateNameForTempAndLoopVariable(childNode);
                    }
                }
                break;
            }
        }
        makeNameForGeneratedNode(childNode);
    });
}
