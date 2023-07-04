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


interface A {
    a: number,
    b: string,
    c: boolean,
}

var a: A = { a: 1, b: "foo", c: true };

interface B extends A {
    d(a: number, b: string): number[];
}

var b: B = {
    a: 2, b: "bar", c: false, d: function (a: number, b: string) {
        return [1, 2];
    }
}


interface C1 {
    (a: number, b: number): string,
}

interface C2 {
    (a: number, b: number): string,
    (a: number, b: number): string,
    (a: number, b: number): string,
}

interface C3 extends C1 {
    (a: number, b: number): string,
    (a: number, b: number): string,
}

var c: C2;
var c: C3;

interface D4 extends D3, D2 {
    d: string[]
}

interface D1 {
    a: number
}

interface D3 {
    c: string,
}

interface D2 extends D1 {
    b: number,
}

interface D5 extends D4, D1, D3 {
    e: [number, string];
}

var d: D5 = { a: 2, b: 3, c: "bar", d: ["foo", "bar", "baz"], e: [1, "foo"] }

interface E {
    a: number,
}

interface E {
    b: string,
}

interface E {
    d: (a: number, b: string) => {}
}

var e: E = { a: 1, b: "foo", d: function (a: number, b: string) { return {} } }

interface F {
    [x: number]: string,
    [x: string]: number | string
}

var f: F = { 5: "foo", 6: "bar", a: 1, b: "baz" };

