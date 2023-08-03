import ts from "typescript";
import { Compiler } from "../compiler";
import { VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
import { NodeKind } from "../debuginfo";
import { FunctionBuilder } from "./functionBuilder";
export declare enum AsyncGeneratorState {
    UNDEFINED = 0,
    SUSPENDSTART = 1,
    SUSPENDYIELD = 2,
    EXECUTING = 3,
    COMPLETED = 4,
    AWAITING_RETURN = 5
}
export declare class AsyncGeneratorFunctionBuilder extends FunctionBuilder {
    private compiler;
    constructor(pandaGen: PandaGen, compiler: Compiler);
    prepare(node: ts.Node): void;
    await(node: ts.Node): void;
    directReturn(node: ts.Node | NodeKind): void;
    explicitReturn(node: ts.Node | NodeKind, empty?: boolean): void;
    implicitReturn(node: ts.Node | NodeKind): void;
    yield(node: ts.Node): void;
    yieldStar(node: ts.Node): void;
    private handleAsyncYieldResume;
    private handleMode;
    resolve(node: ts.Node | NodeKind, value: VReg): void;
    cleanUp(node: ts.Node): void;
}
//# sourceMappingURL=asyncGeneratorFunctionBuilder.d.ts.map