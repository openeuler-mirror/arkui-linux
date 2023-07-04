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
import { Literal, LiteralBuffer, LiteralTag } from "../base/literal";
import { LReference } from "../base/lreference";
import {
    getPropName,
    isConstantExpr,
    Property,
    propertyKeyAsString,
    PropertyKind
} from "../base/properties";
import {
    getParameterLength4Ctor,
    getParamLengthOfFunc,
    hasDefaultKeywordModifier,
    hasExportKeywordModifier,
    isUndefinedIdentifier
} from "../base/util";
import { CacheList, getVregisterCache } from "../base/vregisterCache";
import { Compiler } from "../compiler";
import { createArrayFromElements } from "../expression/arrayLiteralExpression";
import { createMethodOrAccessor } from "../expression/objectLiteralExpression";
import { findOuterNodeOfParenthesis } from "../expression/parenthesizedExpression";
import {
    VReg
} from "../irnodes";
import * as jshelpers from "../jshelpers";
import { PandaGen } from "../pandagen";
import { Recorder } from "../recorder";
import {
    FunctionScope,
    GlobalScope,
    LocalScope,
    Scope,
    VariableScope
} from "../scope";
import {
    LocalVariable,
    MandatoryFuncObj,
    MandatoryThis,
    ModuleVariable,
    Variable
} from "../variable";

export function compileClassDeclaration(compiler: Compiler, stmt: ts.ClassLikeDeclaration) {
    compiler.pushScope(stmt);

    let pandaGen = compiler.getPandaGen();
    let namedPropertyMap: Map<string, Property> = new Map<string, Property>();
    let properties: Array<Property> = [];
    let classFields: Array<ts.PropertyDeclaration> = [];

    properties = generatePropertyFromExpr(stmt, classFields, namedPropertyMap);
    let classReg = pandaGen.getTemp();

    let baseVreg = compileHeritageClause(compiler, stmt);
    let classBuffer = new LiteralBuffer();
    let propertyIndex = 0;
    let staticItemsNum = 0;
    let hasConstructor = extractCtorOfClass(stmt) == undefined ? false : true;

    for (; propertyIndex < properties.length; propertyIndex++) {
        let prop = properties[propertyIndex];
        let tmpVreg = pandaGen.getTemp();
        if (prop.getKind() == PropertyKind.Constant) {
            staticItemsNum++;
            let nameLiteral = new Literal(LiteralTag.STRING, String(prop.getName()));
            classBuffer.addLiterals(nameLiteral);
            compiler.compileExpression(<ts.Expression>prop.getValue());
            pandaGen.storeAccumulator(prop.getValue(), tmpVreg);
            prop.setCompiled();
        }

        if (prop.getKind() == PropertyKind.Variable) {
            if (prop.getValue().kind != ts.SyntaxKind.Constructor) {
                if (jshelpers.hasStaticModifier(prop.getValue())) {
                    staticItemsNum++;
                }
                let nameLiteral = new Literal(LiteralTag.STRING, String(prop.getName()));
                classBuffer.addLiterals(nameLiteral);
            }

            if (ts.isMethodDeclaration(prop.getValue())) {
                let methodLiteral = new Literal(LiteralTag.METHOD, compiler.getCompilerDriver().getFuncInternalName(<ts.MethodDeclaration>prop.getValue(), compiler.getRecorder()));
                let affiliateLiteral = new Literal(LiteralTag.METHODAFFILIATE, getParamLengthOfFunc(<ts.MethodDeclaration>prop.getValue()));
                classBuffer.addLiterals(methodLiteral, affiliateLiteral);
            } else {
                if (!ts.isConstructorDeclaration(prop.getValue())) {
                    let valLiteral = new Literal(LiteralTag.NULLVALUE, null);
                    classBuffer.addLiterals(valLiteral);
                    compiler.compileExpression(<ts.Expression | ts.Identifier>prop.getValue());
                    pandaGen.storeAccumulator(prop.getValue(), tmpVreg);
                }
            }
            prop.setCompiled();
        }

        pandaGen.freeTemps(tmpVreg);
        if (prop.getKind() == PropertyKind.Computed || prop.getKind() == PropertyKind.Accessor) {
            break;
        }
    }

    let notStaticItemsNum = propertyIndex - staticItemsNum;
    let nameLiteral = new Literal(LiteralTag.INTEGER, hasConstructor ? notStaticItemsNum - 1 : notStaticItemsNum);
    classBuffer.addLiterals(nameLiteral);

    createClassLiteralBuf(compiler, classBuffer, stmt, [baseVreg, classReg]);

    compileUnCompiledProperty(compiler, properties, classReg);
    pandaGen.loadAccumulator(stmt, classReg);

    let classScope = <Scope>compiler.getRecorder().getScopeOfNode(stmt);
    if (hasExportKeywordModifier(stmt)) {
        if (stmt.name) {
            let className = jshelpers.getTextOfIdentifierOrLiteral(stmt.name);
            let v: ModuleVariable = <ModuleVariable>(pandaGen.getScope().findLocal(className));
            v.initialize();
            pandaGen.storeModuleVariable(stmt, v);
        } else if (hasDefaultKeywordModifier(stmt)) {
            let defaultV: ModuleVariable = <ModuleVariable>(pandaGen.getScope().findLocal("*default*"));
            pandaGen.storeModuleVariable(stmt, defaultV);
        } else {
            // throw SyntaxError in Recorder
        }
    } else {
        if (stmt.name) {
            let className = jshelpers.getTextOfIdentifierOrLiteral(stmt.name);
            if (!ts.isClassExpression(stmt) && classScope.getParent() instanceof GlobalScope) {
                pandaGen.stLetOrClassToGlobalRecord(stmt, className);
            } else {
                let classInfo = classScope.find(className);
                (<LocalVariable | ModuleVariable>classInfo.v).initialize();
                if (classInfo.v instanceof ModuleVariable) {
                    let v: ModuleVariable = <ModuleVariable>(pandaGen.getScope().findLocal(className));
                    pandaGen.storeModuleVariable(stmt, v);
                } else {
                    pandaGen.storeAccToLexEnv(stmt, classInfo.scope!, classInfo.level, classInfo.v!, true);
                }
            }
        } else {
            // throw SyntaxError in SyntaxChecker
        }
    }

    pandaGen.freeTemps(classReg, baseVreg);
    compiler.popScope();
}

export function AddCtor2Class(recorder: Recorder, classNode: ts.ClassLikeDeclaration, scope: Scope) {
    let ctorNode;
    if (jshelpers.getClassExtendsHeritageElement(classNode)) {
        let parameter = ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createToken(ts.SyntaxKind.DotDotDotToken), "args");
        ctorNode = ts.factory.createConstructorDeclaration(undefined, undefined, [parameter], undefined);
    } else {
        ctorNode = ts.factory.createConstructorDeclaration(undefined, undefined, [], undefined);
    }

    ctorNode = jshelpers.setParent(ctorNode, classNode)!;
    ctorNode = ts.setTextRange(ctorNode, classNode);

    let body = ts.factory.createBlock([]);
    body = jshelpers.setParent(body, ctorNode)!;
    body = ts.setTextRange(body, classNode)!;

    ctorNode = ts.factory.updateConstructorDeclaration(ctorNode, undefined, undefined, ctorNode.parameters, body);
    ctorNode = jshelpers.setParent(ctorNode, classNode)!;
    ctorNode = ts.setTextRange(ctorNode, classNode);

    let parentScope = <LocalScope>recorder.getScopeOfNode(classNode);
    let funcScope = recorder.buildVariableScope(scope, ctorNode);
    funcScope.setParent(parentScope);

    let ctorBodyScope = new LocalScope(funcScope);
    ctorBodyScope.setParent(funcScope);

    recorder.setScopeMap(ctorNode, funcScope);
    recorder.setScopeMap(ctorNode.body!, ctorBodyScope);

    recorder.recordFuncName(ctorNode);
    recorder.recordFunctionParameters(ctorNode);

    recorder.setCtorOfClass(classNode, ctorNode);
}

export function compileDefaultConstructor(compiler: Compiler, ctrNode: ts.ConstructorDeclaration) {
    let callNode = ts.factory.createCallExpression(ts.factory.createSuper(), undefined,
        [ts.factory.createSpreadElement(ts.factory.createIdentifier("args"))]);

    callNode = jshelpers.setParent(callNode, ctrNode)!;
    callNode = ts.setTextRange(callNode, ctrNode)!

    compileSuperCall(compiler, callNode, [], true);
    compileConstructor(compiler, ctrNode, false);
}

function compileUnCompiledProperty(compiler: Compiler, properties: Property[], classReg: VReg) {
    let pandaGen = compiler.getPandaGen();
    for (let propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
        let prop = properties[propertyIndex];
        if (prop.isCompiled()) {
            continue;
        }

        switch (prop.getKind()) {
            case PropertyKind.Constant:
                compiler.compileExpression(<ts.Expression>prop.getValue());
                pandaGen.storeOwnProperty(prop.getValue().parent, classReg, <string | number>prop.getName());
                break;
            case PropertyKind.Variable:
                compileUnCompiledVariable(compiler, prop, classReg);
                break;
            case PropertyKind.Computed:
                let keyReg = pandaGen.getTemp();
                compiler.compileExpression((<ts.ComputedPropertyName>prop.getName()).expression);
                pandaGen.storeAccumulator(prop.getValue(), keyReg);
                compileComputedProperty(compiler, prop, classReg, keyReg);
                break;
            case PropertyKind.Accessor:
                setClassAccessor(pandaGen, compiler, classReg, prop);
                break;
            default:
                throw new Error("Unreachable PropertyKind for NullValue setting");
        }
    }
}

function compileUnCompiledVariable(compiler: Compiler, prop: Property, classReg: VReg) {
    let pandaGen = compiler.getPandaGen();
    let proptoReg = pandaGen.getTemp();
    let tmpReg = pandaGen.getTemp();
    let flag = false;

    if (ts.isMethodDeclaration(prop.getValue())) {
        flag = createClassMethodOrAccessor(compiler, classReg, proptoReg, tmpReg, <ts.MethodDeclaration>prop.getValue());
    } else {
        compiler.compileExpression(<ts.Expression | ts.Identifier>prop.getValue());
        flag = setPrototypeAttributes(compiler, prop.getValue().parent, classReg, proptoReg, tmpReg);
    }

    pandaGen.storeOwnProperty(prop.getValue().parent, flag ? proptoReg : classReg, <string>prop.getName());
    pandaGen.freeTemps(proptoReg, tmpReg);
    prop.setCompiled();

}

function createClassLiteralBuf(compiler: Compiler, classBuffer: LiteralBuffer,
    stmt: ts.ClassLikeDeclaration, vregs: VReg[]) {
    let litId: string = PandaGen.appendLiteralArrayBuffer(classBuffer);

    let ctorNode = compiler.getRecorder().getCtorOfClass(stmt);
    let internalName = compiler.getCompilerDriver().getInternalNameForCtor(stmt, <ts.ConstructorDeclaration>ctorNode);

    let pandaGen = compiler.getPandaGen();
    let parameterLength = getParameterLength4Ctor(stmt);
    pandaGen.defineClassWithBuffer(stmt, internalName, litId, parameterLength, vregs[0]);
    pandaGen.storeAccumulator(stmt, vregs[1]);
}

export function compileDefaultInitClassMembers(compiler: Compiler, node: ts.ConstructorDeclaration) {
    let pandaGen = compiler.getPandaGen();
    let members = node.parent!.members;
    for (let index = 0; index < members.length; index++) {
        let decl = members[index];
        if (ts.isPropertyDeclaration(decl) && !jshelpers.hasStaticModifier(decl)) {
            if (!decl.initializer) {
                continue;
            }

            let prop: VReg | string = "";
            let thisReg: VReg = pandaGen.getTemp();
            compiler.getThis(node, thisReg);

            compiler.compileExpression(decl.initializer);

            switch (decl.name.kind) {
                case ts.SyntaxKind.Identifier:
                case ts.SyntaxKind.StringLiteral:
                case ts.SyntaxKind.NumericLiteral: {
                    prop = jshelpers.getTextOfIdentifierOrLiteral(decl.name);
                    pandaGen.storeObjProperty(node, thisReg, prop);
                    break;
                }
                case ts.SyntaxKind.ComputedPropertyName: {
                    // need to store the init value first
                    let initVal: VReg = pandaGen.getTemp();
                    pandaGen.storeAccumulator(node, initVal);

                    prop = pandaGen.getTemp();
                    compiler.compileExpression(decl.name.expression);
                    pandaGen.storeAccumulator(node, prop);

                    pandaGen.loadAccumulator(node, initVal);
                    pandaGen.storeObjProperty(node, thisReg, prop);
                    pandaGen.freeTemps(initVal, prop);
                    break;
                }
                default:
                    throw new Error("Private Identifier has not been supported")

            }

            pandaGen.freeTemps(thisReg);
        }
    }
}

export function compileReturnThis4Ctor(compiler: Compiler, node: ts.ConstructorDeclaration, unreachableFlag: boolean) {
    let pandaGen = compiler.getPandaGen();

    if (unreachableFlag) {
        return;
    }

    let thisReg = pandaGen.getTemp();
    compiler.getThis(node, thisReg);
    pandaGen.loadAccumulator(node, thisReg);

    checkValidUseSuperBeforeSuper(compiler, node);

    pandaGen.return(node);
    pandaGen.freeTemps(thisReg);
}

export function compileConstructor(compiler: Compiler, node: ts.ConstructorDeclaration, unreachableFlag: boolean) {
    let pandaGen = compiler.getPandaGen();
    let members = node.parent!.members;

    for (let index = 0; index < members.length; index++) {
        let decl = members[index];
        if (ts.isPropertyDeclaration(decl) && !jshelpers.hasStaticModifier(decl)) {
            let lref = LReference.generateLReference(compiler, decl.name, true);
            if (decl.initializer) {
                compiler.compileExpression(decl.initializer);
            }
            lref.setValue();
        }
    }

    if (unreachableFlag) {
        return;
    }

    let thisReg = pandaGen.getTemp();

    compiler.getThis(node, thisReg);
    pandaGen.loadAccumulator(node, thisReg);
    checkValidUseSuperBeforeSuper(compiler, node);

    pandaGen.return(node);
    pandaGen.freeTemps(thisReg);
}

export function compileSuperCall(compiler: Compiler, node: ts.CallExpression, args: VReg[], hasSpread: boolean) {
    let pandaGen = compiler.getPandaGen();

    if (hasSpread) {
        let argArray = pandaGen.getTemp();
        createArrayFromElements(node, compiler, <ts.NodeArray<ts.Expression>>node.arguments, argArray);
        loadCtorObj(node, compiler);
        pandaGen.superCallSpread(node, argArray);
        pandaGen.freeTemps(argArray);
    } else {
        let num = args.length;
        loadCtorObj(node, compiler);
        pandaGen.superCall(node, num, num ? args : [getVregisterCache(pandaGen, CacheList.undefined)]);
    }

    let tmpReg = pandaGen.getTemp();
    pandaGen.storeAccumulator(node, tmpReg);

    checkValidUseSuperBeforeSuper(compiler, node);

    pandaGen.loadAccumulator(node, tmpReg);
    pandaGen.freeTemps(tmpReg);

    compiler.setThis(node);
}

function loadCtorObj(node: ts.CallExpression, compiler: Compiler) {
    let recorder = compiler.getRecorder();
    let pandaGen = compiler.getPandaGen();
    let nearestFunc = jshelpers.getContainingFunctionDeclaration(node);
    if (!nearestFunc) {
        return;
    }

    if (ts.isConstructorDeclaration(nearestFunc)) {
        pandaGen.loadAccumulator(node, getVregisterCache(pandaGen, CacheList.FUNC));
    } else {
        let curFuncScope = <FunctionScope>recorder.getScopeOfNode(nearestFunc);
        let level = curFuncScope.need2CreateLexEnv() ? 0 : -1;

        while (curFuncScope) {
            if (curFuncScope.need2CreateLexEnv()) {
                level += 1;
            }

            if (ts.isConstructorDeclaration(curFuncScope.getBindingNode())) {
                break;
            }

            curFuncScope = <FunctionScope>curFuncScope.getParentVariableScope();
        }

        let funcObj = <Variable>curFuncScope.findLocal(MandatoryFuncObj);
        pandaGen.loadLexicalVar(node, level, funcObj.lexIndex());
    }

}

export function extractCtorOfClass(stmt: ts.ClassLikeDeclaration) {
    let members = stmt.members;
    for (let index = 0; index < members.length; index++) {
        let member = members[index];
        if (ts.isConstructorDeclaration(member)) {
            return member;
        }
    }

    return undefined;
}

export function defineClassMember(
    propName: string | number | ts.ComputedPropertyName | undefined,
    propValue: ts.Node,
    propKind: PropertyKind,
    properties: Property[],
    namedPropertyMap: Map<string, Property>) {
    let staticFlag = false;
    if (propKind == PropertyKind.Computed || propKind == PropertyKind.Spread) {
        let prop = new Property(propKind, <ts.ComputedPropertyName | undefined>propName);
        prop.setValue(propValue);
        if (jshelpers.hasStaticModifier(propValue)) {
            staticFlag = true;
            properties.push(prop);
        } else {
            properties.unshift(prop);
        }
    } else {
        let name_str = propertyKeyAsString(<string | number>propName);
        if (!checkAndUpdateProperty(namedPropertyMap, name_str, propKind, propValue)) {
            let prop = new Property(propKind, propName);
            if (propKind == PropertyKind.Accessor) {
                if (ts.isGetAccessorDeclaration(propValue)) {
                    prop.setGetter(propValue);
                } else if (ts.isSetAccessorDeclaration(propValue)) {
                    prop.setSetter(propValue);
                }
            } else {
                prop.setValue(propValue);
            }
            if (jshelpers.hasStaticModifier(propValue)) {
                staticFlag = true;
                properties.push(prop);
            } else {
                properties.unshift(prop);
            }
            namedPropertyMap.set(name_str, prop);
        }
    }
    return staticFlag;
}

function compileHeritageClause(compiler: Compiler, node: ts.ClassLikeDeclaration) {
    let pandaGen = compiler.getPandaGen();
    let baseVreg = pandaGen.getTemp();
    if (node.heritageClauses && node.heritageClauses.length) {
        let heritageClause = node.heritageClauses[0];
        if (heritageClause.types.length) {
            let exp = heritageClause.types[0];
            compiler.compileExpression(exp.expression);
            pandaGen.storeAccumulator(exp.expression, baseVreg);
            return baseVreg;
        }
    }

    pandaGen.moveVreg(node, baseVreg, getVregisterCache(pandaGen, CacheList.HOLE));
    return baseVreg;
}

export function getClassNameForConstructor(classNode: ts.ClassLikeDeclaration) {
    let className = "";

    if (!isAnonymousClass(classNode)) {
        className = jshelpers.getTextOfIdentifierOrLiteral(classNode.name!);
    } else {
        if (ts.isClassDeclaration(classNode) && hasExportKeywordModifier(classNode) && hasDefaultKeywordModifier(classNode)) {
            return 'default';
        }

        let outerNode = findOuterNodeOfParenthesis(classNode);

        if (ts.isVariableDeclaration(outerNode)) {
            let decl = outerNode.name;
            if (ts.isIdentifier(decl)) {
                className = jshelpers.getTextOfIdentifierOrLiteral(decl);
            }
        } else if (ts.isBinaryExpression(outerNode)) {
            let leftExp = outerNode.left;
            if (outerNode.operatorToken.kind == ts.SyntaxKind.EqualsToken && ts.isIdentifier(leftExp)) {
                className = jshelpers.getTextOfIdentifierOrLiteral(leftExp);
            }
        } else if (ts.isPropertyAssignment(outerNode)) {
            let propName = outerNode.name;
            if (ts.isIdentifier(propName) || ts.isStringLiteral(propName) || ts.isNumericLiteral(propName)) {
                className = jshelpers.getTextOfIdentifierOrLiteral(propName);
            }
        } else if (ts.isExportAssignment(outerNode)) {
            className = 'default';
        }
    }

    return className;
}

function isAnonymousClass(node: ts.ClassLikeDeclaration) {
    return node.name ? false : true;
}

function generatePropertyFromExpr(node: ts.ClassLikeDeclaration, classFields: Array<ts.PropertyDeclaration>, namedPropertyMap: Map<string, Property>) {
    let properties: Array<Property> = [];
    let staticNum = 0;
    let constructNode: any;

    node.members.forEach(member => {
        switch (member.kind) {
            case ts.SyntaxKind.Constructor:
                constructNode = member;
                break;
            case ts.SyntaxKind.PropertyDeclaration: {
                if (!jshelpers.hasStaticModifier(member)) {
                    classFields.push(<ts.PropertyDeclaration>member);
                    break;
                }

                if (ts.isComputedPropertyName(member.name!)) {
                    if (defineClassMember(member.name, member, PropertyKind.Computed, properties, namedPropertyMap)) {
                        staticNum++;
                    }
                } else {
                    let memberName: number | string = <number | string>getPropName(member.name!);
                    let initializer = (<ts.PropertyDeclaration>member).initializer;
                    if (initializer) {
                        if (isConstantExpr(initializer)) {
                            if (defineClassMember(memberName, initializer, PropertyKind.Constant, properties, namedPropertyMap)) {
                                staticNum++;
                            }
                        } else {
                            if (defineClassMember(memberName, initializer, PropertyKind.Variable, properties, namedPropertyMap)) {
                                staticNum++;
                            }
                        }
                    } else {
                        initializer = ts.createIdentifier("undefined");
                        if (defineClassMember(memberName, initializer, PropertyKind.Constant, properties, namedPropertyMap)) {
                            staticNum++;
                        }
                    }
                }
                break;
            }
            case ts.SyntaxKind.MethodDeclaration: {
                let memberName = getPropName(member.name!);
                if (typeof (memberName) == 'string' || typeof (memberName) == 'number') {
                    if (defineClassMember(memberName, member, PropertyKind.Variable, properties, namedPropertyMap)) {
                        staticNum++;
                    }
                } else {
                    if (defineClassMember(memberName, member, PropertyKind.Computed, properties, namedPropertyMap)) {
                        staticNum++;
                    }
                }
                break;
            }
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor: {
                let accessorName = getPropName(member.name!);
                if (typeof (accessorName) == 'string' || typeof (accessorName) == 'number') {
                    if (defineClassMember(accessorName, member, PropertyKind.Accessor, properties, namedPropertyMap)) {
                        staticNum++;
                    }
                } else {
                    if (defineClassMember(accessorName, member, PropertyKind.Computed, properties, namedPropertyMap)) {
                        staticNum++;
                    }
                }
                break;
            }
            case ts.SyntaxKind.SemicolonClassElement:
            case ts.SyntaxKind.IndexSignature:
                break;
            default:
                throw new Error("Unreachable Kind");
        }
    });

    /**
     * If it is a non-static member, `unshift`; otherwise `push`
     * Need to reverse the order of non-static members
     */

    let staticItems = properties.slice(properties.length - staticNum)
    properties = properties.slice(0, properties.length - staticNum);
    properties = properties.reverse();
    properties.push(...staticItems);

    if (constructNode) {
        defineClassMember("constructor", constructNode, PropertyKind.Variable, properties, namedPropertyMap);
    }

    return properties;
}

function compileComputedProperty(compiler: Compiler, prop: Property, classReg: VReg, keyReg: VReg) {
    let pandaGen = compiler.getPandaGen();
    switch (prop.getValue().kind) {
        case ts.SyntaxKind.PropertyDeclaration: {
            let initializer = (<ts.PropertyDeclaration>prop.getValue()).initializer;
            if (initializer) {
                compiler.compileExpression(initializer);
                pandaGen.storeOwnProperty(prop.getValue(), classReg, keyReg);
            }
            break;
        }
        case ts.SyntaxKind.MethodDeclaration: {
            let protoReg = pandaGen.getTemp();
            let tmpReg = pandaGen.getTemp();
            let flag = createClassMethodOrAccessor(compiler, classReg, protoReg, tmpReg, <ts.MethodDeclaration>prop.getValue());
            pandaGen.storeOwnProperty(prop.getValue(), flag ? protoReg : classReg, keyReg, true);
            pandaGen.freeTemps(protoReg, tmpReg);
            break;
        }
        case ts.SyntaxKind.GetAccessor: {
            let accessorReg = pandaGen.getTemp();
            let getProtoReg = pandaGen.getTemp();
            let getter = <ts.GetAccessorDeclaration>prop.getValue();
            let getFlag = createClassMethodOrAccessor(compiler, classReg, getProtoReg, accessorReg, getter);
            pandaGen.defineGetterSetterByValue(getter, getFlag ? getProtoReg : classReg, keyReg, accessorReg, getVregisterCache(pandaGen, CacheList.undefined), true);
            pandaGen.freeTemps(accessorReg, getProtoReg);
            break;
        }
        case ts.SyntaxKind.SetAccessor: {
            let accesReg = pandaGen.getTemp();
            let setter = <ts.SetAccessorDeclaration>prop.getValue();
            let setProtoReg = pandaGen.getTemp();
            let setFlag = createClassMethodOrAccessor(compiler, classReg, setProtoReg, accesReg, setter);
            pandaGen.defineGetterSetterByValue(setter, setFlag ? setProtoReg : classReg, keyReg, getVregisterCache(pandaGen, CacheList.undefined), accesReg, true);
            pandaGen.freeTemps(accesReg, setProtoReg);
            break;
        }
        default:
            break;
    }
    pandaGen.freeTemps(keyReg);
}

function setClassAccessor(pandaGen: PandaGen, compiler: Compiler, objReg: VReg, prop: Property) {

    let getterReg = pandaGen.getTemp();
    let setterReg = pandaGen.getTemp();
    let propReg = pandaGen.getTemp();

    let tmpVreg = pandaGen.getTemp();
    let flag = false;
    let accessor: ts.GetAccessorDeclaration | ts.SetAccessorDeclaration;

    if (prop.getGetter() !== undefined) {
        let getter = <ts.GetAccessorDeclaration>prop.getGetter();
        accessor = getter;
        flag = createClassMethodOrAccessor(compiler, objReg, tmpVreg, getterReg, getter);
    }
    if (prop.getSetter() !== undefined) {
        let setter = <ts.SetAccessorDeclaration>prop.getSetter();
        accessor = setter;
        flag = createClassMethodOrAccessor(compiler, objReg, tmpVreg, setterReg, setter);
    }

    pandaGen.loadAccumulatorString(accessor!, String(prop.getName()));
    pandaGen.storeAccumulator(accessor!, propReg);

    if (prop.getGetter() !== undefined && prop.getSetter() !== undefined) {
        pandaGen.defineGetterSetterByValue(accessor!, flag ? tmpVreg : objReg, propReg, getterReg, setterReg, false);
    } else if (ts.isGetAccessorDeclaration(accessor!)) {
        pandaGen.defineGetterSetterByValue(accessor, flag ? tmpVreg : objReg, propReg, getterReg, getVregisterCache(pandaGen, CacheList.undefined), false);
    } else {
        pandaGen.defineGetterSetterByValue(accessor!, flag ? tmpVreg : objReg, propReg, getVregisterCache(pandaGen, CacheList.undefined), setterReg, false);
    }

    pandaGen.freeTemps(getterReg, setterReg, propReg, tmpVreg);
}

function createClassMethodOrAccessor(compiler: Compiler, classReg: VReg, propReg: VReg, storeReg: VReg,
    node: ts.MethodDeclaration | ts.GetAccessorDeclaration | ts.SetAccessorDeclaration | ts.ConstructorDeclaration) {
    let pandaGen = compiler.getPandaGen();
    if (jshelpers.hasStaticModifier(node)) {
        createMethodOrAccessor(pandaGen, compiler, classReg, node);
        pandaGen.storeAccumulator(node, storeReg);
        return false;
    }
    pandaGen.storeAccumulator(node, storeReg);
    pandaGen.loadObjProperty(node, classReg, "prototype");
    pandaGen.storeAccumulator(node, propReg);
    pandaGen.loadAccumulator(node, storeReg);
    createMethodOrAccessor(pandaGen, compiler, propReg, node);
    pandaGen.storeAccumulator(node, storeReg);
    return true;
}

function scalarArrayEquals(node1: ts.Node | undefined, node2: ts.Node | undefined) {
    if (node1 && node2) {
        let val1Modifs = node1.modifiers;
        let val2Modifs = node2.modifiers;
        if (val1Modifs && val2Modifs) {
            return val1Modifs.length == val2Modifs.length && val1Modifs.every(function (v, i) { return v === val2Modifs![i] });;
        }

        if (!val1Modifs && !val2Modifs) {
            return true;
        }
    } else if (!node1 && !node2) {
        return true;
    }

    return false;
}

export function setPrototypeAttributes(compiler: Compiler, node: ts.Node, classReg: VReg, propReg: VReg, storeReg: VReg) {
    let pandaGen = compiler.getPandaGen();
    pandaGen.storeAccumulator(node, storeReg);
    if (jshelpers.hasStaticModifier(node)) {
        return false;
    }
    pandaGen.loadObjProperty(node, classReg, "prototype");
    pandaGen.storeAccumulator(node, propReg);
    pandaGen.loadAccumulator(node, storeReg);
    return true;
}

function checkAndUpdateProperty(namedPropertyMap: Map<string, Property>, name: string, propKind: PropertyKind, valueNode: ts.Node): boolean {
    if (namedPropertyMap.has(name)) {
        let prop = namedPropertyMap.get(name);
        if (propKind == PropertyKind.Accessor) {
            if (ts.isGetAccessorDeclaration(valueNode)) {
                if (!scalarArrayEquals(prop!.getGetter(), valueNode)) {
                    return false;
                }
                prop!.setGetter(valueNode);
            } else if (ts.isSetAccessorDeclaration(valueNode)) {
                if (!scalarArrayEquals(prop!.getSetter(), valueNode)) {
                    return false;
                }
                prop!.setSetter(valueNode);
            }
        } else {
            if (!scalarArrayEquals(prop!.getValue(), valueNode)) {
                return false;
            }
            prop!.setValue(valueNode);
            prop!.setKind(propKind);
        }
        return true;
    }
    return false;
}

export function shouldReturnThisForConstruct(stmt: ts.ReturnStatement): boolean {
    let ctorNode = jshelpers.getContainingFunction(stmt);
    let expr = stmt.expression;
    if (!ctorNode || !ts.isConstructorDeclaration(ctorNode)) {
        return false;
    }

    if (!expr || isUndefinedIdentifier(expr) || expr.kind == ts.SyntaxKind.ThisKeyword) {
        return true;
    }

    return false;
}

export function compileSuperProperty(compiler: Compiler, expr: ts.Expression, thisReg: VReg, prop: VReg | string | number) {
    checkValidUseSuperBeforeSuper(compiler, expr);
    let pandaGen = compiler.getPandaGen();
    compiler.getThis(expr, thisReg);

    pandaGen.loadSuperProperty(expr, thisReg, prop);
}

export function checkValidUseSuperBeforeSuper(compiler: Compiler, node: ts.Node) {
    let pandaGen = compiler.getPandaGen();
    let ctorNode = jshelpers.findAncestor(node, ts.isConstructorDeclaration);

    if (!ctorNode || !ts.isClassLike(ctorNode.parent) || !jshelpers.getClassExtendsHeritageElement(ctorNode.parent)) {
        return;
    }

    let thisReg = pandaGen.getTemp();
    compiler.getThis(node, thisReg);
    pandaGen.loadAccumulator(node, thisReg);
    pandaGen.freeTemps(thisReg);

    if (jshelpers.isSuperProperty(node) ||
        ts.isConstructorDeclaration(node) ||
        node.kind == ts.SyntaxKind.ThisKeyword ||
        node.kind == ts.SyntaxKind.ReturnStatement) {
        pandaGen.throwIfSuperNotCorrectCall(ctorNode, 0);
    }

    if (jshelpers.isSuperCall(node)) {
        pandaGen.throwIfSuperNotCorrectCall(ctorNode, 1);
    }
}
