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

import 'mocha';
import * as ts from "typescript";
import { CacheExpander } from "../../src/pass/cacheExpander";
import {
    SnippetCompiler
} from "../utils/base";
import { Pass } from "../../src/pass";
import { RegAlloc } from "../../src/regAllocator";
import { TypeChecker } from "../../src/typeChecker";
import { CmdOptions } from "../../src/cmdOptions";
import {
    LiteralBuffer,
    Literal
} from "../../src/base/literal";
import { VReg } from "../../src/irnodes";

let options = {
    outDir: '../tmp/build',
    allowJs: true,
    noEmitOnError: true,
    noImplicitAny: true,
    target: 2,
    module: 5,
    strictNullChecks: true,
    skipLibCheck: true,
    alwaysStrict: true
}

export function compileTsWithType(fileName: string) {

    CmdOptions.parseUserCmd([""]);
    let filePath = [fileName];
    let program = ts.createProgram(filePath, options);
    let sourceFile = program.getSourceFile(fileName);
    let typeChecker = TypeChecker.getInstance();
    typeChecker.setTypeChecker(program.getTypeChecker());
    let passes: Pass[] = [
        new CacheExpander(),
        new RegAlloc()
    ];
    let snippetCompiler = new SnippetCompiler();
    let literalBufferArray: Array<LiteralBuffer> = new Array<LiteralBuffer>();
    snippetCompiler.compile(sourceFile!.getFullText(), passes, literalBufferArray);
    return {
        literalBufferArray: literalBufferArray,
        snippetCompiler: snippetCompiler
    }
}

export function createVRegTypePair(input: any) {
    let id2TypeIndex: Map<string, number> = new Map<string, number>();
    for (let rol of input) {
        id2TypeIndex.set(rol[0], rol[1]);
    }
    return id2TypeIndex;
}

export function compareVReg2Type(expectedMap: Map<string, number>, generated: VReg[]): boolean {
    for (let vreg of generated) {
        let name = vreg.getVariableName();
        if (name == "4funcObj" || name == "4newTarget" || name == "this") {
            continue;
        }
        let vregMarker = "#" + vreg.num + "#" + vreg.getVariableName()
        if (!expectedMap.has(vregMarker)) {
            console.log("verg not found: ", vregMarker)
            return false;
        }
        if (expectedMap.get(vregMarker) != vreg.getTypeIndex()) {
            console.log("Unmatched expected type with vreg type:");
            console.log("vreg num:", vregMarker);
            console.log("vreg type:", vreg.getTypeIndex());
            console.log("expected type:", expectedMap.get(vregMarker));
            return false;
        }
    }
    return true;
}

export function createLiteralBufferArray(input: any) {
    let literalBufferArray: Array<LiteralBuffer> = new Array<LiteralBuffer>();
    for (let i = 0; i < input.length; i++) {
        let buff = input[i];
        let literalBuffer: LiteralBuffer = new LiteralBuffer();
        for (let rol of buff) {
            let literal = new Literal(rol[0], rol[1]);
            literalBuffer.addLiterals(literal);
        }
        literalBuffer.setKey(`_${i}`);
        literalBufferArray.push(literalBuffer);
    }
    return literalBufferArray;
}

function printLiteralLog(expected: Literal, generated: Literal) {
    console.log("expected literals:");
    console.log(expected);
    console.log("unmatched literals:");
    console.log(generated);
}

export function compareLiteralBuffer(expected: Array<LiteralBuffer>, generated: Array<LiteralBuffer>): boolean {
    let size = expected.length;
    for (let j = 0; j < size; j++) {
        let expectedLiterals = expected[j].getLiterals();
        let generatedLiterals = generated[j].getLiterals();
        if (expectedLiterals.length != generatedLiterals.length) {
            console.log("length miss-match in literals ", j);
            return false;
        }
        for (let i = 0; i < generatedLiterals.length; i++) {
            if (expectedLiterals[i].getTag() != generatedLiterals[i].getTag()) {
                printLiteralLog(expectedLiterals[i], generatedLiterals[i]);
                return false;
            }
            if (expectedLiterals[i].getValue() != generatedLiterals[i].getValue()) {
                printLiteralLog(expectedLiterals[i], generatedLiterals[i]);
                return false;
            }
        }
    }
    return true;
}