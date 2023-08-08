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
import { IndexSignatureEntity } from '../declaration-node/indexSignatureDeclaration';

/**
 * generate index signature
 * @param signatureEntity
 * @returns
 */
export function generateIndexSignature(signatureEntity: IndexSignatureEntity): string {
  const signatureKey = signatureEntity.indexSignatureKey;
  let signatureTypeName = '';
  if (signatureEntity.indexSignatureKind === SyntaxKind.TypeReference) {
    signatureTypeName = signatureEntity.indexSignatureTypeName;
  } else {
    signatureTypeName = `'[PC Preview] unkonwn type',\n`;
  }
  return `${signatureKey}: ${signatureTypeName}`;
}
