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


class Foo {
    private static get a() { return }
    public async *g() { }
    static declare readonly [5]
    static declare readonly ["b"]
    static readonly declare 67
    declare static readonly j
    private;
    protected *[1]() { }
    public static k = "bar"
    #o = 4;
    set l(b: number) { };
    public get l() { return 2 };
    public get m() { return 2 };
    protected set m(b: number) { };
}

class Bar { c; d() { } e; let; var; const; function; f!: number }

class Baz {
    #name: string;
    constructor(name: string) {
        this.#name = name;
    }
    bar() { return this.#name };
}

abstract class Inga {
    abstract a();
    aa() { };
}
