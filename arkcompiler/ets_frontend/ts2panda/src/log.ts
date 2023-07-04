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

// singleton to print debug logs
import * as ts from "typescript";
import { CmdOptions } from "./cmdOptions";

export function LOGD(tag: any, ...args: any[]) {
    if (CmdOptions.isEnableDebugLog()) {
        if (tag) {
            console.log(tag + ": " + args);
        } else {
            console.log(args);
        }
    }
}

export function LOGE(tag: any, ...args: any[]) {
    if (tag) {
        console.error(tag + ": " + args);
    } else {
        console.error(args);
    }
}

export function printAstRecursively(node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile) {
    if (CmdOptions.isEnableDebugLog()) {
        const indentation = "-".repeat(indentLevel);
        let nodeContent = ts.SyntaxKind[node.kind] + ": ";
        if (node.kind == ts.SyntaxKind.Identifier) {
            // @ts-ignore
            nodeContent += (<ts.Identifier>node).escapedText;
        }
        console.log(`${indentation}${nodeContent}`);

        node.forEachChild(child =>
            printAstRecursively(child, indentLevel + 1, sourceFile)
        );
    }
}
