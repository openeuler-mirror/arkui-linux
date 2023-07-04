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
    Less,
    Returnundefined,
    Sttoglobalrecord,
    Tryldglobalbyname,
    Trystglobalbyname,
    Imm,
    Jeqz,
    Jmp,
    Label,
    Ldai,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("DoWhileLoopTest", function () {
    it('doWhileLoopEmpty', function () {
        let insns = compileMainSnippet("do {} while (true)");

        let jumps = insns.filter(item => item instanceof Jmp);

        expect(jumps.length).to.equal(1);

        let jmpLabel = (<Jmp>jumps[0]).getTarget();

        expect(jmpLabel).to.equal(insns[0]);
    });

    it('doWhileLoopWithBody', function () {
        let insns = compileMainSnippet("let a = 5;" +
            "do { a++ } while (a < 11);");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let jumps = insns.filter(item => (item instanceof Jmp || item instanceof Jeqz));

        expect(jumps.length).to.equal(2);

        let jgezLabel = (<Jmp>jumps[0]).getTarget();
        let jmpLabel = (<Jmp>jumps[1]).getTarget();

        expect(jmpLabel).to.equal(insns[2]);
        expect(jgezLabel).to.equal(insns[17]);

        expect(insns[15]).to.equal(jumps[0]);
        expect(insns[16]).to.equal(jumps[1]);
    });

    it('doWhileLoopWithContinue', function () {
        let insns = compileMainSnippet("let a = 5;" +
            "do { a = 1; continue; } while (a < 1);");
        let lhs = new VReg();
        let labelPre = new Label();
        let labelCond = new Label();
        let labelPost = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            // body
            labelPre,
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(1), 'a'),
            new Jmp(labelCond), // continue
            // condition
            labelCond,
            new Tryldglobalbyname(new Imm(2), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Less(new Imm(3), lhs),
            new Jeqz(labelPost),
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ]

        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check continue jumps to the expected instruction
        let jmp = <Jmp>insns[5];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[6]);
    });

    it('doWhileLoopWithBreak', function () {
        let insns = compileMainSnippet("let a = 5;" +
            "do { a = 1; break; } while (a < 1);");
        let lhs = new VReg();
        let labelPre = new Label();
        let labelPost = new Label();
        let labelCond = new Label();
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let expected = [
            new Ldai(new Imm(5)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            //body
            labelPre,
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(1), 'a'),
            new Jmp(labelPost), // break
            // condition
            labelCond,
            new Tryldglobalbyname(new Imm(2), 'a'),
            new Sta(lhs),
            new Ldai(new Imm(1)),
            new Less(new Imm(3), lhs),
            new Jeqz(labelPost),
            new Jmp(labelPre),
            labelPost,
            new Returnundefined()
        ]

        // check the instruction kinds are the same as we expect
        expect(checkInstructions(insns, expected)).to.be.true;
        // check continue jumps to the expected instruction
        let jmp = <Jmp>insns[5];
        let targetLabel = (jmp).getTarget();
        expect(targetLabel).to.equal(insns[13]);
    });
});