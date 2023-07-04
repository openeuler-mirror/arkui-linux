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


var array1: number[] = [1, 2, 3, 4];
array1[3] = 5;


interface Interface1 {
    foo: number,
    bar: string,
}
interface Interface2 {
    foo: number,
    bar: string,
    foobar: Interface1
}
var a1: Interface2;
var b1: Interface1;
a1.foo = 2;
a1.bar = "bar";
b1.foo = a1.foo;
b1.bar = a1.bar;
a1.foobar = b1;
a1.foobar.foo = 3;
a1.foobar.bar = "foo";



interface Interface3 {
    foo: number[]
}
var a2: Interface3;
a2.foo[2] = 5;



interface Interface4 {
    foo : {bar: number}
}
var a3: Interface4;
a3.foo.bar = 3;


interface Interface5 {
    foo : {foobar: number}
}
interface Interface6 {
    bar: Interface5[]
}
var a4: Interface6;
a4.bar[0].foo.foobar = 3;


interface Interface6 {
    a: ({bar: string} | {bar: number})
}
interface Interface7 {
    foo : Interface6[]
}
interface Interface8 {
    bar : Interface7;
}
var a5: Interface8;
a5.bar.foo[0].a.bar = 5;
a5.bar.foo[0].a.bar = "foo";
var a6: Interface8;
a6.bar.foo[1].a.bar = a5.bar.foo[0].a.bar;


interface Interface9 {
    a: number,
    b: string,
    c: number,
}
interface Interface10 extends Interface9 {
    d: number
}
var obj13: Interface10;
obj13.a = 5;
obj13.b = "foo";
obj13.c = 5;
obj13.d = 5;
var obj14: { a: number[] | [string, string, string], b(a: number[]): string[] };
obj14.a = [1, 2, 3];
obj14.a = ["foo", "bar", "baz"];
obj14.b = function (a: (number[])) { return ["foo", "bar", "baz"] };

interface Interface11 {
    a: number,
}

var obj15: Interface10 | Interface11;
obj15.a;

var obj16: { readonly a: { b: number } };
obj16.a.b = 3;