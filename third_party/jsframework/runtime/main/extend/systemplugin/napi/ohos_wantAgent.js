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

import { paramMock } from "../utils"
import { WantClass } from "./ohos_application_Want"

export const WantAgentFlags = {
  ONE_TIME_FLAG: 0,
  NO_BUILD_FLAG: 1,
  CANCEL_PRESENT_FLAG: 2,
  UPDATE_PRESENT_FLAG: 3,
  CONSTANT_FLAG: 4,
  REPLACE_ELEMENT: 5,
  REPLACE_ACTION: 6,
  REPLACE_URI: 7,
  REPLACE_ENTITIES: 8,
  REPLACE_BUNDLE: 9
}
export const OperationType = {
  UNKNOWN_TYPE: 0,
  START_ABILITY: 1,
  START_ABILITIES: 2,
  START_SERVICE: 3,
  SEND_COMMON_EVENT: 4
}
export const CompleteData = {
  info: WantAgent,
  want: new WantClass(),
  finalCode: '[PC preview] unknow finalCode',
  finalData: '[PC preview] unknow finalData',
  extraInfo: {},
}
export const WantAgent = {}
export function mockWantAgent() {
  const wantAgent = {
    getBundleName: function (...args) {
      console.warn("wantAgent.getBundleName interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock);
        });
      }
    },
    getUid: function (...args) {
      console.warn("wantAgent.getUid interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    getWant: function (...args) {
      console.warn("wantAgent.getWant interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new WantClass());
      } else {
        return new Promise((resolve) => {
          resolve(new WantClass());
        });
      }
    },
    cancel: function (...args) {
      console.warn("wantAgent.cancel interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    trigger: function (...args) {
      console.warn("wantAgent.trigger interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CompleteData);
      }
    },
    equal: function (...args) {
      console.warn("wantAgent.equal interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getWantAgent: function (...args) {
      console.warn("wantAgent.getWantAgent interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, WantAgent);
      } else {
        return new Promise((resolve) => {
          resolve(WantAgent);
        });
      }
    },
    getOperationType: function (...args) {
      console.warn("wantAgent.getOperationType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
  }
  return wantAgent
}
