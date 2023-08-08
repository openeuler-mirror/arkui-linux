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
import { MethodEntity } from '../declaration-node/methodDeclaration';
import {
  generateSymbolIterator, getCallbackStatement,
  getReturnStatement, getWarnConsole
} from './generateCommonUtil';

/**
 * generate class method
 * @param rootName
 * @param methodArray
 * @param sourceFile
 * @returns
 */
export function generateCommonMethod(rootName: string, methodArray: Array<MethodEntity>, sourceFile: SourceFile): string {
  let methodBody = '';
  const methodEntity = methodArray[0];
  if (methodEntity.functionName.name === 'Symbol.iterator') {
    methodBody += `this[${methodEntity.functionName.name}] = function(...args) {`;
    methodBody += getWarnConsole(rootName, methodEntity.functionName.name);
    methodBody += generateSymbolIterator(methodEntity);
    methodBody += '};\n';
    return methodBody;
  } else {
    methodBody += `this.${methodEntity.functionName.name} = function(...args) {`;
    methodBody += getWarnConsole(rootName, methodEntity.functionName.name);
  }

  if (methodArray.length === 1) {
    const args = methodEntity.args;
    const len = args.length;
    if (args.length > 0 && args[len - 1].paramName.toLowerCase().includes('callback')) {
      methodBody += getCallbackStatement();
    }
    if (methodEntity.returnType.returnKind !== SyntaxKind.VoidKeyword) {
      if (methodEntity.functionName.name === 'getApplicationContext') {
        methodBody += 'return new Context();';
      } else {
        methodBody += getReturnStatement(methodEntity.returnType, sourceFile);
      }
    }
  } else {
    const argSet: Set<string> = new Set<string>();
    const returnSet: Set<string> = new Set<string>();
    let isCallBack = false;
    methodArray.forEach(value => {
      returnSet.add(value.returnType.returnKindName);
      value.args.forEach(arg => {
        argSet.add(arg.paramName);
        if (arg.paramName.toLowerCase().includes('callback')) {
          isCallBack = true;
        }
      });
    });
    if (isCallBack) {
      methodBody += getCallbackStatement();
    }
    let isReturnPromise = false;
    returnSet.forEach(value => {
      if (value.startsWith('Promise')) {
        isReturnPromise = true;
      }
    });

    if (isReturnPromise && isCallBack) {
      methodBody += `else {
        return new Promise((resolve, reject) => {
          resolve('[PC Preview] unknow boolean');
        })
      }`;
    } else {
      methodBody += `return new Promise((resolve, reject) => {
        resolve('[PC preview] unknown type');
      });`;
    }
  }
  methodBody += '};\n';
  return methodBody;
}
