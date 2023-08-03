import * as ts from "typescript";
import { Recorder } from "./recorder";
import { Scope, VariableScope } from "./scope";
export declare class LexicalBinder {
    private srcFile;
    private recorder;
    constructor(src: ts.SourceFile, recorder: Recorder);
    resolve(): void;
    resolveIdentReference(node: ts.Node, scope: Scope): void;
    lookUpLexicalReference(name: string, scope: Scope): void;
    setMandatoryParamLexical(name: string, scope: VariableScope): void;
    setMandatoryParamLexicalForNCFuncInDebug(scope: VariableScope): void;
    hasDeclarationParent(id: ts.Identifier): boolean;
    isPropertyName(id: ts.Identifier): boolean;
}
//# sourceMappingURL=lexicalBinder.d.ts.map