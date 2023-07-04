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
import {
    Delobjprop,
    Returnundefined,
    Sttoglobalrecord,
    Tryldglobalbyname,
    Imm,
    Lda,
    Ldai,
    LdaStr,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("deleteExpressionTest", function () {
    it("deleteElementFromArray", function () {
        let insns = compileMainSnippet("let arr = [1, 2]; delete arr[1];");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("let arr = [1, 2]; delete arr[1];"), 0, undefined);
        IRNode.pg.updateIcSize(1);
        let objReg = new VReg();
 
        let expected = [
            new Sttoglobalrecord(new Imm(1), 'arr'),
            new Tryldglobalbyname(new Imm(2), 'arr'),
            new Sta(objReg),
            new Ldai(new Imm(1)),
            new Delobjprop(new VReg()),
            new Returnundefined()
        ];

        insns = insns.slice(insns.length - 6, insns.length);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("deletePropFromObj", function () {
        // this Snippet code isn't supported by TS
        let insns = compileMainSnippet(`let obj = {
                                  a: 1,
                                  b: 2};
                                  delete obj.b;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("let arr = [1, 2]; delete arr[1];"), 0, undefined);
        IRNode.pg.updateIcSize(1);
        let objReg = new VReg();

        let expected = [
            // delete obj.b;
            new Sttoglobalrecord(new Imm(1), 'obj'),
            new Tryldglobalbyname(new Imm(2), 'obj'),
            new Sta(objReg),
            new LdaStr("b"),
            new Delobjprop(new VReg()),
            new Returnundefined()
        ];

        insns = insns.slice(insns.length - 6, insns.length);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // delete function call won't use delObjProp
    it("deleteFunctionCall", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`var foo = function() {
                                  bIsFooCalled = true;
                              };
                              let a = delete foo();`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`var foo = function() {
            bIsFooCalled = true;
        };
        let a = delete foo();`), 0, undefined);
        IRNode.pg.updateIcSize(6);

        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            // function call insns
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(6), 'a'),
            new Returnundefined()
        ];

        insns = insns.slice(insns.length - 3, insns.length);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // delete keywords won't use delObjProp
    it("deleteKeywords", function () {
        let insns = compileMainSnippet(`let a = delete false;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let a = delete false;`), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("deleteUnresolvable", function () {
        let insns = compileMainSnippet(`delete a;`);

        let expected = [
            new LdaStr("a"),
            new Delobjprop(new VReg()),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("double delete", function () {
        let insns = compileMainSnippet(`delete delete a;`);

        let expected = [
            new LdaStr("a"),
            new Delobjprop(new VReg()),
            new Lda(new VReg()),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});