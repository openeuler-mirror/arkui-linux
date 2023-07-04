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
    Inc,
    Less,
    Returnundefined,
    Tonumeric,
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

describe("ForLoopTest", function () {
    it('forLoopEmpty', function () {
        let insns = compileMainSnippet("for (;;) {}");
        let labelPre = new Label();
        let labelPost = new Label();
        let labelIncr = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            labelPre,
            labelIncr,
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ];
        let jumps = insns.filter(item => item instanceof Jmp);

        expect(jumps.length).to.equal(1);

        let jmpLabel = (<Jmp>jumps[0]).getTarget();

        expect(checkInstructions(insns, expected)).to.be.true;
        expect(jmpLabel).to.equal(insns[0]);
    });

    it('forLoopWithInitializer', function () {
        let insns = compileMainSnippet("for (let i = 0;;) {}");
        let jumps = insns.filter(item => item instanceof Jmp);

        expect(jumps.length).to.equal(1);

        let jmpLabel = (<Jmp>jumps[0]).getTarget();

        expect(insns[4]).to.equal(jumps[0]);
        expect(jmpLabel).to.equal(insns[2]);
    });

    it('forLoopWithInitializerAndCondition', function () {
        let insns = compileMainSnippet("for (let i = 0; i < 5;) {}");
        let jumps = insns.filter(item => (item instanceof Jmp || item instanceof Jeqz));

        expect(jumps.length).to.equal(2);

        let jgezLabel = (<Jmp>jumps[0]).getTarget();
        let jmpLabel = (<Jmp>jumps[1]).getTarget();

        expect(jmpLabel).to.equal(insns[2]);
        expect(jgezLabel).to.equal(insns[10]);

        expect(insns[7]).to.equal(jumps[0]);
        expect(insns[9]).to.equal(jumps[1]);
    });

    it('forLoopWithInitializerAndConditionAndIncrementor', function () {
        let insns = compileMainSnippet("for (let i = 0; i < 5; i++) {}");
        let jumps = insns.filter(item => (item instanceof Jmp || item instanceof Jeqz));

        expect(jumps.length).to.equal(2);

        let jgezLabel = (<Jmp>jumps[0]).getTarget();
        let jmpLabel = (<Jmp>jumps[1]).getTarget();

        expect(jmpLabel).to.equal(insns[2]);
        expect(jgezLabel).to.equal(insns[17]);

        expect(insns[7]).to.equal(jumps[0]);
        expect(insns[16]).to.equal(jumps[1]);
    });

    it('forLoopWithContinue', function () {
        let insns = compileMainSnippet("for (let i = 0; i < 5; ++i) { continue; }");
        let i = new VReg();
        let lhs = new VReg();
        let operand = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let labelIncr = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            // initializer
            new Ldai(new Imm(0)),
            new Sta(i),
            labelPre,
            // condition
            new Lda(i),
            new Sta(lhs),
            new Ldai(new Imm(5)),
            new Less(new Imm(0), lhs),
            new Jeqz(labelPost),
            // body
            new Jmp(labelIncr), // continue
            labelIncr,
            // incrementor
            new Lda(i),
            new Sta(operand),
            new Lda(operand),
            new Inc(new Imm(1)),
            new Sta(i),
            // jump to the loop header
            new Jmp(new Label()),
            labelPost,
            new Returnundefined()
        ];
        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check continue jumps to the expected instruction
        let jmp = <Jmp>insns[8];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[9]);
    });

    it('forLoopWithBreak', function () {
        let insns = compileMainSnippet("for (let i = 0; i < 5; ++i) {break; }");
        let i = new VReg();
        let lhs = new VReg();
        let operand = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let labelIncr = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            // initializer
            new Ldai(new Imm(0)),
            new Sta(i),
            labelPre,
            // condition
            new Lda(i),
            new Sta(lhs),
            new Ldai(new Imm(5)),
            new Less(new Imm(0), lhs),
            new Jeqz(labelPost),
            // body
            new Jmp(labelPost), // break
            // incrementor
            labelIncr,
            new Lda(i),
            new Sta(operand),
            new Lda(operand),
            new Inc(new Imm(1)),
            new Sta(i),
            // jump to the loop header
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ];
        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check continue jumps to the expected instruction
        let jmp = <Jmp>insns[8];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[16]);
    });
});

describe("LoopWithLabelTests", function () {
    it('forLoopWithBreakWithLabel', function () {
        let insns = compileMainSnippet(`loop1:
                                for (let i = 0; i < 5; ++i) {
                                    for (let j = 0; j < 6; j++) {
                                        break loop1;
                                    }
                                }`);
        let i = new VReg();
        let j = new VReg();
        let lhs = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let labelIncr = new Label();
        let labelPre1 = new Label();
        let labelPost1 = new Label();
        let labelIncr1 = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            // initializer
            new Ldai(new Imm(0.0)),
            new Sta(i),
            labelPre,
            // condition
            new Lda(i),
            new Sta(lhs),
            new Ldai(new Imm(5.0)),
            new Less(new Imm(0), lhs),
            new Jeqz(labelPost),

            // second for
            new Ldai(new Imm(0.0)),
            new Sta(j),
            labelPre1,
            // condition
            new Lda(j),
            new Sta(lhs),
            new Ldai(new Imm(6.0)),
            new Less(new Imm(1), lhs),
            new Jeqz(labelPost1),
            new Jmp(labelPost),
            labelIncr1,
            // incrementor
            new Lda(j),
            new Sta(j),
            new Lda(j),
            new Inc(new Imm(2)),
            new Sta(j),
            new Lda(j),
            new Tonumeric(new Imm(3)),
            // jump to the loop header
            new Jmp(labelPre1),
            labelPost1,
            labelIncr,
            // incrementor
            new Lda(i),
            new Sta(i),
            new Lda(i),
            new Inc(new Imm(4)),
            new Sta(i),
            // jump to the loop header
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ];

        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check break jumps to the expected instruction
        let jmp = <Jmp>insns[16];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[34]);
    });

    it('forLoopWithContinueWithLabel', function () {
        let insns = compileMainSnippet(`loop1:
                                loop2:
                                loop3:
                                for (let i = 0; i < 5; ++i) {
                                    for (let j = 0; j < 6; j++) {
                                        continue loop2;
                                    }
                                }`);
        let i = new VReg();
        let j = new VReg();
        let lhs = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let labelIncr = new Label();
        let labelPre1 = new Label();
        let labelPost1 = new Label();
        let labelIncr1 = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            // initializer
            new Ldai(new Imm(0.0)),
            new Sta(i),
            labelPre,
            // condition
            new Lda(i),
            new Sta(lhs),
            new Ldai(new Imm(5.0)),
            new Less(new Imm(0), lhs),
            new Jeqz(labelPost),

            // second for
            new Ldai(new Imm(0.0)),
            new Sta(j),
            labelPre1,
            // condition
            new Lda(j),
            new Sta(lhs),
            new Ldai(new Imm(6.0)),
            new Less(new Imm(1), lhs),
            new Jeqz(labelPost1),
            new Jmp(labelIncr),
            labelIncr1,
            // incrementor
            new Lda(j),
            new Sta(j),
            new Lda(j),
            new Inc(new Imm(2)),
            new Sta(j),
            new Lda(j),
            new Tonumeric(new Imm(3)),
            // jump to the loop header
            new Jmp(labelPre1),
            labelPost1,
            labelIncr,
            // incrementor
            new Lda(i),
            new Sta(i),
            new Lda(i),
            new Inc(new Imm(4)),
            new Sta(i),
            // jump to the loop header
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ];

        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check break jumps to the expected instruction
        let jmp = <Jmp>insns[16];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[27]);
    });
});
