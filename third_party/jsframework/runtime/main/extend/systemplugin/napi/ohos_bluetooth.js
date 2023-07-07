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

import { hasComplete } from "../utils"

export function mockBluetooth() {
  const bluetooth = {
    startBLEScan: function (...args) {
      console.warn("bluetooth.startBLEScan interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    stopBLEScan: function (...args) {
      console.warn("bluetooth.stopBLEScan interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    subscribeBLEFound: function (...args) {
      console.warn("bluetooth.subscribeBLEFound interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const options = {
        addrType: 'public',
        addr: 'xx:xx:xx:xx',
        rssi: 123,
        txpower: 'xxx',
        data: 'xxx'
      }
      const min = 1
      const max = 6
      clearInterval(this.unsubscribeBLE)
      delete this.unsubscribeBLE
      this.unsubscribeBLE = setInterval(() => {
        const randomAddr = Math.floor(Math.random() * (max - min)) + min
        const optionsArr = Array(randomAddr).fill(options)
        args[0].success(optionsArr)
      }, 1000)
    },
    unsubscribeBLEFound: function () {
      console.warn("bluetooth.unsubscribeBLEFound interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      clearInterval(this.unsubscribeBLE)
      delete this.unsubscribeBLE
    }
  }
  return bluetooth
}
