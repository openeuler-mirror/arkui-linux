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

export function mockAbilityLifecycleCallback() {
  const AbilityLifecycleCallbackClass = class AbilityLifecycleCallback {
    constructor() {
      console.warn('application.AbilityLifecycleCallback.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.onAbilityCreate = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityCreate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAbilityWindowStageCreate = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityWindowStageCreate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAbilityWindowStageDestroy = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityWindowStageDestroy interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAbilityDestroy = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityDestroy interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAbilityForeground = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityForeground interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAbilityBackground = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityBackground interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAbilityContinue = function (...args) {
        console.warn("application.AbilityLifecycleCallback.onAbilityContinue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
    }
  }
  return new AbilityLifecycleCallbackClass();
}