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

export function mockWorkScheduler() {
    const WorkInfo = {
        workId: '[PC preview] unknown workId',
        bundleName: '[PC preview] unknown bundleName',
        abilityName: '[PC preview] unknown abilityName',
        isPersisted: '[PC preview] unknown isPersisted',
        networkType: '[PC preview] unknown networkType',
        isCharging: '[PC preview] unknown isCharging',
        chargerType: '[PC preview] unknown chargerType',
        batteryLevel: '[PC preview] unknown batteryLevel',
        batteryStatus: '[PC preview] unknown batteryStatus',
        storageRequest: '[PC preview] unknown storageRequest',
        repeatCycleTime: '[PC preview] unknown repeatCycleTime',
        isRepeat: '[PC preview] unknown isRepeat',
        repeatCount: '[PC preview] unknown repeatCount',
        isDeepIdle: '[PC preview] unknown isDeepIdle',
        idleWaitTime: '[PC preview] unknown idleWaitTime',
        parameters: {"key": "unknown any"},
    };
    const WorkInfoArray = [WorkInfo]
    const workScheduler = {
        NetworkType : {
            NETWORK_TYPE_ANY: 0,
            NETWORK_TYPE_MOBILE: 1,
            NETWORK_TYPE_WIFI: 2,
            NETWORK_TYPE_BLUETOOTH: 3,
            NETWORK_TYPE_WIFI_P2P: 4,
            NETWORK_TYPE_ETHERNET: 5,
        },
        ChargingType : {
            CHARGING_PLUGGED_ANY: 0,
            CHARGING_PLUGGED_AC: 1,
            CHARGING_PLUGGED_USB: 2,
            CHARGING_PLUGGED_WIRELESS: 3,
        },
        BatteryStatus : {
            BATTERY_STATUS_LOW: 0,
            BATTERY_STATUS_OKAY: 1,
            BATTERY_STATUS_LOW_OR_OKAY: 2,
        },
        StorageRequest : {
            STORAGE_LEVEL_LOW: 0,
            STORAGE_LEVEL_OKAY: 1,
            STORAGE_LEVEL_LOW_OR_OKAY: 2,
        },
        startWork: function (...args) {
            console.warn("workScheduler.startWork interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        stopWork: function (...args) {
            console.warn("workScheduler.stopWork interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getWorkStatus: function (...args) {
            console.warn("workScheduler.getWorkStatus interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, WorkInfo)
            } else {
                return new Promise(resolve => {
                    resolve(WorkInfo);
                })
            }
        },
        obtainAllWorks: function (...args) {
            console.warn("workScheduler.obtainAllWorks interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, WorkInfoArray)
            } else {
                return new Promise(resolve => {
                  resolve(WorkInfoArray);
                })
            }
        },
        stopAndClearWorks: function (...args) {
            console.warn("workScheduler.stopAndClearWorks interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        isLastWorkTimeOut: function (...args) {
            console.warn("workScheduler.isLastWorkTimeOut interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
            } else {
                return new Promise(resolve => {
                    resolve(paramMock.paramBooleanMock);
                })
            }
        }
    }
    return workScheduler;
}