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
import { hasDefaultKeywordModifier, hasExportKeywordModifier } from "./base/util";
import { CmdOptions } from "./cmdOptions";
import { DiagnosticCode, DiagnosticError } from "./diagnostic";
import { findInnerExprOfParenthesis } from "./expression/parenthesizedExpression";
import * as jshelpers from "./jshelpers";
import { ModuleScope, Scope } from "./scope";
import { checkStrictModeStatementList } from "./strictMode";
import {
    isAssignmentOperator,
    isEvalOrArgumentsIdentifier,
    isInBlockScope,
    isIncludeOctalEscapeSequence,
    isLeftHandSideExpression,
    isOctalNumber,
    isOriginalKeyword,
    stringLiteralIsInRegExp
} from "./syntaxCheckHelper";

function checkDeleteStatement(node: ts.DeleteExpression) {
    let unaryExpr = node.expression;
    if (ts.isIdentifier(unaryExpr)) {
        throw new DiagnosticError(unaryExpr, DiagnosticCode.A_delete_cannot_be_called_on_an_identifier_in_strict_mode);
    }
}

function checkNumericLiteral(node: ts.NumericLiteral) {
    let num = jshelpers.getTextOfNode(node);
    if (!isOctalNumber(num)) {
        return;
    }

    throw new DiagnosticError(node, DiagnosticCode.Octal_literals_are_not_allowed_in_strict_mode);
}

function checkString(node: ts.Node, text: string) {

    if (isIncludeOctalEscapeSequence(text)) {
        throw new DiagnosticError(node, DiagnosticCode.Octal_escape_sequences_are_not_allowed_in_strict_mode);
    }

    if (isIncludeOctalEscapeSequence(text)) {
        throw new DiagnosticError(node, DiagnosticCode._8_and_9_are_not_allowed_in_strict_mode);
    }
}

function checkStringLiteral(node: ts.StringLiteral) {
    // Octal escape has been deprecated in ES5, but it can be used in regular expressions
    if (stringLiteralIsInRegExp(node)) {
        return;
    }

    let text = jshelpers.getTextOfNode(node);
    checkString(node, text);
}

function checkEvalOrArgumentsOrOriginalKeyword(contextNode: ts.Node, name: ts.Node | undefined) {
    if (!name || !ts.isIdentifier(name)) {
        return;
    }

    let identifier = <ts.Identifier>name;
    if (!isEvalOrArgumentsIdentifier(identifier) && !isOriginalKeyword(identifier)) {
        return;
    }

    let file = jshelpers.getSourceFileOfNode(name);
    let args = [ts.idText(identifier)];
    throw new DiagnosticError(name, getStrictModeEvalOrArgumentsDiagnosticCode(contextNode), file, args);
}


function getStrictModeEvalOrArgumentsDiagnosticCode(node: ts.Node) {
    if (jshelpers.getContainingClass(node)) {
        return DiagnosticCode.Invalid_use_of_0_Class_definitions_are_automatically_in_strict_mode;
    }

    return DiagnosticCode.Invalid_use_of_0_in_strict_mode;
}

function getStrictModeIdentifierDiagnosticCode(node: ts.Node) {
    if (jshelpers.getContainingClass(node)) {
        return DiagnosticCode.Identifier_expected_0_is_a_reserved_word_in_strict_mode_Class_definitions_are_automatically_in_strict_mode;
    }

    return DiagnosticCode.Identifier_expected_0_is_a_reserved_word_in_strict_mode;
}

function checkBinaryExpression(node: ts.BinaryExpression) {
    if (!isLeftHandSideExpression(node.left) || !isAssignmentOperator(node.operatorToken.kind)) {
        return;
    }

    let contextNode = <ts.Node>node;
    let name = node.left;
    switch (node.left.kind) {
        case ts.SyntaxKind.ParenthesizedExpression: {
            let expr = findInnerExprOfParenthesis(<ts.ParenthesizedExpression>(node.left));
            contextNode = <ts.Node>expr;
            name = expr;
            break;
        }
        default:
            break;
    }

    checkEvalOrArgumentsOrOriginalKeyword(contextNode, <ts.Identifier>name);
}

function checkContextualIdentifier(node: ts.Identifier) {
    let file = jshelpers.getSourceFileOfNode(node);
    if (jshelpers.getTextOfIdentifierOrLiteral(node) == 'await' && CmdOptions.isModules()) {
        throw new DiagnosticError(node, DiagnosticCode.Identifier_expected_0_is_a_reserved_word_at_the_top_level_of_a_module, file, ['await']);
    }

    if (jshelpers.isIdentifierName(node)) {
        return;
    }

    if (isOriginalKeyword(node)) {
        throw new DiagnosticError(node, getStrictModeIdentifierDiagnosticCode(node), file, jshelpers.declarationNameToString(node));
    }

}

function checkParameters(decl: ts.FunctionLikeDeclaration | ts.FunctionExpression) {
    let parameters: ts.NodeArray<ts.ParameterDeclaration> = decl.parameters;
    let obj = new Map();
    for (let i = 0; i < parameters.length; i++) {
        let param = parameters[i];
        checkEvalOrArgumentsOrOriginalKeyword(param, param.name);
        let name = jshelpers.getTextOfIdentifierOrLiteral(<ts.Identifier>param.name);
        if (obj.has(name)) {
            let args: (string | number)[] = [jshelpers.declarationNameToString(param.name)];
            throw new DiagnosticError(param.name, DiagnosticCode.Duplicate_identifier_0, undefined, args);
        }

        if (name) {
            obj.set(name, true);
        }

        if (param.initializer || param.dotDotDotToken) {
            if (checkStrictModeStatementList(decl)) {
                throw new DiagnosticError(param, DiagnosticCode.use_strict_directive_cannot_be_used_with_non_simple_parameter_list);
            }
        }
    }
}

function checkWithStatement(node: ts.WithStatement) {
    let file = jshelpers.getSourceFileOfNode(node);
    throw new DiagnosticError(node, DiagnosticCode.A_with_statements_are_not_allowed_in_strict_mode, file);
}

function checkNoSubstitutionTemplateLiteral(expr: ts.NoSubstitutionTemplateLiteral) {
    let text = jshelpers.getTextOfNode(expr);
    checkString(expr, text.substring(1, text.length - 1));
}

function checkFunctionDeclaration(node: ts.FunctionDeclaration) {
    checkEvalOrArgumentsOrOriginalKeyword(node, node.name);
    checkParameters(node);
    if (!isInBlockScope(node.parent!)) {
        throw new DiagnosticError(node, DiagnosticCode.In_strict_mode_code_functions_can_only_be_declared_at_top_level_or_inside_a_block);
    }
}

function checkClassDeclaration(node: ts.ClassDeclaration) {
    if (!hasExportKeywordModifier(node) && !node.name) {
        if (!node.name && !hasDefaultKeywordModifier(node)) {
            throw new DiagnosticError(node, DiagnosticCode.Identifier_expected);
        }
    }
}

function checkImportDeclaration(node: ts.ImportDeclaration, scope: Scope) {
    if (!(scope instanceof ModuleScope)) {
        throw new DiagnosticError(node, DiagnosticCode.An_import_declaration_can_only_be_used_in_a_namespace_or_module);
    }

    if (node.modifiers) {
        throw new DiagnosticError(node, DiagnosticCode.An_import_declaration_cannot_have_modifiers);
    }

    if (node.importClause && node.importClause.namedBindings) {
        let namedBindings = node.importClause.namedBindings;
        if (ts.isNamedImports(namedBindings)) {
            namedBindings.elements.forEach((element: any) => {
                if (jshelpers.getTextOfIdentifierOrLiteral(element.name) == 'arguments'
                    || jshelpers.getTextOfIdentifierOrLiteral(element.name) == 'eval') {
                    throw new DiagnosticError(node, DiagnosticCode.Unexpected_eval_or_arguments_in_strict_mode);
                }
            });
        }
    }
}

function checkExportAssignment(node: ts.ExportAssignment, scope: Scope) {
    if (!(scope instanceof ModuleScope)) {
        throw new DiagnosticError(node, DiagnosticCode.An_export_assignment_must_be_at_the_top_level_of_a_file_or_module_declaration);
    }

    if (node.modifiers) {
        throw new DiagnosticError(node, DiagnosticCode.An_export_assignment_cannot_have_modifiers);
    }
}

function checkExportDeclaration(node: ts.ExportDeclaration, scope: Scope) {
    if (!(scope instanceof ModuleScope)) {
        throw new DiagnosticError(node, DiagnosticCode.An_export_declaration_can_only_be_used_in_a_module);
    }

    if (node.modifiers) {
        throw new DiagnosticError(node, DiagnosticCode.An_export_declaration_cannot_have_modifiers);
    }
}

export function checkSyntaxErrorForStrictMode(node: ts.Node, scope: Scope) {
    switch (node.kind) {
        case ts.SyntaxKind.NumericLiteral:
            checkNumericLiteral(<ts.NumericLiteral>node);
            break;
        case ts.SyntaxKind.StringLiteral:
            checkStringLiteral(<ts.StringLiteral>node);
            break;
        case ts.SyntaxKind.FunctionDeclaration:
            checkFunctionDeclaration(<ts.FunctionDeclaration>node);
            break;
        case ts.SyntaxKind.FunctionExpression:
            let funcNode = <ts.FunctionExpression>node;
            checkEvalOrArgumentsOrOriginalKeyword(funcNode, funcNode.name);
            checkParameters(funcNode);
            break;
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.ArrowFunction:
            checkParameters(<ts.FunctionLikeDeclaration | ts.FunctionExpression>node);
            break;
        case ts.SyntaxKind.ClassDeclaration:
            checkClassDeclaration(<ts.ClassDeclaration>node);
            break;
        case ts.SyntaxKind.VariableDeclaration:
            let varNode = <ts.VariableDeclaration>node;
            checkEvalOrArgumentsOrOriginalKeyword(varNode, varNode.name);
            break;
        case ts.SyntaxKind.BindingElement:
            let bindNode = <ts.BindingElement>node;
            checkEvalOrArgumentsOrOriginalKeyword(node, bindNode.name);
            break;
        case ts.SyntaxKind.BinaryExpression:
            checkBinaryExpression(<ts.BinaryExpression>node);
            break;
        case ts.SyntaxKind.PrefixUnaryExpression:
        case ts.SyntaxKind.PostfixUnaryExpression:
            let unaryNode = <ts.PrefixUnaryExpression | ts.PostfixUnaryExpression>node;
            checkEvalOrArgumentsOrOriginalKeyword(node, unaryNode.operand);
            break;
        case ts.SyntaxKind.DeleteExpression:
            checkDeleteStatement(<ts.DeleteExpression>node);
            break;
        case ts.SyntaxKind.WithStatement:
            checkWithStatement(<ts.WithStatement>node);
            break;
        case ts.SyntaxKind.Identifier:
            checkContextualIdentifier(<ts.Identifier>node);
            break;
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
        case ts.SyntaxKind.FirstTemplateToken:
        case ts.SyntaxKind.LastLiteralToken:
            checkNoSubstitutionTemplateLiteral(<ts.NoSubstitutionTemplateLiteral>node);
            break;
        case ts.SyntaxKind.ImportDeclaration:
            checkImportDeclaration(<ts.ImportDeclaration>node, scope);
            break;
        case ts.SyntaxKind.ExportAssignment:
            checkExportAssignment(<ts.ExportAssignment>node, scope);
            break;
        case ts.SyntaxKind.ExportDeclaration:
            checkExportDeclaration(<ts.ExportDeclaration>node, scope);
            break;
        default:
            break;
    }
}
