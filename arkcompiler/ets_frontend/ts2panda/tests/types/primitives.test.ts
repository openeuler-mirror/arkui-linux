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

describe("primitives tests in primitives.test.ts", function() {
    it("test primitives in block", function() {
        let fileNames = 'tests/types/primitives/primitives_in_block.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#num", 1],
            ["#4#bool", 2],
            ["#5#str", 4],
            ["#6#sym", 5],
            ["#7#nu", 6],
            ["#8#und", 7],
            ["#9#vd", 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 0],
                [2, 0]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test number in function", function() {
        let fileNames = 'tests/types/primitives/primitives_in_function.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.numberFunc");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#input", 1],
            ["#4#num", 1],
            ["#5#bool", 2],
            ["#6#str", 4],
            ["#7#sym", 5],
            ["#8#nu", 6],
            ["#9#und", 7],
            ["#10#vd", 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 1],
                [24, "snippet_1"],
                [2, 0]
            ],
            [
                [2, 3],
                [2, 0],
                [5, "numberFunc"],
                [2, 0],
                [2, 1],
                [25, 1],
                [25, 3]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test primitives in for", function() {
        let fileNames = 'tests/types/primitives/primitives_in_for.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#i", 0],
            ["#4#num", 1],
            ["#5#bool", 2],
            ["#6#str", 4],
            ["#7#sym", 5],
            ["#8#nu", 6],
            ["#9#und", 7],
            ["#10#vd", 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 0],
                [2, 0]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test primitives in if", function() {
        let fileNames = 'tests/types/primitives/primitives_in_if.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#num", 1],
            ["#4#bool", 2],
            ["#5#str", 4],
            ["#6#sym", 5],
            ["#7#nu", 6],
            ["#8#und", 7],
            ["#9#vd", 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 0],
                [2, 0]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test primitives in class", function() {
        let fileNames = 'tests/types/primitives/primitives_in_class.ts';
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
                [2, 7], [5, "num"], [25, 1],
                [2, 0], [2, 0], [5, "bool"],
                [25, 2], [2, 0], [2, 0], [5, "str"],
                [25, 4], [2, 0], [2, 0], [5, "sym"],
                [25, 5], [2, 0], [2, 0], [5, "nu"],
                [25, 6], [2, 0], [2, 0], [5, "und"],
                [25, 7], [2, 0], [2, 0], [5, "vd"],
                [25, 3], [2, 0], [2, 0],
                [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test primitives with only type annotations", function() {
        let fileNames = 'tests/types/primitives/primitives_only_type_annotation.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#num", 1],
            ["#4#bool", 2],
            ["#5#str", 4],
            ["#6#sym", 5],
            ["#7#nu", 6],
            ["#8#und", 7],
            ["#9#vd", 3],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 0], [2, 0]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test primitives without type annotations", function() {
        let fileNames = 'tests/types/primitives/primitives_no_type_annotation.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#num", 0],
            ["#4#bool", 0],
            ["#5#str", 0],
            ["#6#sym", 0],
            ["#7#nu", 0],
            ["#8#und", 0],
            ["#9#vd", 0],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 0], [2, 0]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });
});
