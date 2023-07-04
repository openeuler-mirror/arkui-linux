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
    And2,
    Eq,
    Greater,
    Greatereq,
    Inc,
    Instanceof,
    Isin,
    Less,
    Lesseq,
    Noteq,
    Or2,
    Returnundefined,
    Sttoglobalrecord,
    Stricteq,
    Strictnoteq,
    Tonumeric,
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
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("CmpBinaryOperators", function () {
    it("LessThan", function () {
        let insns = compileMainSnippet("2 < 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("2 < 3;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(2)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Less(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("GreaterThan", function () {
        let insns = compileMainSnippet("3 > 1;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 > 1;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Greater(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("LessThanEquals", function () {
        let insns = compileMainSnippet("3 <= 4;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 <= 4;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(4)),
            new Lesseq(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("GreaterThanEquals", function () {
        let insns = compileMainSnippet("3 >= 2;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 >= 2;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(2)),
            new Greatereq(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("EqualsEquals", function () {
        let insns = compileMainSnippet("3 == 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 == 3;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Eq(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("ExclamationEquals", function () {
        let insns = compileMainSnippet("3 != 2;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 != 2;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(2)),
            new Noteq(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("EqualsEqualsEquals", function () {
        let insns = compileMainSnippet("3 === 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 === 3;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Stricteq(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("ExclamationEqualsEquals", function () {
        let insns = compileMainSnippet("3 !== 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("3 !== 3;"), 0, undefined);
        let lhs = new VReg();
        let falseLabel = new Label();
        let endLabel = new Label();

        let expected = [
            new Ldai(new Imm(3)),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Strictnoteq(new Imm(0), lhs),
            new Jeqz(falseLabel),
            new Lda(new VReg()),
            new Jmp(endLabel),
            falseLabel,
            new Lda(new VReg()),
            endLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("ampersandEqual", function () {
        let insns = compileMainSnippet("let a = 5;\n" +
            "a &= 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("let a = 5;\n" + "a &= 3;"), 0, undefined);
        let lhs = new VReg();

        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new And2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("barEqual", function () {
        let insns = compileMainSnippet("let a = 5;\n" +
            "a |= 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("let a = 5;\n" + "a |= 3;"), 0, undefined);
        let lhs = new VReg();

        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Or2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("caretEqual", function () {
        let insns = compileMainSnippet("let a = 5;\n" +
            "a ^= 3;");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("let a = 5;\n" + "a ^= 3;"), 0, undefined);
        let lhs = new VReg();

        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(3)),
            new Xor2(new Imm(2), lhs),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("CommaToken", function () {
        let insns = compileMainSnippet(`let x = 1;
                                x = (x++, x);`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let x = 1; x = (x++, x);`), 0, undefined);
        let rhs = new VReg();
        let lhs = new VReg();

        let expected = [
            new Ldai(new Imm(1)),
            new Sttoglobalrecord(new Imm(0), 'x'),
            new Tryldglobalbyname(new Imm(1), 'x'),
            new Sta(lhs),
            new Lda(lhs),
            new Inc(new Imm(2)),
            new Trystglobalbyname(new Imm(3), 'x'),
            new Lda(new VReg()),
            new Tonumeric(new Imm(4)),
            new Sta(rhs),
            new Tryldglobalbyname(new Imm(5), 'x'),
            new Trystglobalbyname(new Imm(6), 'x'),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("InKeyword", function () {
        let insns = compileMainSnippet(`'o' in C;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`'o' in C;`), 0, undefined);
        let rhs = new VReg();

        let expected = [
            new LdaStr('o'),
            new Sta(rhs),
            new Tryldglobalbyname(new Imm(0), "C"),
            new Isin(new Imm(1), rhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("InstanceOfKeyword", function () {
        let insns = compileMainSnippet(`o instanceof C;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`o instanceof C;`), 0, undefined);
        let rhs = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(0), "o"),
            new Sta(rhs),
            new Tryldglobalbyname(new Imm(1), "C"),
            new Instanceof(new Imm(2), rhs),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

});
