import * as ts from "typescript";
export declare class ModuleStmt {
    private node;
    private moduleRequest;
    private namespace;
    private bingdingNameMap;
    private bingdingNodeMap;
    private isCopy;
    constructor(node: ts.Node, moduleRequest?: string);
    getNode(): ts.Node;
    getModuleRequest(): string;
    addLocalName(localName: string, importName: string): void;
    getBindingNameMap(): Map<string, string>;
    addNodeMap(name: ts.Node, propertyName: ts.Node): void;
    getBindingNodeMap(): Map<ts.Node, ts.Node>;
    setNameSpace(namespace: string): void;
    getNameSpace(): string;
    setCopyFlag(isCopy: boolean): void;
    getCopyFlag(): boolean;
}
//# sourceMappingURL=modules.d.ts.map