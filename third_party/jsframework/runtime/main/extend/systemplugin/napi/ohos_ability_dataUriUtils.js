/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { paramMock } from "../utils"

export function mockDataUriUtils() {
    const dataUriUtils = {
        getId: function (...args) {
            console.warn("dataUriUtils.getId interface mocked in the Previewer. How this interface works" +
              " on the Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock
        },
        attachId: function (...args) {
            console.warn("dataUriUtils.attachId interface mocked in the Previewer. How this interface works" +
              " on the Previewer may be different from that on a real device.")
            return paramMock.paramStringMock
        },
        deleteId: function (...args) {
            console.warn("dataUriUtils.deleteId interface mocked in the Previewer. How this interface works" +
              " on the Previewer may be different from that on a real device.")
            return paramMock.paramStringMock
        },
        updateId: function (...args) {
            console.warn("dataUriUtils.updateId interface mocked in the Previewer. How this interface works" +
              " on the Previewer may be different from that on a real device.")
            return paramMock.paramStringMock
        }
    }
    return dataUriUtils;
}
