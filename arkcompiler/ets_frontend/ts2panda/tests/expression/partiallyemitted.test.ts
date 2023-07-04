/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
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

import {
    expect
} from 'chai';
import 'mocha';
import {
    Returnundefined,
    Sttoglobalrecord,
    Tryldglobalbyname,
    Lda,
    VReg,
    Imm,
    IRNode,
    Sta,
    Mov,
    Stobjbyname,
    Dec,
    LdaStr,
    Callarg1,
    Stconsttoglobalrecord,
    Defineclasswithbuffer,
    Ldobjbyname,
    Definemethod,
    Stownbyvaluewithnameset,
    Newobjrange,
    Ldobjbyvalue,
    Callthis0
} from "../../src/irnodes";
import { checkInstructions, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("PartiallyEmittedExpressionTest", function () {
    it("createdPartiallyEmittedExprTest", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(`let a; let b; (a.name as string) = b`, 'test.ts');
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a; let b; (a.name as string) = b"), 0, undefined);
        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(0), 'b'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Tryldglobalbyname(new Imm(1), 'b'),
            new Stobjbyname(new Imm(2), "name", new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("nestingParenthesizedPartiallyEmittedExprTest", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(
            `
                function reindexEdgeList(e: any, u: number):void {
                    --(((((e) as number)) as number) as number);
                }
            `, 'test.ts');
        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        let insns = snippetCompiler.getPandaGenByName("UnitTest.reindexEdgeList").getInsns();
        let expected = [
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Dec(new Imm(1)),
            new Sta(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("callPartiallyEmittedExprTest", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(
            `
                const sayHello = Symbol('sayHello')
                class A {
                    [sayHello]() {
                    }
                }
                let a = new A();
                a[sayHello]!();
            `, 'test.ts');
        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Tryldglobalbyname(new Imm(1), 'Symbol'),
            new Sta(new VReg()),
            new LdaStr('sayHello'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callarg1(new Imm(1), new VReg()),
            new Stconsttoglobalrecord(new Imm(1), 'sayHello'),
            new Mov(new VReg(), new VReg()),
            new Defineclasswithbuffer(new Imm(0), 'UnitTest.#1#A', 'test_1', new Imm(0), new VReg()),
            new Sta(new VReg()),
            new Tryldglobalbyname(new Imm(1), 'sayHello'),
            new Sta(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), 'prototype'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Definemethod(new Imm(0), 'UnitTest.#2#', new Imm(0)),
            new Sta(new VReg()),
            new Stownbyvaluewithnameset(new Imm(1), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(1), 'A'),
            new Tryldglobalbyname(new Imm(1), 'A'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(1), new Imm(1), [new VReg()]),
            new Sttoglobalrecord(new Imm(1), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(new VReg()),
            new Tryldglobalbyname(new Imm(1), 'sayHello'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyvalue(new Imm(1), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callthis0(new Imm(1), new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;

    });
});
