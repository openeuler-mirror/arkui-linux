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

/**
 * The loopStatement implementation.
 * This file implements Compilation process of loop statement
 * and uses Pandagen to generate bytecode.
 *
 */

import { Variable } from "src/variable";
import * as ts from "typescript";
import { LReference } from "../base/lreference";
import {
    CacheList,
    getVregisterCache
} from "../base/vregisterCache";
import { Compiler } from "../compiler";
import { Label, VReg } from "../irnodes";
import { LoopScope, Scope } from "../scope";
import { LabelTarget } from "./labelTarget";

export function compileDoStatement(stmt: ts.DoStatement, compiler: Compiler) {
    compiler.pushScope(stmt);
    let pandaGen = compiler.getPandaGen();

    let loopScope = <LoopScope>compiler.getRecorder().getScopeOfNode(stmt);
    let needCreateLoopEnv: boolean = loopScope.need2CreateLexEnv() ? true : false;

    let loopStartLabel = new Label();
    let loopEndLabel = new Label();
    let conditionLabel = new Label();
    let labelTarget = new LabelTarget(stmt, loopEndLabel, conditionLabel, needCreateLoopEnv);
    LabelTarget.pushLabelTarget(labelTarget);
    LabelTarget.updateName2LabelTarget(stmt.parent, labelTarget);


    pandaGen.label(stmt, loopStartLabel);
    if (needCreateLoopEnv) {
        pandaGen.createLexEnv(stmt, loopScope);
    }

    compiler.compileStatement(stmt.statement);
    pandaGen.label(stmt, conditionLabel);
    compiler.compileCondition(stmt.expression, loopEndLabel);

    if (needCreateLoopEnv) {
        pandaGen.popLexicalEnv(stmt);
    }

    pandaGen.branch(stmt, loopStartLabel);
    pandaGen.label(stmt, loopEndLabel);

    if (needCreateLoopEnv) {
        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv();
    }

    LabelTarget.popLabelTarget();
    compiler.popScope();
}

export function compileWhileStatement(stmt: ts.WhileStatement, compiler: Compiler) {
    compiler.pushScope(stmt);
    let pandaGen = compiler.getPandaGen();

    let loopScope = <LoopScope>compiler.getRecorder().getScopeOfNode(stmt);
    let needCreateLoopEnv: boolean = loopScope.need2CreateLexEnv() ? true : false;

    let loopStartLabel = new Label();
    let loopEndLabel = new Label();
    let labelTarget = new LabelTarget(stmt, loopEndLabel, loopStartLabel, needCreateLoopEnv);
    LabelTarget.pushLabelTarget(labelTarget);
    LabelTarget.updateName2LabelTarget(stmt.parent, labelTarget);

    pandaGen.label(stmt, loopStartLabel);
    if (needCreateLoopEnv) {
        pandaGen.createLexEnv(stmt, loopScope);
    }
    compiler.compileCondition(stmt.expression, loopEndLabel);

    compiler.compileStatement(stmt.statement);

    if (needCreateLoopEnv) {
        pandaGen.popLexicalEnv(stmt);
    }

    pandaGen.branch(stmt, loopStartLabel);
    pandaGen.label(stmt, loopEndLabel);

    if (needCreateLoopEnv) {
        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv()
    }

    LabelTarget.popLabelTarget();
    compiler.popScope();
}

export function compileForStatement(stmt: ts.ForStatement, compiler: Compiler) {
    compiler.pushScope(stmt);
    let pandaGen = compiler.getPandaGen();

    // determine if loopenv need to be created
    let loopScope = <LoopScope>compiler.getRecorder().getScopeOfNode(stmt);
    let needCreateLoopEnv: boolean = loopScope.need2CreateLexEnv();
    let createEnvAtBegining: boolean = false;
    if (needCreateLoopEnv) {
        // determine the location where loopenv should be created
        if (stmt.initializer && ts.isVariableDeclarationList(stmt.initializer)) {
            loopScope.getName2variable().forEach(v => {
                if (v.isLetOrConst() && v.isLexVar) {
                    createEnvAtBegining = true;
                }
            });
        }
    }

    let loopStartLabel = new Label();
    let loopEndLabel = new Label();
    let incLabel = new Label();
    let labelTarget = new LabelTarget(stmt, loopEndLabel, incLabel, needCreateLoopEnv);
    LabelTarget.pushLabelTarget(labelTarget);
    LabelTarget.updateName2LabelTarget(stmt.parent, labelTarget);

    if (stmt.initializer && ts.isVariableDeclarationList(stmt.initializer) && createEnvAtBegining && needCreateLoopEnv) {
        pandaGen.createLexEnv(stmt, loopScope);

        let declList = <ts.VariableDeclarationList>stmt.initializer;
        declList.declarations.forEach(decl => compiler.compileVariableDeclaration(decl));

        // loopCondition
        pandaGen.label(stmt, loopStartLabel);

        if (stmt.condition) {
            compiler.compileCondition(stmt.condition, loopEndLabel);
        }

        // loopBody
        compiler.compileStatement(stmt.statement);

        // loopIncrementor
        pandaGen.label(stmt, incLabel);

        // load init from current env for the use of the next iteration
        type variableInfo = { scope: Scope | undefined, level: number, v: Variable | undefined };
        let variables: Map<variableInfo, VReg> = new Map<variableInfo, VReg>();
        let tmpVregs: Array<VReg> = new Array<VReg>();
        loopScope.getName2variable().forEach((v, name) => {
            if (v.isLexVar && v.isLetOrConst()) {
                let tmp = pandaGen.getTemp();
                tmpVregs.push(tmp);
                let varInfo = loopScope.find(name);
                variables.set(varInfo, tmp);
                compiler.loadTarget(stmt, varInfo);
                pandaGen.storeAccumulator(stmt, tmp);
            }
        });

        // pop the current loopenv and create a new loopenv before the next iteration
        pandaGen.popLexicalEnv(stmt);
        pandaGen.createLexEnv(stmt, loopScope);
        variables.forEach((reg, varInfo) => {
            let slot: number = (<Variable>varInfo.v).idxLex;
            // emitStore is not used here to avoid dead-zone check within it, just use storeLexcialVar
            pandaGen.storeLexicalVar(stmt, varInfo.level, slot, reg);
        })

        // must compile incrementor after store the previous value into the corresponding slot, otherwise will fall into a dead loop
        if (stmt.incrementor) {
            compiler.compileExpression(stmt.incrementor);
        }

        pandaGen.branch(stmt, loopStartLabel);
        pandaGen.label(stmt, loopEndLabel);

        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv();
        pandaGen.freeTemps(...tmpVregs);
    } else { // compile for in fast mode
        if (needCreateLoopEnv) {
            pandaGen.createLexEnv(stmt, loopScope);
        }

        if (stmt.initializer) {
            if (ts.isVariableDeclarationList(stmt.initializer)) {
                let declList = <ts.VariableDeclarationList>stmt.initializer;
                declList.declarations.forEach((decl) => compiler.compileVariableDeclaration(decl));
            } else {
                compiler.compileExpression(stmt.initializer);
            }
        }

        if (needCreateLoopEnv) {
            pandaGen.popLexicalEnv(stmt);
            compiler.popEnv();
        }

        // loopCondition
        pandaGen.label(stmt, loopStartLabel);

        // createLoopEnv if needed
        if (needCreateLoopEnv) {
            pandaGen.createLexEnv(stmt, loopScope);
        }

        if (stmt.condition) {
            compiler.compileCondition(stmt.condition, loopEndLabel);
        }

        // loopBody
        compiler.compileStatement(stmt.statement);

        // loopIncrementor
        pandaGen.label(stmt, incLabel);
        if (stmt.incrementor) {
            compiler.compileExpression(stmt.incrementor);
        }

        // pop the current loopenv before next iteration
        if (needCreateLoopEnv) {
            pandaGen.popLexicalEnv(stmt);
        }

        pandaGen.branch(stmt, loopStartLabel);
        pandaGen.label(stmt, loopEndLabel);

        if (needCreateLoopEnv) {
            pandaGen.popLexicalEnv(stmt);
            compiler.popEnv();
        }
    }

    LabelTarget.popLabelTarget();
    compiler.popScope();
}

export function compileForInStatement(stmt: ts.ForInStatement, compiler: Compiler) {
    compiler.pushScope(stmt);
    let pandaGen = compiler.getPandaGen();

    // determine the location where env should be created
    let loopScope = <LoopScope>compiler.getRecorder().getScopeOfNode(stmt);
    let needCreateLexEnv: boolean = loopScope.need2CreateLexEnv() ? true : false;

    // init label info;
    let loopStartLabel = new Label();
    let loopEndLabel = new Label();
    let labelTarget = new LabelTarget(stmt, loopEndLabel, loopStartLabel, needCreateLexEnv);
    LabelTarget.pushLabelTarget(labelTarget);
    LabelTarget.updateName2LabelTarget(stmt.parent, labelTarget);

    let iterReg = pandaGen.getTemp();
    let propName = pandaGen.getTemp();

    if (needCreateLexEnv) {
        pandaGen.createLexEnv(stmt, loopScope);
    }

    // create enumerator
    compiler.compileExpression(stmt.expression);
    pandaGen.getPropIterator(stmt);
    pandaGen.storeAccumulator(stmt, iterReg);

    if (needCreateLexEnv) {
        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv();
    }

    pandaGen.label(stmt, loopStartLabel);
    if (needCreateLexEnv) {
        pandaGen.createLexEnv(stmt, loopScope);
    }

    // get next prop of enumerator
    pandaGen.getNextPropName(stmt, iterReg);
    pandaGen.storeAccumulator(stmt, propName);
    pandaGen.condition(stmt, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.undefined), loopEndLabel);

    let lref = LReference.generateLReference(compiler, stmt.initializer, false);
    pandaGen.loadAccumulator(stmt, propName);
    lref.setValue();

    compiler.compileStatement(stmt.statement);

    if (needCreateLexEnv) {
        pandaGen.popLexicalEnv(stmt);
    }
    pandaGen.branch(stmt, loopStartLabel);
    pandaGen.label(stmt, loopEndLabel);

    if (needCreateLexEnv) {
        pandaGen.popLexicalEnv(stmt);
        compiler.popEnv();
    }

    pandaGen.freeTemps(iterReg, propName);
    LabelTarget.popLabelTarget();
    compiler.popScope();
}