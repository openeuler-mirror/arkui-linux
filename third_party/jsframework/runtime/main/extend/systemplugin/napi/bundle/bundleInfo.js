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

import { paramMock } from "../../utils"
import { AbilityInfo } from './abilityInfo';
import { ApplicationInfo } from './applicationInfo';
import { ExtensionAbilityInfo } from './extensionAbilityInfo';
import { HapModuleInfo } from './hapModuleInfo';

export const UsedScene = {
    abilities: [paramMock.paramStringMock],
    when: "[PC preview] unknown when",
}

export const ReqPermissionDetail = {
    name: "[PC preview] unknown name",
    reason: "[PC preview] unknown reason",
    reasonId: "[PC preview] unknown reasonId",
    usedScene: UsedScene,
}

export const BundleInfo = {
    name: "[PC preview] unknown name",
    type: "[PC preview] unknown type",
    appId: "[PC preview] unknown appId",
    uid: "[PC preview] unknown uid",
    installTime: "[PC preview] unknown installTime",
    updateTime: "[PC preview] unknown updateTime",
    appInfo: ApplicationInfo,
    abilityInfos: [AbilityInfo],
    reqPermissions: [paramMock.paramStringMock],
    reqPermissionDetails: [ReqPermissionDetail],
    vendor: "[PC preview] unknown vendor",
    versionCode: "[PC preview] unknown versionCode",
    versionName: "[PC preview] unknown versionName",
    compatibleVersion: "[PC preview] unknown compatibleVersion",
    targetVersion: "[PC preview] unknown targetVersion",
    isCompressNativeLibs: "[PC preview] unknown isCompressNativeLibs",
    hapModuleInfos: [HapModuleInfo],
    entryModuleName: "[PC preview] unknown entryModuleName",
    cpuAbi: "[PC preview] unknown cpuAbi",
    isSilentInstallation: "[PC preview] unknown isSilentInstallation",
    minCompatibleVersionCode: "[PC preview] unknown minCompatibleVersionCode",
    entryInstallationFree: "[PC preview] unknown entryInstallationFree",
    reqPermissionStates: [paramMock.paramStringMock],
    extensionAbilityInfo: [ExtensionAbilityInfo],
};

export const PixelMapFormat = {
    UNKNOWN: 0,
    RGB_565: 2,
    RGBA_8888: 3,
}