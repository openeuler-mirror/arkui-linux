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

describe("array tests in array.test.ts", function() {
    it("test array with primitives", function() {
        let fileNames = 'tests/types/array/array_primitives.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#num", shift + 1],
            ["#4#bool", shift + 2],
            ["#5#str", shift + 3],
            ["#6#sym", shift + 4],
            ["#7#nu", shift + 5],
            ["#8#und", shift + 6],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 6], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [24, "snippet_4"], [24, "snippet_5"], [24, "snippet_6"], [2, 0]
            ],
            [
                [2, 5], [25, 1]
            ],
            [
                [2, 5], [25, 2]
            ],
            [
                [2, 5], [25, 4]
            ],
            [
                [2, 5], [25, 5]
            ],
            [
                [2, 5], [25, 6]
            ],
            [
                [2, 5], [25, 7]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test array with class", function() {
        let fileNames = 'tests/types/array/array_class.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#arrayA", shift + 3],
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
                [2, 0], [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ],
            [
                [2, 5], [24, "snippet_2"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test array with multi same primitive", function() {
        let fileNames = 'tests/types/array/array_multi_same_primi.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#num1", shift + 1],
            ["#4#num2", shift + 1],
            ["#5#bool1", shift + 2],
            ["#6#bool2", shift + 2],
            ["#7#str1", shift + 3],
            ["#8#str2", shift + 3],
            ["#9#sym1", shift + 4],
            ["#10#sym2", shift + 4],
            ["#11#nu1", shift + 5],
            ["#12#nu2", shift + 5],
            ["#13#und1", shift + 6],
            ["#14#und2", shift + 6],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 6], [24, "snippet_1"], [24, "snippet_2"], [24, "snippet_3"], [24, "snippet_4"], [24, "snippet_5"], [24, "snippet_6"], [2, 0]
            ],
            [
                [2, 5], [25, 1]
            ],
            [
                [2, 5], [25, 2]
            ],
            [
                [2, 5], [25, 4]
            ],
                [
                [2, 5], [25, 5]
            ],
            [
                [2, 5], [25, 6]
            ],
            [
                [2, 5], [25, 7]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test array with multi same class", function() {
        let fileNames = 'tests/types/array/array_multi_same_class.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#A", shift + 1],
            ["#4#arrayA", shift + 3],
            ["#5#arrayB", shift + 3],
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
                [2, 0], [2, 0], [2, 0], [2, 0]
            ],
            [
                [2, 2], [24, "snippet_1"]
            ],
            [
                [2, 5], [24, "snippet_2"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test array with union", function() {
        let fileNames = 'tests/types/array/array_union.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#a", shift + 2],
            ["#4#b", shift + 2],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 2], [24, "snippet_1"], [24, "snippet_2"], [2, 0]
            ],
            [
                [2, 4], [2, 2], [25, 4], [25, 1],
            ],
            [
                [2, 5], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });

    it("test array with object", function() {
        let fileNames = 'tests/types/array/array_object.ts';
        let result = compileTsWithType(fileNames);
        let functionPg = result.snippetCompiler.getPandaGenByName("UnitTest.func_main_0");
        let locals = functionPg!.getLocals();
        // check vreg
        let extectedVRegTypePair = [
            ["#3#a", shift + 2],
        ]
        let vreg2TypeMap = createVRegTypePair(extectedVRegTypePair);
        expect(compareVReg2Type(vreg2TypeMap, locals), "check vreg typeInfo").to.be.true;

        // check liberalBuffer
        let expectedBuffValues = [
            [
                [2, 2], [24, "snippet_1"], [24, "snippet_2"], [2, 0]
            ],
            [
                [2, 6], [2, 2], [5, "element1"], [25, 1],
                [5, "element2"], [25, 4]
            ],
            [
                [2, 5], [24, "snippet_1"]
            ]
        ]
        let buff = createLiteralBufferArray(expectedBuffValues);
        expect(compareLiteralBuffer(buff, result.literalBufferArray), "check literal buffer").to.be.true;
    });
});
