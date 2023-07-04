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
    Returnundefined,
    Sttoglobalrecord,
    Strictnoteq,
    Tryldglobalbyname,
    Imm,
    Jeqz,
    Jmp,
    Jnez,
    Label,
    Lda,
    Ldai,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("switchTest", function () {
    it("single case", function () {
        let insns = compileMainSnippet("let a = 0; switch (a) {case 0 : ;}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let rhs = new VReg();
        let caseLabel = new Label();
        let switchEndLabel = new Label();
        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            // switch bodynew Imm(0),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(rhs),
            new Ldai(new Imm(0)),
            new Strictnoteq(new Imm(2), rhs),
            new Jeqz(caseLabel),
            new Jmp(switchEndLabel),
            // switch cases
            caseLabel,
            switchEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
        expect((<Jnez>insns[6]).getTarget() === insns[8]).to.be.true;
        expect((<Jmp>insns[7]).getTarget() === insns[9]).to.be.true;
    });

    it("multiple cases without break", function () {
        let insns = compileMainSnippet(`let a = 0; switch (a)
                                 {
                                  case 0 : ;
                                  case 1 : ;
                                  default : ;
                                 }`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let rhs = new VReg();
        let caseLabel_0 = new Label();
        let caseLabel_1 = new Label();
        let defaultLabel = new Label();
        let switchEndLabel = new Label();
        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            // switch body
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(rhs),
            new Ldai(new Imm(0)),
            new Strictnoteq(new Imm(2), rhs),
            new Jeqz(caseLabel_0),
            new Ldai(new Imm(1)),
            new Strictnoteq(new Imm(3), rhs),
            new Jeqz(caseLabel_1),
            new Jmp(defaultLabel),
            // cases
            caseLabel_0,
            caseLabel_1,
            // default case
            defaultLabel,
            switchEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("multiple cases with default", function () {
        let insns = compileMainSnippet(`let a = 0; switch (a)
                                 {
                                  case 0 : break;
                                  case 1 : break;
                                  default : ;
                                 }`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let rhs = new VReg();
        let caseLabel_0 = new Label();
        let caseLabel_1 = new Label();
        let defaultLabel = new Label();
        let switchEndLabel = new Label();
        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            // switch body
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(rhs),
            new Ldai(new Imm(0)),
            new Strictnoteq(new Imm(2), rhs),
            new Jeqz(caseLabel_0),
            new Ldai(new Imm(1)),
            new Strictnoteq(new Imm(3), rhs),
            new Jeqz(caseLabel_1),
            new Jmp(defaultLabel),
            // switch cases
            caseLabel_0,
            new Jmp(switchEndLabel),
            caseLabel_1,
            new Jmp(switchEndLabel),
            defaultLabel,
            switchEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("multiple cases without default", function () {
        let insns = compileMainSnippet(`let a = 0; switch (a)
                                 {
                                  case 0 : break;
                                  case 1 : break;
                                 }`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let rhs = new VReg();
        let caseLabel_0 = new Label();
        let caseLabel_1 = new Label();
        let switchEndLabel = new Label();
        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            // switch body
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(rhs),
            new Ldai(new Imm(0)),
            new Strictnoteq(new Imm(2), rhs),
            new Jeqz(caseLabel_0),
            new Ldai(new Imm(1)),
            new Strictnoteq(new Imm(3), rhs),
            new Jeqz(caseLabel_1),
            new Jmp(switchEndLabel),
            // switch cases
            caseLabel_0,
            new Jmp(switchEndLabel),
            caseLabel_1,
            new Jmp(switchEndLabel),
            switchEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("multiple cases with default surrounded by cases", function () {
        let insns = compileMainSnippet(`let a = 0; switch (a)
                                 {
                                  case 0 : break;
                                  default : ;
                                  case 1 : ;
                                 }`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let rhs = new VReg();
        let caseLabel_0 = new Label();
        let caseLabel_1 = new Label();
        let defaultLabel = new Label();
        let switchEndLabel = new Label();
        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            // switch body
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Sta(rhs),
            new Ldai(new Imm(0)),
            new Strictnoteq(new Imm(2), rhs),
            new Jeqz(caseLabel_0),
            new Ldai(new Imm(1)),
            new Strictnoteq(new Imm(3), rhs),
            new Jeqz(caseLabel_1),
            new Jmp(defaultLabel),
            // switch cases
            caseLabel_0,
            new Jmp(switchEndLabel),
            // default case
            defaultLabel,
            caseLabel_1,
            switchEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("discriminant's scope", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(
            `function test() {
                let a = 0;
                switch (a) {
                    case 0:
                        const a = 0;
                        break;
                }
            }`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let a = new VReg();
        let discriminant_a = new VReg();
        let body_a = new VReg();
        let caseLabel_0 = new Label();
        let switchEndLabel = new Label();
        let expected = [
            new Ldai(new Imm(0)),
            new Sta(a),
            // switch discriminant
            new Lda(a),
            new Sta(discriminant_a),
            // switch body
            new Ldai(new Imm(0)),
            new Strictnoteq(new Imm(1), discriminant_a),
            new Jeqz(caseLabel_0),
            new Jmp(switchEndLabel),
            // switch cases
            caseLabel_0,
            new Ldai(new Imm(0)),
            new Sta(body_a),
            new Jmp(switchEndLabel),
            switchEndLabel,
            new Returnundefined()
        ];
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.test");
        let insns = functionPg!.getInsns();

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
