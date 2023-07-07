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

import { hasComplete } from "./utils"

export function mockStorage() {
  global.systemplugin.storage = {
    get: function (...args) {
      console.warn("storage.get interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success("[PC Preview]: no system")
      hasComplete(args[0].complete)
    },
    set: function (...args) {
      console.warn("storage.set interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success("[PC Preview]: no system")
      hasComplete(args[0].complete)
    },
    clear: function (...args) {
      console.warn("storage.clear interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success("[PC Preview]: no system")
      hasComplete(args[0].complete)
    },
    delete: function (...args) {
      console.warn("storage.delete interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success("[PC Preview]: no system")
      hasComplete(args[0].complete)
    }
  }
}