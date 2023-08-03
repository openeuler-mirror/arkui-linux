import * as ts from "typescript";
import { NodeKind } from "../debuginfo";
import { VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
import { FunctionBuilder, FunctionBuilderType } from "./functionBuilder";
/**
 * async function foo() {
 *     await 'promise obj';
 * }
 */
export declare class AsyncFunctionBuilder extends FunctionBuilder {
    constructor(pandaGen: PandaGen);
    prepare(node: ts.Node): void;
    await(node: ts.Node): void;
    explicitReturn(node: ts.Node | NodeKind, empty?: boolean): void;
    implicitReturn(node: ts.Node | NodeKind): void;
    private handleMode;
    resolve(node: ts.Node | NodeKind, value: VReg): void;
    cleanUp(node: ts.Node): void;
    builderType(): FunctionBuilderType;
}
//# sourceMappingURL=asyncFunctionBuilder.d.ts.map