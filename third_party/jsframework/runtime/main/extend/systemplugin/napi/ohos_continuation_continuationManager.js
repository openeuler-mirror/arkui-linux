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

export function mockContinationManager() {
  const ContinuationMode = {
    COLLABORATION_SINGLE: 0,
    COLLABORATION_MULTIPLE: 1
  }
  const ContinuationExtraParams = {
    deviceType: [paramMock.paramStringMock],
    targetBundle: '[PC preview] unknown targetBundle',
    description: '[PC preview] unknown description',
    filter: '[PC preview] unknown filter',
    continuationMode: ContinuationMode,
    authInfo: '[PC preview] unknown authInfo'
  }

  const ContinuationResult = {
    id: '[PC preview] unknown id',
    type: '[PC preview] unknown type',
    name: '[PC preview] unknown name'
  }

  const continuationManager = {
    ContinuationMode,
    DeviceConnectState: {
      IDLE: 0,
      CONNECTING: 1,
      CONNECTED: 2,
      DISCONNECTING: 3
    },

    on: function (...args) {
      console.warn("continuationManager.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'deviceConnect') {
          args[len - 1].call(this, new Array(ContinuationResult));
        } else if (args[0] == 'deviceDisconnect') {
          args[len - 1].call(this, new Array(paramMock.paramStringMock));
        }
      }
    },

    off: function (...args) {
      console.warn("continuationManager.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },

    register: function (...args) {
      console.warn("continuationManager.register interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },

    unregister: function (...args) {
      console.warn("continuationManager.unregister interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },

    updateConnectStatus: function (...args) {
      console.warn("continuationManager.updateConnectStatus interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },

    startDeviceManager: function (...args) {
      console.warn("continuationManager.startDeviceManager interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },

    registerContinuation: function (...args) {
      console.warn("continuationManager.registerContinuation interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },

    unregisterContinuation: function (...args) {
      console.warn("continuationManager.unregisterContinuation interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },

    updateContinuationState: function (...args) {
      console.warn("continuationManager.updateContinuationState interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },

    startContinuationDeviceManager: function (...args) {
      console.warn("continuationManager.startContinuationDeviceManager interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
  }
  return continuationManager
}