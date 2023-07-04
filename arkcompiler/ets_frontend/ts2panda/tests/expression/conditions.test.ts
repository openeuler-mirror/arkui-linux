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
    Isfalse,
    Istrue,
    Returnundefined,
    Sttoglobalrecord,
    Tryldglobalbyname,
    Imm,
    Jeqz,
    Jmp,
    Label,
    Lda,
    Ldai,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("IfConditionTest", function () {
    it('ifConditionEmpty', function () {
        let insns = compileMainSnippet("let s = 1;\n" +
            "if (s > 2) {}");
        let jumps = insns.filter(item => item instanceof Jeqz);

        expect(jumps.length).to.equal(1);

        let targetLabel = (<Jeqz>jumps[0]).getTarget();
        // The last instruction is return.
        expect(targetLabel).to.equal(insns[insns.length - 2]);
    });

    it('ifConditionWithThenStatement', function () {
        let insns = compileMainSnippet("let a = 2;\n" +
            "if (a > 4) {\n" +
            "  a = 3;\n" +
            "}");
        let jumps = insns.filter(item => item instanceof Jeqz);

        expect(jumps.length).to.equal(1);

        let targetLabel = (<Jeqz>jumps[0]).getTarget();
        // The last instruction is return.
        expect(targetLabel).to.equal(insns[insns.length - 2]);
    });

    it('ifConditionWithThenStatementAndElseStatement', function () {
        let insns = compileMainSnippet("let a = 5;\n" +
            "if (a > 3) {\n" +
            "  a = 2;\n" +
            "} else {\n" +
            "  a = 4;\n" +
            "}");
        let jumps = insns.filter(item => (item instanceof Jeqz || item instanceof Jmp));
        let labels = insns.filter(item => (item instanceof Label));

        expect(jumps.length).to.equal(2);
        expect(labels.length).to.equal(2);

        let elseLabel = (<Jeqz>jumps[0]).getTarget();
        let endIfLabel = (<Jmp>jumps[1]).getTarget();

        expect(elseLabel).to.equal(labels[0]);
        expect(endIfLabel).to.equal(labels[1]);

        expect(elseLabel).to.equal(insns[insns.length - 5]);
        expect(endIfLabel).to.equal(insns[insns.length - 2]);
    });

    it("if (a & b)", function () {
        let insns = compileMainSnippet(`
      let a = 1;
      let b = 2;
      if (a & b) {
      }
      `);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`
        let a = 1;
        let b = 2;
        if (a & b) {
        }
        `), 0, undefined);
        IRNode.pg.updateIcSize(2);
        let lhs = new VReg();
        let endIfLabel = new Label();
        let expected = [
            new Tryldglobalbyname(new Imm(2), 'a'),
            new Sta(lhs),
            new Tryldglobalbyname(new Imm(3), 'b'),
            new And2(new Imm(4), lhs),
            new Istrue(),
            new Jeqz(endIfLabel),
            endIfLabel,
        ];
        insns = insns.slice(4, insns.length - 1); // skip let a = 1; let b = 2; and return.
        expect(checkInstructions(insns, expected)).to.be.true
    });

    it("if (a == b)", function () {
        let insns = compileMainSnippet(`
      let a = 1;
      let b = 2;
      if (a == b) {
      }
      `);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`
        let a = 1;
        let b = 2;
        if (a == b) {
        }
        `), 0, undefined);
        IRNode.pg.updateIcSize(2);

        let a = new VReg();
        let trueReg = new VReg();
        let endIfLabel = new Label();
        let expected = [
            new Tryldglobalbyname(new Imm(2), 'a'),
            new Sta(a),
            new Tryldglobalbyname(new Imm(3), 'b'),
            new Eq(new Imm(4), trueReg),
            new Jeqz(endIfLabel),
            endIfLabel,
        ];
        insns = insns.slice(4, insns.length - 1); // skip let a = 1; let b = 2; and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let a = true ? 5 : 0;", function () {
        let insns = compileMainSnippet(`let a = true ? 5 : 0;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let a = true ? 5 : 0;`), 0, undefined);
        insns = insns.slice(0, insns.length - 1);
        let expectedElseLabel = new Label();
        let expectedEndLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Istrue(),
            new Jeqz(expectedElseLabel),
            new Ldai(new Imm(5)),
            new Jmp(expectedEndLabel),
            expectedElseLabel,
            new Ldai(new Imm(0)),
            expectedEndLabel,
            new Sttoglobalrecord(new Imm(0), 'a'),
        ];
        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => (item instanceof Jeqz || item instanceof Jmp));
        let labels = insns.filter(item => (item instanceof Label));

        expect(jumps.length).to.equal(2);
        expect(labels.length).to.equal(2);
    });

    it("if (true && 5) {}", function () {
        let insns = compileMainSnippet("if (true && 5) {}");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("if (true && 5) {}"), 0, undefined);
        let ifFalseLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Istrue(),
            new Jeqz(ifFalseLabel),
            new Ldai(new Imm(5)),
            new Istrue(),
            new Jeqz(ifFalseLabel),
            ifFalseLabel,
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("if (false || 5) {}", function () {
        let insns = compileMainSnippet("if (false || 5) {}");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet("if (false || 5) {}"), 0, undefined);
        let ifFalseLabel = new Label();
        let endLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Isfalse(),
            new Jeqz(endLabel),
            new Ldai(new Imm(5)),
            new Istrue(),
            new Jeqz(ifFalseLabel),
            endLabel,
            ifFalseLabel,
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
