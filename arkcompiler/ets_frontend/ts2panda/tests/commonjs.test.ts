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
import { checkInstructions, SnippetCompiler } from "./utils/base";
import {
    Callarg1,
    Callthis3,
    Createemptyarray,
    Definefunc,
    Returnundefined,
    Stobjbyname,
    Stownbyindex,
    Tryldglobalbyname,
    Imm,
    Lda,
    Ldai,
    LdaStr,
    Ldobjbyname,
    Mov,
    Sta,
    VReg,
    IRNode
} from "../src/irnodes";
import { CmdOptions } from '../src/cmdOptions';
import { creatAstFromSnippet } from "./utils/asthelper";
import { PandaGen } from '../src/pandagen';


describe("CommonJsTest", function () {

    it("mainFunc", function() {
        CmdOptions.isCommonJs = () => {return true};
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileCommonjs(`let a = 1`, 'cjs.js');
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let a = 1`), 0, undefined);

        CmdOptions.isCommonJs = () => {return false};
        let funcMainInsns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Tryldglobalbyname(new Imm(0), "Reflect"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), "apply"),
            new Sta(new VReg()),
            new Definefunc(new Imm(3), 'UnitTest.#1#', new Imm(5)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Createemptyarray(new Imm(4)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stownbyindex(new Imm(5), new VReg(), new Imm(0)),
            new Lda(new VReg()),
            new Stownbyindex(new Imm(7), new VReg(), new Imm(1)),
            new Lda(new VReg()),
            new Stownbyindex(new Imm(9), new VReg(), new Imm(2)),
            new Lda(new VReg()),
            new Stownbyindex(new Imm(11), new VReg(), new Imm(3)),
            new Lda(new VReg()),
            new Stownbyindex(new Imm(13), new VReg(), new Imm(4)),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callthis3(new Imm(15), new VReg(), new VReg(), new VReg(), new VReg()),
            new Returnundefined(),
        ];
        expect(checkInstructions(funcMainInsns, expected)).to.be.true;
    });

    it("requireTest", function() {
        CmdOptions.isCommonJs = () => {return true};
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileCommonjs(`let a = require('a.js')`, 'cjs.js');
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let a = require('a.js')`), 0, undefined);
        CmdOptions.isCommonJs = () => {return false};
        let execInsns = snippetCompiler.getPandaGenByName('UnitTest.#1#')!.getInsns();
        let requirePara = new VReg();
        let requireReg = new VReg();
        let moduleRequest = new VReg();
        let expected = [
            new Lda(requirePara),
            new Sta(requireReg),
            new LdaStr("a.js"),
            new Sta(moduleRequest),
            new Lda(new VReg()),
            new Callarg1(new Imm(0), moduleRequest),
            new Sta(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(execInsns, expected)).to.be.true;
    });

    it("exportTest", function() {
        CmdOptions.isCommonJs = () => {return true};
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileCommonjs(`let a = 1; exports.a = a;`, 'cjs.js');
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let a = 1; exports.a = a;`), 0, undefined);
        CmdOptions.isCommonJs = () => {return false};
        let execInsns = snippetCompiler.getPandaGenByName('UnitTest.#1#')!.getInsns();
        let exportsPara = new VReg();
        let exportsReg = new VReg();
        let tmpReg = new VReg();
        let a = new VReg();
        let expected = [
            new Ldai(new Imm(1)),
            new Sta(a),
            new Lda(exportsPara),
            new Sta(exportsReg),
            new Mov(tmpReg, exportsReg),
            new Lda(a),
            new Stobjbyname(new Imm(0), "a", tmpReg),
            new Returnundefined()
        ];
        expect(checkInstructions(execInsns, expected)).to.be.true;
    });
});