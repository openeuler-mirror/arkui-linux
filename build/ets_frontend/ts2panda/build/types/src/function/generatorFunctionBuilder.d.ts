import * as ts from "typescript";
import { NodeKind } from "../debuginfo";
import { Compiler } from "../compiler";
import { PandaGen } from "../pandagen";
import { FunctionBuilder } from "./functionBuilder";
/**
 * function *foo() {
 *     yield 'a'
 * }
*/
export declare class GeneratorFunctionBuilder extends FunctionBuilder {
    private compiler;
    constructor(pandaGen: PandaGen, compiler: Compiler);
    prepare(node: ts.Node): void;
    explicitReturn(node: ts.Node | NodeKind, empty?: boolean): void;
    implicitReturn(node: ts.Node | NodeKind): void;
    yield(node: ts.Node): void;
    yieldStar(expr: ts.YieldExpression): void;
    private handleMode;
    cleanUp(): void;
}
//# sourceMappingURL=generatorFunctionBuilder.d.ts.map