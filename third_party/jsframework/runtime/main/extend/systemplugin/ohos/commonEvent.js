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

export function mockCommonEvent() {
  const CommonEventSubscriberMock = {
    getCode: function (...args) {
      console.warn("CommonEventSubscriber.getCode interface mocked in the Previewer. How this interface works on the" +
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
    setCode: function (...args) {
      console.warn("CommonEventSubscriber.setCode interface mocked in the Previewer. How this interface works on the" +
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
    getData: function (...args) {
      console.warn("CommonEventSubscriber.getData interface mocked in the Previewer. How this interface works on the" +
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
    setData: function (...args) {
      console.warn("CommonEventSubscriber.setData interface mocked in the Previewer. How this interface works on the" +
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
    setCodeAndData: function (...args) {
      console.warn("CommonEventSubscriber.setCodeAndData interface mocked in the Previewer. How this interface works on the" +
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
    isOrderedCommonEvent: function (...args) {
      console.warn("CommonEventSubscriber.isOrderedCommonEvent interface mocked in the Previewer. How this interface works on the" +
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
    isStickyCommonEvent: function (...args) {
      console.warn("CommonEventSubscriber.isStickyCommonEvent interface mocked in the Previewer. How this interface works on the" +
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
    abortCommonEvent: function (...args) {
      console.warn("CommonEventSubscriber.abortCommonEvent interface mocked in the Previewer. How this interface works on the" +
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
    clearAbortCommonEvent: function (...args) {
      console.warn("CommonEventSubscriber.clearAbortCommonEvent interface mocked in the Previewer. How this interface works on the" +
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
    getAbortCommonEvent: function (...args) {
      console.warn("CommonEventSubscriber.getAbortCommonEvent interface mocked in the Previewer. How this interface works on the" +
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
    getSubscribeInfo: function (...args) {
      console.warn("CommonEventSubscriber.getSubscribeInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonEventSubscribeInfoMock);
      } else {
        return new Promise((resolve) => {
          resolve(CommonEventSubscribeInfoMock);
        });
      }
    }
  }
  const CommonEventDataMock = {
    event: '[PC preview] unknow event',
    bundleName: '[PC preview] unknow bundleName',
    code: '[PC preview] unknow code',
    data: '[PC preview] unknow data',
    parameters: '[PC preview] unknow parameters',
  }
  const CommonEventSubscribeInfoMock = {
    events: '[PC preview] unknow events',
    publisherPermission: '[PC preview] unknow publisherPermission',
    publisherDeviceId: '[PC preview] unknow publisherDeviceId',
    userId: '[PC preview] unknow userId',
    priority: '[PC preview] unknow priority',
  }
  global.ohosplugin.commonEvent = {
    publish: function (...args) {
      console.warn("commonEvent.publish interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      }
    },
    createSubscriber: function (...args) {
      console.warn("commonEvent.createSubscriber interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonEventSubscriberMock);
      } else {
        return new Promise((resolve) => {
          resolve(CommonEventSubscriberMock);
        });
      }
    },
    subscribe: function (...args) {
      console.warn("commonEvent.subscribe interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonEventDataMock);
      }
    },
    unsubscribe: function (...args) {
      console.warn("commonEvent.unsubscribe interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      }
    },
  }

}
