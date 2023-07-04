/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
    CompilerDriver
} from "../src/compilerDriver";
import {
    Add2,
    Definefunc,
    Inc,
    Ldlexvar,
    Newlexenv,
    Returnundefined,
    Stglobalvar,
    Sttoglobalrecord,
    Stlexvar,
    ThrowUndefinedifholewithname,
    Tonumeric,
    Trystglobalbyname,
    Imm,
    IRNode,
    Lda,
    Ldai,
    Return,
    Sta,
    VReg
} from "../src/irnodes";
import { PandaGen } from "../src/pandagen";
import { CacheExpander } from "../src/pass/cacheExpander";
import { Recorder } from '../src/recorder';
import {
    FunctionScope,
    GlobalScope,
    VariableScope
} from "../src/scope";
import {
    GlobalVariable,
    LocalVariable,
    VarDeclarationKind,
} from "../src/variable";
import { creatAstFromSnippet } from "./utils/asthelper";
import {
    checkInstructions,
    compileAllSnippet,
    SnippetCompiler
} from "./utils/base";

describe("lexenv-compile-testcase in lexenv.test.ts", function () {

    it("test CompilerDriver.scanFunctions-with-empty", function () {
        let source: string = ``;
        let sourceFile = creatAstFromSnippet(source);
        let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
        let globalScope = new GlobalScope(sourceFile);
        let recorder = new Recorder(sourceFile, globalScope, compilerDriver, false, false, true);
        recorder.record();

        expect(globalScope, "root is null!").to.not.equal(null);

        expect(globalScope.getChildVariableScope().length, "should not have any children!").to.be.equal(0);
        expect(globalScope.getParentVariableScope(), "should not have any children!").to.be.equal(null);
        expect(globalScope.getBindingNode() == sourceFile, "functionblock.node should equal to sourceFile").to.be.true;
    });

    it("test CompilerDriver.scanFunctions-with-embedded-function", function () {
        let source: string = `
      {
      function outer() {
        function innerA() {
        }
        function innerB() {
        }
      }
      }
      {

      }
      var funcExpression = function() { }
    `;
        let sourceFile = creatAstFromSnippet(source);
        let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
        let globalScope = new GlobalScope(sourceFile);
        let recorder = new Recorder(sourceFile, globalScope, compilerDriver, false, false, true);
        recorder.record();

        let children = globalScope.getChildVariableScope();
        let parent = globalScope.getParentVariableScope();
        let bindingNode = globalScope.getBindingNode();
        expect(globalScope != null, "root is null!");
        expect(children.length, "should have 2 child!").to.be.equal(2);
        expect(parent, "should not have any children!").to.be.equal(null);
        expect(bindingNode, "functionblock.root should equal to sourceFile").to.be.deep.equal(sourceFile);
        // check children
        let son0 = children[0];
        let grandchildren0 = son0.getChildVariableScope();
        let parentOfSon0 = son0.getParentVariableScope();
        let bindingNodeOfSon0 = <ts.Node>son0.getBindingNode();
        expect(grandchildren0.length == 2, "son should have two children!").to.be.true;
        expect(parentOfSon0, "son's parent should equal root!").deep.equal(globalScope);
        expect(bindingNodeOfSon0.kind, "son's parent should equal root!").deep.equal(ts.SyntaxKind.FunctionDeclaration);
        // check grandson
        let grandson0 = grandchildren0[0];
        let parentOfGrandson0 = grandson0.getParentVariableScope();
        let grandgrandchiildren0 = grandson0.getChildVariableScope();
        let bindingNodeOfGrandson0 = <ts.Node>grandson0.getBindingNode();
        expect(parentOfGrandson0).to.be.equal(son0);
        expect(grandgrandchiildren0.length).to.be.equal(0);
        expect(bindingNodeOfGrandson0.kind, "grandson0's parent should equal son0!").deep.equal(ts.SyntaxKind.FunctionDeclaration);

        let grandson1 = grandchildren0[1];
        expect(grandson1.getParentVariableScope()).to.be.equal(son0);
        expect(grandson1.getChildVariableScope().length).to.be.equal(0);
        expect((<ts.Node>grandson1.getBindingNode()).kind, "grandson1's parent should equal son0!").deep.equal(ts.SyntaxKind.FunctionDeclaration);

        let son1 = children[1];
        let grandchildren1 = son1.getChildVariableScope();
        let parentOfSon1 = son1.getParentVariableScope();
        let bindingNodeOfSon1 = <ts.Node>son1.getBindingNode();
        expect(grandchildren1.length == 0, "son1 should have two children!").to.be.true;
        expect(parentOfSon1, "son1's parent should equal root!").deep.equal(globalScope);
        expect(bindingNodeOfSon1.kind, "son1's parent should equal root!").deep.equal(ts.SyntaxKind.FunctionExpression);
    });

    it("test CompilerDriver.postorderanalysis-with-empty", function () {
        let source: string = `
    `;
        let sourceFile = creatAstFromSnippet(source);
        let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
        let globalScope = new GlobalScope(sourceFile);

        let recorder = new Recorder(sourceFile, globalScope, compilerDriver, false, false, true);
        recorder.record();
        let postOrderVariableScopes = compilerDriver.postOrderAnalysis(globalScope);

        expect(postOrderVariableScopes.length == 1, "postorder array length not correct");
        expect(postOrderVariableScopes[0]).to.be.deep.equal(globalScope);
    });

    it("test CompilerDriver.postorderanalysis-with-embedded-function", function () {
        let source: string = `
      {
      function outer() {
        function innerA() {
        }
        function innerB() {
        }
      }
      }
      var funcExt = function() { }
    `;
        let sourceFile = creatAstFromSnippet(source);
        let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
        let globalScope = new GlobalScope(sourceFile);

        let recorder = new Recorder(sourceFile, globalScope, compilerDriver, false, false, true);
        recorder.record();
        let postOrderVariableScopes = compilerDriver.postOrderAnalysis(globalScope);

        let children = globalScope.getChildVariableScope();
        expect(postOrderVariableScopes.length == 5, "postorder array length not correct");
        expect(postOrderVariableScopes[0]).to.be.deep.equal(children[0].getChildVariableScope()[0]);
        expect(postOrderVariableScopes[1]).to.be.deep.equal(children[0].getChildVariableScope()[1]);
        expect(postOrderVariableScopes[2]).to.be.deep.equal(children[0]);
        expect(postOrderVariableScopes[3]).to.be.deep.equal(children[1]);
        expect(postOrderVariableScopes[4]).to.be.deep.equal(globalScope);
    });

    /*
     * the function inherit chart, total IIFE expression
     *            +---------+
     *            | global  |
     *            +---.-----+
     *              .`   `.
     *            .`       `,
     *          .`           ',
     *  +-----`--+       +----'---+
     *  |   1    |       |   2    |
     *  +--------+       +----/---+
     *                        |
     *                        |
     *                        |
     *                    +----\---+
     *                    |    3   |
     *                    +--,.-,--+
     *                    ,-`    `.
     *                .'`         `.
     *          +----'`-+        +---'--+
     *          |   4   |        |  5   |
     *          +-------+        +------+
    */
    it("test CompilerDriver.postorderanalysis-with-IIFE", function () {
        let source: string = `
    (function (global, factory) { // 1
    } (this, (function () { 'use strict'; // 2
      Array.from = (function() { // 3
        var isCallable = function(fn) { //4
        };

        return function from(arrayLike) { //5
        };
      }());

    })))
    `;
        let sourceFile = creatAstFromSnippet(source);
        let compilerDriver = new CompilerDriver('UnitTest', 'UnitTest');
        let globalScope = new GlobalScope(sourceFile);

        let recorder = new Recorder(sourceFile, globalScope, compilerDriver, false, false, true);
        recorder.record();
        let postOrderVariableScopes = compilerDriver.postOrderAnalysis(globalScope);

        let children = globalScope.getChildVariableScope();
        let grandchildren1 = children[1].getChildVariableScope();
        expect(postOrderVariableScopes.length == 6, "postorder array length not correct");
        expect(postOrderVariableScopes[0]).to.be.deep.equal(children[0]);
        expect(postOrderVariableScopes[1]).to.be.deep.equal(grandchildren1[0].getChildVariableScope()[0]);
        expect(postOrderVariableScopes[2]).to.be.deep.equal(grandchildren1[0].getChildVariableScope()[1]);
        expect(postOrderVariableScopes[3]).to.be.deep.equal(grandchildren1[0]);
        expect(postOrderVariableScopes[4]).to.be.deep.equal(children[1]);
        expect(postOrderVariableScopes[5]).to.be.deep.equal(globalScope);
    });

    it("test loadAccFromLexEnv with local variable", function () {
        let globalScope = new GlobalScope();
        let pandaGen = new PandaGen("lexVarPassPandaGen", creatAstFromSnippet(`class C {}; export {C}`), 1, globalScope);
        let var1 = globalScope.add("var1", VarDeclarationKind.LET);
        let funcObj = globalScope.add("4funcObj", VarDeclarationKind.LET);
        funcObj!.bindVreg(new VReg());

        let pass = new CacheExpander();
        let varReg = pandaGen.getVregForVariable(var1!);

        pandaGen.loadAccFromLexEnv(ts.createNode(0), globalScope, 0, var1!);
        pass.run(pandaGen);

        // load local register to acc
        let outInsns = pandaGen.getInsns();
        let expected = [
            new Lda(varReg),
        ];

        expect(checkInstructions(outInsns, expected)).to.be.true;
    });

    it("test loadAccFromLexEnv with lex env variable", function () {
        let globalScope = new GlobalScope();
        let pandaGen = new PandaGen("lexVarPassPandaGen", creatAstFromSnippet(`class C {}; export {C}`), 1, globalScope);
        let var1 = globalScope.add("var1", VarDeclarationKind.LET);
        let funcObj = globalScope.add("4funcObj", VarDeclarationKind.LET);
        funcObj!.bindVreg(new VReg());
        let pass = new CacheExpander();

        var1!.setLexVar(globalScope);
        pandaGen.loadAccFromLexEnv(ts.createNode(0), globalScope, 0, var1!);
        pass.run(pandaGen);

        let outInsns = pandaGen.getInsns();
        let expected = [
            new Ldlexvar(new Imm(0), new Imm(0)),
            new ThrowUndefinedifholewithname("var1"),
        ];
        expect(checkInstructions(outInsns, expected)).to.be.true;
    });

    it("test storeAccFromLexEnv with local variable", function () {
        let globalScope = new GlobalScope();
        let pandaGen = new PandaGen("lexVarPassPandaGen", creatAstFromSnippet(`class C {}; export {C}`), 1, globalScope);
        let var1 = globalScope.add("var1", VarDeclarationKind.LET);
        let pass = new CacheExpander();
        let varReg = pandaGen.getVregForVariable(var1!);

        pandaGen.storeAccToLexEnv(ts.createNode(0), globalScope, 0, var1!, true);
        pass.run(pandaGen);

        // load local register to acc
        let outInsns = pandaGen.getInsns();
        let expected = [
            new Sta(varReg),
        ];

        expect(checkInstructions(outInsns, expected)).to.be.true;
    });

    it("test storeAccFromLexEnv with lex env let-variable", function () {
        let globalScope = new GlobalScope();
        let pandaGen = new PandaGen("lexVarPassPandaGen", creatAstFromSnippet(`class C {}; export {C}`), 1, globalScope);
        let var1 = globalScope.add("var1", VarDeclarationKind.LET);
        let funcObj = globalScope.add("4funcObj", VarDeclarationKind.LET);
        funcObj!.bindVreg(new VReg());

        let pass = new CacheExpander();

        var1!.setLexVar(globalScope);
        pandaGen.storeAccToLexEnv(ts.createNode(0), globalScope, 0, var1!, true);
        pass.run(pandaGen);

        let outInsns = pandaGen.getInsns();
        let valueReg = new VReg();
        let expected = [
            new Sta(valueReg),
            new Lda(valueReg),
            new Stlexvar(new Imm(0), new Imm(0)),
            new Lda(new VReg())
        ];
        expect(checkInstructions(outInsns, expected)).to.be.true;
    });

    it("test storeAccFromLexEnv with lex env const-variable", function () {
        let globalScope = new GlobalScope();
        let pandaGen = new PandaGen("lexVarPassPandaGen", creatAstFromSnippet(`class C {}; export {C}`), 1, globalScope);
        let var1 = globalScope.add("var1", VarDeclarationKind.CONST);
        let funcObj = globalScope.add("4funcObj", VarDeclarationKind.LET);
        funcObj!.bindVreg(new VReg());
        let pass = new CacheExpander();

        var1!.setLexVar(globalScope);
        pandaGen.storeAccToLexEnv(ts.createNode(0), globalScope, 0, var1!, true);
        pass.run(pandaGen);

        let outInsns = pandaGen.getInsns();
        let valueReg = new VReg();
        let expected = [
            new Sta(valueReg),
            new Lda(valueReg),
            new Stlexvar(new Imm(0), new Imm(0)),
            new Lda(valueReg)
        ];
        expect(checkInstructions(outInsns, expected)).to.be.true;
    });

    it("test lexenv variable capture in function", function () {
        let source: string = `
      var outer = 1;

      function func() {
        outer = 2;
      }
    `;

        let pandaGens = compileAllSnippet(source);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        let expected_main = [
            new Lda(new VReg()),
            new Stglobalvar(new Imm(0), "outer"),
            new Definefunc(new Imm(1), "UnitTest.func", new Imm(0)),
            new Stglobalvar(new Imm(2), "func"),
            new Ldai(new Imm(1)),
            new Stglobalvar(new Imm(3), "outer"),
            new Returnundefined()
        ];
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        let expected_func = [
            new Ldai(new Imm(2)),
            new Stglobalvar(new Imm(0), "outer"),
            new Returnundefined()
        ];

        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.func_main_0") {
                expect(checkInstructions(pg.getInsns(), expected_main)).to.be.true;
            } else if (pg.internalName == "UnitTest.func") {
                expect(checkInstructions(pg.getInsns(), expected_func)).to.be.true;
            }
        })
    });

    it("test lexenv let capture in function", function () {
        let source: string = `
      let outer = 1;

      function func() {
        outer = 2;
      }
    `;

        let passes = [new CacheExpander()];
        let pandaGens = compileAllSnippet(source, passes);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        let expected_main = [
            new Definefunc(new Imm(0), "UnitTest.func", new Imm(0)),
            new Stglobalvar(new Imm(1), "func"), // global.func = func_func_1
            new Ldai(new Imm(1)), // value = 1
            new Sttoglobalrecord(new Imm(2), "outer"),
            new Returnundefined()
        ];

        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        let expected_func = [
            new Ldai(new Imm(2)),
            // ...insnsStoreLexVar_func,
            new Trystglobalbyname(new Imm(0), "outer"),
            new Returnundefined()
        ];

        pandaGens.forEach((pg) => {
            let scope = <VariableScope>pg.getScope();
            if (pg.internalName == "UnitTest.func_main_0") {
                expect(checkInstructions(pg.getInsns(), expected_main), "check main insns").to.be.true;
                expect(scope.getNumLexEnv(), "main scope has 0 lexvar").to.be.equal(0);
                // expect(scope.hasLexEnv(), "main scope has lexenv").to.be.true;
            } else if (pg.internalName == "UnitTest.func") {

                expect(checkInstructions(pg.getInsns(), expected_func), "check func insns").to.be.true;
                expect(scope.getNumLexEnv(), "func scope has 1 lexvar").to.be.equal(0);
                // expect(scope.hasLexEnv(), "func scope has lexenv").to.be.true;
            }
        });

    });

    it("test lexenv capture in function", function () {
        let source: string = `
            var a = 1;
            function outer(a, b) {
                return function () {
                a++;
                return a + b;
                }
            }
            var fun = outer(a, 5);
            a = 3;
            func();
        `;

        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        let expect_outer: IRNode[] = [
            new Newlexenv(new Imm(2)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stlexvar(new Imm(0), new Imm(0)),
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stlexvar(new Imm(0), new Imm(1)),
            new Lda(new VReg()),
            new Definefunc(new Imm(0), "UnitTest.#1#", new Imm(0)),
            // returnStatement
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Return()
        ];

        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`class C {}; export {C}`), 0, undefined);
        let expect_anonymous = [
            new Ldlexvar(new Imm(0), new Imm(0)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Inc(new Imm(0)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stlexvar(new Imm(0), new Imm(0)),
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Tonumeric(new Imm(1)), // this is redundant load varialbe
            new Ldlexvar(new Imm(0), new Imm(0)),
            new Sta(new VReg),
            new Ldlexvar(new Imm(0), new Imm(1)),
            new Add2(new Imm(2), new VReg()),
            // returnStatement
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Return()
        ];

        let passes = [new CacheExpander()];
        let snippetCompiler = new SnippetCompiler();
        snippetCompiler.compile(source, passes);

        // check compile result!
        let outerPg = snippetCompiler.getPandaGenByName("UnitTest.outer");
        let outerScope = outerPg!.getScope();
        let outerA = outerScope!.findLocal("a");
        let outerB = outerScope!.findLocal("b");
        expect(outerA instanceof LocalVariable, "a in outer is local variable").to.be.true;
        expect(outerB instanceof LocalVariable, "b in outer is local variable").to.be.true;
        expect((<FunctionScope>outerScope).getNumLexEnv(), "number of lexvar at outer scope").to.be.equal(2);
        let anonymousPg = snippetCompiler.getPandaGenByName("UnitTest.#1#");
        let anonymousScope = anonymousPg!.getScope();
        let anonymousA = anonymousScope!.findLocal("a");
        let searchRlt = anonymousScope!.find("a");
        expect(searchRlt!.level).to.be.equal(0);
        expect(searchRlt!.scope, "a is defined in outerscope").to.be.deep.equal(outerScope);
        expect(anonymousA, "no a in anonymous function").to.be.undefined;
        let globalPg = snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let globalScope = globalPg!.getScope();
        let globalA = globalScope!.findLocal("a");
        expect(globalA instanceof GlobalVariable, "globalA is GlobalVariable").to.be.true;

        expect(checkInstructions(anonymousPg!.getInsns(), expect_anonymous), "check anonymous func ins").to.be.true;
        expect(checkInstructions(outerPg!.getInsns(), expect_outer), "check outer func ins").to.be.true;
    });
});
