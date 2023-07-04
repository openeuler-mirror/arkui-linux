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
    Callthis1,
    Callthis2,
    Callthis3,
    Createemptyarray,
    Gettemplateobject,
    Ldobjbyname,
    Returnundefined,
    Stobjbyvalue,
    Tryldglobalbyname,
    Imm,
    IRNode,
    Lda,
    Ldai,
    LdaStr,
    Mov,
    Sta,
    VReg
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

function MicroCreateAddInsns(leftVal: number, rightVal: number, icSize: number) {
    let insns = [];
    let lhs = new VReg();

    insns.push(new Ldai(new Imm(leftVal)));
    insns.push(new Sta(lhs));
    insns.push(new Ldai(new Imm(rightVal)));
    insns.push(new Add2(new Imm(icSize), lhs));

    let nextIc = icSize + 1;

    return {insns: insns, nextIc: nextIc};
}

function MicroCreateObjAndPropInsns(icSize: number) {
    let insns = [];
    let obj = new VReg();
    let val = new VReg();

    insns.push(new Tryldglobalbyname(new Imm(icSize), "String"));
    insns.push(new Sta(obj));
    insns.push(new Lda(obj));
    insns.push(new Ldobjbyname(new Imm(icSize + 1), "raw"));
    insns.push(new Sta(val));

    let nextIc = icSize + 3;

    return {insns: insns, nextIc: nextIc};
}

function MicroGetTemplateObject(rawArr: VReg, cookedArr: VReg, icSize: number) {
    let insns = [];
    let objReg = new VReg();
    let indexReg = new VReg();

    insns.push(new Createemptyarray(new Imm(icSize)));
    insns.push(new Sta(objReg));

    insns.push(new Ldai(new Imm(0)));
    insns.push(new Sta(indexReg));
    insns.push(new Lda(rawArr));
    insns.push(new Stobjbyvalue(new Imm(icSize + 1), objReg, indexReg));
    insns.push(new Ldai(new Imm(1)));
    insns.push(new Sta(indexReg));
    insns.push(new Lda(cookedArr));
    insns.push(new Stobjbyvalue(new Imm(icSize + 3), objReg, indexReg));
    insns.push(new Lda(objReg));
    insns.push(new Gettemplateobject(new Imm(icSize + 5)));

    let nextIc = icSize + 6;
    return {insns: insns, nextIc: nextIc};

}

describe("templateExpressionTest", function () {
    it("`string text line 1`", function () {
        let insns = compileMainSnippet("`string text line 1`;");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("`string text line 1`;"), 0, undefined);
        let expected = [
            new LdaStr("string text line 1"),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("`Fifteen is ${5 + 10}`", function () {
        let insns = compileMainSnippet("`Fifteen is ${5 + 10}`");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("`Fifteen is ${5 + 10}`"), 0, undefined);
        let headVal = new VReg();
        let followedIc = 1;

        let expected = [
            new LdaStr("Fifteen is "),
            new Sta(headVal),
            new Ldai(new Imm(5)),
            new Sta(new VReg()),
            new Ldai(new Imm(10)),
            new Add2(new Imm(0), new VReg()),
            new Add2(new Imm(followedIc), headVal),
            new Returnundefined()
        ]

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("String.raw`string text line 1`", function () {
        let insns = compileMainSnippet("String.raw`string text line 1`;");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("String.raw`string text line 1`;"), 0, undefined);
        let obj = new VReg();
        let prop = new VReg();
        let elemIdxReg = new VReg();
        let rawArr = new VReg();
        let cookedArr = new VReg();
        let rawArr1 = new VReg();
        let cookedArr1 = new VReg();
        let templateObj = new VReg();

        let followedIc1 = 3;
        let followedIc2 = 15;
        let expected = [
            new Tryldglobalbyname(new Imm(0), "String"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), "raw"),
            new Sta(new VReg()),
            new Createemptyarray(new Imm(followedIc1)),
            new Sta(rawArr),
            new Createemptyarray(new Imm(followedIc1 + 1)),
            new Sta(cookedArr),

            new Ldai(new Imm(0)),
            new Sta(elemIdxReg),
            new LdaStr("string text line 1"),
            new Stobjbyvalue(new Imm(followedIc1 + 2), rawArr, elemIdxReg),

            new LdaStr("string text line 1"),
            new Stobjbyvalue(new Imm(followedIc1 + 4), cookedArr, elemIdxReg),
            new Mov(rawArr1, rawArr),
            new Mov(cookedArr1, cookedArr),

            new Createemptyarray(new Imm(9)),
            new Sta(new VReg()),
            new Ldai(new Imm(0)),
            new Sta(new VReg()),
            new Lda(rawArr),
            new Stobjbyvalue(new Imm(10), new VReg(), new VReg()),
            new Ldai(new Imm(1)),
            new Sta(new VReg()),
            new Lda(cookedArr),
            new Stobjbyvalue(new Imm(12), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Gettemplateobject(new Imm(14)),
            new Sta(templateObj),

            // structure call
            new Lda(prop),
            new Callthis1(new Imm(followedIc2), new VReg(), new VReg()),

            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("String.raw`string text line 1\\nstring text line 2`", function () {
        let insns = compileMainSnippet("String.raw`string text line 1\\nstring text line 2`;");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("String.raw`string text line 1\\nstring text line 2`;"), 0, undefined);
        let prop = new VReg();
        let elemIdxReg = new VReg();
        let rawArr = new VReg();
        let cookedArr = new VReg();
        let rawArr1 = new VReg();
        let cookedArr1 = new VReg();
        let templateObj = new VReg();

        let followedIc1 = 3;
        let followedIc2 = 15;

        let expected = [
            new Tryldglobalbyname(new Imm(0), "String"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), "raw"),
            new Sta(new VReg()),
            new Createemptyarray(new Imm(followedIc1)),
            new Sta(rawArr),
            new Createemptyarray(new Imm(followedIc1 + 1)),
            new Sta(cookedArr),

            new Ldai(new Imm(0)),
            new Sta(elemIdxReg),
            new LdaStr("string text line 1\\nstring text line 2"),
            new Stobjbyvalue(new Imm(followedIc1 + 2), rawArr, elemIdxReg),

            new LdaStr("string text line 1\nstring text line 2"),
            new Stobjbyvalue(new Imm(followedIc1 + 4), cookedArr, elemIdxReg),
            new Mov(rawArr1, rawArr),
            new Mov(cookedArr1, cookedArr),

            new Createemptyarray(new Imm(9)),
            new Sta(new VReg()),
            new Ldai(new Imm(0)),
            new Sta(new VReg()),
            new Lda(rawArr),
            new Stobjbyvalue(new Imm(10), new VReg(), new VReg()),
            new Ldai(new Imm(1)),
            new Sta(new VReg()),
            new Lda(cookedArr),
            new Stobjbyvalue(new Imm(12), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Gettemplateobject(new Imm(14)),
            new Sta(templateObj),

            // structure call
            new Lda(prop),
            new Callthis1(new Imm(followedIc2), new VReg(), new VReg()),

            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("String.raw`Fifteen is ${5 + 10} !!`", function () {
        let insns = compileMainSnippet("String.raw`Fifteen is ${5 + 10} !!`");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("String.raw`Fifteen is ${5 + 10} !!`"), 0, undefined);
        let obj = new VReg();
        let prop = new VReg();
        let elemIdxReg = new VReg();
        let rawArr = new VReg();
        let cookedArr = new VReg();
        let rawArr1 = new VReg();
        let cookedArr1 = new VReg();
        let addRet = new VReg();
        let templateObj = new VReg();

        let followedIc1 = 3;
        let followedIc2 = 19;
        let followedIc3 = 20;
        let expected = [
            new Tryldglobalbyname(new Imm(0), "String"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), "raw"),
            new Sta(new VReg()),

            new Createemptyarray(new Imm(followedIc1)),
            new Sta(rawArr),
            new Createemptyarray(new Imm(followedIc1 + 1)),
            new Sta(cookedArr),

            new Ldai(new Imm(0)),
            new Sta(elemIdxReg),
            new LdaStr("Fifteen is "),
            new Stobjbyvalue(new Imm(followedIc1 + 2), rawArr, elemIdxReg),
            new LdaStr("Fifteen is "),
            new Stobjbyvalue(new Imm(followedIc1 + 4), cookedArr, elemIdxReg),
            new Ldai(new Imm(1)),
            new Sta(elemIdxReg),
            new LdaStr(" !!"),
            new Stobjbyvalue(new Imm(followedIc1 + 6), rawArr, elemIdxReg),
            new LdaStr(" !!"),
            new Stobjbyvalue(new Imm(followedIc1 + 8), cookedArr, elemIdxReg),
            new Mov(rawArr1, rawArr),
            new Mov(cookedArr1, cookedArr),

            new Createemptyarray(new Imm(13)),
            new Sta(new VReg()),
            new Ldai(new Imm(0)),
            new Sta(new VReg()),
            new Lda(rawArr),
            new Stobjbyvalue(new Imm(14), new VReg(), new VReg()),
            new Ldai(new Imm(1)),
            new Sta(new VReg()),
            new Lda(cookedArr),
            new Stobjbyvalue(new Imm(16), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Gettemplateobject(new Imm(18)),

            new Sta(templateObj),

            new Ldai(new Imm(5)),
            new Sta(new VReg()),
            new Ldai(new Imm(10)),
            new Add2(new Imm(followedIc2), new VReg()),

            new Sta(addRet),

            // structure call
            new Lda(prop),
            new Callthis2(new Imm(followedIc3), new VReg(), new VReg(), new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("String.raw`Fifteen is ${5 + 10} !!\\n Is not ${15 + 10} !!!`", function () {
        let insns = compileMainSnippet("String.raw`Fifteen is ${5 + 10} !!\\n Is not ${15 + 10} !!!\\n`");
        IRNode.pg = new PandaGen("", creatAstFromSnippet("String.raw`Fifteen is ${5 + 10} !!\\n Is not ${15 + 10} !!!\\n`"), 0, undefined);
        let obj = new VReg();
        let prop = new VReg();
        let elemIdxReg = new VReg();
        let rawArr = new VReg();
        let cookedArr = new VReg();
        let rawArr1 = new VReg();
        let cookedArr1 = new VReg();
        let addRet1 = new VReg();
        let addRet2 = new VReg();
        let templateObj = new VReg();

        let followedIc1 = 3;
        let followedIc2 = 23;
        let followedIc3 = 24;
        let followedIc4 = 25;
        let expected = [
            new Tryldglobalbyname(new Imm(0), "String"),
            new Sta(obj),
            new Lda(obj),
            new Ldobjbyname(new Imm(1), "raw"),
            new Sta(new VReg()),

            new Createemptyarray(new Imm(followedIc1)),
            new Sta(rawArr),
            new Createemptyarray(new Imm(followedIc1 + 1)),
            new Sta(cookedArr),

            new Ldai(new Imm(0)),
            new Sta(elemIdxReg),
            new LdaStr("Fifteen is "),
            new Stobjbyvalue(new Imm(followedIc1 + 2), rawArr, elemIdxReg),
            new LdaStr("Fifteen is "),
            new Stobjbyvalue(new Imm(followedIc1 + 4), cookedArr, elemIdxReg),
            new Ldai(new Imm(1)),
            new Sta(elemIdxReg),
            new LdaStr(" !!\\n Is not "),
            new Stobjbyvalue(new Imm(followedIc1 + 6), rawArr, elemIdxReg),
            new LdaStr(" !!\n Is not "),
            new Stobjbyvalue(new Imm(followedIc1 + 8), cookedArr, elemIdxReg),
            new Ldai(new Imm(2)),
            new Sta(elemIdxReg),
            new LdaStr(" !!!\\n"),
            new Stobjbyvalue(new Imm(followedIc1 + 10), rawArr, elemIdxReg),
            new LdaStr(" !!!\n"),
            new Stobjbyvalue(new Imm(followedIc1 + 12), cookedArr, elemIdxReg),
            new Mov(rawArr1, rawArr),
            new Mov(cookedArr1, cookedArr),

            new Createemptyarray(new Imm(17)),
            new Sta(new VReg()),
            new Ldai(new Imm(0)),
            new Sta(new VReg()),
            new Lda(rawArr),
            new Stobjbyvalue(new Imm(18), new VReg(), new VReg()),
            new Ldai(new Imm(1)),
            new Sta(new VReg()),
            new Lda(cookedArr),
            new Stobjbyvalue(new Imm(20), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Gettemplateobject(new Imm(22)),
            new Sta(templateObj),

            new Ldai(new Imm(5)),
            new Sta(new VReg()),
            new Ldai(new Imm(10)),
            new Add2(new Imm(followedIc2), new VReg()),
            new Sta(addRet1),
            new Ldai(new Imm(15)),
            new Sta(new VReg()),
            new Ldai(new Imm(10)),
            new Add2(new Imm(followedIc3), new VReg()),
            new Sta(addRet2),

            // structure call
            new Lda(prop),
            new Callthis3(new Imm(followedIc4), new VReg(), new VReg(), new VReg(), new VReg()),
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});