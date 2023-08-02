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

const ts = require("typescript");

function getSymbol(node) {
  return node.symbol;
}

function tsStringToString(str) {
  return "" + str;
}

function getTextOfIdentifierOrLiteral(node) {
  return ts.getTextOfIdentifierOrLiteral(node);
}

function isJsFile(file) {
  return (file.scriptKind & ts.ScriptKind.JS) != 0;
}

function createEmptyNodeArray() {
  return [];
}

function getFlowNode(stmt) {
  return stmt.flowNode;
}

function bindSourceFile(sourceFile, options) {
  ts.bindSourceFile(sourceFile, options);
}

function createDiagnosticForNode(node, message, ...args) {
  return ts.createDiagnosticForNode(node, message, ...args);
}

function createCompilerDiagnostic(message, ...args) {
  return ts.createCompilerDiagnostic(message, ...args);
}

function createFileDiagnostic(file, start, length, message, ...args) {
  return ts.createFileDiagnostic(file, start, length, message, args);
}

function isEffectiveStrictModeSourceFile(node, compilerOptions) {
  return ts.isEffectiveStrictModeSourceFile(node, compilerOptions);
}

function getErrorSpanForNode(sourceFile, node) {
  return ts.getErrorSpanForNode(sourceFile, node);
}

function getSpanOfTokenAtPosition(sourceFile, pos) {
  return ts.getSpanOfTokenAtPosition(sourceFile, pos);
}

function getContainingClass(node) {
  return ts.getContainingClass(node);
}

function declarationNameToString(node) {
  return ts.declarationNameToString(node);
}

function getContainingFunction(node) {
  return ts.getContainingFunction(node);
}

function isPrologueDirective(node) {
  return ts.isPrologueDirective(node);
}

function getSourceTextOfNodeFromSourceFile(sourceFile, node, includeTrivia) {
  return ts.getSourceTextOfNodeFromSourceFile(sourceFile, node, includeTrivia);
}

function isAssignmentTarget(node) {
  return ts.isAssignmentTarget(node);
}

function getSourceFileOfNode(node) {
  return ts.getSourceFileOfNode(node);
}

function isIterationStatement(node, lookInLabeledStatements) {
  return ts.isIterationStatement(node, lookInLabeledStatements);
}

function getTextOfNode(node, includeTrivia) {
  return ts.getTextOfNode(node, includeTrivia);
}

function nodePosToString(node) {
  return ts.nodePosToString(node);
}

function getContainingFunctionDeclaration(node) {
  return ts.getContainingFunctionDeclaration(node);
}

function tokenToString(t) {
  return ts.tokenToString(t);
}

function getNewTargetContainer(node) {
  return ts.getNewTargetContainer(node);
}

function isVarConst(node) {
  return ts.isVarConst(node);
}

function isLet(node) {
  return ts.isLet(node);
}

function nodeCanBeDecorated(node) {
  return ts.nodeCanBeDecorated(node);
}

function nodeIsPresent(node) {
  return ts.nodeIsPresent(node);
}

function getAllAccessorDeclarations(declarations, accessor) {
  return ts.getAllAccessorDeclarations(declarations, accessor);
}

function modifierToFlag(token) {
  return ts.modifierToFlag(token);
}

function hasSyntacticModifier(node, flag) {
  return ts.hasSyntacticModifier(node, flag);
}

function isAmbientModule(node) {
  return ts.isAmbientModule(node);
}

function isKeyword(node) {
  return ts.isKeyword(node);
}

function getThisContainer(node) {
  return ts.getThisContainer(node);
}

function getEnclosingBlockScopeContainer(node) {
  return ts.getEnclosingBlockScopeContainer(node);
}

function findAncestor(node, callback) {
  return ts.findAncestor(node, callback);
}

function isBlockScope(node, parentNode) {
  return ts.isBlockScope(node, parentNode);
}

function isIdentifierName(node) {
  return ts.isIdentifierName(node);
}

function declarationNameToString(node) {
  return ts.declarationNameToString(node);
}

function isInTopLevelContext(node) {
  return ts.isInTopLevelContext(node);
}

function isExternalOrCommonJsModule(node) {
  return ts.isExternalOrCommonJsModule(node);
}

function skipParentheses(node) {
  return ts.skipParentheses(node);
}

function getImmediatelyInvokedFunctionExpression(node) {
  return ts.getImmediatelyInvokedFunctionExpression(node);
}

function hasQuestionToken(node) {
  return ts.hasQuestionToken(node);
}

function getPropertyNameForPropertyNameNode(name) {
  return ts.getPropertyNameForPropertyNameNode(name);
}

function isFunctionBlock(node) {
  return ts.isFunctionBlock(node);
}

function isFunctionLike(node) {
  return ts.isFunctionLike(node);
}

function getSuperContainer(node, stopOnFunctions) {
  return ts.getSuperContainer(node, stopOnFunctions);
}

function getClassExtendsHeritageElement(node) {
  return ts.getClassExtendsHeritageElement(node);
}

function hasStaticModifier(node) {
  return ts.hasStaticModifier(node);
}

function skipOuterExpressions(node, kinds) {
  return ts.skipOuterExpressions(node, kinds);
}

function isSuperCall(node) {
  return ts.isSuperCall(node);
}

function isThisIdentifier(node) {
  return ts.isThisIdentifier(node);
}

function isThisProperty(node) {
  return ts.isThisProperty(node);
}

function isSuperProperty(node) {
  return ts.isSuperProperty(node);
}

function setParent(child, parent) {
  return ts.setParent(child, parent);
}

module.exports = {
  getSymbol: getSymbol,
  tsStringToString: tsStringToString,
  getTextOfIdentifierOrLiteral: getTextOfIdentifierOrLiteral,
  isJsFile: isJsFile,
  createEmptyNodeArray: createEmptyNodeArray,
  getFlowNode: getFlowNode,
  bindSourceFile: bindSourceFile,
  createDiagnosticForNode: createDiagnosticForNode,
  createCompilerDiagnostic: createCompilerDiagnostic,
  createFileDiagnostic: createFileDiagnostic,
  isEffectiveStrictModeSourceFile: isEffectiveStrictModeSourceFile,
  getErrorSpanForNode: getErrorSpanForNode,
  getSpanOfTokenAtPosition: getSpanOfTokenAtPosition,
  getContainingClass: getContainingClass,
  declarationNameToString: declarationNameToString,
  getContainingFunction: getContainingFunction,
  isPrologueDirective: isPrologueDirective,
  getSourceTextOfNodeFromSourceFile: getSourceTextOfNodeFromSourceFile,
  isAssignmentTarget: isAssignmentTarget,
  getSourceFileOfNode: getSourceFileOfNode,
  isIterationStatement: isIterationStatement,
  getTextOfNode: getTextOfNode,
  nodePosToString: nodePosToString,
  getContainingFunctionDeclaration: getContainingFunctionDeclaration,
  tokenToString: tokenToString,
  getNewTargetContainer: getNewTargetContainer,
  isLet: isLet,
  isVarConst: isVarConst,
  nodeCanBeDecorated: nodeCanBeDecorated,
  nodeIsPresent: nodeIsPresent,
  getAllAccessorDeclarations: getAllAccessorDeclarations,
  modifierToFlag: modifierToFlag,
  hasSyntacticModifier: hasSyntacticModifier,
  isAmbientModule: isAmbientModule,
  isKeyword: isKeyword,
  getThisContainer: getThisContainer,
  getEnclosingBlockScopeContainer: getEnclosingBlockScopeContainer,
  findAncestor: findAncestor,
  isBlockScope: isBlockScope,
  isIdentifierName: isIdentifierName,
  declarationNameToString: declarationNameToString,
  isInTopLevelContext: isInTopLevelContext,
  isExternalOrCommonJsModule: isExternalOrCommonJsModule,
  skipParentheses: skipParentheses,
  getImmediatelyInvokedFunctionExpression: getImmediatelyInvokedFunctionExpression,
  hasQuestionToken: hasQuestionToken,
  getPropertyNameForPropertyNameNode: getPropertyNameForPropertyNameNode,
  isFunctionBlock: isFunctionBlock,
  isFunctionLike: isFunctionLike,
  getSuperContainer: getSuperContainer,
  getClassExtendsHeritageElement: getClassExtendsHeritageElement,
  hasStaticModifier: hasStaticModifier,
  skipOuterExpressions: skipOuterExpressions,
  isSuperCall: isSuperCall,
  isThisIdentifier: isThisIdentifier,
  isThisProperty: isThisProperty,
  isSuperProperty: isSuperProperty,
  setParent: setParent,
};
