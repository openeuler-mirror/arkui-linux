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
import { FormInfo } from "./ohos_application_formInfo"

export function mockFormProvider() {
  const formProvider = {
    setFormNextRefreshTime: function (...args) {
      console.warn('formProvider.setFormNextRefreshTime interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      const len = args.length;
      // callback
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    updateForm: function (...args) {
      console.warn('formProvider.updateForm interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      const len = args.length;
      // callback
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getFormsInfo: function (...args) {
      console.warn('formProvider.getFormsInfo interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      var array = new Array();
      array.push(FormInfo);
      // promise without option.
      if (len == 0) {
        return new Promise((resolve) => {
          resolve(array);
        });
      }
      // callback
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array);
      } else {
        return new Promise((resolve) => {
          resolve(array);
        });
      }
    },
    requestPublishForm: function (...args) {
      console.warn('formProvider.requestPublishForm interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      const len = args.length;
      // callback
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock);
        });
      }
    },
    isRequestPublishFormSupported: function (...args) {
      console.warn('formProvider.isRequestPublishFormSupported interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      // callback
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    }
  }
  return formProvider;
}