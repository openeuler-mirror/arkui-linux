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

export function mockHiTraceChain() {
  const HiTraceFlag = {
    DEFAULT: 0,
    INCLUDE_ASYNC: 1,
    DONOT_CREATE_SPAN: 1 << 1,
    TP_INFO: 1 << 2,
    NO_BE_INFO: 1 << 3,
    DISABLE_LOG: 1 << 4,
    FAILURE_TRIGGER: 1 << 5,
    D2D_TP_INFO: 1 << 6
  }
  const HiTraceTracepointType = {
    CS: 0,
    CR: 1,
    SS: 2,
    SR: 3,
    GENERAL: 4
  }
  const HiTraceCommunicationMode = {
    DEFAULT: 0,
    THREAD: 1,
    PROCESS: 2,
    DEVICE: 3
  }
  const HiTraceId = {
    chainId: paramMock.paramNumberMock,
    spanId: paramMock.paramNumberMock,
    parentSpanId: paramMock.paramNumberMock,
    flags: paramMock.paramNumberMock
  }
  const hiTraceChain = {
    HiTraceFlag,
    HiTraceTracepointType,
    HiTraceCommunicationMode,
    HiTraceId,
    begin: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.begin"))
      return HiTraceId;
    },
    end: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.end"))
    },
    getId: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.getId"))
      return HiTraceId;
    },
    setId: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.setId"))
    },
    clearId: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.clearId"))
    },
    createSpan: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.createSpan"))
      return HiTraceId;
    },
    tracepoint: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.tracepoint"))
    },
    isValid: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.isValid"))
      return paramMock.paramBooleanMock;
    },
    isFlagEnabled: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.isFlagEnabled"))
      return paramMock.paramBooleanMock;
    },
    enableFlag: function(...arg) {
      console.warn(buildMockInfo("hiTraceChain.enableFlag"))
    },
  }
  return hiTraceChain
}