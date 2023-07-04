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

/*
  AST Printer.

  how to use:
    npm run ast -- file1 file2 ...

  Because of large output size, it is better to write to file:
    npm run ast -- file1 file2 ... >out.txt

  API:
    AST.Printer.tabSize        - indent of inner structs
    AST.Printer.SyntaxKind     - Array of Arrays of strings with ts.SyntaxKind names
    AST.Printer.File2String    - converts ts.SourceFile to string
    AST.Printer.Convert2String - compiles files with options and converts them to string
*/

import * as ts from "typescript";
import * as path from "path";

export namespace AST {
    export namespace Printer {
        export let tabSize = 2;
        export let SyntaxKind = Fill();

        function Fill(): Array<Array<string>> {
            let retVal: Array<Array<string>> = [];

            for (const [key, value] of Object.entries(ts.SyntaxKind)) {
                // ex.: '330': SyntheticReferenceExpression
                if (typeof value === "string") {
                    let index: number = +key;
                    if (!retVal[index]) {
                        retVal[index] = [];
                    }

                    if (!retVal[index].includes(value)) {
                        retVal[index].push(value);
                    }
                }
                // ex.: AmpersandAmpersandToken: 55
                if (typeof value === "number") {
                    let index: number = +value;
                    if (!retVal[index]) {
                        retVal[index] = [];
                    }

                    if (!retVal[index].includes(key)) {
                        retVal[index].push(key);
                    }
                }
            }

            return retVal;
        }

        function isArray(node: any): node is ts.Node[] {
            return ((typeof (node) === "object") && (node instanceof Array));
        }

        function isNode(node: any): node is ts.Node {
            return ((typeof (node) === "object") && ("kind" in node));
        }

        function isFile(node: any): node is ts.SourceFile {
            return ((typeof (node) === "object") && ("kind" in node) && (node.kind == ts.SyntaxKind.SourceFile));
        }

        function Array2String(name: (undefined | string), array: ts.Node[], tab: number): string {
            const repeat = ' '.repeat(tab);
            let retVal = "";
            let subStr = "";

            if (name) {
                retVal += repeat + name + ':' + '\n';
            }

            for (const [key, value] of Object.entries(array)) {
                subStr += Node2String(undefined, value, tab + tabSize);
            }

            if (subStr) {
                retVal += repeat + '[' + '\n';
                retVal += subStr;
                retVal += repeat + ']' + '\n';
            } else {
                retVal += repeat + '[' + ']' + '\n';
            }

            return retVal;
        }

        function Node2String(name: (undefined | string), node: ts.Node, tab: number): string {
            if (!isNode(node)) {
                return "";
            }

            const repeat: string = ' '.repeat(tab);
            let retVal: string = "";
            let subStr: string = "";
            const kind: number = +node.kind;
            const kindNames: Array<string> = SyntaxKind[node.kind];

            if (name) {
                retVal += repeat + name + ':' + '\n';
            }

            subStr = kindNames.join('/')
            retVal += repeat + subStr + ',' + ' ' + kind + '\n';
            subStr = ""

            for (const [key, value] of Object.entries(node)) {
                if (isArray(value)) {
                    subStr += Array2String(key, value, tab + tabSize);
                }

                if (isNode(value)) {
                    subStr += Node2String(key, value, tab + tabSize);
                }
            }

            if (subStr) {
                retVal += repeat + '{' + '\n';
                retVal += subStr;
                retVal += repeat + '}' + '\n';
            } else {
                retVal += repeat + '{' + '}' + '\n';
            }

            return retVal;
        }

        export function File2String(name: (undefined | string), file: ts.SourceFile, tab: number): string {
            const repeat = ' '.repeat(tab);
            let retVal = "";
            let subStr = "";

            if (name) {
                retVal += repeat + "File " + name + ':' + '\n';
            }

            for (const value of file.statements) {
                if (isNode(value)) {
                    subStr += Node2String(undefined, value, tab + tabSize);
                }
            }

            if (subStr) {
                retVal += repeat + '[' + '\n';
                retVal += subStr;
                retVal += repeat + ']' + '\n';
            } else {
                retVal += repeat + '[' + ']' + '\n';
            }

            return retVal;
        }

        export function Convert2String(fileNames: string[], options: ts.CompilerOptions): string {
            const program = ts.createProgram(fileNames, options);
            const files = program.getSourceFiles();
            let retVal = "";

            for (const file of files) {
                if (fileNames.includes(file.fileName)) {
                    retVal += File2String(file.fileName, file, 0);
                    retVal += '\n';
                }
            }

            return retVal;
        }
    }
}

function run(args: string[], useDefault?: boolean): void {
    let defaultOptions = {
        outDir: "../build",
        allowJs: true,
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        strictNullChecks: true
    };

    let parsed = ts.parseCommandLine(args);

    parsed.fileNames = parsed.fileNames.map(function(file) {
        return path.resolve(file);
    });

    if (useDefault === true)
        parsed.options = Object.assign(defaultOptions, parsed.options)

    console.log(AST.Printer.Convert2String(parsed.fileNames, parsed.options));
}

run(process.argv.slice(2), true);
