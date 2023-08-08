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

export function mockWifiExt() {
  const PowerModel = {
    SLEEPING : 0,
    GENERAL : 1,
    THROUGH_WALL : 2,
  }

  const wifiext = {
    enableHotspot: function (...args) {
      console.warn("wifiext.enableHotspot interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    disableHotspot: function (...args) {
      console.warn("wifiext.disableHotspot interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getSupportedPowerModel: function (...args) {
      console.warn("wifiext.getSupportedPowerModel interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [PowerModel.GENERAL])
      } else {
        return new Promise((resolve) => {
          resolve([PowerModel.GENERAL])
        })
      }
    },

    getPowerModel: function (...args) {
      console.warn("wifiext.getPowerModel interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PowerModel.GENERAL)
      } else {
        return new Promise((resolve) => {
          resolve(PowerModel.GENERAL)
        })
      }
    },

    setPowerModel: function (...args) {
      console.warn("wifiext.setPowerModel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
  }
  return wifiext;
}
