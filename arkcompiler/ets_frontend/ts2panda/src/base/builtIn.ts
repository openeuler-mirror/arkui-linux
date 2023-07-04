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

import { PandaGen } from "src/pandagen";
import {
    IRNode,
    Ldfalse,
    Ldglobal,
    Ldhole,
    Ldinfinity,
    Ldnan,
    Ldnull,
    Ldsymbol,
    Ldtrue,
    Ldundefined,
    Sta,
    Ldfunction
} from "../irnodes";
import { CacheList, getVregisterCache } from "./vregisterCache";

export function expandHole(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.HOLE);
    return [
        new Ldhole(),
        new Sta(vreg)
    ]
}

export function expandNaN(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.NaN);
    return [
        new Ldnan(),
        new Sta(vreg)
    ];
}

export function expandInfinity(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.Infinity);
    return [
        new Ldinfinity(),
        new Sta(vreg)
    ];
}

export function expandGlobal(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.Global);
    return [
        new Ldglobal(),
        new Sta(vreg)
    ];
}

export function expandUndefined(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.undefined);
    return [
        new Ldundefined(),
        new Sta(vreg)
    ];
}

export function expandSymbol(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.Symbol);
    return [
        new Ldsymbol(),
        new Sta(vreg)
    ];
}

export function expandNull(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.Null);
    return [
        new Ldnull(),
        new Sta(vreg)
    ];
}

export function expandTrue(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.True);
    return [
        new Ldtrue(),
        new Sta(vreg)
    ];
}

export function expandFalse(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.False);
    return [
        new Ldfalse(),
        new Sta(vreg)
    ];
}

export function expandFunc(pandaGen: PandaGen): IRNode[] {
    let vreg = getVregisterCache(pandaGen, CacheList.FUNC);
    return [
        new Ldfunction(),
        new Sta(vreg)
    ];
}