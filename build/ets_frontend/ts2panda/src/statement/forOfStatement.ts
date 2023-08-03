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
import { Compiler } from "src/compiler";
import {
    CacheList,
    getVregisterCache
} from "../base/vregisterCache";
import { LabelTarget } from "./labelTarget";
import { Label, VReg } from "../irnodes";
import { TryBuilderWithForOf } from "./tryStatement";
import { PandaGen } from "src/pandagen";
import { LoopScope } from "src/scope";

export enum IteratorType { Normal, Async }

export class IteratorRecord {
    private type: IteratorType;
    private object: VReg;
    private nextMethod: VReg;

    constructor(object: VReg, nextMethod: VReg, type: IteratorType = IteratorType.Normal) {
        this.type = type;
        this.object = object;
        this.nextMethod = nextMethod;
    }

    getType() {
        return this.type;
    }

    getObject() {
        return this.object;
    }

    getNextMethod() {
        return this.nextMethod;
    }
}


export function compileForOfStatement(stmt: ts.ForOfStatement, compiler: Compiler) {
    compiler.pushScope(stmt);

    let pandaGen = compiler.getPandaGen();
    let nextLabel = new Label();
    let endLabel = new Label();

    let doneReg = pandaGen.getTemp();
    let method = pandaGen.getTemp();
    let object = pandaGen.getTemp();

    let loopScope = <LoopScope>compiler.getRecorder().getScopeOfNode(stmt);
    let needCreateLoopEnv: boolean = loopScope.need2CreateLexEnv();
    let loopEnv = pandaGen.getTemp();

    // for now Async is not handled.
    let type: IteratorType = stmt.awaitModifier ? IteratorType.Async : IteratorType.Normal;

    if (needCreateLoopEnv) {
        pandaGen.createLexEnv(stmt, loopScope);
        compiler.pushEnv(loopEnv);
    }

    compiler.compileExpression(stmt.expression);
    let iterator: IteratorRecord = getIteratorRecord(pandaGen, stmt, method, object, type);

    if (needCreateLoopEnv) {
        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv();
    }

    pandaGen.loadAccumulator(stmt, getVregisterCache(pandaGen, CacheList.False));
    pandaGen.storeAccumulator(stmt, doneReg);

    let labelTarget = new LabelTarget(stmt, endLabel, nextLabel, needCreateLoopEnv);
    LabelTarget.pushLabelTarget(labelTarget);
    LabelTarget.updateName2LabelTarget(stmt.parent, labelTarget);

    let tryBuilderWithForOf = new TryBuilderWithForOf(compiler, pandaGen, stmt, doneReg, iterator, labelTarget, 
                                                      needCreateLoopEnv, needCreateLoopEnv ? loopEnv : undefined);
    compiler.constructTry(stmt, tryBuilderWithForOf, nextLabel);

    pandaGen.label(stmt, endLabel);

    LabelTarget.popLabelTarget();

    if (needCreateLoopEnv) {
        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv();
    }

    pandaGen.freeTemps(doneReg, method, object, loopEnv);
    compiler.popScope();
}

export function getIteratorRecord(pandagen: PandaGen, node: ts.Node, nextMethod: VReg, object: VReg, type: IteratorType) {
    getIterator(pandagen, node, type);

    pandagen.storeAccumulator(node, object);
    pandagen.loadObjProperty(node, object, "next");
    pandagen.storeAccumulator(node, nextMethod);

    return new IteratorRecord(object, nextMethod, type);
}

function getIterator(pandagen: PandaGen, node: ts.Node, type: IteratorType) {
    if (type == IteratorType.Async) {
        pandagen.getAsyncIterator(node);
    } else {
        pandagen.getIterator(node);
    }
}