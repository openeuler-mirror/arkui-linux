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
import { AbilityRunningInfo as _AbilityRunningInfo } from "./application/AbilityRunningInfo"
import { ExtensionRunningInfo as _ExtensionRunningInfo } from "./application/ExtensionRunningInfo"
import { ElementName } from "./bundle/elementName"

export const AbilityState = {
  INITIAL: 0,
  FOREGROUND: 9,
  BACKGROUND: 10,
  FOREGROUNDING: 11,
  BACKGROUNDING: 12
}
export function mockAbilityManager() {
  const abilityManager = {
    AbilityState,
    updateConfiguration: function (...args) {
      console.warn('abilityManager.updateConfiguration interface mocked in the Previewer. How this interface works on the' +
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
    getAbilityRunningInfos: function (...args) {
      console.warn('abilityManager.getAbilityRunningInfos interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [_AbilityRunningInfo]);
      } else {
        return new Promise((resolve) => {
          resolve([_AbilityRunningInfo]);
        });
      }
    },
    getExtensionRunningInfos: function (...args) {
      console.warn('abilityManager.getExtensionRunningInfos interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [_ExtensionRunningInfo]);
      } else {
        return new Promise((resolve) => {
          resolve([_ExtensionRunningInfo]);
        });
      }
    },
    getTopAbility: function (...args) {
      console.warn('abilityManager.getTopAbility interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ElementName);
      } else {
        return new Promise((resolve) => {
          resolve(ElementName);
        });
      }
    },
    AbilityRunningInfo: _AbilityRunningInfo,
    ExtensionRunningInfo: _ExtensionRunningInfo
  }
  return abilityManager
}