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


var a: { new(a: number, b: string): number; a: string; b?(a, [c, d], k?) }
var b: { a: number, b: number; c?: string }
var c: { a(a: number, b: string[]), (d: boolean, e): (g: number, l: string) => string }
var d: { ["foo"]: boolean, [5](a: undefined, b?: any): null }