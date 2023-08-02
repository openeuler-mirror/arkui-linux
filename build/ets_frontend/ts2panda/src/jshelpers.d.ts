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

import ts from "typescript";

export function getSymbol(node: ts.Node): ts.Symbol;
export function tsStringToString(str: ts.__String): string;
export function getTextOfIdentifierOrLiteral(node: ts.Node): string;
export function isJsFile(file: ts.SourceFile): boolean;
export function createEmptyNodeArray<T extends ts.Node>(): ts.NodeArray<T>;
export function getFlowNode(stmt: ts.Statement): ts.Node;
export function bindSourceFile(sourceFile: ts.SourceFile, options: ts.CompilerOptions);
export function createDiagnosticForNode(node: ts.Node, message: ts.DiagnosticMessage, ...args: (string | number | undefined)[]): ts.DiagnosticWithLocation;
export function createCompilerDiagnostic(message: ts.DiagnosticMessage, ...args: (string | number | undefined)[]): ts.Diagnostic;
export function createFileDiagnostic(file: ts.SourceFile, start: number, length: number, message: ts.DiagnosticMessage, ...args: (string | number | undefined)[]): ts.DiagnosticWithLocation;
export function isEffectiveStrictModeSourceFile(node: ts.SourceFile, compilerOptions: ts.CompilerOptions): boolean;
export function getErrorSpanForNode(sourceFile: ts.SourceFile, node: ts.Node): ts.TextSpan;
export function getSpanOfTokenAtPosition(sourceFile: ts.SourceFile, pos: number): ts.TextSpan;
export function getContainingClass(node: ts.Node): ts.ClassLikeDeclaration | undefined;
export function declarationNameToString(name: ts.DeclarationName | ts.QualifiedName | undefined);
export function getContainingFunction(node: ts.Node): ts.SignatureDeclaration | undefined;
export function isPrologueDirective(node: ts.Node): node is ts.PrologueDirective;
export function getSourceTextOfNodeFromSourceFile(sourceFile: ts.SourceFile, node: ts.Node, includeTrivia = false): string;
export function isAssignmentTarget(node: ts.Node): boolean;
export function getSourceFileOfNode(node: ts.Node): ts.SourceFile;
export function isIterationStatement(node: ts.Node, lookInLabeledStatements: boolean): node is ts.IterationStatement;
export function getTextOfNode(node: ts.Node, includeTrivia = false): string;
export function nodePosToString(node: ts.Node): string;
export function getContainingFunctionDeclaration(node: ts.Node): ts.FunctionLikeDeclaration | undefined;
export function tokenToString(t: ts.SyntaxKind): string | undefined;
export function getNewTargetContainer(node: ts.Node): ts.Node | undefined;
export function isVarConst(node: ts.VariableDeclaration | ts.VariableDeclarationList): boolean;
export function isLet(node: ts.Node): boolean;
export function nodeCanBeDecorated(node: ts.Node, parent?: ts.Node, grandparent?: ts.Node): boolean;
export function getAllAccessorDeclarations(declarations: readonly ts.Declaration[], accessor: ts.AccessorDeclaration): ts.AllAccessorDeclarations;
export function nodeIsPresent(node: ts.Node | undefined): boolean;
export function modifierToFlag(token: ts.SyntaxKind): ts.ModifierFlags;
export function hasSyntacticModifier(node: ts.Node, flags: ts.ModifierFlags): boolean;
export function isAmbientModule(node: ts.Node): node is ts.AmbientModuleDeclaration;
export function isKeyword(token: ts.SyntaxKind): boolean;
export function getThisContainer(node: ts.Node, includeArrowFunctions: boolean): ts.Node;
export function getEnclosingBlockScopeContainer(node: ts.Node): ts.Node;
export function findAncestor(node: ts.Node | undefined, callback: (element: ts.Node) => boolean | "quit"): ts.Node | undefined;
export function isBlockScope(node: ts.Node, parentNode: ts.Node): boolean;
export function isIdentifierName(node: ts.Identifier): boolean;
export function declarationNameToString(name: ts.DeclarationName | ts.QualifiedName | undefined): string;
export function isInTopLevelContext(node: ts.Node);
export function isExternalOrCommonJsModule(file: ts.SourceFile): boolean;
export function skipParentheses(node: ts.Node): ts.Node;
export function getImmediatelyInvokedFunctionExpression(func: ts.Node): ts.CallExpression | undefined;
export function hasQuestionToken(node: ts.Node);
export function getPropertyNameForPropertyNameNode(name: ts.PropertyName): ts.__String | undefined;
export function isFunctionBlock(node: ts.Node): boolean;
export function isFunctionLike(node: ts.Node): boolean;
export function getSuperContainer(node: ts.Node, stopOnFunctions: boolean): ts.Node;
export function getClassExtendsHeritageElement(node: ts.ClassLikeDeclaration | ts.InterfaceDeclaration);
export function hasStaticModifier(node: ts.Node): boolean;
export function skipOuterExpressions(node: ts.Node, kinds?: ts.OuterExpressionKinds): ts.Node;
export function isSuperCall(n: ts.Node);
export function isThisProperty(node: ts.Node): boolean;
export function isThisIdentifier(node: ts.Node | undefined): boolean;
export function isSuperProperty(node: ts.Node);
export function setParent<T extends ts.Node>(child: T | undefined, parent: T["parent"] | undefined): T | undefined;