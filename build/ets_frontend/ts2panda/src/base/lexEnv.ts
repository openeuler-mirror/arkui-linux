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

import { CmdOptions } from "../cmdOptions";
import {
    IRNode
} from "../irnodes";
import { PandaGen } from "../pandagen";
import { VariableScope } from "../scope";
import {
    newLexicalEnv,
    storeAccumulator
} from "./bcGenUtil";
import { CacheList, getVregisterCache } from "./vregisterCache";

function createLexEnv(pandaGen: PandaGen, scope: VariableScope): IRNode[] {
    let lexEnvVars = scope.getNumLexEnv();
    let insns: IRNode[] = [];
    let scopeInfoId: string | undefined = undefined;
    let lexVarInfo = scope.getLexVarInfo();
    if (CmdOptions.isDebugMode()) {
        scopeInfoId = pandaGen.appendScopeInfo(lexVarInfo);
    }

    insns.push(
        newLexicalEnv(lexEnvVars, scopeInfoId),
        storeAccumulator(getVregisterCache(pandaGen, CacheList.LexEnv))
    );

    return insns;
}

export function expandLexEnv(pandaGen: PandaGen): IRNode[] {
    let scope = pandaGen.getScope()!.getNearestVariableScope();
    let insns: IRNode[];

    if (!scope) {
        throw new Error("pandagen must have one variable scope");
    }

    if (scope.need2CreateLexEnv()) {
        insns = createLexEnv(pandaGen, scope);
    }

    return insns;
}
