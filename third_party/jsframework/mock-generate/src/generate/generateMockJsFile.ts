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
import { collectAllLegalImports, firstCharacterToUppercase, getAllFileNameList } from '../common/commonUtils';
import { ImportElementEntity } from '../declaration-node/importAndExportDeclaration';
import { getDefaultExportClassDeclaration, getSourceFileFunctions, getSourceFileVariableStatements, SourceFileEntity } from '../declaration-node/sourceFileElementsAssemply';
import { generateClassDeclaration } from './generateClassDeclaration';
import { generateCommonFunction } from './generateCommonFunction';
import { generateEnumDeclaration } from './generateEnumDeclaration';
import { addToIndexArray } from './generateIndex';
import { generateInterfaceDeclaration } from './generateInterfaceDeclaration';
import { generateModuleDeclaration } from './generateModuleDeclaration';
import { generateStaticFunction } from './generateStaticFunction';
import { addToSystemIndexArray } from './generateSystemIndex';
import { generateTypeAliasDeclaration } from './generateTypeAlias';
import { generateVariableStatementDelcatation } from './generateVariableStatementDeclaration';

/**
 * generate mock file string
 * @param rootName
 * @param sourceFileEntity
 * @param sourceFile
 * @param fileName
 * @returns
 */
export function generateSourceFileElements(rootName: string, sourceFileEntity: SourceFileEntity, sourceFile: SourceFile, fileName: string): string {
  let mockApi = '';
  const mockFunctionElements: Array<MockFunctionElementEntity> = [];
  const heritageClausesArray = getCurrentApiHeritageArray(sourceFileEntity, sourceFile);
  if (sourceFileEntity.importDeclarations.length > 0) {
    sourceFileEntity.importDeclarations.forEach(value => {
      mockApi += generateImportDeclaration(value, fileName, heritageClausesArray);
    });
  }

  if (sourceFileEntity.moduleDeclarations.length > 0) {
    sourceFileEntity.moduleDeclarations.forEach(value => {
      mockApi += generateModuleDeclaration('', value, sourceFile, fileName) + '\n';
    });
  }

  if (sourceFileEntity.classDeclarations.length > 0) {
    sourceFileEntity.classDeclarations.forEach(value => {
      if (!fileName.startsWith('system_') && !value.exportModifiers.includes(SyntaxKind.DefaultKeyword)) {
        mockApi += generateClassDeclaration('', value, false, '', fileName, sourceFile, false) + '\n';
        mockFunctionElements.push({ elementName: value.className, type: 'class' });
      }
    });
  }

  if (sourceFileEntity.interfaceDeclarations.length > 0) {
    sourceFileEntity.interfaceDeclarations.forEach(value => {
      mockApi += generateInterfaceDeclaration('', value, sourceFile, true, sourceFileEntity.interfaceDeclarations) + '\n';
      mockFunctionElements.push({ elementName: value.interfaceName, type: 'interface' });
    });
  }

  if (sourceFileEntity.enumDeclarations.length > 0) {
    sourceFileEntity.enumDeclarations.forEach(value => {
      mockApi += generateEnumDeclaration('', value) + '\n';
      mockFunctionElements.push({ elementName: value.enumName, type: 'enum' });
    });
  }

  if (sourceFileEntity.typeAliasDeclarations.length > 0) {
    sourceFileEntity.typeAliasDeclarations.forEach(value => {
      mockApi += generateTypeAliasDeclaration(value, false) + '\n';
      mockFunctionElements.push({ elementName: value.typeAliasName, type: 'typeAlias' });
    });
  }

  if (sourceFileEntity.moduleDeclarations.length === 0 && (fileName.startsWith('ohos_') || fileName.startsWith('system_') || fileName.startsWith('webgl'))) {
    const mockNameArr = fileName.split('_');
    const mockName = mockNameArr[mockNameArr.length - 1];
    const defaultExportClass = getDefaultExportClassDeclaration(sourceFile);
    if (defaultExportClass.length > 0) {
      defaultExportClass.forEach(value => {
        mockApi += generateClassDeclaration(rootName, value, false, mockName, '', sourceFile, false) + '\n';
        mockFunctionElements.push({ elementName: value.className, type: 'class' });
      });
    }
    mockApi += `export function mock${firstCharacterToUppercase(mockName)}() {\n`;
    if (fileName.startsWith('system_')) {
      addToSystemIndexArray({
        filename: fileName,
        mockFunctionName: `mock${firstCharacterToUppercase(mockName)}`
      });
      mockApi += `global.systemplugin.${mockName} = {`;
      const defaultClass = getDefaultExportClassDeclaration(sourceFile);
      let staticMethodBody = '';
      if (defaultClass.length > 0) {
        defaultClass.forEach(value => {
          value.staticMethods.forEach(val => {
            staticMethodBody += generateStaticFunction(val, true, sourceFile);
          });
        });
      }
      mockApi += staticMethodBody;
      mockApi += '}';
    } else {
      if (!fileName.startsWith('webgl')) {
        addToIndexArray({ fileName: fileName, mockFunctionName: `mock${firstCharacterToUppercase(mockName)}` });
      }
    }
    mockApi += `\nconst mockModule${firstCharacterToUppercase(mockName)} = {`;
    mockFunctionElements.forEach(val => {
      mockApi += `${val.elementName}: ${val.elementName},`;
    });
    mockApi += '}\n';
    mockApi += `return mockModule${firstCharacterToUppercase(mockName)}.${firstCharacterToUppercase(mockName)}\n`;
    mockApi += '}';
  } else {
    const defaultExportClass = getDefaultExportClassDeclaration(sourceFile);
    if (defaultExportClass.length > 0) {
      const mockNameArr = fileName.split('_');
      const mockName = mockNameArr[mockNameArr.length - 1];
      defaultExportClass.forEach(value => {
        mockApi += generateClassDeclaration(rootName, value, false, mockName, '', sourceFile, false) + '\n';
      });
    }
  }
  if (sourceFileEntity.exportDeclarations.length > 0) {
    sourceFileEntity.exportDeclarations.forEach(value => {
      if (!value.includes('export {')) {
        mockApi += `${value}\n`;
      }
    });
  }
  return mockApi;
}

/**
 * generate import definition
 * @param importEntity
 * @param sourceFileName
 * @returns
 */
export function generateImportDeclaration(importEntity: ImportElementEntity, sourceFileName: string, heritageClausesArray: string[]): string {
  let importPathName = '';
  const importPathSplit = importEntity.importPath.split('/');
  let fileName = importPathSplit[importPathSplit.length - 1];
  if (fileName.endsWith('.d.ts')) {
    fileName = fileName.split('.d.')[0];
  }
  if (fileName.includes('@')) {
    importPathName = fileName.replace('@', '').replace(/\./g, '_');
  } else {
    importPathName = fileName.replace(/\./g, '_');
  }
  let importPath = '';
  for (let i = 0; i < importPathSplit.length - 1; i++) {
    importPath += importPathSplit[i] + '/';
  }
  importPath += importPathName;
  let importElements = importEntity.importElements;
  if (!importElements.includes('{') && !importElements.includes('* as') && !heritageClausesArray.includes(importElements)) {
    if (importEntity.importPath.includes('@ohos')) {
      const tmpArr = importEntity.importPath.split('.');
      importElements = `{ mock${firstCharacterToUppercase(tmpArr[tmpArr.length - 1].replace('"', '').replace('\'', ''))} }`;
    } else {
      importElements = `{ ${importElements} }`;
    }
  }
  if (checIsDefaultExportClass(importEntity.importElements)) {
    importElements = `{ ${importEntity.importElements} }`;
  }
  const testPath = importPath.replace(/"/g, '').replace(/'/g, '').split('/');
  if (getAllFileNameList().has(testPath[testPath.length - 1]) || testPath[testPath.length - 1] === 'ohos_application_want') {
    const tmpImportPath = importPath.replace(/'/g, '').replace(/"/g, '');
    if (!tmpImportPath.startsWith('./') && !tmpImportPath.startsWith('../')) {
      importPath = `'./${tmpImportPath}'`;
    }
    if (sourceFileName === 'tagSession' && importPath === `'./basic'` || sourceFileName === 'notificationContent' && importPath === `'./ohos_multimedia_image'`) {
      importPath = `'.${importPath.replace(/'/g, '')}'`;
    }

    // adapt no rules .d.ts
    if (importElements.trimRight().trimEnd() === 'AccessibilityExtensionContext, { AccessibilityElement }') {
      importElements = '{ AccessibilityExtensionContext, AccessibilityElement }';
    }
    if (importElements.trimRight().trimEnd() === '{ image }') {
      importElements = '{ mockImage as image }';
    }
    if (sourceFileName === 'AbilityContext' && importPath === `'../ohos_application_Ability'` || 
      sourceFileName === 'Context' && importPath === `"./ApplicationContext"`) {
      return '';
    }
    collectAllLegalImports(importElements);
    return `import ${importElements} from ${importPath}\n`;
  } else {
    return '';
  }
}

/**
 * adapter default export
 * @param importName
 * @returns
 */
 function checIsDefaultExportClass(importName: string): boolean {
  const defaultExportClass = ['Context', 'BaseContext', 'ExtensionContext', 'ApplicationContext', 'ExtensionAbility', 'Ability'];
  return defaultExportClass.includes(importName);
}

/**
 * get heritage elements
 * @param sourceFileEntity
 * @param sourceFile
 * @returns
 */
function getCurrentApiHeritageArray(sourceFileEntity: SourceFileEntity, sourceFile: SourceFile): string[] {
  const heritageClausesArray = [];
  const defaultClassArray = getDefaultExportClassDeclaration(sourceFile);
  sourceFileEntity.classDeclarations.forEach(value => {
    value.heritageClauses.forEach(val => {
      val.types.forEach(v => {
        heritageClausesArray.push(v);
      });
    });
  });
  defaultClassArray.forEach(value => {
    value.heritageClauses.forEach(val => {
      val.types.forEach(v => {
        heritageClausesArray.push(v);
      });
    });
  });
  return heritageClausesArray;
}

interface MockFunctionElementEntity {
  elementName: string,
  type: string
}
