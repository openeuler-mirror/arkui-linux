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
import {
    compileTsWithType,
    createLiteralBufferArray,
    compareLiteralBuffer,
    createVRegTypePair,
    compareVReg2Type
} from "./typeUtils";
import { userDefinedTypeStartIndex } from '../../src/base/typeSystem';

let shift = userDefinedTypeStartIndex;

describe("class tests in class.test.ts", function () {
    it("test class with no parameter in block", function () {
        let fileNames = 'tests/types/class/class_constr_no_para.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#a", shift + 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 3], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 1], [5, "num"], [25, 1], [2, 0],
                [2, 0], [2, 1], [5, "constructor"],
                [24, "snippet_2"], [2, 0], [2, 0]
            ],
            [
                [2, 3], [2, 0],
                [5, "constructor"], [2, 0],
                [2, 0], [25, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test class with parameter in block", function () {
        let fileNames = 'tests/types/class/class_constr_para.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#a", shift + 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 3], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 1], [5, "num"], [25, 1], [2, 0],
                [2, 0], [2, 1], [5, "constructor"],
                [24, "snippet_2"], [2, 0], [2, 0]
            ],
            [
                [2, 3], [2, 0], [5, "constructor"],
                [2, 0], [2, 1], [25, 1], [25, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test class fields type", function () {
        let fileNames = 'tests/types/class/class_fields.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#a", shift + 2],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 2], [24, "snippet_1"], [24, "snippet_2"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 4], [5, "num1"], [25, 1],
                [2, 0], [2, 0], [5, "str1"],
                [25, 4], [2, 1], [2, 0],
                [5, "num2"], [25, 1], [2, 2],
                [2, 0], [5, "str2"], [25, 4],
                [2, 0], [2, 1], [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test class methods type", function () {
        let fileNames = 'tests/types/class/class_methods.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#a", shift + 4],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 4], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [24, "snippet_4"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 1], [5, "val"], [25, 1],
                [2, 0], [2, 0], [2, 2],
                [5, "setVal"], [24, "snippet_2"],
                [5, "getValStr"], [24, "snippet_3"],
                [2, 0], [2, 0],
            ],
            [
                [2, 3], [2, 0], [5, "setVal"],
                [2, 0], [2, 1], [25, 1], [25, 0]
            ],
            [
                [2, 3], [2, 0], [5, "getValStr"],
                [2, 0], [2, 0], [25, 4]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test class static fields type", function () {
        let fileNames = 'tests/types/class/class_static_fields.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#a", shift + 2],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 2], [24, "snippet_1"], [24, "snippet_2"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 2], [5, "num1"], [25, 1],
                [2, 0], [2, 0], [5, "str1"],
                [25, 4], [2, 1], [2, 0], [2, 0],
                [2, 2], [5, "num2"], [25, 1],
                [2, 0], [2, 0], [5, "str2"],
                [25, 4], [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test class static methods type", function () {
        let fileNames = 'tests/types/class/class_static_methods.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#1#num", 1],
            ["#3#A", shift + 1],
            ["#4#a", shift + 4],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 4], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [24, "snippet_4"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 1], [5, "val"], [25, 1],
                [2, 0], [2, 0], [2, 1], [5, "setVal"],
                [24, "snippet_2"], [2, 1], [5, "str"],
                [25, 4], [2, 0], [2, 0], [2, 1],
                [5, "getStr"], [24, "snippet_3"]
            ],
            [
                [2, 3], [2, 0], [5, "setVal"],
                [2, 0], [2, 1], [25, 1], [25, 0]
            ],
            [
                [2, 3], [2, 4], [5, "getStr"],
                [2, 0], [2, 0], [25, 4]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test abstract class type", function () {
        let fileNames = 'tests/types/class/class_abstract.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#animal", shift + 1],
            ["#4#dog", shift + 3],
            ["#5#d", shift + 5],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 5], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [24, "snippet_4"], [24, "snippet_5"], [2, 0]
            ],
            [
                [2, 1], [2, 1], [25, 0], [2, 0],
                [2, 0], [2, 1], [5, "eat"], [24, "snippet_2"],
                [2, 0], [2, 0]
            ],
            [
                [2, 3], [2, 0], [5, "eat"],
                [2, 0], [2, 0], [25, 0]
            ],
            [
                [2, 1], [2, 0], [24, "snippet_1"],
                [2, 0], [2, 0], [2, 1], [5, "constructor"],
                [24, "snippet_4"], [2, 0], [2, 0]
            ],
            [
                [2, 3], [2, 0], [5, "constructor"],
                [2, 0], [2, 0], [25, 0]
            ],
            [
                [2, 2], [24, "snippet_3"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test class implements type", function () {
        let fileNames = 'tests/types/class/class_implements.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#base1", shift + 1],
            ["#4#base2", shift + 2],
            ["#5#A", shift + 3],
            ["#6#a", shift + 4],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 4], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [24, "snippet_4"], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 0], [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 0],
                [2, 0], [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 1], [2, 0], [25, 0], [2, 2],
                [24, "snippet_1"], [24, "snippet_2"], [2, 0], [2, 0],
                [2, 0], [2, 0]
            ],
            [
                [2, 2], [24, "snippet_3"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });
});
