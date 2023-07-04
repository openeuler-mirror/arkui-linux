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
    Getunmappedargs,
    Ldobjbyindex,
    Returnundefined,
    Imm,
    Lda,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("arguments Keyword", function () {
    it('arguments: Array-like object accessible inside functions', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function foo(a,b) {arguments[0];}`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`function foo(a,b) {arguments[0];}`), 0, undefined);
        let argumentsReg = new VReg();
        let temp1 = new VReg();
        let expected = [
            new Getunmappedargs(),
            new Sta(argumentsReg),
            new Lda(argumentsReg),
            new Sta(temp1),
            new Lda(temp1),
            new Ldobjbyindex(new Imm(0), new Imm(0)),
            new Returnundefined()
        ];
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.foo");
        let insns = functionPg!.getInsns();

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('arguments as parameter shadows keyword', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function foo(arguments) {arguments[0];}`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`function foo(arguments) {arguments[0];}`), 0, undefined);
        let parameterArguments = new VReg();
        let temp1 = new VReg();
        let expected = [
            new Getunmappedargs(),
            new Sta(new VReg()),
            new Lda(parameterArguments),
            new Sta(temp1),
            new Lda(temp1),
            new Ldobjbyindex(new Imm(0), new Imm(0)),
            new Returnundefined()
        ];
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.foo");
        let insns = functionPg!.getInsns();

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
