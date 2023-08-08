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

import { HeritageClause, Node, SourceFile, SyntaxKind } from 'typescript';

/**
 * get heritage info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getHeritageClauseDeclaration(node: Node, sourceFile: SourceFile): HeritageClauseEntity {
  const HeritageClauseNode = node as HeritageClause;
  const clauseToken = HeritageClauseNode.token === SyntaxKind.ExtendsKeyword ? 'extends' : 'implements';
  const types: Array<string> = [];

  HeritageClauseNode.types.forEach(value => {
    types.push(sourceFile.text.substring(value.pos, value.end).trimStart().trimEnd());
  });

  return {
    clauseToken: clauseToken,
    types: types
  };
}

export interface HeritageClauseEntity {
  clauseToken: string,
  types: Array<string>
}
