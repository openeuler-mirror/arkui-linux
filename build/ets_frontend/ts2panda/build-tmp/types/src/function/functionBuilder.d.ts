import { NodeKind } from "../debuginfo";
import * as ts from "typescript";
import { Label, VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
export declare enum FunctionBuilderType {
    NORMAL = 0,
    GENERATOR = 1,
    ASYNC = 2,
    ASYNCGENERATOR = 3
}
export declare class FunctionBuilder {
    protected pg: PandaGen | undefined;
    protected funcObj: VReg | undefined;
    protected resumeVal: VReg | undefined;
    protected resumeType: VReg | undefined;
    protected beginLabel: Label | undefined;
    protected endLabel: Label | undefined;
    constructor(pg: PandaGen);
    prepare(node: ts.Node): void;
    cleanUp(node: ts.Node): void;
    functionAwait(node: ts.Node): void;
    resumeGenerator(node: ts.Node | NodeKind): void;
    explicitReturn(node: ts.Node | NodeKind, empty?: boolean): void;
    implicitReturn(node: ts.Node | NodeKind): void;
    builderType(): FunctionBuilderType;
}
//# sourceMappingURL=functionBuilder.d.ts.map