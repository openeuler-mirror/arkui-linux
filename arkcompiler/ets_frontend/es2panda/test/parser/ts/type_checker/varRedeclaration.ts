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


var a: any;
var a: any;

var b: number;
var b: number;

var c: number | string;
var c: string | number;

var d: { a: number, b: string };
var d: { b: string, a: number };

var e: (a: number, b: (string | number)[]) => void;
var e: (a: number, b: (string | number)[]) => void;

var f: { a: number, b: string } | { a: number[], b?: string };
var f: { a: number, b: string } | { a: number[], b?: string };

interface interface1 {
    a: number,
    b: string,
}

interface interface2 {
    a: number,
    b: string,
}

var g: interface1;
var g: interface2;

interface interface3 extends interface1 {
    c: boolean,
}

interface interface4 extends interface2 {
    c: boolean,
}

var h: interface3;
var h: interface4;

interface interface5 {
    (a: number, b: string): number,
    (a: number, b: string): string,
    new(a: number[], b: { a: number, b: string }): boolean,
    new(a: number[], b: { a: number, b: string }): void,
}

interface interface6 {
    (a: number, b: string): number,
    (a: number, b: string): string,
    new(a: number[], b: { a: number, b: string }): void,
    new(a: number[], b: { a: number, b: string }): boolean,
}

var i: interface5;
var i: interface6;

var j = function (a: interface6, b: number[]): number {
    return 123;
}
var j: (a: interface6, b: number[]) => number;

var obj = { a: 1, b: 2, c: 3 };
var k = { d: "foo", e: "bar", ...obj };
var k: { a: number, b: number, c: number, d: string, e: string };

function func1(a: number, b: string): "foo" {
    return "foo";
}
function func2(a: string, b: number): true {
    return true;
}
var l: typeof func1 | typeof func2;
var l: ((a: number, b: string) => "foo") | ((a: string, b: number) => true)

var m: [a: number, b: string, c: boolean];
var m: [number, string, boolean];

var n: number[] | [1, 2, 3];
var n: [1, 2, 3] | number[];

interface interface7 {
    a: number,
}

interface interface8 extends interface7 {
    a: number,
}

interface interface9 {
    a: number;
}

var o: interface9;
var o: interface8;

var p: { a: number, b: string };
var p: typeof p;
