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


function function1(a: number | string): asserts a { return };
var var1: (a: number | string) => asserts a;
interface Interface1 {
    (a: number | string): asserts a;
    (a: number | string): asserts this;
}

function function2(asserts: number | string): asserts is number { return };
var var2: (asserts: number | string) => asserts is number;
interface Interface2 {
    a: number;
    (asserts: number | string): asserts is number;
    (asserts: { a: number | string }): asserts is this;
}

function function3(is: number | string): is is number { return };
var var3: (is: number | string) => is is number;
interface Interface3 {
    a: number;
    (is: number | string): is is number;
    (is: { a: number | string }): is is this;
}

function function4(a: number | string): a is number { return };
var var4: (a: number | string) => a is number;
interface Interface4 {
    a: number;
    (a: number | string): a is number;
    (a: { a: number | string }): a is this;
}

function function5(a: number | string): asserts a is number { return };
var var5: (a: number | string) => asserts a is number;
interface Interface5 {
    a: number;
    (a: number | string): asserts a is number;
    (a: { a: number | string }): asserts a is this;
}

function function6(asserts: number | string): asserts asserts is number { return };
var var6: (asserts: number | string) => asserts asserts is number;
interface Interface6 {
    a: number;
    (asserts: number | string): asserts asserts is number;
    (asserts: { a: number | string }): asserts asserts is this;
}

type is = string | number | boolean;

function function7(is: number | string | is): is is is { return };
var var7: (is: number | string | is) => is is is;
interface Interface7 {
    (is: number | string | is): is is is;
}

function function8(string: number | string | is): string is number { return };
var var8: (string: number | string | is) => string is number;
interface Interface8 {
    a: is;
    (string: number | string | is): string is number;
    (string: { a: number | string | is }): string is this;
}

interface Interface9 {
    a: is;
    (string: { a: number | string | is }): this is this;
}