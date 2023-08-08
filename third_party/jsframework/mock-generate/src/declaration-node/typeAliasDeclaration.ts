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

import {
  isTypeLiteralNode, isTypeReferenceNode,
  isUnionTypeNode, Node, SourceFile, TypeAliasDeclaration
} from 'typescript';

/**
 * get type alias info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getTypeAliasDeclaration(node: Node, sourceFile: SourceFile): TypeAliasEntity {
  const typeAliasNode = node as TypeAliasDeclaration;
  const typeAliasName = typeAliasNode.name.escapedText.toString();
  const typeAliasTypeKind = typeAliasNode.type.kind;
  const typeAliasTypeElements: Array<TypeAliasTypeEntity> = [];
  const modifiers: Array<number> = [];

  const modifiersNode = typeAliasNode.modifiers;
  if (modifiersNode !== undefined) {
    modifiersNode.forEach(value => {
      modifiers.push(value.kind);
    });
  }

  const typeAliasTypeElementsNode = typeAliasNode.type;
  if (typeAliasTypeElementsNode !== undefined) {
    if (isUnionTypeNode(typeAliasTypeElementsNode)) {
      typeAliasTypeElementsNode.types.forEach(value => {
        const typeName = sourceFile.text.substring(value.pos, value.end).trimStart().trimEnd();
        const typeKind = value.kind;
        typeAliasTypeElements.push({ typeName: typeName, typeKind: typeKind });
      });
    } else if (isTypeReferenceNode(typeAliasTypeElementsNode)) {
      const typeName = sourceFile.text.substring(typeAliasTypeElementsNode.typeName.pos, typeAliasTypeElementsNode.typeName.end).trimStart().trimEnd();
      typeAliasTypeElements.push({ typeName: typeName, typeKind: typeAliasTypeElementsNode.typeName.kind });
    } else if (isTypeLiteralNode(typeAliasTypeElementsNode)) {
      typeAliasTypeElementsNode.members.forEach(value => {
        const typeName = sourceFile.text.substring(value.pos, value.end).trimStart().trimEnd();
        const typeKind = value.kind;
        typeAliasTypeElements.push({ typeName: typeName, typeKind: typeKind });
      });
    } else {
      typeAliasTypeElements.push(
        {
          typeName: sourceFile.text.substring(typeAliasTypeElementsNode.pos, typeAliasTypeElementsNode.end),
          typeKind: typeAliasTypeElementsNode.kind
        }
      );
    }
  }

  return {
    typeAliasName: typeAliasName,
    typeAliasTypeKind: typeAliasTypeKind,
    typeAliasTypeElements: typeAliasTypeElements,
    modifiers: modifiers
  };
}

export interface TypeAliasEntity {
  typeAliasName: string,
  typeAliasTypeKind: number,
  typeAliasTypeElements: Array<TypeAliasTypeEntity>,
  modifiers: Array<number>
}

export interface TypeAliasTypeEntity {
  typeName: string,
  typeKind: number
}
