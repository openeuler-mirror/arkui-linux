/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

// [delete it when type system adapts for ESM]
import * as ts from "typescript";
import * as jshelpers from "./jshelpers";
import { DiagnosticCode, DiagnosticError } from "./diagnostic";

export class ModuleStmt {
    private node: ts.Node
    private moduleRequest: string;
    private namespace: string = "";
    private bingdingNameMap: Map<string, string> = new Map<string, string>();
    private bingdingNodeMap: Map<ts.Node, ts.Node> = new Map<ts.Node, ts.Node>();
    private isCopy: boolean = true;

    constructor(node: ts.Node, moduleRequest: string = "") {
        this.node = node;
        this.moduleRequest = moduleRequest;
    }

    getNode() {
        return this.node;
    }

    getModuleRequest() {
        return this.moduleRequest;
    }

    addLocalName(localName: string, importName: string) {
        if (this.bingdingNameMap.has(localName)) {
            throw new DiagnosticError(this.node, DiagnosticCode.Duplicate_identifier_0, jshelpers.getSourceFileOfNode(this.node), [localName]);
        }
        this.bingdingNameMap.set(localName, importName);
    }

    getBindingNameMap() {
        return this.bingdingNameMap;
    }

    addNodeMap(name: ts.Node, propertyName: ts.Node) {
        this.bingdingNodeMap.set(name, propertyName);
    }

    getBindingNodeMap() {
        return this.bingdingNodeMap;
    }

    setNameSpace(namespace: string) {
        this.namespace = namespace;
    }

    getNameSpace() {
        return this.namespace;
    }

    setCopyFlag(isCopy: boolean) {
        this.isCopy = isCopy;
    }

    getCopyFlag() {
        return this.isCopy;
    }
}
