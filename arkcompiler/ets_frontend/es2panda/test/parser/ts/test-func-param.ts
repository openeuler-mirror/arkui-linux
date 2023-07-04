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


function func1(a: number, b: string) { }
function func2(a: boolean = true, ...b: number[]) { }
function func3(a = 6, [c, d], b?) { }
function func4({ }: number, [a, b]: string[]) { }
function func5([a, b]: [number, string] = [1, "foo"]) { }
function func6({ a, b }: { a: number, b: number } = { a: 0, b: 0 }) { }
declare function func7([a, b]: [number, string])
declare function func8({ a, b }: { a: number, b: number })
declare function func9([a, b]?: [number, string])
declare function func10({ a, b }?: { a: number, b: number })

interface Interface1 {
    (a: number, { b, c }?: {
        b?: boolean;
        c?: any;
    }): string;
}