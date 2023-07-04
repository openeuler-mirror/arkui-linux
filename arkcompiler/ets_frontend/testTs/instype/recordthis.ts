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

class A {
    name: string = "A";
    id: number = 0;
    get getName(): string {
        return this.name;
    }
    get getId() {
        return this.id;
    }
    set setName(name: string) {
        this.name = name;
    }
    set setId(id: number) {
        this.id = id;
    }
    constructor() {
        this.id = 95;
    }
    dump(): string {
        let msg: string = this.name + ":" + this.id;
        return msg;
    }
    static a: number = 1;
    a: number = 2;
    static stest() {
        console.log(this.a);
    }
    test() {
        console.log(this.a);
    }
    testwiththis(this: A) {
        console.log(this.a);
    }
}

function add(x: number, y: number): number {
    let z: number = x + y;
    this.z = z;
    return z;
}
