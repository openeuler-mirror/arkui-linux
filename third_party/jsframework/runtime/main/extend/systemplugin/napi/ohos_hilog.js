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

export function mockHilog() {
  const hilog = {
    LogLevel: {
      DEBUG: 3,
      INFO: 4,
      WARN: 5,
      ERROR: 6,
      FATAL: 7
    },
    debug: function (...args) {
      console.warn("hilog.debug interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    info: function (...args) {
      console.warn("hilog.info interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    warn: function (...args) {
      console.warn("hilog.warn interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    error: function (...args) {
      console.warn("hilog.error interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    fatal: function (...args) {
      console.warn("hilog.fatal interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    isLoggable: function (...args) {
      console.warn("hilog.isLoggable interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    }
  }
  return hilog;
}
