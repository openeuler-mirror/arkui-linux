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

import { Node, SourceFile, TypeParameterDeclaration } from 'typescript';

/**
 * get generic type node info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getTypeParameterDeclaration(node: Node, sourceFile: SourceFile): TypeParameterEntity {
  const typeParameterNode = node as TypeParameterDeclaration;
  const typeParameterName = typeParameterNode.name.escapedText.toString();
  let constraitValue = '';
  let constraintDefaultValue = '';
  const constraint = typeParameterNode.constraint;
  if (constraint !== undefined) {
    constraitValue = sourceFile.text.substring(constraint.pos, constraint.end).trimStart().trimEnd();
  }

  const defaultValue = typeParameterNode.default;
  if (defaultValue !== undefined) {
    constraintDefaultValue = sourceFile.text.substring(defaultValue.pos, defaultValue.end).trimStart().trimEnd();
  }

  return {
    typeParameterName: typeParameterName,
    constraitValue: constraitValue,
    constraintDefaultValue: constraintDefaultValue
  };
}

export interface TypeParameterEntity {
  typeParameterName: string,
  constraitValue: string,
  constraintDefaultValue: string
}
