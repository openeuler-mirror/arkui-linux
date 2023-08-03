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
import { Compiler } from "src/compiler";
import * as jshelpers from "../jshelpers";
import { getParamLengthOfFunc } from "../base/util";
import { CacheList, getVregisterCache } from "../base/vregisterCache";
import { isInteger } from "./numericLiteral";
import { findInnerExprOfParenthesis } from "./parenthesizedExpression";
import { PandaGen } from "../pandagen";
import { VReg } from "../irnodes";
import { PropertyKind, Property, generatePropertyFromExpr } from "../base/properties";
import { LiteralTag, Literal, LiteralBuffer } from "../base/literal";

export function compileObjectLiteralExpression(compiler: Compiler, expr: ts.ObjectLiteralExpression) {
    let pandaGen = compiler.getPandaGen();

    // traverse the properties entries and store the useful information
    let properties: Property[] = generatePropertyFromExpr(expr);

    let objReg = pandaGen.getTemp();
    let hasMethod: boolean = false;

    // empty ObjectLiteral expression
    if (properties.length == 0) {
        pandaGen.createEmptyObject(expr);
        pandaGen.storeAccumulator(expr, objReg);
        pandaGen.freeTemps(objReg);
        return;
    }

    let literalBuffer = new LiteralBuffer();

    hasMethod = compileProperties(compiler, properties, literalBuffer);

    createObject(expr, pandaGen, objReg, literalBuffer, hasMethod, compiler);

    // for now there may left some Variable/Accessor to set the true value
    setUncompiledProperties(compiler, pandaGen, properties, objReg);

    pandaGen.loadAccumulator(expr, objReg);
    pandaGen.freeTemps(objReg);
}

function compileProperties(compiler: Compiler, properties: Property[], literalBuffer: LiteralBuffer): boolean {
    let hasMethod: boolean = false;

    for (let prop of properties) {
        if (prop.getKind() == PropertyKind.Spread || prop.getKind() == PropertyKind.Computed) {
            break;
        }

        if (prop.getKind() == PropertyKind.Prototype || prop.isRedeclared()) {
            continue;
        }

        let nameLiteral = new Literal(LiteralTag.STRING, String(prop.getName()));

        if (prop.getKind() == PropertyKind.Constant) {
            let valLiteral: Literal = createConstantLiteral(prop);

            literalBuffer.addLiterals(nameLiteral, valLiteral!);
            prop.setCompiled();  // need to be careful
        }

        if (prop.getKind() == PropertyKind.Variable) {
            let compilerDriver = compiler.getCompilerDriver();
            let valueNode = prop.getValue();
            let valLiteral: Literal;

            if (ts.isMethodDeclaration(valueNode)) {
                if (valueNode.asteriskToken) {
                    valLiteral = new Literal(LiteralTag.GENERATOR, compilerDriver.getFuncInternalName(valueNode, compiler.getRecorder()));
                } else {
                    valLiteral = new Literal(LiteralTag.METHOD, compilerDriver.getFuncInternalName(valueNode, compiler.getRecorder()));
                }
                let affiliateLiteral = new Literal(LiteralTag.METHODAFFILIATE, getParamLengthOfFunc(valueNode));
                literalBuffer.addLiterals(nameLiteral, valLiteral, affiliateLiteral);

                prop.setCompiled();
                hasMethod = true;
            } else {
                valLiteral = new Literal(LiteralTag.NULLVALUE, null);
                literalBuffer.addLiterals(nameLiteral, valLiteral);
            }
        }

        if (prop.getKind() == PropertyKind.Accessor) {
            let valLiteral = new Literal(LiteralTag.ACCESSOR, null);
            literalBuffer.addLiterals(nameLiteral, valLiteral);
        }
    }

    return hasMethod;
}

function createObject(expr: ts.ObjectLiteralExpression, pandaGen: PandaGen, objReg: VReg,
                      literalBuffer: LiteralBuffer, hasMethod: boolean, compiler: Compiler) {
    if (literalBuffer.isEmpty()) {
        pandaGen.createEmptyObject(expr);
    } else {
        let bufferId = PandaGen.appendLiteralArrayBuffer(literalBuffer);
        pandaGen.createObjectWithBuffer(expr, bufferId);
    }
    pandaGen.storeAccumulator(expr, objReg);
}

function createConstantLiteral(prop: Property): Literal {
    let valLiteral: Literal;
    if (prop.getValue().kind == ts.SyntaxKind.StringLiteral) {
        valLiteral = new Literal(LiteralTag.STRING, jshelpers.getTextOfIdentifierOrLiteral(prop.getValue()));
    } else if (prop.getValue().kind == ts.SyntaxKind.NumericLiteral) {
        let value = Number.parseFloat(jshelpers.getTextOfIdentifierOrLiteral(prop.getValue()));
        if (isInteger(value)) {
            valLiteral = new Literal(LiteralTag.INTEGER, value);
        } else {
            valLiteral = new Literal(LiteralTag.DOUBLE, value);
        }
    } else if (prop.getValue().kind == ts.SyntaxKind.TrueKeyword || prop.getValue().kind == ts.SyntaxKind.FalseKeyword) {
        if (prop.getValue().kind == ts.SyntaxKind.TrueKeyword) {
            valLiteral = new Literal(LiteralTag.BOOLEAN, true);
        } else {
            valLiteral = new Literal(LiteralTag.BOOLEAN, false);
        }
    } else if (prop.getValue().kind == ts.SyntaxKind.NullKeyword) {
        valLiteral = new Literal(LiteralTag.NULLVALUE, null);
    } else {
        throw new Error("Unreachable Kind of Literal");
    }

    return valLiteral;
}

function compileAccessorProperty(pandaGen: PandaGen, compiler: Compiler, objReg: VReg, prop: Property) {
    let getterReg = pandaGen.getTemp();
    let setterReg = pandaGen.getTemp();
    let propReg = pandaGen.getTemp();
    let propName = String(prop.getName());
    let accessor: ts.GetAccessorDeclaration | ts.SetAccessorDeclaration;

    if (prop.getGetter() !== undefined) {
        let getter = <ts.GetAccessorDeclaration>prop.getGetter();
        createMethodOrAccessor(pandaGen, compiler, objReg, getter);
        pandaGen.storeAccumulator(getter, getterReg);
        accessor = getter;
    }
    if (prop.getSetter() !== undefined) {
        let setter = <ts.SetAccessorDeclaration>prop.getSetter();
        createMethodOrAccessor(pandaGen, compiler, objReg, setter);
        pandaGen.storeAccumulator(setter, setterReg);
        accessor = setter;
    }

    pandaGen.loadAccumulatorString(accessor!, propName);
    pandaGen.storeAccumulator(accessor!, propReg);

    if (prop.getGetter() !== undefined && prop.getSetter() !== undefined) {
        pandaGen.defineGetterSetterByValue(accessor!, objReg, propReg, getterReg, setterReg, false);
    } else if (ts.isGetAccessorDeclaration(accessor!)) {
        pandaGen.defineGetterSetterByValue(accessor, objReg, propReg, getterReg, getVregisterCache(pandaGen, CacheList.undefined), false);
    } else {
        pandaGen.defineGetterSetterByValue(accessor!, objReg, propReg, getVregisterCache(pandaGen, CacheList.undefined), setterReg, false);
    }

    pandaGen.freeTemps(getterReg, setterReg, propReg);
}

function compileSpreadProperty(compiler: Compiler, prop: Property, objReg: VReg) {
    let pandaGen = compiler.getPandaGen();

    compiler.compileExpression(<ts.Expression>prop.getValue());
    // srcObj is in acc now
    pandaGen.copyDataProperties(<ts.Expression>prop.getValue().parent, objReg);
}

function compileComputedProperty(compiler: Compiler, prop: Property, objReg: VReg) {
    // Computed can't know its key in compile time, create Object now.
    let pandaGen = compiler.getPandaGen();

    let keyReg = pandaGen.getTemp();
    compiler.compileExpression((<ts.ComputedPropertyName>prop.getName()).expression);
    pandaGen.storeAccumulator(prop.getValue(), keyReg);

    switch (prop.getValue().kind) {
        case ts.SyntaxKind.PropertyAssignment: {
            compiler.compileExpression((<ts.PropertyAssignment>prop.getValue()).initializer);
            let nameSetting: boolean = needSettingName((<ts.PropertyAssignment>prop.getValue()).initializer);
            pandaGen.storeOwnProperty(prop.getValue(), objReg, keyReg, nameSetting);
            break;
        }
        case ts.SyntaxKind.MethodDeclaration: {
            createMethodOrAccessor(pandaGen, compiler, objReg, <ts.MethodDeclaration>prop.getValue());
            pandaGen.storeOwnProperty(prop.getValue(), objReg, keyReg, true);
            break;
        }
        case ts.SyntaxKind.GetAccessor: {
            let accessorReg = pandaGen.getTemp();
            let getter = <ts.GetAccessorDeclaration>prop.getValue();
            createMethodOrAccessor(pandaGen, compiler, objReg, getter);
            pandaGen.storeAccumulator(getter, accessorReg);
            pandaGen.defineGetterSetterByValue(getter, objReg, keyReg, accessorReg, getVregisterCache(pandaGen, CacheList.undefined), true);
            pandaGen.freeTemps(accessorReg);
            break;
        }
        case ts.SyntaxKind.SetAccessor: {
            let accessorReg = pandaGen.getTemp();
            let setter = <ts.SetAccessorDeclaration>prop.getValue();
            createMethodOrAccessor(pandaGen, compiler, objReg, setter);
            pandaGen.storeAccumulator(setter, accessorReg);
            pandaGen.defineGetterSetterByValue(setter, objReg, keyReg, getVregisterCache(pandaGen, CacheList.undefined), accessorReg, true);
            pandaGen.freeTemps(accessorReg);
            break;
        }
        // no default
    }

    pandaGen.freeTemps(keyReg);
}

function compileProtoProperty(compiler: Compiler, prop: Property, objReg: VReg) {
    let pandaGen = compiler.getPandaGen();
    let protoReg = pandaGen.getTemp();

    compiler.compileExpression(<ts.Expression>prop.getValue());
    pandaGen.storeAccumulator(<ts.Expression>prop.getValue().parent, protoReg);
    pandaGen.setObjectWithProto(<ts.Expression>prop.getValue().parent, protoReg, objReg);
    pandaGen.freeTemps(protoReg);
}

function setUncompiledProperties(compiler: Compiler, pandaGen: PandaGen, properties: Property[], objReg: VReg) {
    for (let prop of properties) {
        if (!prop.isCompiled()) {
            switch (prop.getKind()) {
                case PropertyKind.Accessor: {
                    compileAccessorProperty(pandaGen, compiler, objReg, prop);
                    break;
                }
                case PropertyKind.Spread: {
                    compileSpreadProperty(compiler, prop, objReg);
                    break;
                }
                case PropertyKind.Computed: {
                    compileComputedProperty(compiler, prop, objReg);
                    break;
                }
                case PropertyKind.Constant:
                case PropertyKind.Variable: {
                    let nameSetting: boolean = false;
                    if (ts.isMethodDeclaration(prop.getValue())) {
                        createMethodOrAccessor(pandaGen, compiler, objReg, <ts.MethodDeclaration>prop.getValue());
                    } else {
                        compiler.compileExpression(<ts.Expression | ts.Identifier>prop.getValue());
                        nameSetting = needSettingName(<ts.Expression | ts.Identifier>prop.getValue())
                            && (<string | number>(prop.getName())).toString().lastIndexOf('.') != -1;
                    }
                    pandaGen.storeOwnProperty(prop.getValue().parent, objReg, <string | number>(prop.getName()), nameSetting);
                    break;
                }
                case PropertyKind.Prototype: {
                    compileProtoProperty(compiler, prop, objReg);
                    break;
                }
                default: {
                    throw new Error("Unreachable PropertyKind for NullValue setting");
                }
            }
        }
    }
}

export function createMethodOrAccessor(pandaGen: PandaGen, compiler: Compiler, objReg: VReg,
                                       func: ts.MethodDeclaration | ts.GetAccessorDeclaration | ts.SetAccessorDeclaration | ts.ConstructorDeclaration) {
    let internalName = compiler.getCompilerDriver().getFuncInternalName(func, compiler.getRecorder());
    if (ts.isMethodDeclaration(func) && func.asteriskToken) {
        pandaGen.defineFunction(func, func, internalName);
    } else {
        pandaGen.defineMethod(func, internalName, objReg);
    }
}

function needSettingName(node: ts.Node): boolean {
    let tempNode: ts.Node = node;
    if (ts.isParenthesizedExpression(node)) {
        tempNode = findInnerExprOfParenthesis(node);
    }

    if (ts.isFunctionLike(tempNode) || ts.isClassLike(tempNode)) {
        let funcOrClassNode = <ts.FunctionLikeDeclaration | ts.ClassLikeDeclaration>tempNode;
        if (!funcOrClassNode.name) {
            return true;
        }
    }
    return false;
}