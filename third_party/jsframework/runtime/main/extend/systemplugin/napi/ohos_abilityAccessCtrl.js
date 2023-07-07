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

export function mockAbilityAccessCtrl() {
    const GrantStatus = "[PC preview] unknow GrantStatus";

    const AtManager = {
        verifyAccessToken: function (...args) {
            console.warn("AtManager.verifyAccessToken interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return new Promise((resolve, reject) => {
                resolve(GrantStatus);
            })
        },
        verifyAccessTokenSync: function (...args) {
            console.warn("AtManager.verifyAccessTokenSync interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return GrantStatus;
        },
        grantUserGrantedPermission: function (...args) {
            console.warn("AtManager.grantUserGrantedPermission interface mocked in the Previewer." +
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
        revokeUserGrantedPermission: function (...args) {
            console.warn("AtManager.revokeUserGrantedPermission interface mocked in the Previewer." +
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
        getPermissionFlags: function (...args) {
            console.warn("AtManager.getPermissionFlags interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramNumberMock);
            })
        },
        getVersion: function (...args) {
            console.warn("AtManager.getVersion interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramNumberMock);
            })
        },
        on: function (...args) {
            console.warn("AtManager.on interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, PermissionStateChangeInfo);
            }
        },
        off: function (...args) {
            console.warn("AtManager.off interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
                args[len - 1].call(this, PermissionStateChangeInfo);
            }
        }
    };
    const PermissionStateChangeType = {
        PERMISSION_REVOKED_OPER: 0,
        PERMISSION_GRANTED_OPER: 1
    };

    const PermissionStateChangeInfo = {
        change: PermissionStateChangeType,
        tokenID: '[PC Preview] unknown tokenID',
        permissionName: '[PC Preview] unknown permissionName',

    };
    const abilityAccessCtrl = {
        createAtManager : function (...args) {
            console.warn("abilityAccessCtrl.createAtManager interface mocked in the Previewer." +
                " How this interface works on the Previewer may be different from that on a real device.")
            return AtManager;
        },
    };
    
    return abilityAccessCtrl;
}
