import { VReg } from "../irnodes";
import { PandaGen } from "../pandagen";
export declare enum CacheList {
    MIN = 0,
    NaN = 0,
    HOLE = 1,
    FUNC = 2,
    Infinity = 3,
    undefined = 4,
    Symbol = 5,
    Null = 6,
    Global = 7,
    LexEnv = 8,
    True = 9,
    False = 10,
    MAX = 11
}
declare class CacheItem {
    constructor(handler: Function);
    private flag;
    private vreg;
    private expander;
    isNeeded(): boolean;
    getCache(): VReg;
    getExpander(): Function;
}
export declare class VregisterCache {
    private cache;
    constructor();
    getCache(index: CacheList): CacheItem;
}
export declare function getVregisterCache(pandaGen: PandaGen, index: CacheList): VReg;
export {};
//# sourceMappingURL=vregisterCache.d.ts.map