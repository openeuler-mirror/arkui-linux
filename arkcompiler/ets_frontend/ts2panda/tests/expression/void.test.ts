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
    Tryldglobalbyname,
    Lda,
    VReg,
    Imm,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("voidExpressionTest", function () {
    it("void (a)", function () {
        let insns = compileMainSnippet("let a; void (a);");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("let a; void (a);"), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(0), 'a'),
            new Tryldglobalbyname(new Imm(1), 'a'),
            new Lda(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});