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

import { ExportAssignment, ExportDeclaration, ImportDeclaration,
   ImportEqualsDeclaration, isImportDeclaration, Node, SourceFile } from 'typescript';

/**
 * get current sourceFile all imports
 * @param sourceFile
 * @returns
 */
export function getImportDeclarationArray(sourceFile: SourceFile): Array<ImportElementEntity> {
  const importDeclarations: Array<ImportElementEntity> = [];
  sourceFile.forEachChild(node => {
    if (isImportDeclaration(node)) {
      importDeclarations.push(getImportDeclaration(node, sourceFile));
    }
  });
  return importDeclarations;
}

/**
 * get module inner import info
 * @param importEqualNode
 * @param sourceFile
 * @returns
 */
export function getModuleImportEqual(importEqualNode: ImportEqualsDeclaration, sourceFile: SourceFile): ImportEuqalEntity {
  return {
    importEqualName: importEqualNode.name.escapedText.toString(),
    importEqualTypeName: sourceFile.text.substring(importEqualNode.moduleReference.pos, importEqualNode.moduleReference.end).trimStart().trimEnd(),
    importEqualTypeKind: importEqualNode.moduleReference.kind
  };
}

/**
 * get export info
 * @param exportNode
 * @param sourceFile
 * @returns
 */
export function getExportDeclaration(exportNode: ExportDeclaration, sourceFile: SourceFile): string {
  return sourceFile.text.substring(exportNode.pos, exportNode.end).trimStart().trimEnd();
}

/**
 * get import info
 * @param node
 * @param sourceFile
 * @returns
 */
export function getImportDeclaration(node: Node, sourceFile: SourceFile): ImportElementEntity {
  let importElements = '';
  const importNode = node as ImportDeclaration;
  const importPath = sourceFile.text.substring(importNode.moduleSpecifier.pos, importNode.moduleSpecifier.end).trimStart().trimEnd();
  const importClause = importNode.importClause;
  if (importClause !== undefined) {
    importElements = sourceFile.text.substring(importClause.pos, importClause.end).trimStart().trimEnd();
    if (importElements.startsWith('type ')) {
      importElements = importElements.replace('type ', '');
    }
  }

  return {
    importPath: importPath,
    importElements: importElements
  };
}

/**
 * get export info
 * @param exportAssigment
 * @param sourceFile
 * @returns
 */
export function getExportAssignment(exportAssigment: ExportAssignment, sourceFile: SourceFile): Array<string> {
  const exportAssignments: Array<string> = [];
  if (exportAssigment.expression !== undefined) {
    exportAssignments.push(sourceFile.text.substring(exportAssigment.expression.pos, exportAssigment.expression.end).trimStart().trimEnd());
  }
  return exportAssignments;
}

export interface ImportElementEntity {
  importPath: string,
  importElements: string
}

export interface ExportElementEntity {
  exportName: string
}

export interface ImportEuqalEntity {
  importEqualName: string,
  importEqualTypeName: string,
  importEqualTypeKind: number
}
