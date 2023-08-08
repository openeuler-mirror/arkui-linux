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
import { FormInfo, FormStateInfo } from "./ohos_application_formInfo"

export function mockFormHost() {
  const formHost = {
    deleteForm: function (...args) {
      console.warn('formHost.deleteForm interface mocked in the Previewer. How this interface works on the' +
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
    releaseForm: function (...args) {
      console.warn('formHost.releaseForm interface mocked in the Previewer. How this interface works on the' +
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
    requestForm: function (...args) {
      console.warn('formHost.requestForm interface mocked in the Previewer. How this interface works on the' +
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
    castTempForm: function (...args) {
      console.warn('formHost.castTempForm interface mocked in the Previewer. How this interface works on the' +
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
    notifyVisibleForms: function (...args) {
        console.warn('formHost.notifyVisibleForms interface mocked in the Previewer. How this interface works on the' +
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
    notifyInvisibleForms: function (...args) {
        console.warn('formHost.notifyInvisibleForms interface mocked in the Previewer. How this interface works on the' +
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
    enableFormsUpdate: function (...args) {
        console.warn('formHost.enableFormsUpdate interface mocked in the Previewer. How this interface works on the' +
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
    disableFormsUpdate: function (...args) {
        console.warn('formHost.disableFormsUpdate interface mocked in the Previewer. How this interface works on the' +
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
    isSystemReady: function (...args) {
        console.warn('formHost.isSystemReady interface mocked in the Previewer. How this interface works on the' +
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
    getAllFormsInfo: function (...args) {
        console.warn('formHost.getAllFormsInfo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, [FormInfo]);
        } else {
          return new Promise((resolve) => {
            resolve([FormInfo]);
          });
        }
    },
    getFormsInfo: function (...args) {
        console.warn('formHost.getFormsInfo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, [FormInfo]);
        } else {
          return new Promise((resolve) => {
            resolve([FormInfo]);
          });
        }
    },
    deleteInvalidForms: function (...args) {
        console.warn('formHost.deleteInvalidForms interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramNumberMock]);
        } else {
          return new Promise((resolve) => {
            resolve([paramMock.paramNumberMock]);
          });
        }
    },
    acquireFormState: function (...args) {
        console.warn('formHost.acquireFormState interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, FormStateInfo);
        } else {
          return new Promise((resolve) => {
            resolve(FormStateInfo);
          });
        }
    },
    on: function (...args) {
        console.warn("formHost.on interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.paramStringMock);
        }
    },
    off: function (...args) {
        console.warn("formHost.off interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.paramStringMock);
        }
    },
    notifyFormsVisible: function (...args) {
        console.warn('formHost.notifyFormsVisible interface mocked in the Previewer. How this interface works on the' +
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
    notifyFormsEnableUpdate: function (...args) {
        console.warn('formHost.notifyFormsEnableUpdate interface mocked in the Previewer. How this interface works on the' +
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
    shareForm: function (...args) {
      console.warn('formHost.shareForm interface mocked in the Previewer. How this interface works on the' +
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
  }
  return formHost
}