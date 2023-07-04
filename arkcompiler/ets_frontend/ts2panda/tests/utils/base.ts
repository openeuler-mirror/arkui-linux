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
import { CompilerDriver } from "../../src/compilerDriver";
import {
    Imm,
    IRNode,
    Label,
    OperandType,
    VReg
} from "../../src/irnodes";
import * as jshelpers from "../../src/jshelpers";
import { PandaGen } from "../../src/pandagen";
import { Pass } from "../../src/pass";
import {
    Scope
} from "../../src/scope";
import { setGlobalStrict } from "../../src/strictMode";
import { creatAstFromSnippet } from "./asthelper";
import { LiteralBuffer } from "../../src/base/literal";
import { CmdOptions } from "../../src/cmdOptions";
import {
    transformCommonjsModule,
    makeNameForGeneratedNode,
    resetUniqueNameIndex
} from "../../src/base/util";

const compileOptions = {
    outDir: "../tmp/build",
    allowJs: true,
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    strictNullChecks: true
};

function isVReg(node: OperandType): node is VReg {
    return (node instanceof VReg);
}

function isImm(node: OperandType): node is Imm {
    return (node instanceof Imm);
}

function isId(node: OperandType): node is string {
    return (typeof node === "string");
}

function isLabel(node: OperandType): node is Label {
    return (node instanceof Label);
}

function isSameOperandType(left: OperandType, right: OperandType): boolean {
    return (left.constructor === right.constructor);
}

function object2String(obj: any): string {
    let retval = "";
    retval += obj.constructor.name + '\n';
    retval += JSON.stringify(obj) + '\n';
    return retval;
}

function basicOperandsEqual(left: OperandType, right: OperandType): boolean {
    if (!isSameOperandType(left, right)) {
        return false;
    }

    if (isVReg(left) && isVReg(right)) {
        return true;
    }

    if (isImm(left) && isImm(right)) {
        return left.value === right.value;
    }

    if (isLabel(left) && isLabel(right)) {
        return true;
    }

    if (isId(left) && isId(right)) {
        // string compare
        return left == right;
    }

    let str = "operandsEqual: operands are not one of this types: VReg | Imm | Label | BuiltIns | string\n";
    str += object2String(left);
    str += object2String(right);

    throw new Error(str);
}

export function basicChecker(left: IRNode, right: IRNode): boolean {
    if (left.kind !== right.kind) {
        console.log("left.kind:" + left.kind + " right.kind:" + right.kind);
        return false;
    }

    const operandCount = left.operands.length;
    for (let i = 0; i < operandCount; ++i) {
        const lop = left.operands[i];
        const rop = right.operands[i];
        if (!basicOperandsEqual(lop, rop)) {
            console.log("left.operands:");
            console.log(left.operands[i]);
            console.log("right.operands:");
            console.log(right.operands[i]);
            return false;
        }
    }

    return true;
}

export function checkInstructions(actual: IRNode[], expected: IRNode[], checkFn?: Function): boolean {
    if (!checkFn) {
        checkFn = basicChecker;
    }

    if (actual.length !== expected.length) {
        console.log("actual.length:" + actual.length + " expected.length:" + expected.length)
        return false;
    }

    for (let i = 0; i < actual.length; ++i) {
        if (!checkFn(actual[i], expected[i])) {
            return false;
        }
    }

    return true;
}

export function compileAllSnippet(snippet: string, passes?: Pass[], literalBufferArray?: Array<LiteralBuffer>,
                                  isWatchEvaluateExpressionMode?: boolean): PandaGen[] {
    let sourceFile = creatAstFromSnippet(snippet);
    jshelpers.bindSourceFile(sourceFile, {});
    CmdOptions.parseUserCmd([""]);
    if (isWatchEvaluateExpressionMode) {
        CmdOptions.setWatchEvaluateExpressionArgs(['','']);
    }
    CmdOptions.setMergeAbc(true);
    CmdOptions.isWatchEvaluateExpressionMode() ? setGlobalStrict(true)
                            : setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(sourceFile, compileOptions));
    let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
    CompilerDriver.srcNode = sourceFile;

    if (!passes) {
        passes = [];
    }
    compilerDriver.setCustomPasses(passes);
    compilerDriver.compileUnitTest(sourceFile, literalBufferArray);
    return compilerDriver.getCompilationUnits();
}

export function compileMainSnippet(snippet: string, pandaGen?: PandaGen, scope?: Scope, passes?: Pass[],
                                   compileFunc?: boolean, isWatchEvaluateExpressionMode?: boolean): IRNode[] {
    let compileUnits = compileAllSnippet(snippet, passes, undefined, isWatchEvaluateExpressionMode);

    if (compileUnits.length != 1 && !compileFunc) {
        throw new Error("Error: please use compileMainSnippet1 for multi function compile");
    }

    // only return main function
    if (compileFunc) {
        compileUnits.filter((pg) => {
            return (pg.internalName == "UnitTest.func_main_0");
        })
    }

    return compileUnits[0].getInsns();
}

export function compileAfterSnippet(snippet: string, name:string, isCommonJs: boolean = false) {
    let compileUnits = null;
    CmdOptions.parseUserCmd([""]);
    CmdOptions.setMergeAbc(true);
    ts.transpileModule(
        snippet,
        {
        compilerOptions : {
            "target": ts.ScriptTarget.ES2015,
            "experimentalDecorators": true
        },
        fileName : name,
        transformers : {
            after : [
                (ctx: ts.TransformationContext) => {
                    return (sourceFile: ts.SourceFile) => {
                        resetUniqueNameIndex();
                        makeNameForGeneratedNode(sourceFile);
                        if (isCommonJs) {
                            sourceFile = transformCommonjsModule(sourceFile);
                        }
                        jshelpers.bindSourceFile(sourceFile, {});
                        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(sourceFile, compileOptions));
                        let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
                        CompilerDriver.srcNode = sourceFile;
                        compilerDriver.setCustomPasses([]);
                        compilerDriver.compileUnitTest(sourceFile, []);
                        compileUnits = compilerDriver.getCompilationUnits();
                        return sourceFile;
                    }
                }
            ]
        }
        }
    );

    return compileUnits;
}

export function getCompileOptions(): ts.CompilerOptions {
    return compileOptions;
}

export class SnippetCompiler {
    pandaGens: PandaGen[] = [];
    compile(snippet: string, passes?: Pass[], literalBufferArray?: Array<LiteralBuffer>) {
        this.pandaGens = compileAllSnippet(snippet, passes, literalBufferArray);
        return this.pandaGens;
    }

    compileAfter(snippet: string, name: string, passes?: Pass[], literalBufferArray?: Array<LiteralBuffer>) {
        this.pandaGens = compileAfterSnippet(snippet, name);
        return this.pandaGens;
    }

    compileCommonjs(snippet: string, name: string) {
        this.pandaGens = compileAfterSnippet(snippet, name, true);
        return this.pandaGens;
    }

    getGlobalInsns(): IRNode[] {
        let root = this.getPandaGenByName("UnitTest.func_main_0");
        if (root) {
            return root.getInsns();
        } else {
            return [];
        }
    }

    getGlobalScope(): Scope | undefined {
        let globalPandaGen = this.getPandaGenByName("UnitTest.func_main_0");

        return globalPandaGen ? globalPandaGen.getScope()!.getNearestVariableScope() : undefined;
    }

    getPandaGenByName(name: string): PandaGen | undefined {
        let pgs = this.pandaGens.filter(pg => {
            return (pg.internalName == name);
        })
        return pgs[0];
    }
}