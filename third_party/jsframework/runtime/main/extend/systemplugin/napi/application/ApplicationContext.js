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

import { paramMock } from "../../utils"
import { ContextClass } from "./Context"

export const ApplicationContextClass = class ApplicationContext extends ContextClass {
    constructor() {
      super();
      console.warn('ApplicationContext.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.registerAbilityLifecycleCallback = function (...args) {
        console.warn("ApplicationContext.registerAbilityLifecycleCallback interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        return paramMock.paramNumberMock
      };
      this.unregisterAbilityLifecycleCallback = function (...args) {
        console.warn("ApplicationContext.unregisterAbilityLifecycleCallback interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve();
          })
        }
      };
      this.registerEnvironmentCallback = function (...args) {
        console.warn("ApplicationContext.registerEnvironmentCallback interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
          return paramMock.paramNumberMock
      };
      this.unregisterEnvironmentCallback = function (...args) {
        console.warn("ApplicationContext.unregisterEnvironmentCallback interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve();
          })
        }
      };
    }
  }