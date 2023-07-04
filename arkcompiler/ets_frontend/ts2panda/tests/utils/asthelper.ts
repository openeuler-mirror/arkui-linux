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

import { readFileSync } from "fs";
import * as ts from "typescript";

export function creatAstFromSnippet(snippet: string): ts.SourceFile {
    let sourceFile = ts.createSourceFile("snippet.ts", snippet, ts.ScriptTarget.ES2015, true);
    return sourceFile;
}

/** It would be tricky here to use relative path, so please use an absolute path instead.
 *  For how to use this function, please refer to example_asthelper.ts
 */
export function creatAstFromFile(fileName: string): ts.SourceFile {
    let sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, true);
    return sourceFile;
}

module.exports = {
    creatAstFromSnippet: creatAstFromSnippet,
    creatAstFromFile: creatAstFromFile
}
