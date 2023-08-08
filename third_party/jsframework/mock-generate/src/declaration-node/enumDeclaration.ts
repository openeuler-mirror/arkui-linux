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

import { EnumDeclaration, SourceFile } from 'typescript';
import { getExportKeyword, getPropertyName } from '../common/commonUtils';

/**
 * get enum info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getEnumDeclaration(node: EnumDeclaration, sourceFile: SourceFile): EnumEntity {
  const enumName = node.name.escapedText.toString();
  const enumMembers: Array<MemberEntity> = [];
  let exportModifiers: Array<number> = [];

  if (node.modifiers !== undefined) {
    exportModifiers = getExportKeyword(node.modifiers);
  }

  node.members.forEach(value => {
    const enumValueName = getPropertyName(value.name, sourceFile);
    let enumValue = '';
    if (value.initializer !== undefined) {
      enumValue = sourceFile.text.substring(value.initializer.pos, value.initializer.end).trimEnd().trimStart();
    }
    const enumKind = value.initializer?.kind === undefined ? -1 : value.initializer?.kind;
    enumMembers.push({ enumValueName: enumValueName, enumValue: enumValue, enumKind: enumKind });
  });

  return {
    enumName: enumName,
    enumMembers: enumMembers,
    exportModifiers: exportModifiers
  };
}

export interface EnumEntity {
  enumName: string,
  enumMembers: Array<MemberEntity>,
  exportModifiers: Array<number>
}

export interface MemberEntity {
  enumValueName: string,
  enumValue: string,
  enumKind: number,
}
