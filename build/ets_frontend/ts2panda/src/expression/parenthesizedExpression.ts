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

export function findInnerExprOfParenthesis(expr: ts.ParenthesizedExpression): ts.Expression {
    while (expr.expression.kind == ts.SyntaxKind.ParenthesizedExpression) {
        expr = <ts.ParenthesizedExpression>expr.expression;
    }
    return expr.expression;
}

export function findOuterNodeOfParenthesis(expr: ts.Node): ts.Node {
    let parent = expr.parent;
    while (parent.kind == ts.SyntaxKind.ParenthesizedExpression) {
        parent = parent.parent;
    }
    return parent;
}
