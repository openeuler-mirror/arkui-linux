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


var x1 : [number, string];
var x2 : [string, ...number[], string];
var x3 : [a : boolean, ...b :string[], c : number];
var x4 : [string, number?];
var x5 : [a : number, b ?: string];

class ForTupleTest {
}
var x6 : [ForTupleTest, ForTupleTest?];
var x7 : [a : number, b ?: ForTupleTest];
var x8 : [number, ...ForTupleTest[], string];
var x9 : [a : string, ...b : C[], c:string];

type StringsForTupleTest = [string, string]
type NumbersForTupleTest = [number, number]
type x10 = [...StringsForTupleTest, ...NumbersForTupleTest]
