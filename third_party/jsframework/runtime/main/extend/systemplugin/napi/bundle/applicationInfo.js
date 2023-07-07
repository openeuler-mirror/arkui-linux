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
import { ModuleInfo } from './moduleInfo';
import { CustomizeData } from './customizeData';
import { Metadata } from './metadata';
import { Resource } from './../global/resource';

export const ApplicationInfo = {
    name: "[PC preview] unknown name",
    description: "[PC preview] unknown description",
    descriptionId: "[PC preview] unknown descriptionId",
    systemApp: "[PC preview] unknown systemApp",
    enabled: "[PC preview] unknown enabled",
    label: "[PC preview] unknown label",
    labelId: "[PC preview] unknown labelId",
    icon: "[PC preview] unknown icon",
    iconId: "[PC preview] unknown iconId",
    process: "[PC preview] unknown process",
    supportedModes: "[PC preview] unknown supportedModes",
    moduleSourceDirs: [paramMock.paramNumberMock],
    permissions: [paramMock.paramNumberMock],
    moduleInfos: [ModuleInfo],
    entryDir: "[PC preview] unknown entryDir",
    codePath: "[PC preview] unknown codePath",
    metaData: [CustomizeData],
    metadata: [Metadata],
    removable: "[PC preview] unknown removable",
    accessTokenId: "[PC preview] unknown accessTokenId",
    uid: "[PC preview] unknown uid",
    entityType: "[PC preview] unknown entityType",
    fingerprint: "[PC preview] unknown fingerprint",
    iconResource: Resource,
    labelResource: Resource,
    descriptionResource: Resource,
    appDistributionType: "[PC preview] unknown appDistributionType",
    appProvisionType: "[PC preview] unknown appProvisionType", 
}

export const Want = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    uri: "[PC Preview] unknow uri",
    type: "[PC Preview] unknow type",
    flag: "[PC Preview] unknow flag",
    action: "[PC Preview] unknow action",
    parameters: [paramMock.paramStringMock],
    entities: [paramMock.paramStringMock],
    moduleName: "[PC Preview] unknow moduleName",
}