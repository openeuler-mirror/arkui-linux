/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
import {
    ExternalType, PrimitiveType, TypeSummary, userDefinedTypeStartIndex
} from "./base/typeSystem";
import * as jshelpers from "./jshelpers";
import { ModuleStmt } from "./modules";
import { TypeChecker } from "./typeChecker";

export class TypeRecorder {
    private static instance: TypeRecorder;
    private type2Index: Map<ts.Node, number> = new Map<ts.Node, number>();
    private variable2Type: Map<ts.Node, number> = new Map<ts.Node, number>();
    private userDefinedTypeSet: Set<number> = new Set<number>();;
    private typeSummary: TypeSummary = new TypeSummary();
    private class2InstanceMap: Map<number, number> = new Map<number, number>();
    private builtinContainer2InstanceMap: Map<object, number> = new Map<object, number>();
    private arrayTypeMap: Map<number, number> = new Map<number, number>();
    private unionTypeMap: Map<string, number> = new Map<string, number>();
    private exportedType: Map<string, number> = new Map<string, number>();
    private declaredType: Map<string, number> = new Map<string, number>();
    // namespace mapping: namepace -> filepath (import * as sth from "...")
    // In PropertyAccessExpression we'll need this to map the symbol to filepath
    private namespaceMap: Map<string, string> = new Map<string, string>();
    // (export * from "..."), if the symbol isn't in the reExportedType map, search here.
    private anonymousReExport: Array<string> = new Array<string>();

    private constructor() { }

    public static getInstance(): TypeRecorder {
        return TypeRecorder.instance;
    }

    public static createInstance(): TypeRecorder {
        TypeRecorder.instance = new TypeRecorder();
        return TypeRecorder.instance;
    }

    public setTypeSummary() {
        this.typeSummary.setInfo(this.countUserDefinedTypeSet(), this.anonymousReExport);
    }

    public getTypeSummaryIndex() {
        return this.typeSummary.getPreservedIndex();
    }

    public addUserDefinedTypeSet(index: number) {
        if (index > userDefinedTypeStartIndex) {
            this.userDefinedTypeSet.add(index);
        }
    }

    public countUserDefinedTypeSet(): number {
        return this.userDefinedTypeSet.size;
    }

    public addType2Index(typeNode: ts.Node, index: number) {
        this.type2Index.set(typeNode, index);
        this.addUserDefinedTypeSet(index);
    }

    public setVariable2Type(variableNode: ts.Node, index: number) {
        this.variable2Type.set(variableNode, index);
        this.addUserDefinedTypeSet(index);
    }

    public hasType(typeNode: ts.Node): boolean {
        return this.type2Index.has(typeNode);
    }

    public tryGetTypeIndex(typeNode: ts.Node): number {
        if (this.type2Index.has(typeNode)) {
            return this.type2Index.get(typeNode)!;
        } else {
            return PrimitiveType.ANY;
        }
    }

    public tryGetVariable2Type(variableNode: ts.Node): number {
        if (this.variable2Type.has(variableNode)) {
            return this.variable2Type.get(variableNode)!;
        } else {
            return PrimitiveType.ANY;
        }
    }

    public setArrayTypeMap(contentTypeIndex: number, arrayTypeIndex: number) {
        this.arrayTypeMap.set(contentTypeIndex, arrayTypeIndex)
    }

    public hasArrayTypeMapping(contentTypeIndex: number) {
        return this.arrayTypeMap.has(contentTypeIndex);
    }

    public getFromArrayTypeMap(contentTypeIndex: number) {
        return this.arrayTypeMap.get(contentTypeIndex);
    }

    public setUnionTypeMap(unionStr: string, unionTypeIndex: number) {
        this.unionTypeMap.set(unionStr, unionTypeIndex)
    }

    public hasUnionTypeMapping(unionStr: string) {
        return this.unionTypeMap.has(unionStr);
    }

    public getFromUnionTypeMap(unionStr: string) {
        return this.unionTypeMap.get(unionStr);
    }

    public setClass2InstanceMap(classIndex: number, instanceIndex: number) {
        this.class2InstanceMap.set(classIndex, instanceIndex)
    }

    public hasClass2InstanceMap(classIndex: number) {
        return this.class2InstanceMap.has(classIndex);
    }

    public getClass2InstanceMap(classIndex: number) {
        return this.class2InstanceMap.get(classIndex);
    }

    public setBuiltinContainer2InstanceMap(builtinContainer: object, instanceIndex: number) {
        this.builtinContainer2InstanceMap.set(builtinContainer, instanceIndex)
    }

    public hasBuiltinContainer2InstanceMap(builtinContainer: object) {
        return this.builtinContainer2InstanceMap.has(builtinContainer);
    }

    public getBuiltinContainer2InstanceMap(builtinContainer: object) {
        return this.builtinContainer2InstanceMap.get(builtinContainer);
    }

    // exported/imported
    public addImportedType(moduleStmt: ModuleStmt) {
        moduleStmt.getBindingNodeMap().forEach((externalNode, localNode) => {
            let externalName = jshelpers.getTextOfIdentifierOrLiteral(externalNode);
            let importDeclNode = TypeChecker.getInstance().getTypeDeclForIdentifier(localNode);
            let externalType = new ExternalType(externalName, moduleStmt.getModuleRequest());
            this.addType2Index(importDeclNode, externalType.shiftedTypeIndex);
            this.setVariable2Type(localNode, externalType.shiftedTypeIndex);
        });

        if (moduleStmt.getNameSpace() != "") {
            this.setNamespaceMap(moduleStmt.getNameSpace(), moduleStmt.getModuleRequest());
            let externalType = new ExternalType("*", moduleStmt.getNameSpace());
            let ImportTypeIndex = externalType.shiftedTypeIndex;
            this.addUserDefinedTypeSet(ImportTypeIndex);
        }
    }

    public addExportedType(moduleStmt: ModuleStmt) {
        if (moduleStmt.getModuleRequest() != "") {
            // re-export, no need to search in typeRecord cause it must not be there
            if (moduleStmt.getNameSpace() != "") {
                // re-export * as namespace
                let externalType = new ExternalType("*", moduleStmt.getModuleRequest());
                let typeIndex = externalType.shiftedTypeIndex;
                this.setExportedType(moduleStmt.getNameSpace(), typeIndex);
                this.addUserDefinedTypeSet(typeIndex);
            } else if (moduleStmt.getBindingNameMap().size != 0) {
                // re-export via clause
                moduleStmt.getBindingNameMap().forEach((originalName, exportedName) => {
                    let externalType = new ExternalType(originalName, moduleStmt.getModuleRequest());
                    let typeIndex = externalType.shiftedTypeIndex;
                    this.setExportedType(exportedName, typeIndex);
                    this.addUserDefinedTypeSet(typeIndex);
                });
            } else {
                // re-export * with anonymuse namespace
                this.addAnonymousReExport(moduleStmt.getModuleRequest());
            }
        } else {
            // named export via clause, could came from imported or local
            moduleStmt.getBindingNodeMap().forEach((localNode, externalNode) => {
                let exportedName = jshelpers.getTextOfIdentifierOrLiteral(externalNode);
                let nodeType = TypeChecker.getInstance().getTypeAtLocation(localNode);
                let typeNode = nodeType?.getSymbol()?.valueDeclaration;
                if (typeNode) {
                    this.addNonReExportedType(exportedName, typeNode!, localNode);
                }
            });
        }
    }

    public addNonReExportedType(exportedName: string, typeNode: ts.Node, localNode: ts.Node) {
        // Check if type of localName was already stroed in typeRecord
        // Imported type should already be stored in typeRecord by design
        let typeIndexForType = this.tryGetTypeIndex(typeNode);
        let typeIndexForVariable = this.tryGetVariable2Type(typeNode);
        if (typeIndexForType != PrimitiveType.ANY) {
            this.setExportedType(exportedName, typeIndexForType);
        } else if (typeIndexForVariable != PrimitiveType.ANY) {
            this.setExportedType(exportedName, typeIndexForVariable);
        } else {
            // not found in typeRecord. Need to create the type and
            // add to typeRecord with its localName and to exportedType with its exportedName
            let typeIndex = TypeChecker.getInstance().getTypeFromDecl(typeNode, localNode.kind == ts.SyntaxKind.NewExpression);
            this.setExportedType(exportedName, typeIndex);
        }
    }

    public setExportedType(exportedName: string, typeIndex: number) {
        this.exportedType.set(exportedName, typeIndex);
    }

    public setDeclaredType(exportedName: string, typeIndex: number) {
        this.declaredType.set(exportedName, typeIndex);
    }

    public addAnonymousReExport(redirectName: string) {
        this.anonymousReExport.push(redirectName);
    }

    public setNamespaceMap(namespace: string, filePath: string) {
        this.namespaceMap.set(namespace, filePath);
    }

    public inNampespaceMap(targetName: string) {
        return this.namespaceMap.has(targetName);
    }

    public getPathForNamespace(targetName: string) {
        return this.namespaceMap.get(targetName);
    }

    // for log
    public getType2Index(): Map<ts.Node, number> {
        return this.type2Index;
    }

    public getVariable2Type(): Map<ts.Node, number> {
        return this.variable2Type;
    }

    public getTypeSet() {
        return this.userDefinedTypeSet;
    }

    public getExportedType() {
        return this.exportedType;
    }

    public getDeclaredType() {
        return this.declaredType;
    }

    public getAnonymousReExport() {
        return this.anonymousReExport;
    }

    public getNamespaceMap() {
        return this.namespaceMap;
    }

    public printNodeMap(map: Map<ts.Node, number>) {
        map.forEach((value, key) => {
            console.log(jshelpers.getTextOfNode(key) + ": " + value);
        });
    }

    public printExportMap(map: Map<string, number>) {
        map.forEach((value, key) => {
            console.log(key + " : " + value);
        });
    }

    public printReExportMap(map: Map<string, string>) {
        map.forEach((value, key) => {
            console.log(key + " : " + value);
        });
    }

    public getLog() {
        console.log("type2Index: ");
        console.log(this.printNodeMap(this.getType2Index()));
        console.log("variable2Type: ");
        console.log(this.printNodeMap(this.getVariable2Type()));
        console.log("getTypeSet: ");
        console.log(this.getTypeSet());
        console.log("class instance Map:");
        console.log(this.class2InstanceMap);
        console.log("builtinContainer instance Map:");
        console.log(this.builtinContainer2InstanceMap);
        console.log("exportedType:");
        console.log(this.printExportMap(this.getExportedType()));
        console.log("AnoymousRedirect:");
        console.log(this.getAnonymousReExport());
        console.log("namespace Map:");
        console.log(this.getNamespaceMap());
    }
}
