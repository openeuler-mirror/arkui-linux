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

import { ConstructorDeclaration, isIdentifier, Node, SourceFile } from 'typescript';

/**
 * get constructors info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getConstructorDeclaration(node: Node, sourceFile: SourceFile): Array<ConstructorEntity> {
  const constructorNode = node as ConstructorDeclaration;
  const constructors: Array<ConstructorEntity> = [];
  constructorNode.parameters.forEach(value => {
    const paramElement = value.name;
    let name = '';
    let typeName = '';
    let typeKind = -1;
    if (isIdentifier(paramElement)) {
      name = paramElement.escapedText.toString();
    } else {
      name = sourceFile.text.substring(paramElement.pos, paramElement.end).trimStart().trimEnd();
    }

    const paramTypeElement = value.type;
    if (paramTypeElement !== undefined) {
      typeName = sourceFile.text.substring(paramTypeElement.pos, paramTypeElement.end).trimStart().trimEnd();
      typeKind = paramTypeElement.kind;
    }

    constructors.push(
      {
        name: name,
        typeName: typeName,
        typeKind: typeKind
      }
    );
  });
  return constructors;
}

export interface ConstructorEntity {
  name: string,
  typeName: string,
  typeKind: number
}
