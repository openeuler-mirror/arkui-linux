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

export function mockPrivacyManager() {
    const PermissionUsedRequestMock = {
        tokenId: "[PC Preview] unknown tokenId",
        isRemote: "[PC Preview] unknown isRemote",
        deviceId: "[PC Preview] unknown deviceId",
        bundleName: "[PC Preview] unknown bundleName",
        permissionNames: "[PC Preview] unknown permissionNames",
        beginTime: "[PC Preview] unknown beginTime",
        endTime: "[PC Preview] unknown endTime",
        flag: "[PC Preview] unknown flag",
    };
    const UsedRecordDetailMock = {
        status: "[PC Preview] unknown status",
        timestamp: "[PC Preview] unknown timestamp",
        accessDuration: "[PC Preview] unknown accessDuration",
    };
    const PermissionUsedRecordMock = {
        permissionName: "[PC Preview] unknown permissionName",
        accessCount: "[PC Preview] unknown accessCount",
        rejectCount: "[PC Preview] unknown rejectCount",
        lastAccessTime: "[PC Preview] unknown lastAccessTime",
        lastRejectTime: "[PC Preview] unknown lastRejectTime",
        lastAccessDuration: "[PC Preview] unknown lastAccessDuration",
        accessRecords: [UsedRecordDetailMock],
        rejectRecords: [UsedRecordDetailMock],
    };
    const BundleUsedRecordMock = {
        tokenId: "[PC Preview] unknown tokenId",
        isRemote: "[PC Preview] unknown isRemote",
        deviceId: "[PC Preview] unknown deviceId",
        bundleName: "[PC Preview] unknown bundleName",
        permissionRecords: [PermissionUsedRecordMock]
    };
    const PermissionUsedResponseMock = {
        beginTime: '[PC preview] unknow beginTime',
        endTime: '[PC preview] unknow endTime',
        bundleRecords: [BundleUsedRecordMock],
    };
    const PermissionActiveStatus = {
            PERM_INACTIVE: 0,
            PERM_ACTIVE_IN_FOREGROUND: 1,
            PERM_ACTIVE_IN_BACKGROUND: 2,
    };
    const ActiveChangeResponse = {
        tokenId: "[PC Preview] unknown tokenId",
        permissionName: "[PC Preview] unknown permissionName",
        deviceId: "[PC Preview] unknown deviceId",
        activeStatus: PermissionActiveStatus,
    };
    const privacyManager = {
        PermissionActiveStatus,
        PermissionUsageFlag : {
            FLAG_PERMISSION_USAGE_SUMMARY: 0,
            FLAG_PERMISSION_USAGE_DETAIL: 1,
        },
        
        addPermissionUsedRecord: function (...args) {
            console.warn("privacyManager.addPermissionUsedRecord interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (len > 0 && typeof args[len - 1] === 'function') {
                  args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramNumberMock);
                });
            }
        },
        getPermissionUsedRecords: function (...args) {
            console.warn("privacyManager.getPermissionUsedRecords interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, PermissionUsedResponseMock)
            } else {
                return new Promise((resolve, reject) => {
                    resolve(PermissionUsedResponseMock);
                })
            }
        },
        startUsingPermission: function (...args) {
            console.warn("privacyManager.startUsingPermission interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (len > 0 && typeof args[len - 1] === 'function') {
                  args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramNumberMock);
                });
            }
        },
        stopUsingPermission: function (...args) {
            console.warn("privacyManager.stopUsingPermission interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (len > 0 && typeof args[len - 1] === 'function') {
                  args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramNumberMock);
                });
            }
        },
        on: function (...args) {
            console.warn("privacyManager.on interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (len > 0 && typeof args[len - 1] === 'function') {
                  args[len - 1].call(this, ActiveChangeResponse);
            }
        },
        off: function (...args) {
            console.warn("privacyManager.off interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (len > 0 && typeof args[len - 1] === 'function') {
                  args[len - 1].call(this, ActiveChangeResponse);
            }
        },
    };
    return privacyManager;
}
