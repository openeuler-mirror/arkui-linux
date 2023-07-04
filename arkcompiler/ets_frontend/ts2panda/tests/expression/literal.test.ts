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

import {
    expect
} from 'chai';
import 'mocha';
import { CmdOptions } from '../../src/cmdOptions';
import { DiagnosticCode, DiagnosticError } from '../../src/diagnostic';
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';
import {
    Add2,
    Createarraywithbuffer,
    Createemptyarray,
    Createemptyobject,
    Createobjectwithbuffer,
    Inc,
    Returnundefined,
    Starrayspread,
    Sttoglobalrecord,
    Stownbyindex,
    Stownbyname,
    Stownbyvalue,
    Tryldglobalbyname,
    Imm,
    Lda,
    Ldai,
    LdaStr,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";

describe("LiteralTest", function () {
    it("5", function () {
        let insns = compileMainSnippet("5");
        let expected = [
            new Ldai(new Imm(5)),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("\"stringLiteral\"", function () {
        let insns = compileMainSnippet("\"stringLiteral\"");
        let expected = [
            new LdaStr("stringLiteral"),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("true", function () {
        let insns = compileMainSnippet("true");
        let expected = [
            new Lda(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("false", function () {
        let insns = compileMainSnippet("false");
        let expected = [
            new Lda(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("null", function () {
        let insns = compileMainSnippet("null");
        let expected = [
            new Lda(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let arr = [1]", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let arr = [1]");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let arrayInstance = new VReg();

        let expected = [
            new Createarraywithbuffer(new Imm(0), "snippet_1"),
            new Sta(arrayInstance),
            new Lda(arrayInstance),
            new Sttoglobalrecord(new Imm(1), 'arr'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let arr = []", function () {
        let insns = compileMainSnippet("let arr = []");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let arrayInstance = new VReg();

        let expected = [
            new Createemptyarray(new Imm(0)),
            new Sta(arrayInstance),
            new Sttoglobalrecord(new Imm(1), 'arr'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let arr = [1, 2]", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let arr = [1, 2]");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let arrayInstance = new VReg();

        let expected = [
            new Createarraywithbuffer(new Imm(0), "snippet_1"),
            new Sta(arrayInstance),
            new Lda(arrayInstance),
            new Sttoglobalrecord(new Imm(1), 'arr'),
            new Returnundefined()
        ];
        insns = insns.slice(0, insns.length);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let arr = [, 1]", function () {
        let insns = compileMainSnippet("let arr = [, 1]");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let arrayInstance = new VReg();

        let expected = [
            new Createemptyarray(new Imm(0)),
            new Sta(arrayInstance),
            new Ldai(new Imm(1)),
            new Stownbyindex(new Imm(1), arrayInstance, new Imm(1)),
            new Lda(arrayInstance),
            new Sttoglobalrecord(new Imm(3), 'arr'),
            new Returnundefined()
        ];
        insns = insns.slice(0, insns.length);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let arr = [1, , 3]", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let arr = [1,, 3]");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let arrayInstance = new VReg();

        let expected = [
            new Createarraywithbuffer(new Imm(0), "snippet_1"),
            new Sta(arrayInstance),
            new Ldai(new Imm(3)),
            new Stownbyindex(new Imm(1), arrayInstance, new Imm(2)),
            new Lda(arrayInstance),
            new Sttoglobalrecord(new Imm(3), 'arr'),
            new Returnundefined()
        ];

        insns = insns.slice(0, insns.length);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let arr = [1, ...arr1, 3]", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet(`let arr1 = [1, 2];
                                let arr = [1, ...arr1, 3]`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let elemIdxReg = new VReg();
        let arrayInstance = new VReg();

        let expected = [
            new Createarraywithbuffer(new Imm(0), "snippet_1"),
            new Sta(arrayInstance),
            new Lda(arrayInstance),
            new Sttoglobalrecord(new Imm(1), 'arr1'),

            new Createarraywithbuffer(new Imm(2), "snippet_2"),
            new Sta(arrayInstance),
            new Ldai(new Imm(1)),
            new Sta(elemIdxReg),
            new Tryldglobalbyname(new Imm(3), 'arr1'),
            new Starrayspread(arrayInstance, elemIdxReg),
            new Sta(elemIdxReg),
            new Ldai(new Imm(3)),
            new Stownbyvalue(new Imm(4), arrayInstance, elemIdxReg),
            new Lda(elemIdxReg),
            new Inc(new Imm(6)),
            new Sta(elemIdxReg),
            new Lda(arrayInstance),
            new Sttoglobalrecord(new Imm(7), 'arr'),
        ];
        insns = insns.slice(0, insns.length - 1);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let obj = {}", function () {
        let insns = compileMainSnippet("let obj = {}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let objInstance = new VReg();

        let expected = [
            new Createemptyobject(),
            new Sta(objInstance),

            new Sttoglobalrecord(new Imm(0), 'obj'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let obj = {a: 1}", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let obj = {a: 1}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let objInstance = new VReg();
        let expected = [
            new Createobjectwithbuffer(new Imm(0), "snippet_1"),
            new Sta(objInstance),
            new Lda(objInstance),
            new Sttoglobalrecord(new Imm(1), 'obj'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let obj = {0: 1 + 2}", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let obj = {0: 1 + 2}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let objInstance = new VReg();
        let lhs = new VReg();

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "snippet_1"),
            new Sta(objInstance),
            new Ldai(new Imm(1)),
            new Sta(lhs),
            new Ldai(new Imm(2)),
            new Add2(new Imm(1), lhs),
            new Stownbyindex(new Imm(2), objInstance, new Imm(0)),
            new Lda(objInstance),
            new Sttoglobalrecord(new Imm(4), 'obj'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let obj = {\"str\": 1}", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let obj = {\"str\": 1}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let objInstance = new VReg();

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "snippet_1"),
            new Sta(objInstance),
            new Lda(objInstance),
            new Sttoglobalrecord(new Imm(1), 'obj'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let a; let obj = {a}", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet("let a; let obj = {a}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        (<PandaGen>(IRNode.pg)).updateIcSize(1);
        let objInstance = new VReg();

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "snippet_1"),
            new Sta(objInstance),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Stownbyname(new Imm(2), "a", objInstance),
            new Lda(objInstance),
            new Sttoglobalrecord(new Imm(4), 'obj')
        ];
        insns = insns.slice(2, insns.length - 1);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("duplicate __proto__", function () {
        let errorThrown = false;
        try {
            compileMainSnippet("({__proto__: null,other: null,'__proto__': null});");
        } catch (err) {
            expect(err instanceof DiagnosticError).to.be.true;
            expect((<DiagnosticError>err).code).to.equal(DiagnosticCode.Duplicate_identifier_0);
            errorThrown = true;
        }
        expect(errorThrown).to.be.true;
    });
});

