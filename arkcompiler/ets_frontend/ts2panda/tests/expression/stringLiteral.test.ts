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

import { expect } from 'chai';
import * as ts from "typescript";
import { compileStringLiteral } from "../../src/expression/stringLiteral";
import {
    LdaStr
} from "../../src/irnodes";
import { PandaGen } from "../../src/pandagen";
import { checkInstructions } from "../utils/base";
import { creatAstFromSnippet } from "../utils/asthelper";

describe("compileStringLiteral", function () {
    it("i am a string", function () {
        let pandaGen = new PandaGen("ignored", creatAstFromSnippet("i am a string"), 0, undefined);
        let node: ts.StringLiteral = ts.createStringLiteral("i am a string");
        compileStringLiteral(pandaGen, node);
        let insns = pandaGen.getInsns();
        let expected = [new LdaStr("i am a string")];
        expect(checkInstructions(insns, expected)).to.be.true;
    });
})