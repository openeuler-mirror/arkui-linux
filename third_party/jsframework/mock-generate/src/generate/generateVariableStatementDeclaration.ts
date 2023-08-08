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
import { getClassNameSet } from '../common/commonUtils';
import { StatementEntity } from '../declaration-node/variableStatementResolve';

/**
 * generate const variable statement
 * @param statementEntity
 * @returns
 */
export function generateVariableStatementDelcatation(statementEntity: StatementEntity): string {
  let statementBody = `${statementEntity.statementName}: `;
  let statementValue;
  if (statementEntity.typeKind === SyntaxKind.StringKeyword) {
    statementValue = `''`;
  } else if (statementEntity.typeKind === SyntaxKind.LiteralType || statementEntity.typeKind === SyntaxKind.StringLiteral ||
    statementEntity.typeKind === SyntaxKind.NumericLiteral) {
    if (statementEntity.initializer === '') {
      if (statementEntity.typeName.endsWith('n')) {
        statementValue = statementEntity.typeName.replace('n', '');
      } else {
        statementValue = statementEntity.typeName;
      }
    } else {
      statementValue = statementEntity.initializer;
    }
  } else if (statementEntity.typeKind === SyntaxKind.NumberKeyword) {
    statementValue = 0;
  } else if (statementEntity.typeKind === SyntaxKind.UnionType) {
    statementValue = statementEntity.typeName.split('|')[0];
  } else if (statementEntity.typeKind === SyntaxKind.TypeReference) {
    if (statementEntity.typeName.includes('<')) {
      const tmpTypeName = statementEntity.typeName.split('<')[0];
      if (getClassNameSet().has(tmpTypeName)) {
        statementValue = `new ${tmpTypeName}()`;
      } else {
        statementValue = `${tmpTypeName}`;
      }
    } else {
      statementValue = statementEntity.typeName;
    }
  } else if (statementEntity.typeKind === SyntaxKind.BooleanKeyword) {
    statementValue = 'true';
  } else if (statementEntity.initializer !== '') {
    statementValue = statementEntity.initializer.endsWith('n');
  } else {
    statementValue = `'[PC Preivew] unknown ${statementEntity.statementName}'`;
  }
  statementBody += statementValue;
  statementBody += ',';
  return statementBody;
}
