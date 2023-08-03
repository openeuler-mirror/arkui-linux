import * as ts from "typescript";
import { PrimitiveType } from "./base/typeSystem";
import { ModuleStmt } from "./modules";
export declare class TypeChecker {
    private static instance;
    private compiledTypeChecker;
    private needRecordBuiltinContainer;
    private constructor();
    static getInstance(): TypeChecker;
    setTypeChecker(typeChecker: ts.TypeChecker): void;
    getTypeChecker(): ts.TypeChecker;
    getTypeAtLocation(node: ts.Node): any;
    getTypeDeclForIdentifier(node: ts.Node): any;
    hasExportKeyword(node: ts.Node): boolean;
    hasDeclareKeyword(node: ts.Node): boolean;
    getDeclNodeForInitializer(initializer: ts.Node): any;
    getTypeForClassDeclOrExp(typeDeclNode: ts.Node, getTypeForInstace: boolean): number;
    getTypeForPropertyAccessExpression(typeDeclNode: ts.Node): number;
    getInterfaceDeclaration(typeDeclNode: ts.Node): number;
    getTypeFromDecl(typeDeclNode: ts.Node, getTypeForInstace: boolean): number;
    getTypeForLiteralTypeNode(node: ts.Node): PrimitiveType.ANY | PrimitiveType.NUMBER | PrimitiveType.BOOLEAN | PrimitiveType.STRING | PrimitiveType.NULL;
    getTypeFromAnotation(typeNode: ts.TypeNode | undefined): any;
    isBuiltinType(expr: ts.NewExpression): boolean;
    isFromDefaultLib(node: ts.Node): boolean;
    getOrCreateInstanceType(classTypeIdx: number): number;
    getOrCreateInstanceTypeForBuiltinContainer(builtinContainerSignature: object): number;
    getBuiltinTypeIndex(node: ts.NewExpression | ts.TypeReferenceNode, name: string): number;
    getBuiltinTypeIndexForExpr(expr: ts.NewExpression): number;
    getOrCreateRecordForDeclNode(initializer: ts.Node | undefined, variableNode?: ts.Node): PrimitiveType;
    getOrCreateRecordForTypeNode(typeNode: ts.TypeNode | undefined, variableNode?: ts.Node): PrimitiveType;
    formatVariableStatement(variableStatementNode: ts.VariableStatement): void;
    formatClassDeclaration(classDeclNode: ts.ClassDeclaration): void;
    formatNodeType(node: ts.Node, importOrExportStmt?: ModuleStmt): void;
}
//# sourceMappingURL=typeChecker.d.ts.map