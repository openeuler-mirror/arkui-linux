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
import { checkInstructions, SnippetCompiler } from "./utils/base";
import {
    Createobjectwithbuffer,
    Defineclasswithbuffer,
    Returnundefined,
    Stmodulevar,
    ThrowUndefinedifholewithname,
    Imm,
    Lda,
    LdaStr,
    Mov,
    Sta,
    VReg,
    IRNode,
    Ldexternalmodulevar,
    Ldlocalmodulevar,
    Stobjbyname
} from "../src/irnodes";
import { CmdOptions } from '../src/cmdOptions';
import { creatAstFromSnippet } from "./utils/asthelper";
import { PandaGen } from '../src/pandagen';


describe("ExportDeclaration", function () {

    it("exportClassTest", function() {
        CmdOptions.isModules = () => {return true};
        CmdOptions.parseUserCmd([""]);
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`class C {}; export {C}`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        CmdOptions.isModules = () => {return false};
        let funcMainInsns = snippetCompiler.getGlobalInsns();
        let classReg = new VReg();
        let expected = [
            new Mov(new VReg(), new VReg()),
            new Defineclasswithbuffer(new Imm(0), "UnitTest.#1#C", "snippet_1", new Imm(0), new VReg()),
            new Sta(classReg),
            new Lda(classReg),
            new Stmodulevar(new Imm(0)),
            new Returnundefined(),
        ];
        expect(checkInstructions(funcMainInsns, expected)).to.be.true;
    });

    it("Re-exportImportVarTest", function() {
        CmdOptions.isModules = () => {return true};
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(`import a from 'test.js'; let v = a; export {a};`);
        CmdOptions.isModules = () => {return false};
        let funcMainInsns = snippetCompiler.getGlobalInsns();
        let v = new VReg();
        let expected = [
            new Ldexternalmodulevar(new Imm(0)),
            new ThrowUndefinedifholewithname("a"),
            new Sta(v),
            new Returnundefined(),
        ];
        expect(checkInstructions(funcMainInsns, expected)).to.be.true;
    });

    it("Re-exportImportVaribaleIndexTest", function() {
        CmdOptions.isModules = () => {return true};
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(
        `import { Graphics } from 'module1';
        import { graphicsAssembler as graphics } from 'module2';
        export { earcut } from 'module3';
        const graphicsAssemblerManager = {
            getAssembler(sprite) {
                return graphics;
            },
        };
        Graphics.Assembler = graphicsAssemblerManager;
        export { graphics, graphicsAssemblerManager as graphicsAssembler, };`);
        CmdOptions.isModules = () => {return false};
        IRNode.pg = new PandaGen("test", creatAstFromSnippet(""), 0, undefined);
        let funcMainInsns = snippetCompiler.getGlobalInsns();
        let graphicsAssemblerManager = new VReg();
        let v = new VReg();
        let expected = [
            new Createobjectwithbuffer(new Imm(0), "snippet_1"),
            new Sta(graphicsAssemblerManager),
            new Lda(graphicsAssemblerManager),
            new Stmodulevar(new Imm(0)),
            new Ldexternalmodulevar(new Imm(0)),
            new ThrowUndefinedifholewithname("Graphics"),
            new Sta(v),
            new Mov(graphicsAssemblerManager, v),
            new Ldlocalmodulevar(new Imm(0)),
            new Stobjbyname(new Imm(1), "Assembler", graphicsAssemblerManager),
            new Returnundefined()
        ];
        expect(checkInstructions(funcMainInsns, expected)).to.be.true;
    });
});