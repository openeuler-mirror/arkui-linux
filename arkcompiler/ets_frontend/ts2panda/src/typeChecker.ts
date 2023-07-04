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
    ArrayType,
    BuiltinContainerType,
    BuiltinType,
    ClassInstType,
    ClassType,
    ExternalType,
    FunctionType,
    InterfaceType,
    ObjectType,
    PrimitiveType,
    UnionType
} from "./base/typeSystem";
import * as jshelpers from "./jshelpers";
import { LOGD } from "./log";
import { ModuleStmt } from "./modules";
import { isGlobalDeclare } from "./strictMode";
import { TypeRecorder } from "./typeRecorder";

export class TypeChecker {
    private static instance: TypeChecker;
    private compiledTypeChecker: any = null;
    // After ets runtime adapt to parse BuiltinContainerType, set the flag as true.
    private needRecordBuiltinContainer: boolean = false;
    private constructor() { }

    public static getInstance(): TypeChecker {
        if (!TypeChecker.instance) {
            TypeChecker.instance = new TypeChecker();
        }
        return TypeChecker.instance;
    }

    public setTypeChecker(typeChecker: ts.TypeChecker) {
        this.compiledTypeChecker = typeChecker;
    }

    public getTypeChecker(): ts.TypeChecker {
        return this.compiledTypeChecker;
    }

    public getTypeAtLocation(node: ts.Node) {
        if (!node) {
            return undefined;
        }
        try {
            return this.compiledTypeChecker.getTypeAtLocation(node);
        } catch {
            LOGD("Get getTypeAtLocation filed for : " + node.getFullText());
            return undefined;
        }
    }

    public getTypeDeclForIdentifier(node: ts.Node) {
        if (!node) {
            return undefined;
        }
        let symbol;
        try {
            symbol = this.compiledTypeChecker.getSymbolAtLocation(node);
        } catch {
            LOGD("Get getSymbolAtLocation filed for : " + node.getFullText());
            return undefined;
        }
        if (symbol && symbol.declarations) {
            return symbol.declarations[0];
        }
        return undefined;
    }

    public hasExportKeyword(node: ts.Node): boolean {
        if (node.modifiers) {
            for (let modifier of node.modifiers) {
                if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
                    return true;
                }
            }
        }
        return false;
    }

    public hasDeclareKeyword(node: ts.Node): boolean {
        if (node.modifiers) {
            for (let modifier of node.modifiers) {
                if (modifier.kind === ts.SyntaxKind.DeclareKeyword) {
                    return true;
                }
            }
        }
        return false;
    }

    public getDeclNodeForInitializer(initializer: ts.Node) {
        switch (initializer.kind) {
            case ts.SyntaxKind.Identifier:
                return this.getTypeDeclForIdentifier(initializer);
            case ts.SyntaxKind.NewExpression:
                let initializerExpression = <ts.NewExpression>initializer;
                let expression = initializerExpression.expression;
                if (expression.kind == ts.SyntaxKind.ClassExpression) {
                    return expression;
                }
                return this.getTypeDeclForIdentifier(expression);
            case ts.SyntaxKind.ClassExpression:
                return initializer;
            case ts.SyntaxKind.PropertyAccessExpression:
                return initializer;
            default:
                return undefined;
        }
    }

    public getTypeForClassDeclOrExp(typeDeclNode: ts.Node, getTypeForInstace: boolean): number {
        if (this.isFromDefaultLib(typeDeclNode)) {
            return PrimitiveType.ANY;
        }
        let classTypeIndex = TypeRecorder.getInstance().tryGetTypeIndex(typeDeclNode);
        if (classTypeIndex == PrimitiveType.ANY) {
            let classDeclNode = <ts.ClassDeclaration>typeDeclNode;
            let className = "";
            let classNameNode = classDeclNode.name;
            if (classNameNode) {
                className = jshelpers.getTextOfIdentifierOrLiteral(classNameNode).replace(/\s/g, "");
            }
            let classType = new ClassType(classDeclNode, BuiltinType[className]);
            classTypeIndex = classType.shiftedTypeIndex;
        }
        if (getTypeForInstace) {
            classTypeIndex = this.getOrCreateInstanceType(classTypeIndex);
        }
        return classTypeIndex;
    }

    public getTypeForPropertyAccessExpression(typeDeclNode: ts.Node) {
        let propertyAccessExpression = <ts.PropertyAccessExpression>typeDeclNode;
        let localName = jshelpers.getTextOfIdentifierOrLiteral(propertyAccessExpression.expression);
        let externalName = jshelpers.getTextOfIdentifierOrLiteral(propertyAccessExpression.name);
        if (TypeRecorder.getInstance().inNampespaceMap(localName)) {
            let redirectPath = TypeRecorder.getInstance().getPathForNamespace(localName)!;
            let externalType = new ExternalType(externalName, redirectPath);
            let ImportTypeIndex = externalType.shiftedTypeIndex;
            return ImportTypeIndex;
        }
        return PrimitiveType.ANY;
    }

    public getInterfaceDeclaration(typeDeclNode: ts.Node) {
        if (this.isFromDefaultLib(typeDeclNode)) {
            return PrimitiveType.ANY;
        }
        let interfaceTypeIndex = TypeRecorder.getInstance().tryGetTypeIndex(typeDeclNode);
        if (interfaceTypeIndex == PrimitiveType.ANY) {
            let interefaceType = new InterfaceType(<ts.InterfaceDeclaration>typeDeclNode);
            interfaceTypeIndex = interefaceType.shiftedTypeIndex;
        }
        return interfaceTypeIndex;
    }

    public getTypeFromDecl(typeDeclNode: ts.Node, getTypeForInstace: boolean): number {
        if (!typeDeclNode) {
            return PrimitiveType.ANY;
        }
        switch (typeDeclNode.kind) {
            // Type found to be defined a classDeclaration or classExpression
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                return this.getTypeForClassDeclOrExp(typeDeclNode, getTypeForInstace);
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.ImportClause:
                let ImportTypeIndex = TypeRecorder.getInstance().tryGetTypeIndex(typeDeclNode);
                if (ImportTypeIndex != PrimitiveType.ANY) {
                    return ImportTypeIndex;
                }
                return PrimitiveType.ANY;
            case ts.SyntaxKind.PropertyAccessExpression:
                return this.getTypeForPropertyAccessExpression(typeDeclNode);
            case ts.SyntaxKind.InterfaceDeclaration:
                return this.getInterfaceDeclaration(typeDeclNode);
            default:
                return PrimitiveType.ANY;
        }
    }

    public getTypeForLiteralTypeNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.NumericLiteral:
                return PrimitiveType.NUMBER;
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
                return PrimitiveType.BOOLEAN;
            case ts.SyntaxKind.StringLiteral:
                return PrimitiveType.STRING;
            case ts.SyntaxKind.NullKeyword:
                return PrimitiveType.NULL;
            default:
                return PrimitiveType.ANY;
        }
    }

    public getTypeFromAnotation(typeNode: ts.TypeNode | undefined) {
        if (!typeNode) {
            return PrimitiveType.ANY;
        }
        switch (typeNode.kind) {
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.BooleanKeyword:
            case ts.SyntaxKind.SymbolKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.VoidKeyword:
                let typeName = typeNode.getText().toUpperCase();
                let typeIndex = PrimitiveType.ANY;
                if (typeName && typeName in PrimitiveType) {
                    typeIndex = PrimitiveType[typeName as keyof typeof PrimitiveType];
                }
                return typeIndex;
            case ts.SyntaxKind.LiteralType:
                let literalType = (<ts.LiteralTypeNode>typeNode).literal;
                return this.getTypeForLiteralTypeNode(literalType);
            case ts.SyntaxKind.UnionType:
                let unionType = new UnionType(typeNode);
                return unionType.shiftedTypeIndex;
            case ts.SyntaxKind.ArrayType:
                let arrayType = new ArrayType(typeNode);
                return arrayType.shiftedTypeIndex;
            case ts.SyntaxKind.ParenthesizedType:
                let subType = (<ts.ParenthesizedTypeNode>typeNode).type
                if (subType.kind == ts.SyntaxKind.UnionType) {
                    let unionType = new UnionType(subType);
                    return unionType.shiftedTypeIndex;
                }
                return PrimitiveType.ANY;
            case ts.SyntaxKind.TypeLiteral:
                let objectType = new ObjectType(<ts.TypeLiteralNode>typeNode);
                return objectType.shiftedTypeIndex;
            case ts.SyntaxKind.TypeReference:
                let typeIdentifier = (<ts.TypeReferenceNode>typeNode).typeName;
                let typeIdentifierName = jshelpers.getTextOfIdentifierOrLiteral(typeIdentifier);
                if (BuiltinType[typeIdentifierName]) {
                    let declNode = this.getDeclNodeForInitializer(typeIdentifier);
                    if (declNode && (ts.isClassLike(declNode) || declNode.kind == ts.SyntaxKind.InterfaceDeclaration)) {
                        return this.getBuiltinTypeIndex(<ts.TypeReferenceNode>typeNode, typeIdentifierName);
                    } else {
                        return BuiltinType[typeIdentifierName];
                    }
                }
            default:
                return PrimitiveType.ANY;
        }
    }

    isBuiltinType(expr: ts.NewExpression) {
        let name = expr.expression.getFullText().replace(/\s/g, "");
        return name in BuiltinType;
    }

    isFromDefaultLib(node: ts.Node) {
        return node.getSourceFile().hasNoDefaultLib;
    }

    getOrCreateInstanceType(classTypeIdx: number) {
        let typeRec = TypeRecorder.getInstance();
        if (typeRec.hasClass2InstanceMap(classTypeIdx)) {
            return typeRec.getClass2InstanceMap(classTypeIdx);
        }
        let instanceType = new ClassInstType(classTypeIdx);
        return instanceType.shiftedTypeIndex;
    }

    getOrCreateInstanceTypeForBuiltinContainer(builtinContainerSignature: object) {
        let typeRec = TypeRecorder.getInstance();
        if (typeRec.hasBuiltinContainer2InstanceMap(builtinContainerSignature)) {
            return typeRec.getBuiltinContainer2InstanceMap(builtinContainerSignature);
        }
        let builtinContainerType = new BuiltinContainerType(builtinContainerSignature);
        let builtinContainerTypeIdx = builtinContainerType.shiftedTypeIndex;
        return this.getOrCreateInstanceType(builtinContainerTypeIdx);
    }

    getBuiltinTypeIndex(node: ts.NewExpression | ts.TypeReferenceNode, name: string) {
        let typeArguments = node.typeArguments;
        if (typeArguments && this.needRecordBuiltinContainer) {
            let typeArgIdxs = new Array<number>();
            for(let typeArg of typeArguments) {
                let typeArgIdx = this.getOrCreateRecordForTypeNode(typeArg);
                typeArgIdxs.push(typeArgIdx);
            }
            let builtinContainerSignature = {
                "typeIndex": BuiltinType[name],
                "typeArgIdxs": typeArgIdxs
            }
            return this.getOrCreateInstanceTypeForBuiltinContainer(builtinContainerSignature);
        }
        return this.getOrCreateInstanceType(BuiltinType[name]);
    }

    getBuiltinTypeIndexForExpr(expr: ts.NewExpression) {
        let origExprNode = <ts.NewExpression>ts.getOriginalNode(expr);
        let name = origExprNode.expression.getFullText().replace(/\s/g, "");
        return this.getBuiltinTypeIndex(origExprNode, name);
    }

    public getOrCreateRecordForDeclNode(initializer: ts.Node | undefined, variableNode?: ts.Node) {
        if (!initializer) {
            return PrimitiveType.ANY;
        }

        let typeIndex = PrimitiveType.ANY;
        if (initializer.kind == ts.SyntaxKind.NewExpression && this.isBuiltinType(<ts.NewExpression>initializer)) {
            typeIndex = this.getBuiltinTypeIndexForExpr(<ts.NewExpression>initializer);
        } else {
            let declNode = this.getDeclNodeForInitializer(initializer);
            typeIndex = this.getTypeFromDecl(declNode, initializer.kind == ts.SyntaxKind.NewExpression);
        }

        if (variableNode) {
            TypeRecorder.getInstance().setVariable2Type(variableNode, typeIndex);
        }
        return typeIndex;
    }

    public getOrCreateRecordForTypeNode(typeNode: ts.TypeNode | undefined, variableNode?: ts.Node) {
        if (!typeNode) {
            return PrimitiveType.ANY;
        }
        let typeIndex = PrimitiveType.ANY;
        typeIndex = this.getTypeFromAnotation(typeNode);
        if (typeIndex == PrimitiveType.ANY && typeNode.kind == ts.SyntaxKind.TypeReference) {
            let typeName = typeNode.getChildAt(0);
            let typeDecl = this.getDeclNodeForInitializer(typeName);
            typeIndex = this.getTypeFromDecl(typeDecl, true);
        }
        if (variableNode) {
            TypeRecorder.getInstance().setVariable2Type(variableNode, typeIndex);
        }
        return typeIndex;
    }

    public formatVariableStatement(variableStatementNode: ts.VariableStatement) {
        let decList = variableStatementNode.declarationList;
        decList.declarations.forEach(declaration => {
            let variableNode = declaration.name;
            let typeNode = declaration.type;
            let initializer = declaration.initializer;
            let typeIndex = this.getOrCreateRecordForTypeNode(typeNode, variableNode);
            if (typeIndex == PrimitiveType.ANY) {
                typeIndex = this.getOrCreateRecordForDeclNode(initializer, variableNode);
            }
            if (this.hasExportKeyword(variableStatementNode) && typeIndex != PrimitiveType.ANY) {
                let exportedName = jshelpers.getTextOfIdentifierOrLiteral(variableNode);
                TypeRecorder.getInstance().setExportedType(exportedName, typeIndex);
            }
        });
    }

    public formatClassDeclaration(classDeclNode: ts.ClassDeclaration) {
        if (this.isFromDefaultLib(classDeclNode)) {
            return;
        }
        let classNameNode = classDeclNode.name;
        let className = "default";
        if (classNameNode) {
            className = jshelpers.getTextOfIdentifierOrLiteral(classNameNode).replace(/\s/g, "");
        }

        let typeIndex = TypeRecorder.getInstance().tryGetTypeIndex(classDeclNode);
        if (typeIndex == PrimitiveType.ANY) {
            let classType = new ClassType(classDeclNode, BuiltinType[className]);
            typeIndex = classType.shiftedTypeIndex;
        }

        if (this.hasExportKeyword(classDeclNode)) {
            TypeRecorder.getInstance().setExportedType(className, typeIndex);
        } else if (this.hasDeclareKeyword(classDeclNode) && isGlobalDeclare()) {
            TypeRecorder.getInstance().setDeclaredType(className, typeIndex);
        }
    }

    // Entry for type recording
    public formatNodeType(node: ts.Node, importOrExportStmt?: ModuleStmt) {
        if (this.compiledTypeChecker === null) {
            return;
        }
        switch (node.kind) {
            case ts.SyntaxKind.VariableStatement:
                let variableStatementNode = <ts.VariableStatement>ts.getOriginalNode(node);
                if (variableStatementNode.kind == ts.SyntaxKind.VariableStatement) {
                    this.formatVariableStatement(variableStatementNode);
                }
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                let functionDeclNode = <ts.FunctionDeclaration>ts.getOriginalNode(node);
                if (this.isFromDefaultLib(functionDeclNode)) {
                    break;
                }
                let functionName = functionDeclNode.name ? functionDeclNode.name : undefined;
                let funcTypeIndex = TypeRecorder.getInstance().tryGetTypeIndex(functionDeclNode);
                if (funcTypeIndex == PrimitiveType.ANY) {
                    let functionnameText = "";
                    if (functionName) {
                        functionnameText = jshelpers.getTextOfIdentifierOrLiteral(functionName);
                    }
                    let funcType = new FunctionType(functionDeclNode, BuiltinType[functionnameText]);
                    funcTypeIndex = funcType.shiftedTypeIndex;
                }
                if (functionName) {
                    TypeRecorder.getInstance().setVariable2Type(functionName, funcTypeIndex);
                }
                break;
            case ts.SyntaxKind.ClassDeclaration:
                // Create the type if it is exported or declared. If not, also create type in case there's
                // static property access of this class.
                let classDeclNode = <ts.ClassDeclaration>ts.getOriginalNode(node);
                this.formatClassDeclaration(classDeclNode);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                if (isGlobalDeclare()) {
                    let interfaceDeclNode = <ts.InterfaceDeclaration>ts.getOriginalNode(node);
                    if (this.isFromDefaultLib(interfaceDeclNode)) {
                        break;
                    }
                    let interfaceType = new InterfaceType(interfaceDeclNode);
                    let interfaceName = interfaceDeclNode.name;
                    if (interfaceName) {
                        let name = jshelpers.getTextOfIdentifierOrLiteral(interfaceName);
                        TypeRecorder.getInstance().setDeclaredType(name, interfaceType.shiftedTypeIndex);
                    }
                }
                break;
            case ts.SyntaxKind.ExportDeclaration:
                if (importOrExportStmt) {
                    TypeRecorder.getInstance().addExportedType(importOrExportStmt);
                }
                break;
            case ts.SyntaxKind.ImportDeclaration:
                if (importOrExportStmt) {
                    TypeRecorder.getInstance().addImportedType(importOrExportStmt);
                }
                break;
            case ts.SyntaxKind.ExportAssignment:
                let expression = (<ts.ExportAssignment>node).expression;
                let exportedName = "default";
                let expressionType = this.getTypeAtLocation(expression);
                if (expressionType) {
                    let typeNode = expressionType.getSymbol()?.valueDeclaration;
                    TypeRecorder.getInstance().addNonReExportedType(exportedName, typeNode, expression);
                }
                break;
            default:
                break;
        }
    }


}
