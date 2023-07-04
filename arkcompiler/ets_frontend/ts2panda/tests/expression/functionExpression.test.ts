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
import { DiagnosticCode, DiagnosticError } from '../../src/diagnostic';
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';
import {
    Add2,
    Asyncfunctionawaituncaught,
    Asyncfunctionenter,
    Asyncfunctionreject,
    Asyncfunctionresolve,
    Callarg0,
    Creategeneratorobj,
    Createiterresultobj,
    Definefunc,
    Eq,
    Getresumemode,
    Resumegenerator,
    Returnundefined,
    Suspendgenerator,
    Throw,
    Ldfunction,
    Imm,
    Jeqz,
    Label,
    Lda,
    Ldai,
    Return,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { CacheExpander } from '../../src/pass/cacheExpander';
import { checkInstructions, compileAllSnippet } from "../utils/base";

describe("compileFunctionExpression", function () {
    it("FunctionExpression with name", function () {
        let source: string = `
        var a = function test() {
            test();
        }`;
        let passes = [new CacheExpander()];
        let pandaGens = compileAllSnippet(source, passes);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected_func = [
            new Ldfunction(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callarg0(new Imm(0)),
            new Returnundefined()
        ];

        let checkCount = 0;
        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.test") {
                expect(checkInstructions(pg.getInsns(), expected_func), "check func insns").to.be.true;
                checkCount++;
            }
        });

        expect(checkCount).to.equals(1);
    });

    it("FunctionExpression without name", function () {
        let source: string = `
        var a = function () {
        }`;

        let pandaGens = compileAllSnippet(source);

        let checkCount = 0;
        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.a") {
                checkCount++;
            }

            if (pg.internalName == "UnitTest.func_main_0") {

                pg.getInsns().forEach((insns) => {
                    if (insns instanceof Definefunc) {
                        expect(insns.operands[1]).to.equal('UnitTest.a');
                        checkCount++;
                    }
                });
            }
        });

        expect(checkCount).to.equals(2);
    });

    it("FunctionExpression without name in binary expression", function () {
        let source: string = `
        var a;
        a = function () {
        }`;

        let pandaGens = compileAllSnippet(source);

        let checkCount = 0;
        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.a") {
                checkCount++;
            }

            if (pg.internalName == "UnitTest.func_main_0") {

                pg.getInsns().forEach((insns) => {
                    if (insns instanceof Definefunc) {
                        expect(insns.operands[1]).to.equal('UnitTest.a');
                        checkCount++;
                    }
                });
            }
        });

        expect(checkCount).to.equals(2);
    });


    it("ArrowFunction", function () {
        let source: string = `
        var a = ()=> {
        }`;
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let pandaGens = compileAllSnippet(source);
        let checkCount = 0;

        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.a") {
                checkCount++;
            }

            if (pg.internalName == "UnitTest.func_main_0") {

                pg.getInsns().forEach((insns) => {
                    if (insns instanceof Definefunc) {
                        expect(insns.operands[1]).to.equal('UnitTest.a');
                        checkCount++;
                    }
                });
            }
        });

        expect(checkCount).to.equals(2);
    });

    it("ArrowFunctionWithExpression", function () {
        let source: string = `
        var p = (x, y) => x + y;`;

        let pandaGens = compileAllSnippet(source);
        let checkCount = 0;
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected_func = [
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Add2(new Imm(0), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Return()
        ];

        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.p") {
                expect(checkInstructions(pg.getInsns(), expected_func), "check arrow func insns").to.be.true;
                checkCount++;
            }

            if (pg.internalName == "UnitTest.func_main_0") {

                pg.getInsns().forEach((insns) => {
                    if (insns instanceof Definefunc) {
                        expect(insns.operands[1]).to.equal('UnitTest.p');
                        checkCount++;
                    }
                });
            }
        });

        expect(checkCount).to.equals(2);
    });

    it("ArrowFunctionSyntaxError", function () {
        let source: string = `
            var af = x
                => {};`;
        let errorThrown = false;
        try {
            compileAllSnippet(source);
        } catch (err) {
            expect(err instanceof DiagnosticError).to.be.true;
            expect((<DiagnosticError>err).code).to.equal(DiagnosticCode.Line_terminator_not_permitted_before_arrow);
            errorThrown = true;
        }
        expect(errorThrown).to.be.true;
    });

    it("GeneratorFunction", function () {
        let source: string = `
            function* a() {
                yield 1;
            }`;

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let notRetLabel0 = new Label();
        let notThrowLabel0 = new Label();
        let notRetLabel1 = new Label();
        let notThrowLabel1 = new Label();

        let expected_func = [
            new Creategeneratorobj(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Suspendgenerator(new VReg()),
            new Lda(new VReg()),
            new Resumegenerator(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Getresumemode(),
            new Sta(new VReg()),

            new Ldai(new Imm(0)),
            new Eq(new Imm(0), new VReg()),
            new Jeqz(notRetLabel0),
            new Lda(new VReg()),
            new Return(),

            notRetLabel0,
            new Ldai(new Imm(1)),
            new Eq(new Imm(1), new VReg()),
            new Jeqz(notThrowLabel0),
            new Lda(new VReg()),
            new Throw(),

            notThrowLabel0,
            new Lda(new VReg()),
            new Ldai(new Imm(1)),
            new Sta(new VReg()),
            new Createiterresultobj(new VReg(), new VReg()),
            new Suspendgenerator(new VReg()),
            new Lda(new VReg()),
            new Resumegenerator(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Getresumemode(),
            new Sta(new VReg()),

            new Ldai(new Imm(0)),
            new Eq(new Imm(2), new VReg()),
            new Jeqz(notRetLabel1),
            new Lda(new VReg()),
            new Return(),

            notRetLabel1,
            new Ldai(new Imm(1)),
            new Eq(new Imm(3), new VReg()),
            new Jeqz(notThrowLabel1),
            new Lda(new VReg()),
            new Throw(),

            notThrowLabel1,
            new Lda(new VReg()),
            new Returnundefined()
        ];

        let pandaGens = compileAllSnippet(source);
        let checkCount = 0;

        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.a") {
                expect(checkInstructions(pg.getInsns(), expected_func), "check generator func insns").to.be.true;
                checkCount++;
            }

            if (pg.internalName == "UnitTest.func_main_0") {
                pg.getInsns().forEach((insns) => {
                    if (insns instanceof Definefunc) {
                        expect(insns.operands[1]).to.equal('UnitTest.a');
                        checkCount++;
                    }
                });
            }
        });

        expect(checkCount).to.equals(2);
    });

    it("AsyncFunction", function () {
        let source: string = `
            async function a() {
                await 1;
            }`;

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let beginLabel = new Label();
        let endLabel = new Label();
        let nextLabel = new Label();

        let expected_func = [
            new Asyncfunctionenter(),
            new Sta(new VReg()),
            beginLabel,
            new Ldai(new Imm(1)),
            new Asyncfunctionawaituncaught(new VReg()),
            new Suspendgenerator(new VReg()),
            new Lda(new VReg()),
            new Resumegenerator(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Getresumemode(),
            new Sta(new VReg()),
            new Ldai(new Imm(1)),
            new Eq(new Imm(0), new VReg()),
            new Jeqz(nextLabel),
            new Lda(new VReg()),
            new Throw(),
            nextLabel,
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Asyncfunctionresolve(new VReg()),
            new Return(),
            endLabel,
            new Asyncfunctionreject(new VReg()),
            new Return(),
        ];

        let pandaGens = compileAllSnippet(source);
        let checkCount = 0;

        pandaGens.forEach((pg) => {
            if (pg.internalName == "UnitTest.a") {
                pg.getInsns().forEach(ins => {
                    console.log(ins.toString());
                })
                expect(checkInstructions(pg.getInsns(), expected_func), "check async func insns").to.be.true;
                checkCount++;
            }

            if (pg.internalName == "UnitTest.func_main_0") {
                pg.getInsns().forEach((insns) => {
                    if (insns instanceof Definefunc) {
                        expect(insns.operands[1]).to.equal('UnitTest.a');
                        checkCount++;
                    }
                });
            }
        });

        expect(checkCount).to.equals(2);
    });

    it("FunctionWithRestParameterSyntaxError", function () {
        let source: string = `function func(...a,)`;
        let errorThrown = false;
        try {
            compileAllSnippet(source);
        } catch (err) {
            expect(err instanceof DiagnosticError).to.be.true;
            expect((<DiagnosticError>err).code).to.equal(DiagnosticCode.A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma);
            errorThrown = true;
        }
        expect(errorThrown).to.be.true;
    });
})
