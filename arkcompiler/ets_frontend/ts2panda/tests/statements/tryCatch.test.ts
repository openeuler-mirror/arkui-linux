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
    Sttoglobalrecord,
    Throw,
    Trystglobalbyname,
    Imm,
    Jmp,
    Label,
    Lda,
    Ldai,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper"
import { PandaGen } from '../../src/pandagen';

describe("TryCatch", function () {
    it('tryCatch', function () {
        let insns = compileMainSnippet(`let a = 0;
                               try {a = 1;}
                               catch {a = 2;}`);
        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let catchEndLabel = new Label();

        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            tryBeginLabel,
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(1), 'a'),
            tryEndLabel,
            new Jmp(catchEndLabel),
            catchBeginLabel,
            new Ldai(new Imm(2)),
            new Trystglobalbyname(new Imm(2), 'a'),
            catchEndLabel,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('tryCatchWithIdentifier', function () {
        let insns = compileMainSnippet(`let a = 0;
                               try {a = 1;}
                               catch(err) {a = 2;}`);

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let catchEndLabel = new Label();
        let err = new VReg();

        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            tryBeginLabel,
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(1), 'a'),
            tryEndLabel,
            new Jmp(catchEndLabel),
            catchBeginLabel,
            new Sta(err),
            new Ldai(new Imm(2)),
            new Trystglobalbyname(new Imm(2), 'a'),
            catchEndLabel,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('tryFinally', function () {
        let insns = compileMainSnippet(`let a = 0;
                               try {a = 1;}
                               finally {a = 3;}`);

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let catchEndLabel = new Label();
        let exceptionVreg = new VReg();

        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            tryBeginLabel,
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(1), 'a'),
            tryEndLabel,
            new Ldai(new Imm(3)),
            new Trystglobalbyname(new Imm(2), 'a'),
            new Jmp(catchEndLabel),
            catchBeginLabel,
            new Sta(exceptionVreg),
            new Ldai(new Imm(3)),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Lda(exceptionVreg),
            new Throw(),
            catchEndLabel,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('tryCatchFinally', function () {
        let insns = compileMainSnippet(`let a = 0;
                               try {a = 1;}
                               catch {a = 2;}
                               finally {a = 3;}`);

        IRNode.pg = new PandaGen("", creatAstFromSnippet(``), 0, undefined);
        let exceptionVreg = new VReg();
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let nestedTryBeginLabel = new Label();
        let nestedTryEndLabel = new Label();
        let nestedCatchBeginLabel = new Label();
        let nestedCatchEndLabel = new Label();
        let catchEndLabel = new Label();

        let expected = [
            new Ldai(new Imm(0)),
            new Sttoglobalrecord(new Imm(0), 'a'),
            tryBeginLabel,
            nestedTryBeginLabel,
            new Ldai(new Imm(1)),
            new Trystglobalbyname(new Imm(1), 'a'),
            nestedTryEndLabel,
            new Jmp(tryEndLabel),
            nestedCatchBeginLabel,
            new Ldai(new Imm(2)),
            new Trystglobalbyname(new Imm(2), 'a'),
            nestedCatchEndLabel,
            tryEndLabel,
            new Ldai(new Imm(3)),
            new Trystglobalbyname(new Imm(3), 'a'),
            new Jmp(catchEndLabel),
            catchBeginLabel,
            new Sta(exceptionVreg),
            new Ldai(new Imm(3)),
            new Trystglobalbyname(new Imm(4), 'a'),
            new Lda(exceptionVreg),
            new Throw(),
            catchEndLabel,
            new Returnundefined()
        ];

        expect(checkInstructions(insns, expected)).to.be.true;
    });
});