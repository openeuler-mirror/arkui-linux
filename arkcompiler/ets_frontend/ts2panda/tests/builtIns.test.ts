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
    Lda,
    VReg
} from "../src/irnodes";
import { checkInstructions, compileMainSnippet, SnippetCompiler } from "./utils/base";
import { CmdOptions } from '../src/cmdOptions';

describe("BuiltInsTest", function () {
    it("Global Value Properties", function () {
        let insns = compileMainSnippet(`NaN; Infinity; globalThis;`);
        let expected = [
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Lda(new VReg()),

            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });
});

describe("FunctionToStringTest", function () {
    it("func.toString()", function () {
        CmdOptions.needRecordSourceCode = () => {return true};
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compileAfter(`function foo() {return 123;}\nfunction bar() {return 321;}\n`, 'toStringTest.js');
        CmdOptions.needRecordSourceCode = () => {return false};
        let pandaGen = snippetCompiler.getPandaGenByName('UnitTest.foo');
        let expected = "function foo() {return 123;}";
        expect(pandaGen.getSourceCode() == expected).to.be.true;
    })
})
