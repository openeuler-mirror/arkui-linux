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


var N=[3, 4, 5]
var a = [1, 2, ...N];
print(...a)

var b = () :number => { return 1 }

print(b())

var c = 1;
c += c;
c *= c;
c -= c;
c = -c;
c++;
++c;
c--;
--c;
print(c)

var d = c != c;
var e = 1 | 2;
e = e & 3;
d = e == 3;
print(d)
print(e)

var f = {
    a: 1,
    b: "str",
    c: 1 as number,
    d: () => { return 1 },
    e: { a: 1 },
    f: c = 5,
    g: [1,2]
}

print(f.a)
print(f.b)
print(f.c)
print(f.d())
print(f.e.a)
print(f.f)
print(...f.g)

switch (c) {
    case 0 : print(0);
    case 5 : print(5);
    default: print(1);
}
