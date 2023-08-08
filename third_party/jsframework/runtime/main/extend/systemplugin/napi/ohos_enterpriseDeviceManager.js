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

export function mockEnterpriseDeviceManager() {
    const EnterpriseInfoMock = {
        name: "[PC preview] unknown name",
        description: "[PC preview] unknown description",
    }

    const DeviceSettingsManagerMock = {
        setDateTime: function (...args) {
            console.warn('DeviceSettingsManager.setDateTime interface mocked in the Previewer. How this interface works on the' +
                ' Previewer may be different from that on a real device.');
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve();
                });
            }
        },
    }
    const enterpriseDeviceManager = {
        AdminType: {
            ADMIN_TYPE_NORMAL: 0,
            ADMIN_TYPE_SUPER: 1,
        },

        enableAdmin: function (...args) {
            console.warn("enterpriseDeviceManager.enableAdmin interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve();
                })
            }
        },
        disableAdmin: function (...args) {
            console.warn("enterpriseDeviceManager.disableAdmin interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve();
                })
            }
        },
        disableSuperAdmin: function (...args) {
            console.warn("enterpriseDeviceManager.disableSuperAdmin interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve();
                })
            }
        },
        isAdminEnabled: function (...args) {
            console.warn("enterpriseDeviceManager.isAdminEnabled interface mocked in the Previewer. How this interface works on the" +
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
        getEnterpriseInfo: function (...args) {
            console.warn("enterpriseDeviceManager.getEnterpriseInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, EnterpriseInfoMock);
            } else {
                return new Promise((resolve) => {
                    resolve(EnterpriseInfoMock);
                })
            }
        },
        setEnterpriseInfo: function (...args) {
            console.warn("enterpriseDeviceManager.setEnterpriseInfo interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
                return new Promise((resolve) => {
                    resolve();
                })
            }
        },
        isSuperAdmin: function (...args) {
            console.warn("enterpriseDeviceManager.isSuperAdmin interface mocked in the Previewer. How this interface works on the" +
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
        getDeviceSettingsManager: function (...args) {
            console.warn("enterpriseDeviceManager.getDeviceSettingsManager interface mocked in the Previewer. How this interface works on the" +
                " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, DeviceSettingsManagerMock);
            } else {
                return new Promise((resolve) => {
                    resolve(DeviceSettingsManagerMock);
                })
            }
        }
    };
    return enterpriseDeviceManager;
}