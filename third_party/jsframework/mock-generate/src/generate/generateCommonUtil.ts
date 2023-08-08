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
import { firstCharacterToUppercase, getClassNameSet, ReturnTypeEntity } from '../common/commonUtils';
import { getImportDeclarationArray, ImportElementEntity } from '../declaration-node/importAndExportDeclaration';
import { MethodEntity } from '../declaration-node/methodDeclaration';

/**
 * get warn console template
 * @param interfaceNameOrClassName
 * @param functionNameOrPropertyName
 * @returns
 */
export function getWarnConsole(interfaceNameOrClassName: string, functionNameOrPropertyName: string): string {
  return `console.warn('${interfaceNameOrClassName}.${functionNameOrPropertyName} interface mocked in the Previewer. How this interface works on the Previewer may be different from that on a real device.');\n`;
}

/**
 * generate return statement;
 * @param returnType
 * @param sourceFile
 * @returns
 */
export function getReturnStatement(returnType: ReturnTypeEntity, sourceFile: SourceFile): string {
  if (returnType.returnKind === SyntaxKind.TypeReference) {
    if (returnType.returnKindName.startsWith('Promise')) {
      return `return new Promise((resolve, reject) => {
        resolve('[PC Preview] unkonwn type');
      })`;
    } else if (returnType.returnKindName === 'T') {
      return `return '[PC Preview] unkonwn type'`;
    } else if (returnType.returnKindName === 'String') {
      return `return ${returnType.returnKindName}(...args)`;
    } else if (returnType.returnKindName === 'ArrayBuffer') {
      return `return new ${returnType.returnKindName}(0)`;
    } else if (returnType.returnKindName.startsWith('Array')) {
      if (returnType.returnKindName.includes('<') && returnType.returnKindName.includes('>')) {
        return `return [${generateGenericTypeToMockValue(returnType.returnKindName)}]`;
      } else {
        return `return new ${returnType.returnKindName}()`;
      }
    } else if (returnType.returnKindName.startsWith('Readonly')) {
      return `return ${returnType.returnKindName.split('<')[1].split('>')[0]}`;
    } else if (checkIsGenericSymbol(returnType.returnKindName)) {
      return `return '[PC Preview] unkonwn iterableiterator_${returnType.returnKindName}'`;
    } else if (returnType.returnKindName.startsWith('Uint8Array')) {
      return `return new ${returnType.returnKindName}()`;
    } else if (returnType.returnKindName.startsWith('IterableIterator')) {
      if (returnType.returnKindName.includes(',')) {
        return `let index = 0;
        const IteratorEntriesMock = {
          *[Symbol.iterator]() {
            yield ['[PC Preview] unkonwn paramIterMock_K', '[PC Preview] unkonwn paramIterMock_V'];
          },
          next: () => {
            if (index < 1) {
              const returnValue = ['[PC Previwe] unkonwn paramIterMock_K', '[PC Previwe] unkonwn paramIterMock_V'];
              index++;
              return {
                value: returnValue,
                done: false
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return IteratorEntriesMock;`;
      } else {
        return `let index = 0;
        const IteratorStringMock = {
          *[Symbol.iterator]() {
            yield '[PC Preview] unkonwn string';
          },
          next: () => {
            if (index < 1) {
              const returnValue = '[PC Previwe] unkonwn string';
              index++;
              return {
                value: returnValue,
                done: false
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return IteratorStringMock;`;
      }
    } else if (returnType.returnKindName.includes('<T>')) {
      const tmpReturn = returnType.returnKindName.split('<')[0];
      if (tmpReturn.startsWith('Array')) {
        return `return []`;
      } else {
        `return new ${tmpReturn}()`;
      }
    } else if (returnType.returnKindName.includes('<')) {
      return `return new ${returnType.returnKindName.split('<')[0]}()`;
    } else {
      if (getClassNameSet().has(returnType.returnKindName)) {
        if (returnType.returnKindName === 'Want') {
          return `return mockWant().Want`;
        } else {
          return `return new ${returnType.returnKindName}()`;
        }
      } else if (propertyTypeWhiteList(returnType.returnKindName) === returnType.returnKindName) {
        return `return ${getTheRealReferenceFromImport(sourceFile, returnType.returnKindName)}`;
      } else {
        return `return ${propertyTypeWhiteList(returnType.returnKindName)}`;
      }
    }
  } else if (returnType.returnKind === SyntaxKind.UnionType) {
    const returnNames = returnType.returnKindName.split('|');
    let returnName = returnNames[0];
    for (let i = 0; i < returnNames.length; i++) {
      if (!returnNames[i].includes('[]') && !returnNames[i].includes('<')) {
        returnName = returnNames[i];
        break;
      }
    }
    if (returnName.trimStart().trimEnd() === 'void') {
      return ``;
    }
    if (getClassNameSet().has(returnName)) {
      return `return new ${returnName}()`;
    } else {
      return `return ${getBaseReturnValue(returnName.trimStart().trimEnd())}`;
    }
  } else {
    return `return '[PC Preview] unkonwn type'`;
  }
  return `return '[PC Preview] unkonwn type'`;
}

/**
 * special property whitelist
 * @param propertyTypeName
 * @returns
 */
export function propertyTypeWhiteList(propertyTypeName: string): any {
  const whiteList = ['GLboolean', 'GLuint', 'GLenum', 'GLint', 'NotificationFlags'];
  if (whiteList.includes(propertyTypeName)) {
    if (propertyTypeName === 'NotificationFlags' || propertyTypeName === 'GLenum') {
      return `'[PC Preview] unkonwn ${propertyTypeName}'`;
    } else if (propertyTypeName === 'GLboolean') {
      return true;
    } else {
      return 0;
    }
  } else {
    return propertyTypeName;
  }
}

/**
 * get basic return value
 * @param value
 * @returns
 */
export function getBaseReturnValue(value: string): string | number | boolean {
  if (value === 'string') {
    return `''`;
  } else if (value === 'number') {
    return 0;
  } else if (value === 'boolean') {
    return true;
  } else if (value === 'Object' || value === 'object') {
    return `{}`;
  } else if (checkIsGenericSymbol(value)) {
    return `'[PC Preview] unkonwn type'`;
  } else if (value === 'WebGLActiveInfo') {
    return `{size: '[PC Preview] unkonwn GLint', type: 0, name: '[PC Preview] unkonwn name'}`;
  } else {
    return value;
  }
}

/**
 * get current sourceFile import data
 * @param sourceFile
 * @param typeName
 * @returns
 */
export function getTheRealReferenceFromImport(sourceFile: SourceFile, typeName: string): string {
  const importArray = getImportDeclarationArray(sourceFile);
  let returnName = '';
  let isFromImport = false;
  let isOhos = false;
  let mockMockName = '';
  importArray.forEach(value => {
    if (typeName.includes('.') && typeName.split('.')[0] === value.importElements) {
      isFromImport = true;
      if (value.importPath.includes('@ohos')) {
        isOhos = true;
      }
      if (value.importElements.trimStart().trimEnd() === typeName.split('.')[0]) {
        const tmpArr = value.importPath.split('.');
        mockMockName = tmpArr[tmpArr.length - 1].replace(/'/g, '').replace(/"/g, '');
      }
    }
  });
  if (isFromImport) {
    const splitReturnKindName = typeName.split('.');
    let left = '';
    for (let i = 1; i < splitReturnKindName.length; i++) {
      left += `.${splitReturnKindName[i]}`;
    }
    if (isOhos) {
      returnName = `mock${firstCharacterToUppercase(mockMockName)}()${left}`;
    }
  } else {
    returnName = getImportTypeAliasNameFromImportElements(importArray, typeName);
  }
  return returnName;
}

/**
 * get return type alias, for example: {Context as _Context} return _Context
 * @param importElementEntity
 * @param typeName
 * @returns
 */
 function getImportTypeAliasNameFromImportElements(importElementEntity: ImportElementEntity[], typeName: string): string {
  for (let i = 0; i < importElementEntity.length; i++) {
    if (importElementEntity[i].importElements.includes('_')) {
      const importElements = importElementEntity[i].importElements.replace('{', '').replace('}', '').split(',');
      for (let j = 0; j < importElements.length; j++) {
        const element = importElements[j].trimStart().trimEnd();
        if (`_${typeName}` === element.split('as')[1].trimStart().trimEnd()) {
          return `_${typeName}`;
        }
      }
    }
  }
  if (typeName === 'Want') {
    typeName = `mockWant().Want`;
  } else if (typeName === 'InputMethodExtensionContext') {
    typeName = `mockInputmethodextensioncontext().InputMethodExtensionContext`;
  }
  return typeName;
}

/**
 * check is generic symbol
 * @param type
 * @returns
 */
export function checkIsGenericSymbol(type: string): boolean {
  const words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  return words.includes(type);
}

/**
 * generate basic type default value
 * @param kindName
 * @returns
 */
export function generateGenericTypeToMockValue(kindName: string): any {
  const genericTypeName = kindName.split('<')[1].split('>')[0];
  if (genericTypeName === 'string') {
    return `''`;
  } else if (genericTypeName === 'number') {
    return 0;
  } else if (genericTypeName === 'boolean') {
    return true;
  } else if (genericTypeName === 'Object' || genericTypeName === 'object') {
    return '{}';
  } else {
    return ``;
  }
}

/**
 * get callback statement
 * @returns
 */
export function getCallbackStatement(): string {
  return `const len = args.length;
  if (typeof args[len - 1] === 'function') {
    args[len - 1].call(this, null, '[PC Preview] unkonwn type')
  }`;
}

/**
 * get iterator template string
 * @param methodEntity
 * @returns
 */
export function generateSymbolIterator(methodEntity: MethodEntity): string {
  let iteratorMethod = '';
  if (methodEntity.returnType.returnKindName.includes('<[')) {
    iteratorMethod += `let index = 0;
    const IteratorMock = {
      next: () => {
        if (index < 1) {
          const returnValue = ['[PC Previwe] unkonwn iterableiterator_k', '[PC Previwe] unkonwn iterableiterator_v'];
          index++;
          return {
            value: returnValue,
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
    return IteratorMock;`;
  } else {
    iteratorMethod += `let index = 0;
    const IteratorMock = {
      next: () => {
        if (index < 1) {
          index++;
          return {
            value: '[PC Preview] unkonwn any',
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
    return IteratorMock;`;
  }

  return iteratorMethod;
}
