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
import { SourceTextModuleRecord } from "./ecmaModule";
import { LOGD } from "./log";
import {
    GlobalVariable,
    LocalVariable,
    MandatoryFuncObj,
    ModuleVariable,
    VarDeclarationKind,
    Variable
} from "./variable";


export enum InitStatus {
    INITIALIZED, UNINITIALIZED
}

export enum ModuleVarKind {
    IMPORTED, EXPORTED, NOT
}

export abstract class Decl {
    name: string;
    node: ts.Node;
    isModule: ModuleVarKind;

    constructor(name: string, node: ts.Node, isModule: ModuleVarKind) {
        this.name = name;
        this.node = node;
        this.isModule = isModule;
    }
}

export class VarDecl extends Decl {
    constructor(varName: string, node: ts.Node, isModule: ModuleVarKind) {
        super(varName, node, isModule);
    }
}

export class LetDecl extends Decl {
    constructor(letName: string, node: ts.Node, isModule: ModuleVarKind) {
        super(letName, node, isModule);
    }
}

export class ConstDecl extends Decl {
    constructor(constName: string, node: ts.Node, isModule: ModuleVarKind) {
        super(constName, node, isModule);
    }
}

export class FuncDecl extends Decl {
    constructor(funcName: string, node: ts.Node, isModule: ModuleVarKind) {
        super(funcName, node, isModule);
    }
}

export class ClassDecl extends Decl {
    constructor(className: string, node: ts.Node, isModule: ModuleVarKind) {
        super(className, node, isModule);
    }
}

export class CatchParameter extends Decl {
    constructor(CpName: string, node: ts.Node, isModule: ModuleVarKind = ModuleVarKind.NOT) {
        super(CpName, node, isModule);
    }
}

export class FunctionParameter extends Decl {
    constructor(FpName: string, node: ts.Node, isModule: ModuleVarKind = ModuleVarKind.NOT) {
        super(FpName, node, isModule);
    }
}

export abstract class Scope {
    protected debugTag = "scope";
    protected name2variable: Map<string, Variable> = new Map<string, Variable>();
    protected decls: Decl[] = [];
    protected parent: Scope | undefined = undefined;
    // for debuginfo
    protected startInsIdx: number | undefined;
    protected endInsIdx: number | undefined;
    private isArgumentsOrRestargs: boolean = false;

    constructor() { }

    abstract add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined;

    getName2variable(): Map<string, Variable> {
        return this.name2variable;
    }

    getScopeStartInsIdx() {
        return this.startInsIdx;
    }

    setScopeStartInsIdx(startInsIdx: number) {
        this.startInsIdx = startInsIdx;
    }

    setScopeEndInsIdx(endInsIdx: number) {
        this.endInsIdx = endInsIdx;
    }

    getScopeEndInsIdx() {
        return this.endInsIdx;
    }

    setParent(parentScope: Scope | undefined) {
        this.parent = parentScope;
    }

    getParent(): Scope | undefined {
        return this.parent;
    }

    getRootScope(): Scope {
        let sp: Scope | undefined = this;
        let pp = this.getParent();
        while (pp != undefined) {
            sp = pp;
            pp = pp.getParent();
        }

        return sp;
    }

    getNearestVariableScope(): VariableScope | undefined {
        let sp: Scope | undefined = this;

        while (sp) {
            if (sp instanceof VariableScope) {
                return <VariableScope>sp;
            }
            sp = sp.parent;
        }

        return undefined;
    }

    getNearestLexicalScope(): VariableScope | LoopScope | undefined {
        let curScope: Scope | undefined = this;

        while (curScope) {
            if (curScope instanceof VariableScope || curScope instanceof LoopScope) {
                return <VariableScope | LoopScope>curScope;
            }
            curScope = curScope.parent;
        }

        return undefined;
    }

    getNthVariableScope(level: number): VariableScope | undefined {
        let sp: Scope | undefined = this;
        let tempLevel = level;

        while (sp) {
            if (sp instanceof VariableScope) {
                if (tempLevel == 0) {
                    return <VariableScope>sp;
                } else {
                    tempLevel--;
                }
            }
            sp = sp.parent;
        }

        return undefined;
    }

    findLocal(name: string): Variable | undefined {
        return this.name2variable.get(name);
    }

    find(name: string): { scope: Scope | undefined, level: number, v: Variable | undefined } {
        let curLevel = 0;
        let curScope: Scope | undefined = this;

        while (curScope) {
            let resolve = null;
            let tmpLevel = curLevel; // to store current level, not impact by ++
            if (curScope.isLexicalScope() && (<VariableScope | LoopScope>curScope).need2CreateLexEnv()) {
                curLevel++;
            }
            resolve = curScope.findLocal(name);
            if (resolve) {
                LOGD(this.debugTag, "scope.find (" + name + ") :");
                LOGD(undefined, resolve);
                return { scope: curScope, level: tmpLevel, v: resolve };
            }

            curScope = curScope.getParent();
        }

        LOGD(this.debugTag, "scope.find (" + name + ") : undefined");
        return { scope: undefined, level: 0, v: undefined };
    }

    findDeclPos(name: string): Scope | undefined {
        let declPos: Scope | undefined = undefined;
        let curScope: Scope | undefined = this;
        while (curScope) {
            if (curScope.hasDecl(name)) {
                declPos = curScope;
                break;
            }

            curScope = curScope.getParent();
        }

        return declPos;
    }

    resolveDeclPos(name: string) {
        let crossFunc: boolean = false;
        let curScope: Scope | undefined = this;
        let enclosingVariableScope: VariableScope = this.getNearestVariableScope();

        while (curScope) {
            if (curScope == enclosingVariableScope.parent) {
                crossFunc = true;
            }

            let result = curScope.findLocal(name);
            if (result) {
                if (!crossFunc) {
                    return {isLexical: false, scope: curScope, defLexicalScope: undefined, v: result};
                }

                let enclosingDefLexicalScope = curScope.getNearestLexicalScope();
                return {isLexical: true, scope: curScope, defLexicalScope: enclosingDefLexicalScope, v: result};
            }

            curScope = curScope.parent;
        }

        return {isLexical: false, scope: undefined, defLexicalScope: undefined, v: undefined};
    }

    setDecls(decl: Decl) {
        this.decls.push(decl);
    }

    hasDecl(name: string): boolean {
        let decls = this.decls;
        for (let i = 0; i < decls.length; i++) {
            if (decls[i].name == name) {
                return true;
            }
        }

        return false;
    }

    getDecl(name: string): Decl | undefined {
        let decls = this.decls;
        for (let i = 0; i < decls.length; i++) {
            if (decls[i].name == name) {
                return decls[i];
            }
        }

        return undefined;
    }

    getDecls() {
        return this.decls;
    }

    public setArgumentsOrRestargs() {
        this.isArgumentsOrRestargs = true;
    }

    public getArgumentsOrRestargs() {
        return this.isArgumentsOrRestargs;
    }

    isLexicalScope() {
        let scope = this;
        return ((scope instanceof VariableScope) || (scope instanceof LoopScope));
    }
}

export abstract class VariableScope extends Scope {
    protected startLexIdx: number = 0;
    protected needCreateLexEnv: boolean = false;
    protected parameters: LocalVariable[] = [];
    protected useArgs = false;
    protected node: ts.Node | undefined = undefined;
    protected parentVariableScope: VariableScope | null = null;
    protected childVariableScope: VariableScope[] = [];
    protected lexVarInfo: Map<string, number> = new Map<string, number>();

    getLexVarInfo() {
        return this.lexVarInfo;
    }

    addLexVarInfo(name: string, slot: number) {
        this.lexVarInfo.set(name, slot);
    }

    getBindingNode() {
        return this.node;
    }

    setParentVariableScope(scope: VariableScope) {
        this.parentVariableScope = scope;
    }

    getParentVariableScope() {
        return this.parentVariableScope;
    }

    getChildVariableScope() {
        return this.childVariableScope;
    }

    addChildVariableScope(scope: VariableScope) {
        this.childVariableScope.push(scope);
    }

    addParameter(name: string, declKind: VarDeclarationKind, argIdx: number): Variable | undefined {
        LOGD(this.debugTag, "VariableScope.addArg(" + name + "), kind(" + declKind + ")", "argIdx(" + argIdx + ")");
        let v = this.add(name, declKind, InitStatus.INITIALIZED);
        if (!(v instanceof LocalVariable)) {
            throw new Error("Error: argument must be local variable!");
        }
        this.parameters.push(v);
        return v;
    }

    addFuncName(funcName: string) {
        let funcObj = this.name2variable.get(MandatoryFuncObj);
        this.name2variable.set(funcName, funcObj!);
    }

    need2CreateLexEnv(): boolean {
        return this.needCreateLexEnv;
    }

    pendingCreateEnv() {
        this.needCreateLexEnv = true;
    }

    getNumLexEnv(): number {
        return this.startLexIdx;
    }

    getParametersCount(): number {
        return this.parameters.length;
    }

    getParameters(): LocalVariable[] {
        return this.parameters;
    }

    getLexVarIdx() {
        this.needCreateLexEnv = true;
        return this.startLexIdx++;
    }

    setUseArgs(value: boolean) {
        this.useArgs = value;
    }

    getUseArgs(): boolean {
        return this.useArgs;
    }

    hasAfChild(): boolean {
        let childVariableScopes = this.getChildVariableScope();
        for (let child of childVariableScopes) {
            if (ts.isArrowFunction(child.getBindingNode())) {
                return true;
            }
        }

        return false;
    }
}

export class GlobalScope extends VariableScope {
    constructor(node?: ts.SourceFile) {
        super();
        this.node = node ? node : undefined;
    }

    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined {
        let name = decl instanceof Decl ? decl.name : decl;
        LOGD(this.debugTag, "globalscope.add (" + name + "), kind:" + declKind);
        let v: Variable | undefined;
        if (declKind == VarDeclarationKind.NONE || declKind == VarDeclarationKind.VAR || declKind == VarDeclarationKind.FUNCTION) {
            v = new GlobalVariable(declKind, name);
        } else {
            v = new LocalVariable(declKind, name, status);
        }
        this.name2variable.set(name, v);
        return v;
    }
}

export class ModuleScope extends VariableScope {
    private moduleRecord: SourceTextModuleRecord;

    constructor(node: ts.SourceFile) {
        super();
        this.node = node;
        this.moduleRecord = new SourceTextModuleRecord(node.fileName);
    }

    setExportDecl(exportedLocalName: string) {
        let decl = this.getDecl(exportedLocalName);
        if (decl && decl.isModule != ModuleVarKind.IMPORTED) {
            decl.isModule = ModuleVarKind.EXPORTED;
        }
    }

    module() {
        return this.moduleRecord;
    }

    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined {
        let [name, isModule] = decl instanceof Decl ? [decl.name, decl.isModule] : [decl, ModuleVarKind.NOT];
        LOGD(this.debugTag, "modulescope.add (" + name + "), kind:" + declKind);
        let v: Variable | undefined;

        if (isModule !== ModuleVarKind.NOT) {
            v = new ModuleVariable(declKind, name, InitStatus.UNINITIALIZED);
            if (isModule == ModuleVarKind.EXPORTED) {
                (<ModuleVariable>v).setExport();
            }
        } else {
            if (declKind === VarDeclarationKind.NONE) {
                v = new GlobalVariable(declKind, name);
            } else if (declKind == VarDeclarationKind.VAR || declKind == VarDeclarationKind.FUNCTION) {
                v = new LocalVariable(declKind, name);
            } else {
                v = new LocalVariable(declKind, name, status);
            }
        }

        this.name2variable.set(name, v);
        return v;
    }
}

export class FunctionScope extends VariableScope {
    private parameterLength: number = 0;
    private funcName: string = "";
    constructor(parent?: Scope, node?: ts.FunctionLikeDeclaration) {
        super();
        this.parent = parent ? parent : undefined;
        this.node = node ? node : undefined;
    }

    setParameterLength(length: number) {
        this.parameterLength = length;
    }

    getParameterLength(): number {
        return this.parameterLength;
    }

    setFuncName(name: string) {
        this.funcName = name;
    }

    getFuncName() {
        return this.funcName;
    }

    getParent(): Scope | undefined {
        return this.parent;
    }

    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined {
        let name = decl instanceof Decl ? decl.name : decl;
        let v: Variable | undefined;
        LOGD(this.debugTag, "functionscope.add (" + name + "), kind:" + declKind);

        if (declKind == VarDeclarationKind.NONE) {
            // the variable declared without anything should be global
            // See EcmaStandard: 13.3.2 Variable Statement
            let topLevelScope = this.getRootScope();
            v = topLevelScope.add(name, declKind);
        } else if (declKind == VarDeclarationKind.VAR || declKind == VarDeclarationKind.FUNCTION) {
            v = new LocalVariable(declKind, name);
            this.name2variable.set(name, v);
        } else {
            v = new LocalVariable(declKind, name, status);
            this.name2variable.set(name, v);
        }
        return v;
    }
}

export class LocalScope extends Scope {
    constructor(parent: Scope) {
        super();
        this.parent = parent
    }

    add(decl: Decl | string, declKind: VarDeclarationKind, status?: InitStatus): Variable | undefined {
        let name = decl instanceof Decl ? decl.name : decl;
        let v: Variable | undefined;

        LOGD(this.debugTag, "localscope.add (" + name + "), kind:" + declKind);
        if (declKind == VarDeclarationKind.NONE) {
            let topLevelScope = this.getRootScope();
            v = topLevelScope.add(name, declKind);
        } else if (declKind == VarDeclarationKind.VAR) {
            /**
             * the variable declared without anything should be accessible
             * in all parent scopes so delegate creation to the parent
             * See EcmaStandard: 13.3.2 Variable Statement
             */
            let functionScope = this.getNearestVariableScope();
            v = functionScope!.add(name, declKind);
        } else {
            v = new LocalVariable(declKind, name, status);
            this.name2variable.set(name, v);
        }

        return v;
    }
}

export class LoopScope extends LocalScope {
    protected startLexIdx: number = 0;
    protected needCreateLexEnv: boolean = false;
    protected lexVarInfo: Map<string, number> = new Map<string, number>();
    constructor(parent: Scope) {
        super(parent);
    }

    getLexVarInfo() {
        return this.lexVarInfo;
    }

    addLexVarInfo(name: string, slot: number) {
        this.lexVarInfo.set(name, slot);
    }

    need2CreateLexEnv(): boolean {
        return this.needCreateLexEnv;
    }

    pendingCreateEnv() {
        this.needCreateLexEnv = true;
    }

    getLexVarIdx() {
        this.needCreateLexEnv = true;
        return this.startLexIdx++;
    }

    getNumLexEnv(): number {
        return this.startLexIdx;
    }
}

