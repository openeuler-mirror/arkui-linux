/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

/**
 * The compiler implementation.
 * The compiler traverses TypeScript's AST, splits operations into sinmple ones
 * and asks Pandagen to generate bytecode.
 *
 * This file should not contain import from irnodes.ts.
 * The interface of PandaGen should be enough.
 */

import * as ts from "typescript";
import { AssignmentOperator } from "typescript";
import * as astutils from "./astutils";
import { LReference } from "./base/lreference";
import {
    hasExportKeywordModifier,
    isBindingPattern,
} from "./base/util";
import { CacheList, getVregisterCache } from "./base/vregisterCache";
import { CmdOptions } from "./cmdOptions";
import { CompilerDriver } from "./compilerDriver";
import { DebugInfo, NodeKind } from "./debuginfo";
import { DiagnosticCode, DiagnosticError } from "./diagnostic";
import { compileArrayLiteralExpression } from "./expression/arrayLiteralExpression";
import { compileBigIntLiteral } from "./expression/bigIntLiteral";
import {
    compileCallExpression,
    getHiddenParameters
} from "./expression/callExpression";
import {
    compileMemberAccessExpression,
    getObjAndProp
} from "./expression/memberAccessExpression";
import { compileMetaProperty } from "./expression/metaProperty";
import { compileNewExpression } from "./expression/newExpression";
import { compileNumericLiteral } from "./expression/numericLiteral";
import { compileObjectLiteralExpression } from "./expression/objectLiteralExpression";
import {
    findInnerExprOfParenthesis,
    findOuterNodeOfParenthesis
} from "./expression/parenthesizedExpression";
import { compileRegularExpressionLiteral } from "./expression/regularExpression";
import { compileStringLiteral } from "./expression/stringLiteral";
import { getTemplateObject } from "./expression/templateExpression";
import { compileYieldExpression } from "./expression/yieldExpression";
import { AsyncFunctionBuilder } from "./function/asyncFunctionBuilder";
import { AsyncGeneratorFunctionBuilder } from "./function/asyncGeneratorFunctionBuilder";
import { FunctionBuilder } from "./function/functionBuilder";
import { GeneratorFunctionBuilder } from "./function/generatorFunctionBuilder";

import {
    hoistFunctionInBlock
} from "./hoisting";
import {
    Label,
    VReg
} from "./irnodes";
import * as jshelpers from "./jshelpers";
import { LOGD } from "./log";
import {
    PandaGen
} from "./pandagen";
import { Recorder } from "./recorder";
import {
    FunctionScope,
    GlobalScope,
    LoopScope,
    ModuleScope,
    Scope,
    VariableScope
} from "./scope";
import {
    checkValidUseSuperBeforeSuper,
    compileClassDeclaration,
    compileDefaultConstructor,
    compileDefaultInitClassMembers,
    compileReturnThis4Ctor,
    extractCtorOfClass
} from "./statement/classStatement";
import { compileForOfStatement } from "./statement/forOfStatement";
import { LabelTarget } from "./statement/labelTarget";
import {
    compileDoStatement,
    compileForInStatement,
    compileForStatement,
    compileWhileStatement
} from "./statement/loopStatement";
import { compileReturnStatement } from "./statement/returnStatement";
import { compileSwitchStatement } from "./statement/switchStatement";
import {
    CatchTable,
    LabelPair,
    transformTryCatchFinally,
    TryBuilder,
    TryBuilderBase,
    TryStatement
} from "./statement/tryStatement";
import { isStrictMode } from "./strictMode";
import { isAssignmentOperator } from "./syntaxCheckHelper";
import {
    GlobalVariable,
    LocalVariable,
    MandatoryArguments,
    MandatoryFuncObj,
    MandatoryNewTarget,
    MandatoryThis,
    ModuleVariable,
    VarDeclarationKind,
    Variable
} from "./variable";
import {
    compileCommaListExpression
} from "./expression/compileCommaListExpression"

export enum ControlFlowChange { Continue, Break }
export class Compiler {
    private debugTag = "compiler";
    private rootNode: ts.SourceFile | ts.FunctionLikeDeclaration;
    private pandaGen: PandaGen;
    private scope: Scope;
    private compilerDriver: CompilerDriver;
    private funcBuilder: FunctionBuilder;
    private recorder: Recorder;
    private envUnion: Array<VReg> = new Array<VReg>();

    constructor(node: ts.SourceFile | ts.FunctionLikeDeclaration, pandaGen: PandaGen, compilerDriver: CompilerDriver, recorder: Recorder) {
        this.rootNode = node;
        this.pandaGen = pandaGen;
        this.compilerDriver = compilerDriver;
        this.recorder = recorder;
        this.funcBuilder = new FunctionBuilder(pandaGen);

        // At the beginning of function compile, alloc pandagen.local for 4funcObj/newTarget/this/parameters, because of
        // maybe no one used this parameter, will get undefined for RA
        this.scope = this.pandaGen.getScope()!;
        let parameters = (<VariableScope>this.scope).getParameters();

        for (let i = 0; i < parameters.length; ++i) {
            this.pandaGen.getVregForVariable(parameters[i]);
        }

        // spare v3 to save the currrent lexcial env
        getVregisterCache(this.pandaGen, CacheList.LexEnv);

        this.pandaGen.loadAccFromArgs(this.rootNode);
    }

    compile() {
        this.storeFuncObj2LexEnvIfNeeded();
        this.compileLexicalBindingForArrowFunction();

        if (this.rootNode.kind == ts.SyntaxKind.SourceFile) {
            this.compileSourceFileOrBlock(<ts.SourceFile>this.rootNode);
        } else {
            this.compileFunctionLikeDeclaration(<ts.FunctionLikeDeclaration>this.rootNode);
        }
    }

    pushEnv(env: VReg) {
        this.envUnion.push(env);
    }

    popEnv() {
        this.envUnion.pop();
    }

    getCurrentEnv() {
        return this.envUnion[this.envUnion.length - 1];
    }

    private storeFuncObj2LexEnvIfNeeded() {
        let rootNode = this.rootNode;
        if (!ts.isFunctionExpression(rootNode) && !ts.isMethodDeclaration(rootNode)) {
            return;
        }
        let functionScope = this.recorder.getScopeOfNode(rootNode);
        if ((<ts.FunctionLikeDeclaration>rootNode).name) {
            let funcName = jshelpers.getTextOfIdentifierOrLiteral((<ts.FunctionLikeDeclaration>rootNode).name);
            let v = functionScope.find(funcName);
            if (v.scope == functionScope) {
                this.pandaGen.loadAccumulator(NodeKind.FirstNodeOfFunction,
                                              getVregisterCache(this.pandaGen, CacheList.FUNC));
                this.pandaGen.storeAccToLexEnv(NodeKind.FirstNodeOfFunction, v.scope, v.level, v.v, true);
            }
        }
    }

    private compileLexicalBindingForArrowFunction() {
        let rootNode = this.rootNode;
        if (ts.isArrowFunction(rootNode)) {
            return;
        }

        this.storeMandatoryArgToLexEnv(MandatoryFuncObj);
        this.storeMandatoryArgToLexEnv(MandatoryNewTarget);
        this.storeMandatoryArgToLexEnv(MandatoryThis);

        let rootScope: VariableScope = <VariableScope>this.recorder.getScopeOfNode(rootNode);
        if (rootScope.getUseArgs()) {
            this.storeMandatoryArgToLexEnv(MandatoryArguments);
        }
    }

    private storeMandatoryArgToLexEnv(arg: string) {
        let v = this.scope.findLocal(arg);
        if (!v) {
            throw new Error("Mandatory Arguments should be found locally");
        }
        if (!v.lexical()) {
            return;
        }

        let vreg = arg == MandatoryFuncObj ? getVregisterCache(this.pandaGen, CacheList.FUNC) :
                                       this.pandaGen.getVregForVariable(v);
        this.pandaGen.storeLexicalVar(this.rootNode, 0, v.lexIndex(), vreg);
    }

    private compileSourceFileOrBlock(body: ts.SourceFile | ts.Block) {
        let statements = body.statements;
        let unreachableFlag = false;

        if (body.parent && ts.isConstructorDeclaration(body.parent)) {
            compileDefaultInitClassMembers(this, body.parent)
        }

        statements.forEach((stmt) => {
            this.compileStatement(stmt);
            if (stmt.kind == ts.SyntaxKind.ReturnStatement) {
                unreachableFlag = true;
            }
        });

        if (body.parent && ts.isConstructorDeclaration(body.parent)) {
            compileReturnThis4Ctor(this, body.parent, unreachableFlag);
            return;
        }
        if (unreachableFlag) {
            return ;
        }
        // exit GlobalScopefunction or Function Block return
        this.funcBuilder.implicitReturn(NodeKind.Invalid);
    }

    private compileFunctionBody(kind: number, body: ts.ConciseBody): void {
        let pandaGen = this.pandaGen;

        if (body.kind == ts.SyntaxKind.Block) {
            this.pushScope(body);
            this.compileSourceFileOrBlock(<ts.Block>body);
            this.popScope();
        } else if (kind == ts.SyntaxKind.ArrowFunction) {
            this.compileExpression(<ts.Expression>body);

            let retValue = pandaGen.getTemp();
            pandaGen.storeAccumulator(body, retValue);

            if (this.funcBuilder instanceof AsyncFunctionBuilder || this.funcBuilder instanceof AsyncGeneratorFunctionBuilder) {
                this.funcBuilder.resolve(body, retValue);
                pandaGen.return(NodeKind.Invalid);
            } else {
                pandaGen.loadAccumulator(body, retValue);
            }
            pandaGen.freeTemps(retValue);
            pandaGen.return(NodeKind.Invalid);
        } else {
            throw new Error("Node " + this.getNodeName(body) + " is unimplemented as a function body");
        }
    }

    private compileFunctionParameterDeclaration(decl: ts.FunctionLikeDeclaration): void {
        let pandaGen = this.pandaGen;

        for (let index = 0; index < decl.parameters.length; ++index) {
            let param = decl.parameters[index];
            let parameter = param.name;
            let paramRef = LReference.generateLReference(this, parameter, true);

            let variable: Variable;
            if (ts.isIdentifier(parameter)) {
                variable = <Variable>paramRef.variable!.v;
            } else if (isBindingPattern(parameter)) {
                let paramName = index.toString() + "pattern";
                variable = <Variable>this.scope.find(paramName).v;
            }

            let paramReg = pandaGen.getVregForVariable(variable!);
            if (param.dotDotDotToken) {
                let scope = this.pandaGen.getScope();
                if (scope instanceof FunctionScope) {
                    scope.setArgumentsOrRestargs();
                }
                pandaGen.copyRestArgs(param, index);
                pandaGen.storeAccumulator(param, paramReg);
            }

            if (param.initializer) {
                let endLabel = new Label();

                pandaGen.loadAccumulator(decl, paramReg);
                pandaGen.condition(
                    decl,
                    ts.SyntaxKind.EqualsEqualsEqualsToken,
                    getVregisterCache(pandaGen, CacheList.undefined),
                    endLabel);
                this.compileExpression(param.initializer);
                pandaGen.storeAccumulator(param, paramReg);
                pandaGen.label(decl, endLabel);
            }

            if (isBindingPattern(parameter) ||
                (ts.isIdentifier(parameter) && (variable!.isLexVar))) {
                pandaGen.loadAccumulator(param, paramReg);
                paramRef.setValue();
            }
        }
    }

    private createFuncBuilder(decl: ts.FunctionLikeDeclaration): FunctionBuilder {
        let pandaGen = this.pandaGen;

        if (decl.modifiers) {
            for (let i = 0; i < decl.modifiers.length; i++) {
                if (decl.modifiers[i].kind == ts.SyntaxKind.AsyncKeyword) {
                    // async generator
                    if (decl.asteriskToken) {
                        return new AsyncGeneratorFunctionBuilder(pandaGen, this);
                    } else { // async
                        return new AsyncFunctionBuilder(pandaGen);
                    }
                }
            }
        }

        if (decl.asteriskToken) {
            return new GeneratorFunctionBuilder(pandaGen, this);
        }

        return new FunctionBuilder(pandaGen);
    }

    private compileFunctionLikeDeclaration(decl: ts.FunctionLikeDeclaration): void {
        let pandaGen = this.pandaGen;
        this.compileFunctionParameterDeclaration(decl);

        if (ts.isConstructorDeclaration(decl)) {
            let classNode = <ts.ClassLikeDeclaration>decl.parent;
            if (jshelpers.getClassExtendsHeritageElement(classNode) && !extractCtorOfClass(classNode)) {
                compileDefaultConstructor(this, decl);
                return;
            }
        }

        if (decl.kind == ts.SyntaxKind.FunctionExpression) {
            if (decl.name) {
                let funcName = jshelpers.getTextOfIdentifierOrLiteral(decl.name);
                (<VariableScope>pandaGen.getScope()!).addFuncName(funcName);
            }
        }

        this.funcBuilder = this.createFuncBuilder(decl);
        this.funcBuilder.prepare(decl);
        if (decl.body) {
            this.compileFunctionBody(decl.kind, decl.body);
        }

        this.funcBuilder.cleanUp(decl);
    }


    compileStatement(stmt: ts.Statement) {
        // for debug info
        this.pandaGen.setFirstStmt(stmt);

        // Please keep order of cases the same as in types.ts
        LOGD(this.debugTag, "compile statement: " + this.getNodeName(stmt));
        switch (stmt.kind) {
            case ts.SyntaxKind.Block: // line 273
                this.compileBlock(<ts.Block>stmt);
                break;
            case ts.SyntaxKind.EmptyStatement: // line 274
                break;
            case ts.SyntaxKind.VariableStatement: // line 275
                this.compileVariableStatement(<ts.VariableStatement>stmt);
                break;
            case ts.SyntaxKind.ExpressionStatement: // line 276
                this.compileExpression((<ts.ExpressionStatement>stmt).expression);
                break;
            case ts.SyntaxKind.IfStatement: // line 277
                this.compileIfStatement(<ts.IfStatement>stmt);
                break;
            case ts.SyntaxKind.DoStatement: // line 278
                compileDoStatement(<ts.DoStatement>stmt, this);
                break;
            case ts.SyntaxKind.WhileStatement: // line 279
                compileWhileStatement(<ts.WhileStatement>stmt, this);
                break;
            case ts.SyntaxKind.ForStatement: // line 280
                compileForStatement(<ts.ForStatement>stmt, this);
                break;
            case ts.SyntaxKind.ForInStatement: //line 281
                compileForInStatement(<ts.ForInStatement>stmt, this);
                break;
            case ts.SyntaxKind.ForOfStatement: //line 282
                compileForOfStatement(<ts.ForOfStatement>stmt, this);
                break;
            case ts.SyntaxKind.ContinueStatement: // line 283
                this.compileContinueStatement(<ts.ContinueStatement>stmt);
                break;
            case ts.SyntaxKind.BreakStatement: // line 284
                this.compileBreakStatement(<ts.BreakStatement>stmt);
                break;
            case ts.SyntaxKind.ReturnStatement: // line 285
                compileReturnStatement(<ts.ReturnStatement>stmt, this);
                break;
            case ts.SyntaxKind.SwitchStatement: // line 287
                compileSwitchStatement(<ts.SwitchStatement>stmt, this);
                break;
            case ts.SyntaxKind.LabeledStatement:  // line 288
                this.compileLabeledStatement(<ts.LabeledStatement>stmt);
                break;
            case ts.SyntaxKind.ThrowStatement: // line 289
                this.compileThrowStatement(<ts.ThrowStatement>stmt);
                break;
            case ts.SyntaxKind.TryStatement: // line 290
                this.compileTryStatement(<ts.TryStatement>stmt);
                break;
            case ts.SyntaxKind.DebuggerStatement: // line 291
                this.pandaGen.debugger(stmt);
                break;
            case ts.SyntaxKind.FunctionDeclaration: // line 294
                this.compileFunctionDeclaration(<ts.FunctionDeclaration>stmt);
                break;
            case ts.SyntaxKind.ClassDeclaration:
                compileClassDeclaration(this, <ts.ClassLikeDeclaration>stmt);
            case ts.SyntaxKind.ImportDeclaration:
                break;
            case ts.SyntaxKind.ExportAssignment:
                this.compileExportAssignment(<ts.ExportAssignment>stmt);
                break;
            case ts.SyntaxKind.ExportDeclaration:
            case ts.SyntaxKind.NotEmittedStatement:
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.EndOfDeclarationMarker:
            case ts.SyntaxKind.ModuleDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.MergeDeclarationMarker:
                break;
            default:
                throw new Error("Statement " + this.getNodeName(stmt) + " is unimplemented");
        }
    }

    private compileBlock(block: ts.Block) {
        this.pushScope(block);
        hoistFunctionInBlock(this.scope, this.pandaGen, isStrictMode(block), this);

        block.statements.forEach((stmt) => this.compileStatement(stmt));

        this.popScope();
    }

    private compileVariableStatement(stmt: ts.VariableStatement) {
        let declList = stmt.declarationList;
        declList.declarations.forEach((decl) => {
            this.compileVariableDeclaration(decl)
        });
    }

    compileVariableDeclaration(decl: ts.VariableDeclaration) {
        let lref = LReference.generateLReference(this, decl.name, true);
        if (decl.initializer) {
            this.compileExpression(decl.initializer);
        } else {
            // global var without init should not be assigned undefined twice
            if (astutils.getVarDeclarationKind(decl) == VarDeclarationKind.VAR) {
                return;
            }

            if ((astutils.getVarDeclarationKind(decl) == VarDeclarationKind.LET)
                && decl.parent.kind != ts.SyntaxKind.CatchClause) {
                this.pandaGen.loadAccumulator(decl, getVregisterCache(this.pandaGen, CacheList.undefined));
            }
        }
        lref.setValue();
    }

    private compileIfStatement(stmt: ts.IfStatement) {
        this.pushScope(stmt);
        let ifElseLabel = new Label();
        let ifEndLabel = new Label();

        this.compileCondition(stmt.expression, stmt.elseStatement ? ifElseLabel : ifEndLabel);
        this.compileStatement(stmt.thenStatement);
        if (stmt.elseStatement) {
            this.pandaGen.branch(DebugInfo.getLastNode(), ifEndLabel);
            this.pandaGen.label(stmt, ifElseLabel);
            this.compileStatement(stmt.elseStatement);
        }
        this.pandaGen.label(stmt, ifEndLabel);
        this.popScope();
    }

    private popLoopEnv(node: ts.Node, times: number) {
        while(times--) {
            this.pandaGen.popLexicalEnv(node);
        }
    }

    private popLoopEnvWhenContinueOrBreak(labelTarget: LabelTarget, isContinue: boolean) {
        let node: ts.Node = labelTarget.getCorrespondingNode();
        let loopEnvLevel = labelTarget.getLoopEnvLevel();
        switch (node.kind) {
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.ForStatement: {
                this.popLoopEnv(node, loopEnvLevel - 1);
                break;
            }
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement: {
                let popTimes = isContinue ? loopEnvLevel : loopEnvLevel - 1;
                this.popLoopEnv(node, popTimes);
                break;
            }
            case ts.SyntaxKind.SwitchStatement: {
                if (!isContinue) {
                    return;
                }
                this.popLoopEnv(node, loopEnvLevel);
                break;
            }
            /**
             * BlockStatement could also have break labelTarget which changes the control flow
             * out of their inner env loop. We should pop Loop env with such cases either.
             */
            default: {
                this.popLoopEnv(node, loopEnvLevel);
            }
        }
    }

    private compileContinueStatement(stmt: ts.ContinueStatement) {
        let continueLabelTarget = LabelTarget.getLabelTarget(stmt);

        this.compileFinallyBeforeCFC(
            continueLabelTarget.getTryStatement(),
            ControlFlowChange.Continue,
            continueLabelTarget.getContinueTargetLabel()!
        );

        // before jmp out of loops, pop the loops env
        if (continueLabelTarget.getLoopEnvLevel()) {
            this.popLoopEnvWhenContinueOrBreak(continueLabelTarget, true);
        }

        this.pandaGen.branch(stmt, continueLabelTarget.getContinueTargetLabel()!);
    }

    private compileBreakStatement(stmt: ts.BreakStatement) {
        let breakLabelTarget = LabelTarget.getLabelTarget(stmt);

        this.compileFinallyBeforeCFC(
            breakLabelTarget.getTryStatement(),
            ControlFlowChange.Break,
            undefined
        );

        // before jmp out of loops, pop the loops env
        if (breakLabelTarget.getLoopEnvLevel()) {
            this.popLoopEnvWhenContinueOrBreak(breakLabelTarget, false);
        }

        this.pandaGen.branch(stmt, breakLabelTarget.getBreakTargetLabel());
    }

    private compileLabeledStatement(stmt: ts.LabeledStatement) {
        this.pushScope(stmt);
        let labelName: string = jshelpers.getTextOfIdentifierOrLiteral(stmt.label);
        let blockEndLabel = undefined;

        // because there is no label in the block/if statement, we need to add the end label.
        if (stmt.statement.kind == ts.SyntaxKind.Block || stmt.statement.kind == ts.SyntaxKind.IfStatement) {
            blockEndLabel = new Label();

            let labelTarget = new LabelTarget(stmt, blockEndLabel, undefined);

            LabelTarget.updateName2LabelTarget(stmt, labelTarget);
        }

        this.compileStatement(stmt.statement);

        if (blockEndLabel) {
            this.pandaGen.label(stmt, blockEndLabel);
        }

        // because the scope of the label is just in labeled statement, we need to delete it.
        LabelTarget.deleteName2LabelTarget(labelName);
        this.popScope();
    }

    private compileThrowStatement(stmt: ts.ThrowStatement) {
        let pandaGen = this.pandaGen;
        if (stmt.expression) {
            this.compileExpression(stmt.expression);
        } else {
            throw new DiagnosticError(stmt, DiagnosticCode.Line_break_not_permitted_here);
        }

        // before CFG, pop the loops env
        let popTimes = TryStatement.getCurrentTryStatement() ? TryStatement.getCurrentTryStatement().getLoopEnvLevel() : 0;
        this.popLoopEnv(stmt, popTimes);

        pandaGen.throw(stmt);
    }

    compileFinallyBeforeCFC(endTry: TryStatement | undefined, cfc: ControlFlowChange, continueTargetLabel: Label | undefined) {// compile finally before control flow change
        let startTry = TryStatement.getCurrentTryStatement();
        let originTry = startTry;
        let currentScope = this.scope;
        for (; startTry != endTry; startTry = startTry?.getOuterTryStatement()) {

            if (startTry && startTry.trybuilder) {
                let inlineFinallyBegin = new Label();
                let inlineFinallyEnd = new Label();
                let inlinedLabelPair = new LabelPair(inlineFinallyBegin, inlineFinallyEnd);
                // adjust the current tryStatement before inlining finallyBlock
                let saveTry = TryStatement.getCurrentTryStatement();
                TryStatement.setCurrentTryStatement(startTry.getOuterTryStatement())

                this.pandaGen.label(startTry.getStatement(), inlineFinallyBegin);
                startTry.trybuilder.compileFinalizer(cfc, continueTargetLabel);
                this.pandaGen.label(startTry.getStatement(), inlineFinallyEnd);
                // restore pandaGen.tryStatement
                TryStatement.setCurrentTryStatement(saveTry);

                /*
                 * split the catchZone in most Inner try & add the insertedZone by the finally-nearset TryZone.
                 * the inserted innerTry's FinallyBlock can only be catched by the outer's tryBlock. so here just
                 * need append the inserted finally's Zone into the outerTry's catchTable in order.
                 * OuterTryBegin      ----
                 *           <outerTry_0> |
                 *     InnerTryBegin  ----
                 *
                 *          ----    InnerTry's FinallyBegin --
                 * <outerTry_2> |                             |
                 *          ----    InnerTry's FinallyEnd   --
                 *                  return;
                 *     InnerTryEnd    ----
                 *           <outerTry_1> |
                 * OuterTryEnd        ----
                 */
                originTry.getCatchTable().splitLabelPair(inlinedLabelPair);
                if (startTry.getOuterTryStatement()) {
                    let outerLabelPairs: LabelPair[] = startTry.getOuterTryStatement().getCatchTable().getLabelPairs();
                    outerLabelPairs.splice(outerLabelPairs.length - 2, 0, inlinedLabelPair);
                }
            }
        }
        this.scope = currentScope;
    }

    constructTry(node: ts.Node, tryBuilder: TryBuilderBase, endLabel?: Label) {
        let pandaGen = this.pandaGen;
        let tryBeginLabel = new Label();
        let tryEndLabel = new Label();
        let catchBeginLabel = new Label();
        let catchEndLabel = endLabel ? endLabel : new Label();

        let catchTable = new CatchTable(
            pandaGen,
            catchBeginLabel,
            new LabelPair(tryBeginLabel, tryEndLabel));

        // TryBlock begins
        pandaGen.label(node, tryBeginLabel);
        tryBuilder.compileTryBlock(catchTable);
        pandaGen.label(node, tryEndLabel);

        // Finally after normal try
        tryBuilder.compileFinallyBlockIfExisted();
        if (ts.isForOfStatement(node)) {
            let loopScope = <LoopScope>this.getRecorder().getScopeOfNode(node);
            let needCreateLoopEnv = loopScope.need2CreateLexEnv();
            if (needCreateLoopEnv) {
                pandaGen.popLexicalEnv(node);
            }
        }
        pandaGen.branch(node, catchEndLabel);

        // exception Handler
        pandaGen.label(node, catchBeginLabel);
        tryBuilder.compileExceptionHandler();
        if (!endLabel) {
            pandaGen.label(node, catchEndLabel);
        }
    }

    private compileTryStatement(stmt: ts.TryStatement) {
        this.pushScope(stmt);
        // try-catch-finally statements must have been transformed into
        // two nested try statements with only "catch" or "finally" each.
        if (stmt.catchClause && stmt.finallyBlock) {
            stmt = transformTryCatchFinally(stmt, this.recorder);
        }

        let tryBuilder = new TryBuilder(this, this.pandaGen, stmt);
        this.constructTry(stmt, tryBuilder);
        this.popScope();
    }

    private compileFunctionDeclaration(decl: ts.FunctionDeclaration) {
        if (!decl.name) {
            if (hasExportKeywordModifier(decl) && this.scope instanceof ModuleScope) {
                return;
            }
            throw new Error("Function declaration without name is unimplemented");
        }
    }

    private compileExportAssignment(stmt: ts.ExportAssignment) {
        this.compileExpression(stmt.expression);
        let defaultV: ModuleVariable = <ModuleVariable>(this.pandaGen.getScope().findLocal("*default*"));
        this.pandaGen.storeModuleVariable(stmt, defaultV);
    }

    compileCondition(expr: ts.Expression, ifFalseLabel: Label) {
        let pandaGen = this.pandaGen;
        if (expr.kind == ts.SyntaxKind.BinaryExpression) {
            let binExpr = <ts.BinaryExpression>expr;

            switch (binExpr.operatorToken.kind) {
                case ts.SyntaxKind.LessThanToken: // line 57
                case ts.SyntaxKind.GreaterThanToken: // line 59
                case ts.SyntaxKind.LessThanEqualsToken: // line 60
                case ts.SyntaxKind.GreaterThanEqualsToken: // line 61
                case ts.SyntaxKind.EqualsEqualsToken: // line 62
                case ts.SyntaxKind.ExclamationEqualsToken: // line 63
                case ts.SyntaxKind.EqualsEqualsEqualsToken: // line 64
                case ts.SyntaxKind.ExclamationEqualsEqualsToken: { // line 65
                    // This is a special case
                    // These operators are expressed via cmp instructions and the following
                    // if-else branches. Condition also expressed via cmp instruction and
                    // the following if-else.
                    // the goal of this method is to merge these two sequences of instructions.
                    let lhs = pandaGen.getTemp();
                    this.compileExpression(binExpr.left);
                    pandaGen.storeAccumulator(binExpr, lhs);
                    this.compileExpression(binExpr.right);
                    pandaGen.condition(binExpr, binExpr.operatorToken.kind, lhs, ifFalseLabel);
                    pandaGen.freeTemps(lhs);
                    return;
                }
                case ts.SyntaxKind.AmpersandAmpersandToken: {
                    this.compileExpression(binExpr.left);
                    pandaGen.jumpIfFalse(binExpr, ifFalseLabel);
                    this.compileExpression(binExpr.right);
                    pandaGen.jumpIfFalse(binExpr, ifFalseLabel);
                    return;
                }
                case ts.SyntaxKind.BarBarToken: {
                    let endLabel = new Label();
                    this.compileExpression(binExpr.left);
                    pandaGen.jumpIfTrue(binExpr, endLabel);
                    this.compileExpression(binExpr.right);
                    pandaGen.jumpIfFalse(binExpr, ifFalseLabel);
                    pandaGen.label(binExpr, endLabel);
                    return;
                }
                default:
                    break;
            }
        }

        // General case including some binExpr i.e.(a+b)
        this.compileExpression(expr);
        pandaGen.jumpIfFalse(expr, ifFalseLabel);
    }

    compileExpression(expr: ts.Expression) {
        // Please keep order of cases the same as in types.ts
        LOGD(this.debugTag, "compile expr: " + ts.SyntaxKind[expr.kind] + " " + expr.kind);
        switch (expr.kind) {
            case ts.SyntaxKind.NumericLiteral: // line 34
                compileNumericLiteral(this.pandaGen, <ts.NumericLiteral>expr);
                break;
            case ts.SyntaxKind.BigIntLiteral: // line 35
                compileBigIntLiteral(this.pandaGen, <ts.BigIntLiteral>expr);
                break;
            case ts.SyntaxKind.StringLiteral: // line 36
                compileStringLiteral(this.pandaGen, <ts.StringLiteral>expr);
                break;
            case ts.SyntaxKind.RegularExpressionLiteral: // line 39
                compileRegularExpressionLiteral(this, <ts.RegularExpressionLiteral>expr);
                break;
            case ts.SyntaxKind.Identifier: // line 109
                this.compileIdentifier(<ts.Identifier>expr);
                break;
            case ts.SyntaxKind.TrueKeyword: // line 114
            case ts.SyntaxKind.FalseKeyword: // line 126
                this.compileBooleanLiteral(<ts.BooleanLiteral>expr);
                break;
            case ts.SyntaxKind.CallExpression: // line 243
                compileCallExpression(<ts.CallExpression>expr, this);
                break;
            case ts.SyntaxKind.NullKeyword: // line 135
                this.pandaGen.loadAccumulator(expr, getVregisterCache(this.pandaGen, CacheList.Null));
                break;
            case ts.SyntaxKind.ThisKeyword: // line 139
                this.compileThisKeyword(expr);
                break;
            case ts.SyntaxKind.MetaProperty:
                compileMetaProperty(<ts.MetaProperty>expr, this);
                break;
            case ts.SyntaxKind.ArrayLiteralExpression: // line 239
                compileArrayLiteralExpression(this, <ts.ArrayLiteralExpression>expr);
                break;
            case ts.SyntaxKind.ObjectLiteralExpression: // line 240
                compileObjectLiteralExpression(this, <ts.ObjectLiteralExpression>expr);
                break;
            case ts.SyntaxKind.PropertyAccessExpression: // line 241
            case ts.SyntaxKind.ElementAccessExpression: // line 242
                compileMemberAccessExpression(<ts.ElementAccessExpression | ts.PropertyAccessExpression>expr, this);
                break;
            case ts.SyntaxKind.NewExpression: // line 244
                compileNewExpression(<ts.NewExpression>expr, this);
                break;
            case ts.SyntaxKind.ParenthesizedExpression: // line 247
                this.compileExpression(findInnerExprOfParenthesis(<ts.ParenthesizedExpression>expr));
                break;
            case ts.SyntaxKind.FunctionExpression: // line 248
                this.compileFunctionExpression(<ts.FunctionExpression>expr);
                break;
            case ts.SyntaxKind.DeleteExpression: // line 250
                this.compileDeleteExpression(<ts.DeleteExpression>expr);
                break;
            case ts.SyntaxKind.TypeOfExpression: // line 251
                this.compileTypeOfExpression(<ts.TypeOfExpression>expr);
                break;
            case ts.SyntaxKind.VoidExpression:  // line 252
                this.compileVoidExpression(<ts.VoidExpression>expr);
                break;
            case ts.SyntaxKind.AwaitExpression:
                this.compileAwaitExpression(<ts.AwaitExpression>expr);
                break;
            case ts.SyntaxKind.PrefixUnaryExpression: // line 254
                this.compilePrefixUnaryExpression(<ts.PrefixUnaryExpression>expr);
                break;
            case ts.SyntaxKind.PostfixUnaryExpression: // line 255
                this.compilePostfixUnaryExpression(<ts.PostfixUnaryExpression>expr);
                break;
            case ts.SyntaxKind.BinaryExpression: // line 256
                this.compileBinaryExpression(<ts.BinaryExpression>expr);
                break;
            case ts.SyntaxKind.ConditionalExpression: // line 257
                this.compileConditionalExpression(<ts.ConditionalExpression>expr);
                break;
            case ts.SyntaxKind.YieldExpression: // line 259
                compileYieldExpression(this, <ts.YieldExpression>expr);
                break;
            case ts.SyntaxKind.ArrowFunction: //line 249
                this.compileArrowFunction(<ts.ArrowFunction>expr);
                break;
            case ts.SyntaxKind.TemplateExpression:
                this.compileTemplateExpression(<ts.TemplateExpression>expr);
                break;
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.FirstTemplateToken:
            case ts.SyntaxKind.LastLiteralToken:
                this.compileNoSubstitutionTemplateLiteral(<ts.NoSubstitutionTemplateLiteral>expr);
                break;
            case ts.SyntaxKind.TaggedTemplateExpression:
                this.compileTaggedTemplateExpression(<ts.TaggedTemplateExpression>expr);
                break;
            case ts.SyntaxKind.Constructor:
                break;
            case ts.SyntaxKind.PropertyDeclaration:
                break;
            case ts.SyntaxKind.ClassExpression:
                compileClassDeclaration(this, <ts.ClassLikeDeclaration>expr);
                break;
            case ts.SyntaxKind.PartiallyEmittedExpression:
                this.compileExpression((<ts.PartiallyEmittedExpression>expr).expression);
                break;
            case ts.SyntaxKind.CommaListExpression:
                compileCommaListExpression(this, <ts.CommaListExpression>expr);
                break;
            default:
                throw new Error("Expression of type " + this.getNodeName(expr) + " is unimplemented");
        }
    }

    private compileIdentifier(id: ts.Identifier) {
        let name = jshelpers.getTextOfIdentifierOrLiteral(id);
        let { scope, level, v } = this.scope.find(name);
        if (!v) {
            // the variable may appear after function call
            // any way it is a global variable.
            this.compileUnscopedIdentifier(id);
        } else {
            this.loadTarget(id, { scope, level, v });
        }
    }

    private compileUnscopedIdentifier(id: ts.Identifier) {
        let name = jshelpers.getTextOfIdentifierOrLiteral(id);
        let pandaGen = this.pandaGen;
        switch (name) {
            // Those identifier are Built-In value properties
            case "NaN":
                pandaGen.loadAccumulator(id, getVregisterCache(this.pandaGen, CacheList.NaN));
                return;
            case "Infinity":
                pandaGen.loadAccumulator(id, getVregisterCache(this.pandaGen, CacheList.Infinity));
                return;
            case "globalThis":
                pandaGen.loadAccumulator(id, getVregisterCache(this.pandaGen, CacheList.Global));
                return;
            case "undefined":
                pandaGen.loadAccumulator(id, getVregisterCache(this.pandaGen, CacheList.undefined));
                return;
            default: {
                // typeof an undeclared variable will return undefined instead of throwing reference error
                let parent = findOuterNodeOfParenthesis(id);
                if ((parent.kind == ts.SyntaxKind.TypeOfExpression)) {
                    CmdOptions.isWatchEvaluateExpressionMode() ?
                        pandaGen.loadByNameViaDebugger(id, name, CacheList.False) :
                        pandaGen.loadObjProperty(id, getVregisterCache(pandaGen, CacheList.Global), name);
                } else {
                    pandaGen.tryLoadGlobalByName(id, name);
                }
                break;
            }
        }
    }

    private compileBooleanLiteral(lit: ts.BooleanLiteral) {
        if (lit.kind == ts.SyntaxKind.TrueKeyword) {
            this.pandaGen.loadAccumulator(lit, getVregisterCache(this.pandaGen, CacheList.True));
        } else {
            this.pandaGen.loadAccumulator(lit, getVregisterCache(this.pandaGen, CacheList.False));
        }
    }

    compileFunctionReturnThis(expr: ts.NewExpression | ts.CallExpression): boolean {
        if (expr.expression.kind == ts.SyntaxKind.Identifier) {
            let identifier = <ts.Identifier>expr.expression;
            let args = expr.arguments;
            if (identifier.escapedText == "Function") {
                if (args && args.length > 0) {
                    if (!ts.isStringLiteral(args[args.length - 1])) {
                        return false;
                    }
                    let arg = <ts.StringLiteral>args[args.length - 1];
                    if (arg.text.match(/ *return +this[;]? *$/) == null) {
                        return false;
                    } else {
                        this.pandaGen.loadAccumulator(expr, getVregisterCache(this.pandaGen, CacheList.Global))
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private compileThisKeyword(node: ts.Node) {
        let pandaGen = this.pandaGen;

        checkValidUseSuperBeforeSuper(this, node);

        let { scope, level, v } = this.scope.find(MandatoryThis);

        if (!v) {
            throw new Error("\"this\" not found");
        }

        if (v instanceof LocalVariable) {
            if (CmdOptions.isWatchEvaluateExpressionMode()) {
                pandaGen.loadByNameViaDebugger(node, MandatoryThis, CacheList.True);
                return;
            }

            pandaGen.loadAccFromLexEnv(node, scope!, level, v);
            return;
        }

        throw new Error("\"this\" must be a local variable");
    }

    private compileFunctionExpression(expr: ts.FunctionExpression) {
        let internalName = this.compilerDriver.getFuncInternalName(expr, this.recorder);
        this.pandaGen.defineFunction(expr, expr, internalName);
    }

    private compileDeleteExpression(expr: ts.DeleteExpression) {
        let pandaGen = this.pandaGen;
        let objReg: VReg;
        let propReg: VReg;
        let unaryExpr = expr.expression;
        switch (unaryExpr.kind) {
            case ts.SyntaxKind.Identifier: {
                // Check if this is a known variable.
                let name = jshelpers.getTextOfIdentifierOrLiteral(<ts.Identifier>unaryExpr);
                let { scope, v } = this.scope.find(name);

                if (!v || ((scope instanceof GlobalScope) && (v instanceof GlobalVariable))) {
                    // If the variable doesn't exist or if it is global, we must generate
                    // a delete global property instruction.
                    objReg = getVregisterCache(pandaGen, CacheList.Global);
                    pandaGen.loadAccumulatorString(unaryExpr, name);
                    pandaGen.deleteObjProperty(expr, objReg);
                } else {
                    // Otherwise it is a local variable which can't be deleted and we just
                    // return false.
                    pandaGen.loadAccumulator(unaryExpr, getVregisterCache(pandaGen, CacheList.False));
                }
                break;
            }
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.ElementAccessExpression: {
                objReg = pandaGen.getTemp();
                propReg = pandaGen.getTemp();

                if (jshelpers.isSuperProperty(unaryExpr)) {
                    pandaGen.throwDeleteSuperProperty(unaryExpr);
                    pandaGen.freeTemps(objReg, propReg);
                    return;
                }

                let { prop: prop } = getObjAndProp(<ts.PropertyAccessExpression | ts.ElementAccessExpression>unaryExpr, objReg, propReg, this);
                switch (typeof prop) {
                    case "string":
                        pandaGen.loadAccumulatorString(expr, prop);
                        break;
                    case "number":
                        pandaGen.loadAccumulatorInt(expr, prop);
                        break;
                    default:
                        pandaGen.loadAccumulator(expr, prop);
                        break;
                }

                pandaGen.deleteObjProperty(expr, objReg);
                pandaGen.freeTemps(objReg, propReg);
                break;
            }
            default: {
                // compile the delete operand.
                this.compileExpression(unaryExpr);
                // Deleting any value or a result of an expression returns True.
                pandaGen.loadAccumulator(expr, getVregisterCache(pandaGen, CacheList.True));
            }
        }
    }

    private compileTypeOfExpression(expr: ts.TypeOfExpression) {
        // expr -> acc
        this.compileExpression(expr.expression);
        this.pandaGen.typeOf(expr);
    }

    private compileVoidExpression(expr: ts.VoidExpression) {
        let pandaGen = this.pandaGen;
        // compileExpression() must be called even though its value is not used
        // because it may have observable sideeffects.
        this.compileExpression(expr.expression);
        pandaGen.loadAccumulator(expr, getVregisterCache(pandaGen, CacheList.undefined));
    }

    private compileAwaitExpression(expr: ts.AwaitExpression) {
        let pandaGen = this.pandaGen;

        if (!(this.funcBuilder instanceof AsyncFunctionBuilder || this.funcBuilder instanceof AsyncGeneratorFunctionBuilder)) {
            throw new DiagnosticError(expr.parent, DiagnosticCode.await_expressions_are_only_allowed_within_async_functions_and_at_the_top_levels_of_modules);
        }

        if (expr.expression) {
            this.compileExpression(expr.expression);
            this.funcBuilder.await(expr);
        } else {
            pandaGen.loadAccumulator(expr, getVregisterCache(pandaGen, CacheList.undefined));
            this.funcBuilder.await(expr);
        }
    }

    private compilePrefixUnaryExpression(expr: ts.PrefixUnaryExpression) {
        let pandaGen = this.pandaGen;
        let operandReg = pandaGen.getTemp();
        // acc -> op(acc)
        switch (expr.operator) {
            case ts.SyntaxKind.PlusPlusToken: // line 73
            case ts.SyntaxKind.MinusMinusToken: {
                // line 74
                let lref = LReference.generateLReference(this, expr.operand, false);
                lref.getValue();
                pandaGen.storeAccumulator(expr, operandReg);
                pandaGen.unary(expr, expr.operator, operandReg);
                lref.setValue();
                break;
            }
            case ts.SyntaxKind.PlusToken: // line 67
            case ts.SyntaxKind.MinusToken: // line 68
            case ts.SyntaxKind.ExclamationToken: // line 81
            case ts.SyntaxKind.TildeToken: { // line 82
                this.compileExpression(expr.operand);
                pandaGen.storeAccumulator(expr, operandReg);
                pandaGen.unary(expr, expr.operator, operandReg);
                break;
            }
            default:
                break;
        }
        pandaGen.freeTemps(operandReg);
    }

    private compilePostfixUnaryExpression(expr: ts.PostfixUnaryExpression) {
        let pandaGen = this.pandaGen;
        let operandReg = pandaGen.getTemp();
        // expr -> acc
        let lref = LReference.generateLReference(this, expr.operand, false);
        lref.getValue();
        // operand = acc
        pandaGen.storeAccumulator(expr, operandReg);
        // acc +/- 1
        switch (expr.operator) {
            case ts.SyntaxKind.PlusPlusToken:
            case ts.SyntaxKind.MinusMinusToken:
                pandaGen.unary(expr, expr.operator, operandReg);
                break;
            default:
                break;
        }
        // lvalue var = acc +/- 1
        lref.setValue();
        // acc = operand_old
        pandaGen.toNumeric(expr, operandReg);
        pandaGen.freeTemps(operandReg);
    }

    private compileLogicalExpression(expr: ts.BinaryExpression) {
        let pandaGen = this.pandaGen;
        let lhs = pandaGen.getTemp();
        switch (expr.operatorToken.kind) {
            case ts.SyntaxKind.AmpersandAmpersandToken: { // line 83
                let leftFalseLabel = new Label();
                let endLabel = new Label();

                // left -> acc
                this.compileExpression(expr.left);
                pandaGen.storeAccumulator(expr, lhs);
                pandaGen.jumpIfFalse(expr, leftFalseLabel);

                // left is true then right -> acc
                this.compileExpression(expr.right);
                pandaGen.branch(expr, endLabel);

                // left is false then lhs -> acc
                pandaGen.label(expr, leftFalseLabel);
                pandaGen.loadAccumulator(expr, lhs);
                pandaGen.label(expr, endLabel);
                break;
            }
            case ts.SyntaxKind.BarBarToken: { // line 84
                let leftTrueLabel = new Label();
                let endLabel = new Label();

                // left -> acc
                this.compileExpression(expr.left);
                pandaGen.storeAccumulator(expr, lhs);
                pandaGen.jumpIfTrue(expr, leftTrueLabel);

                // left is false then right -> acc
                this.compileExpression(expr.right);
                pandaGen.branch(expr, endLabel);

                // left is true then lhs -> acc
                pandaGen.label(expr, leftTrueLabel);
                pandaGen.loadAccumulator(expr, lhs);
                pandaGen.label(expr, endLabel);
                break;
            }
            case ts.SyntaxKind.QuestionQuestionToken: { // line 90
                let leftNullishLabel = new Label();
                let endLabel = new Label();
                // left -> acc -> lhs
                this.compileExpression(expr.left);
                pandaGen.storeAccumulator(expr, lhs);
                // equality comparasion between lhs and null, if true, load right
                pandaGen.condition(expr, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.Null), leftNullishLabel);
                // equality comparasion between lhs and undefined, if true, load right
                pandaGen.loadAccumulator(expr.left, lhs);
                pandaGen.condition(expr, ts.SyntaxKind.ExclamationEqualsEqualsToken, getVregisterCache(pandaGen, CacheList.undefined), leftNullishLabel);
                // lhs is either null or undefined, load left
                pandaGen.loadAccumulator(expr, lhs);
                pandaGen.branch(expr, endLabel);
                pandaGen.label(expr, leftNullishLabel);
                this.compileExpression(expr.right);
                pandaGen.label(expr, endLabel);
                break;
            }
            default:
                throw new Error("BinaryExpression with operatorToken " + this.getNodeName(expr.operatorToken) + " is not Logical Operator");
        }
        pandaGen.freeTemps(lhs);
    }

    private compileBinaryExpression(expr: ts.BinaryExpression) {
        if (isAssignmentOperator(expr.operatorToken.kind)) {
            this.compileAssignmentExpression(expr.left, expr.right, <AssignmentOperator>expr.operatorToken.kind);
            return;
        }
        // LogicAnd, LogicOr and Coalesce are Short-circuiting
        if (expr.operatorToken.kind == ts.SyntaxKind.AmpersandAmpersandToken
            || expr.operatorToken.kind == ts.SyntaxKind.BarBarToken
            || expr.operatorToken.kind == ts.SyntaxKind.QuestionQuestionToken) {
            this.compileLogicalExpression(expr);
            return;
        }

        let pandaGen = this.pandaGen;
        let lhs = pandaGen.getTemp();
        this.compileExpression(expr.left);
        pandaGen.storeAccumulator(expr, lhs);
        this.compileExpression(expr.right);

        if (expr.operatorToken.kind != ts.SyntaxKind.CommaToken) {
            pandaGen.binary(expr, expr.operatorToken.kind, lhs);
        }

        pandaGen.freeTemps(lhs);
    }

    private compileConditionalExpression(expr: ts.ConditionalExpression) {
        let falseLabel = new Label();
        let endLabel = new Label();

        this.compileCondition(expr.condition, falseLabel);
        this.compileExpression(expr.whenTrue);
        this.pandaGen.branch(expr, endLabel);
        this.pandaGen.label(expr, falseLabel);
        this.compileExpression(expr.whenFalse);
        this.pandaGen.label(expr, endLabel);
    }

    private compileArrowFunction(expr: ts.ArrowFunction) {
        let internalName = this.compilerDriver.getFuncInternalName(expr, this.recorder);
        this.pandaGen.defineFunction(expr, expr, internalName);
    }

    private compileTemplateSpan(expr: ts.TemplateSpan) {
        let span = expr.expression;
        this.compileExpression(span);
        let literal = expr.literal;
        let lrh = this.pandaGen.getTemp();
        let text = literal.text;

        if (text.length != 0) {
            this.pandaGen.storeAccumulator(expr, lrh);
            this.pandaGen.loadAccumulatorString(expr, text);
            this.pandaGen.binary(expr, ts.SyntaxKind.PlusToken, lrh);
        }

        this.pandaGen.freeTemps(lrh);
    }

    private compileTemplateExpression(expr: ts.TemplateExpression) {
        let pandaGen = this.pandaGen;
        let head = expr.head;
        let spans = expr.templateSpans;

        let lrh = pandaGen.getTemp();
        pandaGen.loadAccumulatorString(expr, head.text);

        if (spans && spans.length > 0) {
            spans.forEach((spanExp: ts.TemplateSpan) => {
                pandaGen.storeAccumulator(expr, lrh);
                this.compileTemplateSpan(spanExp);
                pandaGen.binary(expr, ts.SyntaxKind.PlusToken, lrh);
            });
        }

        pandaGen.freeTemps(lrh);
    }

    private compileNoSubstitutionTemplateLiteral(expr: ts.NoSubstitutionTemplateLiteral) {
        let text = expr.text;
        this.pandaGen.loadAccumulatorString(expr, text);
    }

    private compileTaggedTemplateExpression(expr: ts.TaggedTemplateExpression) {
        let pandaGen = this.pandaGen;
        let spans = undefined;
        if (ts.isTemplateExpression(expr.template)) {
            spans = expr.template.templateSpans;
        }

        let { arguments: argRegs, passThis: passThis } = getHiddenParameters(expr.tag, this); // +3 for function and this
        getTemplateObject(pandaGen, expr);
        let templateObj = pandaGen.getTemp();
        pandaGen.storeAccumulator(expr, templateObj)
        argRegs.push(templateObj);

        if (spans && spans.length) {
            spans.forEach((spanExp: ts.TemplateSpan) => {
                let exprReg = pandaGen.getTemp();
                this.compileExpression(spanExp.expression);
                pandaGen.storeAccumulator(spanExp, exprReg);
                argRegs.push(exprReg);
            });
        }

        pandaGen.call(expr, argRegs, passThis);
        pandaGen.freeTemps(...argRegs);

        return;
    }

    private compileAssignmentExpression(lhs: ts.Expression, rhs: ts.Expression, operator: AssignmentOperator) {
        let lref = LReference.generateLReference(this, lhs, false);

        if (operator != ts.SyntaxKind.EqualsToken) {
            let lhsVreg = this.pandaGen.getTemp();

            lref.getValue();
            this.pandaGen.storeAccumulator(lhs, lhsVreg);
            this.compileExpression(rhs);
            this.pandaGen.binary(lhs.parent, operator, lhsVreg);
            this.pandaGen.freeTemps(lhsVreg);
        } else {
            this.compileExpression(rhs);
        }

        lref.setValue();
    }

    pushScope(node: ts.Node) {
        let scope = <Scope>this.recorder.getScopeOfNode(node);
        this.scope = scope;
        // for debug info
        DebugInfo.addDebugIns(scope, this.pandaGen, true);
    }

    popScope() {
        // for debug info
        DebugInfo.addDebugIns(this.scope, this.pandaGen, false);
        this.scope = <Scope>this.scope.getParent();
    }

    private getNodeName(node: ts.Node): string {
        return ts.SyntaxKind[node.kind];
    }

    getThis(node: ts.Node, res: VReg) {
        let pandaGen = this.pandaGen;
        let thisInfo = this.getCurrentScope().find(MandatoryThis);
        let level = thisInfo.level;
        let v = <Variable>thisInfo.v;

        if (v.isLexVar) {
            let slot = v.idxLex;
            pandaGen.loadLexicalVar(node, level, slot);
            pandaGen.storeAccumulator(node, res);
        } else {
            pandaGen.moveVreg(node, res, pandaGen.getVregForVariable(v));
        }
    }

    setThis(node: ts.Node) {
        let pandaGen = this.pandaGen;
        let thisInfo = this.getCurrentScope().find(MandatoryThis);

        if (thisInfo.v!.isLexVar) {
            let slot = (<Variable>thisInfo.v).idxLex;
            let value = pandaGen.getTemp();
            pandaGen.storeAccumulator(node, value);
            pandaGen.storeLexicalVar(node, thisInfo.level, slot, value);
            pandaGen.freeTemps(value);
        } else {
            pandaGen.storeAccumulator(node, pandaGen.getVregForVariable(<Variable>thisInfo.v))
        }
    }

    getPandaGen() {
        return this.pandaGen;
    }

    getCurrentScope() {
        return this.scope;
    }

    getCompilerDriver() {
        return this.compilerDriver;
    }

    getRecorder() {
        return this.recorder;
    }

    getFuncBuilder() {
        return this.funcBuilder;
    }

    storeTarget(node: ts.Node,
        variable: { scope: Scope | undefined, level: number, v: Variable | undefined },
        isDeclaration: boolean) {
        if (variable.v instanceof LocalVariable) {
            if (isDeclaration && variable.v.isLetOrConst()) {
                variable.v.initialize();
                if (variable.scope instanceof GlobalScope) {
                    if (variable.v.isLet()) {
                        this.pandaGen.stLetOrClassToGlobalRecord(node, variable.v.getName());
                    } else {
                        this.pandaGen.stConstToGlobalRecord(node, variable.v.getName());
                    }
                    return;
                }
            }

            if (variable.v.isLetOrConst() && variable.scope instanceof GlobalScope) {
                this.pandaGen.tryStoreGlobalByName(node, variable.v.getName());
                return;
            }

            this.pandaGen.storeAccToLexEnv(node, variable.scope!, variable.level, variable.v, isDeclaration);
        } else if (variable.v instanceof GlobalVariable) {
            if (variable.v.isNone() && isStrictMode(node)) {
                this.pandaGen.tryStoreGlobalByName(node, variable.v.getName());
            } else {
                this.pandaGen.storeGlobalVar(node, variable.v.getName());
            }
        } else if (variable.v instanceof ModuleVariable) {
            // import module variable is const, throw `const assignment error`
            if (!isDeclaration && variable.v.isConst()) {
                let nameReg = this.pandaGen.getTemp();
                this.pandaGen.loadAccumulatorString(node, variable.v.getName());
                this.pandaGen.storeAccumulator(node, nameReg);
                this.pandaGen.throwConstAssignment(node, nameReg);
                this.pandaGen.freeTemps(nameReg);
                return;
            }

            if (isDeclaration) {
                variable.v.initialize();
            }

            if ((variable.v.isLet() || variable.v.isClass()) && !variable.v.isInitialized()) {
                let valueReg = this.pandaGen.getTemp();
                this.pandaGen.storeAccumulator(node, valueReg);
                this.pandaGen.loadModuleVariable(node, variable.v, true);
                this.pandaGen.throwUndefinedIfHole(node, variable.v.getName());
                this.pandaGen.loadAccumulator(node, valueReg);
                this.pandaGen.freeTemps(valueReg);
            }

            this.pandaGen.storeModuleVariable(node, variable.v);
        } else {
            throw new Error("invalid lhsRef to store");
        }
    }

    loadTarget(node: ts.Node, variable: { scope: Scope | undefined, level: number, v: Variable | undefined }) {
        if (variable.v instanceof LocalVariable) {
            if (!CmdOptions.isCommonJs() && (variable.v.isLetOrConst() || variable.v.isClass())) {
                if (variable.scope instanceof GlobalScope) {
                    this.pandaGen.tryLoadGlobalByName(node, variable.v.getName());
                    return;
                }
            }

            this.pandaGen.loadAccFromLexEnv(node, variable.scope!, variable.level, (<LocalVariable>variable.v));
        } else if (variable.v instanceof GlobalVariable) {
            if (variable.v.isNone()) {
                let parent = findOuterNodeOfParenthesis(node);
                if ((parent.kind == ts.SyntaxKind.TypeOfExpression)) {
                    CmdOptions.isWatchEvaluateExpressionMode() ?
                        this.pandaGen.loadByNameViaDebugger(node, variable.v.getName(), CacheList.False) :
                        this.pandaGen.loadObjProperty(node, getVregisterCache(this.pandaGen, CacheList.Global),
                        variable.v.getName());
                } else {
                    this.pandaGen.tryLoadGlobalByName(node, variable.v.getName());
                }
            } else {
                this.pandaGen.loadGlobalVar(node, variable.v.getName());
            }
        } else if (variable.v instanceof ModuleVariable) {
            let isLocal: boolean = variable.v.isExportVar() ? true : false;
            this.pandaGen.loadModuleVariable(node, variable.v, isLocal);
            if ((variable.v.isLetOrConst() || variable.v.isClass()) && !variable.v.isInitialized()) {
                this.pandaGen.throwUndefinedIfHole(node, variable.v.getName());
            }
        } else {
            // Handle the variables from lexical scope
            throw new Error("Only local and global variables are implemented");
        }
    }
}
