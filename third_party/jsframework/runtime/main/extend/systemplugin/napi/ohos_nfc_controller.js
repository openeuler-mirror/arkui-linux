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

import { paramMock } from "../utils"

export function mockController() {
  const controller = {
    isNfcAvailable: function (...args) {
      console.warn("nfc.controller.isNfcAvailable interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isNfcOpen: function (...args) {
      console.warn("nfc.controller.isNfcOpen interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    on: function (...args) {
      console.warn("nfc.controller.on interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("nfc.controller.off interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    getNfcState: function (...args) {
      console.warn("nfc.controller.getNfcState interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
  }
  return controller
}