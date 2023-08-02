/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";
import * as jshelpers from "../jshelpers";
import { PandaGen } from "../pandagen";
import { TypeChecker } from "../typeChecker";
import { TypeRecorder } from "../typeRecorder";
import { isGlobalDeclare } from "../strictMode";
import {
    Literal,
    LiteralBuffer,
    LiteralTag
} from "./literal";
import { hasAbstractModifier } from "./util";
import { CmdOptions } from "../cmdOptions";
import { getLiteralKey } from "./util";
import { CompilerDriver } from "../compilerDriver";

export enum PrimitiveType {
    ANY,
    NUMBER,
    BOOLEAN,
    VOID,
    STRING,
    SYMBOL,
    NULL,
    UNDEFINED,
    INT,
}

export enum BuiltinType {
    _HEAD = 20,
    Function,
    RangeError,
    Error,
    Object,
    SyntaxError,
    TypeError,
    ReferenceError,
    URIError,
    Symbol,
    EvalError,
    Number,
    parseFloat,
    Date,
    Boolean,
    BigInt,
    parseInt,
    WeakMap,
    RegExp,
    Set,
    Map,
    WeakRef,
    WeakSet,
    FinalizationRegistry,
    Array,
    Uint8ClampedArray,
    Uint8Array,
    TypedArray,
    Int8Array,
    Uint16Array,
    Uint32Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
    SharedArrayBuffer,
    DataView,
    String,
    ArrayBuffer,
    eval,
    isFinite,
    ArkPrivate,
    print,
    decodeURI,
    decodeURIComponent,
    isNaN,
    encodeURI,
    NaN,
    globalThis,
    encodeURIComponent,
    Infinity,
    Math,
    JSON,
    Atomics,
    undefined,
    Reflect,
    Promise,
    Proxy,
    GeneratorFunction,
    Intl,
}

export const userDefinedTypeStartIndex = 100;
let literalBufferIndexShift = userDefinedTypeStartIndex;

export enum L2Type {
    _COUNTER,
    CLASS,
    CLASSINST,
    FUNCTION,
    UNION,
    ARRAY,
    OBJECT,
    EXTERNAL,
    INTERFACE,
    BUILTINCONTAINER
}


export enum ClassModifierAbstract {
    NONABSTRACT,
    ABSTRACT
}

export enum MethodModifier {
    STATIC = 1 << 2,
    ASYNC = 1 << 3,
    ASTERISK = 1 << 4,
    ABSTRACT = 1 << 6,  // The fifth bit is held by GetOrSetAccessorFlag
    DECLARE = 1 << 7
}

export enum ModifierReadonly {
    NONREADONLY,
    READONLY
}

export enum AccessFlag {
    PUBLIC,
    PRIVATE,
    PROTECTED
}

export enum GetOrSetAccessorFlag {
    FALSE = 0,  // Not GetAccessor and SetAccessor
    TRUE = 1 << 5  // GetAccessor or SetAccessor
}

type ClassMemberFunction = ts.MethodDeclaration | ts.ConstructorDeclaration |
                           ts.GetAccessorDeclaration | ts.SetAccessorDeclaration;

export abstract class BaseType {

    abstract transfer2LiteralBuffer(): LiteralBuffer;
    protected typeChecker = TypeChecker.getInstance();
    protected typeRecorder = TypeRecorder.getInstance();

    protected transferType2Literal(type: number, literals: Array<Literal>) {
        if (type >= literalBufferIndexShift) {
            let litId = getLiteralKey(CompilerDriver.srcNode, type - literalBufferIndexShift);
            literals.push(new Literal(LiteralTag.LITERALARRAY, litId));
        } else {
            literals.push(new Literal(LiteralTag.BUILTINTYPEINDEX, type));
        }
    }

    protected addCurrentType(node: ts.Node, index: number) {
        this.typeRecorder.addType2Index(node, index);
    }

    protected setVariable2Type(variableNode: ts.Node, index: number) {
        this.typeRecorder.setVariable2Type(variableNode, index);
    }

    protected tryGetTypeIndex(typeNode: ts.Node) {
        return this.typeRecorder.tryGetTypeIndex(typeNode);
    }

    protected getOrCreateRecordForDeclNode(typeNode: ts.Node, variableNode?: ts.Node) {
        return this.typeChecker.getOrCreateRecordForDeclNode(typeNode, variableNode);
    }

    protected getOrCreateRecordForTypeNode(typeNode: ts.TypeNode | undefined, variableNode?: ts.Node) {
        return this.typeChecker.getOrCreateRecordForTypeNode(typeNode, variableNode);
    }

    protected getIndexFromTypeArrayBuffer(type: BaseType): number {
        return PandaGen.appendTypeArrayBuffer(type);
    }

    protected setTypeArrayBuffer(type: BaseType, index: number) {
        PandaGen.setTypeArrayBuffer(type, index);
    }

    protected calculateIndex(builtinTypeIdx) {
        let typeIndex: number;
        let shiftedTypeIndex: number;
        let recordBuiltin = builtinTypeIdx && CmdOptions.needRecordBuiltinDtsType();
        if (recordBuiltin) {
            typeIndex = undefined;
            shiftedTypeIndex = builtinTypeIdx;
            if (isGlobalDeclare()) {
                typeIndex = builtinTypeIdx - BuiltinType._HEAD;
            }
        } else {
            typeIndex = this.getIndexFromTypeArrayBuffer(new PlaceHolderType());
            shiftedTypeIndex = typeIndex + literalBufferIndexShift;
        }
        return {typeIndex: typeIndex, shiftedTypeIndex: shiftedTypeIndex};
    }

}

export class PlaceHolderType extends BaseType {
    transfer2LiteralBuffer(): LiteralBuffer {
        return new LiteralBuffer();
    }
}

export class TypeSummary extends BaseType {
    preservedIndex: number = 0;
    userDefinedClassNum: number = 0;
    anonymousRedirect: Array<string> = new Array<string>();
    constructor() {
        super();
        this.preservedIndex = this.getIndexFromTypeArrayBuffer(new PlaceHolderType());
        if (isGlobalDeclare()) {
            let builtinTypeSlotNum = userDefinedTypeStartIndex - BuiltinType._HEAD;
            for (let i = 0; i < builtinTypeSlotNum; i++) {
                this.getIndexFromTypeArrayBuffer(new PlaceHolderType());
            }
            literalBufferIndexShift = BuiltinType._HEAD;
        }
    }

    public setInfo(userDefinedClassNum: number, anonymousRedirect: Array<string>) {
        this.userDefinedClassNum = userDefinedClassNum;
        this.anonymousRedirect = anonymousRedirect;
        this.setTypeArrayBuffer(this, this.preservedIndex);
    }

    public getPreservedIndex() {
        return this.preservedIndex;
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let countBuf = new LiteralBuffer();
        let summaryLiterals: Array<Literal> = new Array<Literal>();
        let definedTypeNum = this.userDefinedClassNum;
        if (isGlobalDeclare()) {
            definedTypeNum += userDefinedTypeStartIndex - BuiltinType._HEAD;
        }
        summaryLiterals.push(new Literal(LiteralTag.INTEGER, definedTypeNum));
        let literalIdx = PandaGen.getLiteralArrayBuffer.length;
        for (let i = 1; i <= definedTypeNum; i++) {
            summaryLiterals.push(new Literal(LiteralTag.LITERALARRAY,
                                             getLiteralKey(CompilerDriver.srcNode, literalIdx + i)));
        }
        summaryLiterals.push(new Literal(LiteralTag.INTEGER, this.anonymousRedirect.length));
        for (let element of this.anonymousRedirect) {
            summaryLiterals.push(new Literal(LiteralTag.STRING, element));
        }
        countBuf.addLiterals(...summaryLiterals);
        return countBuf;
    }
}

export class ClassType extends BaseType {
    modifier: number = ClassModifierAbstract.NONABSTRACT; // 0 -> unabstract, 1 -> abstract;
    extendsHeritage: number = PrimitiveType.ANY;
    implementsHeritages: Array<number> = new Array<number>();
    // fileds Array: [typeIndex] [public -> 0, private -> 1, protected -> 2] [readonly -> 1]
    staticFields: Map<string, Array<number>> = new Map<string, Array<number>>();
    staticMethods: Map<string, {typeIndex: number, isDeclare: boolean}> = new Map<string, {typeIndex: number, isDeclare: boolean}>();
    fields: Map<string, Array<number>> = new Map<string, Array<number>>();
    methods: Map<string, {typeIndex: number, isDeclare: boolean}> = new Map<string, {typeIndex: number, isDeclare: boolean}>();
    typeIndex: number;
    shiftedTypeIndex: number;
    field_with_init_num: number = 0;
    method_with_body_num: number = 0;

    constructor(classNode: ts.ClassDeclaration | ts.ClassExpression, builtinTypeIdx: number = undefined) {
        super();
        let res = this.calculateIndex(builtinTypeIdx);
        this.typeIndex = res.typeIndex;
        this.shiftedTypeIndex = res.shiftedTypeIndex;

        // record type before its initialization, so its index can be recorded
        // in case there's recursive reference of this type
        this.addCurrentType(classNode, this.shiftedTypeIndex);
        this.fillInModifiers(classNode);
        this.fillInHeritages(classNode);
        this.fillInFieldsAndMethods(classNode);

        if (!builtinTypeIdx || isGlobalDeclare()) {
            this.setTypeArrayBuffer(this, this.typeIndex);
        }

        // create class instance type used by recording 'this' later
        if ((this.method_with_body_num > 0 || this.field_with_init_num > 0) && !hasAbstractModifier(classNode)) {
            let instTypeIdx = this.typeChecker.getOrCreateInstanceType(this.shiftedTypeIndex);
            this.typeRecorder.addUserDefinedTypeSet(instTypeIdx);
        }
    }

    private fillInModifiers(node: ts.ClassDeclaration | ts.ClassExpression) {
        if (node.modifiers) {
            for (let modifier of node.modifiers) {
                switch (modifier.kind) {
                    case ts.SyntaxKind.AbstractKeyword: {
                        this.modifier = ClassModifierAbstract.ABSTRACT;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    }

    private fillInHeritages(node: ts.ClassDeclaration | ts.ClassExpression) {
        if (node.heritageClauses) {
            for (let heritage of node.heritageClauses) {
                let heritageFullName = heritage.getText();
                for (let heritageType of heritage.types) {
                    let heritageIdentifier = <ts.Identifier>heritageType.expression;
                    let heritageTypeIndex = this.getOrCreateRecordForDeclNode(heritageIdentifier, heritageIdentifier);
                    if (heritageFullName.startsWith("extends ")) {
                        this.extendsHeritage = heritageTypeIndex;
                    } else if (heritageFullName.startsWith("implements ")) {
                        this.implementsHeritages.push(heritageTypeIndex);
                    }
                }
            }
        }
    }

    private fillInFields(member: ts.PropertyDeclaration) {
        let fieldName = jshelpers.getTextOfIdentifierOrLiteral(member.name);
        let fieldInfo = Array<number>(PrimitiveType.ANY, AccessFlag.PUBLIC, ModifierReadonly.NONREADONLY);
        let isStatic: boolean = false;
        if (member.modifiers) {
            for (let modifier of member.modifiers) {
                switch (modifier.kind) {
                    case ts.SyntaxKind.StaticKeyword: {
                        isStatic = true;
                        break;
                    }
                    case ts.SyntaxKind.PrivateKeyword: {
                        fieldInfo[1] = AccessFlag.PRIVATE;
                        break;
                    }
                    case ts.SyntaxKind.ProtectedKeyword: {
                        fieldInfo[1] = AccessFlag.PROTECTED;
                        break;
                    }
                    case ts.SyntaxKind.ReadonlyKeyword: {
                        fieldInfo[2] = ModifierReadonly.READONLY;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }

        let typeNode = member.type
        let memberName = member.name
        fieldInfo[0] = this.getOrCreateRecordForTypeNode(typeNode, memberName);

        if (isStatic) {
            this.staticFields.set(fieldName, fieldInfo);
        } else {
            this.fields.set(fieldName, fieldInfo);
            if (member.initializer != undefined) {
                this.field_with_init_num++;
            }
        }
    }

    private fillInMethods(member: ClassMemberFunction) {
        /**
         * a method like declaration in a new class must be a new type,
         * create this type and add it into typeRecorder if it's not from tsc's library
         */
        if (this.typeChecker.isFromDefaultLib(member)) {
            return;
        }
        // Keep the rule to get the name as the same as to get function's name in FunctionType
        let funcName = member.name ? jshelpers.getTextOfIdentifierOrLiteral(member.name) : "constructor";
        let isStatic = false;
        if (member.modifiers) {
            for (let modifier of member.modifiers) {
                if (modifier.kind == ts.SyntaxKind.StaticKeyword) {
                    isStatic = true;
                }
            }
        }
        let foundSameNameFuncRet = isStatic ? this.staticMethods.get(funcName) : this.methods.get(funcName);
        if (foundSameNameFuncRet && !foundSameNameFuncRet.isDeclare) {
            // A same named method with implementation has already been recorded
            return;
        }
        let variableNode = member.name ? member.name : undefined;
        let funcType = new FunctionType(<ts.FunctionLikeDeclaration>member);
        if (variableNode) {
            this.setVariable2Type(variableNode, funcType.shiftedTypeIndex);
        }

        // Then, get the typeIndex and fill in the methods array
        let type = this.tryGetTypeIndex(member);
        if (isStatic) {
            this.staticMethods.set(funcType.getFunctionName(), {typeIndex: type!, isDeclare: member.body == undefined});
        } else {
            this.methods.set(funcType.getFunctionName(), {typeIndex: type!, isDeclare: member.body == undefined});
            if (member.body != undefined) {
                this.method_with_body_num++;
            }
        }
    }

    private fillInFieldsAndMethods(node: ts.ClassDeclaration | ts.ClassExpression) {
        if (node.members) {
            for (let member of node.members) {
                switch (member.kind) {
                    case ts.SyntaxKind.MethodDeclaration:
                    case ts.SyntaxKind.Constructor:
                    case ts.SyntaxKind.GetAccessor:
                    case ts.SyntaxKind.SetAccessor: {
                        this.fillInMethods(<ClassMemberFunction>member);
                        break;
                    }
                    case ts.SyntaxKind.PropertyDeclaration: {
                        this.fillInFields(<ts.PropertyDeclaration>member);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }

    transfer2LiteralBuffer() {
        if (!this.typeIndex) {
            return;
        }
        let classTypeBuf = new LiteralBuffer();
        let classTypeLiterals: Array<Literal> = new Array<Literal>();
        // the first element is to determine the L2 type
        classTypeLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.CLASS));
        classTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.modifier));

        this.transferType2Literal(this.extendsHeritage, classTypeLiterals);
        classTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.implementsHeritages.length));
        this.implementsHeritages.forEach(heritage => { // heritage types
            this.transferType2Literal(heritage, classTypeLiterals);
        });

        // record unstatic fields and methods
        this.transferFields2Literal(classTypeLiterals, false);
        this.transferMethods2Literal(classTypeLiterals, false);

        // record static methods and fields;
        this.transferFields2Literal(classTypeLiterals, true);
        this.transferMethods2Literal(classTypeLiterals, true);

        classTypeBuf.addLiterals(...classTypeLiterals);
        return classTypeBuf;
    }

    private transferFields2Literal(classTypeLiterals: Array<Literal>, isStatic: boolean) {
        let transferredTarget: Map<string, Array<number>> = isStatic ? this.staticFields : this.fields;

        classTypeLiterals.push(new Literal(LiteralTag.INTEGER, transferredTarget.size));
        transferredTarget.forEach((typeInfo, name) => {
            classTypeLiterals.push(new Literal(LiteralTag.STRING, name));
            this.transferType2Literal(typeInfo[0], classTypeLiterals);
            classTypeLiterals.push(new Literal(LiteralTag.INTEGER, typeInfo[1])); // accessFlag
            classTypeLiterals.push(new Literal(LiteralTag.INTEGER, typeInfo[2])); // readonly
        });
    }

    private transferMethods2Literal(classTypeLiterals: Array<Literal>, isStatic: boolean) {
        let transferredTarget: Map<string, {typeIndex: number, isDeclare: boolean}> = isStatic ? this.staticMethods : this.methods;

        classTypeLiterals.push(new Literal(LiteralTag.INTEGER, transferredTarget.size));
        transferredTarget.forEach((typeInfo, name) => {
            let typeIndex: number = <number>typeInfo.typeIndex;
            classTypeLiterals.push(new Literal(LiteralTag.STRING, name));
            this.transferType2Literal(typeIndex, classTypeLiterals);
        });
    }
}

export class ClassInstType extends BaseType {
    shiftedReferredClassIndex: number; // the referred class in the type system;
    typeIndex: number;
    shiftedTypeIndex: number;
    constructor(referredClassIndex: number) {
        super();
        this.shiftedReferredClassIndex = referredClassIndex;
        this.typeIndex = this.getIndexFromTypeArrayBuffer(this);
        this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
        this.typeRecorder.setClass2InstanceMap(this.shiftedReferredClassIndex, this.shiftedTypeIndex);
        if (this.shiftedReferredClassIndex > BuiltinType._HEAD) {
            this.typeRecorder.addUserDefinedTypeSet(this.shiftedTypeIndex);
        }
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let classInstBuf = new LiteralBuffer();
        let classInstLiterals: Array<Literal> = new Array<Literal>();

        classInstLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.CLASSINST));
        this.transferType2Literal(this.shiftedReferredClassIndex, classInstLiterals);
        classInstBuf.addLiterals(...classInstLiterals);

        return classInstBuf;
    }
}

export class FunctionType extends BaseType {
    name: string = '';
    accessFlag: number = AccessFlag.PUBLIC; // 0 -> public, 1 -> private, 2 -> protected
    modifiers: number = 0; // 0 -> non-static, 4 -> static, 8 -> async, 16-> asterisk
    containThisParam: boolean = false;
    parameters: Array<number> = new Array<number>();
    returnType: number = PrimitiveType.ANY;
    typeIndex: number;
    shiftedTypeIndex: number;
    getOrSetAccessorFlag: GetOrSetAccessorFlag = GetOrSetAccessorFlag.FALSE;

    constructor(funcNode: ts.FunctionLikeDeclaration | ts.MethodSignature, builtinTypeIdx: number = undefined) {
        super();
        let res = this.calculateIndex(builtinTypeIdx);
        this.typeIndex = res.typeIndex;
        this.shiftedTypeIndex = res.shiftedTypeIndex;
        if (funcNode.kind == ts.SyntaxKind.GetAccessor || funcNode.kind == ts.SyntaxKind.SetAccessor) {
            this.getOrSetAccessorFlag = GetOrSetAccessorFlag.TRUE;
        }

        // record type before its initialization, so its index can be recorded
        // in case there's recursive reference of this type
        this.addCurrentType(funcNode, this.shiftedTypeIndex);

        if (funcNode.name) {
            this.name = jshelpers.getTextOfIdentifierOrLiteral(funcNode.name);
        } else {
            this.name = "constructor";
        }
        this.fillInModifiers(funcNode);
        this.fillInParameters(funcNode);
        this.fillInReturn(funcNode);
        this.setTypeArrayBuffer(this, this.typeIndex);
    }

    public getFunctionName() {
        return this.name;
    }

    private fillInModifiers(node: ts.FunctionLikeDeclaration | ts.MethodSignature) {
        if (node.modifiers) {
            for (let modifier of node.modifiers) {
                switch (modifier.kind) {
                    case ts.SyntaxKind.PrivateKeyword: {
                        this.accessFlag = AccessFlag.PRIVATE;
                        break;
                    }
                    case ts.SyntaxKind.ProtectedKeyword: {
                        this.accessFlag = AccessFlag.PROTECTED;
                        break;
                    }
                    case ts.SyntaxKind.StaticKeyword: {
                        this.modifiers = MethodModifier.STATIC;
                        break;
                    }
                    case ts.SyntaxKind.AsyncKeyword: {
                        this.modifiers += MethodModifier.ASYNC;
                        break;
                    }
                    case ts.SyntaxKind.AbstractKeyword: {
                        this.modifiers += MethodModifier.ABSTRACT;
                        break;
                    }
                    default:
                        break;
                }
            }
        }

        if (!ts.isMethodSignature(node) && node.asteriskToken) {
            this.modifiers += MethodModifier.ASTERISK;
        }
        if (ts.isMethodSignature(node) || !<ts.FunctionLikeDeclaration>node.body) {
            this.modifiers += MethodModifier.DECLARE;
        }
    }

    private fillInParameters(node: ts.FunctionLikeDeclaration | ts.MethodSignature) {
        if (node.parameters) {
            for (let parameter of node.parameters) {
                let typeNode = parameter.type;
                let variableNode = parameter.name;
                let typeIndex = this.getOrCreateRecordForTypeNode(typeNode, variableNode);
                this.parameters.push(typeIndex);
                if (variableNode.getFullText() == 'this') {
                    this.containThisParam = true;
                }
            }
        }
    }

    private fillInReturn(node: ts.FunctionLikeDeclaration | ts.MethodSignature) {
        let typeNode = node.type;
        let typeIndex = this.getOrCreateRecordForTypeNode(typeNode, typeNode);
        this.returnType = typeIndex;
    }

    getModifier() {
        return this.modifiers;
    }

    hasModifier(modifier: MethodModifier) {
        return (this.modifiers & modifier) ? true : false;
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let funcTypeBuf = new LiteralBuffer();
        let funcTypeLiterals: Array<Literal> = new Array<Literal>();
        funcTypeLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.FUNCTION));
        funcTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.accessFlag + this.modifiers + this.getOrSetAccessorFlag));
        funcTypeLiterals.push(new Literal(LiteralTag.STRING, this.name));
        if (this.containThisParam) {
            funcTypeLiterals.push(new Literal(LiteralTag.INTEGER, 1)); // marker for having 'this' param
            this.transferType2Literal(this.parameters[0], funcTypeLiterals);
            funcTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.parameters.length - 1));
            for (let i = 1; i < this.parameters.length; i++) { // normal parameter types
                this.transferType2Literal(this.parameters[i], funcTypeLiterals);
            }
        } else {
            funcTypeLiterals.push(new Literal(LiteralTag.INTEGER, 0)); // marker for not having 'this' param
            funcTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.parameters.length));
            for (let i = 0; i < this.parameters.length; i++) {
                this.transferType2Literal(this.parameters[i], funcTypeLiterals);
            }
        }

        this.transferType2Literal(this.returnType, funcTypeLiterals);
        funcTypeBuf.addLiterals(...funcTypeLiterals);
        return funcTypeBuf;
    }
}

export class ExternalType extends BaseType {
    fullRedirectNath: string;
    typeIndex: number;
    shiftedTypeIndex: number;

    constructor(importName: string, redirectPath: string) {
        super();
        this.fullRedirectNath = `#${importName}#${redirectPath}`;
        this.typeIndex = this.getIndexFromTypeArrayBuffer(this);
        this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let ImpTypeBuf = new LiteralBuffer();
        let ImpTypeLiterals: Array<Literal> = new Array<Literal>();
        ImpTypeLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.EXTERNAL));
        ImpTypeLiterals.push(new Literal(LiteralTag.STRING, this.fullRedirectNath));
        ImpTypeBuf.addLiterals(...ImpTypeLiterals);
        return ImpTypeBuf;
    }
}

export class UnionType extends BaseType {
    unionedTypeArray: Array<number> = [];
    typeIndex: number = PrimitiveType.ANY;
    shiftedTypeIndex: number = PrimitiveType.ANY;

    constructor(typeNode: ts.Node) {
        super();
        this.setOrReadFromArrayRecord(typeNode);
    }

    setOrReadFromArrayRecord(typeNode: ts.Node) {
        let unionStr = typeNode.getText();
        if (this.hasUnionTypeMapping(unionStr)) {
            this.shiftedTypeIndex = this.getFromUnionTypeMap(unionStr)!;
            return;
        }
        this.typeIndex = this.getIndexFromTypeArrayBuffer(new PlaceHolderType());
        this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
        this.fillInUnionArray(typeNode, this.unionedTypeArray);
        this.setUnionTypeMap(unionStr, this.shiftedTypeIndex);
        this.setTypeArrayBuffer(this, this.typeIndex);
    }

    hasUnionTypeMapping(unionStr: string) {
        return this.typeRecorder.hasUnionTypeMapping(unionStr);
    }

    getFromUnionTypeMap(unionStr: string) {
        return this.typeRecorder.getFromUnionTypeMap(unionStr);
    }

    setUnionTypeMap(unionStr: string, shiftedTypeIndex: number) {
        return this.typeRecorder.setUnionTypeMap(unionStr, shiftedTypeIndex);
    }

    fillInUnionArray(typeNode: ts.Node, unionedTypeArray: Array<number>) {
        for (let element of (<ts.UnionType><any>typeNode).types) {
            let elementNode = <ts.TypeNode><any>element;
            let typeIndex = this.getOrCreateRecordForTypeNode(elementNode, elementNode);
            unionedTypeArray.push(typeIndex!);
        }
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let UnionTypeBuf = new LiteralBuffer();
        let UnionTypeLiterals: Array<Literal> = new Array<Literal>();
        UnionTypeLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.UNION));
        UnionTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.unionedTypeArray.length));
        for (let type of this.unionedTypeArray) {
            this.transferType2Literal(type, UnionTypeLiterals);
        }
        UnionTypeBuf.addLiterals(...UnionTypeLiterals);
        return UnionTypeBuf;
    }
}

export class ArrayType extends BaseType {
    referedTypeIndex: number = PrimitiveType.ANY;
    typeIndex: number = PrimitiveType.ANY;
    shiftedTypeIndex: number = PrimitiveType.ANY;
    constructor(typeNode: ts.Node) {
        super();
        let elementNode = (<ts.ArrayTypeNode><any>typeNode).elementType;
        this.referedTypeIndex = this.getOrCreateRecordForTypeNode(elementNode, elementNode);
        this.setOrReadFromArrayRecord();
    }

    setOrReadFromArrayRecord() {
        if (this.hasArrayTypeMapping(this.referedTypeIndex)) {
            this.shiftedTypeIndex = this.getFromArrayTypeMap(this.referedTypeIndex)!;
        } else {
            this.typeIndex = this.getIndexFromTypeArrayBuffer(this);
            this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
            this.setTypeArrayBuffer(this, this.typeIndex);
            this.setArrayTypeMap(this.referedTypeIndex, this.shiftedTypeIndex);
        }
    }

    hasArrayTypeMapping(referedTypeIndex: number) {
        return this.typeRecorder.hasArrayTypeMapping(referedTypeIndex);
    }

    getFromArrayTypeMap(referedTypeIndex: number) {
        return this.typeRecorder.getFromArrayTypeMap(referedTypeIndex);
    }

    setArrayTypeMap(referedTypeIndex: number, shiftedTypeIndex: number) {
        return this.typeRecorder.setArrayTypeMap(referedTypeIndex, shiftedTypeIndex);
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let arrayBuf = new LiteralBuffer();
        let arrayLiterals: Array<Literal> = new Array<Literal>();
        arrayLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.ARRAY));
        this.transferType2Literal(this.referedTypeIndex, arrayLiterals);
        arrayBuf.addLiterals(...arrayLiterals);
        return arrayBuf;
    }
}

export class ObjectType extends BaseType {
    private properties: Map<string, number> = new Map<string, number>();
    typeIndex: number = PrimitiveType.ANY;
    shiftedTypeIndex: number = PrimitiveType.ANY;

    constructor(objNode: ts.TypeLiteralNode) {
        super();
        this.typeIndex = this.getIndexFromTypeArrayBuffer(new PlaceHolderType());
        this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
        this.fillInMembers(objNode);
        this.setTypeArrayBuffer(this, this.typeIndex);
    }

    fillInMembers(objNode: ts.TypeLiteralNode) {
        for (let member of objNode.members) {
            let propertySig = <ts.PropertySignature>member;
            let name = member.name ? member.name.getText() : "#undefined";
            let typeIndex = this.getOrCreateRecordForTypeNode(propertySig.type, member.name);
            this.properties.set(name, typeIndex);
        }
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let objTypeBuf = new LiteralBuffer();
        let objLiterals: Array<Literal> = new Array<Literal>();
        objLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.OBJECT));
        objLiterals.push(new Literal(LiteralTag.INTEGER, this.properties.size));
        this.properties.forEach((typeIndex, name) => {
            objLiterals.push(new Literal(LiteralTag.STRING, name));
            this.transferType2Literal(typeIndex, objLiterals);
        });
        objTypeBuf.addLiterals(...objLiterals);
        return objTypeBuf;
    }
}

export class InterfaceType extends BaseType {
    heritages: Array<number> = new Array<number>();
    // fileds Array: [typeIndex] [public -> 0, private -> 1, protected -> 2] [readonly -> 1]
    fields: Map<string, Array<number>> = new Map<string, Array<number>>();
    methods: Array<number> = new Array<number>();
    typeIndex: number;
    shiftedTypeIndex: number;

    constructor(interfaceNode: ts.InterfaceDeclaration) {
        super();
        this.typeIndex = this.getIndexFromTypeArrayBuffer(new PlaceHolderType());
        this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
        // record type before its initialization, so its index can be recorded
        // in case there's recursive reference of this type
        this.addCurrentType(interfaceNode, this.shiftedTypeIndex);
        this.fillInHeritages(interfaceNode);
        this.fillInFieldsAndMethods(interfaceNode);
        this.setTypeArrayBuffer(this, this.typeIndex);
    }

    private fillInHeritages(node: ts.InterfaceDeclaration) {
        if (node.heritageClauses) {
            for (let heritage of node.heritageClauses) {
                for (let heritageType of heritage.types) {
                    let heritageIdentifier = <ts.Identifier>heritageType.expression;
                    let heritageTypeIndex = this.getOrCreateRecordForDeclNode(heritageIdentifier, heritageIdentifier);
                    this.heritages.push(heritageTypeIndex);
                }
            }
        }
    }

    private fillInFields(member: ts.PropertySignature) {
        let fieldName = jshelpers.getTextOfIdentifierOrLiteral(member.name);
        let fieldInfo = Array<number>(PrimitiveType.ANY, AccessFlag.PUBLIC, ModifierReadonly.NONREADONLY);
        if (member.modifiers) {
            for (let modifier of member.modifiers) {
                switch (modifier.kind) {
                    case ts.SyntaxKind.PrivateKeyword: {
                        fieldInfo[1] = AccessFlag.PRIVATE;
                        break;
                    }
                    case ts.SyntaxKind.ProtectedKeyword: {
                        fieldInfo[1] = AccessFlag.PROTECTED;
                        break;
                    }
                    case ts.SyntaxKind.ReadonlyKeyword: {
                        fieldInfo[2] = ModifierReadonly.READONLY;
                        break;
                    }
                    default:
                        break;
                }
            }
        }
        let typeNode = member.type;
        let memberName = member.name;
        fieldInfo[0] = this.getOrCreateRecordForTypeNode(typeNode, memberName);
        this.fields.set(fieldName, fieldInfo);
    }

    private fillInMethods(member: ts.MethodSignature) {
        /**
         * a method like declaration in a new class must be a new type,
         * create this type and add it into typeRecorder if it's not from tsc's library
         */
        if (this.typeChecker.isFromDefaultLib(member)) {
            return;
        }
        let variableNode = member.name ? member.name : undefined;
        let funcType = new FunctionType(<ts.MethodSignature>member);
        if (variableNode) {
            this.setVariable2Type(variableNode, funcType.shiftedTypeIndex);
        }
        // Then, get the typeIndex and fill in the methods array
        let typeIndex = this.tryGetTypeIndex(member);
        this.methods.push(typeIndex!);
    }

    private fillInFieldsAndMethods(node: ts.InterfaceDeclaration) {
        if (node.members) {
            for (let member of node.members) {
                switch (member.kind) {
                    case ts.SyntaxKind.MethodSignature: {
                        this.fillInMethods(<ts.MethodSignature>member);
                        break;
                    }
                    case ts.SyntaxKind.PropertySignature: {
                        this.fillInFields(<ts.PropertySignature>member);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }

    transfer2LiteralBuffer() {
        let interfaceTypeBuf = new LiteralBuffer();
        let interfaceTypeLiterals: Array<Literal> = new Array<Literal>();
        // the first element is to determine the L2 type
        interfaceTypeLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.INTERFACE));

        interfaceTypeLiterals.push(new Literal(LiteralTag.INTEGER, this.heritages.length));
        this.heritages.forEach(heritage => {
            this.transferType2Literal(heritage, interfaceTypeLiterals)
        });

        // record fields and methods
        this.transferFields2Literal(interfaceTypeLiterals);
        this.transferMethods2Literal(interfaceTypeLiterals);

        interfaceTypeBuf.addLiterals(...interfaceTypeLiterals);
        return interfaceTypeBuf;
    }

    private transferFields2Literal(interfaceTypeLiterals: Array<Literal>) {
        let transferredTarget: Map<string, Array<number>> = this.fields;

        interfaceTypeLiterals.push(new Literal(LiteralTag.INTEGER, transferredTarget.size));
        transferredTarget.forEach((typeInfo, name) => {
            interfaceTypeLiterals.push(new Literal(LiteralTag.STRING, name));
            this.transferType2Literal(typeInfo[0], interfaceTypeLiterals);
            interfaceTypeLiterals.push(new Literal(LiteralTag.INTEGER, typeInfo[1])); // accessFlag
            interfaceTypeLiterals.push(new Literal(LiteralTag.INTEGER, typeInfo[2])); // readonly
        });
    }

    private transferMethods2Literal(interfaceTypeLiterals: Array<Literal>) {
        let transferredTarget: Array<number> = this.methods;

        interfaceTypeLiterals.push(new Literal(LiteralTag.INTEGER, transferredTarget.length));
        transferredTarget.forEach(method => {
            this.transferType2Literal(method, interfaceTypeLiterals);
        });
    }
}

export class BuiltinContainerType extends BaseType {
    containerArray: Array<number> = [];
    builtinTypeIndex: number;
    typeIndex: number = PrimitiveType.ANY;
    shiftedTypeIndex: number = PrimitiveType.ANY;

    constructor(builtinContainerSignature: object) {
        super();
        this.builtinTypeIndex = builtinContainerSignature['typeIndex'];
        this.containerArray = builtinContainerSignature['typeArgIdxs'];
        this.typeIndex = this.getIndexFromTypeArrayBuffer(this);
        this.shiftedTypeIndex = this.typeIndex + literalBufferIndexShift;
        this.setBuiltinContainer2InstanceMap(builtinContainerSignature, this.shiftedTypeIndex);
    }

    setBuiltinContainer2InstanceMap(builtinContainerSignature: object, index: number) {
        return this.typeRecorder.setBuiltinContainer2InstanceMap(builtinContainerSignature, index);
    }

    transfer2LiteralBuffer(): LiteralBuffer {
        let BuiltinContainerBuf = new LiteralBuffer();
        let BuiltinContainerLiterals: Array<Literal> = new Array<Literal>();
        BuiltinContainerLiterals.push(new Literal(LiteralTag.INTEGER, L2Type.BUILTINCONTAINER));
        this.transferType2Literal(this.builtinTypeIndex, BuiltinContainerLiterals);
        BuiltinContainerLiterals.push(new Literal(LiteralTag.INTEGER, this.containerArray.length));
        for (let type of this.containerArray) {
            BuiltinContainerLiterals.push(new Literal(LiteralTag.INTEGER, type));
        }
        BuiltinContainerBuf.addLiterals(...BuiltinContainerLiterals);
        return BuiltinContainerBuf;
    }
}
