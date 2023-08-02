/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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
import { VarDeclarationKind } from "./variable";

export function getVarDeclarationKind(decl: ts.VariableDeclaration): VarDeclarationKind {
    if (decl.parent.kind == ts.SyntaxKind.VariableDeclarationList) {
        let declList = <ts.VariableDeclarationList>decl.parent;
        if ((declList.flags & ts.NodeFlags.Let) != 0) {
            return VarDeclarationKind.LET;
        } else if ((declList.flags & ts.NodeFlags.Const) != 0) {
            return VarDeclarationKind.CONST;
        } else {
            return VarDeclarationKind.VAR;
        }
    } else if (decl.parent.kind == ts.SyntaxKind.CatchClause) {
        return VarDeclarationKind.LET;
    } else {
        throw new Error("VariableDeclaration inside " + ts.SyntaxKind[decl.parent] + " is not implemented");
    }
}

