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

import { paramMock } from "../utils"
import { AbilityContextClass } from "./application/AbilityContext"
import { WantClass } from "./ohos_application_Want"
import { OnContinueResult } from "./ohos_application_AbilityConstant"
import { MessageParcelClass } from "./ohos_rpc"

export const Caller = {
  call: function (...args) {
    console.warn("Caller.call interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
    return new Promise((resolve, reject) => {
      resolve();
    })
  },
  callWithResult: function (...args) {
    console.warn("Caller.callWithResult interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
    return new Promise((resolve, reject) => {
      resolve(new MessageParcelClass());
    })
  },
  release: function () {
    console.warn("Caller.release interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  },
  onRelease: function (...args) {
    console.warn("Caller.onRelease interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  },
}
export const Callee = {
  on: function (...args) {
    console.warn("Ability.calleeClass.on interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  },
  off: function (...args) {
    console.warn("Ability.calleeClass.off interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  },
}
export const AbilityClass = class Ability {
  constructor() {
    console.warn('application.Ability.constructor interface mocked in the Previewer. How this interface works on' +
      ' the Previewer may be different from that on a real device.');
    this.context = new AbilityContextClass();
    this.launchWant = new WantClass();
    this.lastRequestWant = new WantClass();
    this.callee = Callee;
    this.onCreate = function (...args) {
      console.warn("application.Ability.onCreate interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onWindowStageCreate = function (...args) {
      console.warn("application.Ability.onWindowStageCreate interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onWindowStageDestroy = function () {
      console.warn("application.Ability.onWindowStageDestroy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onWindowStageRestore = function (...args) {
      console.warn("application.Ability.onWindowStageRestore interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onDestroy = function () {
      console.warn("application.Ability.onDestroy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onForeground = function () {
      console.warn("application.Ability.onForeground interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onBackground = function () {
      console.warn("application.Ability.onBackground interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onContinue = function (...args) {
      console.warn("application.Ability.onContinue interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return OnContinueResult;
    };
    this.onNewWant = function (...args) {
      console.warn("application.Ability.onNewWant interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.onConfigurationUpdated = function (...args) {
      console.warn("application.Ability.onConfigurationUpdated interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.dump = function (...args) {
      console.warn("application.Ability.dump interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return [paramMock.paramStringMock];
    };
    this.onMemoryLevel = function (...args) {
      console.warn("application.Ability.onMemoryLevel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
  }
}
export function mockAbility() {
  return new AbilityClass();
}
