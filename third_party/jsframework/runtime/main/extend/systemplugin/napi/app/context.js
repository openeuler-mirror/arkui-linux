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
import { paramMock } from "../../utils"
import { ProcessInfo } from "./processInfo"
import { AppVersionInfo } from "./appVersionInfo"
import { AbilityInfo } from "../bundle/abilityInfo"
import { ApplicationInfo } from "../bundle/applicationInfo"
import { ElementName } from "../bundle/elementName"
import { HapModuleInfo } from "../bundle/hapModuleInfo"

const DisplayOrientation = {
    UNSPECIFIED: "[PC preview] unknown is UNSPECIFIED",
    LANDSCAPE: "[PC preview] unknown is LANDSCAPE",
    PORTRAIT: "[PC preview] unknown is PORTRAIT",
    FOLLOW_RECENT: "[PC preview] unknown is FOLLOW_RECENT",
    LANDSCAPE_INVERTED: "[PC preview] unknown is LANDSCAPE_INVERTED",
    PORTRAIT_INVERTED: "[PC preview] unknown is PORTRAIT_INVERTED",
    AUTO_ROTATION: "[PC preview] unknown is AUTO_ROTATION",
    AUTO_ROTATION_LANDSCAPE: "[PC preview] unknown is AUTO_ROTATION_LANDSCAPE",
    AUTO_ROTATION_PORTRAIT: "[PC preview] unknown is AUTO_ROTATION_PORTRAIT",
    AUTO_ROTATION_RESTRICTED: "[PC preview] unknown is AUTO_ROTATION_RESTRICTED",
    AUTO_ROTATION_LANDSCAPE_RESTRICTED: "[PC preview] unknown is AUTO_ROTATION_LANDSCAPE_RESTRICTED",
    AUTO_ROTATION_PORTRAIT_RESTRICTED: "[PC preview] unknown is AUTO_ROTATION_PORTRAIT_RESTRICTED",
    LOCKED: "[PC preview] unknown is LOCKED",
}
export const Context = {
    getOrCreateLocalDir: function (...args) {
        console.warn("Context.getOrCreateLocalDir interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    verifyPermission: function (...args) {
        console.warn("Context.verifyPermission interface mocked in the Previewer." +
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
    requestPermissionsFromUser: function (...args) {
        console.warn("Context.requestPermissionsFromUser interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, PermissionRequestResult);
        } else {
            return new Promise((resolve, reject) => {
                resolve(PermissionRequestResult);
            })
        }
    },
    getApplicationInfo: function (...args) {
        console.warn("Context.getApplicationInfo interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, ApplicationInfo);
        } else {
            return new Promise((resolve, reject) => {
                resolve(ApplicationInfo);
            })
        }
    },
    getBundleName: function (...args) {
        console.warn("Context.getBundleName interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getDisplayOrientation: function (...args) {
        console.warn("Context.getDisplayOrientation interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, DisplayOrientation);
        } else {
            return new Promise((resolve, reject) => {
                resolve(DisplayOrientation);
            })
        }
    },
    setDisplayOrientation: function (...args) {
        console.warn("Context.setDisplayOrientation interface mocked in the Previewer." +
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
    setShowOnLockScreen: function (...args) {
        console.warn("Context.setShowOnLockScreen interface mocked in the Previewer." +
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
    setWakeUpScreen: function (...args) {
        console.warn("Context.setWakeUpScreen interface mocked in the Previewer." +
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
    getProcessInfo: function (...args) {
        console.warn("Context.getProcessInfo interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, ProcessInfo);
        } else {
            return new Promise((resolve, reject) => {
                resolve(ProcessInfo);
            })
        }
    },
    getElementName: function (...args) {
        console.warn("Context.getElementName interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, ElementName);
        } else {
            return new Promise((resolve, reject) => {
                resolve(ElementName);
            })
        }
    },
    getProcessName: function (...args) {
        console.warn("Context.getProcessName interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getCallingBundle: function (...args) {
        console.warn("Context.getCallingBundle interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getFilesDir: function (...args) {
        console.warn("Context.getFilesDir interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getCacheDir: function (...args) {
        console.warn("Context.getCacheDir interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getOrCreateDistributedDir: function (...args) {
        console.warn("Context.getOrCreateDistributedDir interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getAppType: function (...args) {
        console.warn("Context.getAppType interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramStringMock);
            })
        }
    },
    getHapModuleInfo: function (...args) {
        console.warn("Context.getHapModuleInfo interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, HapModuleInfo);
        } else {
            return new Promise((resolve, reject) => {
                resolve(HapModuleInfo);
            })
        }
    },
    getAppVersionInfo: function (...args) {
        console.warn("Context.getAppVersionInfo interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, AppVersionInfo);
        } else {
            return new Promise((resolve, reject) => {
                resolve(AppVersionInfo);
            })
        }
    },
    getApplicationContext: function () {
        console.warn("Context.getApplicationContext interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        return Context;
    },
    getAbilityInfo: function (...args) {
        console.warn("Context.getAbilityInfo interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, AbilityInfo);
        } else {
            return new Promise((resolve, reject) => {
                resolve(AbilityInfo);
            })
        }
    },
    isUpdatingConfigurations: function (...args) {
        console.warn("Context.isUpdatingConfigurations interface mocked in the Previewer." +
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
    printDrawnCompleted: function (...args) {
        console.warn("Context.printDrawnCompleted interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            })
        }
    }
}
export const PermissionRequestResult = {
    requestCode: "[PC Preview] unknow requestCode",
    permissions: [paramMock.paramStringMock],
    authResults: [paramMock.paramNumberMock],
}
export const PermissionOptions = {
    pid: "[PC Preview] unknow pid",
    uid: "[PC Preview] unknow uid",
}