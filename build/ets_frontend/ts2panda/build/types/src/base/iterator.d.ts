import { IteratorType } from "../statement/forOfStatement";
import * as ts from "typescript";
import { VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
import { FunctionBuilder } from "../function/functionBuilder";
export declare class Iterator {
    private iterRecord;
    private iterDone;
    private iterValue;
    private pandaGen;
    private node;
    private kind;
    private funcBuilder;
    constructor(iterRecord: {
        iterator: VReg;
        nextMethod: VReg;
    }, iterDone: VReg, iterValue: VReg, pandaGen: PandaGen, node: ts.Node, kind?: IteratorType, funcBuilder?: FunctionBuilder);
    getIterator(): void;
    method(): VReg;
    getMethod(id: string): void;
    /**
     *  iterResult = nextMethod.call(iterator);
     *  if (!isObject(iterResult)) {
     *      throw TypeError
     *  }
     */
    callNext(iterResult: VReg): void;
    callMethodwithValue(value: VReg): void;
    iteratorComplete(iterResult: VReg): void;
    iteratorValue(iterResult: VReg): void;
    close(): void;
    getCurrentValue(): VReg;
    getCurrrentDone(): VReg;
}
//# sourceMappingURL=iterator.d.ts.map