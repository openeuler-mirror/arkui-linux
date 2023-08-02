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

import { Compiler, ControlFlowChange } from "../compiler";
import { Label, VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
import * as ts from "typescript";
import { Recorder } from "../recorder";
import { LocalScope, LoopScope } from "../scope";
import { LReference } from "../base/lreference";
import { LabelTarget } from "./labelTarget";
import {
    CacheList,
    getVregisterCache
} from "../base/vregisterCache";
import { IteratorRecord, IteratorType } from "./forOfStatement";
import * as jshelpers from "../jshelpers";
import { AsyncGeneratorFunctionBuilder } from "src/function/asyncGeneratorFunctionBuilder";

// adjust the try...catch...finally into nested try(try...catch) finally
export function transformTryCatchFinally(tryStmt: ts.TryStatement, recorder: Recorder): ts.TryStatement {
    // after create new try block node, mapped with new scope, and adjust parent node
    let tryStmtScope = <LocalScope>recorder.getScopeOfNode(tryStmt);
    let newTryBlockScope = new LocalScope(tryStmtScope);
    let newTryStmtScope = new LocalScope(newTryBlockScope);
    (<LocalScope>recorder.getScopeOfNode(tryStmt.tryBlock)).setParent(newTryStmtScope);
    (<LocalScope>recorder.getScopeOfNode(tryStmt.catchClause!)).setParent(newTryStmtScope);

    const newTryStmt = ts.factory.createTryStatement(tryStmt.tryBlock, tryStmt.catchClause, undefined);
    recorder.setScopeMap(newTryStmt, newTryStmtScope);

    const newTryBlock = [newTryStmt];
    newTryBlock[0] = jshelpers.setParent(newTryBlock[0], tryStmt)!;
    newTryBlock[0] = ts.setTextRange(newTryBlock[0], tryStmt.tryBlock)!;
    let tryBlock = ts.factory.updateBlock(tryStmt.tryBlock, newTryBlock);
    tryStmt = ts.factory.updateTryStatement(tryStmt, tryBlock, undefined, tryStmt.finallyBlock);
    recorder.setScopeMap(tryStmt.tryBlock, newTryBlockScope);
    return tryStmt;
}

export class LabelPair {
    private beginLabel: Label;
    private endLabel: Label;

    constructor(beginLabel: Label, endLabel: Label) {
        this.beginLabel = beginLabel;
        this.endLabel = endLabel;
    }

    getBeginLabel() {
        return this.beginLabel;
    }

    getEndLabel() {
        return this.endLabel;
    }
}

export class CatchTable {
    private labelPairs: LabelPair[] = [];
    private catchBeginLabel: Label;
    private depth: number;

    constructor(pandaGen: PandaGen, catchBeginLabel: Label, labelPair: LabelPair) {
        this.catchBeginLabel = catchBeginLabel;
        this.labelPairs.push(labelPair);
        this.depth = TryStatement.getcurrentTryStatementDepth();

        pandaGen.getCatchMap().set(catchBeginLabel, this);
    }

    getLabelPairs() {
        return this.labelPairs;
    }

    getCatchBeginLabel() {
        return this.catchBeginLabel;
    }

    getDepth() {
        return this.depth;
    }

    // split the last labelPair after inline finally.
    splitLabelPair(inlinedLabelPair: LabelPair) {
        let lastLabelPair = this.labelPairs.pop();
        if (lastLabelPair) {
            this.labelPairs.push(new LabelPair(lastLabelPair.getBeginLabel(), inlinedLabelPair.getBeginLabel()));
            this.labelPairs.push(new LabelPair(inlinedLabelPair.getEndLabel(), lastLabelPair.getEndLabel()));
        }
    }
}

// record the info of the tryStatement
export class TryStatement {
    private static currentTryStatement: TryStatement | undefined;
    private static currentTryStatementDepth: number = 0;
    private outer: TryStatement | undefined;
    private stmt: ts.Statement;
    private catchTable: CatchTable;
    private loopEnvLevel: number = 0;
    trybuilder: TryBuilderBase | undefined;

    constructor(stmt: ts.Statement, catchTable: CatchTable, trybuilder?: TryBuilderBase) {
        TryStatement.currentTryStatementDepth++;
        this.outer = TryStatement.currentTryStatement;
        /*
         * split the outer TryStatment's try block
         * OuterTryBegin      ----        OuterTryBegin         ----
         *               outerTry |                        outerTry |
         *     InnerTryBegin --   |           InnerTryBegin --  ----
         *            innerTry |  |  ==>             innerTry |
         *     InnerTryEnd   --   |           InnerTryEnd   --  ----
         *                        |                        outerTry |
         * OuterTryEnd        ----        OuterTryEnd           ----
         */
        if (this.outer) {
            let labelPairs: LabelPair[] = catchTable.getLabelPairs();
            this.outer.catchTable.splitLabelPair(labelPairs[labelPairs.length - 1]);
        }
        this.stmt = stmt;
        this.catchTable = catchTable;
        if (trybuilder) {
            this.trybuilder = trybuilder;
        }

        TryStatement.currentTryStatement = this;
    }

    destroy() {
        TryStatement.currentTryStatementDepth--;
        TryStatement.currentTryStatement = this.outer;
    }

    static setCurrentTryStatement(tryStatement: TryStatement | undefined) {
        TryStatement.currentTryStatement = tryStatement;
    }

    static getCurrentTryStatement() {
        return TryStatement.currentTryStatement;
    }

    static getcurrentTryStatementDepth() {
        return TryStatement.currentTryStatementDepth;
    }

    getOuterTryStatement() {
        return this.outer;
    }

    getStatement() {
        return this.stmt;
    }

    getCatchTable() {
        return this.catchTable;
    }

    getLoopEnvLevel() {
        return this.loopEnvLevel;
    }

    increaseLoopEnvLevel() {
        this.loopEnvLevel += 1;
    }

    decreaseLoopEnvLevel() {
        this.loopEnvLevel -= 1;
    }
}

export abstract class TryBuilderBase {
    protected compiler: Compiler;
    protected pandaGen: PandaGen;
    protected stmt: ts.Statement;
    protected tryStatement: TryStatement | undefined;

    constructor(compiler: Compiler, pandaGen: PandaGen, Stmt: ts.Statement) {
        this.compiler = compiler;
        this.pandaGen = pandaGen;
        this.stmt = Stmt;
    }

    abstract compileTryBlock(catchTable: CatchTable): void;
    abstract compileFinallyBlockIfExisted(): void;
    abstract compileExceptionHandler(): void;
    abstract compileFinalizer(cfc: ControlFlowChange, continueTargetLabel: Label | undefined): void;
}

// generate the bytecode for TryStatement
// compiler just handle the basic controlFlow
export class TryBuilder extends TryBuilderBase {

    constructor(compiler: Compiler, pandaGen: PandaGen, tryStmt: ts.TryStatement) {
        super(compiler, pandaGen, tryStmt)
    }

    compileTryBlock(catchTable: CatchTable) {
        if ((<ts.TryStatement>this.stmt).finallyBlock) {
            this.tryStatement = new TryStatement(this.stmt, catchTable, this);
        } else {
            this.tryStatement = new TryStatement(this.stmt, catchTable);
        }

        this.compiler.compileStatement((<ts.TryStatement>this.stmt).tryBlock);

        // when compiler is out of TryBlock, reset tryStatement
        this.tryStatement.destroy();
    }

    compileFinallyBlockIfExisted() {
        if ((<ts.TryStatement>this.stmt).finallyBlock) {
            this.compiler.compileStatement((<ts.TryStatement>this.stmt).finallyBlock!);
        }
    }

    compileExceptionHandler() {
        let catchClause = (<ts.TryStatement>this.stmt).catchClause;
        if (catchClause) {
            this.compiler.pushScope(catchClause);
            compileCatchClauseVariableDeclaration(this.compiler, catchClause.variableDeclaration);
            let catchBlock = catchClause.block;
            this.compiler.pushScope(catchBlock);
            catchBlock.statements.forEach((stmt) => this.compiler.compileStatement(stmt));
            this.compiler.popScope();
            this.compiler.popScope();
        } else {
            // finallyBlock rethrow exception when it catch the exception
            let exceptionVreg = this.pandaGen.getTemp();
            this.pandaGen.storeAccumulator(this.stmt, exceptionVreg);
            this.compiler.compileStatement((<ts.TryStatement>this.stmt).finallyBlock!);
            this.pandaGen.loadAccumulator(this.stmt, exceptionVreg);
            this.pandaGen.throw(this.stmt);
            this.pandaGen.freeTemps(exceptionVreg);
        }
    }

    // @ts-ignore
    compileFinalizer(cfc: ControlFlowChange, continueTargetLabel: Label) {
        this.compiler.compileStatement((<ts.TryStatement>this.stmt).finallyBlock!);
    }
}

export class TryBuilderWithForOf extends TryBuilderBase {
    private labelTarget: LabelTarget;
    private doneReg: VReg;
    private iterator: IteratorRecord;
    private hasLoopEnv: boolean;
    private loopEnv: VReg | undefined;

    constructor(compiler: Compiler, pandaGen: PandaGen, forOfStmt: ts.ForOfStatement, doneReg: VReg, iterator: IteratorRecord, labelTarget: LabelTarget, hasLoopEnv: boolean, loopEnv?: VReg) {
        super(compiler, pandaGen, forOfStmt);

        this.labelTarget = labelTarget;
        this.doneReg = doneReg;
        this.iterator = iterator;
        this.hasLoopEnv = hasLoopEnv;
        this.loopEnv = loopEnv ? loopEnv : undefined;
    }

    compileTryBlock(catchTable: CatchTable) {
        let stmt = <ts.ForOfStatement>this.stmt;
        let compiler = <Compiler>this.compiler;
        let pandaGen = this.pandaGen;
        this.tryStatement = new TryStatement(stmt, catchTable, this);

        let resultReg = this.pandaGen.getTemp();
        let isDeclaration: boolean = false;

        let loopScope = <LoopScope>compiler.getRecorder().getScopeOfNode(stmt);

        pandaGen.loadAccumulator(stmt, getVregisterCache(pandaGen, CacheList.True));
        pandaGen.storeAccumulator(stmt, this.doneReg);

        pandaGen.label(stmt, this.labelTarget.getContinueTargetLabel()!);
        if (this.hasLoopEnv) {
            pandaGen.createLexEnv(stmt, loopScope);
        }

        this.compileIteratorNext(stmt, pandaGen, this.iterator, resultReg);

        pandaGen.loadObjProperty(stmt, resultReg, "done");
        pandaGen.jumpIfTrue(stmt, this.labelTarget.getBreakTargetLabel());

        pandaGen.loadObjProperty(stmt, resultReg, "value");
        pandaGen.storeAccumulator(stmt, resultReg);

        pandaGen.loadAccumulator(stmt, getVregisterCache(pandaGen, CacheList.False));
        pandaGen.storeAccumulator(stmt, this.doneReg);

        let lref = LReference.generateLReference(this.compiler, stmt.initializer, isDeclaration);
        pandaGen.loadAccumulator(stmt, resultReg);
        lref.setValue();

        this.compiler.compileStatement(stmt.statement);
        this.tryStatement.destroy();
        pandaGen.freeTemps(resultReg);
    }

    compileFinallyBlockIfExisted() { }

    compileExceptionHandler() {
        let pandaGen = this.pandaGen;
        let noReturn = new Label();
        let exceptionVreg = pandaGen.getTemp();
        pandaGen.storeAccumulator(this.stmt, exceptionVreg);

        pandaGen.loadAccumulator(this.stmt, this.doneReg);
        pandaGen.condition(
            (<ts.ForOfStatement>this.stmt).expression,
            ts.SyntaxKind.ExclamationEqualsEqualsToken,
            getVregisterCache(pandaGen, CacheList.True),
            noReturn);
        // Iterator Close
        pandaGen.loadObjProperty(this.stmt, this.iterator.getObject(), "return");
        pandaGen.storeAccumulator(this.stmt, this.iterator.getNextMethod());
        pandaGen.condition(this.stmt, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.undefined), noReturn);
        pandaGen.call(this.stmt, [this.iterator.getNextMethod(), this.iterator.getObject()], true);
        if (this.iterator.getType() == IteratorType.Async) {
            (<AsyncGeneratorFunctionBuilder>(this.compiler.getFuncBuilder())).await(this.stmt);
        }

        pandaGen.label(this.stmt, noReturn);
        pandaGen.loadAccumulator(this.stmt, exceptionVreg);
        pandaGen.throw(this.stmt);

        pandaGen.freeTemps(exceptionVreg);
    }

    compileFinalizer(cfc: ControlFlowChange, continueTargetLabel: Label) {
        if (cfc == ControlFlowChange.Break || continueTargetLabel != this.labelTarget.getContinueTargetLabel()) {
            let noReturn = new Label();
            let innerResult = this.pandaGen.getTemp();
            this.pandaGen.loadObjProperty(this.stmt, this.iterator.getObject(), "return");
            this.pandaGen.storeAccumulator(this.stmt, this.iterator.getNextMethod());
            this.pandaGen.condition(this.stmt, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(this.pandaGen, CacheList.undefined), noReturn);
            this.pandaGen.call(this.stmt, [this.iterator.getNextMethod(), this.iterator.getObject()], true);

            this.pandaGen.storeAccumulator(this.stmt, innerResult);
            this.pandaGen.throwIfNotObject(this.stmt, innerResult);

            this.pandaGen.label(this.stmt, noReturn);
            this.pandaGen.freeTemps(innerResult);
        }
    }

    private compileIteratorNext(stmt: ts.ForOfStatement, pandagen: PandaGen, iterator: IteratorRecord, resultObj: VReg) {
        pandagen.call(stmt, [iterator.getNextMethod(), iterator.getObject()], true);
        if (iterator.getType() == IteratorType.Async) {
            (<AsyncGeneratorFunctionBuilder>(this.compiler.getFuncBuilder())).await(this.stmt);
        }
        pandagen.storeAccumulator(stmt, resultObj);
        pandagen.throwIfNotObject(stmt, resultObj);
    }
}

function compileCatchClauseVariableDeclaration(compiler: Compiler, param: ts.VariableDeclaration | undefined) {
    if (param) {
        compiler.compileVariableDeclaration(param);
    }
}

export function updateCatchTables(inlinedTry: TryStatement | undefined, targetTry: TryStatement, inlinedLabelPair: LabelPair) {
    for (; inlinedTry != targetTry; inlinedTry = inlinedTry?.getOuterTryStatement()) {
        inlinedTry!.getCatchTable().splitLabelPair(inlinedLabelPair);
    }
    targetTry.getCatchTable().splitLabelPair(inlinedLabelPair);
}

export function generateCatchTables(catchMap: Map<Label, CatchTable>): CatchTable[] {
    let catchTableList: CatchTable[] = [];
    catchMap.forEach((catchTable) => {
        catchTableList.push(catchTable)
    });
    catchTableList.sort((a, b) => (b.getDepth() - a.getDepth()));
    return catchTableList;
}
