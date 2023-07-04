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
import {
    Dynamicimport,
    Callarg0,
    Callarg1,
    Apply,
    Createarraywithbuffer,
    Createemptyarray,
    Ldobjbyname,
    Ldobjbyvalue,
    Returnundefined,
    Starrayspread,
    Stconsttoglobalrecord,
    Sttoglobalrecord,
    Tryldglobalbyname,
    Imm,
    Lda,
    Ldai,
    Sta,
    VReg,
    Callthis0,
    LdaStr,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("CallTest", function () {
    it("no arg call of a global standalone function", function () {
        let insns = compileMainSnippet(`foo();`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`foo();`), 0, undefined);
        let arg0 = new VReg();
        let expected = [
            new Tryldglobalbyname(new Imm(0), "foo"),
            new Sta(arg0),
            new Lda(arg0),
            new Callarg0(new Imm(1)),

            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("one arg call of a global standalone function", function () {
        let insns = compileMainSnippet(`let i = 5;foo(i);`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let i = 5;foo(i);`), 0, undefined);
        let arg0 = new VReg();
        let arg2 = new VReg();
        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'i'),
            new Tryldglobalbyname(new Imm(1), "foo"),
            new Sta(arg0),
            new Tryldglobalbyname(new Imm(2), 'i'),
            new Sta(arg2),
            new Lda(arg0),
            new Callarg1(new Imm(3), arg2),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("call method", function () {
        let insns = compileMainSnippet(`
      Foo.method();
      `);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`Foo.method();`), 0, undefined);
        let obj = new VReg();
        let arg0 = new VReg();
        let arg1 = new VReg();
        let expected = [
            new Tryldglobalbyname(new Imm(0), "Foo"),
            new Sta(arg0),
            new Lda(arg0),
            new Ldobjbyname(new Imm(1), "method"),
            new Sta(arg1),
            new Lda(arg0),
            new Callthis0(new Imm(3), obj),

            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("spread element call of a global standalone function", function () {
        CmdOptions.parseUserCmd([""]);
        let insns = compileMainSnippet(`
       const args = [1, 2];
       myFunction(...args);
      `);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`const args = [1, 2];myFunction(...args);`), 0, undefined);
        let arg0 = new VReg();
        let globalEnv = new VReg();
        let lengthReg = new VReg();
        let arrayInstance = new VReg();

        let expected = [
            new Createarraywithbuffer(new Imm(0), "snippet_1"),
            new Sta(arrayInstance),
            new Lda(arrayInstance),
            new Stconsttoglobalrecord(new Imm(1), 'args'),

            new Tryldglobalbyname(new Imm(2), "myFunction"),
            new Sta(arg0),

            new Createemptyarray(new Imm(3), ),
            new Sta(arrayInstance),
            new Ldai(new Imm(0)),
            new Sta(lengthReg),
            new Tryldglobalbyname(new Imm(4), 'args'),
            new Starrayspread(arrayInstance, lengthReg),
            new Sta(lengthReg),
            new Lda(arrayInstance),

            new Lda(arg0),
            new Apply(new Imm(5), globalEnv, arrayInstance),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("call by element access", function () {
        let insns = compileMainSnippet(`
            Foo[method]();
            `);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`Foo[method]();`), 0, undefined);
        let obj = new VReg();
        let prop = new VReg();
        let arg0 = new VReg();
        let arg1 = new VReg();
        let expected = [
            new Tryldglobalbyname(new Imm(0), "Foo"),
            new Sta(arg0),
            new Tryldglobalbyname(new Imm(1), "method"),
            new Sta(prop),
            new Lda(prop),
            new Ldobjbyvalue(new Imm(2), arg0),
            new Sta(arg1),
            new Lda(arg1),
            new Callthis0(new Imm(4), arg0),

            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("import calls", function () {
        let insns = compileMainSnippet(`import('./test.js');`);
        let expected = [
            new LdaStr("./test.js"),
            new Dynamicimport(),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    })
});
