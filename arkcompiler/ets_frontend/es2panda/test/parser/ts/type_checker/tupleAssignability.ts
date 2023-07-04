/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var tuple1: [] = [];
var tuple2: [[[]]] = [[[]]];
var tuple3: [number, number, number] = [1, 2, 3];
var tuple4: [typeof tuple1, string] = [[], "foo"];
var tuple5: [[a: number, b?: string], [boolean | string, number[]]] = [[1], ["foo", [1, 2, 3]]];

var tuple6: [number] | [string] = [5];
var tuple7: [number, string] | number | string = [5, "foo"];
var tuple8: (boolean | { a: number, b: string })[] | [string, number | string] = [false, { a: 5, b: "foo" }];

var tuple9: [number, string | number, boolean | string];
var tuple10: [number, string, string];
var tuple11: [a: number, b: number | string, c: boolean];
var tuple12: [a: number, b: string, c: boolean, d?: any];
var tuple13: [a?: number, b?: number, c?: number];

tuple9 = tuple10;
tuple9 = tuple11;
tuple9 = tuple12;
tuple11 = tuple12;
tuple13 = tuple1;
tuple13 = tuple13;

var tuple14 = [[1, 2], func1(1, "foo"), true] as [a?: [number, number], b?: [a: number, b?: boolean[]], c?: boolean];
tuple14 = [];
tuple14 = [[1, 2]];
tuple14 = [[3, 4], [5]];
tuple14 = [[6, 7], [8, [true, false]]];
tuple14 = [[9, 10], [11, [true, false]], true];

function func1(a: number, b: string): [a: number, b?: boolean[]] {
    var tuple15: [number];
    tuple15 = [123];
    return tuple15;
}

var tuple16: [typeof tuple10, typeof tuple1, number];

function func2(a: typeof tuple16, b?: [number, boolean]): [typeof func2, string] {
    return [func2, "foo"];
}

var tuple17 = func2([[1, "foo", "bar"], [], 2]);
var tuple18 = func2([[3, "baz", "qux"], [], 4], [5, true]);

var a: string = tuple17[1];
var b: typeof func2 = tuple18[0];
b([[1, "foo", "bar"], [], 2]);

var tuple19: [number, string] | [number, string];
var tuple20: [a: string, b: number, c?: boolean];
var tuple21: number | typeof tuple20 | [a: string, b: number];
var tuple22: [number, string];
tuple21 = tuple20;
tuple19 = tuple22;

var tuple23: [number, number, number] | [number, number, number, number];
tuple23 = [1, 2, 3];
tuple23 = [1, 2, 3, 4];

var tuple24: number[][] | string[][] | [[number, number], [string, string]];
tuple24 = [[1, 2, 3]];
tuple24 = [[1, 2], ["foo", "bar"]];
tuple24 = [["foo", "bar", "baz"]];

var tuple25: number[] | [string, string] | number;
tuple25 = [1, 2, 3, 4, 5];
tuple25 = ["foo", "bar"];
tuple25 = 12;
