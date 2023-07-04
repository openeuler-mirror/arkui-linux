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

import {
    expect
} from 'chai';
import 'mocha';
import {
    Definefunc,
    Istrue,
    Returnundefined,
    Stglobalvar,
    ThrowUndefinedifhole,
    Imm,
    Jeqz,
    Label,
    Lda,
    Ldai,
    LdaStr,
    Sta,
    VReg,
    IRNode
} from "../src/irnodes";
import { checkInstructions, compileMainSnippet, SnippetCompiler } from "./utils/base";
import { creatAstFromSnippet } from "./utils/asthelper";
import { PandaGen } from '../src/pandagen';

describe("HoistTest", function () {

    // case 1: hoist var declared variable ((declared in global scope)) in global scope
    it('case 1;', function () {
        let insns = compileMainSnippet("var a = 1;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("var a = 1;"), 0, undefined);
        let expected = [
            new Lda(new VReg()),
            new Stglobalvar(new Imm(0), "a"),
            new Ldai(new Imm(1)),
            new Stglobalvar(new Imm(1), "a"),
            new Returnundefined()
        ]

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // case 2: hoist var declared variable (declared in local scope) in global scope
    it('case 2', function () {
        let insns = compileMainSnippet(`if (true) {
                                  var a = 2;
                                }`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`if (true) {
            var a = 2;
          }`), 0, undefined);
        let endLabel = new Label();

        let expected = [
            new Lda(new VReg()),
            new Stglobalvar(new Imm(0), "a"),
            new Lda(new VReg()),
            new Istrue(),
            new Jeqz(endLabel),
            new Ldai(new Imm(2)),
            new Stglobalvar(new Imm(1), "a"),
            endLabel,
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // case 3: hoist function declaration in global scope
    it('case 3', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function a() {};`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`function a() {};`), 0, undefined);

        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.a", new Imm(0)),
            new Stglobalvar(new Imm(1), "a"),
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // case 4: In case that two function declared directly in global scope with the same name, hoist the later one.
    it('case 4', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function a() {}; function a() {}`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`function a() {}; function a() {}`), 0, undefined);

        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.#2#a", new Imm(0)),
            new Stglobalvar(new Imm(1), "a"),
            new Returnundefined()
        ]

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // case 5: hoisting of function declaration is of higher priority than var declared variables with a same name in global scope
    it('case 5', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`var a = 1; function a() {}`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`var a = 1; function a() {}`), 0, undefined);

        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.a", new Imm(0)),
            new Stglobalvar(new Imm(1), "a"),
            new Ldai(new Imm(1)),
            new Stglobalvar(new Imm(2), "a"),
            new Returnundefined()
        ]

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    // case 6: hoist var declared variable in function scope
    it('case 6', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function a() {var a = 1;}`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`function a() {var a = 1;}`), 0, undefined);
        let funcPg = snippetCompiler.getPandaGenByName("UnitTest.a");
        let insns = funcPg!.getInsns();

        let a = new VReg();
        let expected = [
            new Lda(a),
            new Sta(new VReg()),
            new Ldai(new Imm(1)),
            new Sta(a),

            new Returnundefined()
        ]
        expect(checkInstructions(insns!, expected)).to.be.true;
    });

    // case 7: hoist function declaration in function scope
    it('case 7', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function a() {function b() {}};`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`function a() {function b() {}};`), 0, undefined);
        let funcPg = snippetCompiler.getPandaGenByName("UnitTest.a");
        let insns = funcPg!.getInsns();
        let a = new VReg();
        let expected = [
            new Definefunc(new Imm(0), "UnitTest.b", new Imm(0)),
            new Sta(a),

            new Returnundefined()
        ]

        expect(checkInstructions(insns!, expected)).to.be.true;
    });

    // case 8: temporary dead zone of let in global scope
    it('case 8', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`a = 1;
                                 let a;`);
        let funcPg = snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let insns = funcPg!.getInsns();
        let idReg = new VReg();
        let expected = [
            new LdaStr("a"),
            new Sta(idReg),
            new ThrowUndefinedifhole(new VReg(), idReg)
        ]

        expect(checkInstructions(insns.slice(3, 5), expected));
    });

    // case 9: temporary dead zone of let in function scope
    it('case 9', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function b() {
                                 a = 1;
                                 let a;
                                 }`);
        let funcPg = snippetCompiler.getPandaGenByName("UnitTest.b");
        let insns = funcPg!.getInsns();
        let idReg = new VReg();

        let expected = [
            new LdaStr("a"),
            new Sta(idReg),
            new ThrowUndefinedifhole(new VReg(), idReg)
        ]

        expect(checkInstructions(insns.slice(3, 5), expected));
    });

    // case 10: temporary dead zone of let in local scope
    it('case 10', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`{
                                    a = 1;
                                    let a;
                                 }`);
        let funcPg = snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let insns = funcPg!.getInsns();
        let idReg = new VReg();

        let expected = [
            new LdaStr("a"),
            new Sta(idReg),
            new ThrowUndefinedifhole(new VReg(), idReg)
        ]

        expect(checkInstructions(insns.slice(3, 5), expected));
    })
})
