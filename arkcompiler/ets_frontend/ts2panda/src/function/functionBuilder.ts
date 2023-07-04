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
import { NodeKind } from "../debuginfo";
import * as ts from "typescript";
import {
    Label,
    VReg
} from "../irnodes";
import { PandaGen } from "../pandagen";
import { CatchTable } from "../statement/tryStatement";

export enum FunctionBuilderType {
    NORMAL,
    GENERATOR,
    ASYNC,
    ASYNCGENERATOR
}

export class FunctionBuilder {
    protected pg: PandaGen | undefined = undefined;
    protected funcObj: VReg | undefined = undefined;
    protected resumeVal: VReg | undefined = undefined;
    protected resumeType: VReg | undefined = undefined;
    protected beginLabel: Label | undefined = undefined;
    protected endLabel: Label | undefined = undefined;

    constructor(pg: PandaGen) {
        this.pg = pg;
    }

    // @ts-ignore
    prepare(node: ts.Node): void {
    }

    // @ts-ignore
    cleanUp(node: ts.Node): void {
    }

    functionAwait(node: ts.Node): void {
        let pg = this.pg;

        // value is in acc
        pg.asyncFunctionAwaitUncaught(node, this.funcObj);
        pg.suspendGenerator(node, this.funcObj);

        pg.resumeGenerator(node, this.funcObj);
        pg.storeAccumulator(node, this.resumeVal);
    }

    resumeGenerator(node: ts.Node | NodeKind) {
        let pg = this.pg;
        pg.resumeGenerator(node, this.funcObj);
        pg.storeAccumulator(node, this.resumeVal);
        pg.getResumeMode(node, this.funcObj);
        pg.storeAccumulator(node, this.resumeType);
    }

    explicitReturn(node: ts.Node | NodeKind, empty ? : boolean) {
        this.pg.return(node);
    }

    implicitReturn(node: ts.Node | NodeKind) {
        CmdOptions.isWatchEvaluateExpressionMode() ? this.pg.return(NodeKind.Invalid) : this.pg.returnUndefined(node);
    }

    builderType(): FunctionBuilderType {
        return FunctionBuilderType.NORMAL;
    }
}