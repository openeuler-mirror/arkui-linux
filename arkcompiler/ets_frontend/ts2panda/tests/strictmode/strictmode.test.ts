/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

import { expect } from 'chai';
import { readFileSync } from "fs";
import * as ts from "typescript";
import { isStrictMode, setGlobalStrict } from '../../src/strictMode';
import { isFunctionLikeDeclaration } from '../../src/syntaxCheckHelper';
import { getCompileOptions } from '../utils/base';
import * as jshelpers from '../../src/jshelpers';

function createSourceFile(filename: string): ts.SourceFile {
    let sourceFile = ts.createSourceFile(
        filename,
        readFileSync(filename).toString(),
        ts.ScriptTarget.ES5,
        /*setParentNodes */ true
    );

    return sourceFile;
}

function recordNodes(node: ts.Node, flag: boolean): boolean {
    node.forEachChild(childNode => {
        expect(isStrictMode(childNode) == flag).to.be.true;
        recordNodes(childNode, flag);
    });

    return false;
}

describe("strict_mode", function () {
    it('global strict mode', function () {
        let node = createSourceFile("tests/strictmode/global.js");
        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, getCompileOptions()));
        expect(isStrictMode(node)).to.be.true;
        recordNodes(node, true);
    });

    it('function strict mode', function () {
        let node = createSourceFile("tests/strictmode/function.js");
        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, getCompileOptions()));
        expect(isStrictMode(node)).to.be.false;
        node.forEachChild(childNode => {
            if (isFunctionLikeDeclaration(childNode)) {
                let funcId = <ts.Identifier>(<ts.FunctionDeclaration>childNode).name;
                let funcName = jshelpers.getTextOfIdentifierOrLiteral(funcId);
                if (funcName == "add") {
                    recordNodes(childNode, true);
                } else {
                    recordNodes(childNode, false);
                }
            } else {
                recordNodes(childNode, false);
            }
        });
    });

    it('function nest1 strict mode', function () {
        let node = createSourceFile("tests/strictmode/function_nest1.js");
        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, getCompileOptions()));
        expect(isStrictMode(node)).to.be.false;
        node.forEachChild(childNode => {
            if (isFunctionLikeDeclaration(childNode)) {
                recordNodes(childNode, true);
            } else {
                recordNodes(childNode, false);
            }
        });
    });

    it('function nest2 strict mode', function () {
        let node = createSourceFile("tests/strictmode/function_nest2.js");
        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, getCompileOptions()));
        expect(isStrictMode(node)).to.be.false;
        node.forEachChild(childNode => {
            if (isFunctionLikeDeclaration(childNode)) {
                childNode.body!.forEachChild(funcNode => {
                    if (isFunctionLikeDeclaration(funcNode)) {
                        recordNodes(funcNode, true);
                    } else {
                        recordNodes(funcNode, false);
                    }
                });
            } else {
                recordNodes(childNode, false);
            }
        });
    });
});

