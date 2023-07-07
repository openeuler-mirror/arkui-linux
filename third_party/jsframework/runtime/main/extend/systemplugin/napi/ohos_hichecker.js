/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

import { paramMock } from "../utils"

export function mockHiChecker() {
  const RULE_CAUTION_PRINT_LOG = paramMock.paramNumberMock;
  const RULE_CAUTION_TRIGGER_CRASH = paramMock.paramNumberMock;
  const RULE_THREAD_CHECK_SLOW_PROCESS = paramMock.paramNumberMock;
  const RULE_CHECK_ABILITY_CONNECTION_LEAK = paramMock.paramNumberMock;
  const hichecker = {
    RULE_CAUTION_PRINT_LOG,
    RULE_CAUTION_TRIGGER_CRASH,
    RULE_THREAD_CHECK_SLOW_PROCESS,
    RULE_CHECK_ABILITY_CONNECTION_LEAK,
    addRule: function(...args) {
      console.warn("hichecker.addRule interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    },
    removeRule: function(...args) {
      console.warn("hichecker.removeRule interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    },
    getRule: function(...args) {
      console.warn("hichecker.getRule interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    contains: function(...args) {
      console.warn("hichecker.contains interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
  }
  return hichecker
}
