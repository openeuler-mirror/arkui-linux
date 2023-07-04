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
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';
import {
    Add2,
    Asyncfunctionawaituncaught,
    Asyncfunctionenter,
    Asyncfunctionreject,
    Asyncfunctionresolve,
    Callarg0,
    Callarg1,
    Callargs2,
    Createarraywithbuffer,
    Createemptyarray,
    Creategeneratorobj,
    Createiterresultobj,
    Createobjectwithbuffer,
    Createregexpwithliteral,
    Dec,
    Defineclasswithbuffer,
    Definefunc,
    Eq,
    Getresumemode,
    Istrue,
    Ldobjbyindex,
    Ldobjbyname,
    Neg,
    Newobjrange,
    Resumegenerator,
    Stownbyindex,
    Stricteq,
    Suspendgenerator,
    Throw,
    Tonumeric,
    Typeof,
    Fldai,
    Imm,
    Jeqz,
    Jmp,
    Label,
    Lda,
    LdaStr,
    Ldai,
    Mov,
    Return,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet, compileAllSnippet } from "../utils/base";

describe("WatchExpressions", function () {
    it("watch NumericLiteral", function () {
        let insns = compileMainSnippet(`
        a=-123.212
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Fldai(new Imm(123.212)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Neg(new Imm(0)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), 'debuggerSetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(3), new VReg(), new VReg()),

            new Return()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch StringLiteral", function () {
        let insns = compileMainSnippet(`
        y = 'He is called \'Johnny\''
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new LdaStr('He is called '),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerSetValue'),
            new Sta(new VReg()),
            new LdaStr('y'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(3), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('Johnny'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(5), new VReg(), new VReg()),
            new LdaStr(''),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch RegularExpressionLiteral", function () {
        let insns = compileMainSnippet(`
        a = /abc/
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Createregexpwithliteral(new Imm(0), 'abc', new Imm(0)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), 'debuggerSetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(3), new VReg(), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch Identifier", function () {
        let insns = compileMainSnippet(`
        _awef
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('_awef'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch TrueKeyword", function () {
        let insns = compileMainSnippet(`
        b === true
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let isTrueLabel = new Label();
        let isFalseLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('b'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stricteq(new Imm(3), new VReg()),
            new Jeqz(isTrueLabel),
            new Lda(new VReg()),
            new Jmp(isFalseLabel),
            isTrueLabel,
            new Lda(new VReg()),
            isFalseLabel,

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch FalseKeyword", function () {
        let insns = compileMainSnippet(`
        b === false
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let ifFalseLabel = new Label(); //lable0
        let ifTrueLabel = new Label();  //label1

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('b'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stricteq(new Imm(3), new VReg()),
            new Jeqz(ifFalseLabel),
            new Lda(new VReg()),
            new Jmp(ifTrueLabel),
            ifFalseLabel,
            new Lda(new VReg()), //lda. v10
            ifTrueLabel,

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch CallExpression", function () {
        let insns = compileMainSnippet(`
        BigInt(10.2)
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('BigInt'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Fldai(new Imm(10.2)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callarg1(new Imm(3), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch NullKeyword", function () {
        let insns = compileMainSnippet(`
        b === null
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let isTrueLabel = new Label();
        let isFalseLabel = new Label();
        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('b'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Stricteq(new Imm(3), new VReg()),
            new Jeqz(isTrueLabel),
            new Lda(new VReg()),
            new Jmp(isFalseLabel),
            isTrueLabel,
            new Lda(new VReg()),
            isFalseLabel,

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch ThisKeyword", function () {
        let insns = compileMainSnippet(`
        this
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('this'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch MetaProperty", function () {
        let pandaGens = compileAllSnippet(`
        function (){
            b = new.target;
        }
        `, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), "debuggerSetValue"),
            new Sta(new VReg()),
            new LdaStr("b"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),

            new Return()
        ];
        pandaGens.forEach((pg) => {
            if (pg.internalName == "#1#") {
                expect(checkInstructions(pg.getInsns(), expected)).to.be.true;
            }
        });
    });

    it("watch ArrayLiteralExpression", function () {
        let insns = compileMainSnippet(`
        [1,2]
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Createarraywithbuffer(new Imm(0), "snippet_1"),
            new Sta(new VReg()),
            new Lda(new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch ObjectLiteralExpression", function () {
        let insns = compileMainSnippet(`
        a = {key:1,value:1}
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "snippet_1"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), 'debuggerSetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(3), new VReg(), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch PropertyAccessExpression", function () {
        let insns = compileMainSnippet(`
        a.b
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(3), 'b'),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch ElementAccessExpression", function () {
        let insns = compileMainSnippet(`
        a[0]
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyindex(new Imm(3), new Imm(0)),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch NewExpression", function () {
        let insns = compileMainSnippet(`
        new Function()
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('Function'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Newobjrange(new Imm(3), new Imm(1), [new VReg()]),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch ParenthesizedExpression", function () {
        let insns = compileMainSnippet(`
        (a,b,c)
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(3), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('b'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(5), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(6), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('c'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(8), new VReg(), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch FunctionExpression", function () {
        let pandaGens = compileAllSnippet(`
        a = function () {}
        `, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Definefunc(new Imm(0), 'a', new Imm(0)),
            new Sta(new VReg),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), 'debuggerSetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(3), new VReg(), new VReg()),

            new Return()
        ];
        pandaGens.forEach((pg) => {
            if (pg.internalName == "func_main_0") {
                expect(checkInstructions(pg.getInsns(), expected)).to.be.true;
            }
        });
    });

    it("watch DeleteExpression", function () {
        let insns = compileMainSnippet(`
        delete[abc]
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Createemptyarray(new Imm(0)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(1), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('abc'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(3), new VReg(), new VReg()),
            new Stownbyindex(new Imm(4), new VReg(), new Imm(0)),
            new Lda(new VReg()),
            new Lda(new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch TypeOfExpression", function () {
        let insns = compileMainSnippet(`
        typeof(a)
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Typeof(new Imm(3)),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch VoidExpression", function () {
        let insns = compileMainSnippet(`
        void doSomething()
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('doSomething'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callarg0(new Imm(3)),
            new Lda(new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch AwaitExpression", function () {
        let pandaGens = compileAllSnippet(
            `async function a(){
                await abc;
            }`, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let beginLabel = new Label();
        let endLabel = new Label();
        let nextLabel = new Label();

        let expected = [
            new Asyncfunctionenter(),
            new Sta(new VReg()),
            beginLabel,
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), "debuggerGetValue"),
            new Sta(new VReg()),
            new LdaStr('abc'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Asyncfunctionawaituncaught(new VReg()),
            new Suspendgenerator(new VReg()),
            new Lda(new VReg()),
            new Resumegenerator(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Getresumemode(),
            new Sta(new VReg()),
            new Ldai(new Imm(1)),
            new Eq(new Imm(3), new VReg()),
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

        pandaGens.forEach((pg) => {
            if (pg.internalName == "a") {
                expect(checkInstructions(pg.getInsns(), expected)).to.be.true;
            }
        });
    });

    it("watch PrefixUnaryExpression", function () {
        let insns = compileMainSnippet(`
        --a
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), "debuggerGetValue"),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Dec(new Imm(3)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(4), "debuggerSetValue"),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(6), new VReg(), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch PostfixUnaryExpression", function () {
        let insns = compileMainSnippet(`
        a--
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Dec(new Imm(3)),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(4), 'debuggerSetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(6), new VReg(), new VReg()),
            new Lda(new VReg()),
            new Tonumeric(new Imm(7)),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch BinaryExpression", function () {
        let insns = compileMainSnippet(`
        a+b
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), "debuggerGetValue"),
            new Sta(new VReg()),
            new LdaStr("a"),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(3), "debuggerGetValue"),
            new Sta(new VReg()),
            new LdaStr("b"),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(5), new VReg(), new VReg()),
            new Add2(new Imm(6), new VReg()),

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch ConditionalExpression", function () {
        let insns = compileMainSnippet(`
        a?4:2
        `, undefined, undefined, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let ifTrueLabel = new Label();
        let ifFalseLabel = new Label();

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(), new VReg()),
            new Istrue(),
            new Jeqz(ifTrueLabel),
            new Ldai(new Imm(4)),
            new Jmp(ifFalseLabel),
            ifTrueLabel,
            new Ldai(new Imm(2)),
            ifFalseLabel,

            new Return()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it("watch YieldExpression", function () {
        let pandaGens = compileAllSnippet(`
        function* func(){
            yield a;
        }`, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let startLabel = new Label();
        let thenLabel = new Label();
        let nextLabel = new Label();
        let endLabel = new Label();

        let expected = [
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
            new Jeqz(startLabel),
            new Lda(new VReg()),
            new Return(),
            startLabel,
            new Ldai(new Imm(1)),
            new Eq(new Imm(1), new VReg()),
            new Jeqz(thenLabel),
            new Lda(new VReg()),
            new Throw(),
            thenLabel,
            new Lda(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(2), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('a'),
            new Sta(new VReg()),
            new Mov(new VReg(), new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(4), new VReg(), new VReg()),
            new Sta(new VReg()),
            new Createiterresultobj(new VReg(),new VReg()),
            new Suspendgenerator(new VReg()),
            new Lda(new VReg()),
            new Resumegenerator(),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Getresumemode(),
            new Sta(new VReg()),
            new Ldai(new Imm(0)),
            new Eq(new Imm(5), new VReg()),
            new Jeqz(nextLabel),
            new Lda(new VReg()),
            new Return(),
            nextLabel,
            new Ldai(new Imm(1)),
            new Eq(new Imm(6), new VReg()),
            new Jeqz(endLabel),
            new Lda(new VReg()),
            new Throw(),
            endLabel,
            new Lda(new VReg()),

            new Return()
        ];

        pandaGens.forEach((pg) => {
            if (pg.internalName == "func") {
                expect(checkInstructions(pg.getInsns(), expected)).to.be.true;
            }
        });
    });

    it("watch ArrowFunction", function () {
        let pandaGens = compileAllSnippet(`
        a => b.length
        `, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(0), 'debuggerGetValue'),
            new Sta(new VReg()),
            new LdaStr('b'),
            new Sta(new VReg()),
            new Mov(new VReg(),new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(2), new VReg(),new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(3), 'length'),
            new Sta(new VReg()),
            new Lda(new VReg()),

            new Return()
        ];

        pandaGens.forEach((pg) => {
            if (pg.internalName == "#1#") {
                expect(checkInstructions(pg.getInsns(), expected)).to.be.true;
            }
        });
    });

    it("watch ClassExpression", function () {
        let pandaGens = compileAllSnippet(`
        a = new class{};
        `, undefined, undefined, true);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);

        let expected = [
            new Mov(new VReg(), new VReg()),
            new Defineclasswithbuffer(new Imm(0), "#1#", "snippet_1", new Imm(0), new VReg()),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Sta(new VReg()),
            new Newobjrange(new Imm(1), new Imm(1), [new VReg()]),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Ldobjbyname(new Imm(2), "debuggerSetValue"),
            new Sta(new VReg()),
            new LdaStr("a"),
            new Sta(new VReg()),
            new Lda(new VReg()),
            new Callargs2(new Imm(4), new VReg(), new VReg()),

            new Return()
        ];
        pandaGens.forEach((pg) => {
            if (pg.internalName == "func_main_0") {
                expect(checkInstructions(pg.getInsns(), expected)).to.be.true;
            }
        });
    });
});
