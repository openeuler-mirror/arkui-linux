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
import { creatAstFromSnippet } from "./utils/asthelper";
import { checkInstructions, SnippetCompiler } from "./utils/base";
import { PandaGen } from '../src/pandagen';

import {
    Callarg1,
    Createemptyobject,
    Defineclasswithbuffer,
    Definefunc,
    Imm,
    IRNode,
    Isfalse,
    Jeqz,
    Jmp,
    Label,
    Lda,
    Ldglobalvar,
    Mov,
    Returnundefined,
    Sta,
    Stglobalvar,
    Sttoglobalrecord,
    ThrowUndefinedifholewithname,
    Tryldglobalbyname,
    VReg,
} from "../src/irnodes";

describe("preserveConstEnumsTest", function () {
    it("preserveConstEnumsInSingleFileTest", function() {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(
            `
                const enum LanguageType {
                    JS,
                    TS,
                    ETS,
                }
            `, 'test.ts');
        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Lda(new VReg()),
            new Stglobalvar(new Imm(0), 'LanguageType'),
            new Definefunc(new Imm(0), 'UnitTest.#1#', new Imm(1)),
            new Sta(new VReg()),
            new Ldglobalvar(new Imm(0), 'LanguageType'),
            new Sta(new VReg()),
            new Isfalse(),
            new Jeqz(new Label()),
            new Createemptyobject(),
            new Sta(new VReg()),
            new Stglobalvar(new Imm(0), 'LanguageType'),
            new Jmp(new Label()),
            new Label(),
            new Lda(new VReg()),
            new Label(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callarg1(new Imm(0), new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });
    it("preserveConstEnumsInModuleTest", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(
            `
                class foo {};
                module foo {
                    const enum LanguageType {
                        JS,
                        TS,
                        ETS,
                    }
                };
            `, 'test.ts');
        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Mov(new VReg(), new VReg()),
            new Defineclasswithbuffer(new Imm(0), 'UnitTest.#1#foo', 'test_1', new Imm(0), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(0), 'foo'),
            new Definefunc(new Imm(0), 'UnitTest.#3#', new Imm(1)),
            new Sta(new VReg()),
            new Tryldglobalbyname(new Imm(0), 'foo'),
            new Sta(new VReg()),
            new Isfalse(),
            new Jeqz(new Label()),
            new Createemptyobject(),
            new Sta(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new ThrowUndefinedifholewithname("foo"),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Jmp(new Label()),
            new Label(),
            new Lda(new VReg()),
            new Label(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callarg1(new Imm(0), new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});

