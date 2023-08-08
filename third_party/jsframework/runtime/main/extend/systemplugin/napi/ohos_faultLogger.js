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

function buildMockInfo(interfaceName) {
  return interfaceName + " interface mocked in the Previewer. How this interface works on the Previewer" +
    " may be different from that on a real device."
}

export function mockFaultLogger() {
  const FaultType = {
    NO_SPECIFIC : 0,
    CPP_CRASH : 2,
    JS_CRASH : 3,
    APP_FREEZE : 4
  }
  const FaultLogInfo = {
    pid: "[PC Preview] unknow pid",
    uid: "[PC Preview] unknow uid",
    type: FaultType,
    timestamp: "[PC Preview] unknow timestamp",
    reason: "[PC Preview] unknow reason",
    module: "[PC Preview] unknow module",
    summary: "[PC Preview] unknow summary",
    fullLog: "[PC Preview] unknow fullLog",
  }
  const FaultLogger = {
    FaultType,
    FaultLogInfo,
    querySelfFaultLog: function(...args) {
      console.warn(buildMockInfo("FaultLogger.querySelfFaultLog"))
      var array = new Array()
      array.push(FaultLogInfo)
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
  }
  return FaultLogger
}