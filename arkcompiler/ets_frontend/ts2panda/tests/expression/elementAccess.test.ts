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
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';
import {
    Add2,
    Ldobjbyname,
    Ldobjbyvalue,
    Sttoglobalrecord,
    Stobjbyname,
    Tryldglobalbyname,
    Imm,
    Ldai,
    Mov,
    Sta,
    VReg,
    Lda,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";

describe("ElementAccess", function () {
    it('get obj["property"]', function () {
        let insns = compileMainSnippet(`let obj;
                                obj["property"];`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let objReg = new VReg();

        let expected = [
            new Sttoglobalrecord(new Imm(0), 'obj'),
            new Tryldglobalbyname(new Imm(1), 'obj'),
            new Sta(objReg),
            new Lda(objReg),
            new Ldobjbyname(new Imm(2), "property"),
        ];

        insns = insns.slice(1, insns.length - 1); // cut off let obj and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('set obj["property"]', function () {
        let insns = compileMainSnippet(`let obj;
                                obj["property"] = 5;`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let objReg = new VReg();
        let tempObj = new VReg();

        let expected = [
            new Sttoglobalrecord(new Imm(0), 'obj'),
            new Tryldglobalbyname(new Imm(1), 'obj'),
            new Sta(tempObj),
            new Mov(objReg, tempObj),
            new Ldai(new Imm(5)),
            new Stobjbyname(new Imm(2), "property", objReg),
        ];

        insns = insns.slice(1, insns.length - 1); // cut off let obj and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('get obj[1 + 2]', function () {
        let insns = compileMainSnippet(`let obj;
                                obj[1 + 2];`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let prop1Reg = new VReg();
        let objReg = new VReg();
        let val = new VReg();

        let expected = [
            new Sttoglobalrecord(new Imm(0), 'obj'),
            new Tryldglobalbyname(new Imm(1), 'obj'),
            new Sta(objReg),
            new Ldai(new Imm(1)),
            new Sta(prop1Reg),
            new Ldai(new Imm(2)),
            new Add2(new Imm(2), prop1Reg),
            new Sta(val),
            new Lda(val),
            new Ldobjbyvalue(new Imm(3), objReg)
        ];
        insns = insns.slice(1, insns.length - 1); // cut off let obj and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
