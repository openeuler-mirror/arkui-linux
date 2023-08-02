import { Compiler, ControlFlowChange } from "../compiler";
import { Label, VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
import * as ts from "typescript";
import { Recorder } from "../recorder";
import { LabelTarget } from "./labelTarget";
import { IteratorRecord } from "./forOfStatement";
export declare function transformTryCatchFinally(tryStmt: ts.TryStatement, recorder: Recorder): ts.TryStatement;
export declare class LabelPair {
    private beginLabel;
    private endLabel;
    constructor(beginLabel: Label, endLabel: Label);
    getBeginLabel(): Label;
    getEndLabel(): Label;
}
export declare class CatchTable {
    private labelPairs;
    private catchBeginLabel;
    private depth;
    constructor(pandaGen: PandaGen, catchBeginLabel: Label, labelPair: LabelPair);
    getLabelPairs(): LabelPair[];
    getCatchBeginLabel(): Label;
    getDepth(): number;
    splitLabelPair(inlinedLabelPair: LabelPair): void;
}
export declare class TryStatement {
    private static currentTryStatement;
    private static currentTryStatementDepth;
    private outer;
    private stmt;
    private catchTable;
    private loopEnvLevel;
    trybuilder: TryBuilderBase | undefined;
    constructor(stmt: ts.Statement, catchTable: CatchTable, trybuilder?: TryBuilderBase);
    destroy(): void;
    static setCurrentTryStatement(tryStatement: TryStatement | undefined): void;
    static getCurrentTryStatement(): TryStatement;
    static getcurrentTryStatementDepth(): number;
    getOuterTryStatement(): TryStatement;
    getStatement(): ts.Statement;
    getCatchTable(): CatchTable;
    getLoopEnvLevel(): number;
    increaseLoopEnvLevel(): void;
    decreaseLoopEnvLevel(): void;
}
export declare abstract class TryBuilderBase {
    protected compiler: Compiler;
    protected pandaGen: PandaGen;
    protected stmt: ts.Statement;
    protected tryStatement: TryStatement | undefined;
    constructor(compiler: Compiler, pandaGen: PandaGen, Stmt: ts.Statement);
    abstract compileTryBlock(catchTable: CatchTable): void;
    abstract compileFinallyBlockIfExisted(): void;
    abstract compileExceptionHandler(): void;
    abstract compileFinalizer(cfc: ControlFlowChange, continueTargetLabel: Label | undefined): void;
}
export declare class TryBuilder extends TryBuilderBase {
    constructor(compiler: Compiler, pandaGen: PandaGen, tryStmt: ts.TryStatement);
    compileTryBlock(catchTable: CatchTable): void;
    compileFinallyBlockIfExisted(): void;
    compileExceptionHandler(): void;
    compileFinalizer(cfc: ControlFlowChange, continueTargetLabel: Label): void;
}
export declare class TryBuilderWithForOf extends TryBuilderBase {
    private labelTarget;
    private doneReg;
    private iterator;
    private hasLoopEnv;
    private loopEnv;
    constructor(compiler: Compiler, pandaGen: PandaGen, forOfStmt: ts.ForOfStatement, doneReg: VReg, iterator: IteratorRecord, labelTarget: LabelTarget, hasLoopEnv: boolean, loopEnv?: VReg);
    compileTryBlock(catchTable: CatchTable): void;
    compileFinallyBlockIfExisted(): void;
    compileExceptionHandler(): void;
    compileFinalizer(cfc: ControlFlowChange, continueTargetLabel: Label): void;
    private compileIteratorNext;
}
export declare function updateCatchTables(inlinedTry: TryStatement | undefined, targetTry: TryStatement, inlinedLabelPair: LabelPair): void;
export declare function generateCatchTables(catchMap: Map<Label, CatchTable>): CatchTable[];
//# sourceMappingURL=tryStatement.d.ts.map