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
import { getClassNameSet } from '../common/commonUtils';
import { PropertyEntity } from '../declaration-node/propertyDeclaration';
import { getTheRealReferenceFromImport } from './generateCommonUtil';

/**
 * generate class property
 * @param rootName
 * @param propertyDeclaration
 * @param sourceFile
 * @returns
 */
export function generatePropertyDeclaration(rootName: string, propertyDeclaration: PropertyEntity, sourceFile: SourceFile): string {
  let propertyBody = '';
  if (propertyDeclaration.isInitializer) {
    propertyBody = `this.${propertyDeclaration.propertyName} = ${propertyDeclaration.initializer};`;
  } else {
    if (propertyDeclaration.propertyTypeName.startsWith('{')) {
      propertyBody = `this.${propertyDeclaration.propertyName} = {};`;
    } else if (propertyDeclaration.kind === SyntaxKind.LiteralType) {
      propertyBody = `this.${propertyDeclaration.propertyName} = ${propertyDeclaration.propertyTypeName};`;
    } else if (propertyDeclaration.kind === SyntaxKind.NumberKeyword) {
      propertyBody = `this.${propertyDeclaration.propertyName} = 0;`;
    } else if (propertyDeclaration.kind === SyntaxKind.StringKeyword) {
      propertyBody = `this.${propertyDeclaration.propertyName} = ''`;
    } else if (propertyDeclaration.kind === SyntaxKind.BooleanKeyword) {
      propertyBody = `this.${propertyDeclaration.propertyName} = true`;
    } else if (propertyDeclaration.propertyTypeName.startsWith('Array')) {
      propertyBody = `this.${propertyDeclaration.propertyName} = [];`;
    } else if (propertyDeclaration.propertyTypeName.startsWith('Map')) {
      propertyBody = `this.${propertyDeclaration.propertyName} = {key: {}};`;
    } else if (propertyDeclaration.kind === SyntaxKind.TypeReference) {
      propertyBody = `this.${propertyDeclaration.propertyName} = `;
      if (getClassNameSet().has(propertyDeclaration.propertyTypeName)) {
        if (propertyDeclaration.propertyTypeName !== 'Want' && propertyDeclaration.propertyTypeName !== 'InputMethodExtensionContext') {
          propertyBody += `new ${getTheRealReferenceFromImport(sourceFile, propertyDeclaration.propertyTypeName)}();`;
        } else {
          propertyBody += `${getTheRealReferenceFromImport(sourceFile, propertyDeclaration.propertyTypeName)};`;
        }
      } else {
        propertyBody += `${getTheRealReferenceFromImport(sourceFile, propertyDeclaration.propertyTypeName)};`;
      }
    } else if (propertyDeclaration.kind === SyntaxKind.NumericLiteral || propertyDeclaration.kind === SyntaxKind.StringLiteral) {
      propertyBody = `this.${propertyDeclaration.propertyName} = ${propertyDeclaration.propertyTypeName};`;
    } else {
      propertyBody = `this.${propertyDeclaration.propertyName} = '[PC Previwe] unkonwn ${propertyDeclaration.propertyName}';`;
    }
  }
  return propertyBody;
}
