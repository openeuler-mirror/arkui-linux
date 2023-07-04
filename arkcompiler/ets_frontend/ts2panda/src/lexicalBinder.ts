/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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
import { CmdOptions } from "./cmdOptions";
import * as jshelpers from "./jshelpers";
import { Recorder } from "./recorder";
import {
    GlobalScope,
    Scope,
    VariableScope
} from "./scope";
import {
    isMandatoryParam,
    MandatoryArguments,
    MandatoryFuncObj,
    MandatoryNewTarget,
    MandatoryThis,
    VarDeclarationKind
} from "./variable";


export class LexicalBinder {
    private srcFile: ts.SourceFile;
    private recorder: Recorder;
    constructor(src: ts.SourceFile, recorder: Recorder) {
        this.srcFile = src;
        this.recorder = recorder;
    }

    resolve() {
        this.resolveIdentReference(this.srcFile, this.recorder.getScopeOfNode(this.srcFile));
    }

    resolveIdentReference(node: ts.Node, scope: Scope) {
        node.forEachChild((child) => {
            let tmp = this.recorder.getScopeOfNode(child);
            let newScope = tmp ? tmp : scope;
            switch (child.kind) {
                case ts.SyntaxKind.Identifier: { // 79
                    if (this.hasDeclarationParent(<ts.Identifier>child) || this.isPropertyName(<ts.Identifier>child)) {
                        break;
                    }

                    this.lookUpLexicalReference(jshelpers.getTextOfIdentifierOrLiteral(<ts.Identifier>child), newScope);
                    break;
                }
                case ts.SyntaxKind.SuperKeyword: {
                    let enclosingVariableScope = newScope.getNearestVariableScope();
                    if (!ts.isArrowFunction(enclosingVariableScope.getBindingNode())) {
                        this.resolveIdentReference(child, newScope);
                        break;
                    }
                    enclosingVariableScope = enclosingVariableScope.getParentVariableScope();
                    while (enclosingVariableScope) {
                        if (!ts.isArrowFunction(enclosingVariableScope.getBindingNode())) {
                            break;
                        }

                        enclosingVariableScope = enclosingVariableScope.getParentVariableScope();
                    }

                    this.setMandatoryParamLexical(MandatoryFuncObj, enclosingVariableScope);
                    this.setMandatoryParamLexical(MandatoryThis, enclosingVariableScope);
                    this.resolveIdentReference(child, newScope);
                    break;
                }
                case ts.SyntaxKind.ThisKeyword: { // 108
                    let enclosingVariableScope = newScope.getNearestVariableScope();
                    if (!ts.isArrowFunction(enclosingVariableScope.getBindingNode())) {
                        this.resolveIdentReference(child, newScope);
                        break;
                    }

                    this.lookUpLexicalReference(MandatoryThis, enclosingVariableScope);
                    this.resolveIdentReference(child, newScope);
                    break;
                }
                case ts.SyntaxKind.Constructor: { // 169
                    if (!(<ts.ConstructorDeclaration>child).parent.heritageClauses) {
                        this.resolveIdentReference(child, newScope);
                        break;
                    }

                    if (!(<VariableScope>newScope).hasAfChild() &&
                        ((<VariableScope>newScope).getChildVariableScope().length > 0)) {
                        this.resolveIdentReference(child, newScope);
                        break;
                    }

                    this.setMandatoryParamLexical(MandatoryFuncObj, <VariableScope>newScope);
                    this.setMandatoryParamLexical(MandatoryThis, <VariableScope>newScope);
                    this.resolveIdentReference(child, newScope);
                    break;
                }
                case ts.SyntaxKind.ArrowFunction: { //212
                    this.setMandatoryParamLexicalForNCFuncInDebug(<VariableScope>newScope);
                    this.resolveIdentReference(child, newScope);
                    break;
                }
                case ts.SyntaxKind.MetaProperty: { // 229
                    let id: string = jshelpers.getTextOfIdentifierOrLiteral((<ts.MetaProperty>child).name);
                    if (id != "target") {
                        this.resolveIdentReference(child, newScope);
                        break;
                    }

                    let enclosingVariableScope = newScope.getNearestVariableScope();
                    if (!ts.isArrowFunction(enclosingVariableScope.getBindingNode())) {
                        this.resolveIdentReference(child, newScope);
                        break;
                    }

                    this.lookUpLexicalReference(MandatoryNewTarget, enclosingVariableScope);
                    this.resolveIdentReference(child, newScope);
                    break;
                }
                default: {
                    this.resolveIdentReference(child, newScope);
                }
            }
        });
    }

    lookUpLexicalReference(name: string, scope: Scope) {
        let declPosInfo = scope.resolveDeclPos(name);
        if (!declPosInfo.isLexical) { // if find declaration position in the current function
            return;
        }

        if (isMandatoryParam(name)) {
            declPosInfo.v.setLexVar(declPosInfo.defLexicalScope);
            return;
        }

        // Gloabl declaration should not be set lexical, otherwise redundant lexical env will be created in main
        if (declPosInfo.scope instanceof GlobalScope) {
            return;
        }

        declPosInfo.v.setLexVar(declPosInfo.defLexicalScope);
    }

    setMandatoryParamLexical(name: string, scope: VariableScope) {
        if (ts.isArrowFunction(scope.getBindingNode())) {
            throw new Error("Arrow function should not be processed");
        }

        let v = scope.findLocal(name);
        v.setLexVar(scope);
    }

    setMandatoryParamLexicalForNCFuncInDebug(scope: VariableScope) {
        if (!ts.isArrowFunction(scope.getBindingNode())) {
            throw new Error("Non-ArrowFunction should not be processed");
        }

        if (!CmdOptions.isDebugMode()) {
            return;
        }

        let newTargetPosInfo = scope.resolveDeclPos(MandatoryNewTarget);
        if (!newTargetPosInfo.isLexical) {
            throw new Error("4newTarget must be lexical");
        }
        newTargetPosInfo.v.setLexVar(newTargetPosInfo.defLexicalScope);

        let thisPosInfo = scope.resolveDeclPos(MandatoryThis);
        if (!thisPosInfo.isLexical) {
            throw new Error("This must be lexical");
        }
        thisPosInfo.v.setLexVar(thisPosInfo.defLexicalScope);

        let curScope: VariableScope = scope;
        while (curScope) {
            if (!ts.isArrowFunction(curScope.getBindingNode())) {
                break;
            }

            curScope = curScope.getParentVariableScope();
        }

        let v = undefined;
        if (curScope.getUseArgs()) {
            v = curScope.findLocal(MandatoryArguments);
        } else {
            v = curScope.add(MandatoryArguments, VarDeclarationKind.CONST);
        }
        v.setLexVar(curScope);
    }

    hasDeclarationParent(id: ts.Identifier): boolean {
        let parent = id.parent;
        if (ts.isBindingElement(parent) &&
            parent.name == id) {
            while (parent && !ts.isVariableDeclaration(parent)) {
                parent = parent.parent;
            }

            return parent ? true : false;
        }

        if ((ts.isVariableDeclaration(parent) || ts.isClassDeclaration(parent) ||
             ts.isClassExpression(parent) || ts.isFunctionLike(parent))
             && parent.name == id) {
            return true;
        }

        return false;
    }

    isPropertyName(id: ts.Identifier) {
        let parent = id.parent;
        if (ts.isPropertyAccessExpression(parent) && (parent.name == id)) { // eg. a.b -> b is the property name
            return true;
        }

        return false;
    }
}