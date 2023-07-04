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


(a, b) => a

a, b, c => c;

a, b, c => a += b = c++;

a, b, c => { return c }

(a, b, c) => a, b, c;

(a, b, c) => a, b, c

a, b, c => c, b, a

var f = a => a

f = a => a

function g(func) { return func(123) }

g(val => ++val);

(() => 1)()

var arrowWithParen = val => ({ key: val });
