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


var obj1: { c: number };
var obj2: { a: number, b: string } | { a: number, b: string, c: number } = { a: 5, b: "foo", ...obj1 };
obj2 = { a: 2, b: "bar", c: 3 };

var obj3: {} = {};
var obj4: { a: typeof obj3, b?: { a: number, b?: string } } = { a: {}, b: { a: 5 } };
obj4 = { a: {}, b: { a: 5, b: "foo" } };
obj4 = { a: {} };

var obj5: { a: { a: number, b: string }, b: { a: boolean } } = { a: { a: 5, b: "foo" }, b: { a: true } };
var obj6: { a(a: number, b: string): number, b(): boolean };
obj6 = { a: function (a: number, b: string): number { return 12; }, b: function () { return true } };

var obj7: {} | { a: number } | { a: string, b: number } | { a: boolean, b: string, c: number };
obj7 = {};
obj7 = { a: 5 };
obj7 = { a: "foo", b: 5 };
obj7 = { a: true, b: "foo", c: 5 };

var obj8 = { ...obj6 };
obj8 = obj6;
obj8 = { a: function (a: number, b: string): number { return 12; }, b: function () { return true } };

var obj9: { 5: number, "foo": string } = { 5: 5, "foo": "foo" };

var c: number;
var d: string;
var obj10: { [x: number]: number, [y: string]: number } = { [c]: 1, [d]: 2 };

var obj11 = { get 5() { return 5; }, set "foo"(a: any) { } };
obj9 = obj11;

var obj12: { a?: number, b?: string, c?: boolean };
obj12 = {};
obj12 = { a: 5 };
obj12 = { a: 5, b: "foo" };
obj12 = { b: "foo" };
obj12 = { b: "foo", a: 5 };
obj12 = { a: 5, c: true };
obj12 = { c: false, b: "bar" };

interface interface1 {
    a: number,
    b: string,
    c: number,
}

interface interface2 extends interface1 {
    d: number
}

var obj13: interface2 = { a: 5, b: "foo", c: 5, d: 5 };
var obj14: { a: number[] | [string, string, string], b?(a: number[]): string[] } | interface2;
obj14 = obj13;
obj14 = { a: 5, b: "foo", c: 5, d: 5 };
obj14 = { a: [1, 2, 3] };
obj14 = { a: ["foo", "bar", "baz"] };
obj14 = { a: ["foo", "bar", "baz"], b: function (a: (number[])) { return ["foo", "bar", "baz"] } };

interface interface3 {
    a: number | string | boolean
}

interface interface4 extends interface3 {
    a: number
}

interface interface5 extends interface3 {
    a: string
}

interface interface6 extends interface3 {
    a: boolean
}

var obj15: interface4 | interface5 | interface6;
obj15 = { a: 5 };
obj15 = { a: "foo" };
obj15 = { a: true };
