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

import { SyntaxKind } from 'typescript';
import { EnumEntity } from '../declaration-node/enumDeclaration';

/**
 * generate enum
 * @param rootName
 * @param enumDeclaration
 * @returns
 */
export function generateEnumDeclaration(rootName: string, enumDeclaration: EnumEntity): string {
  let enumBody = '';
  if (enumDeclaration.exportModifiers.length !== 0) {
    enumBody += `export const ${enumDeclaration.enumName} = {\n`;
  } else {
    enumBody += `const ${enumDeclaration.enumName} = {\n`;
  }

  let defaultValue = 0;
  enumDeclaration.enumMembers.forEach(member => {
    if (member.enumKind === SyntaxKind.TypeReference) {
      enumBody += `${member.enumValueName}: new ${member.enumValue},\n`;
    } else if (member.enumKind === SyntaxKind.NumericLiteral) {
      enumBody += `${member.enumValueName}: ${member.enumValue.replace(/"/g, '')},\n`;
    } else if (member.enumKind === SyntaxKind.StringLiteral) {
      enumBody += `${member.enumValueName}: ${member.enumValue},\n`;
    } else {
      if (member.enumValue === '' || member.enumValue === null || member.enumValue === undefined) {
        enumBody += `${member.enumValueName}: ${defaultValue},\n`;
        defaultValue++;
      } else {
        enumBody += `${member.enumValueName}: ${member.enumValue},\n`;
      }
    }
  });
  enumBody += '}\n';
  return enumBody;
}
