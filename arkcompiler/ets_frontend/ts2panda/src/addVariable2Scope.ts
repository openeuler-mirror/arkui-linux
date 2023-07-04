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
import { PrimitiveType } from "./base/typeSystem";
import { isBindingPattern } from "./base/util";
import { CmdOptions } from "./cmdOptions";
import * as jshelpers from "./jshelpers";
import { Recorder } from "./recorder";
import {
    CatchParameter,
    ClassDecl,
    ConstDecl,
    Decl,
    FuncDecl,
    InitStatus,
    LetDecl,
    Scope,
    VarDecl,
    VariableScope
} from "./scope";
import { isGlobalIdentifier } from "./syntaxCheckHelper";
import { TypeRecorder } from "./typeRecorder";
import {
    MandatoryArguments,
    MandatoryFuncObj,
    MandatoryNewTarget,
    MandatoryThis,
    VarDeclarationKind,
    Variable
} from "./variable";

function setVariableOrParameterType(node: ts.Node, v: Variable | undefined) {
    if (v) {
        let typeIndex = TypeRecorder.getInstance().tryGetVariable2Type(ts.getOriginalNode(node));
        if (typeIndex === PrimitiveType.ANY) {
            typeIndex = TypeRecorder.getInstance().tryGetTypeIndex(ts.getOriginalNode(node));
        }
        v.setTypeIndex(typeIndex);
    }
}

function setClassOrFunctionType(node: ts.Node, v: Variable | undefined) {
    if (v) {
        let typeIndex = TypeRecorder.getInstance().tryGetTypeIndex(ts.getOriginalNode(node));
        v.setTypeIndex(typeIndex);
    }
}

function setTypeIndex(node: ts.Node, v: Variable | undefined, isClassOrFunction: boolean) {
    if (isClassOrFunction) {
        setClassOrFunctionType(node, v);
    } else {
        setVariableOrParameterType(node, v);
    }
}

function addInnerArgs(node: ts.Node, scope: VariableScope, enableTypeRecord: boolean): void {
    // the first argument for js function is func_obj
    scope.addParameter(MandatoryFuncObj, VarDeclarationKind.CONST, -1);
    // the second argument for newTarget

    if (node.kind == ts.SyntaxKind.ArrowFunction) {
        scope.addParameter("0newTarget", VarDeclarationKind.CONST, -1);
        scope.addParameter("0this", VarDeclarationKind.CONST, 0);
    } else {
        scope.addParameter(MandatoryNewTarget, VarDeclarationKind.CONST, -1);
        scope.addParameter(MandatoryThis, VarDeclarationKind.CONST, 0);
    }

    if (CmdOptions.isCommonJs() && node.kind === ts.SyntaxKind.SourceFile) {
        scope.addParameter("exports", VarDeclarationKind.LET, 1);
        scope.addParameter("require", VarDeclarationKind.LET, 2);
        scope.addParameter("module", VarDeclarationKind.LET, 3);
        scope.addParameter("__filename", VarDeclarationKind.LET, 4);
        scope.addParameter("__dirname", VarDeclarationKind.LET, 5);
    }

    if (node.kind != ts.SyntaxKind.SourceFile) {
        let funcNode = <ts.FunctionLikeDeclaration>node;
        addParameters(funcNode, scope, enableTypeRecord);
    }

    if (scope.getUseArgs() || CmdOptions.isDebugMode()) {
        if (ts.isArrowFunction(node)) {
            let parentVariableScope = <VariableScope>scope.getParentVariableScope();
            parentVariableScope.add(MandatoryArguments, VarDeclarationKind.CONST, InitStatus.INITIALIZED);
            parentVariableScope.setUseArgs(true);
            scope.setUseArgs(false);
        } else if (scope.getUseArgs()){
            if (!scope.findLocal(MandatoryArguments)) {
                scope.add(MandatoryArguments, VarDeclarationKind.CONST, InitStatus.INITIALIZED);
            }
        }
    }
}

export function addVariableToScope(recorder: Recorder, enableTypeRecord: boolean) {
    let scopeMap = recorder.getScopeMap();
    let hoistMap = recorder.getHoistMap();

    scopeMap.forEach((scope, node) => {
        let hoistDecls = [];
        if (scope instanceof VariableScope) {
            addInnerArgs(node, scope, enableTypeRecord);

            hoistDecls = <Decl[]>hoistMap.get(scope);
            if (hoistDecls) {
                hoistDecls.forEach(hoistDecl => {
                    let v: Variable | undefined;
                    if (hoistDecl instanceof VarDecl) {
                        v = scope.add(hoistDecl, VarDeclarationKind.VAR);
                    } else if (hoistDecl instanceof FuncDecl) {
                        v = scope.add(hoistDecl, VarDeclarationKind.FUNCTION);
                    } else {
                        throw new Error("Wrong type of declaration to be hoisted")
                    }

                    if (enableTypeRecord) {
                        setTypeIndex(hoistDecl.node, v, hoistDecl instanceof FuncDecl);
                    }
                })
            }
        }


        let decls = scope.getDecls();
        let nearestVariableScope = <VariableScope>scope.getNearestVariableScope();
        hoistDecls = <Decl[]>hoistMap.get(nearestVariableScope);
        for (let j = 0; j < decls.length; j++) {
            let decl = decls[j];
            // @ts-ignore
            if (hoistDecls && hoistDecls.includes(decl)) {
                continue;
            }
            let v: Variable | undefined;
            if (decl instanceof LetDecl) {
                v = scope.add(decl, VarDeclarationKind.LET, InitStatus.UNINITIALIZED);
            } else if (decl instanceof ConstDecl) {
                v = scope.add(decl, VarDeclarationKind.CONST, InitStatus.UNINITIALIZED);
            } else if (decl instanceof FuncDecl) {
                let funcNode = decl.node;
                if (ts.isFunctionDeclaration(funcNode)) {
                    v = scope.add(decl, VarDeclarationKind.FUNCTION);
                } else if (ts.isFunctionExpression(funcNode)) {
                    let functionScope = <Scope>recorder.getScopeOfNode(funcNode);
                    v = functionScope.add(decl, VarDeclarationKind.FUNCTION);
                }
            } else if (decl instanceof CatchParameter) {
                v = scope.add(decl, VarDeclarationKind.LET);
            } else if (decl instanceof ClassDecl) {
                let classNode = decl.node;
                if (ts.isClassDeclaration(classNode)) {
                    v = scope.add(decl, VarDeclarationKind.CLASS, InitStatus.UNINITIALIZED);
                } else {
                    let classScope = <Scope>recorder.getScopeOfNode(classNode);
                    v = classScope.add(decl, VarDeclarationKind.CLASS, InitStatus.UNINITIALIZED);
                }
            } else {
                /**
                 * Case 1: var declaration share a same name with function declaration, then
                 * function declaration will be hoisted and the var declaration will be left be.
                 * Case 2: "var undefined" in global scope is not added to hoistDecls,
                 * but it should be added to scope
                 */
                if (isGlobalIdentifier(decls[j].name)) {
                    v = scope.add(decls[j].name, VarDeclarationKind.VAR);
                }
            }
            if (enableTypeRecord) {
                setTypeIndex(decl.node, v, decl instanceof ClassDecl || decl instanceof FuncDecl);
            }
        }
    })
}

function addParameters(node: ts.FunctionLikeDeclaration, scope: VariableScope, enableTypeRecord: boolean): void {
    let patternParams: Array<ts.BindingPattern> = new Array<ts.BindingPattern>();
    for (let i = 0; i < node.parameters.length; ++i) {
        let param = node.parameters[i];
        let name: string = '';
        if (isBindingPattern(param.name)) {
            patternParams.push(<ts.BindingPattern>param.name);
            name = i.toString() + "pattern";
        } else if (ts.isIdentifier(param.name)) {
            name = jshelpers.getTextOfIdentifierOrLiteral(<ts.Identifier>param.name);
        }

        let v = scope.addParameter(name, VarDeclarationKind.VAR, i + 1);

        if (enableTypeRecord) {
            setTypeIndex(param.name, v, false);
        }
    }

    for (let i = 0; i < patternParams.length; i++) {
        addPatternParamterElements(patternParams[i], scope);
    }
}

function addPatternParamterElements(pattern: ts.BindingPattern, scope: VariableScope) {
    let name: string = '';
    pattern.elements.forEach(bindingElement => {
        if (ts.isOmittedExpression(bindingElement)) {
            return;
        }

        bindingElement = <ts.BindingElement>bindingElement;
        if (ts.isIdentifier(bindingElement.name)) {
            name = jshelpers.getTextOfIdentifierOrLiteral(bindingElement.name);
            scope.add(name, VarDeclarationKind.VAR);
        } else if (isBindingPattern(bindingElement.name)) {
            let innerPattern = <ts.BindingPattern>bindingElement.name;
            addPatternParamterElements(innerPattern, scope);
        }
    });
}
