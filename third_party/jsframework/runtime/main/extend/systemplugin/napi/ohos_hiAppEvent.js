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

function buildMockInfo(interfaceName) {
  return interfaceName + " interface mocked in the Previewer. How this interface works on the Previewer" +
    " may be different from that on a real device.";
}

const AppEventPackage = {
  packageId: paramMock.paramNumberMock,
  row: paramMock.paramNumberMock,
  size: paramMock.paramNumberMock,
  data: paramMock.paramArrayMock
}

const AppEventPackageHolderClass = class AppEventPackageHolder {
  constructor(...args) {
    console.warn(buildMockInfo("AppEventPackageHolder.constructor"));
    this.setSize = function (...arg) {
      console.warn(buildMockInfo("AppEventPackageHolder.setSize"));
    };
    this.takeNext = function (...arg) {
      console.warn(buildMockInfo("AppEventPackageHolder.takeNext"));
      return AppEventPackage;
    };
  }
}

export function mockHiAppEvent() {
  const EventTypeMock = {
    FAULT: paramMock.paramNumberMock,
    STATISTIC: paramMock.paramNumberMock,
    SECURITY: paramMock.paramNumberMock,
    BEHAVIOR: paramMock.paramNumberMock
  }
  const EventMock = {
    USER_LOGIN: paramMock.paramStringMock,
    USER_LOGOUT: paramMock.paramStringMock,
    DISTRIBUTED_SERVICE_START: paramMock.paramStringMock
  }
  const ParamMock = {
    USER_ID: paramMock.paramStringMock,
    DISTRIBUTED_SERVICE_NAME: paramMock.paramStringMock,
    DISTRIBUTED_SERVICE_INSTANCE_ID: paramMock.paramStringMock
  }

  const hiAppEvent = {
    EventType: EventTypeMock,
    Event: EventMock,
    Param: ParamMock,
    AppEventPackageHolder: AppEventPackageHolderClass,
    write: function (...args) {
      console.warn(buildMockInfo("hiAppEvent.write"))
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    configure: function (...args) {
      console.warn(buildMockInfo("hiAppEvent.configure"));
      return paramMock.paramBooleanMock
    },
    addWatcher: function (...args) {
      console.warn(buildMockInfo("hiAppEvent.addWatcher"));
      return new AppEventPackageHolderClass();
    },
    removeWatcher: function (...args) {
      console.warn(buildMockInfo("hiAppEvent.removeWatcher"));
    },
    clearData: function (...args) {
      console.warn(buildMockInfo("hiAppEvent.clearData"));
    }
  }
  return hiAppEvent
}
