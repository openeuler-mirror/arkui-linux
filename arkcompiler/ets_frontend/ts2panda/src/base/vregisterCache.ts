/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

import {
    VReg
} from "../irnodes";
import { PandaGen } from "../pandagen";
import {
    expandFalse,
    expandGlobal,
    expandHole,
    expandInfinity,
    expandNaN,
    expandNull,
    expandSymbol,
    expandTrue,
    expandUndefined,
    expandFunc
} from "./builtIn";
import { expandLexEnv } from "./lexEnv";


export enum CacheList {
    MIN,
    NaN = MIN,
    HOLE,
    FUNC, // load function
    Infinity,
    undefined,
    Symbol,
    Null,
    Global,
    LexEnv,
    True,
    False,
    MAX
}
let cacheExpandHandlers = new Map([
    [CacheList.HOLE, expandHole],
    [CacheList.NaN, expandNaN],
    [CacheList.Infinity, expandInfinity],
    [CacheList.undefined, expandUndefined],
    [CacheList.Symbol, expandSymbol],
    [CacheList.Null, expandNull],
    [CacheList.Global, expandGlobal],
    [CacheList.LexEnv, expandLexEnv],
    [CacheList.True, expandTrue],
    [CacheList.False, expandFalse],
    [CacheList.FUNC, expandFunc],
]);

class CacheItem {
    constructor(handler: Function) {
        this.flag = false;
        this.vreg = undefined;
        this.expander = handler;
    }
    private flag: boolean;
    private vreg: VReg | undefined;
    private expander: Function;
    isNeeded() {
        return this.flag;
    }
    getCache(): VReg {
        if (!this.flag || !this.vreg) {
            this.flag = true;
            this.vreg = new VReg();
        }
        return this.vreg;
    }
    getExpander() {
        return this.expander;
    }
}

export class VregisterCache {
    private cache: CacheItem[] = [];
    constructor() {
        for (let i = CacheList.MIN; i < CacheList.MAX; ++i) {
            let handler = cacheExpandHandlers.get(i);
            if (!handler) {
                throw new Error("invalid expand handler");
            }
            this.cache[i] = new CacheItem(handler);
        }
    }
    getCache(index: CacheList) {
        if (index < CacheList.MIN || index > CacheList.MAX) {
            throw new Error("invalid builtin index");
        }
        return this.cache[index];
    }
}

export function getVregisterCache(pandaGen: PandaGen, index: CacheList) {
    let cache = pandaGen.getVregisterCache();
    let cacheItem = cache.getCache(index);

    return cacheItem.getCache();
}