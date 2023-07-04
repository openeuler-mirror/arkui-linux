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
import * as jshelpers from "../jshelpers";
import { compileSuperProperty } from "../statement/classStatement";

const MAX_LENGTH = 2 ** 32 - 1;

export function compileMemberAccessExpression(node: ts.ElementAccessExpression | ts.PropertyAccessExpression, compiler: Compiler) {
    let pandaGen = compiler.getPandaGen();
    let objReg = pandaGen.getTemp();
    let propReg = pandaGen.getTemp();

    let { obj: obj, prop: property } = getObjAndProp(node, objReg, propReg, compiler)

    if (jshelpers.isSuperProperty(node)) {
        // make sure "this" is stored in lexical env if needed
        let thisReg = pandaGen.getTemp();
        compileSuperProperty(compiler, node, thisReg, property);
        pandaGen.freeTemps(thisReg);
    } else {
        pandaGen.loadObjProperty(
            ts.isPropertyAccessExpression(node) ? node.name : node.argumentExpression,
            obj,
            property
        );
    }

    pandaGen.freeTemps(objReg, propReg);
}

export function getObjAndProp(node: ts.ElementAccessExpression | ts.PropertyAccessExpression, objReg: VReg, propReg: VReg, compiler: Compiler) {
    let pandaGen = compiler.getPandaGen();
    let obj = objReg;
    let prop: VReg | string | number = propReg;

    // get obj first;
    if (!jshelpers.isSuperProperty(node)) {
        compiler.compileExpression(node.expression);
        pandaGen.storeAccumulator(node.expression, objReg);
    }

    if (ts.isPropertyAccessExpression(node)) {
        if (node.name.kind != ts.SyntaxKind.Identifier) {
            throw new Error("Property name of type private Identifier is unimplemented");
        }

        prop = jshelpers.getTextOfIdentifierOrLiteral(node.name);
    } else {
        if (ts.isStringLiteral(node.argumentExpression)) {
            prop = jshelpers.getTextOfIdentifierOrLiteral(node.argumentExpression);
            // deal with case like a["1"]
            let temp = Number(prop);
            if (!isNaN(Number.parseFloat(prop)) && !isNaN(temp) && isValidIndex(temp) && String(temp) == prop) {
                prop = temp;
            }
        } else if (ts.isNumericLiteral(node.argumentExpression)) {
            prop = parseFloat(jshelpers.getTextOfIdentifierOrLiteral(node.argumentExpression));
            if (!isValidIndex(prop)) {
                prop = prop.toString();
            }
        } else if (ts.isPrefixUnaryExpression(node.argumentExpression) && ts.isNumericLiteral(node.argumentExpression.operand) &&
            (node.argumentExpression.operator == ts.SyntaxKind.MinusToken || node.argumentExpression.operator == ts.SyntaxKind.PlusToken)) {
            let expr = node.argumentExpression;
            let temp = parseFloat(jshelpers.getTextOfIdentifierOrLiteral(expr.operand));
            if (expr.operator == ts.SyntaxKind.MinusToken) {
                prop = temp === 0 ? temp : "-" + temp.toString();
            } else {
                if (!isValidIndex(temp)) {
                    prop = "+" + temp.toString();
                } else {
                    prop = temp;
                }
            }
        } else {
            compiler.compileExpression(node.argumentExpression);
            pandaGen.storeAccumulator(node.argumentExpression, propReg);
            prop = propReg;
        }
    }

    return { obj: obj, prop: prop };
}

export function isValidIndex(num: number) {
    if ((num >= 0) && (num < MAX_LENGTH) && (Number.isInteger(num))) {
        return true;
    }

    return false;
}
