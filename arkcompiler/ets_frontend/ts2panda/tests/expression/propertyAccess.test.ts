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
    Createobjectwithbuffer,
    Definegettersetterbyvalue,
    Definemethod,
    Ldobjbyname,
    Stobjbyname,
    Tryldglobalbyname,
    Imm,
    Lda,
    Ldai,
    LdaStr,
    Mov,
    Sta,
    VReg,
    IRNode
} from "../../src/irnodes";
import { checkInstructions, compileAllSnippet, compileMainSnippet } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";
import { PandaGen } from '../../src/pandagen';

describe("PropertyAccess", function () {
    it('get obj.property', function () {
        let insns = compileMainSnippet(`let obj;
                                obj.property;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let obj;
        obj.property;`), 0, undefined);
        IRNode.pg.updateIcSize(1);

        let objReg = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(1), 'obj'),
            new Sta(objReg),
            new Lda(objReg),
            new Ldobjbyname(new Imm(2), "property")
        ];

        insns = insns.slice(2, insns.length - 1); // cut off let obj and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('set obj.property', function () {
        let insns = compileMainSnippet(`let obj;
                                obj.property = 0;`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let obj;
        obj.property;`), 0, undefined);
        IRNode.pg.updateIcSize(1);
        let objReg = new VReg();
        let tempObj = new VReg();

        let expected = [
            new Tryldglobalbyname(new Imm(1), 'obj'),
            new Sta(tempObj),
            new Mov(objReg, tempObj),
            new Ldai(new Imm(0)),
            new Stobjbyname(new Imm(2), "property", objReg),
        ];

        insns = insns.slice(2, insns.length - 1); // cut off let obj and return.
        expect(checkInstructions(insns, expected)).to.be.true;
    });

    it('SetAccessor', function () {
        let compilerunit = compileAllSnippet(`
            let obj = {
                set myMethod (arg) {
                    this.a = arg;
                }
            }`);
        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`
        let obj = {
            set myMethod (arg) {
                this.a = arg;
            }
        }`), 0, undefined);

        let objInstance = new VReg();
        let funcReg = new VReg();
        let propReg = new VReg();

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "_0"),
            new Sta(objInstance),
            new Lda(new VReg()),
            new Definemethod(new Imm(1), "myMethod", new Imm(1)),
            new Sta(funcReg),
            new LdaStr("myMethod"),
            new Sta(propReg),
            new Lda(new VReg()),
            new Definegettersetterbyvalue(objInstance, propReg, new VReg(), funcReg),
        ];

        compilerunit.forEach(element => {
            if (element.internalName == "func_main_0") {
                let insns = element.getInsns();

                insns = insns.slice(0, insns.length - 3);
                expect(checkInstructions(insns, expected)).to.be.true;
            }

            if (element.internalName == "myMethod") {
                let parameterLength = element.getParameterLength();
                expect(parameterLength == 1).to.be.true;
            }
        });
    });

    it('GetAccessor', function () {
        let compilerunit = compileAllSnippet(`
            let obj = {
                get a() { return 'a'; },
            }`);

        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`
        let obj = {
            get a() { return 'a'; },
        }`), 0, undefined);

        let objInstance = new VReg();
        let funcReg = new VReg();
        let propReg = new VReg();

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "_0"),
            new Sta(objInstance),
            new Lda(new VReg()),
            new Definemethod(new Imm(1), "a", new Imm(0)),
            new Sta(funcReg),
            new LdaStr("a"),
            new Sta(propReg),
            new Lda(new VReg()),
            new Definegettersetterbyvalue(objInstance, propReg, funcReg, new VReg()),
        ];

        compilerunit.forEach(element => {
            if (element.internalName == "func_main_0") {
                let insns = element.getInsns();

                insns = insns.slice(0, insns.length - 3);
                expect(checkInstructions(insns, expected)).to.be.true;
            }
        });
    });

    it('GetAccessor&SetAccessor', function () {
        let compilerunit = compileAllSnippet(`let obj = {
            get a() { return 'a'; },
            set a(x) {}
        }`);

        IRNode.pg = new PandaGen("foo", creatAstFromSnippet(`let obj = {
            get a() { return 'a'; },
            set a(x) {}
        }`), 0, undefined);

        let objInstance = new VReg();
        let getterReg = new VReg();
        let setterReg = new VReg();
        let propReg = new VReg();

        let expected = [
            new Createobjectwithbuffer(new Imm(0), "_0"),
            new Sta(objInstance),
            new Lda(new VReg()),
            new Definemethod(new Imm(1), "#1#a", new Imm(0)),
            new Sta(getterReg),
            new Lda(new VReg()),
            new Definemethod(new Imm(2), "#2#a", new Imm(1)),
            new Sta(setterReg),
            new LdaStr("a"),
            new Sta(propReg),
            new Lda(new VReg()),
            new Definegettersetterbyvalue(objInstance, propReg, getterReg, setterReg),
        ];

        compilerunit.forEach(element => {
            if (element.internalName == "func_main_0") {
                let insns = element.getInsns();

                insns = insns.slice(0, insns.length - 3);
                expect(checkInstructions(insns, expected)).to.be.true;
            }
        });
    });
});
