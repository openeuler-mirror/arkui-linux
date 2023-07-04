/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum LiteralTag {
    BOOLEAN = 1,
    INTEGER = 2,
    DOUBLE = 4,
    STRING = 5,
    METHOD = 6,
    GENERATOR = 7,
    ACCESSOR = 8,
    METHODAFFILIATE = 9,
    // 0x0a - 0x15 for ARRAY_Type
    ASYNCGENERATOR = 22,
    LITERALBUFFERINDEX = 23,
    LITERALARRAY = 24,
    BUILTINTYPEINDEX = 25,
    NULLVALUE = 255
}

export class Literal {
    private t: LiteralTag;
    private v: any;

    constructor(t: LiteralTag, v: any) {
        this.t = t;
        this.v = v;
    }

    getTag() {
        return this.t;
    }

    getValue() {
        return this.v;
    }
}

export class LiteralBuffer {
    private k: string;
    private lb: Literal[] = [];

    constructor() {};

    addLiterals(...literals: Array<Literal>) {
        this.lb.push(...literals);
    }

    getLiterals() {
        return this.lb;
    }

    isEmpty() {
        return this.lb.length == 0;
    }

    getLiteral(index: number) {
        if (index >= this.lb.length || this.lb.length <=0) {
        return ;
        }
        return this.lb[index];
    }

    setKey(key: string) {
        this.k = key;
    }
}
