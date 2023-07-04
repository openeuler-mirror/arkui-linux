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

import * as ts from "typescript";
import {
    CacheList,
    getVregisterCache
} from "../base/vregisterCache";
import * as jshelpers from "../jshelpers";
import { PandaGen } from "../pandagen";

const MAX_INT = 2 ** 31 - 1;

export function isInteger(value: number): Boolean {
    if (!Number.isSafeInteger(value)) {
        return false;
    }

    if (value > MAX_INT) {
        return false;
    }

    return true;
}

export function compileNumericLiteral(pandaGen: PandaGen, lit: ts.NumericLiteral) {
    let text = jshelpers.getTextOfIdentifierOrLiteral(lit);
    let value = Number.parseFloat(text);
    // check whether value is a NaN
    if (Number.isNaN(value)) {
        pandaGen.loadAccumulator(lit, getVregisterCache(pandaGen, CacheList.NaN));
    } else if (!Number.isFinite(value)) {
        // check whether value is a Infinity
        pandaGen.loadAccumulator(lit, getVregisterCache(pandaGen, CacheList.Infinity));
    } else if (isInteger(value)) {
        // check whether value is a SafeInteger
        pandaGen.loadAccumulatorInt(lit, value);
    } else {
        pandaGen.loadAccumulatorFloat(lit, value);
    }
}
