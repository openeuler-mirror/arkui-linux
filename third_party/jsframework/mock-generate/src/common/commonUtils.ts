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

import path from 'path';
import {
  CallSignatureDeclaration, ComputedPropertyName, FunctionDeclaration, Identifier, isClassDeclaration,
  isComputedPropertyName, isIdentifier, isModuleBlock, isModuleDeclaration, isPrivateIdentifier, MethodDeclaration,
  MethodSignature, ModifiersArray, ModuleDeclaration, NodeArray, ParameterDeclaration, PropertyName, SourceFile
} from 'typescript';

const allLegalImports = new Set<string>();
const fileNameList = new Set<string>();
const allClassSet = new Set<string>();

/**
 * get all legal imports
 * @returns
 */
export function getAllLegalImports(): Set<string> {
  return allLegalImports;
}

/**
 * get all legal imports
 * @param element
 */
export function collectAllLegalImports(element: string) {
  allLegalImports.add(element);
}

/**
 * collect all mock js file path
 * @returns
 */
export function getAllFileNameList(): Set<string> {
  return fileNameList;
}

/**
 * collect all file name
 */
export function collectAllFileName(filePath: string) {
  const fileName = path.basename(filePath).split('.d.ts')[0];
  let outputFileName = '';
  if (fileName.includes('@')) {
    outputFileName = fileName.split('@')[1].replace(/\./g, '_');
  } else {
    outputFileName = fileName;
  }
  fileNameList.add(outputFileName);
}

/**
 * get all class name set
 * @returns
 */
export function getClassNameSet(): Set<string> {
  return allClassSet;
}

/**
 * get all class declaration
 * @param sourceFile
 * @returns
 */
export function getAllClassDeclaration(sourceFile: SourceFile): Set<string> {
  sourceFile.forEachChild(node => {
    if (isClassDeclaration(node)) {
      if (node.name !== undefined) {
        allClassSet.add(node.name.escapedText.toString());
      }
    } else if (isModuleDeclaration(node)) {
      const moduleDeclaration = node as ModuleDeclaration;
      const moduleBody = moduleDeclaration.body;
      if (moduleBody !== undefined && isModuleBlock(moduleBody)) {
        moduleBody.statements.forEach(value => {
          if (isClassDeclaration(value)) {
            if (value.name !== undefined) {
              allClassSet.add(firstCharacterToUppercase(value.name?.escapedText.toString()));
            }
          }
        });
      }
    }
  });
  return allClassSet;
}

/**
 * get keywords
 * @param modifiers
 * @returns
 */
export function getModifiers(modifiers: ModifiersArray): Array<number> {
  const modifiersArray: Array<number> = [];
  modifiers.forEach(value => modifiersArray.push(value.kind));
  return modifiersArray;
}

/**
 * get property name
 * @param node property node
 * @param sourceFile
 * @returns
 */
export function getPropertyName(node: PropertyName, sourceFile: SourceFile): string {
  let propertyName = '';
  if (isIdentifier(node) || isPrivateIdentifier(node)) {
    const newNameNode = node as Identifier;
    propertyName = newNameNode.escapedText.toString();
  } else if (isComputedPropertyName(node)) {
    const newNameNode = node as ComputedPropertyName;
    propertyName = sourceFile.text.substring(newNameNode.expression.pos, newNameNode.expression.end).trimStart().trimEnd();
  } else {
    propertyName = sourceFile.text.substring(node.pos, node.end).trimStart().trimEnd();
  }
  return propertyName;
}

/**
 * get parameter declaration
 * @param parameter
 * @param sourceFile
 * @returns
 */
export function getParameter(parameter: ParameterDeclaration, sourceFile: SourceFile): ParameterEntity {
  let paramName = '';
  let paramTypeString = '';
  const paramTypeKind = parameter.type?.kind === undefined ? -1 : parameter.type.kind;
  if (isIdentifier(parameter.name)) {
    paramName = parameter.name.escapedText === undefined ? '' : parameter.name.escapedText.toString();
  } else {
    const start = parameter.name.pos === undefined ? 0 : parameter.name.pos;
    const end = parameter.name.end === undefined ? 0 : parameter.name.end;
    paramName = sourceFile.text.substring(start, end).trimStart().trimEnd();
  }

  const start = parameter.type?.pos === undefined ? 0 : parameter.type.pos;
  const end = parameter.type?.end === undefined ? 0 : parameter.type.end;
  paramTypeString = sourceFile.text.substring(start, end).trimStart().trimEnd();
  return {
    paramName: paramName,
    paramTypeString: paramTypeString,
    paramTypeKind: paramTypeKind
  };
}

/**
 * get method or function return info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getFunctionAndMethodReturnInfo(node: FunctionDeclaration | MethodDeclaration |
  MethodSignature | CallSignatureDeclaration, sourceFile: SourceFile): ReturnTypeEntity {
  const returnInfo = { returnKindName: '', returnKind: -1 };
  if (node.type !== undefined) {
    const start = node.type.pos === undefined ? 0 : node.type.pos;
    const end = node.type.end === undefined ? 0 : node.type.end;
    returnInfo.returnKindName = sourceFile.text.substring(start, end).trimStart().trimEnd();
    returnInfo.returnKind = node.type.kind;
  }
  return returnInfo;
}

/**
 * get export modifiers
 * @param modifiers
 * @returns
 */
export function getExportKeyword(modifiers: ModifiersArray): Array<number> {
  const modifiersArray: Array<number> = [];
  modifiers.forEach(value => {
    modifiersArray.push(value.kind);
  });
  return modifiersArray;
}

/**
 *
 * @param str first letter capitalization
 * @returns
 */
export function firstCharacterToUppercase(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

/**
 * parameters entity
 */
export interface ParameterEntity {
  paramName: string,
  paramTypeString: string,
  paramTypeKind: number
}

/**
 * return type entity
 */
export interface ReturnTypeEntity {
  returnKindName: string,
  returnKind: number
}
