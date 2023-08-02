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
    Label,
    VReg
} from "../irnodes";
import { PandaGen } from "../pandagen";
import { Compiler } from "../compiler";
import {
    DiagnosticCode,
    DiagnosticError
} from "../diagnostic"
import { LabelTarget } from "./labelTarget";
export class SwitchBase {
    private stmt: ts.SwitchStatement;
    private compiler: Compiler;
    private pandaGen: PandaGen;
    private caseLabels: Label[] = [];
    private switchEndLabel: Label;
    constructor(stmt: ts.SwitchStatement, compiler: Compiler, caseNums: number, switchEndLabel: Label) {
        this.stmt = stmt;
        this.compiler = compiler;
        this.pandaGen = compiler.getPandaGen();
        this.switchEndLabel = switchEndLabel;

        for (let i = 0; i < caseNums; i++) {
            let caseLabel = new Label();
            this.caseLabels.push(caseLabel);
        }
        let labelTarget = new LabelTarget(stmt, switchEndLabel, undefined);
        LabelTarget.pushLabelTarget(labelTarget);
        LabelTarget.updateName2LabelTarget(stmt.parent, labelTarget);
    }

    setCasePosition(index: number) {
        let caseTarget = this.stmt.caseBlock.clauses[index];
        this.pandaGen.label(caseTarget, this.caseLabels[index]);
    }

    compileTagOfSwitch(tagReg: VReg) {
        this.compiler.compileExpression(this.stmt.expression);
        this.pandaGen.storeAccumulator(this.stmt.expression, tagReg);
    }

    compileCaseStatements(index: number) {
        this.stmt.caseBlock.clauses[index].statements.forEach(statement => {
            this.compiler.compileStatement(statement);
        })
    }

    JumpIfCase(tag: VReg, index: number) {
        let stmt = this.stmt;
        let pandaGen = this.pandaGen;
        let caseTarget = <ts.CaseClause>stmt.caseBlock.clauses[index];

        this.compiler.compileExpression(caseTarget.expression);
        pandaGen.condition(caseTarget, ts.SyntaxKind.ExclamationEqualsEqualsToken, tag, this.caseLabels[index]);
    }

    JumpToDefault(defaultIndex: number) {
        let defaultTarget = <ts.DefaultClause>this.stmt.caseBlock.clauses[defaultIndex];
        this.pandaGen.branch(defaultTarget, this.caseLabels[defaultIndex]);
    }

    checkDefaultNum(defaultCnt: number) {
        if (defaultCnt > 1) {
            throw new DiagnosticError(this.stmt, DiagnosticCode.A_default_clause_cannot_appear_more_than_once_in_a_switch_statement);
        }
    }

    break() {
        this.pandaGen.branch(this.stmt, this.switchEndLabel);
    }

    end() {
        this.pandaGen.label(this.stmt, this.switchEndLabel);
    }
}

export function compileSwitchStatement(stmt: ts.SwitchStatement, compiler: Compiler) {
    let pandaGen = compiler.getPandaGen();
    let caseNums = stmt.caseBlock.clauses.length;
    let switchEndLabel = new Label();
    let switchBuilder = new SwitchBase(stmt, compiler, caseNums, switchEndLabel);

    let tagReg = pandaGen.getTemp();
    switchBuilder.compileTagOfSwitch(tagReg);
    compiler.pushScope(stmt);
    let caseTargets = stmt.caseBlock.clauses;
    let defaultIndex = 0;
    let defaultCnt = 0;

    for (let i = 0; i < caseTargets.length; i++) {
        let caseTarget = caseTargets[i];
        if (ts.isDefaultClause(caseTarget)) {
            defaultIndex = i;
            defaultCnt++;
            continue;
        }

        switchBuilder.JumpIfCase(tagReg, i);
    }

    switchBuilder.checkDefaultNum(defaultCnt);
    if (defaultIndex > 0) {
        switchBuilder.JumpToDefault(defaultIndex);
    } else {
        switchBuilder.break();
    }

    for (let i = 0; i < caseTargets.length; i++) {
        switchBuilder.setCasePosition(i);
        switchBuilder.compileCaseStatements(i);
    }

    switchBuilder.end();
    pandaGen.freeTemps(tagReg);
    LabelTarget.popLabelTarget();
    compiler.popScope();
}