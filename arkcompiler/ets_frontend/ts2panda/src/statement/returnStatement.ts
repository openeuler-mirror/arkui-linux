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

import * as ts from "typescript";
import { CacheList, getVregisterCache } from "../base/vregisterCache";
import { Compiler, ControlFlowChange } from "../compiler";
import { AsyncFunctionBuilder } from "../function/asyncFunctionBuilder";
import { AsyncGeneratorFunctionBuilder } from "../function/asyncGeneratorFunctionBuilder";
import { Label, VReg } from "../irnodes";
import * as jshelpers from "../jshelpers";
import { checkValidUseSuperBeforeSuper } from "./classStatement";

export function compileReturnStatement(stmt: ts.ReturnStatement, compiler: Compiler) {
    let pandaGen = compiler.getPandaGen();
    let returnValue = pandaGen.getTemp();

    if (isReturnInDerivedCtor(stmt)) {
        compileReturnInDerivedCtor(stmt, returnValue, compiler);
    } else {
        compileNormalReturn(stmt, returnValue, compiler);
    }
    pandaGen.freeTemps(returnValue);
}

function compileReturnInDerivedCtor(stmt: ts.ReturnStatement, returnValue: VReg, compiler: Compiler) {
    let pandaGen = compiler.getPandaGen();
    let expr = stmt.expression;

    let need2CheckSuper = pandaGen.getTemp();

    if (!expr) {
        pandaGen.moveVreg(stmt, need2CheckSuper, getVregisterCache(pandaGen, CacheList.True));
    } else {
        if (ts.isCallExpression(expr) && expr.expression.kind == ts.SyntaxKind.SuperKeyword) {
            compileNormalReturn(stmt, returnValue, compiler);
            pandaGen.freeTemps(need2CheckSuper);
            return;
        }

        if (expr.kind == ts.SyntaxKind.ThisKeyword) {
            pandaGen.moveVreg(stmt, need2CheckSuper, getVregisterCache(pandaGen, CacheList.True));
        } else {
            compiler.compileExpression(expr);
            pandaGen.binary(stmt, ts.SyntaxKind.EqualsEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.undefined));
            pandaGen.storeAccumulator(stmt, need2CheckSuper);
        }
    }

    let compile = new Label();
    let notCompile = new Label();
    pandaGen.loadAccumulator(stmt, need2CheckSuper);
    pandaGen.condition(stmt, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.False), compile);

    // load this
    let thisReg = pandaGen.getTemp();
    compiler.getThis(stmt, thisReg);
    pandaGen.loadAccumulator(stmt, thisReg);
    pandaGen.branch(stmt, notCompile);

    // compile return expression
    pandaGen.label(stmt, compile);
    if (expr) {
        compiler.compileExpression(expr);
    } else {
        pandaGen.loadAccumulator(stmt, getVregisterCache(pandaGen, CacheList.undefined));
    }

    pandaGen.label(stmt, notCompile);
    pandaGen.storeAccumulator(stmt, returnValue);

    compiler.compileFinallyBeforeCFC(
        undefined,
        ControlFlowChange.Break,
        undefined
    );

    let returnLabel = new Label();
    let normalLabel = new Label();
    pandaGen.loadAccumulator(stmt, need2CheckSuper);
    pandaGen.condition(stmt, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.False), normalLabel);
    // check if super has been called
    checkValidUseSuperBeforeSuper(compiler, stmt);
    pandaGen.branch(stmt, returnLabel);

    pandaGen.label(stmt, normalLabel);
    // load returnValue to acc
    pandaGen.loadAccumulator(stmt, returnValue);

    pandaGen.label(stmt, returnLabel);
    pandaGen.return(stmt);

    pandaGen.freeTemps(need2CheckSuper, thisReg);
}

function compileNormalReturn(stmt: ts.ReturnStatement, returnValue: VReg, compiler: Compiler) {
    let expr = stmt.expression;
    let pandaGen = compiler.getPandaGen();
    let empty : boolean = false;

    if (expr) {
        compiler.compileExpression(expr);
    } else {
        empty = true;
        pandaGen.loadAccumulator(stmt, getVregisterCache(pandaGen, CacheList.undefined));
    }
    pandaGen.storeAccumulator(stmt, returnValue);

    compiler.compileFinallyBeforeCFC(
        undefined,
        ControlFlowChange.Break,
        undefined
    );

    pandaGen.loadAccumulator(stmt, returnValue);
    compiler.getFuncBuilder().explicitReturn(stmt, empty);
}

function isReturnInDerivedCtor(stmt: ts.ReturnStatement) {
    let funcNode = jshelpers.getContainingFunctionDeclaration(stmt);
    if (!funcNode || !ts.isConstructorDeclaration(funcNode)) {
        return false;
    }

    if (funcNode && funcNode.parent) {
        let classNode = <ts.ClassLikeDeclaration>funcNode.parent;
        if (classNode.heritageClauses) {
            return true;
        }
    }

    return false;
}