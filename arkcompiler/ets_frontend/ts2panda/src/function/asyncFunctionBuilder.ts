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

import { CacheList, getVregisterCache } from "../base/vregisterCache";
import * as ts from "typescript";
import { NodeKind } from "../debuginfo";
import {
    Label,
    VReg
} from "../irnodes";
import { PandaGen } from "../pandagen";
import { CatchTable, LabelPair } from "../statement/tryStatement";
import { FunctionBuilder, FunctionBuilderType } from "./functionBuilder";

enum ResumeMode {
    Return,
    Throw,
    Next
};

/**
 * async function foo() {
 *     await 'promise obj';
 * }
 */
export class AsyncFunctionBuilder extends FunctionBuilder {
    constructor(pandaGen: PandaGen) {
        super(pandaGen);
        this.funcObj = pandaGen.getTemp();
        this.resumeVal = pandaGen.getTemp();
        this.beginLabel = new Label();
        this.endLabel = new Label();
    }

    prepare(node: ts.Node): void {
        let pandaGen = this.pg;

        pandaGen.asyncFunctionEnter(NodeKind.Invalid);
        pandaGen.storeAccumulator(NodeKind.Invalid, this.funcObj);

        pandaGen.label(node, this.beginLabel);
    }

    await(node: ts.Node): void {
        // value is in acc
        this.functionAwait(node);
        this.handleMode(node);
    }

    explicitReturn(node: ts.Node | NodeKind, empty ? : boolean): void {
        // value is in acc
        this.pg.asyncFunctionResolve(node, this.funcObj);
        this.pg.return(node);
    }

    implicitReturn(node: ts.Node | NodeKind): void {
        this.pg.loadAccumulator(node, getVregisterCache(this.pg, CacheList.undefined));
        this.pg.asyncFunctionResolve(node, this.funcObj);
        this.pg.return(node);
    }

    private handleMode(node: ts.Node) {
        let pandaGen = this.pg;
        let modeType = pandaGen.getTemp();

        pandaGen.getResumeMode(node, this.funcObj);
        pandaGen.storeAccumulator(node, modeType);

        // .reject
        pandaGen.loadAccumulatorInt(node, ResumeMode.Throw);

        let notThrowLabel = new Label();

        // jump to normal code
        pandaGen.condition(node, ts.SyntaxKind.EqualsEqualsToken, modeType, notThrowLabel);
        pandaGen.loadAccumulator(node, this.resumeVal);
        pandaGen.throw(node);

        pandaGen.freeTemps(modeType);

        // .resolve
        pandaGen.label(node, notThrowLabel);
        pandaGen.loadAccumulator(node, this.resumeVal);
    }

    resolve(node: ts.Node | NodeKind, value: VReg) {
        let pandaGen = this.pg;
        pandaGen.loadAccumulator(node, value);
        pandaGen.asyncFunctionResolve(node, this.funcObj);
    }

    cleanUp(node: ts.Node): void {
        let pandaGen = this.pg;

        pandaGen.label(node, this.endLabel);

        // exception is in acc
        pandaGen.asyncFunctionReject(NodeKind.Invalid, this.funcObj);
        pandaGen.return(NodeKind.Invalid);

        pandaGen.freeTemps(this.funcObj, this.resumeVal);

        new CatchTable(pandaGen, this.endLabel, new LabelPair(this.beginLabel, this.endLabel));
    }

    builderType(): FunctionBuilderType {
        return FunctionBuilderType.ASYNC;
    }
}