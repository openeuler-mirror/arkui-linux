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
} from "../../src/irnodes";
import { PandaGen } from "../../src/pandagen";
import { LocalVariable } from "../../src/variable";
import { checkInstructions, compileMainSnippet, SnippetCompiler } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"

describe("ThisKeyword", function () {
    let pandaGen: PandaGen;

    beforeEach(function () {
        pandaGen = new PandaGen("" /* internalName */, creatAstFromSnippet(""), 0 /* number of parameters */);
    });

    it("this in global scope", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile("this");
        let globalScope = snippetCompiler.getGlobalScope();
        let insns = snippetCompiler.getGlobalInsns();
        let expected = [
            new Lda(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
        let thisVar = globalScope!.findLocal("this");
        expect(thisVar instanceof LocalVariable).to.be.true;
    });

    it("this in function scope", function () {
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile("function a() {this}");
        let functionPg = snippetCompiler.getPandaGenByName("UnitTest.a");
        let functionScope = functionPg!.getScope();
        let insns = compileMainSnippet("this;", pandaGen, functionScope);
        let expected = [
            new Lda(new VReg()),
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
        let thisVar = functionScope!.findLocal("this");
        expect(thisVar != undefined).to.be.true;
        expect(thisVar instanceof LocalVariable).to.be.true;
    });
});