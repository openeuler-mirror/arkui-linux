/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

import ts from "typescript";
import { CacheList, getVregisterCache } from "../base/vregisterCache";
import { Compiler, ControlFlowChange } from "../compiler";
import {
    Label,
    VReg
} from "../irnodes";
import { PandaGen } from "../pandagen";
import { NodeKind } from "../debuginfo";
import { CatchTable, LabelPair } from "../statement/tryStatement";
import { FunctionBuilder } from "./functionBuilder";
import { Iterator } from "../base/iterator";
import { IteratorType } from "../statement/forOfStatement";

enum ResumeMode {
    RETURN,
    THROW,
    NEXT
};

export enum AsyncGeneratorState {
    UNDEFINED,
    SUSPENDSTART,
    SUSPENDYIELD,
    EXECUTING,
    COMPLETED,
    AWAITING_RETURN
}

export class AsyncGeneratorFunctionBuilder extends FunctionBuilder {
    private compiler: Compiler;

    constructor(pandaGen: PandaGen, compiler: Compiler) {
        super(pandaGen);
        this.funcObj = pandaGen.getTemp();
        this.resumeVal = pandaGen.getTemp();
        this.resumeType = pandaGen.getTemp();
        this.beginLabel = new Label();
        this.endLabel = new Label();
        this.compiler = compiler;
    }

    prepare(node: ts.Node) {
        let pg = this.pg;

        // backend handle funcobj, frontend set undefined
        pg.createAsyncGeneratorObj(node, getVregisterCache(pg, CacheList.FUNC));
        pg.storeAccumulator(node, this.funcObj);

        pg.label(node, this.beginLabel);
        pg.loadAccumulator(node, getVregisterCache(pg, CacheList.undefined));
        pg.suspendGenerator(node, this.funcObj);
        pg.resumeGenerator(node, this.funcObj);
        pg.storeAccumulator(node, this.resumeVal);
    }

    await(node: ts.Node): void {
        // value is in acc
        this.functionAwait(node);
        this.handleMode(node);
    }

    directReturn(node: ts.Node | NodeKind): void {
        let pg = this.pg;
        pg.storeAccumulator(node, this.resumeVal);
        pg.generatorComplete(node, this.funcObj);
        pg.asyncgeneratorresolve(node, this.funcObj, this.resumeVal, getVregisterCache(pg, CacheList.True));
        pg.return(node);
    }

    explicitReturn(node: ts.Node | NodeKind, empty ? : boolean): void {
        let pg = this.pg;
        if (!empty) {
            pg.asyncFunctionAwaitUncaught(node, this.funcObj);
            pg.suspendGenerator(node, this.funcObj);
            this.resumeGenerator(node);
        }
        pg.generatorComplete(node, this.funcObj);
        pg.asyncgeneratorresolve(node, this.funcObj, this.resumeVal, getVregisterCache(pg, CacheList.True));
        pg.return(node);
    }

    implicitReturn(node: ts.Node | NodeKind): void {
        this.pg.loadAccumulator(node, getVregisterCache(this.pg, CacheList.undefined));
        this.directReturn(node);
    }
	
    yield(node: ts.Node) {
        let pg = this.pg;

        // 27.6.3.8.5 Set value to ? Await(value).
        // vallue is in acc
        this.await(node);
        pg.storeAccumulator(node, this.resumeVal);

        // 27.6.3.8.6 Set generator.[[AsyncGeneratorState]] to suspendedYield.
        pg.generatorYield(node, this.funcObj);
        /** 27.6.3.8.7 Remove genContext from the execution context stack and restore the execution context that
         *  is at the top of the execution context stack as the running execution context.
         *  27.6.3.8.9 Return ! AsyncGeneratorResolve(generator, value, false).
         */
        pg.asyncgeneratorresolve(node, this.funcObj, this.resumeVal, getVregisterCache(pg, CacheList.False));
        this.resumeGenerator(node);

        this.handleAsyncYieldResume(node);
    }

    yieldStar(node: ts.Node) {
        let pg = this.pg;
        let method = pg.getTemp();
        let iterator = pg.getTemp();
        let nextResult = pg.getTemp();
        let value = pg.getTemp();
        let done = pg.getTemp();
        let nextMethod = pg.getTemp();
        let exitReturn = pg.getTemp();

        // 4. Let iteratorRecord be ? GetIterator(value, generatorKind)
        let iter: Iterator = new Iterator({iterator: iterator, nextMethod: method}, done, value, pg,
                                          node, IteratorType.Async, this);
        iter.getIterator();

        let receivedValue = this.resumeVal;
        this.resumeVal = nextResult;

        // 6. Let received be NormalCompletion(undefined)
        pg.storeConst(node, this.resumeVal, CacheList.undefined);
        pg.loadAccumulatorInt(node, ResumeMode.NEXT);
        pg.storeAccumulator(node, this.resumeType);
        pg.moveVreg(node, nextMethod, iter.method());

        let loopStart = new Label();
        let throwCompletion = new Label();
        let returnCompletion = new Label();
        let callMethod = new Label();
        let normalOrThrowCompletion = new Label();
        let iterCompletion = new Label();
        // 7. Repeat
        pg.label(node, loopStart);
        pg.storeConst(node, exitReturn, CacheList.False);

        // a. If received.[[Type]] is normal, then
        pg.loadAccumulatorInt(node, ResumeMode.NEXT);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsEqualsToken, this.resumeType, throwCompletion);
        pg.moveVreg(node, iter.method(), nextMethod);
        pg.branch(node, callMethod);

        // b. Else if received.[[Type]] is throw, then
        pg.label(node, throwCompletion);
        pg.loadAccumulatorInt(node, ResumeMode.THROW);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsEqualsToken, this.resumeType, returnCompletion);

        // i. Let throw be ? GetMethod(iterator, "throw")
        iter.getMethod("throw");

        // ii. If throw is not undefined, then
        pg.branchIfNotUndefined(node, callMethod);

        // iii. Else,
        // 1. NOTE: If iterator does not have a throw method, this throw is going to terminate the yield* loop. But first we
        // need to give iterator a chance to clean up.
        // 2. Let closeCompletion be Completion { [[Type]]: normal, [[Value]]: empty, [[Target]]: empty }.
        // 3. If generatorKind is async, perform ? AsyncIteratorClose(iteratorRecord, closeCompletion).
        // 4. Else, perform ? IteratorClose(iteratorRecord, closeCompletion).
        iter.close()
        // 5. NOTE: The next step throws a TypeError to indicate that there was a yield* protocol violation: iterator does
        // not have a throw method.
        // 6. Throw a TypeError exception.
        pg.throwThrowNotExist(node);

        // c. Else,
        // i. Assert: received.[[Type]] is return
        pg.label(node, returnCompletion);
        pg.storeConst(node, exitReturn, CacheList.True);
        // ii. Let return be ? GetMethod(iterator, "return").
        iter.getMethod("return");

        // iii. If return is undefined, then
        pg.branchIfNotUndefined(node, callMethod);

        this.compiler.compileFinallyBeforeCFC(
            undefined,
            ControlFlowChange.Break,
            undefined
        );

        pg.loadAccumulator(node, this.resumeVal);
        this.await(node);

        this.directReturn(node);

        pg.label(node, callMethod);
        // i. Let innerResult be ? Call(iteratorRecord.[[NextMethod]], iteratorRecord.[[Iterator]], « received.[[Value]] »).
        // 1. Let innerResult be ? Call(throw, iterator, « received.[[Value]] »).
        // iv. Let innerReturnResult be ? Call(return, iterator, « received.[[Value]] »).
        // pg.moveVreg(node, nextResult, this.resumeVal);
        iter.callMethodwithValue(this.resumeVal);

        this.await(node);
        pg.throwIfNotObject(node, this.resumeVal);

        iter.iteratorComplete(this.resumeVal);
        pg.jumpIfTrue(node, iterCompletion);

        pg.loadAccumulator(node, this.resumeVal);

        iter.iteratorValue(this.resumeVal);
        this.await(node);

        pg.generatorYield(node, this.funcObj);
        pg.storeConst(node, done, CacheList.False);
        pg.asyncgeneratorresolve(node, this.funcObj, this.resumeVal, done);

        this.resumeGenerator(node);

        pg.loadAccumulatorInt(node, ResumeMode.RETURN);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsToken, this.resumeType, loopStart);

        pg.loadAccumulator(node, this.resumeVal);
        pg.asyncFunctionAwaitUncaught(node, this.funcObj);

        pg.suspendGenerator(node, this.funcObj);
        this.resumeGenerator(node);

        pg.loadAccumulatorInt(node, ResumeMode.THROW);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsToken, this.resumeType, returnCompletion);

        pg.branch(node, loopStart);

        pg.label(node, iterCompletion);

        pg.loadAccumulator(node, exitReturn);
        pg.jumpIfFalse(node, normalOrThrowCompletion);

        iter.iteratorValue(this.resumeVal);

        this.compiler.compileFinallyBeforeCFC(
            undefined,
            ControlFlowChange.Break,
            undefined
        )

        this.directReturn(node);

        pg.label(node, normalOrThrowCompletion);
        iter.iteratorValue(this.resumeVal);

        this.resumeVal = receivedValue;

        pg.freeTemps(method, iterator, nextResult, value, done, nextMethod, exitReturn);
    }

    private handleAsyncYieldResume(node: ts.Node) {
        let pg = this.pg;
        let notRet = new Label();
        let normalCompletion = new Label();
        let notThrow = new Label();

        // 27.6.3.8.8.a If resumptionValue.[[Type]] is not return
        pg.loadAccumulatorInt(node, ResumeMode.RETURN);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsEqualsToken, this.resumeType, notRet);

        // 27.6.3.8.8.b Let awaited be Await(resumptionValue.[[Value]])
        pg.loadAccumulator(node, this.resumeVal);
        pg.asyncFunctionAwaitUncaught(node, this.funcObj);
        pg.suspendGenerator(node, this.funcObj);
        this.resumeGenerator(node);

        // 27.6.3.8.8.c. If awaited.[[Type]] is throw, return Completion(awaited)
        pg.loadAccumulatorInt(node, ResumeMode.THROW);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsEqualsToken, this.resumeType, normalCompletion);
        pg.loadAccumulator(node, this.resumeVal);
        pg.throw(node);

        pg.label(node, normalCompletion);
        // 27.6.3.8.8.d. Assert: awaited.[[Type]] is normal.
        // 27.6.3.8.8.e. Return Completion { [[Type]]: return, [[Value]]: awaited.[[Value]], [[Target]]: empty }

        // if there are finally blocks, should implement these at first.
        this.compiler.compileFinallyBeforeCFC(
            undefined,
            ControlFlowChange.Break,
            undefined
        );
        pg.loadAccumulator(node, this.resumeVal);
        this.directReturn(node);

        pg.label(node, notRet);
        // 27.6.3.8.8.a return Completion(resumptionValue)
        pg.loadAccumulatorInt(node, ResumeMode.THROW);
        pg.condition(node, ts.SyntaxKind.EqualsEqualsEqualsToken, this.resumeType, notThrow);
        pg.loadAccumulator(node, this.resumeVal);
        pg.throw(node);

        pg.label(node, notThrow);
        pg.loadAccumulator(node, this.resumeVal);
    }

    private handleMode(node: ts.Node) {
        let pandaGen = this.pg;

        pandaGen.getResumeMode(node, this.funcObj);
        pandaGen.storeAccumulator(node, this.resumeType);

        // .throw(value)
        pandaGen.loadAccumulatorInt(node, ResumeMode.THROW);

        let notThrowLabel = new Label();

        pandaGen.condition(node, ts.SyntaxKind.EqualsEqualsToken, this.resumeType, notThrowLabel);
        pandaGen.loadAccumulator(node, this.resumeVal);
        pandaGen.throw(node);

        // .next(value)
        pandaGen.label(node, notThrowLabel);
        pandaGen.loadAccumulator(node, this.resumeVal);
    }

    resolve(node: ts.Node | NodeKind, value: VReg) {
        let pandaGen = this.pg;
        pandaGen.asyncgeneratorresolve(node, this.funcObj, value, getVregisterCache(pandaGen, CacheList.True));
    }

    cleanUp(node: ts.Node) {
        let pandaGen = this.pg;
        pandaGen.label(node, this.endLabel);
        // catch
        pandaGen.storeAccumulator(node, this.resumeVal);
        pandaGen.generatorComplete(node, this.funcObj);
        pandaGen.loadAccumulator(node, this.resumeVal);
        pandaGen.asyncgeneratorreject(node, this.funcObj); // exception is in acc
        pandaGen.return(NodeKind.Invalid);
        this.pg.freeTemps(this.funcObj, this.resumeVal, this.resumeType);
        new CatchTable(pandaGen, this.endLabel, new LabelPair(this.beginLabel, this.endLabel));
    }
}
