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

export function mockThermal() {
    const ThermalLevel = {
        COOL: 0,
        NORMAL: 1,
        WARM: 2,
        HOT: 3,
        OVERHEATED: 4,
        WARNING: 5,
        EMERGENCY: 6,
    }
    const thermal = {
        ThermalLevel,
        subscribeThermalLevel: function (...args) {
            console.warn("thermal.subscribeThermalLevel interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, ThermalLevel);
            }
        },
        unsubscribeThermalLevel: function (...args) {
            console.warn("thermal.unsubscribeThermalLevel interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } 
        },
        getThermalLevel: function (...args) {
            console.warn("thermal.getThermalLevel interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return ThermalLevel
        }
    }
    return thermal
  }
  