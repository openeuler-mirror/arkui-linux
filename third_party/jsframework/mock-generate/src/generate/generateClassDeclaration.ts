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
import { ClassEntity } from '../declaration-node/classDeclaration';
import { generateCommonMethod } from './generateCommonMethod';
import { getWarnConsole } from './generateCommonUtil';
import { generatePropertyDeclaration } from './generatePropertyDeclaration';
import { generateStaticFunction } from './generateStaticFunction';

/**
 * generate class
 * @param rootName
 * @param classEntity
 * @param isSystem
 * @param globalName
 * @param filename
 * @param sourceFile
 * @param isInnerMockFunction
 * @returns
 */
export function generateClassDeclaration(rootName: string, classEntity: ClassEntity, isSystem: boolean, globalName: string,
  filename: string, sourceFile: SourceFile, isInnerMockFunction: boolean): string {
  if (isSystem) {
    return '';
  }

  const className = firstCharacterToUppercase(classEntity.className);
  let classBody = '';
  if (classEntity.exportModifiers.includes(SyntaxKind.ExportKeyword) && !isInnerMockFunction) {
    classBody += `export const ${className} = class ${className} `;
  } else {
    classBody += `const ${className} = class ${className} `;
  }

  let isExtend = false;

  if (classEntity.heritageClauses.length > 0) {
    classEntity.heritageClauses.forEach(value => {
      if (value.clauseToken === 'extends') {
        isExtend = true;
        classBody += `${value.clauseToken} `;
        value.types.forEach((val, index) => {
          if (index !== value.types.length - 1) {
            classBody += `${val},`;
          } else {
            classBody += `${val}`;
          }
        });
      }
    });
  }

  if (!isSystem) {
    classBody += '{';
    if (classEntity.classConstructor.length > 1) {
      classBody += `constructor(...arg) { `;
    } else {
      classBody += `constructor() { `;
    }
    if (isExtend) {
      classBody += `super();`;
    }
    classBody += getWarnConsole(className, 'constructor');
  }
  if (classEntity.classProperty.length > 0) {
    classEntity.classProperty.forEach(value => {
      classBody += generatePropertyDeclaration(className, value, sourceFile) + '\n';
    });
  }

  if (classEntity.classMethod.size > 0) {
    classEntity.classMethod.forEach(value => {
      classBody += generateCommonMethod(className, value, sourceFile);
    });
  }

  classBody += '}\n};';
  if (!filename.startsWith('system_')) {
    if (classEntity.staticMethods.length > 0) {
      let staticMethodBody = '';
      classEntity.staticMethods.forEach(value => {
        staticMethodBody += generateStaticFunction(value, false, sourceFile) + '\n';
      });
      classBody += staticMethodBody;
    }
  }
  return classBody;
}
