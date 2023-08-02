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
import * as jshelpers from "../jshelpers";
import { LiteralTag, Literal, LiteralBuffer } from "../base/literal";
import { isConstantExpr } from "../base/properties";
import { PandaGen } from "../pandagen";
import { isInteger } from "./numericLiteral";
import { VReg } from "../irnodes";

export function compileArrayLiteralExpression(compiler: Compiler, node: ts.ArrayLiteralExpression) {
    let pandaGen = compiler.getPandaGen();
    let arrayObj = pandaGen.getTemp();
    createArrayFromElements(node, compiler, node.elements, arrayObj);
    pandaGen.freeTemps(arrayObj);
}

export function createArrayFromElements(node: ts.Node, compiler: Compiler, elements: ts.NodeArray<ts.Expression>, arrayObj: VReg) {
    let pandaGen = compiler.getPandaGen();
    // empty Array
    if (elements.length == 0) {
        pandaGen.createEmptyArray(node);
        pandaGen.storeAccumulator(node, arrayObj);
        return;
    }

    let literalBuffer = new LiteralBuffer();
    let indexReg = pandaGen.getTemp();
    let arrayCreated: boolean = false;
    let hasSpread: boolean = false;

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        if (isConstantExpr(element)) {
            let elem = parseConstantExpr(element);

            if (!arrayCreated) {
                literalBuffer.addLiterals(elem);
                if (i == elements.length - 1) {
                    emitCreateArrayWithBuffer(pandaGen, literalBuffer, element);
                    pandaGen.storeAccumulator(element, arrayObj);
                    arrayCreated = true;
                }
                continue;
            }

            compiler.compileExpression(element);
            if (hasSpread) {
                storeElementIfSpreadExisted(pandaGen, element, arrayObj, indexReg);
            } else {
                pandaGen.storeOwnProperty(element, arrayObj, i);
            }
            continue;
        }

        if (ts.isSpreadElement(element)) {
            if (!arrayCreated) {
                emitCreateArrayWithBuffer(pandaGen, literalBuffer, element);
                pandaGen.storeAccumulator(element, arrayObj);
                arrayCreated = true;
            }

            if (hasSpread) {
                storeSpreadElement(compiler, pandaGen, element, arrayObj, indexReg);
            } else {
                hasSpread = true;
                pandaGen.loadAccumulatorInt(element, i);
                pandaGen.storeAccumulator(element, indexReg);
                storeSpreadElement(compiler, pandaGen, element, arrayObj, indexReg);
            }
            continue;
        }

        if (ts.isOmittedExpression(element)) {
            if (!arrayCreated) {
                emitCreateArrayWithBuffer(pandaGen, literalBuffer, element);
                pandaGen.storeAccumulator(element, arrayObj);
                arrayCreated = true;
            }

            if (i == elements.length - 1) {
                // omittedExpression is the last element, we need to set the length of the array
                if (hasSpread) {
                    pandaGen.loadAccumulator(element, indexReg);
                    pandaGen.storeObjProperty(element, arrayObj, "length");
                    // no need to increment index since it's the last element
                } else {
                    pandaGen.loadAccumulatorInt(element, elements.length);
                    pandaGen.storeObjProperty(element, arrayObj, "length");
                }
            }
            continue;
        }

        // non-constant elements
        if (!arrayCreated) {
            emitCreateArrayWithBuffer(pandaGen, literalBuffer, element);
            pandaGen.storeAccumulator(element, arrayObj);
            arrayCreated = true;
        }

        compiler.compileExpression(element);

        if (hasSpread) {
            storeElementIfSpreadExisted(pandaGen, element, arrayObj, indexReg);
        } else {
            pandaGen.storeOwnProperty(element, arrayObj, i);
        }
    }

    pandaGen.loadAccumulator(node, arrayObj);
    pandaGen.freeTemps(indexReg);
}

function parseConstantExpr(element: ts.Expression): Literal {
    let elem: Literal;
    switch (element.kind) {
        case ts.SyntaxKind.FalseKeyword:
            elem = new Literal(LiteralTag.BOOLEAN, false);
            break;
        case ts.SyntaxKind.TrueKeyword:
            elem = new Literal(LiteralTag.BOOLEAN, true);
            break;
        case ts.SyntaxKind.StringLiteral:
            elem = new Literal(LiteralTag.STRING, jshelpers.getTextOfIdentifierOrLiteral(element));
            break;
        case ts.SyntaxKind.NumericLiteral: {
            let value = Number.parseFloat(jshelpers.getTextOfIdentifierOrLiteral(element));
            if (isInteger(value)) {
                elem = new Literal(LiteralTag.INTEGER, value);
            } else {
                elem = new Literal(LiteralTag.DOUBLE, value);
            }
            break;
        }
        case ts.SyntaxKind.NullKeyword:
            elem = new Literal(LiteralTag.NULLVALUE, null);
            break;
        default:
            throw new Error("invalid constant expression");
    }

    return elem;
}

function emitCreateArrayWithBuffer(pandaGen: PandaGen, literalBuffer: LiteralBuffer, element: ts.Expression) {
    if (literalBuffer.isEmpty()) {
        pandaGen.createEmptyArray(element);
    } else {
        let bufferId = PandaGen.appendLiteralArrayBuffer(literalBuffer);
        pandaGen.createArrayWithBuffer(element, bufferId);
    }
}

function storeElementIfSpreadExisted(pandaGen: PandaGen, element: ts.Expression, arrayObj: VReg, indexReg: VReg) {
    pandaGen.storeOwnProperty(element, arrayObj, indexReg);
    pandaGen.unary(element, ts.SyntaxKind.PlusPlusToken, indexReg);
    pandaGen.storeAccumulator(element, indexReg);
}

function storeSpreadElement(compiler: Compiler, pandaGen: PandaGen, element: ts.SpreadElement, arrayObj: VReg, indexReg: VReg) {
    compiler.compileExpression(element.expression);
    pandaGen.storeArraySpreadElement(element, arrayObj, indexReg);
    pandaGen.storeAccumulator(element, indexReg);
}