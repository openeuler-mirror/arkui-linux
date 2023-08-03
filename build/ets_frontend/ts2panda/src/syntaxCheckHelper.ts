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
import * as jshelpers from "./jshelpers";
import { MandatoryArguments } from "./variable";

export function isOctalNumber(num: string): boolean {
    if (!num || num.length < 2) {
        return false;
    }

    let reg = /^0[0-7]+$/;
    if (!reg.test(num)) {
        return false;
    }

    return true;
}

export function isNewOrCallExpression(node: ts.Node): boolean {
    return node.kind === ts.SyntaxKind.NewExpression || node.kind === ts.SyntaxKind.CallExpression;
}

export function stringLiteralIsInRegExp(node: ts.Node) {
    let parent = node.parent;
    if (parent && isNewOrCallExpression(parent)) {
        let expression = (<ts.NewExpression | ts.CallExpression>parent).expression;
        if (ts.isIdentifier(expression)) {
            if (expression.escapedText === "RegExp") {
                return true;
            }
        }
    }

    return false;
}

export function isIncludeOctalEscapeSequence(text: string): boolean {
    let reg = /\\(?:[1-7][0-7]{0,2}|[0-7]{2,3})/g;
    if (!text.match(reg)) {
        return false;
    }

    // Like \\1, should not be treated as an octal escape sequence
    let index = 0;
    while (index < text.length) {
        if (text[index] == '\\' && index != text.length - 1) {
            if (text[index + 1] == "\\") {
                index++;
            } else if (text[index + 1] >= '0' && text[index + 1] <= '7') {
                return true;
            }
        }
        index++;
    }

    return false;
}

export function isEvalOrArgumentsIdentifier(node: ts.Node): boolean {
    return ts.isIdentifier(node) && (node.escapedText === "eval" || node.escapedText === MandatoryArguments);
}

export function isLeftHandSideExpressionKind(kind: ts.SyntaxKind) {
    switch (kind) {
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.BigIntLiteral:
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.RegularExpressionLiteral:
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.Identifier:
        case ts.SyntaxKind.FalseKeyword:
        case ts.SyntaxKind.ImportKeyword:
        case ts.SyntaxKind.NullKeyword:
        case ts.SyntaxKind.SuperKeyword:
        case ts.SyntaxKind.ThisKeyword:
        case ts.SyntaxKind.TrueKeyword:
        case ts.SyntaxKind.ArrayLiteralExpression:
        case ts.SyntaxKind.ObjectLiteralExpression:
        case ts.SyntaxKind.PropertyAccessExpression:
        case ts.SyntaxKind.ElementAccessExpression:
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
        case ts.SyntaxKind.TaggedTemplateExpression:
        case ts.SyntaxKind.ParenthesizedExpression:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.TemplateExpression:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.NonNullExpression:
        case ts.SyntaxKind.MetaProperty:
        case ts.SyntaxKind.JsxElement:
        case ts.SyntaxKind.JsxSelfClosingElement:
        case ts.SyntaxKind.JsxFragment:
            return true;
        default:
            return false;
    }
}

export function isLeftHandSideExpression(node: ts.Node) {
    return isLeftHandSideExpressionKind(ts.skipPartiallyEmittedExpressions(node).kind);
}

export function isAssignmentOperator(token: ts.SyntaxKind) {
    return token >= ts.SyntaxKind.FirstAssignment && token <= ts.SyntaxKind.LastAssignment;
}

export function isOriginalKeyword(node: ts.Identifier): boolean {
    if (node.originalKeywordKind! >= ts.SyntaxKind.FirstFutureReservedWord &&
        node.originalKeywordKind! <= ts.SyntaxKind.LastFutureReservedWord) {
        return true;
    }

    return false;
}

export function isFunctionLikeDeclaration(node: ts.Node): node is ts.FunctionLikeDeclaration {
    if (!node) {
        return false;
    }

    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.SetAccessor:
            return true;
        default:
            return false;
    }
}

export function allowLetAndConstDeclarations(node: ts.Node): boolean {
    if (!node) {
        return false;
    }

    switch (node.kind) {
        case ts.SyntaxKind.DoStatement:
        case ts.SyntaxKind.IfStatement:
        case ts.SyntaxKind.ForStatement:
        case ts.SyntaxKind.ForInStatement:
        case ts.SyntaxKind.ForOfStatement:
        case ts.SyntaxKind.WhileStatement:
        case ts.SyntaxKind.WithStatement:
            return false;
        case ts.SyntaxKind.LabeledStatement:
            return allowLetAndConstDeclarations(node.parent);
        default:
            break;
    }
    return true;
}

export function isGlobalIdentifier(name: string) {
    switch (name) {
        case "NaN":
        case "undefined":
        case "Infinity":
            return true;
        default:
            return false;
    }
}

export function isBindingPattern(node: ts.Node | undefined): boolean {
    if (!node) {
        return false;
    }

    switch (node.kind) {
        case ts.SyntaxKind.ArrayBindingPattern:
        case ts.SyntaxKind.ObjectBindingPattern:
            return true;
        default:
            return false;
    }
}

export function visibilityToString(flag: ts.ModifierFlags): string | undefined {
    switch (flag) {
        case ts.ModifierFlags.Private:
            return "private";
        case ts.ModifierFlags.Protected:
            return "protected";
        default:
            return "public";
    }
}

export function isDeclInGlobal(id: ts.Identifier): boolean {
    let parent = id.parent;
    while ((parent) && (parent.kind != ts.SyntaxKind.Block)) {
        parent = parent.parent;
    }

    if (!parent) {
        return true;
    }

    return false;
}

export function isInBlockScope(node: ts.Node): boolean {
    switch (node.kind) {
        case ts.SyntaxKind.SourceFile:
        case ts.SyntaxKind.CaseBlock:
        case ts.SyntaxKind.DefaultClause:
        case ts.SyntaxKind.CaseClause:
        case ts.SyntaxKind.Block:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.MethodDeclaration:
            return true;
        default:
            break;
    }

    return false;
}

export function isIncludeBackslash8Or9InString(text: string): boolean {

    // \8 and \9 are not allowed in strict mode
    let index = 0;
    while (index < text.length) {
        if (text[index] == '\\' && index != text.length - 1) {
            if (text[index + 1] == "\\") {
                index++;
            } else if (text[index + 1] == '8' || text[index + 1] == '9') {
                return true;
            }
        }
        index++;
    }

    return false;
}

export function isOptionalParameter(node: ts.ParameterDeclaration): boolean {
    if (jshelpers.hasQuestionToken(node)) {
        return true;
    }

    if (!node.parent || !node.parent.parent) {
        return false;
    }

    let iife = jshelpers.getImmediatelyInvokedFunctionExpression(node.parent);
    if (iife) {
        return !node.type && !node.dotDotDotToken && node.parent.parameters.indexOf(node) >= iife.arguments.length;
    }

    return false;
}

export function isStatement(kind: ts.SyntaxKind) {
    if (kind >= ts.SyntaxKind.FirstStatement && kind <= ts.SyntaxKind.LastStatement) {
        return true;
    }

    return false;
}