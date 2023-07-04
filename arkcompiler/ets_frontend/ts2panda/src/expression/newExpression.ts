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
import { Compiler } from "../compiler";
import { VReg } from "../irnodes";
import { containSpreadElement } from "../base/util";
import { createArrayFromElements } from "./arrayLiteralExpression";

export function compileNewExpression(expr: ts.NewExpression, compiler: Compiler) {
    let pandaGen = compiler.getPandaGen();
    let ctorReg = pandaGen.getTemp();

    // get the ctor function
    compiler.compileExpression(expr.expression);
    pandaGen.storeAccumulator(expr, ctorReg);

    if (containSpreadElement(expr.arguments)) {
        let argRegs = pandaGen.getTemp();
        createArrayFromElements(expr, compiler, <ts.NodeArray<ts.Expression>>expr.arguments, argRegs);

        pandaGen.newObjSpread(expr, ctorReg);
        pandaGen.freeTemps(ctorReg, argRegs);

        return;
    }

    // prepare arguments for newobj.dyn.range instruction
    let numArgs = 1; // for the ctor
    if (expr.arguments) {
        numArgs += expr.arguments.length;
    }

    let argRegs = new Array<VReg>(numArgs);
    argRegs[0] = ctorReg;

    let argIndex = 1;
    if (expr.arguments) {
        // store ctor arguments in registers
        expr.arguments.forEach((argExpr: ts.Expression) => {
            let argReg = pandaGen.getTemp();
            compiler.compileExpression(argExpr);
            pandaGen.storeAccumulator(expr, argReg);
            argRegs[argIndex++] = argReg;
        });
    }

    // generate the instruction to create new instance
    pandaGen.newObject(expr, argRegs);

    // free temp registers
    pandaGen.freeTemps(...argRegs);
}