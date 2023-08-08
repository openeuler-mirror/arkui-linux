/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
import { BundleInfo, PixelMapFormat } from './bundle/bundleInfo'
import { BundlePackInfo } from './bundle/packInfo'
import { DispatchInfo } from './bundle/dispatchInfo'
import { ApplicationInfo, Want } from './bundle/applicationInfo'
import { AbilityInfo } from './bundle/abilityInfo'
import { PermissionDef } from './bundle/PermissionDef'
import { ExtensionAbilityInfo } from './bundle/extensionAbilityInfo'

export const BundleFlag = {
    GET_BUNDLE_DEFAULT: 0x00000000,
    GET_BUNDLE_WITH_ABILITIES: 0x00000001,
    GET_ABILITY_INFO_WITH_PERMISSION: 0x00000002,
    GET_ABILITY_INFO_WITH_APPLICATION: 0x00000004,
    GET_APPLICATION_INFO_WITH_PERMISSION: 0x00000008,
    GET_BUNDLE_WITH_REQUESTED_PERMISSION: 0x00000010,
    GET_ALL_APPLICATION_INFO: 0xFFFF0000,
    GET_ABILITY_INFO_WITH_METADATA: 0x00000020,
    GET_BUNDLE_WITH_EXTENSION_ABILITY: 0x00000020,
    GET_BUNDLE_WITH_HASH_VALUE: 0x00000030,
    GET_APPLICATION_INFO_WITH_METADATA: 0x00000040,
    GET_ABILITY_INFO_SYSTEMAPP_ONLY: 0x00000080,
    GET_ABILITY_INFO_WITH_DISABLE: 0x00000100,
    GET_APPLICATION_INFO_WITH_DISABLE: 0x00000200,
    GET_APPLICATION_INFO_WITH_CERTIFICATE_FINGERPRINT: 0x00000400,
}

export const ExtensionFlag = {
    GET_EXTENSION_INFO_DEFAULT: 0x00000000,
    GET_EXTENSION_INFO_WITH_PERMISSION: 0x00000002,
    GET_EXTENSION_INFO_WITH_APPLICATION: 0x00000004,
    GET_EXTENSION_INFO_WITH_METADATA: 0x00000020,
}

export const ColorMode = {
    AUTO_MODE: -1,
    DARK_MODE: 0,
    LIGHT_MODE: 1,
}

export const GrantStatus = {
    PERMISSION_DENIED: -1,
    PERMISSION_GRANTED: 0,
}

export const AbilityType = {
    UNKNOWN: 0,
    PAGE: 1,
    SERVICE: 2,
    DATA: 3,
}

export const AbilitySubType = {
    UNSPECIFIED: 0,
    CA: 1,
}

export const DisplayOrientation = {
    UNSPECIFIED: 0,
    LANDSCAPE: 0,
    PORTRAIT: 1,
    FOLLOW_RECENT: 2,
    LANDSCAPE_INVERTED: 3,
    PORTRAIT_INVERTED: 4,
    AUTO_ROTATION: 5,
    AUTO_ROTATION_LANDSCAPE: 6,
    AUTO_ROTATION_PORTRAIT: 7,
    AUTO_ROTATION_RESTRICTED: 8,
    AUTO_ROTATION_LANDSCAPE_RESTRICTED: 9,
    AUTO_ROTATION_PORTRAIT_RESTRICTED: 10,
    LOCKED: 11,
}

export const LaunchMode = {
    SINGLETON: 0,
    STANDARD: 1,
}

export const ExtensionAbilityType = {
    FORM: 0,
    WORK_SCHEDULER: 1,
    INPUT_METHOD: 2,
    SERVICE: 3,
    ACCESSIBILITY: 4,
    DATA_SHARE: 5,
    FILE_SHARE: 6,
    STATIC_SUBSCRIBER: 7,
    WALLPAPER: 8,
    BACKUP: 9,
    WINDOW: 10,
    ENTERPRISE_ADMIN: 11,
    UNSPECIFIED: 20,
}

export const BundleOptions = {
    userId: "[PC preview] unknown userId",
}

export const InstallErrorCode = {
    SUCCESS: 0,
    STATUS_INSTALL_FAILURE: 1,
    STATUS_INSTALL_FAILURE_ABORTED: 2,
    STATUS_INSTALL_FAILURE_INVALID: 3,
    STATUS_INSTALL_FAILURE_CONFLICT: 4,
    STATUS_INSTALL_FAILURE_STORAGE: 5,
    STATUS_INSTALL_FAILURE_INCOMPATIBLE: 6,
    STATUS_UNINSTALL_FAILURE: 7,
    STATUS_UNINSTALL_FAILURE_BLOCKED: 8,
    STATUS_UNINSTALL_FAILURE_ABORTED: 9,
    STATUS_UNINSTALL_FAILURE_CONFLICT: 10,
    STATUS_INSTALL_FAILURE_DOWNLOAD_TIMEOUT: 0x0B,
    STATUS_INSTALL_FAILURE_DOWNLOAD_FAILED: 0x0C,
    STATUS_RECOVER_FAILURE_INVALID: 0x0D,
    STATUS_ABILITY_NOT_FOUND: 0x40,
    STATUS_BMS_SERVICE_ERROR: 0x41,
    STATUS_FAILED_NO_SPACE_LEFT: 0x42,
    STATUS_GRANT_REQUEST_PERMISSIONS_FAILED: 0x43,
    STATUS_INSTALL_PERMISSION_DENIED: 0x44,
    STATUS_UNINSTALL_PERMISSION_DENIED: 0x45,
}

export const UpgradeFlag = {
    NOT_UPGRADE: 0,
    SINGLE_UPGRADE: 1,
    RELATION_UPGRADE: 2,
}

export const SupportWindowMode = {
    FULL_SCREEN: 0,
    SPLIT: 1,
    FLOATING: 2,
}

export function mockBundle() {
    const bundle = {
        getBundleInfo: function(...args) {
            console.warn("bundle.getBundleInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, BundleInfo);
            } else {
                return new Promise((resolve) => {
                    resolve(BundleInfo);
                })
            }
        },
        getBundleInstaller: function(...args) {
            console.warn("bundle.getBundleInstaller interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramNumberMock);
                })
            }
        },
        getApplicationInfo: function(...args) {
            console.warn("bundle.getApplicationInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, ApplicationInfo);
            } else {
                return new Promise((resolve) => {
                    resolve(ApplicationInfo);
                })
            }
        },
        queryAbilityByWant: function(...args) {
            console.warn("bundle.queryAbilityByWant interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(BundleInfo));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(BundleInfo));
                })
            }
        },
        getAllApplicationInfo: function(...args){
            console.warn("bundle.getAllApplicationInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(BundleInfo));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(BundleInfo));
                })
            }
        },
        getAllBundleInfo: function(...args) {
            console.warn("bundle.getAllBundleInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(ApplicationInfo));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(ApplicationInfo));
                })
            }
        },
        getBundleArchiveInfo:  function(...args) {
            console.warn("bundle.getBundleArchiveInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(BundleInfo));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(BundleInfo));
                })
            }
        },
        getLaunchWantForBundle: function(...args) {
            console.warn("bundle.getBundleArchiveInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(Want));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(Want));
                })
            }
        },
        cleanBundleCacheFiles: function(...args) {
            console.warn("bundle.cleanBundleCacheFiles interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramNumberMock);
                })
            }
        },
        setApplicationEnabled: function(...args) {
            console.warn("bundle.setApplicationEnabled interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramNumberMock);
                })
            }
        },
        setAbilityEnabled: function(...args) {
            console.warn("bundle.setAbilityEnabled interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramNumberMock);
                })
            }
        },
        setModuleUpgradeFlag: function (...args) {
            console.warn("bundle.setModuleUpgradeFlag interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock)
            } else {
                return new Promise((resolve) => {
                    resolve()
                });
            }
        },
        isModuleRemovable: function (...args) {
            console.warn("bundle.isModuleRemovable interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramBooleanMock)
                });
            }
        },
        getProfileByAbility: function (...args) {
            console.warn("bundle.getProfileByAbility interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, new Array(paramMock.paramStringMock))
            } else {
                return new Promise((resolve) => {
                    resolve(new Array(paramMock.paramStringMock))
                });
            }
        },
        getProfileByExtensionAbility: function (...args) {
            console.warn("bundle.getProfileByExtensionAbility interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, new Array(paramMock.paramStringMock))
            } else {
                return new Promise((resolve) => {
                    resolve(new Array(paramMock.paramStringMock))
                });
            }
        },
        queryExtensionAbilityInfos: function (...args) {
            console.warn("bundle.queryExtensionAbilityInfos interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this,paramMock.businessErrorMock, Array(ExtensionAbilityInfo))
            } else {
                return new Promise((resolve) => {
                    resolve(Array(ExtensionAbilityInfo))
                });
            }
        },
        getBundlePackInfo: function(...args) {
            console.warn("bundle.getBundlePackInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, BundlePackInfo);
            } else {
                return new Promise((resolve) => {
                    resolve(BundlePackInfo);
                })
            }
        },
        getDispatcherVersion: function(...args) {
            console.warn("bundle.getDispatcherVersion interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, DispatchInfo);
            } else {
                return new Promise((resolve) => {
                    resolve(DispatchInfo);
                })
            }
        },
        setDisposedStatus: function (...args) {
            console.warn("bundle.setDisposedStatus interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock)
            } else {
                return new Promise((resolve) => {
                    resolve()
                });
            }
        },
        getDisposedStatus: function (...args) {
            console.warn("bundle.getDisposedStatus interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramNumberMock)
                });
            }
        },
        isAbilityEnabled: function(...args) {
            console.warn("bundle.isAbilityEnabled interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramBooleanMock);
                })
            }
        },
        isApplicationEnabled: function(...args) {
            console.warn("bundle.isApplicationEnabled interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramBooleanMock);
                })
            }
        },
        getAbilityIcon: function(...args) {
            console.warn("bundle.getAbilityIcon interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, PixelMapFormat);
            } else {
                return new Promise((resolve) => {
                    resolve(PixelMapFormat);
                })
            }
        },
        getAbilityLabel: function(...args) {
            console.warn("bundle.getAbilityLabel interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramStringMock);
                })
            }
        },
        getPermissionDef: function(...args) {
            console.warn("bundle.getPermissionDef interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, PermissionDef);
            } else {
                return new Promise((resolve) => {
                    resolve(PermissionDef);
                })
            }
        },
        getNameForUid: function(...args) {
            console.warn("bundle.getNameForUid interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
            } else {
                return new Promise((resolve) => {
                    resolve(paramMock.paramStringMock);
                })
            }
        },
        getAbilityInfo: function(...args) {
            console.warn("bundle.getAbilityInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, AbilityInfo);
            } else {
                return new Promise((resolve) => {
                    resolve(AbilityInfo);
                })
            }
        },
        getApplicationInfoSync: function(...args) {
            console.warn("bundle.getApplicationInfoSync interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            return ApplicationInfo
        },
        getBundleInfoSync: function(...args) {
            console.warn("bundle.getBundleInfoSync interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            return BundleInfo
        },
    };
    return bundle;
}