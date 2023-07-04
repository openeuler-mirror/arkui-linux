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
import { Compiler } from "../compiler";
import * as jshelpers from "../jshelpers";
import {
    DiagnosticCode,
    DiagnosticError
} from "../diagnostic";

export enum RegExpFlags {
    FLAG_GLOBAL = (1 << 0),
    FLAG_IGNORECASE = (1 << 1),
    FLAG_MULTILINE = (1 << 2),
    FLAG_DOTALL = (1 << 3),
    FLAG_UTF16 = (1 << 4),
    FLAG_STICKY = (1 << 5)
}


export function compileRegularExpressionLiteral(compiler: Compiler, regexp: ts.RegularExpressionLiteral) {
    let pandaGen = compiler.getPandaGen();
    let regexpText = regexp.text;
    let regexpPattern = regexpText;
    let regexpFlags = "";
    let firstSlashPos = regexpText.indexOf('/');
    let lastSlashPos = regexpText.lastIndexOf('/');
    if (firstSlashPos == -1 ||
        lastSlashPos == -1 ||
        firstSlashPos == lastSlashPos) {
        throw new DiagnosticError(regexp, DiagnosticCode.Incorrect_regular_expression);
    }
    regexpPattern = regexpText.substring(firstSlashPos + 1, lastSlashPos);
    regexpFlags = regexpText.substring(lastSlashPos + 1);
    let flagsBits = updateExpressionFlags(regexpFlags, regexp);
    pandaGen.createRegExpWithLiteral(regexp, regexpPattern, flagsBits);

}

function updateExpressionFlags(regexpFlags: string, regexp: ts.RegularExpressionLiteral) {
    let flagsBits: number = 0;
    let flagsBitsTemp: number = 0;
    for (let idx = 0; idx < regexpFlags.length; idx++) {
        switch (regexpFlags[idx]) {
            case 'g':
                flagsBitsTemp = RegExpFlags.FLAG_GLOBAL;
                break;
            case 'i':
                flagsBitsTemp = RegExpFlags.FLAG_IGNORECASE;
                break;
            case 'm':
                flagsBitsTemp = RegExpFlags.FLAG_MULTILINE;
                break;
            case 's':
                flagsBitsTemp = RegExpFlags.FLAG_DOTALL;
                break;
            case 'u':
                flagsBitsTemp = RegExpFlags.FLAG_UTF16;
                break;
            case 'y':
                flagsBitsTemp = RegExpFlags.FLAG_STICKY;
                break;
            default:
                let file = jshelpers.getSourceFileOfNode(regexp);
                throw new DiagnosticError(regexp, DiagnosticCode.Invalid_regular_expression_flag_0, file, [regexpFlags[idx]]);
        }
        if ((flagsBits & flagsBitsTemp) != 0) {
            let file = jshelpers.getSourceFileOfNode(regexp);
            throw new DiagnosticError(regexp, DiagnosticCode.Invalid_regular_expression_flag_0, file, [regexpFlags[idx]]);
        }
        flagsBits |= flagsBitsTemp;
    }
    return flagsBits;
}
