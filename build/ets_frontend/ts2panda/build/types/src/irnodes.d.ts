import { PandaGen } from "./pandagen";
import * as ts from "typescript";
import { DebugPosInfo, NodeKind } from "./debuginfo";
import { Scope } from "./scope";
export declare enum IRNodeKind {
    LDUNDEFINED = 0,
    LDNULL = 1,
    LDTRUE = 2,
    LDFALSE = 3,
    CREATEEMPTYOBJECT = 4,
    CREATEEMPTYARRAY = 5,
    CREATEARRAYWITHBUFFER = 6,
    CREATEOBJECTWITHBUFFER = 7,
    NEWOBJRANGE = 8,
    NEWLEXENV = 9,
    ADD2 = 10,
    SUB2 = 11,
    MUL2 = 12,
    DIV2 = 13,
    MOD2 = 14,
    EQ = 15,
    NOTEQ = 16,
    LESS = 17,
    LESSEQ = 18,
    GREATER = 19,
    GREATEREQ = 20,
    SHL2 = 21,
    SHR2 = 22,
    ASHR2 = 23,
    AND2 = 24,
    OR2 = 25,
    XOR2 = 26,
    EXP = 27,
    TYPEOF = 28,
    TONUMBER = 29,
    TONUMERIC = 30,
    NEG = 31,
    NOT = 32,
    INC = 33,
    DEC = 34,
    ISTRUE = 35,
    ISFALSE = 36,
    ISIN = 37,
    INSTANCEOF = 38,
    STRICTNOTEQ = 39,
    STRICTEQ = 40,
    CALLARG0 = 41,
    CALLARG1 = 42,
    CALLARGS2 = 43,
    CALLARGS3 = 44,
    CALLTHIS0 = 45,
    CALLTHIS1 = 46,
    CALLTHIS2 = 47,
    CALLTHIS3 = 48,
    CALLTHISRANGE = 49,
    SUPERCALLTHISRANGE = 50,
    DEFINEFUNC = 51,
    DEFINEMETHOD = 52,
    DEFINECLASSWITHBUFFER = 53,
    GETNEXTPROPNAME = 54,
    LDOBJBYVALUE = 55,
    STOBJBYVALUE = 56,
    LDSUPERBYVALUE = 57,
    LDOBJBYINDEX = 58,
    STOBJBYINDEX = 59,
    LDLEXVAR = 60,
    STLEXVAR = 61,
    LDA_STR = 62,
    TRYLDGLOBALBYNAME = 63,
    TRYSTGLOBALBYNAME = 64,
    LDGLOBALVAR = 65,
    LDOBJBYNAME = 66,
    STOBJBYNAME = 67,
    MOV = 68,
    LDSUPERBYNAME = 69,
    STCONSTTOGLOBALRECORD = 70,
    STTOGLOBALRECORD = 71,
    LDTHISBYNAME = 72,
    STTHISBYNAME = 73,
    LDTHISBYVALUE = 74,
    STTHISBYVALUE = 75,
    JMP = 76,
    JEQZ = 77,
    JNEZ = 78,
    JSTRICTEQZ = 79,
    JNSTRICTEQZ = 80,
    JEQNULL = 81,
    JNENULL = 82,
    JSTRICTEQNULL = 83,
    JNSTRICTEQNULL = 84,
    JEQUNDEFINED = 85,
    JNEUNDEFINED = 86,
    JSTRICTEQUNDEFINED = 87,
    JNSTRICTEQUNDEFINED = 88,
    JEQ = 89,
    JNE = 90,
    JSTRICTEQ = 91,
    JNSTRICTEQ = 92,
    LDA = 93,
    STA = 94,
    LDAI = 95,
    FLDAI = 96,
    RETURN = 97,
    RETURNUNDEFINED = 98,
    GETPROPITERATOR = 99,
    GETITERATOR = 100,
    CLOSEITERATOR = 101,
    POPLEXENV = 102,
    LDNAN = 103,
    LDINFINITY = 104,
    GETUNMAPPEDARGS = 105,
    LDGLOBAL = 106,
    LDNEWTARGET = 107,
    LDTHIS = 108,
    LDHOLE = 109,
    CREATEREGEXPWITHLITERAL = 110,
    CALLRANGE = 111,
    GETTEMPLATEOBJECT = 112,
    SETOBJECTWITHPROTO = 113,
    STOWNBYVALUE = 114,
    STOWNBYINDEX = 115,
    STOWNBYNAME = 116,
    GETMODULENAMESPACE = 117,
    STMODULEVAR = 118,
    LDLOCALMODULEVAR = 119,
    LDEXTERNALMODULEVAR = 120,
    STGLOBALVAR = 121,
    STOWNBYNAMEWITHNAMESET = 122,
    ASYNCGENERATORREJECT = 123,
    STOWNBYVALUEWITHNAMESET = 124,
    LDSYMBOL = 125,
    ASYNCFUNCTIONENTER = 126,
    LDFUNCTION = 127,
    DEBUGGER = 128,
    CREATEGENERATOROBJ = 129,
    CREATEITERRESULTOBJ = 130,
    CREATEOBJECTWITHEXCLUDEDKEYS = 131,
    NEWOBJAPPLY = 132,
    NEWLEXENVWITHNAME = 133,
    CREATEASYNCGENERATOROBJ = 134,
    ASYNCGENERATORRESOLVE = 135,
    SUPERCALLSPREAD = 136,
    APPLY = 137,
    SUPERCALLARROWRANGE = 138,
    DEFINEGETTERSETTERBYVALUE = 139,
    DYNAMICIMPORT = 140,
    RESUMEGENERATOR = 141,
    GETRESUMEMODE = 142,
    DELOBJPROP = 143,
    SUSPENDGENERATOR = 144,
    ASYNCFUNCTIONAWAITUNCAUGHT = 145,
    COPYDATAPROPERTIES = 146,
    STARRAYSPREAD = 147,
    STSUPERBYVALUE = 148,
    ASYNCFUNCTIONRESOLVE = 149,
    ASYNCFUNCTIONREJECT = 150,
    COPYRESTARGS = 151,
    STSUPERBYNAME = 152,
    LDBIGINT = 153,
    NOP = 154,
    SETGENERATORSTATE = 155,
    GETASYNCITERATOR = 156,
    CALLRUNTIME_NOTIFYCONCURRENTRESULT = 157,
    DEPRECATED_LDLEXENV = 158,
    WIDE_CREATEOBJECTWITHEXCLUDEDKEYS = 159,
    THROW = 160,
    DEPRECATED_POPLEXENV = 161,
    WIDE_NEWOBJRANGE = 162,
    THROW_NOTEXISTS = 163,
    DEPRECATED_GETITERATORNEXT = 164,
    WIDE_NEWLEXENV = 165,
    THROW_PATTERNNONCOERCIBLE = 166,
    DEPRECATED_CREATEARRAYWITHBUFFER = 167,
    WIDE_NEWLEXENVWITHNAME = 168,
    THROW_DELETESUPERPROPERTY = 169,
    DEPRECATED_CREATEOBJECTWITHBUFFER = 170,
    WIDE_CALLRANGE = 171,
    THROW_CONSTASSIGNMENT = 172,
    DEPRECATED_TONUMBER = 173,
    WIDE_CALLTHISRANGE = 174,
    THROW_IFNOTOBJECT = 175,
    DEPRECATED_TONUMERIC = 176,
    WIDE_SUPERCALLTHISRANGE = 177,
    THROW_UNDEFINEDIFHOLE = 178,
    DEPRECATED_NEG = 179,
    WIDE_SUPERCALLARROWRANGE = 180,
    THROW_IFSUPERNOTCORRECTCALL = 181,
    DEPRECATED_NOT = 182,
    WIDE_LDOBJBYINDEX = 183,
    DEPRECATED_INC = 184,
    WIDE_STOBJBYINDEX = 185,
    THROW_UNDEFINEDIFHOLEWITHNAME = 186,
    DEPRECATED_DEC = 187,
    WIDE_STOWNBYINDEX = 188,
    DEPRECATED_CALLARG0 = 189,
    WIDE_COPYRESTARGS = 190,
    DEPRECATED_CALLARG1 = 191,
    WIDE_LDLEXVAR = 192,
    DEPRECATED_CALLARGS2 = 193,
    WIDE_STLEXVAR = 194,
    DEPRECATED_CALLARGS3 = 195,
    WIDE_GETMODULENAMESPACE = 196,
    DEPRECATED_CALLRANGE = 197,
    WIDE_STMODULEVAR = 198,
    DEPRECATED_CALLSPREAD = 199,
    WIDE_LDLOCALMODULEVAR = 200,
    DEPRECATED_CALLTHISRANGE = 201,
    WIDE_LDEXTERNALMODULEVAR = 202,
    DEPRECATED_DEFINECLASSWITHBUFFER = 203,
    WIDE_LDPATCHVAR = 204,
    DEPRECATED_RESUMEGENERATOR = 205,
    WIDE_STPATCHVAR = 206,
    DEPRECATED_GETRESUMEMODE = 207,
    DEPRECATED_GETTEMPLATEOBJECT = 208,
    DEPRECATED_DELOBJPROP = 209,
    DEPRECATED_SUSPENDGENERATOR = 210,
    DEPRECATED_ASYNCFUNCTIONAWAITUNCAUGHT = 211,
    DEPRECATED_COPYDATAPROPERTIES = 212,
    DEPRECATED_SETOBJECTWITHPROTO = 213,
    DEPRECATED_LDOBJBYVALUE = 214,
    DEPRECATED_LDSUPERBYVALUE = 215,
    DEPRECATED_LDOBJBYINDEX = 216,
    DEPRECATED_ASYNCFUNCTIONRESOLVE = 217,
    DEPRECATED_ASYNCFUNCTIONREJECT = 218,
    DEPRECATED_STLEXVAR = 219,
    DEPRECATED_GETMODULENAMESPACE = 220,
    DEPRECATED_STMODULEVAR = 221,
    DEPRECATED_LDOBJBYNAME = 222,
    DEPRECATED_LDSUPERBYNAME = 223,
    DEPRECATED_LDMODULEVAR = 224,
    DEPRECATED_STCONSTTOGLOBALRECORD = 225,
    DEPRECATED_STLETTOGLOBALRECORD = 226,
    DEPRECATED_STCLASSTOGLOBALRECORD = 227,
    DEPRECATED_LDHOMEOBJECT = 228,
    DEPRECATED_CREATEOBJECTHAVINGMETHOD = 229,
    DEPRECATED_DYNAMICIMPORT = 230,
    DEPRECATED_ASYNCGENERATORREJECT = 231,
    VREG = 232,
    IMM = 233,
    LABEL = 234,
    VIRTUALSTARTINS_DYN = 235,
    VIRTUALENDINS_DYN = 236,
    DEFINE_GLOBAL_VAR = 237
}
export declare function getInstructionSize(opcode: IRNodeKind): 0 | 2 | 5 | 1 | 3 | 4 | 10 | 6 | 9 | 7;
export declare enum ResultType {
    None = 0,
    Unknown = 1,
    Int = 2,
    Long = 3,
    Float = 4,
    Obj = 5,
    Boolean = 6
}
export declare enum ResultDst {
    None = 0,
    Acc = 1,
    VReg = 2
}
export declare enum BuiltIns {
    NaN = 0,
    Infinity = 1,
    globalThis = 2,
    undefined = 3,
    Boolean = 4,
    Number = 5,
    String = 6,
    BigInt = 7,
    Symbol = 8,
    Null = 9,
    Object = 10,
    Function = 11,
    Global = 12,
    True = 13,
    False = 14,
    LexEnv = 15,
    MAX_BUILTIN = 16
}
export declare type OperandType = VReg | Imm | Label | string | number;
export declare enum OperandKind {
    SrcVReg = 0,
    DstVReg = 1,
    SrcDstVReg = 2,
    Imm = 3,
    Id = 4,
    StringId = 5,
    Label = 6
}
export declare namespace OperandKind {
}
export declare type Format = number[][];
export declare function getInsnMnemonic(opcode: IRNodeKind): string;
export declare function getInsnFormats(opcode: IRNodeKind): number[][][];
export declare abstract class IRNode {
    readonly kind: IRNodeKind;
    readonly operands: OperandType[];
    private node;
    static pg: PandaGen | undefined;
    constructor(kind: IRNodeKind, operands: OperandType[]);
    debugPosInfo: DebugPosInfo;
    toString(): string;
    setNode(node: ts.Node | NodeKind): void;
    getNodeName(): string;
    getMnemonic(): string;
    getFormats(): number[][][];
    static setPandagen(pg: PandaGen): void;
}
export declare class VReg {
    private typeIndex;
    private variableName;
    num: number;
    toString(): string;
    constructor();
    getTypeIndex(): number;
    setTypeIndex(typeIndex: number): void;
    getVariableName(): string;
    setVariableName(variableName: string): void;
}
export declare class Imm extends IRNode {
    readonly value: number;
    constructor(value: number);
    toString(): string;
}
export declare class Label extends IRNode {
    private static global_id;
    readonly id: number;
    constructor();
    static resetGlobalId(): void;
    toString(): string;
}
export declare class DebugInsStartPlaceHolder extends IRNode {
    private scope;
    constructor(scope: Scope);
    getScope(): Scope;
}
export declare class DebugInsEndPlaceHolder extends IRNode {
    private scope;
    constructor(scope: Scope);
    getScope(): Scope;
}
export declare class Ldundefined extends IRNode {
    constructor();
}
export declare class Ldnull extends IRNode {
    constructor();
}
export declare class Ldtrue extends IRNode {
    constructor();
}
export declare class Ldfalse extends IRNode {
    constructor();
}
export declare class Createemptyobject extends IRNode {
    constructor();
}
export declare class Createemptyarray extends IRNode {
    constructor(imm: Imm);
}
export declare class Createarraywithbuffer extends IRNode {
    constructor(imm: Imm, literalarray_id: string);
}
export declare class Createobjectwithbuffer extends IRNode {
    constructor(imm: Imm, literalarray_id: string);
}
export declare class Newobjrange extends IRNode {
    constructor(imm1: Imm, imm2: Imm, v: VReg[]);
}
export declare class Newlexenv extends IRNode {
    constructor(imm: Imm);
}
export declare class Add2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Sub2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Mul2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Div2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Mod2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Eq extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Noteq extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Less extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Lesseq extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Greater extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Greatereq extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Shl2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Shr2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Ashr2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class And2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Or2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Xor2 extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Exp extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Typeof extends IRNode {
    constructor(imm: Imm);
}
export declare class Tonumber extends IRNode {
    constructor(imm: Imm);
}
export declare class Tonumeric extends IRNode {
    constructor(imm: Imm);
}
export declare class Neg extends IRNode {
    constructor(imm: Imm);
}
export declare class Not extends IRNode {
    constructor(imm: Imm);
}
export declare class Inc extends IRNode {
    constructor(imm: Imm);
}
export declare class Dec extends IRNode {
    constructor(imm: Imm);
}
export declare class Istrue extends IRNode {
    constructor();
}
export declare class Isfalse extends IRNode {
    constructor();
}
export declare class Isin extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Instanceof extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Strictnoteq extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Stricteq extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Callarg0 extends IRNode {
    constructor(imm: Imm);
}
export declare class Callarg1 extends IRNode {
    constructor(imm: Imm, v?: VReg);
}
export declare class Callargs2 extends IRNode {
    constructor(imm: Imm, v1?: VReg, v2?: VReg);
}
export declare class Callargs3 extends IRNode {
    constructor(imm: Imm, v1?: VReg, v2?: VReg, v3?: VReg);
}
export declare class Callthis0 extends IRNode {
    constructor(imm: Imm, v?: VReg);
}
export declare class Callthis1 extends IRNode {
    constructor(imm: Imm, v1?: VReg, v2?: VReg);
}
export declare class Callthis2 extends IRNode {
    constructor(imm: Imm, v1?: VReg, v2?: VReg, v3?: VReg);
}
export declare class Callthis3 extends IRNode {
    constructor(imm: Imm, v1?: VReg, v2?: VReg, v3?: VReg, v4?: VReg);
}
export declare class Callthisrange extends IRNode {
    constructor(imm1: Imm, imm2: Imm, v: VReg[]);
}
export declare class Supercallthisrange extends IRNode {
    constructor(imm1: Imm, imm2: Imm, v: VReg[]);
}
export declare class Definefunc extends IRNode {
    constructor(imm1: Imm, method_id: string, imm2: Imm);
}
export declare class Definemethod extends IRNode {
    constructor(imm1: Imm, method_id: string, imm2: Imm);
}
export declare class Defineclasswithbuffer extends IRNode {
    constructor(imm1: Imm, method_id: string, literalarray_id: string, imm2: Imm, v: VReg);
}
export declare class Getnextpropname extends IRNode {
    constructor(v: VReg);
}
export declare class Ldobjbyvalue extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Stobjbyvalue extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg);
}
export declare class Ldsuperbyvalue extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Ldobjbyindex extends IRNode {
    constructor(imm1: Imm, imm2: Imm);
}
export declare class Stobjbyindex extends IRNode {
    constructor(imm1: Imm, v: VReg, imm2: Imm);
}
export declare class Ldlexvar extends IRNode {
    constructor(imm1: Imm, imm2: Imm);
}
export declare class Stlexvar extends IRNode {
    constructor(imm1: Imm, imm2: Imm);
}
export declare class LdaStr extends IRNode {
    constructor(string_id: string);
}
export declare class Tryldglobalbyname extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Trystglobalbyname extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Ldglobalvar extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Ldobjbyname extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Stobjbyname extends IRNode {
    constructor(imm: Imm, string_id: string, v: VReg);
}
export declare class Mov extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class Ldsuperbyname extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Stconsttoglobalrecord extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Sttoglobalrecord extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Ldthisbyname extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Stthisbyname extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Ldthisbyvalue extends IRNode {
    constructor(imm: Imm);
}
export declare class Stthisbyvalue extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Jmp extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jeqz extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jnez extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jstricteqz extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jnstricteqz extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jeqnull extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jnenull extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jstricteqnull extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jnstricteqnull extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jequndefined extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jneundefined extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jstrictequndefined extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jnstrictequndefined extends IRNode {
    constructor(imm: Label);
    getTarget(): Label;
}
export declare class Jeq extends IRNode {
    constructor(v: VReg, imm: Label);
    getTarget(): Label;
}
export declare class Jne extends IRNode {
    constructor(v: VReg, imm: Label);
    getTarget(): Label;
}
export declare class Jstricteq extends IRNode {
    constructor(v: VReg, imm: Label);
    getTarget(): Label;
}
export declare class Jnstricteq extends IRNode {
    constructor(v: VReg, imm: Label);
    getTarget(): Label;
}
export declare class Lda extends IRNode {
    constructor(v: VReg);
}
export declare class Sta extends IRNode {
    constructor(v: VReg);
}
export declare class Ldai extends IRNode {
    constructor(imm: Imm);
}
export declare class Fldai extends IRNode {
    constructor(imm: Imm);
}
export declare class Return extends IRNode {
    constructor();
}
export declare class Returnundefined extends IRNode {
    constructor();
}
export declare class Getpropiterator extends IRNode {
    constructor();
}
export declare class Getiterator extends IRNode {
    constructor(imm: Imm);
}
export declare class Closeiterator extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Poplexenv extends IRNode {
    constructor();
}
export declare class Ldnan extends IRNode {
    constructor();
}
export declare class Ldinfinity extends IRNode {
    constructor();
}
export declare class Getunmappedargs extends IRNode {
    constructor();
}
export declare class Ldglobal extends IRNode {
    constructor();
}
export declare class Ldnewtarget extends IRNode {
    constructor();
}
export declare class Ldthis extends IRNode {
    constructor();
}
export declare class Ldhole extends IRNode {
    constructor();
}
export declare class Createregexpwithliteral extends IRNode {
    constructor(imm1: Imm, string_id: string, imm2: Imm);
}
export declare class Callrange extends IRNode {
    constructor(imm1: Imm, imm2: Imm, v: VReg[]);
}
export declare class Gettemplateobject extends IRNode {
    constructor(imm: Imm);
}
export declare class Setobjectwithproto extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Stownbyvalue extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg);
}
export declare class Stownbyindex extends IRNode {
    constructor(imm1: Imm, v: VReg, imm2: Imm);
}
export declare class Stownbyname extends IRNode {
    constructor(imm: Imm, string_id: string, v: VReg);
}
export declare class Getmodulenamespace extends IRNode {
    constructor(imm: Imm);
}
export declare class Stmodulevar extends IRNode {
    constructor(imm: Imm);
}
export declare class Ldlocalmodulevar extends IRNode {
    constructor(imm: Imm);
}
export declare class Ldexternalmodulevar extends IRNode {
    constructor(imm: Imm);
}
export declare class Stglobalvar extends IRNode {
    constructor(imm: Imm, string_id: string);
}
export declare class Stownbynamewithnameset extends IRNode {
    constructor(imm: Imm, string_id: string, v: VReg);
}
export declare class Asyncgeneratorreject extends IRNode {
    constructor(v: VReg);
}
export declare class Stownbyvaluewithnameset extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg);
}
export declare class Ldsymbol extends IRNode {
    constructor();
}
export declare class Asyncfunctionenter extends IRNode {
    constructor();
}
export declare class Ldfunction extends IRNode {
    constructor();
}
export declare class Debugger extends IRNode {
    constructor();
}
export declare class Creategeneratorobj extends IRNode {
    constructor(v: VReg);
}
export declare class Createiterresultobj extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class Createobjectwithexcludedkeys extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg[]);
}
export declare class Newobjapply extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Newlexenvwithname extends IRNode {
    constructor(imm: Imm, literalarray_id: string);
}
export declare class Createasyncgeneratorobj extends IRNode {
    constructor(v: VReg);
}
export declare class Asyncgeneratorresolve extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg);
}
export declare class Supercallspread extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class Apply extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg);
}
export declare class Supercallarrowrange extends IRNode {
    constructor(imm1: Imm, imm2: Imm, v: VReg[]);
}
export declare class Definegettersetterbyvalue extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg, v4: VReg);
}
export declare class Dynamicimport extends IRNode {
    constructor();
}
export declare class Resumegenerator extends IRNode {
    constructor();
}
export declare class Getresumemode extends IRNode {
    constructor();
}
export declare class Delobjprop extends IRNode {
    constructor(v: VReg);
}
export declare class Suspendgenerator extends IRNode {
    constructor(v: VReg);
}
export declare class Asyncfunctionawaituncaught extends IRNode {
    constructor(v: VReg);
}
export declare class Copydataproperties extends IRNode {
    constructor(v: VReg);
}
export declare class Starrayspread extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class Stsuperbyvalue extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg);
}
export declare class Asyncfunctionresolve extends IRNode {
    constructor(v: VReg);
}
export declare class Asyncfunctionreject extends IRNode {
    constructor(v: VReg);
}
export declare class Copyrestargs extends IRNode {
    constructor(imm: Imm);
}
export declare class Stsuperbyname extends IRNode {
    constructor(imm: Imm, string_id: string, v: VReg);
}
export declare class Ldbigint extends IRNode {
    constructor(string_id: string);
}
export declare class Nop extends IRNode {
    constructor();
}
export declare class Setgeneratorstate extends IRNode {
    constructor(imm: Imm);
}
export declare class Getasynciterator extends IRNode {
    constructor(imm: Imm);
}
export declare class CallruntimeNotifyconcurrentresult extends IRNode {
    constructor();
}
export declare class DeprecatedLdlexenv extends IRNode {
    constructor();
}
export declare class WideCreateobjectwithexcludedkeys extends IRNode {
    constructor(imm: Imm, v1: VReg, v2: VReg[]);
}
export declare class Throw extends IRNode {
    constructor();
}
export declare class DeprecatedPoplexenv extends IRNode {
    constructor();
}
export declare class WideNewobjrange extends IRNode {
    constructor(imm: Imm, v: VReg[]);
}
export declare class ThrowNotexists extends IRNode {
    constructor();
}
export declare class DeprecatedGetiteratornext extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class WideNewlexenv extends IRNode {
    constructor(imm: Imm);
}
export declare class ThrowPatternnoncoercible extends IRNode {
    constructor();
}
export declare class DeprecatedCreatearraywithbuffer extends IRNode {
    constructor(imm: Imm);
}
export declare class WideNewlexenvwithname extends IRNode {
    constructor(imm: Imm, literalarray_id: string);
}
export declare class ThrowDeletesuperproperty extends IRNode {
    constructor();
}
export declare class DeprecatedCreateobjectwithbuffer extends IRNode {
    constructor(imm: Imm);
}
export declare class WideCallrange extends IRNode {
    constructor(imm: Imm, v: VReg[]);
}
export declare class ThrowConstassignment extends IRNode {
    constructor(v: VReg);
}
export declare class DeprecatedTonumber extends IRNode {
    constructor(v: VReg);
}
export declare class WideCallthisrange extends IRNode {
    constructor(imm: Imm, v: VReg[]);
}
export declare class ThrowIfnotobject extends IRNode {
    constructor(v: VReg);
}
export declare class DeprecatedTonumeric extends IRNode {
    constructor(v: VReg);
}
export declare class WideSupercallthisrange extends IRNode {
    constructor(imm: Imm, v: VReg[]);
}
export declare class ThrowUndefinedifhole extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedNeg extends IRNode {
    constructor(v: VReg);
}
export declare class WideSupercallarrowrange extends IRNode {
    constructor(imm: Imm, v: VReg[]);
}
export declare class ThrowIfsupernotcorrectcall extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedNot extends IRNode {
    constructor(v: VReg);
}
export declare class WideLdobjbyindex extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedInc extends IRNode {
    constructor(v: VReg);
}
export declare class WideStobjbyindex extends IRNode {
    constructor(v: VReg, imm: Imm);
}
export declare class ThrowUndefinedifholewithname extends IRNode {
    constructor(string_id: string);
}
export declare class DeprecatedDec extends IRNode {
    constructor(v: VReg);
}
export declare class WideStownbyindex extends IRNode {
    constructor(v: VReg, imm: Imm);
}
export declare class DeprecatedCallarg0 extends IRNode {
    constructor(v: VReg);
}
export declare class WideCopyrestargs extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedCallarg1 extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class WideLdlexvar extends IRNode {
    constructor(imm1: Imm, imm2: Imm);
}
export declare class DeprecatedCallargs2 extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg);
}
export declare class WideStlexvar extends IRNode {
    constructor(imm1: Imm, imm2: Imm);
}
export declare class DeprecatedCallargs3 extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg, v4: VReg);
}
export declare class WideGetmodulenamespace extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedCallrange extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class WideStmodulevar extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedCallspread extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg);
}
export declare class WideLdlocalmodulevar extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedCallthisrange extends IRNode {
    constructor(imm: Imm, v: VReg);
}
export declare class WideLdexternalmodulevar extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedDefineclasswithbuffer extends IRNode {
    constructor(method_id: string, imm1: Imm, imm2: Imm, v1: VReg, v2: VReg);
}
export declare class WideLdpatchvar extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedResumegenerator extends IRNode {
    constructor(v: VReg);
}
export declare class WideStpatchvar extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedGetresumemode extends IRNode {
    constructor(v: VReg);
}
export declare class DeprecatedGettemplateobject extends IRNode {
    constructor(v: VReg);
}
export declare class DeprecatedDelobjprop extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedSuspendgenerator extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedAsyncfunctionawaituncaught extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedCopydataproperties extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedSetobjectwithproto extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedLdobjbyvalue extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedLdsuperbyvalue extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
export declare class DeprecatedLdobjbyindex extends IRNode {
    constructor(v: VReg, imm: Imm);
}
export declare class DeprecatedAsyncfunctionresolve extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg);
}
export declare class DeprecatedAsyncfunctionreject extends IRNode {
    constructor(v1: VReg, v2: VReg, v3: VReg);
}
export declare class DeprecatedStlexvar extends IRNode {
    constructor(imm1: Imm, imm2: Imm, v: VReg);
}
export declare class DeprecatedGetmodulenamespace extends IRNode {
    constructor(string_id: string);
}
export declare class DeprecatedStmodulevar extends IRNode {
    constructor(string_id: string);
}
export declare class DeprecatedLdobjbyname extends IRNode {
    constructor(string_id: string, v: VReg);
}
export declare class DeprecatedLdsuperbyname extends IRNode {
    constructor(string_id: string, v: VReg);
}
export declare class DeprecatedLdmodulevar extends IRNode {
    constructor(string_id: string, imm: Imm);
}
export declare class DeprecatedStconsttoglobalrecord extends IRNode {
    constructor(string_id: string);
}
export declare class DeprecatedStlettoglobalrecord extends IRNode {
    constructor(string_id: string);
}
export declare class DeprecatedStclasstoglobalrecord extends IRNode {
    constructor(string_id: string);
}
export declare class DeprecatedLdhomeobject extends IRNode {
    constructor();
}
export declare class DeprecatedCreateobjecthavingmethod extends IRNode {
    constructor(imm: Imm);
}
export declare class DeprecatedDynamicimport extends IRNode {
    constructor(v: VReg);
}
export declare class DeprecatedAsyncgeneratorreject extends IRNode {
    constructor(v1: VReg, v2: VReg);
}
//# sourceMappingURL=irnodes.d.ts.map