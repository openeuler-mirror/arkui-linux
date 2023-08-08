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
import { InstallErrorCode } from '../ohos_bundle.js'

export const HashParam = {
    moduleName: "[PC preview] unknown moduleName",
    hashValue: "[PC preview] unknown hashValue",
}

export const InstallParam = {
    userId: "[PC preview] unknown userId",
    installFlag: "[PC preview] unknown installFlag",
    isKeepData: "[PC preview] unknown isKeepData",
    hashParams: [HashParam],
    crowdtestDeadline: "[PC preview] unknown crowdtestDeadline",
}

export const InstallStatus = {
    status: InstallErrorCode,
    statusMessage: "[PC preview] unknown statusMessage",
}

export const BundleInstaller = {
    moduleName: "[PC preview] unknown moduleName",
    hashValue: "[PC preview] unknown hashValue",
}

export function mockBundleInstaller() {
    const bundleInstaller = {
        install: function(...args){
            console.warn("bundleInstaller.install interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length;
            args[len - 1].call(this, paramMock.businessErrorMock, InstallStatus);
        },
        uninstall: function(...args){
            console.warn("bundleInstaller.uninstall interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length;
            args[len - 1].call(this, paramMock.businessErrorMock, InstallStatus);
        },
        recover: function(...args){
            console.warn("bundleInstaller.recover interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length;
            args[len - 1].call(this, paramMock.businessErrorMock, InstallStatus);
        }
    };
    return bundleInstaller;
}