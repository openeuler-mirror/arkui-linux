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
    Createregexpwithliteral,
    Sttoglobalrecord,
    Imm,
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";

describe("Regular Expression", function () {
    it("let a = /abc/;", function () {
        let insns = compileMainSnippet("let a = /abc/;");
        insns = insns.slice(0, insns.length - 1);

        let expected = [
            new Createregexpwithliteral(new Imm(0), "abc", new Imm(0)),
            new Sttoglobalrecord(new Imm(1), 'a')
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("let a = /abc/i;", function () {
        let insns = compileMainSnippet("let a = /abc/i;");
        insns = insns.slice(0, insns.length - 1);

        let expected = [
            new Createregexpwithliteral(new Imm(0), "abc", new Imm(2)),
            new Sttoglobalrecord(new Imm(1), 'a')
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});