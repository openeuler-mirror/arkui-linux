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
import { MethodSignatureEntity } from '../declaration-node/methodSignatureDeclaration';
import { getCallbackStatement, getReturnStatement, getWarnConsole } from './generateCommonUtil';

/**
 * generate interface signature method
 * @param rootName
 * @param methodSignatureArray
 * @param sourceFile
 * @returns
 */
export function generateCommonMethodSignature(rootName: string, methodSignatureArray: Array<MethodSignatureEntity>, sourceFile: SourceFile): string {
  let methodSignatureBody = '';
  const methodEntity = methodSignatureArray[0];
  methodSignatureBody += `${methodEntity.functionName}: function(...args) {`;
  methodSignatureBody += getWarnConsole(rootName, methodEntity.functionName);
  if (methodSignatureArray.length === 1) {
    const args = methodEntity.args;
    const len = args.length;
    if (args.length > 0 && args[len - 1].paramName.toLowerCase().includes('callback')) {
      methodSignatureBody += getCallbackStatement();
    }
    if (methodEntity.returnType.returnKind !== SyntaxKind.VoidKeyword) {
      if (rootName === 'Context' && methodEntity.returnType.returnKindName === 'Context') {
        methodSignatureBody += 'return Context;';
      } else {
        methodSignatureBody += getReturnStatement(methodEntity.returnType, sourceFile);
      }
    }
  } else {
    const argSet: Set<string> = new Set<string>();
    const returnSet: Set<string> = new Set<string>();
    let isCallBack = false;
    methodSignatureArray.forEach(value => {
      returnSet.add(value.returnType.returnKindName);
      value.args.forEach(arg => {
        argSet.add(arg.paramName);
        if (arg.paramName.toLowerCase().includes('callback')) {
          isCallBack = true;
        }
      });
    });
    if (isCallBack) {
      methodSignatureBody += getCallbackStatement();
    }
    let isReturnPromise = false;
    returnSet.forEach(value => {
      if (value.startsWith('Promise')) {
        isReturnPromise = true;
      }
    });
    if (isReturnPromise && isCallBack) {
      methodSignatureBody += `else {
        return new Promise((resolve, reject) => {
          resolve('[PC Preview] unknow boolean');
        })
      }`;
    }
  }
  methodSignatureBody += '},\n';
  return methodSignatureBody;
}
