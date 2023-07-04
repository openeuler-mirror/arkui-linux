/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

import { expect } from 'chai';
import 'mocha';
import * as ts from "typescript";
import {
    Callrange,
    Returnundefined,
    Imm,
    IRNode,
    Jmp,
    Label,
    Ldai,
    Lda,
    Ldglobalvar,
    Mov,
    Sta,
    Throw,
    VReg
} from "../src/irnodes";
import { PandaGen } from "../src/pandagen";
import { CacheExpander } from "../src/pass/cacheExpander";
import { RegAlloc } from "../src/regAllocator";
import { basicChecker, checkInstructions, compileAllSnippet, SnippetCompiler } from "./utils/base";
import { creatAstFromSnippet } from "./utils/asthelper";

function checkRegisterNumber(left: IRNode, right: IRNode): boolean {
    if (!basicChecker(left, right)) {
        return false;
    }
    let lo = left.operands;
    let ro = right.operands;
    if (lo.length !== ro.length) {
        return false;
    }
    for (let i = 0; i < lo.length; ++i) {
        let l = lo[i];
        let r = ro[i];
        if (l instanceof VReg && r instanceof VReg) {
            if (!((<VReg>l).num == (<VReg>r).num)) {
                return false;
            }
        }
    }
    return true;
}
describe("RegAllocator", function () {
    it("make spill for Dst register & Src register", function () {
        let string = "function test() {";
        for (let i = 0; i < 256; ++i) {
            string += "let a" + i + " = " + i + ";";
        }
        string += "a255;}";

        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(string, [new CacheExpander(), new RegAlloc()]);
        let insns = snippetCompiler.getPandaGenByName("UnitTest.test").getInsns();

        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        IRNode.pg.updateIcSize(0);

        let v = [];
        for (let i = 0; i < 260; ++i) {
            v[i] = new VReg();
            v[i].num = i;
        }

        let expected: IRNode[] = [
            new Ldai(new Imm(252)),
            new Sta(v[0]),
            new Mov(v[256], v[0]),
            new Ldai(new Imm(253)),
            new Sta(v[0]),
            new Mov(v[257], v[0]),
            new Ldai(new Imm(254)),
            new Sta(v[0]),
            new Mov(v[258], v[0]),
            new Ldai(new Imm(255)),
            new Sta(v[0]),
            new Mov(v[259], v[0]),
            // load a255
            new Mov(v[0], v[259]),
            new Lda(v[0]),
            new Returnundefined()
        ]

        expect(checkInstructions(insns.slice(insns.length - 15), expected, checkRegisterNumber)).to.be.true;
    });

    it("make spill for SrcDst register", function () {
        /* the only possible instruction whose operand register type could be SrcDstVReg is INCI,
         * but we do not use it at all by now
         */
        expect(true).to.be.true;
    });

    it("make spill for CalliRange", function () {
        /* since the bitwidth for CalliRange source register is 16 now, we do not need to make spill at all.
           but in case later 16 might be changed to 8, then spill operation will be needed in some cases. this testcase is designed
           for 8bits constraints.
        */
        let string = "function test() {";
        for (let i = 0; i < 256; ++i) {
            string += "let a" + i + " = " + i + ";";
        }
        string += "test(a252, a253, a254, a255);}";

        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(string, [new CacheExpander(), new RegAlloc()]);
        let insns = snippetCompiler.getPandaGenByName("UnitTest.test").getInsns();

        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        IRNode.pg.updateIcSize(0);
        let v = [];
        for (let i = 0; i < 268; ++i) {
            v[i] = new VReg();
            v[i].num = i;
        }
        let expected = [
            new Ldai(new Imm(252)),
            new Sta(v[0]),
            new Mov(v[259], v[0]),
            new Ldai(new Imm(253)),
            new Sta(v[0]),
            new Mov(v[260], v[0]),
            new Ldai(new Imm(254)),
            new Sta(v[0]),
            new Mov(v[261], v[0]),
            new Ldai(new Imm(255)),
            new Sta(v[0]),
            new Mov(v[262], v[0]),
            new Ldglobalvar(new Imm(0), "test"),
            new Sta(v[0]),
            new Mov(v[263], v[0]),
            // call test with [a252, a253, a254, a255]
            new Mov(v[0], v[259]),
            new Lda(v[0]),
            new Sta(v[0]),
            new Mov(v[264], v[0]),
            new Mov(v[0], v[260]),
            new Lda(v[0]),
            new Sta(v[0]),
            new Mov(v[265], v[0]),
            new Mov(v[0], v[261]),
            new Lda(v[0]),
            new Sta(v[0]),
            new Mov(v[266], v[0]),
            new Mov(v[0], v[262]),
            new Lda(v[0]),
            new Sta(v[0]),
            new Mov(v[267], v[0]),
            new Mov(v[0], v[263]),
            new Lda(v[0]),
            new Mov(v[0], v[264]),
            new Mov(v[1], v[265]),
            new Mov(v[2], v[266]),
            new Mov(v[3], v[267]),
            new Callrange(new Imm(1), new Imm(4), [v[0], v[1], v[2], v[3]]),
            new Returnundefined(),
        ];

        expect(checkInstructions(insns.slice(insns.length - 39), expected, checkRegisterNumber)).to.be.true;
    });

    it("make spill for control-flow change", function () {
        let string = "function test() {";
        for (let i = 0; i < 256; ++i) {
            string += "let a" + i + " = " + i + ";";
        }
        string += `try { throw a0; } catch { a0 }};`;

        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(string, [new CacheExpander(), new RegAlloc()]);
        let insns = snippetCompiler.getPandaGenByName("UnitTest.test").getInsns();

        IRNode.pg = new PandaGen("", creatAstFromSnippet(""), 0, undefined);
        IRNode.pg.updateIcSize(0);
        let v = [];
        for (let i = 0; i < 261; ++i) {
            v[i] = new VReg();
            v[i].num = i;
        }
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let catchEndLabel = new Label();

        let expected = [
            new Ldai(new Imm(252)),
            new Sta(v[0]),
            new Mov(v[256], v[0]),
            new Ldai(new Imm(253)),
            new Sta(v[0]),
            new Mov(v[257], v[0]),
            new Ldai(new Imm(254)),
            new Sta(v[0]),
            new Mov(v[258], v[0]),
            new Ldai(new Imm(255)),
            new Sta(v[0]),
            new Mov(v[259], v[0]),
            tryBeginLabel,
            new Lda(v[4]),
            new Throw(),
            tryEndLabel,
            new Jmp(catchEndLabel),
            catchBeginLabel,
            new Lda(v[4]),
            catchEndLabel,
            new Returnundefined(),
        ];

        expect(checkInstructions(insns.slice(insns.length - 21), expected, checkRegisterNumber)).to.be.true;
    });

    it("VReg sequence of CalliDynRange is not continuous", function () {
        let pandaGen = new PandaGen('', creatAstFromSnippet(""), 0);
        let para1 = pandaGen.getTemp();
        let para2 = pandaGen.getTemp();
        let para3 = pandaGen.getTemp();
        let para4 = pandaGen.getTemp();
        let para5 = pandaGen.getTemp();
        let para6 = pandaGen.getTemp();

        pandaGen.call(ts.createNode(0), [para1, para2, para3, para4, para5, para6], false);

        pandaGen.freeTemps(para1, para3, para2);

        try {
            new RegAlloc().run(pandaGen);
        } catch (err) {
            expect(true).to.be.true;
            return;
        }
        expect(true).to.be.false;
    });

    it("VReg sequence of DynRange is not continuous", function () {
        let pandaGen = new PandaGen('', creatAstFromSnippet(""), 0);
        let para1 = pandaGen.getTemp();
        let para2 = pandaGen.getTemp();
        let para3 = pandaGen.getTemp();

        pandaGen.getInsns().push(new Callrange(new Imm(0), new Imm(3), [para1, para2, para3]))

        pandaGen.freeTemps(para1, para3, para2);

        try {
            new RegAlloc().run(pandaGen);
        } catch (err) {
            expect(true).to.be.true;
            return;
        }
        expect(true).to.be.false;
    });
});
