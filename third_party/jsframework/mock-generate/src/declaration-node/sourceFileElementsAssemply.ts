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

import {
  isClassDeclaration, isEnumDeclaration, isExportAssignment, isExportDeclaration, isFunctionDeclaration,
  isImportDeclaration, isInterfaceDeclaration, isModuleDeclaration, isTypeAliasDeclaration, isVariableStatement,
  SourceFile, SyntaxKind
} from 'typescript';
import { ClassEntity, getClassDeclaration } from './classDeclaration';
import { EnumEntity, getEnumDeclaration } from './enumDeclaration';
import { FunctionEntity, getFunctionDeclaration } from './functionDeclaration';
import { getExportAssignment, getImportDeclaration, ImportElementEntity } from './importAndExportDeclaration';
import { getInterfaceDeclaration, InterfaceEntity } from './interfaceDeclaration';
import { StaticMethodEntity } from './methodDeclaration';
import { getModuleDeclaration, ModuleBlockEntity } from './moduleDeclaration';
import { getTypeAliasDeclaration, TypeAliasEntity } from './typeAliasDeclaration';
import { getVariableStatementDeclaration, StatementEntity } from './variableStatementResolve';

/**
 * assembly all sourceFile node info
 * @param sourceFile
 * @param fileName
 * @returns
 */
export function getSourceFileAssembly(sourceFile: SourceFile, fileName: string): SourceFileEntity {
  const importDeclarations: Array<ImportElementEntity> = [];
  const moduleDeclarations: Array<ModuleBlockEntity> = [];
  const typeAliasDeclarations: Array<TypeAliasEntity> = [];
  const classDeclarations: Array<ClassEntity> = [];
  const interfaceDeclarations: Array<InterfaceEntity> = [];
  const enumDeclarations: Array<EnumEntity> = [];
  let exportAssignment: Array<string> = [];
  const staticMethods: Array<Array<StaticMethodEntity>> = [];
  const exportDeclarations: Array<string> = [];

  sourceFile.forEachChild(node => {
    if (isImportDeclaration(node)) {
      importDeclarations.push(getImportDeclaration(node, sourceFile));
    } else if (isModuleDeclaration(node)) {
      moduleDeclarations.push(getModuleDeclaration(node, sourceFile, fileName));
    } else if (isTypeAliasDeclaration(node)) {
      typeAliasDeclarations.push(getTypeAliasDeclaration(node, sourceFile));
    } else if (isClassDeclaration(node)) {
      let isDefaultExportClass = false;
      if (node.modifiers !== undefined) {
        node.modifiers.forEach(value => {
          if (value.kind === SyntaxKind.DefaultKeyword) {
            isDefaultExportClass = true;
          }
        });
      }
      if (isDefaultExportClass) {
        const classDeclarationEntity = getClassDeclaration(node, sourceFile);
        classDeclarations.push(classDeclarationEntity);
        if (classDeclarationEntity.staticMethods.length > 0) {
          staticMethods.push(classDeclarationEntity.staticMethods);
        }
      }
    } else if (isInterfaceDeclaration(node)) {
      interfaceDeclarations.push(getInterfaceDeclaration(node, sourceFile));
    } else if (isExportAssignment(node)) {
      exportAssignment = getExportAssignment(node, sourceFile);
    } else if (isEnumDeclaration(node)) {
      enumDeclarations.push(getEnumDeclaration(node, sourceFile));
    } else if (isExportDeclaration(node)) {
      exportDeclarations.push(sourceFile.text.substring(node.pos, node.end).trimStart().trimEnd());
    } else {
      if (node.kind !== SyntaxKind.EndOfFileToken && !isFunctionDeclaration(node) && !isVariableStatement(node)) {
        console.log('--------------------------- uncaught sourceFile type start -----------------------');
        console.log('fileName: ' + fileName);
        console.log(node);
        console.log('--------------------------- uncaught sourceFile type end -----------------------');
      }
    }
  });

  return {
    importDeclarations: importDeclarations,
    moduleDeclarations: moduleDeclarations,
    typeAliasDeclarations: typeAliasDeclarations,
    classDeclarations: classDeclarations,
    interfaceDeclarations: interfaceDeclarations,
    enumDeclarations: enumDeclarations,
    exportAssignment: exportAssignment,
    staticMethods: staticMethods,
    exportDeclarations: exportDeclarations
  };
}

/**
 * get default export class
 * @param sourceFile
 * @returns
 */
export function getDefaultExportClassDeclaration(sourceFile: SourceFile): Array<ClassEntity> {
  const defaultExportClass: Array<ClassEntity> = [];
  sourceFile.forEachChild(node => {
    if (isClassDeclaration(node)) {
      defaultExportClass.push(getClassDeclaration(node, sourceFile));
    }
  });
  return defaultExportClass;
}

/**
 * get sourceFile const variable statement
 * @param sourceFile
 * @returns
 */
export function getSourceFileVariableStatements(sourceFile: SourceFile): Array<Array<StatementEntity>> {
  const variableStatements: Array<Array<StatementEntity>> = [];
  sourceFile.forEachChild(node => {
    if (isVariableStatement(node)) {
      variableStatements.push(getVariableStatementDeclaration(node, sourceFile));
    }
  });
  return variableStatements;
}

/**
 * get sourcefile functions
 * @param sourceFile
 * @returns
 */
export function getSourceFileFunctions(sourceFile: SourceFile): Map<string, Array<FunctionEntity>> {
  const functionDeclarations: Map<string, Array<FunctionEntity>> = new Map<string, Array<FunctionEntity>>();
  sourceFile.forEachChild(node => {
    if (isFunctionDeclaration(node)) {
      const functionEntity = getFunctionDeclaration(node, sourceFile);
      if (functionDeclarations.get(functionEntity.functionName) !== undefined) {
        functionDeclarations.get(functionEntity.functionName)?.push(functionEntity);
      } else {
        const functionArray: Array<FunctionEntity> = [];
        functionArray.push(functionEntity);
        functionDeclarations.set(functionEntity.functionName, functionArray);
      }
    }
  });
  return functionDeclarations;
}

export interface SourceFileEntity {
  importDeclarations: Array<ImportElementEntity>,
  moduleDeclarations: Array<ModuleBlockEntity>,
  typeAliasDeclarations: Array<TypeAliasEntity>,
  classDeclarations: Array<ClassEntity>,
  interfaceDeclarations: Array<InterfaceEntity>,
  enumDeclarations: Array<EnumEntity>,
  exportAssignment: Array<string>,
  staticMethods: Array<Array<StaticMethodEntity>>,
  exportDeclarations: Array<string>
}
