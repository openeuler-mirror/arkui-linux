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

import {
    expect
} from 'chai';
import 'mocha';
import { CmdOptions } from '../../src/cmdOptions';
import {
    Returnundefined,
    Stglobalvar,
    Tryldglobalbyname,
    Imm,
    Lda,
    Mov,
    Sta,
    Defineclasswithbuffer,
    Sttoglobalrecord,
    Newobjrange,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("CommaListExpression", function () {
    it("computedPropertyName", function () {
        CmdOptions.parseUserCmd([""]);
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(" \
        class Test { \
            #filed1; \
            #filed2; \
            #filed3; \
            #filed4; \
            #filed5; \
            #filed6; \
            #filed7; \
            #filed8; \
            #filed9; \
            #filed10; \
            #filed11; \
        } \
        ",
        "test.ts");
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(" \
        class Test { \
            #filed1; \
            #filed2; \
            #filed3; \
            #filed4; \
            #filed5; \
            #filed6; \
            #filed7; \
            #filed8; \
            #filed9; \
            #filed10; \
            #filed11; \
        } \
        "), 0, undefined);
        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Mov(new VReg(), new VReg()),
            new Defineclasswithbuffer(new Imm(0), "UnitTest.#1#Test", "test_1", new Imm(0), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sttoglobalrecord(new Imm(1), "Test"),
            new Tryldglobalbyname(new Imm(2), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(3), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(5), '_filed1#a'),
            new Tryldglobalbyname(new Imm(6), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(7), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(9), '_filed2#b'),
            new Tryldglobalbyname(new Imm(10), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(11), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(13), '_filed3#c'),
            new Tryldglobalbyname(new Imm(14), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(15), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(17), '_filed4#d'),
            new Tryldglobalbyname(new Imm(18), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(19), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(21), '_filed5#e'),
            new Tryldglobalbyname(new Imm(22), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(23), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(25), '_filed6#f'),
            new Tryldglobalbyname(new Imm(26), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(27), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(29), '_filed7#g'),
            new Tryldglobalbyname(new Imm(30), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(31), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(33), '_filed8#h'),
            new Tryldglobalbyname(new Imm(34), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(35), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(37), '_filed9#i'),
            new Tryldglobalbyname(new Imm(38), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(39), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(41), '_filed10#j'),
            new Tryldglobalbyname(new Imm(42), 'WeakMap'),
            new Sta(new VReg()),
            new Newobjrange(new Imm(43), new Imm(1), [new VReg()]),
            new Stglobalvar(new Imm(45), '_filed11#k'),
            new Returnundefined()
        ]
        expect(checkInstructions(insns, expected)).to.be.true;
    });

});
