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


var a = 5;
type A = (string | number & boolean extends boolean ? number : string)[] extends ((boolean extends & string ? typeof a : number) | number) ? number | boolean extends string ? number : string : string;

var b: boolean & number extends A ? number : string;
var c: A | number extends string ? number : string;
var d: boolean | A & string extends string ? number : string;
var e: boolean & number | string extends string ? number : string;

type Bar<T> = T extends (infer U)[]
    ? U
    : T extends (...args: any[]) => infer U
    ? U
    : T extends Promise<infer U>
    ? U
    : T;