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

import {
  expect
} from 'chai';
import 'mocha';
import { Returnundefined } from "../../src/irnodes";
import { compileMainSnippet } from "../utils/base";

describe("ReturnStatementTest", function () {
  it('exitGlobalScope', function () {
    let insns = compileMainSnippet("var a;");
    expect(insns[insns.length - 1] instanceof Returnundefined).to.be.true;
  });
});
