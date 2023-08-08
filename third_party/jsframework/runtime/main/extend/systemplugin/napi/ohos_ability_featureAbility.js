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
import { WantClass } from "./ohos_application_Want"
import { Context as _Context } from "./app/context"
import { AbilityResult } from "./ability/abilityResult"
import { windowMock } from "./ohos_window"
import { DataAbilityHelper } from "./ability/dataAbilityHelper"
import { AppVersionInfo as _AppVersionInfo } from "./app/appVersionInfo"
import { ProcessInfo as _ProcessInfo } from "./app/processInfo"

export function mockFeatureAbility() {
    const featureAbility = {
        getWant: function (...args) {
            console.warn("featureAbility.getWant interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, new WantClass());
            } else {
                return new Promise((resolve, reject) => {
                    resolve(new WantClass());
                })
            }
        },
        startAbility: function (...args) {
            console.warn("featureAbility.startAbility interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramNumberMock);
                })
            }
        },
        getContext: function () {
            console.warn("featureAbility.getContext interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return _Context;
        },
        startAbilityForResult: function (...args) {
            console.warn("featureAbility.startAbilityForResult interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, AbilityResult);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(AbilityResult);
                })
            }
        },
        terminateSelfWithResult: function (...args) {
            console.warn("featureAbility.terminateSelfWithResult interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        terminateSelf: function () {
            console.warn("featureAbility.terminateSelf interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        acquireDataAbilityHelper: function (...args) {
            console.warn("featureAbility.acquireDataAbilityHelper interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return DataAbilityHelper;
        },
        hasWindowFocus: function (...args) {
            console.warn("featureAbility.hasWindowFocus interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramBooleanMock);
                })
            }
        },
        connectAbility: function (...args) {
            console.warn("featureAbility.connectAbility interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        disconnectAbility: function (...args) {
            console.warn("featureAbility.disconnectAbility interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        getWindow: function (...args) {
            console.warn("featureAbility.getWindow interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, windowMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(windowMock);
                })
            }
        },
        AbilityWindowConfiguration,
        AbilityStartSetting,
        ErrorCode,
        DataAbilityOperationType,
        Context: _Context,
        AppVersionInfo: _AppVersionInfo,
        ProcessInfo: _ProcessInfo
    }
    return featureAbility;
}
export const AbilityWindowConfiguration = {
    WINDOW_MODE_UNDEFINED: 0,
    WINDOW_MODE_FULLSCREEN: 1,
    WINDOW_MODE_SPLIT_PRIMARY: 100,
    WINDOW_MODE_SPLIT_SECONDARY: 101,
    WINDOW_MODE_FLOATING: 102
}
export const AbilityStartSetting = {
    BOUNDS_KEY: "abilityBounds",
    WINDOW_MODE_KEY: "windowMode",
    DISPLAY_ID_KEY: "displayId"
}
export const ErrorCode = {
    NO_ERROR: 0,
    INVALID_PARAMETER: -1,
    ABILITY_NOT_FOUND: -2,
    PERMISSION_DENY: -3
}
export const DataAbilityOperationType = {
    TYPE_INSERT: 1,
    TYPE_UPDATE: 2,
    TYPE_DELETE: 3,
    TYPE_ASSERT: 4,
}