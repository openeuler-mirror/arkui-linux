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
import * as jshelpers from "./jshelpers";

let globalStrict = true;
let globalDeclare = false;

export function checkStrictModeStatementList(node: ts.Node): boolean {
    let statements;
    if (node.kind == ts.SyntaxKind.SourceFile) {
        statements = (<ts.SourceFile>node).statements;
    } else {
        let decl = <ts.FunctionLikeDeclaration>node;
        if (decl && decl.body) {
            if (decl.body.kind == ts.SyntaxKind.Block) {
                statements = (<ts.Block>decl.body).statements;
            }
        } else {
            return false;
        }
    }

    if (statements == undefined) {
        return false;
    }

    for (const statement of statements) {
        if (!jshelpers.isPrologueDirective(statement)) {
            return false;
        }

        if (isUseStrictPrologueDirective(<ts.ExpressionStatement>statement)) {
            return true;
        }
    }

    return false;
}

/// Should be called only on prologue directives (isPrologueDirective(node) should be true)
function isUseStrictPrologueDirective(node: ts.ExpressionStatement): boolean {
    let file = jshelpers.getSourceFileOfNode(node);
    const nodeText = jshelpers.getSourceTextOfNodeFromSourceFile(file, node.expression);

    // Note: the node text must be exactly "use strict" or 'use strict'.  It is not ok for the
    // string to contain unicode escapes (as per ES5).
    return nodeText === '"use strict"' || nodeText === "'use strict'";
}

function checkStrictMode(node: ts.Node): boolean {
    while (node && node.parent && node.parent.kind != ts.SyntaxKind.SourceFile) {
        let func = jshelpers.getContainingFunctionDeclaration(node);
        if (!func) {
            return false;
        }
        if (checkStrictModeStatementList(func)) {
            return true;
        }
        node = <ts.FunctionLikeDeclaration>func;
    }

    return false;
}

function getGlobalStrict(): boolean {
    return globalStrict;
}

export function setGlobalStrict(flag: boolean) {
    globalStrict = flag;
}

export function isStrictMode(node: ts.Node): boolean {
    if (getGlobalStrict()) {
        return true;
    }

    return checkStrictMode(node);
}

export function setGlobalDeclare(flag: boolean) {
    globalDeclare = flag;
}

export function isGlobalDeclare() {
    return globalDeclare;
}