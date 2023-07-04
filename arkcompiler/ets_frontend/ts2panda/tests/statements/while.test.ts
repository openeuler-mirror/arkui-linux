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
    Istrue,
    Less,
    Returnundefined,
    Sttoglobalrecord,
    Tryldglobalbyname,
    Trystglobalbyname,
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
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("WhileLoopTest", function () {
    it("while (true) {}", function () {
        let insns = compileMainSnippet("while (true) {}");
        let labelPre = new Label();
        let labelPost = new Label();
        let expected = [
            labelPre,
            new Lda(new VReg()),
            new Istrue(),
            new Jeqz(labelPost),
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("while (a + b) {}", function () {
        let insns = compileMainSnippet("let a, b; while (a + b) {}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        (<PandaGen>(IRNode.pg)).updateIcSize(2);
        let loopBegin = new Label();
        let loopEnd = new Label();
        let lhs = new VReg();
        let expected = [
            loopBegin,
            // a + b
            new Tryldglobalbyname(new Imm(0), 'a'),
            new Sta(lhs),
            new Tryldglobalbyname(new Imm(1), 'b'),
            new Add2(new Imm(2), lhs),
            new Istrue(),
            new Jeqz(loopEnd),
            // body
            new Jmp(loopBegin),
            loopEnd
        ];

        insns = insns.slice(4, insns.length - 1); // skip let a, b and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('whileLoopWithBody', function () {
        let insns = compileMainSnippet(`
      let a;
      while (a < 0) { a = 1; }
      `);

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        (<PandaGen>(IRNode.pg)).updateIcSize(1);
        let lhs = new VReg();
        let loopBegin = new Label();
        let loopEnd = new Label();
        let expected = [
            loopBegin,
            // condition
            // compute lhs
            new Tryldglobalbyname(new Imm(0), 'a'),
            new Sta(lhs),
            // compute rhs
            new Ldai(new Imm(0)),
            new Less(new Imm(1), lhs),
            new Jeqz(loopEnd),

            // body
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(2), 'a'),
            new Jmp(loopBegin),

            loopEnd,
        ];

        insns = insns.slice(2, insns.length - 1); // skip let a and return.
        expect(checkInstructions(insns, expected)).to.be.true;
        expect((<Jeqz>insns[5]).getTarget() === insns[insns.length - 1]).to.be.true;
        expect((<Jmp>insns[insns.length - 2]).getTarget() === insns[0]).to.be.true;
    });

    it('whileLoopWithContinue', function () {
        let insns = compileMainSnippet("let a = 5;" +
            "while (a < 1) { a = 2; continue; }");

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let lhs = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            labelPre,
            // condition
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Less(new Imm(2), lhs),
            new Jeqz(labelPost),
            //body
            new Ldai(new Imm(2)),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Jmp(labelPre), // continue
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ]
        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check continue jumps to the expected instruction
        let jmp = <Jmp>insns[11];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[2]);
    });

    it('whileLoopWithBreak', function () {
        let insns = compileMainSnippet("let a = 5;" +
            "while (a < 1) { a = 2; break; }");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let lhs = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            labelPre,
            // condition
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Less(new Imm(2), lhs),
            new Jeqz(labelPost),
            //body
            new Ldai(new Imm(2)),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Jmp(labelPost), //break
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ]
        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check continue jumps to the expected instruction
        let jmp = <Jmp>insns[10];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[12]);
    });
});
