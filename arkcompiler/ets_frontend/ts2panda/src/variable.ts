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

import { VReg } from "./irnodes";
import {
    InitStatus,
    LoopScope,
    VariableScope
} from "./scope";

export enum VarDeclarationKind {
    NONE,
    LET,
    CONST,
    VAR,
    FUNCTION,
    CLASS
}

export abstract class Variable {
    private vreg: VReg | undefined;
    private name: string;
    private typeIndex: number;
    isLexVar: boolean = false;
    idxLex: number = 0;
    constructor(
        readonly declKind: VarDeclarationKind,
        name: string
    ) {
        this.name = name;
        this.vreg = undefined;
        this.typeIndex = 0;
    }

    bindVreg(vreg: VReg) {
        this.vreg = vreg;
        this.vreg.setTypeIndex(this.typeIndex);
        this.vreg.setVariableName(this.name);
    }

    hasAlreadyBinded(): boolean {
        return this.vreg !== undefined;
    }

    getVreg(): VReg {
        if (!this.vreg) {
            throw new Error("variable has not been binded")
        }
        return this.vreg;
    }

    getName() {
        return this.name;
    }

    getTypeIndex() {
        return this.typeIndex;
    }

    setTypeIndex(typeIndex: number) {
        return this.typeIndex = typeIndex;
    }

    setLexVar(scope: VariableScope | LoopScope) {
        if (this.lexical()) {
            return;
        }
        this.idxLex = scope.getLexVarIdx()
        scope.pendingCreateEnv();
        this.isLexVar = true;
        scope.addLexVarInfo(this.name, this.idxLex);
        return this.idxLex;
    }

    clearLexVar() {
        this.isLexVar = false;
        this.idxLex = 0;
    }

    lexical(): boolean {
        return this.isLexVar;
    }

    lexIndex() {
        return this.idxLex;
    }

    isLet(): boolean {
        return this.declKind == VarDeclarationKind.LET;
    }

    isConst(): boolean {
        return this.declKind == VarDeclarationKind.CONST;
    }

    isLetOrConst(): boolean {
        return this.declKind == VarDeclarationKind.LET || this.declKind == VarDeclarationKind.CONST;
    }

    isVar(): boolean {
        return this.declKind == VarDeclarationKind.VAR;
    }

    isNone(): boolean {
        return this.declKind == VarDeclarationKind.NONE;
    }

    isClass(): boolean {
        return this.declKind == VarDeclarationKind.CLASS;
    }
}

export class LocalVariable extends Variable {
    status: InitStatus | null;

    constructor(declKind: VarDeclarationKind, name: string, status?: InitStatus) {
        super(declKind, name);
        this.status = status ? status : null;
    }

    initialize() {
        this.status = InitStatus.INITIALIZED;
    }

    isInitialized() {
        if (this.status != null) {
            return this.status == InitStatus.INITIALIZED;
        }
        return true;
    }
}

export class ModuleVariable extends Variable {
    private isExport: boolean = false;
    private status: InitStatus | null;
    private index: number;


    constructor(declKind: VarDeclarationKind, name: string, status?: InitStatus) {
        super(declKind, name);
        this.status = status ? status : null;
    }

    initialize() {
        this.status = InitStatus.INITIALIZED;
    }

    isInitialized() {
        if (this.status != null) {
            return this.status == InitStatus.INITIALIZED;
        }
        return true;
    }

    setExport() {
        this.isExport = true;
    }

    isExportVar() {
        return this.isExport;
    }

    assignIndex(index: number) {
        this.index = index;
    }

    getIndex() {
        return this.index;
    }
}

export class GlobalVariable extends Variable {
    constructor(declKind: VarDeclarationKind, name: string) {
        super(declKind, name);
    }
}

export const MandatoryFuncObj = "4funcObj";
export const MandatoryNewTarget = "4newTarget";
export const MandatoryThis = "this";
export const MandatoryArguments = "arguments";

export function isMandatoryParam(name: string) {
    if (name == MandatoryFuncObj || name == MandatoryArguments ||
        name == MandatoryNewTarget || name == MandatoryThis) {
        return true;
    }

    return false;
}