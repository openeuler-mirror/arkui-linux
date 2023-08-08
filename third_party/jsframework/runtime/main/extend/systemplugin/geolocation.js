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

import { hasComplete, getRandomArbitrary } from "./utils"

export function mockGeolocation() {
  const data = {
    latitude: '121.61934',
    longitude: '31.257907',
    accuracy: '15',
    time: '160332896544'
  }
  global.systemplugin.geolocation = {
    getLocation: function (...args) {
      console.warn("geolocation.getLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      args[0].success(data)
      hasComplete(args[0].complete)
    },
    getLocationType: function (...args) {
      console.warn("geolocation.getLocationType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const info = { types: ['gps', 'network'] }
      args[0].success(info)
      hasComplete(args[0].complete)
    },
    getSupportedCoordTypes() {
      console.warn("geolocation.getSupportedCoordTypes interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return ["wgs84"]
    },
    subscribe: function (...args) {
      console.warn("geolocation.subscribe interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (!this.unsubscribeLocation) {
        this.unsubscribeLocation = setInterval(() => {
          data.latitude = getRandomArbitrary(121, 122)
          data.longitude = getRandomArbitrary(31, 32)
          data.accuracy = getRandomArbitrary(14, 18)
          args[0].success(data)
        }, 1000)
      }
    },
    unsubscribe: function () {
      console.warn("geolocation.unsubscribe interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      clearInterval(this.unsubscribeLocation)
      delete this.unsubscribeLocation
    }
  }
}