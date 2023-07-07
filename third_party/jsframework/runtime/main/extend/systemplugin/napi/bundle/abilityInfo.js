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
import { AbilityType, AbilitySubType, DisplayOrientation, LaunchMode, SupportWindowMode } from "./../ohos_bundle"
import { ApplicationInfo } from "./applicationInfo"
import { CustomizeData } from "./customizeData"
import { Metadata } from "./metadata"


export const AbilityInfo = {
    name: "[PC preview] unknown name",
    bundleName: "[PC preview] unknown bundleName",
    moduleName: "[PC preview] unknown moduleName",
    process: "[PC preview] unknown process",
    targetAbility: "[PC preview] unknown targetAbility",
    backgroundModes: "[PC preview] unknown backgroundModes",
    isVisible: "[PC preview] unknown isVisible",
    formEnabled: "[PC preview] unknown formEnabled",
    type: AbilityType,
    subType: AbilitySubType,
    orientation: DisplayOrientation,
    launchMode: LaunchMode,
    permissions: [paramMock.paramStringMock],
    deviceTypes: [paramMock.paramStringMock],
    deviceCapabilities: [paramMock.paramNumberMock],
    readPermission: '[PC Preview] unknow readPermission',
    writePermission: '[PC Preview] unknow writePermission',
    appId: '[PC Preview] unknow appId',
    label: "[PC preview] unknown label",
    description: "[PC preview] unknown description",
    icon: "[PC preview] unknown icon",
    labelId: "[PC preview] unknown labelId",
    iconId: "[PC preview] unknown iconId",
    uid: '[PC Preview] unknow uid',
    installTime: '[PC Preview] unknow installTime',
    updateTime: '[PC Preview] unknow updateTime',
    descriptionId: '[PC Preview] unknow descriptionId',
    applicationInfo: ApplicationInfo,
    metaData: [CustomizeData],
    uri: "[PC preview] unknown uri",
    metadata: [Metadata],
    enabled: "[PC preview] unknown enabled",
    supportWindowMode: [SupportWindowMode],
    maxWindowRatio: "[PC preview] unknown maxWindowRatio",
    minWindowRatio: "[PC preview] unknown minWindowRatio",
    maxWindowWidth: "[PC preview] unknown maxWindowWidth",
    minWindowWidth: "[PC preview] unknown minWindowWidth",
    maxWindowHeight: "[PC preview] unknown maxWindowHeight",
    minWindowHeight: "[PC preview] unknown minWindowHeight",
    formEntity: "[PC preview] unknown formEntity",
    minFormHeight: "[PC preview] unknown minFormHeight",
    defaultFormHeight: "[PC preview] unknown defaultFormHeight",
    minFormWidth: "[PC preview] unknown minFormWidth",
    defaultFormWidth: "[PC preview] unknown defaultFormWidth",
}