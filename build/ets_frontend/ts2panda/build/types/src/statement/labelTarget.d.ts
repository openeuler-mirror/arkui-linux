import * as ts from "typescript";
import { TryStatement } from "./tryStatement";
import { Label } from "../irnodes";
export declare class LabelTarget {
    private static name2LabelTarget;
    private static labelTargetStack;
    private static curLoopLabelTarget;
    private node;
    private breakTargetLabel;
    private continueTargetLabel;
    private preLoopLabelTarget;
    private hasLoopEnv;
    private loopEnvLevel;
    private tryStatement;
    constructor(node: ts.Node, breakTargetLabel: Label, continueTargetLabel: Label | undefined, hasLoopEnv?: boolean);
    containLoopEnv(): boolean;
    getBreakTargetLabel(): Label;
    getContinueTargetLabel(): Label;
    getLoopEnvLevel(): number;
    getTryStatement(): TryStatement;
    getPreLoopLabelTarget(): LabelTarget;
    getCorrespondingNode(): ts.Node;
    private increaseLoopEnvLevel;
    private decreaseLoopEnvLevel;
    private static isLabelTargetsEmpty;
    static getCloseLabelTarget(): LabelTarget | undefined;
    static pushLabelTarget(labelTarget: LabelTarget): void;
    static popLabelTarget(): void;
    static updateName2LabelTarget(node: ts.Node, labelTarget: LabelTarget): void;
    static deleteName2LabelTarget(labelName: string): void;
    static getCurLoopLabelTarget(): LabelTarget;
    static getLabelTarget(stmt: ts.BreakOrContinueStatement): LabelTarget;
}
//# sourceMappingURL=labelTarget.d.ts.map