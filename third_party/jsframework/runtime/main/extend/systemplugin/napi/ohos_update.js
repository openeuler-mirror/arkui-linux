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

export function mockUpdate() {
    const Updater = {
        checkNewVersion: function (...args) {
            console.warn("Updater.checkNewVersion interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, CheckResult);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(CheckResult);
                })
            }
        },
        getNewVersionInfo: function (...args) {
            console.warn("Updater.getNewVersionInfo interface mocked in the Previewer. How this interface works" +
            " on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, NewVersionInfo);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(NewVersionInfo);
                })
            }
        },
        getNewVersionDescription: function (...args) {
            console.warn("Updater.getNewVersionDescription interface mocked in the Previewer. How this interface works" +
            " on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, [ComponentDescription]);
            } else {
                return new Promise((resolve, reject) => {
                    resolve([ComponentDescription]);
                })
            }
        },
        getCurrentVersionInfo: function (...args) {
            console.warn("Updater.getCurrentVersionInfo interface mocked in the Previewer. How this interface works" +
            " on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, CurrentVersionInfo);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(CurrentVersionInfo);
                })
            }
        },
        getCurrentVersionDescription: function (...args) {
            console.warn("Updater.getCurrentVersionDescription interface mocked in the Previewer. How this interface works" +
            " on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, [ComponentDescription]);
            } else {
                return new Promise((resolve, reject) => {
                    resolve([ComponentDescription]);
                })
            }
        },
        getTaskInfo: function (...args) {
            console.warn("Updater.getTaskInfo interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, TaskInfo);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(TaskInfo);
                })
            }
        },
        download: function (...args) {
            console.warn("Updater.download interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        resumeDownload: function (...args) {
            console.warn("Updater.resumeDownload interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        pauseDownload: function (...args) {
            console.warn("Updater.pauseDownload interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        upgrade: function (...args) {
            console.warn("Updater.upgrade interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        clearError: function (...args) {
            console.warn("Updater.clearError interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        getUpgradePolicy: function (...args) {
            console.warn("Updater.getUpgradePolicy interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, UpgradePolicy);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(UpgradePolicy);
                })
            }
        },
        setUpgradePolicy: function (...args) {
            console.warn("Updater.setUpgradePolicy interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        terminateUpgrade: function (...args) {
            console.warn("Updater.terminateUpgrade interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        on: function (...args) {
            console.warn("Updater.on interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, EventInfo);
            }
        },
        off: function (...args) {
            console.warn("Updater.off interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, EventInfo);
            }
        },
    }
    const Restorer = {
        factoryReset: function (...args) {
            console.warn("Restorer.factoryReset interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
    }
    const LocalUpdater = {
        verifyUpgradePackage: function (...args) {
            console.warn("LocalUpdater.verifyUpgradePackage interface mocked in the Previewer. How this interface" +
            " works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        applyNewVersion: function (...args) {
            console.warn("LocalUpdater.applyNewVersion interface mocked in the Previewer. How this interface works" +
            " on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            }
        },
        on: function (...args) {
            console.warn("LocalUpdater.on interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, EventInfo);
            }
        },
        off: function (...args) {
            console.warn("LocalUpdater.off interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, EventInfo);
            }
        },
    }
    const update = {
        BusinessVendor,
        BusinessSubType,
        ComponentType,
        UpgradeAction,
        EffectiveMode,
        DescriptionType,
        NetType,
        Order,
        UpgradeStatus,
        EventClassify,
        EventId,
        UpgradeInfo,
        BusinessType,
        DownloadOptions,
        ResumeDownloadOptions,
        PauseDownloadOptions,
        UpgradeOptions,
        ClearOptions,
        EventClassifyInfo,
        UpgradeFile,
        DescriptionOptions,
        DescriptionFormat,
        getOnlineUpdater: function (...args) {
            console.warn("update.getOnlineUpdater interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return Updater;
        },
        getRestorer: function (...args) {
            console.warn("update.getRestorer interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return Restorer;
        },
        getLocalUpdater: function (...args) {
            console.warn("update.getLocalUpdater interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return LocalUpdater;
        }
    }
    return update;
}

const BusinessVendor = {
    PUBLIC: "public",
}

const BusinessSubType = {
    FIRMWARE: 1,
}

const ComponentType = {
    OTA: 1,
}

const UpgradeAction = {
    UPGRADE: "upgrade",
    RECOVERY: "recovery",
}

const EffectiveMode = {
    COLD: 1,
    LIVE: 2,
    LIVE_AND_COLD: 3,
}

const DescriptionType = {
    CONTENT: 0,
    URI: 1,
}

const NetType = {
    CELLULAR: 1,
    METERED_WIFI: 2,
    NOT_METERED_WIFI: 4,
    WIFI: 6,
    CELLULAR_AND_WIFI: 7
}

const Order = {
    DOWNLOAD: 1,
    INSTALL: 2,
    DOWNLOAD_AND_INSTALL: 3,
    APPLY: 4,
    INSTALL_AND_APPLY: 6
}

const UpgradeStatus = {
    WAITING_DOWNLOAD: 20,
    DOWNLOADING: 21,
    DOWNLOAD_PAUSED: 22,
    DOWNLOAD_FAIL: 23,
    WAITING_INSTALL: 30,
    UPDATING: 31,
    WAITING_APPLY: 40,
    APPLYING: 41,
    UPGRADE_SUCCESS: 50,
    UPGRADE_FAIL: 51,
}

const EventClassify = {
    TASK: 0x01000000,
}

const EventId = {
    EVENT_TASK_BASE: 0x01000000,
    EVENT_TASK_RECEIVE: 0x01000001,
    EVENT_TASK_CANCEL: 0x01000010,
    EVENT_DOWNLOAD_WAIT: 0x01000011,
    EVENT_DOWNLOAD_START: 0x01000100,
    EVENT_DOWNLOAD_UPDATE: 0x01000101,
    EVENT_DOWNLOAD_PAUSE: 0x01000110,
    EVENT_DOWNLOAD_RESUME: 0x01000111,
    EVENT_DOWNLOAD_SUCCESS: 0x01001000,
    EVENT_DOWNLOAD_FAIL: 0x01001001,
    EVENT_UPGRADE_WAIT: 0x01001010,
    EVENT_UPGRADE_START: 0x01001011,
    EVENT_UPGRADE_UPDATE: 0x01001100,
    EVENT_APPLY_WAIT: 0x01001101,
    EVENT_APPLY_START: 0x01001110,
    EVENT_UPGRADE_SUCCESS: 0x01001111,
    EVENT_UPGRADE_FAIL: 0x01010000,
}

const VersionDigestInfo = {
    versionDigest: "[PC Preview] unknown versionDigest",
}

const DescriptionInfo = {
    descriptionType: DescriptionType.CONTENT,
    content: "[PC Preview] unknown content",
}

const VersionComponent = {
    componentId: "[PC Preview] unknown componentId",
    componentType: ComponentType.OTA,
    upgradeAction: UpgradeAction.UPGRADE,
    displayVersion: "[PC Preview] unknown displayVersion",
    innerVersion: "[PC Preview] unknown innerVersion",
    size: "[PC Preview] unknown size",
    effectiveMode: EffectiveMode.COLD,
    descriptionInfo: DescriptionInfo,
}

const NewVersionInfo = {
    versionDigestInfo: VersionDigestInfo,
    versionComponents: [VersionComponent],
}

const CheckResult = {
    isExistNewVersion: "[PC Preview] unknown isExistNewVersion",
    newVersionInfo: NewVersionInfo,
}

const CurrentVersionInfo = {
    osVersion: "[PC Preview] unknown osVersion",
    deviceName: "[PC Preview] unknown deviceName",
    versionComponents: [VersionComponent],
}

const UpgradePeriod = {
    start: "[PC Preview] unknown start",
    end: "[PC Preview] unknown end",
}

const UpgradePolicy = {
    downloadStrategy: "[PC Preview] unknown downloadStrategy",
    autoUpgradeStrategy: "[PC Preview] unknown autoUpgradeStrategy",
    autoUpgradePeriods: [UpgradePeriod],
}

const ErrorMessage = {
    errorCode: "[PC Preview] unknown errorCode",
    errorMessage: "[PC Preview] unknown errorMessage",
}

const TaskBody = {
    versionDigestInfo: VersionDigestInfo,
    status: UpgradeStatus.WAITING_DOWNLOAD,
    subStatus: "[PC Preview] unknown subStatus",
    progress: "[PC Preview] unknown progress",
    installMode: "[PC Preview] unknown installMode",
    errorMessages: [ErrorMessage],
    versionComponents: [VersionComponent],
}

const TaskInfo = {
    existTask: "[PC Preview] unknown existTask",
    taskBody: TaskBody,
}

const EventInfo = {
    eventId: EventId.EVENT_TASK_RECEIVE,
    taskBody: TaskBody,
}

const UpgradeInfo = {
    upgradeApp: "[PC Preview] unknown upgradeApp",
    businessType: BusinessType
}

const BusinessType = {
    vendor: BusinessVendor,
    subType: BusinessSubType
}

const DownloadOptions = {
    allowNetwork: NetType,
    order: Order
}

const ResumeDownloadOptions = {
    allowNetwork: NetType
}

const PauseDownloadOptions = {
    isAllowAutoResume: true
}

const UpgradeOptions = {
    order: Order
}

const ClearOptions = {
    status: UpgradeStatus
}

const EventClassifyInfo = {
    eventClassify: EventClassify,
    extraInfo: "[PC Preview] unknown extraInfo"
}

const UpgradeFile = {
    fileType: ComponentType,
    filePath: "[PC Preview] unknown filePath"
}

const DescriptionOptions = {
    format: DescriptionFormat,
    language: "[PC Preview] unknown language",
}

const ComponentDescription = {
    componentId: "[PC Preview] unknown componentId",
    descriptionInfo: DescriptionInfo,
}

const DescriptionFormat = {
    STANDARD: 0,
    SIMPLIFIED : 1,
}