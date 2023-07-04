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
import { PandaGen } from "../pandagen";
import { VReg } from "../irnodes";

function genRawString(pandaGen: PandaGen, expr: ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral) {
    let text = ""
    if (ts.isTemplateExpression(expr)) {
        text = expr.head.rawText!;
    } else {
        text = expr.rawText!;
    }

    text = text.replace(/(\r?\n|\r)/gm, "\n");
    pandaGen.loadAccumulatorString(expr, text);
}

function genCookedString(pandaGen: PandaGen, expr: ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral) {
    let text = ""
    if (ts.isTemplateExpression(expr)) {
        text = expr.head.text;
    } else {
        text = expr.text;
    }

    if (text.indexOf("\\u{") != -1) {
        text = eval("'" + text + "'");
        text = unescape(text.replace(/\u/g, "%u"));
    }

    pandaGen.loadAccumulatorString(expr, text);
}

function genTemplateArrayArg(pandaGen: PandaGen, expr: ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral, rawArr: VReg, cookedArr: VReg) {
    let spans = undefined;
    if (ts.isTemplateExpression(expr)) {
        spans = expr.templateSpans;
    }

    let elemIndex = 0;
    let indexReg = pandaGen.getTemp();
    let rawArrTmp = pandaGen.getTemp();
    let cookedArrTmp = pandaGen.getTemp();

    pandaGen.createEmptyArray(expr);
    pandaGen.storeAccumulator(expr, rawArrTmp);
    pandaGen.createEmptyArray(expr);
    pandaGen.storeAccumulator(expr, cookedArrTmp);
    pandaGen.loadAccumulatorInt(expr, elemIndex);
    pandaGen.storeAccumulator(expr, indexReg);

    genRawString(pandaGen, expr)
    pandaGen.storeObjProperty(expr, rawArrTmp, indexReg);

    genCookedString(pandaGen, expr)
    pandaGen.storeObjProperty(expr, cookedArrTmp, indexReg);
    ++elemIndex;

    if (spans && spans.length) {
        spans.forEach((span: ts.TemplateSpan) => {
            pandaGen.loadAccumulatorInt(span, elemIndex);
            pandaGen.storeAccumulator(span, indexReg);
            pandaGen.loadAccumulatorString(span, span.literal.rawText === undefined ? span.literal.text : span.literal.rawText);
            pandaGen.storeObjProperty(span, rawArrTmp, indexReg);

            pandaGen.loadAccumulatorString(span, span.literal.text);
            pandaGen.storeObjProperty(span, cookedArrTmp, indexReg);
            ++elemIndex;
        });
    }

    pandaGen.moveVreg(expr, rawArr, rawArrTmp);
    pandaGen.moveVreg(expr, cookedArr, cookedArrTmp);
    pandaGen.freeTemps(indexReg, rawArrTmp, cookedArrTmp);
}

export function getTemplateObject(pandaGen: PandaGen, expr: ts.TaggedTemplateExpression) {
    let templateArgs = pandaGen.getTemp();
    let indexReg = pandaGen.getTemp();
    let rawArr = pandaGen.getTemp();
    let cookedArr = pandaGen.getTemp();

    genTemplateArrayArg(pandaGen, expr.template, rawArr, cookedArr);
    pandaGen.createEmptyArray(expr);
    pandaGen.storeAccumulator(expr, templateArgs);

    let elemIndex = 0;
    pandaGen.loadAccumulatorInt(expr, elemIndex);
    pandaGen.storeAccumulator(expr, indexReg);
    pandaGen.loadAccumulator(expr, rawArr);
    pandaGen.storeObjProperty(expr, templateArgs, indexReg);
    ++elemIndex;
    pandaGen.loadAccumulatorInt(expr, elemIndex);
    pandaGen.storeAccumulator(expr, indexReg);
    pandaGen.loadAccumulator(expr, cookedArr);
    pandaGen.storeObjProperty(expr, templateArgs, indexReg);

    pandaGen.getTemplateObject(expr, templateArgs);
    pandaGen.freeTemps(templateArgs, indexReg, rawArr, cookedArr);
}
