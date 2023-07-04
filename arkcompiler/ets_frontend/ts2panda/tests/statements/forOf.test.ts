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
import { DiagnosticCode, DiagnosticError } from '../../src/diagnostic';
import {
    Callthis0,
    Createemptyarray,
    Getiterator,
    Isfalse,
    Ldobjbyname,
    Returnundefined,
    Strictnoteq,
    Throw,
    ThrowIfnotobject,
    Imm,
    Jeqz,
    Jmp,
    Label,
    Lda,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("ForOfLoopTest", function () {
    it("forOfLoopWithEmptyArray", function () {
        let insns = compileMainSnippet("for (let a of []) {}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let a = new VReg();
        let arrInstance = new VReg();
        let iterReg = new VReg();
        let nextMethodReg = new VReg();
        let resultObj = new VReg();
        let exceptionVreg = new VReg();
        let trueReg = new VReg();
        let done = new VReg();
        let value = new VReg();

        let loopStartLabel = new Label();
        let loopEndLabel = new Label();
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let isDone = new Label();

        let expected = [
            new Createemptyarray(new Imm(0)),
            new Sta(arrInstance),
            new Getiterator(new Imm(1)),
            new Sta(iterReg),
            new Lda(iterReg),
            new Ldobjbyname(new Imm(2), "next"),
            new Sta(nextMethodReg),

            new Lda(new VReg()),
            new Sta(done),

            tryBeginLabel,
            new Lda(trueReg),
            new Sta(done),
            loopStartLabel,
            new Lda(nextMethodReg),
            new Callthis0(new Imm(4), iterReg),
            new Sta(resultObj),
            new ThrowIfnotobject(resultObj),
            new Lda(resultObj),
            new Ldobjbyname(new Imm(5), "done"),
            new Isfalse(),
            new Jeqz(loopEndLabel),
            new Lda(resultObj),
            new Ldobjbyname(new Imm(7), "value"),
            new Sta(value),

            new Lda(new VReg()),
            new Sta(done),

            new Lda(value),
            new Sta(a),
            tryEndLabel,

            new Jmp(loopStartLabel),

            catchBeginLabel,
            new Sta(exceptionVreg),
            new Lda(done),
            new Strictnoteq(new Imm(9), trueReg),
            new Jeqz(isDone),
            new Lda(iterReg),
            new Ldobjbyname(new Imm(10), "return"),
            new Sta(nextMethodReg),
            new Strictnoteq(new Imm(12), new VReg()),
            new Jeqz(isDone),
            new Lda(nextMethodReg),
            new Callthis0(new Imm(13), iterReg),
            isDone,
            new Lda(exceptionVreg),
            new Throw(),

            loopEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => (item instanceof Jmp || item instanceof Jeqz));

        expect(jumps.length).to.equal(4);
    });

    it("forOfLoopWithContinue", function () {
        let insns = compileMainSnippet("for (let a of []) {continue;}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let a = new VReg();
        let arrInstance = new VReg();
        let resultObj = new VReg();
        let trueReg = new VReg();
        let iterReg = new VReg();
        let exceptionVreg = new VReg();
        let nextMethodReg = new VReg();
        let done = new VReg();
        let value = new VReg();

        let loopStartLabel = new Label();
        let loopEndLabel = new Label();
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let isDone = new Label();
        let insertedtryBeginLabel = new Label();
        let insertedtryEndLabel = new Label();

        let expected = [
            new Createemptyarray(new Imm(0)),
            new Sta(arrInstance),
            new Getiterator(new Imm(1)),
            new Sta(iterReg),
            new Lda(iterReg),
            new Ldobjbyname(new Imm(2), "next"),
            new Sta(nextMethodReg),

            new Lda(new VReg()),
            new Sta(done),

            tryBeginLabel,
            new Lda(trueReg),
            new Sta(done),
            loopStartLabel,
            new Lda(nextMethodReg),
            new Callthis0(new Imm(4), iterReg),
            new Sta(resultObj),
            new ThrowIfnotobject(resultObj),
            new Lda(resultObj),
            new Ldobjbyname(new Imm(5), "done"),
            new Isfalse(),
            new Jeqz(loopEndLabel),
            new Lda(resultObj),
            new Ldobjbyname(new Imm(7), "value"),
            new Sta(value),

            new Lda(new VReg()),
            new Sta(done),

            new Lda(value),
            new Sta(a),

            insertedtryBeginLabel,
            insertedtryEndLabel,
            new Jmp(loopStartLabel),

            tryEndLabel,

            new Jmp(loopStartLabel),

            catchBeginLabel,
            new Sta(exceptionVreg),
            new Lda(done),
            new Strictnoteq(new Imm(9), trueReg),
            new Jeqz(isDone),
            new Lda(iterReg),
            new Ldobjbyname(new Imm(10), "return"),
            new Sta(nextMethodReg),
            new Strictnoteq(new Imm(12), new VReg()),
            new Jeqz(isDone),
            new Lda(nextMethodReg),
            new Callthis0(new Imm(13), iterReg),
            isDone,
            new Lda(exceptionVreg),
            new Throw(),

            loopEndLabel,
            new Returnundefined()
        ];
        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => (item instanceof Jmp || item instanceof Jeqz));

        expect(jumps.length).to.equal(5);
    });

    it("forOfLoopWithBreak", function () {
        let insns = compileMainSnippet("for (let a of []) {break;}");
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let a = new VReg();
        let arrInstance = new VReg();
        let resultObj = new VReg();
        let exceptionVreg = new VReg();
        let iterReg = new VReg();
        let trueReg = new VReg();
        let nextMethodReg = new VReg();
        let done = new VReg();
        let value = new VReg();
        let loopStartLabel = new Label();
        let loopEndLabel = new Label();
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let isDone = new Label();
        let noReturn = new Label();
        let insertedtryBeginLabel = new Label();
        let insertedtryEndLabel = new Label();

        let expected = [
            new Createemptyarray(new Imm(0)),
            new Sta(arrInstance),
            new Getiterator(new Imm(1)),
            new Sta(iterReg),
            new Lda(iterReg),
            new Ldobjbyname(new Imm(2), "next"),
            new Sta(nextMethodReg),

            new Lda(new VReg()),
            new Sta(done),

            tryBeginLabel,
            new Lda(trueReg),
            new Sta(done),
            loopStartLabel,
            new Lda(nextMethodReg),
            new Callthis0(new Imm(4), iterReg),
            new Sta(resultObj),
            new ThrowIfnotobject(resultObj),
            new Lda(resultObj),
            new Ldobjbyname(new Imm(5), "done"),
            new Isfalse(),
            new Jeqz(loopEndLabel),
            new Lda(resultObj),
            new Ldobjbyname(new Imm(7), "value"),
            new Sta(value),

            new Lda(new VReg()),
            new Sta(done),

            new Lda(value),
            new Sta(a),

            insertedtryBeginLabel,
            new Lda(iterReg),
            new Ldobjbyname(new Imm(9), "return"),
            new Sta(nextMethodReg),
            new Strictnoteq(new Imm(11), new VReg()), // undefined
            new Jeqz(noReturn),
            new Lda(nextMethodReg),
            new Callthis0(new Imm(12), iterReg),
            new Sta(new VReg()),
            new ThrowIfnotobject(new VReg()),
            noReturn,
            insertedtryEndLabel,
            new Jmp(loopEndLabel),

            tryEndLabel,

            new Jmp(loopStartLabel),

            catchBeginLabel,
            new Sta(exceptionVreg),
            new Lda(done),
            new Strictnoteq(new Imm(13), trueReg),
            new Jeqz(isDone),
            new Lda(iterReg),
            new Ldobjbyname(new Imm(14), "return"),
            new Sta(nextMethodReg),
            new Strictnoteq(new Imm(16), new VReg()),
            new Jeqz(isDone),
            new Lda(nextMethodReg),
            new Callthis0(new Imm(17), iterReg),
            isDone,
            new Lda(exceptionVreg),
            new Throw(),

            loopEndLabel,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;

        let jumps = insns.filter(item => (item instanceof Jmp || item instanceof Jeqz));

        expect(jumps.length).to.equal(6);
    });

    it("ForOf SyntaxError", function () {
        let source: string = `for ([(x, y)] of []) {}`;
        let errorThrown = false;
        try {
            compileMainSnippet(source);
        } catch (err) {
            expect(err instanceof DiagnosticError).to.be.true;
            expect((<DiagnosticError>err).code).to.equal(DiagnosticCode.Property_destructuring_pattern_expected);
            errorThrown = true;
        }
        expect(errorThrown).to.be.true;
    });
});
