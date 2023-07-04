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
    Add2,
    Ashr2,
    Div2,
    Exp,
    Mod2,
    Mul2,
    Returnundefined,
    Shl2,
    Shr2,
    Sttoglobalrecord,
    Sub2,
    Tryldglobalbyname,
    Trystglobalbyname,
    Imm,
    Ldai,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("OperationEqualTest", function () {
    it("plusEqual", function () {
        let insns = compileMainSnippet("let a = 2;\n" +
            "a += 3;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 2;\n" +
        "a += 3;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(2)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Add2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("minusEqual", function () {
        let insns = compileMainSnippet("let a = 5;\n" +
            "a -= 7;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 5;\n" +
        "a -= 7;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(7)),
            new Sub2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("asteriskEqual", function () {
        let insns = compileMainSnippet("let a = 2;\n" +
            "a *= 4;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 2;\n" +
        "a *= 4;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(2)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(4)),
            new Mul2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("AsteriskAsteriskEqualsToken", function () {
        let insns = compileMainSnippet("let a = 2;\n" +
            "a **= 3;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 2;\n" +
        "a **= 3;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(2)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Exp(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("slashEqual", function () {
        let insns = compileMainSnippet("let a = 5;\n" +
            "a /= 3;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 5;\n" +
        "a /= 3;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Div2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("percentEqual", function () {
        let insns = compileMainSnippet("let a = 15;\n" +
            "a %= 7;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 5;\n" +
        "a /= 3;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(15)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(7)),
            new Mod2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("lessThanLessThanEqual", function () {
        let insns = compileMainSnippet("let a = 8;\n" +
            "a <<= 3;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 8;\n" +
        "a <<= 3;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(8)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Shl2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("greaterThanGreaterThanEqual", function () {
        let insns = compileMainSnippet("let a = 4;\n" +
            "a >>= 1;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 4;\n" +
        "a >>= 1;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(4)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Ashr2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("greaterThanGreaterThanGreaterThanEqual", function () {
        let insns = compileMainSnippet("let a = 8;\n" +
            "a >>>= 2;");
        let lhs = new VReg();
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a = 8;\n" +
        "a >>>= 2;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(8)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(2)),
            new Shr2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
