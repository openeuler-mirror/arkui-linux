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


function func1(a: number): void {

}
func1(5);

function func2(a: number): number {
    return a;
}

type callAbleObj1 = {
    (a: number): number
}

function func3(fn: callAbleObj1): number {
    return fn(5);
}

var obj1: callAbleObj1;
func1(func2(func3(obj1)));

function func4(a: number): number {
    a++;
    return a < 0 ? func4(a) : a;
}

func4(-5);
func4(0);

function func5(a: number, b: string, ...c) {
    return 5;
}

func5(1, "foo");
func5(1, "foo", 2, true, {});

function func6(a: any, b?: string[], ...c: number[]) {
    return true;
}

func6(2);
func6(false, ["foo"]);
func6({}, ["foo"], 2, 3, 4);

var func7: { (a: number, b: string): number, (...a): string };
var b: string = func7();
var c: string = func7(1);
var d: number = func7(1, "foo");

var func8: { (a?: number, ...c): boolean, (a: any, b: string[], ...c: number[]): string, (a: number, b: boolean): number };
var e: boolean = func8();
var f: boolean = func8(1);
var g: boolean = func8(2, true);
var h: boolean = func8(2, ["foo", "bar"], {});
var i: string = func8({}, ["bar"]);
var j: string = func8({}, ["bar"], 3, 4, 5);

function func9(a: number, b: string): number;
function func9(a: string, b: number): number | string;
function func9(a: number | string, b?: number | string): number | string | boolean {
    return true;
}

var k: number = func9(1, "foo");
var l: number | string = func9("bar", 2);

function func10(a: { x: number, y: string }): number[];
function func10(a: { x: string, y: number }): number[];
function func10(a: { x: number | string }) {
    return [1, 2, 3];
}

var m: number[] = func10({ x: 1, y: "foo" });
var m: number[] = func10({ x: "bar", y: 2 });
