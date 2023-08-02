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

import * as ts from "typescript";
import { PandaGen } from "./pandagen";
import { DiagnosticCode, DiagnosticError } from "./diagnostic";
import { ModuleScope, Scope } from "./scope";
import { getSourceFileOfNode } from "./jshelpers";
import { LReference } from "./base/lreference";
import { Compiler } from "./compiler";
import { ModuleVariable } from "./variable";

class Entry {
    node: ts.Node;
    exportName: string | undefined;
    localName: string | undefined;
    importName: string | undefined;
    moduleRequest: number = -1;

    constructor(node: ts.Node, exportName: string | undefined, localName: string | undefined, importName: string | undefined, moduleRequest?: number) {
        this.node = node;
        this.exportName = exportName;
        this.localName = localName;
        this.importName = importName;
        if (moduleRequest !== undefined) {
            this.moduleRequest = moduleRequest;
        }
    }
}

export class SourceTextModuleRecord {
    private moduleName: string;
    private moduleRequests: Array<string> = [];
    private moduleRequestIdxMap: Map<string, number> = new Map<string, number>();

    private regularImportEntries: Map<string, Entry> = new Map<string, Entry>();
    private namespaceImportEntries: Array<Entry> = [];

    private localExportEntries: Map<string, Array<Entry>> = new Map<string, Array<Entry>>();
    private starExportEntries: Array<Entry> = [];
    private indirectExportEntries: Array<Entry> = [];

    constructor(moduleName: string) {
        this.moduleName = moduleName;
    }

    addModuleRequest(moduleRequest: string): number {
        if (this.moduleRequestIdxMap.has(moduleRequest)) {
            return this.moduleRequestIdxMap.get(moduleRequest)!;
        }
        let index = this.moduleRequests.length;
        this.moduleRequests.push(moduleRequest);
        this.moduleRequestIdxMap.set(moduleRequest, index);
        return index;
    }

    // import x from 'test.js';
    // import {x} from 'test.js';
    // import {x as y} from 'test.js';
    // import defaultExport from 'test.js'
    addImportEntry(node: ts.Node, importName: string, localName: string, moduleRequest: string) {
        let importEntry: Entry = new Entry(node, undefined, localName, importName, this.addModuleRequest(moduleRequest));
        // We don't care if there's already an entry for this local name, as in that
        // case we will report an error when declaring the variable.
        this.regularImportEntries.set(localName, importEntry);
    }

    // import 'test.js'
    // import {} from 'test.js'
    // export {} from 'test.js'
    addEmptyImportEntry(moduleRequest: string) {
        this.addModuleRequest(moduleRequest);
    }

    // import * as x from 'test.js';
    addStarImportEntry(node: ts.Node, localName: string, moduleRequest: string) {
        let starImportEntry: Entry = new Entry(node, undefined, localName, undefined, this.addModuleRequest(moduleRequest));
        this.namespaceImportEntries.push(starImportEntry);
    }

    // export {x};
    // export {x as y};
    // export VariableStatement
    // export Declaration
    // export default ...
    addLocalExportEntry(node: ts.Node, exportName: string, localName: string) {
        let localExportEntry: Entry = new Entry(node, exportName, localName, undefined);
        if (this.localExportEntries.has(localName)) {
            this.localExportEntries.get(localName)!.push(localExportEntry);
        } else {
            this.localExportEntries.set(localName, [localExportEntry]);
        }
    }

    // export {x} from 'test.js';
    // export {x as y} from 'test.js';
    // import { x } from 'test.js'; export { x }
    addIndirectExportEntry(node: ts.Node, importName: string, exportName: string, moduleRequest: string) {
        let indirectExportEntry: Entry = new Entry(node, exportName, undefined, importName, this.addModuleRequest(moduleRequest));
        this.indirectExportEntries.push(indirectExportEntry);
    }

    // export * from 'test.js';
    addStarExportEntry(node: ts.Node, moduleRequest: string) {
        let starExportEntry: Entry = new Entry(node, undefined, undefined, undefined, this.addModuleRequest(moduleRequest));
        this.starExportEntries.push(starExportEntry);
    }

    getModuleName() {
        return this.moduleName;
    }

    getModuleRequests() {
        return this.moduleRequests;
    }

    getRegularImportEntries() {
        return this.regularImportEntries;
    }

    getNamespaceImportEntries() {
        return this.namespaceImportEntries;
    }

    getLocalExportEntries() {
        return this.localExportEntries;
    }

    getStarExportEntries() {
        return this.starExportEntries;
    }

    getIndirectExportEntries() {
        return this.indirectExportEntries;
    }

    makeIndirectExportsExplicit() {
        // @ts-ignore
        this.localExportEntries.forEach((entries: Array<Entry>, localName: string) => {
            let importEntry: Entry | undefined = this.regularImportEntries.get(localName);
            if (importEntry) {
                // get indirect export entries
                entries.forEach(e => {
                    e.importName = importEntry.importName;
                    e.moduleRequest = importEntry.moduleRequest;
                    e.localName = undefined;
                    this.indirectExportEntries.push(e);
                });
                this.localExportEntries.delete(localName);
            }
        });
    }

    nextDuplicateExportEntry(candidate: Entry, exportNameEntry: Map<string, Entry>, currentCandidate: Entry | undefined) {
        if (!exportNameEntry.has(candidate.exportName!)) {
            exportNameEntry.set(candidate.exportName!, candidate);
            return currentCandidate;
        }

        if (currentCandidate === undefined) {
            currentCandidate = candidate;
        }

        return candidate.node.pos > currentCandidate.node.pos ? candidate : currentCandidate;
    }

    searchDuplicateExport(): Entry | undefined {
        let duplicateEntry: Entry | undefined;
        let exportNameEntry: Map<string, Entry> = new Map<string, Entry>();

        // @ts-ignore
        this.localExportEntries.forEach((entries: Array<Entry>, localName: string) => {
            entries.forEach((e: Entry) => {
                duplicateEntry = this.nextDuplicateExportEntry(e, exportNameEntry, duplicateEntry);
            });
        });

        this.indirectExportEntries.forEach((e: Entry) => {
            duplicateEntry = this.nextDuplicateExportEntry(e, exportNameEntry, duplicateEntry);
        });

        return duplicateEntry;
    }

    validateModuleRecordEntries(moduleScope: ModuleScope) {
        // check module is well-formed and report errors if not
        {
            let dupExportEntry: Entry | undefined = this.searchDuplicateExport();
            if (dupExportEntry !== undefined) {
                throw new DiagnosticError(dupExportEntry.node, DiagnosticCode.Module_0_has_already_exported_a_member_named_1, getSourceFileOfNode(dupExportEntry.node), [getSourceFileOfNode(dupExportEntry.node).fileName, dupExportEntry.exportName]);
            }
        }

        this.localExportEntries.forEach((entry: Array<Entry>, localName: string) => {
            if (!moduleScope.hasDecl(localName) && localName != '*default*') {
                throw new DiagnosticError(entry[0].node, DiagnosticCode.Module_0_has_no_exported_member_1, getSourceFileOfNode(entry[0].node), [getSourceFileOfNode(entry[0].node).fileName, localName]);
            }
        });

        this.makeIndirectExportsExplicit();
    }

    setExportedDecls(moduleScope: ModuleScope) {
        // @ts-ignore
        this.localExportEntries.forEach((entry: Array<Entry>, localName: string) => {
            moduleScope.setExportDecl(localName);
        })
    }

    setModuleEnvironment(moduleScope: ModuleScope) {
        this.validateModuleRecordEntries(moduleScope);
        this.setExportedDecls(moduleScope);
    }
}

export function setModuleNamespaceImports(compiler: Compiler, moduleScope: Scope, pandagen: PandaGen) {
    if (!(moduleScope instanceof ModuleScope)) {
        return;
    }

    moduleScope.module().getNamespaceImportEntries().forEach(entry => {
        let namespace_lref = LReference.generateLReference(compiler, (<ts.NamespaceImport>entry.node).name, true);
        pandagen.getModuleNamespace(entry.node, entry.moduleRequest);
        namespace_lref.setValue();
    });
}

export function assignIndexToModuleVariable(moduleScope: Scope) {
    if (!(moduleScope instanceof ModuleScope)) {
        return;
    }
    let index: number = 0;
    // @ts-ignore
    moduleScope.module().getLocalExportEntries().forEach((entries: Array<Entry>, localName: string) => {
        (<ModuleVariable>moduleScope.findLocal(localName)!).assignIndex(index++);
    });
    index = 0;
    // @ts-ignore
    moduleScope.module().getRegularImportEntries().forEach((entry: Entry, localName: string) => {
        (<ModuleVariable>moduleScope.findLocal(localName)!).assignIndex(index++);
    });
}