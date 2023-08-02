import * as ts from "typescript";
import { TypeChecker } from "../typeChecker";
import { TypeRecorder } from "../typeRecorder";
import { Literal, LiteralBuffer } from "./literal";
export declare enum PrimitiveType {
    ANY = 0,
    NUMBER = 1,
    BOOLEAN = 2,
    VOID = 3,
    STRING = 4,
    SYMBOL = 5,
    NULL = 6,
    UNDEFINED = 7,
    INT = 8
}
export declare enum BuiltinType {
    _HEAD = 20,
    Function = 21,
    RangeError = 22,
    Error = 23,
    Object = 24,
    SyntaxError = 25,
    TypeError = 26,
    ReferenceError = 27,
    URIError = 28,
    Symbol = 29,
    EvalError = 30,
    Number = 31,
    parseFloat = 32,
    Date = 33,
    Boolean = 34,
    BigInt = 35,
    parseInt = 36,
    WeakMap = 37,
    RegExp = 38,
    Set = 39,
    Map = 40,
    WeakRef = 41,
    WeakSet = 42,
    FinalizationRegistry = 43,
    Array = 44,
    Uint8ClampedArray = 45,
    Uint8Array = 46,
    TypedArray = 47,
    Int8Array = 48,
    Uint16Array = 49,
    Uint32Array = 50,
    Int16Array = 51,
    Int32Array = 52,
    Float32Array = 53,
    Float64Array = 54,
    BigInt64Array = 55,
    BigUint64Array = 56,
    SharedArrayBuffer = 57,
    DataView = 58,
    String = 59,
    ArrayBuffer = 60,
    eval = 61,
    isFinite = 62,
    ArkPrivate = 63,
    print = 64,
    decodeURI = 65,
    decodeURIComponent = 66,
    isNaN = 67,
    encodeURI = 68,
    NaN = 69,
    globalThis = 70,
    encodeURIComponent = 71,
    Infinity = 72,
    Math = 73,
    JSON = 74,
    Atomics = 75,
    undefined = 76,
    Reflect = 77,
    Promise = 78,
    Proxy = 79,
    GeneratorFunction = 80,
    Intl = 81
}
export declare const userDefinedTypeStartIndex = 100;
export declare enum L2Type {
    _COUNTER = 0,
    CLASS = 1,
    CLASSINST = 2,
    FUNCTION = 3,
    UNION = 4,
    ARRAY = 5,
    OBJECT = 6,
    EXTERNAL = 7,
    INTERFACE = 8,
    BUILTINCONTAINER = 9
}
export declare enum ClassModifierAbstract {
    NONABSTRACT = 0,
    ABSTRACT = 1
}
export declare enum MethodModifier {
    STATIC = 4,
    ASYNC = 8,
    ASTERISK = 16,
    ABSTRACT = 64,
    DECLARE = 128
}
export declare enum ModifierReadonly {
    NONREADONLY = 0,
    READONLY = 1
}
export declare enum AccessFlag {
    PUBLIC = 0,
    PRIVATE = 1,
    PROTECTED = 2
}
export declare enum GetOrSetAccessorFlag {
    FALSE = 0,
    TRUE = 32
}
export declare abstract class BaseType {
    abstract transfer2LiteralBuffer(): LiteralBuffer;
    protected typeChecker: TypeChecker;
    protected typeRecorder: TypeRecorder;
    protected transferType2Literal(type: number, literals: Array<Literal>): void;
    protected addCurrentType(node: ts.Node, index: number): void;
    protected setVariable2Type(variableNode: ts.Node, index: number): void;
    protected tryGetTypeIndex(typeNode: ts.Node): number;
    protected getOrCreateRecordForDeclNode(typeNode: ts.Node, variableNode?: ts.Node): PrimitiveType;
    protected getOrCreateRecordForTypeNode(typeNode: ts.TypeNode | undefined, variableNode?: ts.Node): PrimitiveType;
    protected getIndexFromTypeArrayBuffer(type: BaseType): number;
    protected setTypeArrayBuffer(type: BaseType, index: number): void;
    protected calculateIndex(builtinTypeIdx: any): {
        typeIndex: number;
        shiftedTypeIndex: number;
    };
}
export declare class PlaceHolderType extends BaseType {
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class TypeSummary extends BaseType {
    preservedIndex: number;
    userDefinedClassNum: number;
    anonymousRedirect: Array<string>;
    constructor();
    setInfo(userDefinedClassNum: number, anonymousRedirect: Array<string>): void;
    getPreservedIndex(): number;
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class ClassType extends BaseType {
    modifier: number;
    extendsHeritage: number;
    implementsHeritages: Array<number>;
    staticFields: Map<string, Array<number>>;
    staticMethods: Map<string, {
        typeIndex: number;
        isDeclare: boolean;
    }>;
    fields: Map<string, Array<number>>;
    methods: Map<string, {
        typeIndex: number;
        isDeclare: boolean;
    }>;
    typeIndex: number;
    shiftedTypeIndex: number;
    field_with_init_num: number;
    method_with_body_num: number;
    constructor(classNode: ts.ClassDeclaration | ts.ClassExpression, builtinTypeIdx?: number);
    private fillInModifiers;
    private fillInHeritages;
    private fillInFields;
    private fillInMethods;
    private fillInFieldsAndMethods;
    transfer2LiteralBuffer(): LiteralBuffer;
    private transferFields2Literal;
    private transferMethods2Literal;
}
export declare class ClassInstType extends BaseType {
    shiftedReferredClassIndex: number;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(referredClassIndex: number);
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class FunctionType extends BaseType {
    name: string;
    accessFlag: number;
    modifiers: number;
    containThisParam: boolean;
    parameters: Array<number>;
    returnType: number;
    typeIndex: number;
    shiftedTypeIndex: number;
    getOrSetAccessorFlag: GetOrSetAccessorFlag;
    constructor(funcNode: ts.FunctionLikeDeclaration | ts.MethodSignature, builtinTypeIdx?: number);
    getFunctionName(): string;
    private fillInModifiers;
    private fillInParameters;
    private fillInReturn;
    getModifier(): number;
    hasModifier(modifier: MethodModifier): boolean;
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class ExternalType extends BaseType {
    fullRedirectNath: string;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(importName: string, redirectPath: string);
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class UnionType extends BaseType {
    unionedTypeArray: Array<number>;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(typeNode: ts.Node);
    setOrReadFromArrayRecord(typeNode: ts.Node): void;
    hasUnionTypeMapping(unionStr: string): boolean;
    getFromUnionTypeMap(unionStr: string): number;
    setUnionTypeMap(unionStr: string, shiftedTypeIndex: number): void;
    fillInUnionArray(typeNode: ts.Node, unionedTypeArray: Array<number>): void;
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class ArrayType extends BaseType {
    referedTypeIndex: number;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(typeNode: ts.Node);
    setOrReadFromArrayRecord(): void;
    hasArrayTypeMapping(referedTypeIndex: number): boolean;
    getFromArrayTypeMap(referedTypeIndex: number): number;
    setArrayTypeMap(referedTypeIndex: number, shiftedTypeIndex: number): void;
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class ObjectType extends BaseType {
    private properties;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(objNode: ts.TypeLiteralNode);
    fillInMembers(objNode: ts.TypeLiteralNode): void;
    transfer2LiteralBuffer(): LiteralBuffer;
}
export declare class InterfaceType extends BaseType {
    heritages: Array<number>;
    fields: Map<string, Array<number>>;
    methods: Array<number>;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(interfaceNode: ts.InterfaceDeclaration);
    private fillInHeritages;
    private fillInFields;
    private fillInMethods;
    private fillInFieldsAndMethods;
    transfer2LiteralBuffer(): LiteralBuffer;
    private transferFields2Literal;
    private transferMethods2Literal;
}
export declare class BuiltinContainerType extends BaseType {
    containerArray: Array<number>;
    builtinTypeIndex: number;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(builtinContainerSignature: object);
    setBuiltinContainer2InstanceMap(builtinContainerSignature: object, index: number): void;
    transfer2LiteralBuffer(): LiteralBuffer;
}
//# sourceMappingURL=typeSystem.d.ts.map