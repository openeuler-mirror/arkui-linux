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

export function mockBatteryStatistics() {
    const ConsumptionType = {
        CONSUMPTION_TYPE_INVALID: -17,
        CONSUMPTION_TYPE_APP: '[PC preview] unknow CONSUMPTION_TYPE_APP',
        CONSUMPTION_TYPE_BLUETOOTH: '[PC preview] unknow CONSUMPTION_TYPE_BLUETOOTH',
        CONSUMPTION_TYPE_IDLE: '[PC preview] unknow CONSUMPTION_TYPE_IDLE',
        CONSUMPTION_TYPE_PHONE: '[PC preview] unknow CONSUMPTION_TYPE_PHONE',
        CONSUMPTION_TYPE_RADIO: '[PC preview] unknow CONSUMPTION_TYPE_RADIO',
        CONSUMPTION_TYPE_SCREEN: '[PC preview] unknow CONSUMPTION_TYPE_SCREEN',
        CONSUMPTION_TYPE_USER: '[PC preview] unknow CONSUMPTION_TYPE_USER',
        CONSUMPTION_TYPE_WIFI: '[PC preview] unknow CONSUMPTION_TYPE_WIFI'
    }
    const BatteryStatsInfo = {
        uid: '[PC preview] unknow uid',
        type: ConsumptionType,
        power: '[PC preview] unknow power',
    }
    const batteryStats = {
        ConsumptionType,
        BatteryStatsInfo,
        getBatteryStats: function (...args) {
            console.warn("batteryStats.getBatteryStats interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            var batteryStatsInfos = new Array(BatteryStatsInfo)
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, batteryStatsInfos);
            }else {
                return new Promise((resolve, reject) => {
                    resolve(batteryStatsInfos);
                })
            } 
        },
        getAppPowerValue: function (...args) {
            console.warn("batteryStats.getAppPowerValue interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getAppPowerPercent: function (...args) {
            console.warn("batteryStats.getAppPowerPercent interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getHardwareUnitPowerValue: function (...args) {
            console.warn("batteryStats.getHardwareUnitPowerValue interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
            
        },
        getHardwareUnitPowerPercent: function (...args) {
            console.warn("batteryStats.getHardwareUnitPowerPercent interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        }
    }
    return batteryStats
  }
  