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
    Createemptyarray,
    Ldobjbyname,
    Newobjrange,
    Newobjapply,
    Returnundefined,
    Starrayspread,
    Tryldglobalbyname,
    Imm,
    Lda,
    Ldai,
    Mov,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("NewTest", function () {
    it("new Object", function () {
        let insns = compileMainSnippet("new Object");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("new Object"), 0, undefined);
        let arg0 = new VReg();
        let expected = [
            new Tryldglobalbyname(new Imm(0), "Object"),
            new Sta(arg0),

            new Newobjrange(new Imm(1), new Imm(1), [arg0]),

            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("new Object()", function () {
        let insns = compileMainSnippet("new Object()");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("new Object()"), 0, undefined);
        let arg0 = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(0), "Object"),
            new Sta(arg0),

            new Newobjrange(new Imm(1), new Imm(1), [arg0]),

            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("new Object(2)", function () {
        let insns = compileMainSnippet("new Object(2)");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("new Object(2)"), 0, undefined);
        let arg0 = new VReg();
        let arg1 = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(0), "Object"),
            new Sta(arg0),

            new Ldai(new Imm(2)),
            new Sta(arg1),

            new Newobjrange(new Imm(1), new Imm(2), [arg0, arg1]),

            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("new obj.ctor()", function () {
        let insns = compileMainSnippet("let obj; new obj.ctor()");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let obj; new obj.ctor()"), 0, undefined);
        IRNode.pg.updateIcSize(1);
        let obj = new VReg();
        let arg0 = new VReg();
        let temp = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(0), 'obj'),
            new Sta(temp),

            new Lda(obj),
            new Ldobjbyname(new Imm(1), "ctor"),
            new Sta(arg0),

            new Newobjrange(new Imm(3), new Imm(1), [arg0]),
        ];

        insns = insns.slice(2, insns.length - 1);
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("new Object(...args)", function () {
        let insns = compileMainSnippet(`new Object(...args);`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet("new Object(...args);"), 0, undefined);
        let arg0 = new VReg();
        let elemIdxReg = new VReg();
        let arrayInstance = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(0), "Object"),
            new Sta(arg0),

            new Createemptyarray(new Imm(1)),
            new Sta(arrayInstance),
            new Ldai(new Imm(0)),
            new Sta(elemIdxReg),

            new Tryldglobalbyname(new Imm(2), "args"),
            new Starrayspread(arrayInstance, elemIdxReg),
            new Sta(elemIdxReg),
            new Lda(arrayInstance),

            new Newobjapply(new Imm(3), arg0),

            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
