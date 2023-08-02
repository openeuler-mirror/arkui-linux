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

import * as ts from "typescript";
import { CmdOptions } from "./cmdOptions";
import {
    DiagnosticCode,
    DiagnosticError
} from "./diagnostic";
import { hasExportKeywordModifier } from "./base/util";
import { findInnerExprOfParenthesis } from "./expression/parenthesizedExpression";
import * as jshelpers from "./jshelpers";
import { getContainingFunctionDeclaration, getSourceFileOfNode } from "./jshelpers";
import { LOGE } from "./log";
import { Recorder } from "./recorder";
import {
    CatchParameter,
    ClassDecl,
    ConstDecl,
    Decl,
    FuncDecl,
    FunctionScope,
    GlobalScope,
    LetDecl,
    LocalScope,
    ModuleScope,
    Scope,
    VarDecl
} from "./scope";
import { isStrictMode } from "./strictMode";
import { checkSyntaxErrorForStrictMode } from "./syntaxCheckerForStrcitMode";
import {
    allowLetAndConstDeclarations,
    isAssignmentOperator,
    isBindingPattern,
    isDeclInGlobal,
    isFunctionLikeDeclaration,
    isGlobalIdentifier,
    isOptionalParameter,
    isStatement,
    visibilityToString,
    isInBlockScope
} from "./syntaxCheckHelper";
import { MandatoryArguments } from "./variable";

//*************************************Part 1: Implement early check of declarations*******************************//
export function checkDuplicateDeclaration(recorder: Recorder) {
    let scopeMap = recorder.getScopeMap();
    scopeMap.forEach((scope, node) => {
        // implement functionParameter-related duplicate-entry check
        if (isFunctionLikeDeclaration(node)) {
            if (isStrictMode(node)) {
                checkDuplicateParameter(node, recorder);
            }

            if (node.body) {
                let bodyScope = <Scope>scopeMap.get(node.body);
                let parameterNames = getParameterNames(node, recorder);
                if (bodyScope) {
                    checkDuplicateParameterVar(parameterNames, bodyScope);
                }
            }
        }

        // implement catchParameter-related duplicate-entry check
        if ((node.kind == ts.SyntaxKind.Block) && (node.parent != undefined && node.parent.kind == ts.SyntaxKind.CatchClause)) {
            let catchScope = <Scope>scopeMap.get(node.parent);
            checkDuplicateInCatch(scope, catchScope);
        }

        let decls = scope.getDecls();
        let exportFuncMap: Map<string, boolean> = new Map<string, boolean>();
        for (let i = 0; i < decls.length; i++) {
            checkDeclareGlobalId(decls[i], scope);
            checkDuplicateEntryInScope(scope, i);
            checkDuplicateEntryAcrossScope(scope, i);
            if (ts.isFunctionDeclaration(decls[i].node) && scope instanceof ModuleScope) {
                hasDuplicateExportedFuncDecl(<FuncDecl>decls[i], exportFuncMap);
            }
        }
    })
}

function checkDuplicateEntryAcrossScope(scope: Scope, index: number) {
    let decls = scope.getDecls();
    let parentScope: Scope | undefined = scope;
    if (decls[index] instanceof VarDecl) {
        while (!(parentScope instanceof FunctionScope)) {
            parentScope = parentScope.getParent();
            if (!parentScope) {
                return;
            }

            let parentDecls = parentScope.getDecls();
            parentDecls.forEach(parentDecl => {
                if (hasDuplicateEntryAcrossScope(decls[index], parentDecl)) {
                    throwDupIdError(decls[index]);
                }
            });
        }
    }
}

function checkDuplicateEntryInScope(scope: Scope, index: number) {
    let decls = scope.getDecls();
    for (let i = index + 1; i < decls.length; i++) {
        if (hasDuplicateEntryInScope(decls[index], decls[i], scope)) {
            throwDupIdError(decls[i]);
        }
    }
}

function hasDuplicateExportedFuncDecl(decl: FuncDecl, exportFuncMap: Map<string, boolean>) {
    if (!exportFuncMap.has(decl.name)) {
        exportFuncMap.set(decl.name, hasExportKeywordModifier(decl.node));
    } else {
        if (exportFuncMap.get(decl.name) == true || hasExportKeywordModifier(decl.node)) {
            throw new DiagnosticError(decl.node, DiagnosticCode.Duplicate_identifier_0, jshelpers.getSourceFileOfNode(decl.node), [decl.name]);
        }
    }
}

function hasDuplicateEntryAcrossScope(decl1: Decl, decl2: Decl) {
    if ((decl2 instanceof LetDecl) || (decl2 instanceof ConstDecl)) {
        return decl1.name == decl2.name;
    }
}

function hasDuplicateEntryInScope(decl1: Decl, decl2: Decl, scope: Scope) {
    if (((decl1 instanceof LetDecl) || (decl1 instanceof ConstDecl) || (decl1 instanceof ClassDecl && ts.isClassDeclaration(decl1.node)) ||
        (decl2 instanceof LetDecl) || (decl2 instanceof ConstDecl) || (decl2 instanceof ClassDecl && ts.isClassDeclaration(decl1.node))) &&
        !ts.isClassExpression(decl1.node) && !ts.isClassExpression(decl2.node)) {
        return decl1.name == decl2.name;
    }
    // Var and FunctionDeclaration with same names, FunctionDeclaration and FunctionDeclaration with same names are illegal in strict mode
    // and Module
    /**
     * eg1.
     * if (true) {
     *     var a;
     *     function a() {};
     * }
     *
     * eg2.
     * if (true) {
     *     function a() {};
     *     function a() {};
     * }
     * eg3. [module]
     * var a;
     * function a(){};
     */
    if (scope instanceof LocalScope && isStrictMode(decl1.node) || scope instanceof ModuleScope) {
        if (decl1 instanceof FuncDecl || decl2 instanceof FuncDecl) {
            if (isFunctionLikeDeclaration(decl1.node.parent.parent) || isFunctionLikeDeclaration(decl2.node.parent.parent)) {
                return false;
            }
            return decl1.name == decl2.name;
        }
    }

    return false;
}

function checkDuplicateInCatch(blockScope: Scope, catchScope: Scope) {
    let bodyDecls = blockScope.getDecls();
    let catchParameters = catchScope.getDecls();

    for (let i = 0; i < catchParameters.length; i++) {
        for (let j = i + 1; j < catchParameters.length; j++) {
            if (catchParameters[i].name == catchParameters[j].name) {
                throwDupIdError(catchParameters[j]);
            }
        }

        for (let m = 0; m < bodyDecls.length; m++) {
            if (bodyDecls[m] instanceof VarDecl) {
                continue;
            }

            if (catchParameters[i].name == bodyDecls[m].name) {
                throwDupIdError(bodyDecls[m]);
            }
        }
    }
}

function getParameterNames(node: ts.FunctionLikeDeclaration, recorder: Recorder) {
    let parameters = recorder.getParametersOfFunction(node);
    let parameterNames: string[] = [];

    if (!parameters) {
        return;
    }

    parameters.forEach(funcParam => {
        parameterNames.push(funcParam.name);
    });

    return parameterNames;
}

function checkDuplicateParameter(node: ts.FunctionLikeDeclaration, recorder: Recorder) {
    let parameters = recorder.getParametersOfFunction(node);
    let tempNames: string[] = [];
    if (!parameters) {
        return;
    }
    parameters.forEach(param => {
        // @ts-ignore
        if (tempNames.includes(param.name)) {
            throwDupIdError(param);
        } else {
            tempNames.push(param.name);
        }
    });
}

function checkDuplicateParameterVar(parameterNames: string[] | undefined, scope: Scope) {
    if (!parameterNames) {
        return;
    }
    let decls = scope.getDecls();
    for (let i = 0; i < decls.length; i++) {
        if ((decls[i] instanceof VarDecl) || (decls[i] instanceof FuncDecl)) {
            continue;
        }
        let name = decls[i].name;
        // @ts-ignore
        if (parameterNames.includes(name)) {
            throwDupIdError(decls[i]);
        }
    }
}

function checkDeclareGlobalId(decl: Decl, scope: Scope) {
    if (!(scope instanceof GlobalScope)) {
        return;
    }

    if ((decl instanceof VarDecl) || (decl instanceof CatchParameter)) {
        return;
    }

    if (isGlobalIdentifier(decl.name) && isDeclInGlobal(<ts.Identifier>decl.node)) {
        let sourceNode = jshelpers.getSourceFileOfNode(decl.node);
        throw new DiagnosticError(decl.node, DiagnosticCode.Declaration_name_conflicts_with_built_in_global_identifier_0, sourceNode, [decl.name])
    }
}

function throwDupIdError(decl: Decl) {
    let sourceNode = jshelpers.getSourceFileOfNode(decl.node);
    if (decl.node.kind == ts.SyntaxKind.FunctionDeclaration) {
        decl.node = <ts.Identifier>(<ts.FunctionDeclaration>decl.node).name;
    }
    throw new DiagnosticError(decl.node, DiagnosticCode.Duplicate_identifier_0, sourceNode, [decl.name]);
}

//**********************************Part 2: Implementing syntax check except declaration******************************************//
export function checkSyntaxError(node: ts.Node, scope:Scope) {
    checkSyntaxErrorForSloppyAndStrictMode(node);
    if (isStrictMode(node) || CmdOptions.isModules()) {
        checkSyntaxErrorForStrictMode(node, scope);
    }
}

function checkBreakOrContinueStatement(node: ts.BreakOrContinueStatement) {
    let curNode: ts.Node = node;
    while (curNode) {
        if (ts.isFunctionLike(curNode)) {
            throw new DiagnosticError(node, DiagnosticCode.Jump_target_cannot_cross_function_boundary, jshelpers.getSourceFileOfNode(curNode));
        }

        switch (curNode.kind) {
            case ts.SyntaxKind.SwitchStatement: {
                if (node.kind === ts.SyntaxKind.BreakStatement && !node.label) {
                    // unlabeled break within switch statement - ok
                    return;
                }
                break;
            }
            case ts.SyntaxKind.LabeledStatement: {
                if (node.label && (<ts.LabeledStatement>curNode).label.escapedText === node.label.escapedText) {
                    // found matching label - verify that label usage is correct
                    // continue can only target labels that are on iteration statements
                    let isMisplacedContinueLabel = false;
                    if (node.kind === ts.SyntaxKind.ContinueStatement
                        && !jshelpers.isIterationStatement((<ts.LabeledStatement>curNode).statement, /*lookInLabeledStatement*/ true)) {
                        isMisplacedContinueLabel = true;
                    }

                    if (isMisplacedContinueLabel) {
                        throw new DiagnosticError(node, DiagnosticCode.A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement, jshelpers.getSourceFileOfNode(curNode));
                    }

                    return;
                }
                break;
            }
            default: {
                if (jshelpers.isIterationStatement(curNode, /*lookInLabeledStatement*/ false) && !node.label) {
                    // unlabeled break or continue within iteration statement - ok
                    return false;
                }
                break;
            }
        }

        curNode = curNode.parent;
    }

    let diagnosticCode;

    if (node.label) {
        if (node.kind == ts.SyntaxKind.BreakStatement) {
            diagnosticCode = DiagnosticCode.A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement;
        } else {
            diagnosticCode = DiagnosticCode.A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement;
        }
    } else {
        if (node.kind == ts.SyntaxKind.BreakStatement) {
            diagnosticCode = DiagnosticCode.A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement;
        } else {
            diagnosticCode = DiagnosticCode.A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement;
        }
    }

    throw new DiagnosticError(node, diagnosticCode, jshelpers.getSourceFileOfNode(node));
}

function checkReturnStatement(node: ts.ReturnStatement) {
    let func = jshelpers.getContainingFunction(node);
    if (!func) {
        let file = jshelpers.getSourceFileOfNode(node);
        throw new DiagnosticError(node, DiagnosticCode.A_return_statement_can_only_be_used_within_a_function_body, file);
    }
}

function checkMetaProperty(node: ts.MetaProperty) {
    let text = jshelpers.getTextOfIdentifierOrLiteral(node.name);
    let file = jshelpers.getSourceFileOfNode(node);
    switch (node.keywordToken) {
        case ts.SyntaxKind.NewKeyword: {
            let args = [text, jshelpers.tokenToString(node.keywordToken), "target"];
            if (text != "target") {
                throw new DiagnosticError(node, DiagnosticCode._0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2, file, args);
            }

            let func = getContainingFunctionDeclaration(node);
            if (!func) {
                throw new DiagnosticError(node, DiagnosticCode.Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constructor, file, args);
            } else {
                if (ts.isMethodDeclaration(func)) {
                    throw new DiagnosticError(node, DiagnosticCode.Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constructor, file, args);
                }
                if (ts.isArrowFunction(func) && !jshelpers.getNewTargetContainer(node)) {
                    throw new DiagnosticError(node, DiagnosticCode.Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constructor, file, args);
                }
            }
            break;
        }
        case ts.SyntaxKind.ImportKeyword: {
            if (text != "meta") {
                let args = [text, jshelpers.tokenToString(node.keywordToken), "meta"];
                throw new DiagnosticError(node, DiagnosticCode._0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2, file, args);
            }
            break;
        }
        default:
            break;
    }
}

function checkNameInLetOrConstDeclarations(name: ts.Identifier | ts.BindingPattern) {
    if (name.kind === ts.SyntaxKind.Identifier) {
        if (name.originalKeywordKind === ts.SyntaxKind.LetKeyword) {
            let file = jshelpers.getSourceFileOfNode(name);
            throw new DiagnosticError(name, DiagnosticCode.The_let_is_not_allowed_to_be_used_as_a_name_in_let_or_const_declarations, file);
        }
    } else {
        let elements = name.elements;
        for (let element of elements) {
            if (!ts.isOmittedExpression(element)) {
                checkNameInLetOrConstDeclarations(element.name);
            }
        }
    }
}

function checkDisallowedLetOrConstStatement(node: ts.VariableStatement) {
    if (allowLetAndConstDeclarations(node.parent)) {
        return;
    }

    if (jshelpers.isLet(node.declarationList)) {
        throw new DiagnosticError(node, DiagnosticCode.The_let_declarations_can_only_be_declared_inside_a_block);
    }

    if (jshelpers.isVarConst(node.declarationList)) {
        throw new DiagnosticError(node, DiagnosticCode.The_const_declarations_can_only_be_declared_inside_a_block);
    }
}

function checkVariableDeclaration(node: ts.VariableDeclaration) {
    let file = jshelpers.getSourceFileOfNode(node);
    if (!ts.isForInStatement(node.parent.parent) && !ts.isForOfStatement(node.parent.parent) && !ts.isCatchClause(node.parent)) {
        if (!node.initializer) {
            if (isBindingPattern(node.name) && !isBindingPattern(node.parent)) {
                throw new DiagnosticError(node, DiagnosticCode.A_destructuring_declaration_must_have_an_initializer, file);
            }

            if (jshelpers.isVarConst(node)) {
                throw new DiagnosticError(node, DiagnosticCode.The_const_declarations_must_be_initialized, file);
            }
        }
    }

    if (node.exclamationToken && (node.parent.parent.kind !== ts.SyntaxKind.VariableStatement || !node.type || node.initializer)) {
        if (node.initializer) {
            throw new DiagnosticError(node.exclamationToken, DiagnosticCode.Declarations_with_initializers_cannot_also_have_definite_assignment_assertions, file);
        } else {
            throw new DiagnosticError(node.exclamationToken, DiagnosticCode.Declarations_with_definite_assignment_assertions_must_also_have_type_annotations, file);
        }
    }

    if (jshelpers.isLet(node) || jshelpers.isVarConst(node)) {
        checkNameInLetOrConstDeclarations(node.name);
        if (!isInBlockScope(node.parent.parent.parent)
            && !ts.isForInStatement(node.parent.parent)
            && !ts.isForOfStatement(node.parent.parent)
            && !ts.isForStatement(node.parent.parent)) {
            throw new DiagnosticError(node, DiagnosticCode.const_and_let_declarations_not_allowed_in_statement_positions, file);
        }
    }
}

function checkDecorators(node: ts.Node) {
    if (!node.decorators) {
        return;
    }

    let file = jshelpers.getSourceFileOfNode(node);
    if (!jshelpers.nodeCanBeDecorated(node, node.parent, node.parent.parent)) {
        if (ts.isMethodDeclaration(node) && !jshelpers.nodeIsPresent((<ts.MethodDeclaration>node).body)) {
            throw new DiagnosticError(node, DiagnosticCode.A_decorator_can_only_decorate_a_method_implementation_not_an_overload, file);
        } else {
            throw new DiagnosticError(node, DiagnosticCode.Decorators_are_not_valid_here, file);
        }
    } else if (ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) {
        let accessors = jshelpers.getAllAccessorDeclarations((<ts.ClassDeclaration>node.parent).members, <ts.AccessorDeclaration>node);
        if (accessors.firstAccessor.decorators && node === accessors.secondAccessor) {
            throw new DiagnosticError(node, DiagnosticCode.Decorators_cannot_be_applied_to_multiple_get_Slashset_accessors_of_the_same_name, file);
        }
    }
}

function checkAsyncModifier(node: ts.Node, asyncModifier: ts.Node) {
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.MethodDeclaration:
            return;
        default:
            break;
    }
    let file = jshelpers.getSourceFileOfNode(node);
    throw new DiagnosticError(asyncModifier, DiagnosticCode._0_modifier_cannot_be_used_here, file, ["async"])
}

function checkModifiers(node: ts.Node) {
    if (!node.modifiers) {
        return;
    }

    let lastStatic: ts.Node | undefined;
    let lastDeclare: ts.Node | undefined;
    let lastAsync: ts.Node | undefined;
    let lastReadonly: ts.Node | undefined;
    let flags = ts.ModifierFlags.None;
    let file = jshelpers.getSourceFileOfNode(node);

    for (let modifier of node.modifiers!) {
        if (modifier.kind !== ts.SyntaxKind.ReadonlyKeyword) {
            if (ts.isPropertySignature(node) || ts.isMethodSignature(node)) {
                throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_type_member, file, [jshelpers.tokenToString(modifier.kind)]);
            }
            if (ts.isIndexSignatureDeclaration(node)) {
                throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_an_index_signature, file, [jshelpers.tokenToString(modifier.kind)]);
            }
        }
        switch (modifier.kind) {
            case ts.SyntaxKind.ConstKeyword: {
                if (ts.isEnumDeclaration(node)) {
                    throw new DiagnosticError(node, DiagnosticCode.A_class_member_cannot_have_the_0_keyword, file, [jshelpers.tokenToString(ts.SyntaxKind.ConstKeyword)]);
                }
                break;
            }
            case ts.SyntaxKind.PublicKeyword:
            case ts.SyntaxKind.ProtectedKeyword:
            case ts.SyntaxKind.PrivateKeyword: {
                const text = visibilityToString(jshelpers.modifierToFlag(modifier.kind));

                if (flags & ts.ModifierFlags.AccessibilityModifier) {
                    throw new DiagnosticError(modifier, DiagnosticCode.Accessibility_modifier_already_seen, file);
                } else if (flags & ts.ModifierFlags.Static) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, [text, "static"]);
                } else if (flags & ts.ModifierFlags.Readonly) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, [text, "readonly"]);
                } else if (flags & ts.ModifierFlags.Async) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, [text, "async"]);
                } else if (ts.isModuleBlock(node.parent) || ts.isSourceFile(node.parent)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_module_or_namespace_element, file, [text]);
                } else if (flags & ts.ModifierFlags.Abstract) {
                    if (modifier.kind === ts.SyntaxKind.PrivateKeyword) {
                        throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_1_modifier, file, [text, "abstract"]);
                    } else {
                        throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, [text, "abstract"]);
                    }
                } else if (ts.isPropertyDeclaration(node) && ts.isPrivateIdentifier(node.name)) {
                    throw new DiagnosticError(modifier, DiagnosticCode.An_accessibility_modifier_cannot_be_used_with_a_private_identifier, file);
                }
                flags |= jshelpers.modifierToFlag(modifier.kind);
                break;
            }
            case ts.SyntaxKind.StaticKeyword: {
                if (flags & ts.ModifierFlags.Static) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_already_seen, file, ["static"]);
                } else if (flags & ts.ModifierFlags.Readonly) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, ["static", "readonly"]);
                } else if (flags & ts.ModifierFlags.Async) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, ["static", "async"]);
                } else if (ts.isModuleBlock(node.parent) || ts.isSourceFile(node.parent)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_module_or_namespace_element, file, ["static"]);
                } else if (ts.isParameter(node)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_parameter, file, ["static"]);
                } else if (flags & ts.ModifierFlags.Abstract) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_1_modifier, file, ["static", "abstract"]);
                } else if (ts.isPropertyDeclaration(node) && ts.isPrivateIdentifier(node.name)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_a_private_identifier, file, ["static"]);
                }
                flags |= ts.ModifierFlags.Static;
                lastStatic = modifier;
                break;
            }
            case ts.SyntaxKind.ReadonlyKeyword: {
                if (flags & ts.ModifierFlags.Readonly) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_already_seen, file, ["readonly"]);
                } else if (!ts.isPropertyDeclaration(node) && !ts.isPropertySignature(node) && !ts.isIndexSignatureDeclaration(node) && !ts.isParameter(node)) {
                    // If node.kind === SyntaxKind.Parameter, checkParameter report an error if it's not a parameter property.
                    throw new DiagnosticError(modifier, DiagnosticCode.The_readonly_modifier_can_only_appear_on_a_property_declaration_or_index_signature, file);
                }
                flags |= ts.ModifierFlags.Readonly;
                lastReadonly = modifier;
                break;
            }
            case ts.SyntaxKind.ExportKeyword: {
                if (flags & ts.ModifierFlags.Export) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_already_seen, file, ["export"]);
                } else if (flags & ts.ModifierFlags.Ambient) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, ["export", "declare"]);
                } else if (flags & ts.ModifierFlags.Abstract) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, ["export", "abstract"]);
                } else if (flags & ts.ModifierFlags.Async) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_must_precede_1_modifier, file, ["export", "async"]);
                } else if (ts.isClassLike(node.parent)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_class_elements_of_this_kind, file, ["export"]);
                } else if (ts.isParameter(node)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_parameter, file, ["export"]);
                }
                flags |= ts.ModifierFlags.Export;
                break;
            }
            case ts.SyntaxKind.DefaultKeyword: {
                let container = ts.isSourceFile(node.parent) ? node.parent : node.parent.parent;
                if (ts.isModuleDeclaration(container) && !jshelpers.isAmbientModule(container)) {
                    throw new DiagnosticError(modifier, DiagnosticCode.A_default_export_can_only_be_used_in_an_ECMAScript_style_module, file);
                }

                flags |= ts.ModifierFlags.Default;
                break;
            }
            case ts.SyntaxKind.DeclareKeyword: {
                if (flags & ts.ModifierFlags.Ambient) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_already_seen, file, ["declare"]);
                } else if (flags & ts.ModifierFlags.Async) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_in_an_ambient_context, file, ["async"]);
                } else if (ts.isClassLike(node.parent) && !ts.isPropertyDeclaration(node)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_class_elements_of_this_kind, file, ["declare"]);
                } else if (ts.isParameter(node)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_parameter, file, ["declare"]);
                } else if (ts.isPropertyDeclaration(node) && ts.isPrivateIdentifier(node.name)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_a_private_identifier, file, ["declare"]);
                }
                flags |= ts.ModifierFlags.Ambient;
                lastDeclare = modifier;
                break;
            }
            case ts.SyntaxKind.AbstractKeyword: {
                if (flags & ts.ModifierFlags.Abstract) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_already_seen, file, ["abstract"]);
                }
                if (ts.isClassDeclaration(node) && ts.isConstructorTypeNode(node)) {
                    if (!ts.isMethodDeclaration(node) && !ts.isPropertyDeclaration(node) && !ts.isGetAccessorDeclaration(node) && !ts.isSetAccessorDeclaration(node)) {
                        throw new DiagnosticError(modifier, DiagnosticCode.The_abstract_modifier_can_only_appear_on_a_class_method_or_property_declaration, file);
                    }
                    if (flags & ts.ModifierFlags.Static) {
                        throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_1_modifier, file, ["static", "abstract"]);
                    }
                    if (flags & ts.ModifierFlags.Private) {
                        throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_1_modifier, file, ["private", "abstract"]);
                    }
                    if (flags & ts.ModifierFlags.Async && lastAsync) {
                        throw new DiagnosticError(lastAsync, DiagnosticCode._0_modifier_cannot_be_used_with_1_modifier, file, ["async", "abstract"]);
                    }
                }
                let name = (<ts.NamedDeclaration>node).name;
                if (name && ts.isPrivateIdentifier(name)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_a_private_identifier, file, ["abstract"]);
                }

                flags |= ts.ModifierFlags.Abstract;
                break;
            }
            case ts.SyntaxKind.AsyncKeyword: {
                if (flags & ts.ModifierFlags.Async) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_already_seen, file, ["async"]);
                } else if (flags & ts.ModifierFlags.Ambient) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_in_an_ambient_context, file, ["async"]);
                } else if (ts.isParameter(node)) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_appear_on_a_parameter, file, ["async"]);
                }
                if (flags & ts.ModifierFlags.Abstract) {
                    throw new DiagnosticError(modifier, DiagnosticCode._0_modifier_cannot_be_used_with_1_modifier, file, ["async", "abstract"]);
                }
                flags |= ts.ModifierFlags.Async;
                lastAsync = modifier;
                break;
            }
            default:
                break;
        }
    }

    if (ts.isConstructorDeclaration(node)) {
        if (flags & ts.ModifierFlags.Static) {
            throw new DiagnosticError(lastStatic!, DiagnosticCode._0_modifier_cannot_appear_on_a_constructor_declaration, file, ["static"]);
        }
        if (flags & ts.ModifierFlags.Abstract) {
            throw new DiagnosticError(lastStatic!, DiagnosticCode._0_modifier_cannot_appear_on_a_constructor_declaration, file, ["abstract"]);
        } else if (flags & ts.ModifierFlags.Async) {
            throw new DiagnosticError(lastAsync!, DiagnosticCode._0_modifier_cannot_appear_on_a_constructor_declaration, file, ["async"]);
        } else if (flags & ts.ModifierFlags.Readonly) {
            throw new DiagnosticError(lastReadonly!, DiagnosticCode._0_modifier_cannot_appear_on_a_constructor_declaration, file, ["readonly"]);
        }
    } else if ((ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node)) && flags & ts.ModifierFlags.Ambient) {
        throw new DiagnosticError(lastDeclare!, DiagnosticCode.A_0_modifier_cannot_be_used_with_an_import_declaration, file, ["declare"]);
    } else if (ts.isParameter(node) && (flags & ts.ModifierFlags.ParameterPropertyModifier) && isBindingPattern((<ts.ParameterDeclaration>node).name)) {
        throw new DiagnosticError(node, DiagnosticCode.A_parameter_property_may_not_be_declared_using_a_binding_pattern, file);
    } else if (ts.isParameter(node) && (flags & ts.ModifierFlags.ParameterPropertyModifier) && (<ts.ParameterDeclaration>node).dotDotDotToken) {
        throw new DiagnosticError(node, DiagnosticCode.A_parameter_property_cannot_be_declared_using_a_rest_parameter, file);
    }

    if (flags & ts.ModifierFlags.Async) {
        checkAsyncModifier(node, lastAsync!);
    }
}

function checkVariableDeclarationList(declarationList: ts.VariableDeclarationList) {
    let declarations = declarationList.declarations;
    if (!declarations.length) {
        throw new DiagnosticError(declarationList, DiagnosticCode.Identifier_expected);
    }

    let decl = declarations[0].name;
    if (isBindingPattern(decl)) {
        checkBindingPattern(<ts.BindingPattern>decl);
    }
}

function checkVariableStatement(node: ts.VariableStatement) {
    checkDecorators(node);
    checkModifiers(node);
    checkVariableDeclarationList(node.declarationList);
    checkDisallowedLetOrConstStatement(node);
}

function checkForInOrForOfStatement(stmt: ts.ForInOrOfStatement) {
    let file = jshelpers.getSourceFileOfNode(stmt);
    let leftExpr = stmt.initializer;
    if (ts.isParenthesizedExpression(leftExpr)) {
        leftExpr = findInnerExprOfParenthesis(leftExpr);
    }
    if (ts.isVariableDeclarationList(leftExpr)) {
        let variableList = <ts.VariableDeclarationList>leftExpr;
        checkVariableDeclarationList(variableList);
        let declarations = variableList.declarations;

        if (declarations.length > 1) {
            if (ts.isForInStatement(stmt)) {
                throw new DiagnosticError(variableList.declarations[1], DiagnosticCode.Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement, file);
            } else {
                throw new DiagnosticError(variableList.declarations[1], DiagnosticCode.Only_a_single_variable_declaration_is_allowed_in_a_for_of_statement, file);
            }
        }

        if (declarations[0].initializer) {
            if (ts.isForInStatement(stmt)) {
                throw new DiagnosticError(declarations[0].name, DiagnosticCode.The_variable_declaration_of_a_for_in_statement_cannot_have_an_initializer, file);
            } else {
                throw new DiagnosticError(declarations[0].name, DiagnosticCode.The_variable_declaration_of_a_for_of_statement_cannot_have_an_initializer, file);
            }
        }

        if (declarations[0].type) {
            if (ts.isForInStatement(stmt)) {
                throw new DiagnosticError(declarations[0], DiagnosticCode.The_left_hand_side_of_a_for_in_statement_cannot_use_a_type_annotation, file);
            } else {
                throw new DiagnosticError(declarations[0], DiagnosticCode.The_left_hand_side_of_a_for_of_statement_cannot_use_a_type_annotation, file);
            }
        }
    } else {
        isInVaildAssignmentLeftSide(<ts.Expression>leftExpr);

        if (ts.isArrayLiteralExpression(leftExpr) || ts.isObjectLiteralExpression(leftExpr)) {
            checkDestructuringAssignmentLhs(leftExpr);
        }
    }
}

function checkForInOrForOfVariableDeclaration(iterationStatement: ts.ForInOrOfStatement) {
    let variableDeclarationList = <ts.VariableDeclarationList>iterationStatement.initializer;
    // checkGrammarForInOrForOfStatement will check that there is exactly one declaration.
    if (variableDeclarationList.declarations.length >= 1) {
        checkVariableDeclaration(variableDeclarationList.declarations[0]);
    }
}

function checkForInStatement(node: ts.ForInStatement) {
    checkForInOrForOfStatement(node);

    let file = jshelpers.getSourceFileOfNode(node);
    // for (let VarDecl in Expr) Statement
    if (ts.isVariableDeclarationList(node.initializer)) {
        checkForInOrForOfVariableDeclaration(node);
    } else {
        let varExpr = node.initializer;
        if (ts.isArrayLiteralExpression(varExpr) || ts.isObjectLiteralExpression(varExpr)) {
            throw new DiagnosticError(varExpr, DiagnosticCode.The_left_hand_side_of_a_for_in_statement_cannot_be_a_destructuring_pattern, file);
        }
    }
}

const enum OuterExpressionKinds {
    Parentheses = 1 << 0,
    TypeAssertions = 1 << 1,
    NonNullAssertions = 1 << 2,
    PartiallyEmittedExpressions = 1 << 3,
    Assertions = TypeAssertions | NonNullAssertions,
    All = Parentheses | Assertions | PartiallyEmittedExpressions
}

function checkReferenceExpression(expr: ts.Expression, invalidReferenceCode: DiagnosticCode, invalidOptionalChainCode: DiagnosticCode) {
    let node = jshelpers.skipOuterExpressions(expr, OuterExpressionKinds.Assertions | OuterExpressionKinds.Parentheses);
    if (node.kind !== ts.SyntaxKind.Identifier && node.kind !== ts.SyntaxKind.PropertyAccessExpression && node.kind !== ts.SyntaxKind.ElementAccessExpression) {
        throw new DiagnosticError(expr, invalidReferenceCode);
    }

    if (node.flags & ts.NodeFlags.OptionalChain) {
        throw new DiagnosticError(expr, invalidOptionalChainCode);
    }
}

function checkReferenceAssignment(node: ts.Expression) {
    let invalidReferenceCode: DiagnosticCode;
    let invalidOptionalChainCode: DiagnosticCode;

    if (ts.isSpreadAssignment(node.parent)) {
        invalidReferenceCode = DiagnosticCode.The_target_of_an_object_rest_assignment_must_be_a_variable_or_a_property_access;
        invalidOptionalChainCode = DiagnosticCode.The_target_of_an_object_rest_assignment_may_not_be_an_optional_property_access;
    } else {
        invalidReferenceCode = DiagnosticCode.The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access;
        invalidOptionalChainCode = DiagnosticCode.The_left_hand_side_of_an_assignment_expression_may_not_be_an_optional_property_access;
    }

    checkReferenceExpression(node, invalidReferenceCode, invalidOptionalChainCode);
}

function checkDestructuringAssignment(node: ts.Expression | ts.ShorthandPropertyAssignment) {
    let target: ts.Expression;
    if (ts.isShorthandPropertyAssignment(node)) {
        let prop = <ts.ShorthandPropertyAssignment>node;
        target = prop.name;
    } else {
        target = node;
    }

    if (ts.isBinaryExpression(target) && (<ts.BinaryExpression>target).operatorToken.kind === ts.SyntaxKind.EqualsToken) {
        checkBinaryExpression(<ts.BinaryExpression>target);
        target = (<ts.BinaryExpression>target).left;
    }

    if (ts.isObjectLiteralExpression(target)) {
        checkObjectLiteralExpression(target);
    }

    checkReferenceAssignment(target);

}

function checkForOfStatement(node: ts.ForOfStatement) {
    checkForInOrForOfStatement(node);

    if (ts.isVariableDeclarationList(node.initializer)) {
        checkForInOrForOfVariableDeclaration(node);
    } else {
        let varExpr = node.initializer;

        if (ts.isArrayLiteralExpression(varExpr) || ts.isObjectLiteralExpression(varExpr)) {
            checkDestructuringAssignment(varExpr);
        } else {
            checkReferenceExpression(
                varExpr,
                DiagnosticCode.The_left_hand_side_of_a_for_of_statement_must_be_a_variable_or_a_property_access,
                DiagnosticCode.The_left_hand_side_of_a_for_of_statement_may_not_be_an_optional_property_access);
        }
    }
}

function checkClassDeclaration(node: ts.ClassLikeDeclaration) {
    checkClassDeclarationHeritageClauses(node);
    let hasConstructorImplementation = false;
    let file = jshelpers.getSourceFileOfNode(node);
    node.members.forEach(member => {
        switch (member.kind) {
            case ts.SyntaxKind.Constructor: {
                if (hasConstructorImplementation) {
                    throw new DiagnosticError(node, DiagnosticCode.Multiple_constructor_implementations_are_not_allowed, file);
                } else {
                    hasConstructorImplementation = true;
                }
                break;
            }
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.SetAccessor:
                checkFunctionLikeDeclaration(<ts.FunctionLikeDeclaration | ts.MethodSignature>member);
                break;
            case ts.SyntaxKind.GetAccessor:
                checkGetAccessor(<ts.GetAccessorDeclaration>member);
                break;
            default:
                break;
        }
    });

    // Class declaration not allowed in statement position
    if (isStatement(node.parent.kind)) {
        throw new DiagnosticError(node, DiagnosticCode.Class_declaration_not_allowed_in_statement_position, file);
    }

}

function checkClassDeclarationHeritageClauses(node: ts.ClassLikeDeclaration) {
    let hasExtendsKeyWords = false;
    checkDecorators(node);
    checkModifiers(node);
    if (node.heritageClauses == undefined) {
        return;
    }

    let file = jshelpers.getSourceFileOfNode(node);
    for (let heritageClause of node.heritageClauses) {
        if (heritageClause.token == ts.SyntaxKind.ExtendsKeyword) {
            if (hasExtendsKeyWords) {
                throw new DiagnosticError(heritageClause, DiagnosticCode.The_extends_clause_already_seen, file);
            }

            if (heritageClause.types.length > 1) {
                throw new DiagnosticError(heritageClause, DiagnosticCode.Classes_can_only_extend_a_single_class);
            }
            hasExtendsKeyWords = true;
        }
    }
}

function checkBinaryExpression(node: ts.BinaryExpression) {
    // AssignmentExpression
    if (isAssignmentOperator(node.operatorToken.kind)) {
        let leftExpr: ts.Expression = node.left;
        if (ts.isParenthesizedExpression(leftExpr)) {
            leftExpr = findInnerExprOfParenthesis(leftExpr);
        }

        if (node.operatorToken.kind == ts.SyntaxKind.EqualsToken) {
            if (ts.isArrayLiteralExpression(leftExpr) || ts.isObjectLiteralExpression(leftExpr)) {
                checkDestructuringAssignmentLhs(leftExpr);
            }
        }

        isInVaildAssignmentLeftSide(leftExpr);
    }
}

function isInVaildAssignmentLeftSide(leftExpr: ts.Expression) {
    if (jshelpers.isKeyword(leftExpr.kind)
        || leftExpr.kind == ts.SyntaxKind.NumericLiteral
        || leftExpr.kind == ts.SyntaxKind.StringLiteral) {
        throw new DiagnosticError(leftExpr, DiagnosticCode.The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access);
    }
}


function checkContextualIdentifier(node: ts.Identifier) {
    if (jshelpers.isIdentifierName(node)) {
        return;
    }

    let file = jshelpers.getSourceFileOfNode(node);
    if (node.originalKeywordKind === ts.SyntaxKind.AwaitKeyword) {
        if (jshelpers.isExternalOrCommonJsModule(file) && jshelpers.isInTopLevelContext(node)) {
            throw new DiagnosticError(node, DiagnosticCode.Identifier_expected_0_is_a_reserved_word_at_the_top_level_of_a_module, file, jshelpers.declarationNameToString(node));
        } else if (node.flags & ts.NodeFlags.AwaitContext) {
            throw new DiagnosticError(node, DiagnosticCode.Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here, file, jshelpers.declarationNameToString(node));
        }
    } else if (node.originalKeywordKind === ts.SyntaxKind.YieldKeyword && node.flags & ts.NodeFlags.YieldContext) {
        throw new DiagnosticError(node, DiagnosticCode.Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here, file, jshelpers.declarationNameToString(node));
    }
}

function checkComputedPropertyName(node: ts.Node) {
    if (!ts.isComputedPropertyName(node)) {
        return;
    }

    let expression = node.expression;
    if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.CommaToken) {
        let file = jshelpers.getSourceFileOfNode(node);
        throw new DiagnosticError(expression, DiagnosticCode.A_comma_expression_is_not_allowed_in_a_computed_property_name, file);
    }
}

const enum DeclarationMeaning {
    GetAccessor = 1,
    SetAccessor = 2,
    PropertyAssignment = 4,
    Method = 8,
    GetOrSetAccessor = GetAccessor | SetAccessor,
    PropertyAssignmentOrMethod = PropertyAssignment | Method,
}

function checkObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
    let inDestructuring = jshelpers.isAssignmentTarget(node);
    let file = jshelpers.getSourceFileOfNode(node);
    let seen = new Map<ts.__String, DeclarationMeaning>();

    for (let prop of node.properties) {
        if (ts.isSpreadAssignment(prop)) {
            if (inDestructuring) {
                let expression = jshelpers.skipParentheses(prop.expression);
                if (ts.isArrayLiteralExpression(expression) || ts.isObjectLiteralExpression(expression)) {
                    throw new DiagnosticError(prop.expression, DiagnosticCode.A_rest_element_cannot_contain_a_binding_pattern, file);
                }
            }
            continue;
        }
        let name = prop.name;
        if (ts.isComputedPropertyName(name)) {
            checkComputedPropertyName(name);
        }

        if (ts.isShorthandPropertyAssignment(prop) && !inDestructuring && prop.objectAssignmentInitializer) {
            throw new DiagnosticError(prop.equalsToken!, DiagnosticCode.Did_you_mean_to_use_a_Colon_An_can_only_follow_a_property_name_when_the_containing_object_literal_is_part_of_a_destructuring_pattern, file);
        }

        if (ts.isPrivateIdentifier(name)) {
            throw new DiagnosticError(name, DiagnosticCode.Private_identifiers_are_not_allowed_outside_class_bodies, file);
        }

        if (prop.modifiers) {
            for (let mod of prop.modifiers) {
                if (!ts.isMethodDeclaration(prop) || mod.kind != ts.SyntaxKind.AsyncKeyword) {
                    throw new DiagnosticError(mod, DiagnosticCode._0_modifier_cannot_be_used_here, file, [jshelpers.getTextOfNode(mod)]);
                }
            }
        }

        /**
        * It is a Syntax Error if PropertyNameList of PropertyDefinitionList contains any duplicate entries for "__proto__" and
        * at least two of those entries were obtained from productions of the form
        * PropertyDefinition : PropertyName : AssignmentExpression .
        */
        let curKind = getPropertieDeclaration(prop, name);
        if (!curKind) continue;
        if (!inDestructuring) {
            let effectName = jshelpers.getPropertyNameForPropertyNameNode(name);
            if (!effectName || ts.isComputedPropertyName(name)) continue;
            let existKind = seen.get(effectName);
            if (!existKind) {
                seen.set(effectName, curKind);
            } else {
                if ((curKind & DeclarationMeaning.PropertyAssignmentOrMethod) && (existKind & DeclarationMeaning.PropertyAssignmentOrMethod)) {
                    if (effectName === "___proto__") {
                        throw new DiagnosticError(name, DiagnosticCode.Duplicate_identifier_0, file, [jshelpers.getTextOfNode(name)]);
                    }
                }
            }
        }
    }
}

function checkInvalidExclamationToken(exclamationToken: ts.ExclamationToken | undefined) {
    if (!!exclamationToken) {
        let file = jshelpers.getSourceFileOfNode(exclamationToken);
        throw new DiagnosticError(exclamationToken, DiagnosticCode.A_definite_assignment_assertion_is_not_permitted_in_this_context, file);
    }
}

function checkInvalidQuestionMark(questionToken: ts.QuestionToken | undefined) {
    if (!!questionToken) {
        let file = jshelpers.getSourceFileOfNode(questionToken);
        throw new DiagnosticError(questionToken, DiagnosticCode.An_object_member_cannot_be_declared_optional, file);
    }
}

// @ts-ignore
function getPropertieDeclaration(node: ts.Node, name: ts.Node) {
    let decl = undefined;
    if (ts.isShorthandPropertyAssignment(node)) {
        checkInvalidExclamationToken(node.exclamationToken);
    } else if (ts.isPropertyAssignment(node)) {
        checkInvalidQuestionMark(node.questionToken);
        decl = DeclarationMeaning.PropertyAssignment;
    } else if (ts.isMethodDeclaration(node)) {
        decl = DeclarationMeaning.Method;
    } else if (ts.isGetAccessor(node)) {
        checkGetAccessor(node);
        decl = DeclarationMeaning.GetAccessor;
    } else if (ts.isSetAccessor(node)) {
        decl = DeclarationMeaning.SetAccessor;
    } else {
        LOGE("Unexpected syntax kind:" + node.kind);
    }
    return decl;
}

function checkDisallowedTrailingComma(list: ts.NodeArray<ts.Node> | undefined) {
    if (list && list.hasTrailingComma) {
        let file = jshelpers.getSourceFileOfNode(list[0]);
        throw new DiagnosticError(list[0], DiagnosticCode.A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma, file);
    }
}

function checkParameters(parameters: ts.NodeArray<ts.ParameterDeclaration>) {
    let count = parameters.length;
    let optionalParameter = false;

    for (let i = 0; i < count; i++) {
        let parameter = parameters[i];
        let file = jshelpers.getSourceFileOfNode(parameter);
        if (parameter.dotDotDotToken) {
            if (i != count - 1) {
                throw new DiagnosticError(parameter.dotDotDotToken, DiagnosticCode.A_rest_parameter_must_be_last_in_a_parameter_list, file);
            }

            checkDisallowedTrailingComma(parameters);

            if (parameter.initializer) {
                throw new DiagnosticError(parameter.name, DiagnosticCode.A_rest_parameter_cannot_have_an_initializer, file);
            }

            if (parameter.questionToken) {
                throw new DiagnosticError(parameter.questionToken, DiagnosticCode.A_rest_parameter_cannot_be_optional, file);
            }

        } else if (isOptionalParameter(parameter)) {
            optionalParameter = true;
            if (parameter.questionToken && parameter.initializer) {
                throw new DiagnosticError(parameter.name, DiagnosticCode.Parameter_cannot_have_question_mark_and_initializer, file);
            }
        }
        else if (optionalParameter && !parameter.initializer) {
            throw new DiagnosticError(parameter.name, DiagnosticCode.A_required_parameter_cannot_follow_an_optional_parameter, file);
        }
    }
}

function checkArrowFunction(node: ts.Node) {
    if (!ts.isArrowFunction(node)) {
        return;
    }

    const { equalsGreaterThanToken } = node;
    let file = jshelpers.getSourceFileOfNode(node);
    const startLine = file.getLineAndCharacterOfPosition(equalsGreaterThanToken.pos).line;
    const endLine = file.getLineAndCharacterOfPosition(equalsGreaterThanToken.end).line;
    if (startLine !== endLine) {
        throw new DiagnosticError(equalsGreaterThanToken, DiagnosticCode.Line_terminator_not_permitted_before_arrow, file);
    }
}

function checkFunctionLikeDeclaration(node: ts.FunctionLikeDeclaration | ts.MethodSignature) {
    checkDecorators(node);
    checkModifiers(node);
    checkParameters(node.parameters);
    checkArrowFunction(node);
}

function checkLabeledStatement(node: ts.LabeledStatement) {
    let file = jshelpers.getSourceFileOfNode(node);
    jshelpers.findAncestor(node.parent, current => {
        if (jshelpers.isFunctionLike(current)) {
            return "quit";
        }

        if (ts.isLabeledStatement(current) && (<ts.LabeledStatement>current).label.escapedText === node.label.escapedText) {
            throw new DiagnosticError(node.label, DiagnosticCode.Duplicate_label_0, file, [jshelpers.getTextOfNode(node.label)]);
        }
        return false;
    });

    let statement = node.statement;
    if (ts.isVariableStatement(statement)) {
        let variableStatement = <ts.VariableStatement>statement;
        if (jshelpers.isLet(variableStatement.declarationList)) {
            throw new DiagnosticError(node, DiagnosticCode.Lexical_declaration_let_not_allowed_in_statement_position);
        }

        if (jshelpers.isVarConst(variableStatement.declarationList)) {
            throw new DiagnosticError(node, DiagnosticCode.Lexical_declaration_const_not_allowed_in_statement_position);
        }
    }
}

function checkGetAccessor(node: ts.GetAccessorDeclaration) {
    checkFunctionLikeDeclaration(node);
    if (node.parameters.length != 0) {
        throw new DiagnosticError(node, DiagnosticCode.Getter_must_not_have_any_formal_parameters);
    }
}

function isValidUseSuperExpression(node: ts.Node, isCallExpression: boolean): boolean {
    if (!node) {
        return false;
    }

    if (isCallExpression) {
        return ts.isConstructorDeclaration(node);
    }

    if (!ts.isClassLike(node.parent) && !ts.isObjectLiteralExpression(node.parent)) {
        return false;
    }

    return ts.isMethodDeclaration(node) || ts.isMethodSignature(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node) ||
        ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isConstructorDeclaration(node);
}

function checkSuperExpression(node: ts.SuperExpression) {
    let file = jshelpers.getSourceFileOfNode(node);
    let isCallExpression = false;
    if (ts.isCallExpression(node.parent) && (<ts.CallExpression>node.parent).expression === node) {
        isCallExpression = true;
    }

    let container = jshelpers.getSuperContainer(node, true);

    if (!isCallExpression) {
        while (container && ts.isArrowFunction(container)) {
            container = jshelpers.getSuperContainer(container, true);
        }
    }

    let isSuperExpCanUse = isValidUseSuperExpression(container, isCallExpression);

    if (!isSuperExpCanUse) {
        let current = jshelpers.findAncestor(node, n => n === container ? "quit" : ts.isComputedPropertyName(n));
        if (current && ts.isComputedPropertyName(current)) {
            throw new DiagnosticError(node, DiagnosticCode.The_super_cannot_be_referenced_in_a_computed_property_name, file);
        }
        let containerFunc = jshelpers.findAncestor(node, ts.isConstructorDeclaration);
        if (containerFunc) {
            return;
        }
        if (isCallExpression) {
            throw new DiagnosticError(node, DiagnosticCode.Super_calls_are_not_permitted_outside_constructors_or_in_nested_functions_inside_constructors, file);
        }

        if (!container || !container.parent || !ts.isClassLike(container.parent) || ts.isObjectLiteralExpression(container.parent)) {
            throw new DiagnosticError(node, DiagnosticCode.The_super_can_only_be_referenced_in_members_of_derived_classes_or_object_literal_expressions, file);
        }

        throw new DiagnosticError(node, DiagnosticCode.The_super_property_access_is_permitted_only_in_a_constructor_member_function_or_member_accessor_of_a_derived_class, file);
    }
}

function checkImportExpression(node: ts.ImportExpression) {
    let args = (<ts.CallExpression>node.parent).arguments;
    if (args.length != 1) {
        throw new DiagnosticError(node, DiagnosticCode.Dynamic_imports_can_only_accept_a_module_specifier_optional_assertion_is_not_supported_yet);
    }

    args.forEach(arg => {
        if (ts.isSpreadElement(arg)) {
            throw new DiagnosticError(node, DiagnosticCode.Argument_of_dynamic_import_cannot_be_spread_element);
        }
    });
}

function checkRegularExpression(regexp: ts.RegularExpressionLiteral) {
    let regexpText = regexp.text;
    let regexpParse = require("regexpp").RegExpParser;
    new regexpParse().parseLiteral(regexpText);
}

function checkThrowStatement(node: ts.ThrowStatement) {
    if (ts.isIdentifier(node.expression) && (<ts.Identifier>node.expression).text === '') {
        throw new DiagnosticError(node, DiagnosticCode.Line_break_not_permitted_here, jshelpers.getSourceFileOfNode(node));
    }
}

function checkSyntaxErrorForSloppyAndStrictMode(node: ts.Node) {
    switch (node.kind) {
        case ts.SyntaxKind.BreakStatement:
        case ts.SyntaxKind.ContinueStatement:
            checkBreakOrContinueStatement(<ts.BreakOrContinueStatement>node);
            break;
        case ts.SyntaxKind.ReturnStatement:
            checkReturnStatement(<ts.ReturnStatement>node);
            break;
        case ts.SyntaxKind.ComputedPropertyName:
            checkComputedPropertyName(<ts.ComputedPropertyName>node);
            break;
        case ts.SyntaxKind.ObjectBindingPattern:
        case ts.SyntaxKind.ArrayBindingPattern:
            checkBindingPattern(<ts.BindingPattern>node);
            break;
        case ts.SyntaxKind.MetaProperty:
            checkMetaProperty(<ts.MetaProperty>node);
            break;
        case ts.SyntaxKind.VariableDeclaration:
            checkVariableDeclaration(<ts.VariableDeclaration>node);
            break;
        case ts.SyntaxKind.VariableStatement:
            checkVariableStatement(<ts.VariableStatement>node);
            break;
        case ts.SyntaxKind.ForInStatement:
            checkForInStatement(<ts.ForInStatement>node);
            break;
        case ts.SyntaxKind.ForOfStatement:
            checkForOfStatement(<ts.ForOfStatement>node);
            break;
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
            checkClassDeclaration(<ts.ClassLikeDeclaration>node);
            break;
        case ts.SyntaxKind.SuperKeyword:
            checkSuperExpression(<ts.SuperExpression>node);
            break;
        case ts.SyntaxKind.ImportKeyword:
            checkImportExpression(<ts.ImportExpression>node);
            break;
        case ts.SyntaxKind.BinaryExpression:
            checkBinaryExpression(<ts.BinaryExpression>node);
            break;
        case ts.SyntaxKind.Identifier:
            checkContextualIdentifier(<ts.Identifier>node);
            break;
        case ts.SyntaxKind.ObjectLiteralExpression:
            checkObjectLiteralExpression(<ts.ObjectLiteralExpression>node);
            break;
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.ArrowFunction:
            checkFunctionLikeDeclaration(<ts.FunctionLikeDeclaration | ts.MethodSignature>node);
            break;
        case ts.SyntaxKind.GetAccessor:
            checkGetAccessor(<ts.GetAccessorDeclaration>node);
            break;
        case ts.SyntaxKind.LabeledStatement:
            checkLabeledStatement(<ts.LabeledStatement>node);
            break;
        case ts.SyntaxKind.RegularExpressionLiteral:
            checkRegularExpression(<ts.RegularExpressionLiteral>node);
            break;
        case ts.SyntaxKind.ThrowStatement:
            checkThrowStatement(<ts.ThrowStatement>node);
            break;
        default:
            break;
    }
}

function checkDestructuringAssignmentLhs(lhs: ts.Expression) {
    let file = getSourceFileOfNode(lhs);
    if (ts.isArrayLiteralExpression(lhs)) {
        let elements = lhs.elements;

        for (let i = 0; i < elements.length; i++) {
            let target = elements[i];

            if (ts.isSpreadElement(target)) {
                if (i != elements.length - 1) {
                    throw new DiagnosticError(target, DiagnosticCode.A_rest_element_must_be_last_in_a_destructuring_pattern, file);
                }

                if (elements.hasTrailingComma) {
                    throw new DiagnosticError(target, DiagnosticCode.A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma, file);
                }

                if (ts.isArrayLiteralExpression(target.expression) || ts.isObjectLiteralExpression(target.expression)) {
                    checkDestructuringAssignmentLhs(target.expression);
                }

                continue;
            }

            target = ts.isBinaryExpression(target) ? target.left : target;

            if (ts.isOmittedExpression(target) || ts.isElementAccessExpression(target)) {
                continue;
            }

            if (ts.isIdentifier(target)) {
                let name = jshelpers.getTextOfIdentifierOrLiteral(target);

                if (name == MandatoryArguments || name == "eval") {
                    throw new DiagnosticError(target, DiagnosticCode.Property_destructuring_pattern_expected, file);
                }
                continue;
            }

            if (ts.isPropertyAccessExpression(target)) {
                if (target.questionDotToken) {
                    throw new DiagnosticError(target, DiagnosticCode.Property_destructuring_pattern_expected, file);
                }

                continue;
            }

            if (ts.isArrayLiteralExpression(target) || ts.isObjectLiteralExpression(target)) {
                checkDestructuringAssignmentLhs(target);
                continue;
            }

            throw new DiagnosticError(target, DiagnosticCode.Property_destructuring_pattern_expected, file);
        }
    }

    if (ts.isObjectLiteralExpression(lhs)) {
        let elements = lhs.properties;

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];

            if (ts.isSpreadAssignment(element)) {
                if (i != elements.length - 1) {
                    let file = getSourceFileOfNode(lhs);
                    throw new DiagnosticError(element, DiagnosticCode.A_rest_element_must_be_last_in_a_destructuring_pattern, file);
                }
                continue;
            }

            if (ts.isPropertyAssignment(element)) {
                let target = ts.isBinaryExpression(element.initializer) ? element.initializer.left : element.initializer;

                if (ts.isIdentifier(target) ||
                    ts.isElementAccessExpression(target)) {
                    continue;
                }

                if (ts.isPropertyAccessExpression(target)) {
                    if (target.questionDotToken) {
                        throw new DiagnosticError(element, DiagnosticCode.Property_destructuring_pattern_expected, file);
                    }
                    continue;
                }

                if (ts.isObjectLiteralExpression(target) || ts.isArrayLiteralExpression(target)) {
                    checkDestructuringAssignmentLhs(target);
                    continue;
                }

                throw new DiagnosticError(element, DiagnosticCode.Property_destructuring_pattern_expected, file);
            }

            if (ts.isShorthandPropertyAssignment(element)) {
                let name = jshelpers.getTextOfIdentifierOrLiteral(element.name);

                if (name == MandatoryArguments || name == "eval") {
                    throw new DiagnosticError(element, DiagnosticCode.Property_destructuring_pattern_expected, file);
                }

                continue;
            }

            if (ts.isMethodDeclaration(element) ||
                ts.isGetAccessorDeclaration(element) ||
                ts.isSetAccessorDeclaration(element)) {
                throw new DiagnosticError(element, DiagnosticCode.Property_destructuring_pattern_expected, file);
            }
        }
    }
}

function checkBindingPattern(node: ts.BindingPattern) {
    let elements = node.elements;

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        if (ts.isOmittedExpression(element)) {
            continue;
        }

        if (element.dotDotDotToken) {
            let file = getSourceFileOfNode(node);

            if (i != elements.length - 1) {
                throw new DiagnosticError(element, DiagnosticCode.A_rest_element_must_be_last_in_a_destructuring_pattern, file);
            }

            if (element.initializer) {
                throw new DiagnosticError(element, DiagnosticCode.A_rest_parameter_cannot_have_an_initializer);
            }
        }
    }
}
