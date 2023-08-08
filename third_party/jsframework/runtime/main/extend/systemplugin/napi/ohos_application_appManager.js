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
import { AppStateDataClass as _AppStateData } from "./application/AppStateData"
import { ProcessRunningInfo } from "./application/ProcessRunningInfo"
import { AppStateDataClass as _AbilityStateData } from "./application/AppStateData"
import { ApplicationStateObserverClass as _ApplicationStateObserver } from "./application/ApplicationStateObserver"
import { ProcessDataClass as _ProcessData } from "./application/ProcessData"

export function mockAppManager() {
  const appManager = {
    registerApplicationStateObserver: function (...args) {
      console.warn('appManager.registerApplicationStateObserver interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    unregisterApplicationStateObserver: function (...args) {
      console.warn('appManager.unregisterApplicationStateObserver interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getForegroundApplications: function (...args) {
      console.warn('appManager.getForegroundApplications interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [new _AppStateData()]);
      } else {
        return new Promise((resolve) => {
          resolve([new _AppStateData()]);
        });
      }
    },
    killProcessWithAccount: function (...args) {
      console.warn('appManager.killProcessWithAccount interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    isRunningInStabilityTest: function (...args) {
      console.warn('appManager.isRunningInStabilityTest interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getProcessRunningInfos: function (...args) {
      console.warn('appManager.getProcessRunningInfos interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [ProcessRunningInfo]);
      } else {
        return new Promise((resolve) => {
          resolve([ProcessRunningInfo]);
        });
      }
    },
    killProcessesByBundleName: function (...args) {
      console.warn('appManager.killProcessesByBundleName interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    clearUpApplicationData: function (...args) {
      console.warn('appManager.clearUpApplicationData interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    isRamConstrainedDevice: function (...args) {
      console.warn('appManager.isRamConstrainedDevice interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getAppMemorySize: function (...args) {
      console.warn('appManager.getAppMemorySize interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    AbilityStateData: new _AbilityStateData(),
    AppStateData: new _AppStateData(),
    ApplicationStateObserver: new _ApplicationStateObserver(),
    ProcessData: new _ProcessData(),
    ProcessRunningInfo
  }
  return appManager
}