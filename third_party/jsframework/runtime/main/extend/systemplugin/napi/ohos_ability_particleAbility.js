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
import { DataAbilityHelper } from "./ability/dataAbilityHelper"

export function mockParticleAbility() {
  const particleAbility = {
    startAbility: function (...args) {
      console.warn("ability.particleAbility.startAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    terminateSelf: function (...args) {
      console.warn("ability.particleAbility.terminateSelf interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    acquireDataAbilityHelper: function (...args) {
      console.warn("ability.particleAbility.acquireDataAbilityHelper interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return DataAbilityHelper;
    },
    connectAbility: function (...args) {
      console.warn("ability.particleAbility.connectAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    disconnectAbility: function (...args) {
      console.warn("ability.particleAbility.disconnectAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    startBackgroundRunning: function (...args) {
      console.warn("ability.particleAbility.startBackgroundRunning interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    cancelBackgroundRunning: function (...args) {
      console.warn("ability.particleAbility.cancelBackgroundRunning interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    ErrorCode : {
      INVALID_PARAMETER: -1,
    }
  }
  return particleAbility;
}