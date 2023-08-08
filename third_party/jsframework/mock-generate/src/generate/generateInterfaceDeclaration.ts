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

import { SourceFile } from 'typescript';
import { InterfaceEntity } from '../declaration-node/interfaceDeclaration';
import { generateCommonMethodSignature } from './generateCommonMethodSignature';
import { generateIndexSignature } from './generateIndexSignature';
import { generatePropertySignatureDeclaration } from './generatePropertySignatureDeclaration';

/**
 * generate interface
 * @param rootName
 * @param interfaceEntity
 * @param sourceFile
 * @param isSourceFile
 * @returns
 */
export function generateInterfaceDeclaration(rootName: string, interfaceEntity: InterfaceEntity, sourceFile: SourceFile, isSourceFile: boolean,
  currentSourceInterfaceArray: InterfaceEntity[]): string {
  const interfaceName = interfaceEntity.interfaceName;
  let interfaceBody = '';
  const interfaceElementSet = new Set<string>();
  if (interfaceEntity.exportModifiers.length > 0 || isSourceFile) {
    interfaceBody += `export const ${interfaceName} = { \n`;
  } else {
    interfaceBody += `const ${interfaceName} = { \n`;
  }

  if (interfaceEntity.interfacePropertySignatures.length > 0) {
    interfaceEntity.interfacePropertySignatures.forEach(value => {
      interfaceBody += generatePropertySignatureDeclaration(interfaceName, value, sourceFile) + '\n';
      interfaceElementSet.add(value.propertyName);
    });
  }

  if (interfaceEntity.interfaceMethodSignature.size > 0) {
    interfaceEntity.interfaceMethodSignature.forEach(value => {
      interfaceBody += generateCommonMethodSignature(interfaceName, value, sourceFile) + '\n';
      interfaceElementSet.add(value[0].functionName);
    });
  }

  if (interfaceEntity.indexSignature.length > 0) {
    interfaceEntity.indexSignature.forEach(value => {
      interfaceBody += generateIndexSignature(value) + '\n';
      interfaceElementSet.add(value.indexSignatureKey);
    });
  }

  if (interfaceEntity.heritageClauses.length > 0) {
    interfaceEntity.heritageClauses.forEach(value => {
      currentSourceInterfaceArray.forEach(currentInterface => {
        if (value.types.includes(currentInterface.interfaceName)) {
          interfaceBody += generateHeritageInterface(currentInterface, sourceFile, interfaceElementSet);
        }
      });
    });
  }

  interfaceBody += '}';
  return interfaceBody;
}

function generateHeritageInterface(interfaceEntity: InterfaceEntity, sourceFile: SourceFile, elements: Set<string>): string {
  const interfaceName = interfaceEntity.interfaceName;
  let interfaceBody = '';
  if (interfaceEntity.interfacePropertySignatures.length > 0) {
    interfaceEntity.interfacePropertySignatures.forEach(value => {
      if (!elements.has(value.propertyName)) {
        interfaceBody += generatePropertySignatureDeclaration(interfaceName, value, sourceFile) + '\n';
      }
    });
  }

  if (interfaceEntity.interfaceMethodSignature.size > 0) {
    interfaceEntity.interfaceMethodSignature.forEach(value => {
      if (!elements.has(value[0].functionName)) {
        interfaceBody += generateCommonMethodSignature(interfaceName, value, sourceFile) + '\n';
      }
    });
  }

  if (interfaceEntity.indexSignature.length > 0) {
    interfaceEntity.indexSignature.forEach(value => {
      if (elements.has(value.indexSignatureKey)) {
        interfaceBody += generateIndexSignature(value) + '\n';
      }
    });
  }
  return interfaceBody;
}
