export declare enum LiteralTag {
    BOOLEAN = 1,
    INTEGER = 2,
    DOUBLE = 4,
    STRING = 5,
    METHOD = 6,
    GENERATOR = 7,
    ACCESSOR = 8,
    METHODAFFILIATE = 9,
    ASYNCGENERATOR = 22,
    LITERALBUFFERINDEX = 23,
    LITERALARRAY = 24,
    BUILTINTYPEINDEX = 25,
    NULLVALUE = 255
}
export declare class Literal {
    private t;
    private v;
    constructor(t: LiteralTag, v: any);
    getTag(): LiteralTag;
    getValue(): any;
}
export declare class LiteralBuffer {
    private k;
    private lb;
    constructor();
    addLiterals(...literals: Array<Literal>): void;
    getLiterals(): Literal[];
    isEmpty(): boolean;
    getLiteral(index: number): Literal;
    setKey(key: string): void;
}
//# sourceMappingURL=literal.d.ts.map