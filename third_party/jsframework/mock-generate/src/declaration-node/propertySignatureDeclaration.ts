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

import { PropertySignature, SourceFile } from 'typescript';
import { getPropertyName } from '../common/commonUtils';

/**
 * get interface property signature info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getPropertySignatureDeclaration(node: PropertySignature, sourceFile: SourceFile): PropertySignatureEntity {
  let propertyName = '';
  let propertyTypeName = '';
  let kind = -1;

  propertyName = getPropertyName(node.name, sourceFile);
  const propertyType = node.type;
  const modifiers: Array<string> = [];
  if (node.modifiers !== undefined) {
    node.modifiers.forEach(value => {
      modifiers.push(sourceFile.text.substring(value.pos, value.end));
    });
  }

  if (propertyType !== undefined) {
    propertyTypeName = sourceFile.text.substring(propertyType.pos, propertyType.end).trimStart().trimEnd();
    kind = propertyType.kind;
  }

  return {
    modifiers: modifiers,
    propertyName: propertyName,
    propertyTypeName: propertyTypeName,
    kind: kind
  };
}

export interface PropertySignatureEntity {
  modifiers: Array<string>,
  propertyName: string,
  propertyTypeName: string,
  kind: number
}
