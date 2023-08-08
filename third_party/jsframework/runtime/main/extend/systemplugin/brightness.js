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

import { hasComplete } from "./utils"

export function mockBrightness() {
  global.systemplugin.brightness = {
    argsV: {
      value: 80
    },
    argsM: {
      mode: 0
    },
    getValue: function (...args) {
      console.warn("brightness.getValue interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      args[0].success(this.argsV)
      hasComplete(args[0].complete)
    },
    setValue: function (...args) {
      console.warn("brightness.setValue interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      if (args[0].value) {
        this.argsV.value = args[0].value
        args[0].success()
        hasComplete(args[0].complete)
      }
    },
    getMode: function (...args) {
      console.warn("brightness.getMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      args[0].success(this.argsM)
      hasComplete(args[0].complete)
    },
    setMode: function (...args) {
      console.warn("brightness.setMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      this.argsM.mode = args[0].mode
      args[0].success()
      hasComplete(args[0].complete)
    },
    setKeepScreenOn: function (...args) {
      console.warn("brightness.setKeepScreenOn interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    }
  }
}
