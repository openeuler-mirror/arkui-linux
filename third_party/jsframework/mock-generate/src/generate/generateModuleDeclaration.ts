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

import { SourceFile, SyntaxKind } from 'typescript';
import { firstCharacterToUppercase } from '../common/commonUtils';
import { ModuleBlockEntity } from '../declaration-node/moduleDeclaration';
import {
  getDefaultExportClassDeclaration, getSourceFileFunctions,
  getSourceFileVariableStatements
} from '../declaration-node/sourceFileElementsAssemply';
import { generateClassDeclaration } from './generateClassDeclaration';
import { generateCommonFunction } from './generateCommonFunction';
import { generateEnumDeclaration } from './generateEnumDeclaration';
import { generateImportEqual } from './generateImportEqual';
import { addToIndexArray } from './generateIndex';
import { generateInterfaceDeclaration } from './generateInterfaceDeclaration';
import { generateStaticFunction } from './generateStaticFunction';
import { addToSystemIndexArray } from './generateSystemIndex';
import { generateTypeAliasDeclaration } from './generateTypeAlias';
import { generateVariableStatementDelcatation } from './generateVariableStatementDeclaration';

/**
 * generate declare
 * @param rootName
 * @param moduleEntity
 * @param sourceFile
 * @param filename
 * @returns
 */
export function generateModuleDeclaration(rootName: string, moduleEntity: ModuleBlockEntity, sourceFile: SourceFile, filename: string): string {
  const moduleName = moduleEntity.moduleName;
  const mockNameArr = filename.split('_');
  const mockName = mockNameArr[mockNameArr.length - 1];
  let moduleBody = `export function mock${firstCharacterToUppercase(mockName)}() {\n`;
  addToIndexArray({ fileName: filename, mockFunctionName: `mock${firstCharacterToUppercase(mockName)}` });
  let outBody = '';
  const defaultExportClass = getDefaultExportClassDeclaration(sourceFile);

  if (defaultExportClass.length > 0) {
    defaultExportClass.forEach(value => {
      if (value.exportModifiers.includes(SyntaxKind.DefaultKeyword) && value.exportModifiers.includes(SyntaxKind.ExportKeyword)) {
        if (filename.startsWith('system_')) {
          const mockNameArr = filename.split('_');
          const mockName = mockNameArr[mockNameArr.length - 1];
          addToSystemIndexArray({
            filename: filename,
            mockFunctionName: `mock${firstCharacterToUppercase(mockName)}`
          });

          moduleBody += `global.systemplugin.${mockName} = {`;
          if (value.staticMethods.length > 0) {
            let staticMethodBody = '';
            value.staticMethods.forEach(val => {
              staticMethodBody += generateStaticFunction(val, true, sourceFile) + '\n';
            });
            moduleBody += staticMethodBody;
          }
          moduleBody += '}';
        } else {
          outBody += generateClassDeclaration('', value, false, '', filename, sourceFile, false);
        }
      }
    });
  }

  if (moduleEntity.typeAliasDeclarations.length > 0) {
    moduleEntity.typeAliasDeclarations.forEach(value => {
      outBody += generateTypeAliasDeclaration(value, true) + '\n';
    });
  }

  if (moduleEntity.moduleImportEquaqls.length > 0) {
    moduleEntity.moduleImportEquaqls.forEach(value => {
      outBody += generateImportEqual(value) + '\n';
    });
  }

  if (moduleEntity.classDeclarations.length > 0) {
    moduleEntity.classDeclarations.forEach(value => {
      if (value.exportModifiers.length > 0 && value.exportModifiers.includes(SyntaxKind.ExportKeyword)) {
        outBody += generateClassDeclaration(moduleName, value, false, '', '', sourceFile, false) + '\n';
      } else {
        moduleBody += '\t' + generateClassDeclaration(moduleName, value, false, '', '', sourceFile, true) + '\n';
      }
    });
  }

  if (moduleEntity.interfaceDeclarations.length > 0) {
    moduleEntity.interfaceDeclarations.forEach(value => {
      if (value.exportModifiers.length > 0) {
        outBody += generateInterfaceDeclaration(moduleName, value, sourceFile, false, moduleEntity.interfaceDeclarations) + ';\n';
      } else {
        moduleBody += '\t' + generateInterfaceDeclaration(moduleName, value, sourceFile, false, moduleEntity.interfaceDeclarations) + ';\n';
      }
    });
  }

  if (moduleEntity.enumDeclarations.length > 0) {
    moduleEntity.enumDeclarations.forEach(value => {
      if (value.exportModifiers.length > 0) {
        outBody += generateEnumDeclaration(moduleName, value) + '\n';
      } else {
        moduleBody += '\t' + generateEnumDeclaration(moduleName, value) + '\n';
      }
    });
  }

  if (moduleEntity.moduleDeclarations.length > 0) {
    moduleEntity.moduleDeclarations.forEach(value => {
      moduleBody += generateInnerModule(value, sourceFile) + '\n';
    });
  }

  let functionBody = '';
  if (moduleEntity.functionDeclarations.size > 0) {
    moduleEntity.functionDeclarations.forEach(value => {
      functionBody += '\t' + generateCommonFunction(moduleName, value, sourceFile) + '\n';
    });
  }

  moduleBody += '\t' + `const ${moduleName} = {`;
  if (moduleEntity.variableStatements.length > 0) {
    moduleEntity.variableStatements.forEach(value => {
      value.forEach(val => {
        moduleBody += generateVariableStatementDelcatation(val) + '\n';
      });
    });
  }

  const sourceFileFunctions = getSourceFileFunctions(sourceFile);
  let sourceFileFunctionBody = '';
  if (sourceFileFunctions.size > 0) {
    sourceFileFunctions.forEach(value => {
      sourceFileFunctionBody += generateCommonFunction(moduleName, value, sourceFile);
    });
  }

  const sourceFileVariableStatements = getSourceFileVariableStatements(sourceFile);
  let sourceFileStatementBody = '';
  if (sourceFileVariableStatements.length > 0) {
    sourceFileVariableStatements.forEach(value => {
      value.forEach(val => {
        sourceFileStatementBody += generateVariableStatementDelcatation(val);
      });
    });
  }

  moduleBody += sourceFileFunctionBody + '\n';
  moduleBody += sourceFileStatementBody + '\n';
  moduleBody += functionBody + '\n';

  const exports = getModuleExportElements(moduleEntity);
  let exportString = '';
  exports.forEach(value => {
    exportString += `${value.name}: ${value.name},\n`;
  });
  if (exportString !== '') {
    moduleBody += '\t' + exportString;
  }

  moduleBody += '\t};';
  moduleBody += `\n\treturn ${moduleName};}\n`;
  moduleBody += outBody;
  return moduleBody;
}

/**
 * generate inner module
 * @param moduleEntity
 * @param sourceFile
 * @returns
 */
function generateInnerModule(moduleEntity: ModuleBlockEntity, sourceFile: SourceFile): string {
  const moduleName = moduleEntity.moduleName;
  let innerModuleBody = `const ${moduleName} = {`;

  if (moduleEntity.typeAliasDeclarations.length > 0) {
    moduleEntity.typeAliasDeclarations.forEach(value => {
      innerModuleBody += generateTypeAliasDeclaration(value, true) + '\n';
    });
  }

  if (moduleEntity.moduleImportEquaqls.length > 0) {
    moduleEntity.moduleImportEquaqls.forEach(value => {
      innerModuleBody += generateImportEqual(value) + '\n';
    });
  }

  if (moduleEntity.interfaceDeclarations.length > 0) {
    moduleEntity.interfaceDeclarations.forEach(value => {
      innerModuleBody += generateInterfaceDeclaration(moduleName, value, sourceFile, false, moduleEntity.interfaceDeclarations) + '\n';
    });
  }

  if (moduleEntity.enumDeclarations.length > 0) {
    moduleEntity.enumDeclarations.forEach(value => {
      innerModuleBody += generateEnumDeclaration(moduleName, value) + '\n';
    });
  }

  let functionBody = '';
  if (moduleEntity.functionDeclarations.size > 0) {
    moduleEntity.functionDeclarations.forEach(value => {
      functionBody += generateCommonFunction(moduleName, value, sourceFile) + '\n';
    });
  }

  if (moduleEntity.variableStatements.length > 0) {
    moduleEntity.variableStatements.forEach(value => {
      value.forEach(val => {
        innerModuleBody += generateVariableStatementDelcatation(val) + '\n';
      });
    });
  }
  innerModuleBody += functionBody + '\n';

  const exports = getModuleExportElements(moduleEntity);
  let exportString = '';
  exports.forEach(value => {
    exportString += `${value.name}: ${value.name},\n`;
  });
  if (exportString !== '') {
    innerModuleBody += '\t' + exportString;
  }
  innerModuleBody += '\t};';
  return innerModuleBody;
}

/**
 * get all export elements
 * @param moduleEntity
 * @returns
 */
function getModuleExportElements(moduleEntity: ModuleBlockEntity): Array<ModuleExportEntity> {
  const exportElements: Array<ModuleExportEntity> = [];
  if (moduleEntity.classDeclarations.length > 0) {
    moduleEntity.classDeclarations.forEach(value => {
      exportElements.push({ name: firstCharacterToUppercase(value.className), type: 'class' });
    });
  }

  if (moduleEntity.interfaceDeclarations.length > 0) {
    moduleEntity.interfaceDeclarations.forEach(value => {
      exportElements.push({ name: value.interfaceName, type: 'interface' });
    });
  }

  if (moduleEntity.enumDeclarations.length > 0) {
    moduleEntity.enumDeclarations.forEach(value => {
      exportElements.push({ name: value.enumName, type: 'enum' });
    });
  }

  if (moduleEntity.moduleDeclarations.length > 0) {
    moduleEntity.moduleDeclarations.forEach(value => {
      exportElements.push({ name: value.moduleName, type: 'module' });
    });
  }

  if (moduleEntity.typeAliasDeclarations.length > 0) {
    moduleEntity.typeAliasDeclarations.forEach(value => {
      exportElements.push({ name: value.typeAliasName, type: 'type' });
    });
  }
  return exportElements;
}

interface ModuleExportEntity {
  type: string,
  name: string
}
