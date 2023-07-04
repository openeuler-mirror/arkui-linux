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


var var1;
declare var var2;

let var3;
declare let var4;

const var5 = 1;
declare const var6 = 4;
declare const var7;

type type1 = number | string;
declare type type2 = number | string;

function func1() { };
declare function func2();
func2();

declare class Class1 {
    private static get a()
    public g()
    static declare readonly [5]
    static declare readonly ["b"]
    static readonly declare 67
    declare static readonly j
    private;
    protected [1]()
    public static k
    #o;
}