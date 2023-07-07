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

import { isIdentifier, SourceFile, VariableStatement } from 'typescript';

/**
 * get const declaration variable
 * @param variableStatement
 * @param sourceFile
 * @returns
 */
export function getVariableStatementDeclaration(variableStatement: VariableStatement, sourceFile: SourceFile): Array<StatementEntity> {
  const statementsArray: Array<StatementEntity> = [];
  variableStatement.declarationList.declarations.forEach(value => {
    let statementName = '';
    let initializer = '';
    let typeName = '';
    let typeKind = -1;

    if (isIdentifier(value.name)) {
      statementName = value.name.escapedText.toString();
    } else {
      statementName = sourceFile.text.substring(value.pos, value.end).trimStart().trimEnd();
    }
    if (value.initializer !== undefined) {
      initializer = sourceFile.text.substring(value.initializer.pos, value.initializer.end);
    }
    if (value.type !== undefined) {
      typeName = sourceFile.text.substring(value.type.pos, value.type.end);
      typeKind = value.type.kind;
    }
    statementsArray.push({ statementName: statementName, typeName: typeName, typeKind: typeKind, initializer: initializer });
  });
  return statementsArray;
}

export interface StatementEntity {
  statementName: string,
  typeName: string,
  typeKind: number,
  initializer: string
}
