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

import { FunctionDeclaration, Node, SourceFile } from 'typescript';
import { getFunctionAndMethodReturnInfo, getParameter, ParameterEntity, ReturnTypeEntity } from '../common/commonUtils';

/**
 * get function info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getFunctionDeclaration(node: Node, sourceFile: SourceFile): FunctionEntity {
  const funcNode = node as FunctionDeclaration;
  let functionName = '';
  const args: Array<ParameterEntity> = [];
  const returnType = getFunctionAndMethodReturnInfo(funcNode, sourceFile);
  functionName = funcNode.name?.escapedText === undefined ? 'undefind' : funcNode.name.escapedText.toString();
  funcNode.parameters.forEach(value => {
    args.push(getParameter(value, sourceFile));
  });

  return {
    functionName: functionName,
    returnType: returnType,
    args: args
  };
}

export interface FunctionEntity {
  functionName: string,
  returnType: ReturnTypeEntity,
  args: Array<ParameterEntity>
}
