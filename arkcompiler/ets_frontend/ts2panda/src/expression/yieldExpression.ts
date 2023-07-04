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
import { GeneratorFunctionBuilder } from "../function/generatorFunctionBuilder";
import { DiagnosticCode, DiagnosticError } from "../diagnostic";
import { CacheList, getVregisterCache } from "../base/vregisterCache";
import { AsyncGeneratorFunctionBuilder } from "../function/asyncGeneratorFunctionBuilder";
import { Compiler } from "../compiler";

export function compileYieldExpression(compiler: Compiler, expr: ts.YieldExpression) {
    if (!(compiler.getFuncBuilder() instanceof GeneratorFunctionBuilder || compiler.getFuncBuilder() instanceof AsyncGeneratorFunctionBuilder)) {
        throw new DiagnosticError(expr.parent, DiagnosticCode.A_yield_expression_is_only_allowed_in_a_generator_body);
    }

    expr.asteriskToken ? genYieldStarExpr(compiler, expr) : genYieldExpr(compiler, expr);
}

function genYieldExpr(compiler: Compiler, expr: ts.YieldExpression) {
    let pandaGen = compiler.getPandaGen();
    let funcBuilder = <GeneratorFunctionBuilder | AsyncGeneratorFunctionBuilder> compiler.getFuncBuilder();
    if (expr.expression) {
        compiler.compileExpression(expr.expression);
        funcBuilder.yield(expr);
    } else {
        pandaGen.loadAccumulator(expr, getVregisterCache(pandaGen, CacheList.undefined));
        funcBuilder.yield(expr);
    }
}

function genYieldStarExpr(compiler: Compiler, expr: ts.YieldExpression) {
    let funcBuilder = <GeneratorFunctionBuilder>compiler.getFuncBuilder();
    if (!expr.expression) {
        throw new Error("yield* must have an expression!");
    }
    compiler.compileExpression(expr.expression!);
    funcBuilder.yieldStar(expr);
}