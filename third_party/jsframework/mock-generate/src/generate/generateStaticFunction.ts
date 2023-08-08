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
import { StaticMethodEntity } from '../declaration-node/methodDeclaration';
import { generateSymbolIterator, getCallbackStatement, getReturnStatement, getWarnConsole } from './generateCommonUtil';

/**
 * generate static method
 * @param staticMethod
 * @param isSystem
 * @param sourceFile
 * @returns
 */
export function generateStaticFunction(staticMethod: StaticMethodEntity, isSystem: boolean, sourceFile: SourceFile): string {
  let methodBody = '';
  const rootName = staticMethod.className;
  const methodEntity = staticMethod.methodEntity;
  if (isSystem) {
    methodBody += `${methodEntity.functionName.name}: function(...args) {`;
  } else {
    methodBody += `${firstCharacterToUppercase(staticMethod.className)}.${methodEntity.functionName.name} = function(...args) {`;
  }

  methodBody += getWarnConsole(rootName, methodEntity.functionName.name);
  if (methodEntity.functionName.name === 'Symbol.iterator') {
    methodBody += generateSymbolIterator(methodEntity);
    methodBody += '}';
    return methodBody;
  }

  const args = methodEntity.args;
  const len = args.length;
  if (args.length > 0 && args[len - 1].paramName === 'callback') {
    methodBody += getCallbackStatement();
  }

  if (methodEntity.returnType.returnKind !== SyntaxKind.VoidKeyword) {
    methodBody += getReturnStatement(methodEntity.returnType, sourceFile);
  }
  methodBody += '}';

  if (isSystem) {
    methodBody += ',';
  } else {
    methodBody += ';';
  }
  return methodBody;
}
