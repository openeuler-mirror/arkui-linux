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

import { PandaGen } from "src/pandagen";
import * as ts from "typescript";
import { Compiler } from "../compiler";
import { compileDestructuring } from "../compilerUtils";
import { DiagnosticCode, DiagnosticError } from "../diagnostic";
import { getObjAndProp } from "../expression/memberAccessExpression";
import { findInnerExprOfParenthesis } from "../expression/parenthesizedExpression";
import { VReg } from "../irnodes";
import * as jshelpers from "../jshelpers";
import { Scope } from "../scope";
import { VarDeclarationKind, Variable } from "../variable";
import { isBindingOrAssignmentPattern } from "./util";

enum ReferenceKind { MemberAccess, LocalOrGlobal, Destructuring };
export class LReference {
    private node: ts.Node;
    private compiler: Compiler;
    private refKind: ReferenceKind;
    private isDeclaration: boolean;
    private obj: VReg | undefined = undefined;
    private prop: VReg | undefined = undefined;
    private propLiteral: string | number | undefined = undefined;
    readonly variable: { scope: Scope | undefined, level: number, v: Variable | undefined } | undefined;
    private destructuringTarget: ts.BindingOrAssignmentPattern | undefined;

    constructor(
        node: ts.Node,
        compiler: Compiler,
        isDeclaration: boolean,
        refKind: ReferenceKind,
        variable: { scope: Scope | undefined, level: number, v: Variable | undefined } | undefined) {
        this.node = node;
        this.compiler = compiler;
        this.isDeclaration = isDeclaration;
        this.refKind = refKind;

        if (refKind == ReferenceKind.Destructuring) {
            this.destructuringTarget = <ts.BindingOrAssignmentPattern>node;
        } else if (refKind == ReferenceKind.LocalOrGlobal) {
            this.variable = variable!;
        } else if (refKind == ReferenceKind.MemberAccess) {
            this.obj = compiler.getPandaGen().getTemp();
            this.prop = compiler.getPandaGen().getTemp();
        }
    }

    getValue() {
        let pandaGen = this.compiler.getPandaGen();
        switch (this.refKind) {
            case ReferenceKind.MemberAccess:
                let prop: VReg | number | string;
                if (this.propLiteral === undefined) {
                    prop = <VReg>this.prop!;
                } else {
                    prop = this.propLiteral;
                }
                pandaGen.loadObjProperty(this.node, <VReg>this.obj, prop);
                return;
            case ReferenceKind.LocalOrGlobal:
                this.compiler.loadTarget(this.node, this.variable!);
                return;
            case ReferenceKind.Destructuring:
                throw new Error("Destructuring target can't be loaded");
            default:
                throw new Error("Invalid LReference kind to GetValue")
        }
    }

    setValue() {
        let pandaGen = this.compiler.getPandaGen();
        switch (this.refKind) {
            case ReferenceKind.MemberAccess: {
                let prop: VReg | number | string
                if (this.propLiteral === undefined) {
                    prop = <VReg>this.prop!;
                } else {
                    prop = this.propLiteral;
                }
                if (jshelpers.isSuperProperty(<ts.ElementAccessExpression | ts.PropertyAccessExpression>this.node)) {
                    let thisReg = pandaGen.getTemp();
                    this.compiler.getThis(this.node, thisReg);
                    pandaGen.storeSuperProperty(this.node, thisReg, prop);
                    pandaGen.freeTemps(thisReg);
                } else {
                    pandaGen.storeObjProperty(this.node, <VReg>this.obj, prop);
                }
                pandaGen.freeTemps(...[<VReg>this.obj, <VReg>this.prop]);
                return;
            }
            case ReferenceKind.LocalOrGlobal:
                this.compiler.storeTarget(this.node, this.variable!, this.isDeclaration);
                return;
            case ReferenceKind.Destructuring:
                compileDestructuring(<ts.BindingOrAssignmentPattern>this.destructuringTarget, pandaGen, this.compiler);
                return;
            default:
                throw new Error("Invalid LReference kind to SetValue")
        }
    }

    setObjectAndProperty(pandaGen: PandaGen, obj: VReg, prop: VReg | number | string) {
        if (!jshelpers.isSuperProperty(this.node)) {
            pandaGen.moveVreg(this.node, <VReg>this.obj, obj);
        }

        if (prop instanceof VReg) {
            pandaGen.moveVreg(this.node, <VReg>this.prop, prop);
            return;
        }

        this.propLiteral = <string | number>prop;
    }

    static generateLReference(compiler: Compiler, node: ts.Node, isDeclaration: boolean): LReference {
        let pandaGen = compiler.getPandaGen();

        let realNode: ts.Node = node;

        realNode = ts.skipPartiallyEmittedExpressions(node);

        if (ts.isParenthesizedExpression(realNode)) {
            realNode = findInnerExprOfParenthesis(realNode);
        }

        if (ts.isIdentifier(realNode)) {
            let name = jshelpers.getTextOfIdentifierOrLiteral(<ts.Identifier>realNode);
            let variable = compiler.getCurrentScope().find(name);
            if (!variable.v) {
                // @ts-ignore
                if (ts.isGeneratedIdentifier(realNode)) {
                    variable.v = compiler.getCurrentScope().add(name, VarDeclarationKind.VAR);
                } else {
                    variable.v = compiler.getCurrentScope().add(name, VarDeclarationKind.NONE);
                }
            }

            return new LReference(realNode, compiler, isDeclaration, ReferenceKind.LocalOrGlobal, variable);
        }

        if (ts.isPropertyAccessExpression(realNode) || ts.isElementAccessExpression(realNode)) {
            let lref = new LReference(realNode, compiler, false, ReferenceKind.MemberAccess, undefined);
            let objReg = pandaGen.getTemp();
            let propReg = pandaGen.getTemp();
            let { obj: object, prop: property } = getObjAndProp(realNode, objReg, propReg, compiler);
            lref.setObjectAndProperty(pandaGen, object, property);
            pandaGen.freeTemps(objReg, propReg);
            return lref;
        }

        if (ts.isVariableDeclarationList(realNode)) {
            let decls = realNode.declarations;
            if (decls.length != 1) {
                throw new Error("Malformed variable declaration");
            }
            return LReference.generateLReference(compiler, decls[0].name, true);
        }

        if (isBindingOrAssignmentPattern(realNode)) {
            return new LReference(realNode, compiler, isDeclaration, ReferenceKind.Destructuring, undefined);
        }

        throw new DiagnosticError(
            node,
            DiagnosticCode.The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access
        );
    }
}

