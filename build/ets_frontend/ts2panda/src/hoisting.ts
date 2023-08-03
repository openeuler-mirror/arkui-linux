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
import { CacheList, getVregisterCache } from "./base/vregisterCache";
import { Compiler } from "./compiler";
import { CompilerDriver } from "./compilerDriver";
import { NodeKind } from "./debuginfo";
import { PandaGen } from "./pandagen";
import { Recorder } from "./recorder";
import {
    FuncDecl,
    FunctionScope,
    GlobalScope,
    LocalScope,
    ModuleScope,
    ModuleVarKind,
    Scope,
    VarDecl,
    VariableScope
} from "./scope";
import { ModuleVariable } from "./variable";

export function hoisting(rootNode: ts.SourceFile | ts.FunctionLikeDeclaration, pandaGen: PandaGen,
    recorder: Recorder, compiler: Compiler) {
    let variableScope = <VariableScope>recorder.getScopeOfNode(rootNode);
    let hoistDecls = recorder.getHoistDeclsOfScope(variableScope);

    hoistDecls ?.forEach((decl) => {
        if (decl instanceof VarDecl) {
            hoistVar(decl, variableScope, pandaGen);
        } else if (decl instanceof FuncDecl) {
            let compilerDriver = compiler.getCompilerDriver();
            hoistFunction(decl, variableScope, pandaGen, compiler, compilerDriver);
        } else {
            throw new Error("Wrong declaration type to be hoisted");
        }
    });
}

export function hoistVar(decl: VarDecl, scope: Scope, pandaGen: PandaGen) {
    let name = decl.name;

    if (scope instanceof GlobalScope) {
        pandaGen.loadAccumulator(decl.node, getVregisterCache(pandaGen, CacheList.undefined));
        pandaGen.storeGlobalVar(decl.node, name);
    } else if (scope instanceof FunctionScope || scope instanceof ModuleScope) {
        let v: ModuleVariable = <ModuleVariable>(scope.findLocal(name)!);
        pandaGen.loadAccumulator(NodeKind.FirstNodeOfFunction, getVregisterCache(pandaGen, CacheList.undefined));
        if (decl.isModule !== ModuleVarKind.NOT) {
            pandaGen.storeModuleVariable(NodeKind.FirstNodeOfFunction, v);
        } else {
            pandaGen.storeAccToLexEnv(NodeKind.FirstNodeOfFunction, scope, 0, v, true);
        }
    } else {
        throw new Error("Wrong scope to hoist");
    }
}

export function hoistFunction(decl: FuncDecl, scope: Scope, pandaGen: PandaGen, compiler: Compiler, compilerDriver: CompilerDriver) {
    let funcName = decl.name;
    let internalName = compilerDriver.getFuncInternalName(<ts.FunctionLikeDeclaration>decl.node, compiler.getRecorder());
    let env = compiler.getCurrentEnv();

    if (scope instanceof GlobalScope) {
        pandaGen.defineFunction(NodeKind.FirstNodeOfFunction, <ts.FunctionDeclaration>decl.node, internalName);
        pandaGen.storeGlobalVar(NodeKind.FirstNodeOfFunction, funcName);
    } else if ((scope instanceof FunctionScope) || (scope instanceof LocalScope) || (scope instanceof ModuleScope)) {
        let v: ModuleVariable = <ModuleVariable>(scope.findLocal(funcName)!);
        pandaGen.defineFunction(NodeKind.FirstNodeOfFunction, <ts.FunctionDeclaration>decl.node, internalName);
        if (decl.isModule !== ModuleVarKind.NOT) {
            pandaGen.storeModuleVariable(NodeKind.FirstNodeOfFunction, v);
        } else {
            pandaGen.storeAccToLexEnv(NodeKind.FirstNodeOfFunction, scope, 0, v, true);
        }
    } else {
        throw new Error("Wrong scope to hoist");
    }
}

// this function is called when hoisting function inside blocks
export function hoistFunctionInBlock(scope: Scope, pandaGen: PandaGen, strictMode: boolean, compiler: Compiler) {
    let decls = scope.getDecls();
    let funcToHoist = new Array<FuncDecl>();
    for (let i = 0; i < decls.length; i++) {
        if (decls[i] instanceof FuncDecl) {
            funcToHoist.push(<FuncDecl>decls[i]);
        }
    }

    if (strictMode) {
        funcToHoist.forEach(func => {
            let compilerDriver = compiler.getCompilerDriver();
            hoistFunction(func, scope, pandaGen, compiler, compilerDriver);
        });
    }
}
