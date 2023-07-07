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
import { FunctionEntity } from '../declaration-node/functionDeclaration';
import { getCallbackStatement, getReturnStatement, getWarnConsole } from './generateCommonUtil';

/**
 * generate function
 * @param rootName
 * @param functionArray
 * @param sourceFile
 * @returns
 */
export function generateCommonFunction(rootName: string, functionArray: Array<FunctionEntity>, sourceFile: SourceFile): string {
  let functionBody = '';
  const functionEntity = functionArray[0];
  functionBody = `${functionEntity.functionName}: function(...args) {`;
  functionBody += getWarnConsole(rootName, functionEntity.functionName);

  if (functionArray.length === 1) {
    const args = functionEntity.args;
    const len = args.length;
    if (args.length > 0 && args[len - 1].paramName.toLowerCase().includes('callback')) {
      functionBody += getCallbackStatement();
    }
    if (functionEntity.returnType.returnKind !== SyntaxKind.VoidKeyword) {
      if (rootName === 'featureAbility' && functionEntity.returnType.returnKindName === 'Context') {
        functionBody += 'return _Context;';
      } else if (rootName === 'inputMethod' && functionEntity.returnType.returnKindName === 'InputMethodSubtype') {
        functionBody += 'return mockInputMethodSubtype().InputMethodSubtype;'
      } else {
        functionBody += getReturnStatement(functionEntity.returnType, sourceFile);
      }
    }
  } else {
    const argSet: Set<string> = new Set<string>();
    const returnSet: Set<string> = new Set<string>();
    let isCallBack = false;
    functionArray.forEach(value => {
      returnSet.add(value.returnType.returnKindName);
      value.args.forEach(arg => {
        argSet.add(arg.paramName);
        if (arg.paramName.toLowerCase().includes('callback')) {
          isCallBack = true;
        }
      });
    });
    if (isCallBack) {
      functionBody += getCallbackStatement();
    }
    let isReturnPromise = false;
    returnSet.forEach(value => {
      if (value.startsWith('Promise')) {
        isReturnPromise = true;
      }
    });

    if (isReturnPromise && isCallBack) {
      functionBody += `else {
        return new Promise((resolve, reject) => {
          resolve('[PC Preview] unknow boolean');
        })
      }`;
    }
  }
  functionBody += '},';
  return functionBody;
}
