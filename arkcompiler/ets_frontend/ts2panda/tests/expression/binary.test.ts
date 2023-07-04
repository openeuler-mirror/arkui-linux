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
    And2,
    Ashr2,
    Createemptyobject,
    Div2,
    Exp,
    Mod2,
    Mul2,
    Or2,
    Returnundefined,
    Shl2,
    Shr2,
    Stglobalvar,
    Sttoglobalrecord,
    Stobjbyname,
    Strictnoteq,
    Sub2,
    Tryldglobalbyname,
    Trystglobalbyname,
    Xor2,
    Imm,
    Jeqz,
    Jmp,
    Label,
    Lda,
    Ldai,
    LdaStr,
    Mov,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("BinaryOperationsTest", function () {
    it("2 + 3", function () {
        let insns = compileMainSnippet("2 + 3");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("2 + 3"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(2)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Add2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("5 - 1", function () {
        let insns = compileMainSnippet("5 - 1");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("5 - 1"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(5)),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Sub2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("null ?? 1", function () {
        let insns = compileMainSnippet("null ?? 1");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("null ?? 1"), 0, undefined);

        let leftNullishLabel = new Label();
        let endLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Strictnoteq(new Imm(0), new VReg()),
            new Jeqz(leftNullishLabel),
            new Lda(new VReg()),
            new Strictnoteq(new Imm(1), new VReg()),
            new Jeqz(leftNullishLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            leftNullishLabel,
            new Ldai(new Imm(1)),
            endLabel,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => item instanceof Jeqz || item instanceof Jmp)

        expect(jumps.length).to.equal(3);
    });

    it("undefined ?? 1", function () {
        let insns = compileMainSnippet("undefined ?? 1");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("undefined ?? 1"), 0, undefined);

        let leftNullishLabel = new Label();
        let endLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Strictnoteq(new Imm(0), new VReg()),
            new Jeqz(leftNullishLabel),
            new Lda(new VReg()),
            new Strictnoteq(new Imm(1), new VReg()),
            new Jeqz(leftNullishLabel),

            new Lda(new VReg()),
            new Jmp(endLabel),

            leftNullishLabel,
            new Ldai(new Imm(1)),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => item instanceof Jeqz || item instanceof Jmp)

        expect(jumps.length).to.equal(3);
    });

    it("2 ?? 1", function () {
        let insns = compileMainSnippet("2 ?? 1");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("2 ?? 1"), 0, undefined);
        let lhs = new VReg();

        let leftNullishLabel = new Label();
        let endLabel = new Label();
        let expected = [
            new Ldai(new Imm(2)),
            new Sta(new VReg()),
            new Strictnoteq(new Imm(0), new VReg()),
            new Jeqz(leftNullishLabel),
            new Lda(new VReg()),
            new Strictnoteq(new Imm(1), new VReg()),
            new Jeqz(leftNullishLabel),

            new Lda(lhs),
            new Jmp(endLabel),

            leftNullishLabel,
            new Ldai(new Imm(1)),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => item instanceof Jeqz || item instanceof Jmp)

        expect(jumps.length).to.equal(3);
    });

    it("3 * 4", function () {
        let insns = compileMainSnippet("3 * 4");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 * 4"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(4)),
            new Mul2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("2 ** 3", function () {
        let insns = compileMainSnippet("2 ** 3");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("2 ** 3"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(2)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Exp(new Imm(0), lhs),
            new Returnundefined(),
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("7 / 1", function () {
        let insns = compileMainSnippet("7 / 1");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("7 / 1"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(7)),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Div2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("8 % 2", function () {
        let insns = compileMainSnippet("8 % 2");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("8 % 2"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(8)),
            new Sta(lhs),
            new Ldai(new Imm(2)),
            new Mod2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("2 << 3", function () {
        let insns = compileMainSnippet("2 << 3");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("2 << 3"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(2)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Shl2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("4 >> 1", function () {
        let insns = compileMainSnippet("4 >> 1");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("4 >> 1"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(4)),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Ashr2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("12 >>> 2", function () {
        let insns = compileMainSnippet("12 >>> 2");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("12 >>> 2"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(12)),
            new Sta(lhs),
            new Ldai(new Imm(2)),
            new Shr2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("3 & 4", function () {
        let insns = compileMainSnippet("3 & 4");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 & 4"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(4)),
            new And2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("2 | 5", function () {
        let insns = compileMainSnippet("2 | 5");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("2 | 5"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(2)),
            new Sta(lhs),
            new Ldai(new Imm(5)),
            new Or2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("7 ^ 3", function () {
        let insns = compileMainSnippet("7 ^ 3");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("7 ^ 3"), 0, undefined);
        let lhs = new VReg();
        let expected = [
            new Ldai(new Imm(7)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Xor2(new Imm(0), lhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let i; i = 2", function () {
        let insns = compileMainSnippet("let i; i = 2;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("let i; i = 2;"), 0, undefined);
        let expected = [
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(0), 'i'),
            new Ldai(new Imm(2)),
            new Trystglobalbyname(new Imm(1), 'i'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("a = 1 under strict mode", function () {
        let insns = compileMainSnippet(`
                                        "use strict";
                                        a = 1;
                                        `);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`"use strict";a = 1;`), 0, undefined);
        let expected = [
            new LdaStr("use strict"),
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(0), "a"),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    })

    it("Assignment to ParenthesizedExpression case1", function () {
        let insns = compileMainSnippet("((x)) = 1;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("((x)) = 1;"), 0, undefined);

        let expected = [
            new Ldai(new Imm(1)),
            new Stglobalvar(new Imm(0), "x"),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("Assignment to ParenthesizedExpression case2", function () {
        let insns = compileMainSnippet(`let a = {};
                                ((a.b)) = 1;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let a = {};((a.b)) = 1;`), 0, undefined);
        let objReg = new VReg();
        let tempObj = new VReg();

        let expected = [
            new Createemptyobject(),
            new Sta(new VReg()),
            // insns for `((a.b)) = 1`
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(tempObj),
            new Mov(objReg, tempObj),
            new Ldai(new Imm(1)),

            new Stobjbyname(new Imm(2), "b", objReg),
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
