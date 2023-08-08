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
  ClassDeclaration, isConstructorDeclaration,
  isMethodDeclaration, isPropertyDeclaration,
  isTypeParameterDeclaration, SourceFile, SyntaxKind
} from 'typescript';
import { getExportKeyword } from '../common/commonUtils';
import { ConstructorEntity, getConstructorDeclaration } from './constructorDeclaration';
import { getHeritageClauseDeclaration, HeritageClauseEntity } from './heritageClauseDeclaration';
import { getMethodDeclaration, MethodEntity, StaticMethodEntity } from './methodDeclaration';
import { getPropertyDeclaration, PropertyEntity } from './propertyDeclaration';
import { getTypeParameterDeclaration, TypeParameterEntity } from './typeParameterDeclaration';

/**
 * get class info
 * @param classNode
 * @param sourceFile
 * @returns
 */
export function getClassDeclaration(classNode: ClassDeclaration, sourceFile: SourceFile): ClassEntity {
  let exportModifiers: Array<number> = [];
  if (classNode.modifiers !== undefined) {
    exportModifiers = getExportKeyword(classNode.modifiers);
  }

  const className = classNode.name === undefined ? '' : classNode.name.escapedText.toString();
  const heritageClauses: Array<HeritageClauseEntity> = [];
  const classConstructor: Array<Array<ConstructorEntity>> = [];
  const classMethod: Map<string, Array<MethodEntity>> = new Map<string, Array<MethodEntity>>();
  const classProperty: Array<PropertyEntity> = [];
  const typeParameters: Array<TypeParameterEntity> = [];
  const staticMethods: Array<StaticMethodEntity> = [];

  if (classNode.heritageClauses !== undefined) {
    classNode.heritageClauses.forEach(value => {
      heritageClauses.push(getHeritageClauseDeclaration(value, sourceFile));
    });
  }

  classNode.members.forEach(value => {
    if (isMethodDeclaration(value)) {
      const methodEntity = getMethodDeclaration(value, sourceFile);
      if (methodEntity.modifiers.includes(SyntaxKind.StaticKeyword)) {
        staticMethods.push({ className: className, methodEntity: methodEntity });
      } else {
        if (classMethod.get(methodEntity.functionName.name) !== undefined) {
          classMethod.get(methodEntity.functionName.name)?.push(methodEntity);
        } else {
          const methodArray: Array<MethodEntity> = [];
          methodArray.push(methodEntity);
          classMethod.set(methodEntity.functionName.name, methodArray);
        }
      }
    } else if (isPropertyDeclaration(value)) {
      classProperty.push(getPropertyDeclaration(value, sourceFile));
    } else if (isConstructorDeclaration(value)) {
      classConstructor.push(getConstructorDeclaration(value, sourceFile));
    } else if (isTypeParameterDeclaration(value)) {
      typeParameters.push(getTypeParameterDeclaration(value, sourceFile));
    } else {
      console.log('--------------------------- uncaught class type start -----------------------');
      console.log('className: ' + className);
      console.log(value);
      console.log('--------------------------- uncaught class type end -----------------------');
    }
  });

  return {
    className: className,
    typeParameters: typeParameters,
    heritageClauses: heritageClauses,
    classConstructor: classConstructor,
    classMethod: classMethod,
    classProperty: classProperty,
    exportModifiers: exportModifiers,
    staticMethods: staticMethods
  };
}

export interface ClassEntity {
  className: string,
  typeParameters: Array<TypeParameterEntity>,
  heritageClauses: Array<HeritageClauseEntity>,
  classConstructor: Array<Array<ConstructorEntity>>,
  classMethod: Map<string, Array<MethodEntity>>,
  classProperty: Array<PropertyEntity>,
  exportModifiers: Array<number>,
  staticMethods: Array<StaticMethodEntity>
}
