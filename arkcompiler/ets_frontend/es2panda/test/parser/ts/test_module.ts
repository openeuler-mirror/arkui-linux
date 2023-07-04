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


namespace a {
    let a;

    interface B {
        a: (a: number, b: string) => boolean,
        b(): number
    }
}

namespace a {
    let a;

    function b() { }
}

module a.b.c {
    let a;

    function t() { }
}


module a.b.c {
    let a;

    function t() { }
}

declare namespace k.z {

}

declare global {

}

declare module "foo";

export var c;

module module1 {
    export declare var a;
    declare var b;
    var c;
}

export module module2 {
    export declare var a;
    declare var b;
    var c;
}

declare module module3 {
    var b;
}

export declare module module4 {
    var b;
}

declare module "foo" {
    export import a = require("bar");
    import b = require("bar");
    import c = require;
}
