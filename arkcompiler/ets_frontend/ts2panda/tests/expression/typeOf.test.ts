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
    Callarg1,
    Ldobjbyname,
    Returnundefined,
    Tryldglobalbyname,
    Typeof,
    Imm,
    Ldai,
    LdaStr,
    Sta,
    VReg,
    Lda,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("TypeOfTest", function () {
    it("typeof 12", function () {
        let insns = compileMainSnippet("typeof 5");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("typeof 5"), 0, undefined);

        let expected = [
            new Ldai(new Imm(5)),
            new Typeof(new Imm(0)),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("typeof Number(\"12\")", function () {
        let insns = compileMainSnippet("typeof Number(\"5\")");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("typeof Number(\"5\")"), 0, undefined);

        let arg1 = new VReg();
        let arg3 = new VReg();
        let expected = [
            new Tryldglobalbyname(new Imm(0), "Number"),
            new Sta(arg1),

            new LdaStr("5"),
            new Sta(arg3),
            new Lda(arg1),
            new Callarg1(new Imm(1), arg3),
            new Typeof(new Imm(2)),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("typeof x", function () {
        let insns = compileMainSnippet("typeof x");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("typeof x"), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), "x"),
            new Typeof(new Imm(2)),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("typeof(x)", function () {
        let insns = compileMainSnippet("typeof(x)");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("typeof(x)"), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), "x"),
            new Typeof(new Imm(2)),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
