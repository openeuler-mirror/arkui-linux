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

import * as asthelper from "./asthelper";

function testCreateAstFromSnippet() {
    let ast = asthelper.creatAstFromSnippet("var aaa = 10");
    console.log(ast.getText());
}
function testCreateAstFromFile() {
    const absolutePath = __dirname + "/example_asthelper.js"
    let ast = asthelper.creatAstFromFile(absolutePath);
    console.log(ast.getText());
}

testCreateAstFromSnippet();
testCreateAstFromFile();
