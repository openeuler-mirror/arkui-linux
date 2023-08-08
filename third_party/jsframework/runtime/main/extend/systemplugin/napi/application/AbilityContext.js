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

import { paramMock } from "../../utils"
import { ContextClass } from "./Context"
import { Configuration } from "../ohos_application_Configuration"
import { Caller } from "../ohos_application_Ability"
import { AbilityInfo } from "../bundle/abilityInfo"
import { HapModuleInfo } from "../bundle/hapModuleInfo"
import { AbilityResult } from "../ability/abilityResult"
import { PermissionRequestResultClass } from "./PermissionRequestResult"

export const AbilityContextClass = class AbilityContext extends ContextClass {
  constructor() {
    super();
    console.warn('Ability.AbilityContext.constructor interface mocked in the Previewer. How this interface works on' +
      ' the Previewer may be different from that on a real device.');
    this.abilityInfo = AbilityInfo;
    this.currentHapModuleInfo = HapModuleInfo;
    this.config = Configuration;
    this.startAbility = function (...args) {
      console.warn("Ability.AbilityContext.startAbility interface mocked in the Previewer." +
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
    this.startAbilityByCall = function (...args) {
      console.warn("Ability.AbilityContext.startAbilityByCall interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return new Promise((resolve, reject) => {
        resolve(Caller);
      })
    };
    this.startAbilityWithAccount = function (...args) {
      console.warn("Ability.AbilityContext.startAbilityWithAccount interface mocked in the Previewer." +
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
    this.startAbilityForResult = function (...args) {
      console.warn("Ability.AbilityContext.startAbilityForResult interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AbilityResult);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AbilityResult);
        })
      }
    };
    this.startAbilityForResultWithAccount = function (...args) {
      console.warn("Ability.AbilityContext.startAbilityForResultWithAccount interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AbilityResult);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AbilityResult);
        })
      }
    };
    this.startServiceExtensionAbility = function (...args) {
      console.warn("Ability.AbilityContext.startServiceExtensionAbility interface mocked in the Previewer." +
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
    this.startServiceExtensionAbilityWithAccount = function (...args) {
      console.warn("Ability.AbilityContext.startServiceExtensionAbilityWithAccount interface mocked in the Previewer." +
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
    this.stopServiceExtensionAbility = function (...args) {
      console.warn("Ability.AbilityContext.stopServiceExtensionAbility interface mocked in the Previewer." +
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
    this.stopServiceExtensionAbilityWithAccount = function (...args) {
      console.warn("Ability.AbilityContext.stopServiceExtensionAbilityWithAccount interface mocked in the Previewer." +
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
    this.terminateSelf = function (...args) {
      console.warn("Ability.AbilityContext.terminateSelf interface mocked in the Previewer." +
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
    this.terminateSelfWithResult = function (...args) {
      console.warn("Ability.AbilityContext.terminateSelfWithResult interface mocked in the Previewer." +
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
    this.connectAbility = function (...args) {
      console.warn("Ability.AbilityContext.connectAbility interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.connectAbilityWithAccount = function (...args) {
      console.warn("Ability.AbilityContext.connectAbilityWithAccount interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.disconnectAbility = function (...args) {
      console.warn("Ability.AbilityContext.disconnectAbility interface mocked in the Previewer." +
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
    this.setMissionLabel = function (...args) {
      console.warn("Ability.AbilityContext.setMissionLabel interface mocked in the Previewer." +
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
    this.setMissionIcon = function (...args) {
      console.warn("Ability.AbilityContext.setMissionIcon interface mocked in the Previewer." +
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
    this.requestPermissionsFromUser = function (...args) {
      console.warn("Ability.AbilityContext.requestPermissionsFromUser interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new PermissionRequestResultClass());
      } else {
        return new Promise((resolve, reject) => {
          resolve( new PermissionRequestResultClass());
        })
      }
    };
    this.restoreWindowStage = function (...args) {
      console.warn("Ability.AbilityContext.restoreWindowStage interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    };
    this.isTerminating = function () {
      console.warn("Ability.AbilityContext.isTerminating interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
  }
}
export function mockAbilityContext() {
  return new AbilityContextClass();
}
