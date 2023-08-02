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

import { MandatoryNewTarget } from "../variable";
import * as ts from "typescript";
import { Compiler } from "../compiler";
import * as jshelpers from "../jshelpers";

export function compileMetaProperty(expr: ts.MetaProperty, compiler: Compiler) {
    let curScope = compiler.getCurrentScope();
    let id = jshelpers.getTextOfIdentifierOrLiteral(expr.name);
    if (id == "target") {
        let { scope, level, v } = curScope.find(MandatoryNewTarget);

        if (!v) {
            throw new Error("fail to access new.target");
        } else {
            compiler.loadTarget(expr, { scope, level, v });
        }
        return;
    }
    // support meta.property further
}