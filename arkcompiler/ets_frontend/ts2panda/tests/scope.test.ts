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
    FunctionScope,
    GlobalScope,
    LocalScope
} from "../src/scope";
import {
    GlobalVariable,
    LocalVariable,
    VarDeclarationKind
} from "../src/variable";

describe("ScopeTest", function () {
    it("test add 'none' variable to GlobalScope", function () {
        let scope = new GlobalScope();
        let variable = scope.add("x", VarDeclarationKind.NONE);
        expect(variable instanceof GlobalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add 'var' variable to GlobalScope", function () {
        let scope = new GlobalScope();
        let variable = scope.add("x", VarDeclarationKind.VAR);
        expect(variable instanceof GlobalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add 'let' variable to GlobalScope", function () {
        let scope = new GlobalScope();
        let variable = scope.add("x", VarDeclarationKind.LET);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add 'const' variable to GlobalScope", function () {
        let scope = new GlobalScope();
        let variable = scope.add("x", VarDeclarationKind.CONST);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add several variables to GlobalScope", function () {
        let scope = new GlobalScope();
        let x = scope.add("x", VarDeclarationKind.LET);
        let y = scope.add("y", VarDeclarationKind.NONE);
        let z = scope.add("z", VarDeclarationKind.LET);
    });

    it("test add 'none' variable to FunctionScope", function () {
        let globalScope = new GlobalScope();
        let scope = new FunctionScope(globalScope);
        let variable = scope.add("x", VarDeclarationKind.NONE);
        expect(variable instanceof GlobalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(globalScope);
    });

    it("test add 'var' variable to FunctionScope", function () {
        let scope = new FunctionScope();
        let variable = scope.add("x", VarDeclarationKind.VAR);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add 'let' variable to FunctionScope", function () {
        let scope = new FunctionScope();
        let variable = scope.add("x", VarDeclarationKind.LET);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add 'const' variable to FunctionScope", function () {
        let scope = new FunctionScope();
        let variable = scope.add("x", VarDeclarationKind.LET);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
    });

    it("test add several variables to FunctionScope", function () {
        let globalScope = new GlobalScope();
        let scope = new FunctionScope(globalScope);
        let x = scope.add("x", VarDeclarationKind.LET);
        let y = scope.add("y", VarDeclarationKind.NONE);
        let z = scope.add("z", VarDeclarationKind.LET);
    });

    it("test add 'none' variable to LocalScope", function () {
        let parent = new GlobalScope();
        let scope = new LocalScope(parent);
        let variable = scope.add("x", VarDeclarationKind.NONE);
        expect(variable instanceof GlobalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        let { scope: spParent, level: lvParent, v: outVariableParent } = parent.find("x");
        expect(outVariableParent === variable).to.be.true;
        expect(spParent instanceof GlobalScope).to.be.true;
    });

    it("test add 'var' variable to LocalScope", function () {
        let parent = new FunctionScope();
        let scope = new LocalScope(parent);
        let variable = scope.add("x", VarDeclarationKind.VAR);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(parent);
        let { scope: spParent, level: lvParent, v: outVariableParent } = parent.find("x");
        expect(outVariableParent === variable).to.be.true;
        expect(lvParent).to.be.equal(0);
        expect(spParent).to.be.equal(parent);
    });

    it("test add 'let' variable to LocalScope", function () {
        let parent = new FunctionScope();
        let scope = new LocalScope(parent);
        let variable = scope.add("x", VarDeclarationKind.LET);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
        let { scope: spParent, level: lvParent, v: outVariableParent } = parent.find("x");
        expect(outVariableParent === undefined).to.be.true;
    });

    it("test add 'const' variable to LocalScope", function () {
        let parent = new FunctionScope();
        let scope = new LocalScope(parent);
        let variable = scope.add("x", VarDeclarationKind.LET);
        expect(variable instanceof LocalVariable).to.be.true;
        let { scope: sp, level: lv, v: outVariable } = scope.find("x");
        expect(outVariable === variable).to.be.true;
        expect(lv).to.be.equal(0);
        expect(sp).to.be.equal(scope);
        let { scope: spParent, level: lvParent, v: outVariableParent } = parent.find("x");
        expect(outVariableParent === undefined).to.be.true;
    });

    it("test add several variables to LocalScope", function () {
        let global = new GlobalScope();
        let parent = new FunctionScope(global);
        let scope = new LocalScope(parent);
        let x = scope.add("x", VarDeclarationKind.LET);
        let y = scope.add("y", VarDeclarationKind.NONE);
        let z = scope.add("z", VarDeclarationKind.LET);
        expect(y instanceof GlobalVariable).to.be.true;
    });
    /**
     *
     *                      +-----------+
     *                      |  global   |
     *                      +-----/-----+
     *                            |
     *                      +-----\-----+
     *                      |    func1  |
     *                      +----_.-,---+
     *                        _-`    `.
     *                     _-`         `.
     *                  _-`              `.
     *           +-----`---+           +---'----+
     *           |  func21 |           | func22 |
     *           +---,.-,--+           +--------+
     *           _.-`    `.
     *        ,-`          `.
     * +----'`---+       +---'-----+
     * | func31  |       | func32  |
     * +----/----+       +---------+
     *      |
     *      |
     * +----\----+
     * |  func4  |
     * +---------+
     */
    it("test multi-scope nesting function", function () {
        let globalScope = new GlobalScope();
        let func1Scope = new FunctionScope(globalScope);
        let aV = func1Scope.add("a", VarDeclarationKind.LET);
        let bV = func1Scope.add("b", VarDeclarationKind.VAR);
        let p0 = func1Scope.addParameter("p0", VarDeclarationKind.VAR, 0);
        let p1 = func1Scope.addParameter("p1", VarDeclarationKind.VAR, 1);
        let p2 = func1Scope.addParameter("p2", VarDeclarationKind.VAR, 2);
        let localScope = new LocalScope(func1Scope);
        let func21Scope = new FunctionScope(localScope);
        let func22Scope = new FunctionScope(func1Scope);
        let func31Scope = new FunctionScope(func21Scope);
        let func32Scope = new FunctionScope(func21Scope);
        let func4Scope = new FunctionScope(func31Scope);

        aV.setLexVar(func1Scope);
        p2.setLexVar(func1Scope);
        let aFindEntry = func32Scope.find("a");
        expect(aFindEntry.v, "check a variable").to.be.equal(aV);
        expect(aFindEntry.level, "check level").to.be.equal(0);
        expect(aFindEntry.scope).to.be.equal(func1Scope);

        let p2FindEntry = func22Scope.find("p2");
        expect(p2FindEntry.v, "check p0 parameter").to.be.equal(p2);
        expect(p2FindEntry.level, "check level").to.be.equal(0);
        expect(p2FindEntry.scope).to.be.equal(func1Scope);

        expect(func1Scope.getNumLexEnv(), "func1 status").to.be.equal(2);
        expect(func21Scope.getNumLexEnv(), "func21 status").to.be.equal(0);
        expect(func22Scope.getNumLexEnv(), "func22 status").to.be.equal(0);
        expect(func31Scope.getNumLexEnv(), "func31 status").to.be.equal(0);
        expect(func32Scope.getNumLexEnv(), "func32 status").to.be.equal(0);
        expect(func4Scope.getNumLexEnv(), "func4 status").to.be.equal(0);
    });
})
