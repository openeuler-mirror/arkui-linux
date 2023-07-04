/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
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
import {
    Createobjectwithexcludedkeys,
    Ldobjbyname,
    Returnundefined,
    Imm,
    Lda,
    LdaStr,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("object bindingPattern", function () {
    it('object bindingPattern intialization', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function foo() {const {_times: times, _values: values} = this;}`);
        IRNode.pg = new PandaGen(
            "foo",
            creatAstFromSnippet(`function foo() {const {_times: times, _values: values} = this;}`), 0, undefined);
        let thisArg = new VReg();
        let temp = new VReg();
        let obj = new VReg();
        let times = new VReg();
        let values = new VReg();
        let expected = [
            new Lda(thisArg),
            new Sta(temp),
            new Sta(obj),
            new Lda(obj),
            new Ldobjbyname(new Imm(0), "_times"),
            new Sta(times),
            new Lda(obj),
            new Ldobjbyname(new Imm(2), "_values"),
            new Sta(values),
            new Lda(temp),
            new Returnundefined()
        ];
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.foo");
        let insns = functionPg!.getInsns();

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('object bindingPattern has restElement', function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`function foo() {const {_times: times, ...values} = this;}`);
        IRNode.pg = new PandaGen(
            "foo",
            creatAstFromSnippet(`function foo() {const {_times: times, ...values} = this;}`), 0, undefined);
        let thisArg = new VReg();
        let temp = new VReg();
        let obj = new VReg();
        let times = new VReg();
        let values = new VReg();
        let arg = new VReg();
        let expected = [
            new Lda(thisArg),
            new Sta(temp),
            new Sta(obj),
            new Lda(obj),
            new Ldobjbyname(new Imm(0), "_times"),
            new Sta(times),
            new LdaStr("_times"),
            new Sta(arg),
            new Createobjectwithexcludedkeys(new Imm(0), obj, [arg]),
            new Sta(values),
            new Lda(temp),
            new Returnundefined()
        ];
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.foo");
        let insns = functionPg!.getInsns();

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});
