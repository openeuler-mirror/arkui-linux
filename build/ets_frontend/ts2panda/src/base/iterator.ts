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

import { IteratorType } from "../statement/forOfStatement";
import * as ts from "typescript";
import {
    Label,
    VReg
} from "../irnodes";
import { PandaGen } from "../pandagen";
import { CatchTable, LabelPair } from "../statement/tryStatement";
import { FunctionBuilder } from "../function/functionBuilder";
import { AsyncGeneratorFunctionBuilder } from "../function/asyncGeneratorFunctionBuilder";
import { CacheList, getVregisterCache } from "./vregisterCache";

export class Iterator {
    private iterRecord: { iterator: VReg, nextMethod: VReg };
    private iterDone: VReg;
    private iterValue: VReg;
    private pandaGen: PandaGen;
    private node: ts.Node;
    private kind: IteratorType = IteratorType.Normal;
    private funcBuilder: FunctionBuilder | undefined = undefined;

    constructor(iterRecord: {iterator: VReg, nextMethod: VReg}, iterDone: VReg, iterValue: VReg,
                pandaGen: PandaGen, node: ts.Node, kind ? : IteratorType, funcBuilder ? : FunctionBuilder) {
        this.iterRecord = iterRecord;
        this.iterDone = iterDone;
        this.iterValue = iterValue;
        this.pandaGen = pandaGen;
        this.node = node;
        if (kind) {
            this.kind = kind;
        }

        if (funcBuilder) {
            this.funcBuilder = funcBuilder;
        }
    }

    getIterator() {
        let pandaGen = this.pandaGen;
        let iterator = this.iterRecord.iterator;

        // get iterator
        this.kind == IteratorType.Normal ? pandaGen.getIterator(this.node) : pandaGen.getAsyncIterator(this.node);
        pandaGen.storeAccumulator(this.node, iterator);

        // get the next method
        pandaGen.loadObjProperty(this.node, iterator, "next");
        pandaGen.storeAccumulator(this.node, this.iterRecord.nextMethod);
    }

    method(): VReg {
        return this.iterRecord.nextMethod;
    }

    getMethod(id: string) {
        this.pandaGen.loadObjProperty(this.node, this.iterRecord.iterator, id);
        this.pandaGen.storeAccumulator(this.node, this.iterRecord.nextMethod);
    }

    /**
     *  iterResult = nextMethod.call(iterator);
     *  if (!isObject(iterResult)) {
     *      throw TypeError
     *  }
     */
    callNext(iterResult: VReg) {
        this.pandaGen.call(this.node, [this.iterRecord.nextMethod, this.iterRecord.iterator], true);
        this.pandaGen.storeAccumulator(this.node, iterResult);
    }

    callMethodwithValue(value: VReg) {
        this.pandaGen.call(this.node, [this.iterRecord.nextMethod, this.iterRecord.iterator, value], true);
    }

    iteratorComplete(iterResult: VReg) {
        this.pandaGen.loadObjProperty(this.node, iterResult, "done");
        this.pandaGen.storeAccumulator(this.node, this.iterDone);
    }

    iteratorValue(iterResult: VReg) {
        this.pandaGen.loadObjProperty(this.node, iterResult, "value");
        this.pandaGen.storeAccumulator(this.node, this.iterValue);
    }

    close() {
        let pg = this.pandaGen;
        if (this.kind == IteratorType.Normal) {
            pg.closeIterator(this.node, this.iterRecord.iterator);
            return;
        }

        let completion = pg.getTemp();
        let res = pg.getTemp();
        let exception = pg.getTemp();
        let noReturn = new Label();

        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let catchEndLabel = new Label();
        new CatchTable(
            pg,
            catchBeginLabel,
            new LabelPair(tryBeginLabel, tryEndLabel)
        );

        pg.storeAccumulator(this.node, completion);
        pg.storeConst(this.node, exception, CacheList.HOLE);


        pg.label(this.node, tryBeginLabel);

        // 4. Let innerResult be GetMethod(iterator, "return").
        this.getMethod("return");

        // 5. If innerResult.[[Type]] is normal, then
        // a. Let return be innerResult.[[Value]].
        // b. If return is undefined, return Completion(completion).
        pg.branchIfUndefined(this.node, noReturn);
        this.callNext(res);

        // if (this.kind == IteratorType.Async) {
        //     if (!this.funcBuilder) {
        //         throw new Error("function builder are not supposed to be undefined");
        //     }

        //     (<AsyncGeneratorFunctionBuilder>this.funcBuilder).await(this.node);
        // }
        (<AsyncGeneratorFunctionBuilder>this.funcBuilder).await(this.node);
        pg.storeAccumulator(this.node, res);

        pg.label(this.node, tryEndLabel);
        pg.branch(this.node, catchEndLabel);

        pg.label(this.node, catchBeginLabel);
        pg.storeAccumulator(this.node, exception);
        pg.label(this.node, catchEndLabel);

        let skipThrow = new Label();
        let doThrow = new Label();
        pg.loadAccumulator(this.node, getVregisterCache(pg, CacheList.HOLE));
        pg.condition(this.node, ts.SyntaxKind.ExclamationEqualsToken, exception, skipThrow);

        pg.label(this.node, doThrow);
        pg.loadAccumulator(this.node, exception);
        pg.throw(this.node);

        pg.label(this.node, skipThrow);

        pg.loadAccumulator(this.node, res);
        pg.throwIfNotObject(this.node, res);

        pg.label(this.node, noReturn);
        pg.loadAccumulator(this.node, completion);

        pg.freeTemps(completion, res, exception)
    }

    getCurrentValue() {
        return this.iterValue;
    }

    getCurrrentDone() {
        return this.iterDone;
    }
}