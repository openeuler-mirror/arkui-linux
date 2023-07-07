/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

import { FormState } from "./ohos_application_formInfo"
import { FormExtensionContextClass as FormExtensionContext } from "./application/FormExtensionContext"
import { FormBindingData } from "./ohos_application_formBindingData"

export function mockFormExtension() {
  const formExtensionClass = class formExtension {
    constructor() {
      console.warn('application.formExtension.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.context = new FormExtensionContext();
      this.onCreate = function (...args) {
        console.warn("application.formExtension.onCreate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return FormBindingData
      };
      this.onCastToNormal = function (...args) {
        console.warn("application.formExtension.onCastToNormal interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onUpdate = function (...args) {
        console.warn("application.formExtension.onUpdate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onVisibilityChange = function (...args) {
        console.warn("application.formExtension.onVisibilityChange interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onEvent = function (...args) {
        console.warn("application.formExtension.onEvent interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onDestroy = function (...args) {
        console.warn("application.formExtension.onDestroy interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onConfigurationUpdated = function (...args) {
        console.warn("application.formExtension.onConfigurationUpdated interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAcquireFormState = function (...args) {
        console.warn("application.formExtension.onAcquireFormState interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return FormState;
      };
      this.onShare = function (...args) {
        console.warn("application.formExtension.onShare interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return {"key": "unknow any"};
      };
    }
  }
  return new formExtensionClass();
}