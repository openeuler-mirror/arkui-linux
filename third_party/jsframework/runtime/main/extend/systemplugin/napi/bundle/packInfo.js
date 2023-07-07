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

export const PackageConfig = {
    deviceType: [paramMock.paramStringMock],
    name: "[PC preview] unknown name",
    moduleType: "[PC preview] unknown moduleType",
    deliveryWithInstall: "[PC preview] unknown deliveryWithInstall",
}

export const ModuleDistroInfo = {
    mainAbility: "[PC preview] unknown mainAbility",
    deliveryWithInstall: "[PC preview] unknown deliveryWithInstall",
    installationFree: "[PC preview] unknown installationFree",
    moduleName: "[PC preview] unknown moduleName",
    moduleType: "[PC preview] unknown moduleType",
}

export const AbilityFormInfo = {
    name: "[PC preview] unknown name",
    type: "[PC preview] unknown type",
    updateEnabled: "[PC preview] unknown updateEnabled",
    scheduledUpdateTime: "[PC preview] unknown scheduledUpdateTime",
    updateDuration: "[PC preview] unknown updateDuration",
    supportDimensions: [paramMock.paramNumberMock],
    defaultDimension: "[PC preview] unknown defaultDimension",
}

export const ApiVersion = {
    releaseType: "[PC preview] unknown releaseType",
    compatible: "[PC preview] unknown compatible",
    target: "[PC preview] unknown target",
}

export const Version = {
    minCompatibleVersionCode: "[PC preview] unknown minCompatibleVersionCode",
    name: "[PC preview] unknown name",
    code: "[PC preview] unknown code",
}

export const ModuleAbilityInfo = {
    name: "[PC preview] unknown name",
    label: "[PC preview] unknown label",
    visible: "[PC preview] unknown visible",
    forms: [AbilityFormInfo],
}

export const ExtensionAbilities = {
    name: "[PC preview] unknown name",
    forms: [AbilityFormInfo],
}

export const ModuleConfigInfo = {
    apiVersion: ApiVersion,
    deviceType: [paramMock.paramStringMock],
    distro: [paramMock.paramStringMock],
    abilities: [ModuleAbilityInfo],
    extensionAbilities: [ExtensionAbilities],
}

export const BundleConfigInfo = {
    bundleName: "[PC preview] unknown bundleName",
    version: Version,
}

export const PackageSummary = {
    app: BundleConfigInfo,
    modules: [ModuleConfigInfo]
}

export const BundlePackFlag = {
    GET_PACK_INFO_ALL: 0x00000000,
    GET_PACKAGES: 0x00000001,
    GET_BUNDLE_SUMMARY: 0x00000002,
    GET_MODULE_SUMMARY: 0x00000004,
}

export const BundlePackInfo = {
    packages: [PackageConfig],
    summary: PackageSummary
}