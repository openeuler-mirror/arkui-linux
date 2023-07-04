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
    Copyrestargs,
    Definefunc,
    Returnundefined,
    Stglobalvar,
    Sttoglobalrecord,
    Stricteq,
    Imm,
    Jeqz,
    Label,
    Lda,
    Ldai,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import {
    GlobalVariable,
    LocalVariable
} from "../../src/variable";
import { checkInstructions, compileAllSnippet, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("FunctionDeclarationTest", function () {
    it('function definition in the global scope', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile("function foo() {}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let funcInternalName = "UnitTest.foo";
        let funcName = "foo";
        let expected = [
            new Definefunc(new Imm(0), funcInternalName, new Imm(0)),
            new Stglobalvar(new Imm(1), funcName),
            new Returnundefined()
        ];
        let insns = snippetCompiler.getGlobalInsns();
        let globalScope = snippetCompiler.getGlobalScope();
        expect(checkInstructions(insns, expected)).to.be.true;
        let foo = globalScope!.findLocal(funcName);
        expect(foo != undefined).to.be.true;
        expect(foo instanceof GlobalVariable).to.be.true;
    });

    it('function redefinition in the global scope', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`
      function foo() {}
      function foo() {}
      `);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.#2#foo", new Imm(0)),
            new Stglobalvar(new Imm(1), "foo"),
            new Returnundefined()
        ];
        let insns = snippetCompiler.getGlobalInsns();
        let globalScope = snippetCompiler.getGlobalScope();
        expect(checkInstructions(insns, expected)).to.be.true;
        let foo = globalScope!.findLocal("foo");
        expect(foo != undefined).to.be.true;
        expect(foo instanceof GlobalVariable).to.be.true;
    });

    it('function definition inside a function', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function out() {function foo() {}}`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let funcReg = new VReg();
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.foo", new Imm(0)),
            new Sta(funcReg),

            new Returnundefined()
        ];
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.out");
        let insns = functionPg!.getInsns();
        let functionScope = functionPg!.getScope();

        expect(checkInstructions(insns!, expected)).to.be.true;
        let foo = functionScope!.findLocal("foo");
        expect(foo != undefined).to.be.true;
        expect(foo instanceof LocalVariable).to.be.true;
        let parameterLength = functionPg!.getParameterLength();
        expect(parameterLength == 0).to.be.true;
    });

    it("function expression", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile("let foo = function() {}");
        let insns = snippetCompiler.getGlobalInsns();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.foo", new Imm(0)),
            new Sttoglobalrecord(new Imm(1), "foo"),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("Parameters with initializer", function () {
        let compilerunit = compileAllSnippet("function test(a, b = 1) {}");
        let undefinedVReg = new VReg();
        let value = new VReg();
        let endLabel = new Label();

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected_main = [
            new Definefunc(new Imm(0), "UnitTest.test", new Imm(1)),
            new Stglobalvar(new Imm(1), "test"),
            new Returnundefined()
        ];

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected_func = [
            // func_test_0
            new Lda(new VReg()),
            new Stricteq(new Imm(0), undefinedVReg),
            new Jeqz(endLabel),
            new Ldai(new Imm(1)),
            new Sta(value),
            endLabel,
            new Returnundefined(),
        ];

        compilerunit.forEach(element => {
            if (element.internalName == "UnitTest.func_main_0") {
                let insns = element.getInsns();
                expect(checkInstructions(insns, expected_main)).to.be.true;
            } else if (element.internalName == "UnitTest.test") {
                let insns = element.getInsns();
                expect(checkInstructions(insns, expected_func)).to.be.true;
                let parameterLength = element.getParameterLength();
                expect(parameterLength == 1).to.be.true;
            }
        });
    });

    it("Rest Parameters", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function test(a, ...b) {}`);

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let idx = new Imm(1);
        let lastParam = new VReg();
        let expected_func = [
            // func_test_0
            new Copyrestargs(idx),
            new Sta(lastParam),
            new Returnundefined(),
        ];

        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.test");
        let insns = functionPg!.getInsns();

        expect(checkInstructions(insns, expected_func)).to.be.true;
    });
});
