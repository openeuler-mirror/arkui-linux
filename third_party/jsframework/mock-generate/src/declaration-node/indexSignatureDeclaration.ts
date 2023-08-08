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

import { IndexSignatureDeclaration, SourceFile } from 'typescript';

/**
 * get index signature info
 * @param indexSignature
 * @param sourceFile
 * @returns
 */
export function getIndexSignatureDeclaration(indexSignature: IndexSignatureDeclaration, sourceFile: SourceFile): IndexSignatureEntity {
  return {
    indexSignatureKey: 'key',
    indexSignatureKind: indexSignature.type.kind,
    indexSignatureTypeName: sourceFile.text.substring(indexSignature.type.pos, indexSignature.type.end).trimStart().trimEnd()
  };
}

export interface IndexSignatureEntity {
  indexSignatureKey: string,
  indexSignatureKind: number,
  indexSignatureTypeName: string
}
