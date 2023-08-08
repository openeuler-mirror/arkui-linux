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

export function mockDistributedBundle() {
    const RemoteAbilityInfo = [
        {
          elementName: {
            deviceId: "[PC preview] unknown deviceId",
            bundleName: "[PC preview] unknown bundleName",
            abilityName: "[PC preview] unknown abilityName",
            uri: "[PC preview] unknown uri",
            shortName: "[PC preview] unknown shortName",
            moduleName: "[PC preview] unknown moduleName",
          },
          label: "[PC preview] unknown app label",
          icon: "[PC preview] unknown icon",
        },
    ]

    const DistributedBundle = {
        getRemoteAbilityInfo: function (...args) {
            console.warn("distributedBundle.getRemoteAbilityInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(RemoteAbilityInfo))
            } else {
                return new Promise((resolve) => {
                resolve(Array(RemoteAbilityInfo))
                });
            }
            },
            getRemoteAbilityInfos: function (...args) {
            console.warn("distributedBundle.getRemoteAbilityInfos interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock,  Array(RemoteAbilityInfo))
            } else {
                return new Promise((resolve) => {
                resolve(Array(RemoteAbilityInfo))
                });
            }
            }
    };
    return DistributedBundle;
}