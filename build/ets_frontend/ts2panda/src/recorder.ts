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
import * as astutils from "./astutils";
import {
    hasDefaultKeywordModifier,
    hasExportKeywordModifier,
    isAnonymousFunctionDefinition
} from "./base/util";
import { CmdOptions } from "./cmdOptions";
import { CompilerDriver } from "./compilerDriver";
import { DiagnosticCode, DiagnosticError } from "./diagnostic";
import { findOuterNodeOfParenthesis } from "./expression/parenthesizedExpression";
import * as jshelpers from "./jshelpers";
import { LOGD } from "./log";
import { ModuleStmt } from "./modules";  // [delete it when type system adapts for ESM]
import {
    CatchParameter,
    ClassDecl,
    ConstDecl,
    Decl,
    FuncDecl,
    FunctionParameter,
    FunctionScope,
    GlobalScope,
    LetDecl,
    LocalScope,
    LoopScope,
    ModuleScope,
    ModuleVarKind,
    Scope,
    VarDecl,
    VariableScope
} from "./scope";
import {
    AddCtor2Class,
    getClassNameForConstructor,
    extractCtorOfClass
} from "./statement/classStatement";
import { checkSyntaxError } from "./syntaxChecker";
import { isGlobalIdentifier, isFunctionLikeDeclaration } from "./syntaxCheckHelper";
import { TypeChecker } from "./typeChecker";
import { MandatoryArguments, VarDeclarationKind } from "./variable";

export class Recorder {
    node: ts.Node;
    scope: Scope;
    compilerDriver: CompilerDriver;
    recordType: boolean;
    private scopeMap: Map<ts.Node, Scope> = new Map<ts.Node, Scope>();
    private hoistMap: Map<Scope, Decl[]> = new Map<Scope, Decl[]>();
    private parametersMap: Map<ts.FunctionLikeDeclaration, FunctionParameter[]> = new Map<ts.FunctionLikeDeclaration, FunctionParameter[]>();
    private funcNameMap: Map<string, number>;
    private class2Ctor: Map<ts.ClassLikeDeclaration, ts.ConstructorDeclaration> = new Map<ts.ClassLikeDeclaration, ts.ConstructorDeclaration>();
    private isTsFile: boolean;
    // [delete it when type system adapts for ESM]
    private importStmts: Array<ModuleStmt> = [];
    private exportStmts: Array<ModuleStmt> = [];
    private syntaxCheckStatus: boolean;

    constructor(node: ts.Node, scope: Scope, compilerDriver: CompilerDriver, recordType: boolean, isTsFile: boolean, syntaxCheckStatus: boolean) {
        this.node = node;
        this.scope = scope;
        this.compilerDriver = compilerDriver;
        this.recordType = recordType;
        this.funcNameMap = new Map<string, number>();
        this.funcNameMap.set("main", 1);
        this.isTsFile = isTsFile;
        this.syntaxCheckStatus = syntaxCheckStatus;
    }

    record() {
        this.setParent(this.node);
        this.setScopeMap(this.node, this.scope);
        this.recordInfo(this.node, this.scope);
        return this.node;
    }

    getCtorOfClass(node: ts.ClassLikeDeclaration) {
        return this.class2Ctor.get(node);
    }

    setCtorOfClass(node: ts.ClassLikeDeclaration, ctor: ts.ConstructorDeclaration) {
        if (!this.class2Ctor.has(node)) {
            this.class2Ctor.set(node, ctor);
        }
    }

    private setParent(node: ts.Node) {
        node.forEachChild(childNode => {
            if (!this.isTsFile || childNode!.parent == undefined || childNode.parent.kind != node.kind) {
                childNode = jshelpers.setParent(childNode, node)!;
                let originNode = ts.getOriginalNode(childNode);
                childNode = ts.setTextRange(childNode, originNode);
            }
            this.setParent(childNode);
        });
    }

    private recordInfo(node: ts.Node, scope: Scope) {
        node.forEachChild(childNode => {
            if (this.syntaxCheckStatus) {
                checkSyntaxError(childNode, scope);
            }
            switch (childNode.kind) {
                case ts.SyntaxKind.FunctionExpression:
                case ts.SyntaxKind.MethodDeclaration:
                case ts.SyntaxKind.Constructor:
                case ts.SyntaxKind.GetAccessor:
                case ts.SyntaxKind.SetAccessor:
                case ts.SyntaxKind.ArrowFunction: {
                    let functionScope = this.buildVariableScope(scope, <ts.FunctionLikeDeclaration>childNode);
                    this.recordOtherFunc(<ts.FunctionLikeDeclaration>childNode, functionScope);
                    this.recordInfo(childNode, functionScope);
                    break;
                }
                case ts.SyntaxKind.FunctionDeclaration: {
                    let functionScope = this.buildVariableScope(scope, <ts.FunctionLikeDeclaration>childNode);
                    let isExport: boolean = false;
                    if (hasExportKeywordModifier(childNode)) {
                        if (!CmdOptions.isModules()) {
                            throw new DiagnosticError(childNode, DiagnosticCode.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none, jshelpers.getSourceFileOfNode(childNode));
                        }
                        this.recordEcmaExportInfo(<ts.FunctionDeclaration>childNode, scope);
                        isExport = true;
                    }
                    // recordFuncDecl must behind recordEcmaExportInfo() cause function without name
                    // should be SyntaxChecked in recordEcmaExportInfo
                    this.recordFuncDecl(<ts.FunctionDeclaration>childNode, scope, isExport);
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode);
                    }
                    this.recordInfo(childNode, functionScope);
                    break;
                }
                case ts.SyntaxKind.Block:
                case ts.SyntaxKind.IfStatement:
                case ts.SyntaxKind.SwitchStatement:
                case ts.SyntaxKind.LabeledStatement:
                case ts.SyntaxKind.ThrowStatement:
                case ts.SyntaxKind.TryStatement:
                case ts.SyntaxKind.CatchClause: {
                    let localScope = new LocalScope(scope);
                    this.setScopeMap(childNode, localScope);
                    this.recordInfo(childNode, localScope);
                    break;
                }
                case ts.SyntaxKind.DoStatement:
                case ts.SyntaxKind.WhileStatement:
                case ts.SyntaxKind.ForStatement:
                case ts.SyntaxKind.ForInStatement:
                case ts.SyntaxKind.ForOfStatement: {
                    let loopScope: LoopScope = new LoopScope(scope);;
                    this.setScopeMap(childNode, loopScope);
                    this.recordInfo(childNode, loopScope);
                    break;
                }
                case ts.SyntaxKind.ClassDeclaration: {
                    let isExport: boolean = false;
                    if (hasExportKeywordModifier(childNode)) {
                        if (!CmdOptions.isModules()) {
                            throw new DiagnosticError(childNode, DiagnosticCode.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none, jshelpers.getSourceFileOfNode(childNode));
                        }
                        this.recordEcmaExportInfo(<ts.ClassDeclaration>childNode, scope);
                        isExport = true;
                    }
                    this.recordClassInfo(<ts.ClassLikeDeclaration>childNode, scope, isExport);
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode);
                    }
                    break;
                }
                case ts.SyntaxKind.ClassExpression: {
                    this.recordClassInfo(<ts.ClassLikeDeclaration>childNode, scope, false);
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode);
                    }
                    break;
                }
                case ts.SyntaxKind.InterfaceDeclaration: {
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode);
                    }
                    break;
                }
                case ts.SyntaxKind.Identifier: {
                    this.recordVariableDecl(<ts.Identifier>childNode, scope);
                    break;
                }
                case ts.SyntaxKind.ImportDeclaration: {
                    if (!CmdOptions.isModules()) {
                        throw new DiagnosticError(childNode, DiagnosticCode.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none, jshelpers.getSourceFileOfNode(childNode));
                    }
                    this.recordEcmaImportInfo(<ts.ImportDeclaration>childNode, scope);

                    let importStmt = this.recordImportInfo(<ts.ImportDeclaration>childNode); // [delete it when type system adapts for ESM]
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode, importStmt);
                    }
                    break;
                }
                case ts.SyntaxKind.ExportDeclaration: {
                    if (!CmdOptions.isModules()) {
                        throw new DiagnosticError(childNode, DiagnosticCode.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none, jshelpers.getSourceFileOfNode(childNode));
                    }
                    this.recordEcmaExportInfo(<ts.ExportDeclaration>childNode, scope);

                    let exportStmt = this.recordExportInfo(<ts.ExportDeclaration>childNode); // [delete it when type system adapts for ESM]
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode, exportStmt);
                    }
                    break;
                }
                case ts.SyntaxKind.ExportAssignment: {
                    if (!CmdOptions.isModules()) {
                        throw new DiagnosticError(childNode, DiagnosticCode.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none, jshelpers.getSourceFileOfNode(childNode));
                    }
                    this.recordEcmaExportInfo(<ts.ExportAssignment>childNode, scope);

                    this.recordInfo(childNode, scope);
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode);
                    }
                    break;
                }
                case ts.SyntaxKind.VariableStatement: {
                    if (hasExportKeywordModifier(childNode)) {
                        if (!CmdOptions.isModules()) {
                            throw new DiagnosticError(childNode, DiagnosticCode.Cannot_use_imports_exports_or_module_augmentations_when_module_is_none, jshelpers.getSourceFileOfNode(childNode));
                        }
                        this.recordEcmaExportInfo(<ts.VariableStatement>childNode, scope);
                    }
                    if (this.recordType) {
                        TypeChecker.getInstance().formatNodeType(childNode);
                    }
                    this.recordInfo(childNode, scope);
                    break;
                }
                default:
                    this.recordInfo(childNode, scope);
            }
        });
    }

    private recordClassInfo(childNode: ts.ClassLikeDeclaration, scope: Scope, isExport: boolean) {
        let localScope = new LocalScope(scope);
        this.setScopeMap(childNode, localScope);
        let ctor = extractCtorOfClass(childNode);
        if (!ctor) {
            AddCtor2Class(this, childNode, localScope);
        } else {
            this.setCtorOfClass(childNode, ctor);
        }

        let name: string =  childNode.name ? jshelpers.getTextOfIdentifierOrLiteral(childNode.name) : "*default*";

        let moduleKind = isExport ? ModuleVarKind.EXPORTED : ModuleVarKind.NOT;
        let classDecl = new ClassDecl(name, childNode, moduleKind);
        scope.setDecls(classDecl);
        this.recordInfo(childNode, localScope);
    }

    buildVariableScope(curScope: Scope, node: ts.FunctionLikeDeclaration) {
        let functionScope = new FunctionScope(curScope, <ts.FunctionLikeDeclaration>node);
        let parentVariableScope = <VariableScope>curScope.getNearestVariableScope();
        functionScope.setParentVariableScope(parentVariableScope);
        parentVariableScope.addChildVariableScope(functionScope);
        this.setScopeMap(node, functionScope);
        return functionScope;
    }

    private recordVariableDecl(id: ts.Identifier, scope: Scope) {
        let name = jshelpers.getTextOfIdentifierOrLiteral(id);
        let parent = this.getDeclarationNodeOfId(id);

        if (parent) {
            let declKind = astutils.getVarDeclarationKind(<ts.VariableDeclaration>parent);
            let isExportDecl: boolean = false;
            if ((<ts.VariableDeclaration>parent).parent.parent.kind == ts.SyntaxKind.VariableStatement) {
                isExportDecl = hasExportKeywordModifier((<ts.VariableDeclaration>parent).parent.parent);
            }

            // collect declaration information to corresponding scope
            let decl = this.addVariableDeclToScope(scope, id, parent, name, declKind, isExportDecl);
            if (declKind == VarDeclarationKind.VAR) {
                let variableScopeParent = <VariableScope>scope.getNearestVariableScope();
                this.collectHoistDecls(id, variableScopeParent, decl);
            }
        } else {
            let declScope = scope.findDeclPos(name);
            if (declScope) {
                let decl = <Decl>declScope.getDecl(name);

                if ((decl instanceof LetDecl || decl instanceof ConstDecl)) {
                    let nearestRefVariableScope = <VariableScope>scope.getNearestVariableScope();
                    let nearestDefLexicalScope = <VariableScope | LoopScope>declScope.getNearestLexicalScope();

                    let tmp: Scope | undefined = nearestRefVariableScope.getNearestLexicalScope();
                    let needCreateLoopEnv: boolean = false;
                    if (nearestDefLexicalScope instanceof LoopScope) {
                        while (tmp) {
                            if (tmp == nearestDefLexicalScope) {
                                needCreateLoopEnv = true;
                                break;
                            }

                            tmp = tmp.getParent();
                        }

                        if (needCreateLoopEnv) {
                            nearestDefLexicalScope.pendingCreateEnv();
                        }
                    }
                }
            }
        }

        if (name == MandatoryArguments) {
            let varialbeScope = scope.getNearestVariableScope();
            varialbeScope?.setUseArgs(true);
        }
    }

    private addVariableDeclToScope(scope: Scope, node: ts.Node, parent: ts.Node, name: string, declKind: VarDeclarationKind, isExportDecl: boolean): Decl {
        let moduleKind = isExportDecl ? ModuleVarKind.EXPORTED : ModuleVarKind.NOT;
        let decl = new VarDecl(name, node, moduleKind);

        switch (declKind) {
            case VarDeclarationKind.VAR:
                break;
            case VarDeclarationKind.LET:
                    if (parent.parent.kind == ts.SyntaxKind.CatchClause) {
                    decl = new CatchParameter(name, node);
                } else {
                    decl = new LetDecl(name, node, moduleKind);
                }
                break;
            case VarDeclarationKind.CONST:
                decl = new ConstDecl(name, node, moduleKind);
                break;
            default:
                throw new Error("Wrong type of declaration");
        }
        scope.setDecls(decl);
        return decl;
    }

    private getDeclarationNodeOfId(id: ts.Identifier): ts.VariableDeclaration | undefined {
        let parent = id.parent;
        if (ts.isVariableDeclaration(parent) &&
            parent.name == id) {
            return <ts.VariableDeclaration>parent;
        } else if (ts.isBindingElement(parent) &&
            parent.name == id) {
            while (parent && !ts.isVariableDeclaration(parent)) {
                parent = parent.parent;
            }

            return parent ? <ts.VariableDeclaration>parent : undefined;
        } else {
            return undefined;
        }
    }

    // [delete it when type system adapts for ESM]
    private recordImportInfo(node: ts.ImportDeclaration): ModuleStmt {
        if (!ts.isStringLiteral(node.moduleSpecifier)) {
            throw new Error("moduleSpecifier must be a stringLiteral");
        }
        let importStmt: ModuleStmt;
        if (node.moduleSpecifier) {
            let moduleRequest = jshelpers.getTextOfIdentifierOrLiteral(node.moduleSpecifier);
            importStmt = new ModuleStmt(node, moduleRequest);
        } else {
            importStmt = new ModuleStmt(node);
        }
        if (node.importClause) {
            let importClause: ts.ImportClause = node.importClause;

            // import defaultExport from "a.js"
            if (importClause.name) {
                let name = jshelpers.getTextOfIdentifierOrLiteral(importClause.name);
                importStmt.addLocalName(name, "default");
                importStmt.addNodeMap(importClause.name, importClause.name);
            }

            // import { ... } from "a.js"
            // import * as a from "a.js"
            // import defaultExport, * as a from "a.js"
            if (importClause.namedBindings) {
                let namedBindings = importClause.namedBindings;
                // import * as a from "a.js"
                if (ts.isNamespaceImport(namedBindings)) {
                    let nameSpace = jshelpers.getTextOfIdentifierOrLiteral((<ts.NamespaceImport>namedBindings).name);
                    importStmt.setNameSpace(nameSpace);
                }

                // import { ... } from "a.js"
                if (ts.isNamedImports(namedBindings)) {
                    namedBindings.elements.forEach((element) => {
                        let name: string = jshelpers.getTextOfIdentifierOrLiteral(element.name);
                        let exoticName: string = element.propertyName ? jshelpers.getTextOfIdentifierOrLiteral(element.propertyName) : name;
                        importStmt.addLocalName(name, exoticName);
                        importStmt.addNodeMap(element.name, element.propertyName ? element.propertyName : element.name);
                    });
                }
            }
        }

        this.importStmts.push(importStmt);
        return importStmt;
    }

    // [delete it when type system adapts for ESM]
    private recordExportInfo(node: ts.ExportDeclaration): ModuleStmt {
        let origNode = <ts.ExportDeclaration>ts.getOriginalNode(node);
        let exportStmt: ModuleStmt;
        if (origNode.moduleSpecifier) {
            if (!ts.isStringLiteral(origNode.moduleSpecifier)) {
                throw new Error("moduleSpecifier must be a stringLiteral");
            }
            exportStmt = new ModuleStmt(origNode, jshelpers.getTextOfIdentifierOrLiteral(origNode.moduleSpecifier));
        } else {
            exportStmt = new ModuleStmt(origNode);
        }

        if (origNode.exportClause) {
            exportStmt.setCopyFlag(false);
            let namedBindings: ts.NamedExportBindings = origNode.exportClause;
            if (ts.isNamespaceExport(namedBindings)) {
                exportStmt.setNameSpace(jshelpers.getTextOfIdentifierOrLiteral((<ts.NamespaceExport>namedBindings).name));
            }

            if (ts.isNamedExports(namedBindings)) {
                namedBindings.elements.forEach((element) => {
                    let name: string = jshelpers.getTextOfIdentifierOrLiteral(element.name);
                    let exoticName: string = element.propertyName ? jshelpers.getTextOfIdentifierOrLiteral(element.propertyName) : name;
                    exportStmt.addLocalName(name, exoticName);
                    exportStmt.addNodeMap(element.name, element.propertyName ? element.propertyName : element.name);
                });
            }
        }
        this.exportStmts.push(exportStmt);
        return exportStmt;
    }

    private getModuleSpecifier(moduleSpecifier: ts.Expression): string {
        if (!ts.isStringLiteral(moduleSpecifier)) {
            throw new Error("moduleSpecifier must be a stringLiteral");
        }
        return jshelpers.getTextOfIdentifierOrLiteral(moduleSpecifier);
    }

    private recordEcmaNamedBindings(namedBindings: ts.NamedImportBindings, scope: ModuleScope, moduleRequest: string) {
        // import * as a from "a.js"
        if (ts.isNamespaceImport(namedBindings)) {
            let nameSpace = jshelpers.getTextOfIdentifierOrLiteral((<ts.NamespaceImport>namedBindings).name);
            scope.setDecls(new ConstDecl(nameSpace, namedBindings, ModuleVarKind.NOT));
            scope.module().addStarImportEntry(namedBindings, nameSpace, moduleRequest);
        } else if (ts.isNamedImports(namedBindings)) {
            if (namedBindings.elements.length == 0) {
                // import {} from "a.js"
                scope.module().addEmptyImportEntry(moduleRequest);
            }
            // import { ... } from "a.js"
            namedBindings.elements.forEach((element: any) => {
                let localName: string = jshelpers.getTextOfIdentifierOrLiteral(element.name);
                let importName: string = element.propertyName ? jshelpers.getTextOfIdentifierOrLiteral(element.propertyName) : localName;
                scope.setDecls(new ConstDecl(localName, element, ModuleVarKind.IMPORTED));
                scope.module().addImportEntry(element, importName, localName, moduleRequest);
            });
        } else {
            throw new Error("Unreachable kind for namedBindings");
        }
    }

    private recordEcmaImportClause(importClause: ts.ImportClause, scope: ModuleScope, moduleRequest: string) {
        // import defaultExport from "a.js"
        if (importClause.name) {
            let localName = jshelpers.getTextOfIdentifierOrLiteral(importClause.name);
            scope.setDecls(new ConstDecl(localName, importClause.name, ModuleVarKind.IMPORTED));
            scope.module().addImportEntry(importClause, "default", localName, moduleRequest);
        }
        if (importClause.namedBindings) {
            let namedBindings = importClause.namedBindings;
            this.recordEcmaNamedBindings(namedBindings, scope, moduleRequest);
        }
    }

    private recordEcmaImportInfo(node: ts.ImportDeclaration, scope: Scope) {
        if (!(scope instanceof ModuleScope)) {
            return;
        }

        let moduleRequest: string = this.getModuleSpecifier(node.moduleSpecifier);

        if (node.importClause) {
            let importClause: ts.ImportClause = node.importClause;
            this.recordEcmaImportClause(importClause, scope, moduleRequest);
        } else {
            // import "a.js"
            scope.module().addEmptyImportEntry(moduleRequest);
        }
    }

    private recordEcmaExportDecl(node: ts.ExportDeclaration, scope: ModuleScope) {
        if (node.moduleSpecifier) {
            let moduleRequest: string = this.getModuleSpecifier(node.moduleSpecifier);

            if (node.exportClause) {
                let namedBindings: ts.NamedExportBindings = node.exportClause;
                if (ts.isNamespaceExport(namedBindings)) {
                    // export * as m from "mod";
                    // `export namespace` is not the ECMA2018's feature
                } else if (ts.isNamedExports(namedBindings)) {
                    if (namedBindings.elements.length == 0) {
                        // export {} from "mod";
                        scope.module().addEmptyImportEntry(moduleRequest);
                    }
                    // export {x} from "mod";
                    // export {v as x} from "mod";
                    namedBindings.elements.forEach((element: any) => {
                        let exportName: string = jshelpers.getTextOfIdentifierOrLiteral(element.name);
                        let importName: string = element.propertyName ? jshelpers.getTextOfIdentifierOrLiteral(element.propertyName) : exportName;
                        scope.module().addIndirectExportEntry(element, importName, exportName, moduleRequest);
                    });
                }
            } else {
                // export * from "mod";
                scope.module().addStarExportEntry(node, moduleRequest);
            }
        } else if (node.exportClause && ts.isNamedExports(node.exportClause)) {
            // export {x};
            // export {v as x};
            node.exportClause.elements.forEach((element: any) => {
                let exportName: string = jshelpers.getTextOfIdentifierOrLiteral(element.name);
                let localName: string = element.propertyName ? jshelpers.getTextOfIdentifierOrLiteral(element.propertyName) : exportName;
                scope.module().addLocalExportEntry(element, exportName, localName);
            });
        } else {
            throw new Error("Unreachable node kind for Export Declaration");
        }
    }

    private recordEcmaExportInfo(node: ts.ExportDeclaration | ts.ExportAssignment | ts.VariableStatement | ts.FunctionDeclaration | ts.ClassDeclaration, scope: Scope) {
        if (!(scope instanceof ModuleScope)) {
            return;
        }

        switch (node.kind) {
            case ts.SyntaxKind.ExportDeclaration: {
                this.recordEcmaExportDecl(<ts.ExportDeclaration>node, scope);
                break;
            }
            case ts.SyntaxKind.ExportAssignment: {
                // export default 42;
                // export default v;
                // "*default*" is used within this specification as a synthetic name for anonymous default export values.
                scope.module().addLocalExportEntry(node, "default", "*default*");
                scope.setDecls(new LetDecl("*default*", node, ModuleVarKind.EXPORTED));
                break;
            }
            case ts.SyntaxKind.VariableStatement: {
                // export var a,b;
                node.declarationList.declarations.forEach(decl => {
                    let name = jshelpers.getTextOfIdentifierOrLiteral(decl.name);
                    scope.module().addLocalExportEntry(decl, name, name);
                });
                break;
            }
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.ClassDeclaration: {
                if (hasDefaultKeywordModifier(node)) {
                    // HoistableDeclaration : FunctionDecl/GeneratorDecl/AsyncFunctionDecl/AsyncGeneratorDecl
                    // export default function f(){}
                    // export default function(){}
                    // export default class{}
                    let localName = node.name ? jshelpers.getTextOfIdentifierOrLiteral(node.name) : "*default*";
                    scope.module().addLocalExportEntry(node, "default", localName);
                } else {
                    // export function f(){}
                    // export class c{}
                    if (!node.name) {
                        throw new DiagnosticError(node, DiagnosticCode.A_class_or_function_declaration_without_the_default_modifier_must_have_a_name, jshelpers.getSourceFileOfNode(node));
                    }
                    let name = jshelpers.getTextOfIdentifierOrLiteral(node.name!);
                    scope.module().addLocalExportEntry(node, name, name);
                }
                break;
            }
            default:
                throw new Error("Unreachable syntax kind for static exporting");
        }
    }

    private recordFuncDecl(node: ts.FunctionDeclaration, scope: Scope, isExport: boolean) {
        this.recordFuncInfo(node);

        let funcId = <ts.Identifier>(node).name;
        if (!funcId && !isExport) {
            // unexported function declaration without name doesn't need to record hoisting.
            return;
        }
        // if function without name must has modifiers of 'export' & 'default'
        let funcName = funcId ? jshelpers.getTextOfIdentifierOrLiteral(funcId) : '*default*';
        let moduleKind = isExport ? ModuleVarKind.EXPORTED : ModuleVarKind.NOT;
        let funcDecl = new FuncDecl(funcName, node, moduleKind);
        let hoistScope = scope;
        let need2AddDecls: boolean = true;
        if (scope instanceof GlobalScope || scope instanceof ModuleScope) {
            this.collectHoistDecls(node, <GlobalScope | ModuleScope>hoistScope, funcDecl);
        } else if (scope instanceof LocalScope) {
            hoistScope = <Scope>scope.getNearestVariableScope();
            if ((hoistScope instanceof FunctionScope) && isFunctionLikeDeclaration(node.parent.parent)) {
                need2AddDecls = this.collectHoistDecls(node, hoistScope, funcDecl);
            }
        } else {
            LOGD("Function declaration", " in function is collected in its body block");
        }
        if (need2AddDecls) {
            scope.setDecls(funcDecl);
        }
    }

    private recordOtherFunc(node: ts.FunctionLikeDeclaration, scope: Scope) { // functionlikedecalration except function declaration
        this.recordFuncInfo(node);
        if (!ts.isFunctionExpression(node) && !ts.isMethodDeclaration(node)) {
            return;
        }

        if (node.name && ts.isIdentifier(node.name)) {
            let funcName = jshelpers.getTextOfIdentifierOrLiteral(node.name);
            let funcDecl = new FuncDecl(funcName, node, ModuleVarKind.NOT);
            scope.setDecls(funcDecl);
        }
    }

    private recordFuncInfo(node: ts.FunctionLikeDeclaration) {
        this.recordFunctionParameters(node);
        this.recordFuncName(node);
    }

    recordFuncName(node: ts.FunctionLikeDeclaration) {
        let name: string = '';
        if (ts.isConstructorDeclaration(node)) {
            let classNode = node.parent;
            name = getClassNameForConstructor(classNode);
        } else {
            if (isAnonymousFunctionDefinition(node)) {
                let outerNode = findOuterNodeOfParenthesis(node);

                if (ts.isVariableDeclaration(outerNode)) {
                    // @ts-ignore
                    let id = outerNode.name;
                    if (ts.isIdentifier(id)) {
                        name = jshelpers.getTextOfIdentifierOrLiteral(id);
                    }
                } else if (ts.isBinaryExpression(outerNode)) {
                    // @ts-ignore
                    if (outerNode.operatorToken.kind == ts.SyntaxKind.EqualsToken && ts.isIdentifier(outerNode.left)) {
                        // @ts-ignore
                        name = jshelpers.getTextOfIdentifierOrLiteral(outerNode.left);
                    }
                } else if (ts.isPropertyAssignment(outerNode)) {
                    // @ts-ignore
                    let propName = outerNode.name;
                    if (ts.isIdentifier(propName) || ts.isStringLiteral(propName) || ts.isNumericLiteral(propName)) {
                        name = jshelpers.getTextOfIdentifierOrLiteral(propName);
                        if (name == "__proto__") {
                            name = '';
                        }
                    }
                }
            } else {
                if (ts.isIdentifier(node.name!)) {
                    name = jshelpers.getTextOfIdentifierOrLiteral(node.name);
                }
            }
        }

        (<FunctionScope>this.getScopeOfNode(node)).setFuncName(name);

        if (name != '') {
            let funcNameMap = this.funcNameMap;
            if (funcNameMap.has(name)) {
                let nums = <number>funcNameMap.get(name);
                funcNameMap.set(name, ++nums);
            } else {
                funcNameMap.set(name, 1);
            }
        }
    }

    recordFunctionParameters(node: ts.FunctionLikeDeclaration) {
        let parameters = node.parameters;
        let funcParams: FunctionParameter[] = [];
        let length = 0;
        let lengthFlag = true;

        if (parameters) {
            parameters.forEach(parameter => {
                // record function.length
                if (parameter.initializer || this.isRestParameter(parameter)) {
                    lengthFlag = false;
                }
                if (lengthFlag) {
                    length++;
                }

                if (ts.isIdentifier(parameter.name)) {
                    let name = jshelpers.getTextOfIdentifierOrLiteral(<ts.Identifier>parameter.name);
                    funcParams.push(new FunctionParameter(name, parameter.name));
                } else { // parameter is binding pattern
                    this.recordPatternParameter(<ts.BindingPattern>parameter.name, funcParams);
                }
            });
        }
        (<FunctionScope>this.getScopeOfNode(node)).setParameterLength(length);
        this.setParametersMap(node, funcParams);
    }

    recordPatternParameter(pattern: ts.BindingPattern, funcParams: Array<FunctionParameter>) {
        let name: string = '';
        pattern.elements.forEach(bindingElement => {
            if (ts.isOmittedExpression(bindingElement)) {
                return;
            }

            bindingElement = <ts.BindingElement>bindingElement;
            if (ts.isIdentifier(bindingElement.name)) {
                name = jshelpers.getTextOfIdentifierOrLiteral(bindingElement.name);
                funcParams.push(new FunctionParameter(name, bindingElement.name));
            } else { // case of binding pattern
                let innerPattern = <ts.BindingPattern>bindingElement.name;
                this.recordPatternParameter(innerPattern, funcParams);
            }
        });
    }


    isRestParameter(parameter: ts.ParameterDeclaration) {
        return parameter.dotDotDotToken ? true : false;
    }

    private collectHoistDecls(node: ts.Node, scope: VariableScope, decl: Decl): boolean {
        let declName = decl.name;

        // if variable share a same name with the parameter of its contained function, it should not be hoisted
        if (scope instanceof FunctionScope) {
            let nearestFunc = jshelpers.getContainingFunctionDeclaration(node);
            let functionParameters = this.getParametersOfFunction(<ts.FunctionLikeDeclaration>nearestFunc);
            if (functionParameters) {
                for (let i = 0; i < functionParameters.length; i++) {
                    if (functionParameters[i].name == declName) {
                        return false;
                    }
                }
            }
        }

        // Variable named of global identifier should not be hoisted.
        if (isGlobalIdentifier(declName) && (scope instanceof GlobalScope)) {
            return true;
        }

        this.setHoistMap(scope, decl);
        return false;
    }

    setScopeMap(node: ts.Node, scope: Scope) {
        this.scopeMap.set(node, scope);
    }

    getScopeMap() {
        return this.scopeMap;
    }

    getScopeOfNode(node: ts.Node) {
        return this.scopeMap.get(node);
    }

    setHoistMap(scope: VariableScope, decl: Decl) {
        if (!this.hoistMap.has(scope)) {
            this.hoistMap.set(scope, [decl]);
            return;
        }

        let hoistDecls = <Decl[]>this.hoistMap.get(scope);
        for (let i = 0; i < hoistDecls.length; i++) {
            if (decl.name == hoistDecls[i].name) {
                if (decl instanceof FuncDecl) {
                    hoistDecls[i] = decl;
                }
                return;
            }
        }
        hoistDecls.push(decl);
    }

    getHoistMap() {
        return this.hoistMap;
    }

    getHoistDeclsOfScope(scope: VariableScope) {
        return this.hoistMap.get(scope);
    }

    setParametersMap(node: ts.FunctionLikeDeclaration, parameters: FunctionParameter[]) {
        this.parametersMap.set(node, parameters);
    }

    getParametersOfFunction(node: ts.FunctionLikeDeclaration) {
        return this.parametersMap.get(node);
    }

    getFuncNameMap() {
        return this.funcNameMap;
    }
}
