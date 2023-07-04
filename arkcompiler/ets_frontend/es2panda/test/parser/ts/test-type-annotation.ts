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


// Test basic types
var a: number;
var b: string;
var c: boolean;
var d: void;
var e: null;
var f: undefined;
var g: unknown;
var h: never;
var i: any;
var j: bigint;
var k: object;

// Test array type
var l: number[];
var m: string[][];
var n: unknown[] | 5n[];

// Test union type
var o: (number | string)[] | true | ((undefined[] | unknown)[] | "foo")[];
var p: (number | string)[] | (number | string)[];
var q: ((number | number)[] | (number | number)[]) | string;

// Test parenthesized type
var r: ((((number))))[];
var s: ((string | boolean) | (5 | true)) | (void);

// Test function type
var func1: (a: number, b: string) => number;
var func2: (a: number[] | string, b?: 5) => number | string;
var func3: (f: (a: number, b: string) => number[], [a, b]: number[]) => (a: number, b: boolean) => true;

// Test constructor type
var ctor1: new (a: number, b: string) => number;
var ctor2: new (a: number[] | string, b?: 5) => number | string;
var ctor3: new (f: (a: number, b: string) => number[], [a, b]: number[]) => (a: number, b: boolean) => true;
var ctor4: abstract new (a: number, b: string) => number;
var ctor5: abstract new (a: number[] | string, b?: 5) => number | string;
var ctor6: abstract new (f: (a: number, b: string) => number[], [a, b]: number[]) => (a: number, b: boolean) => true;