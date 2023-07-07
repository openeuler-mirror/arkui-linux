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
import { ApplicationInfo } from './applicationInfo';
import { Metadata } from './metadata'
import { ExtensionAbilityType } from "./../ohos_bundle"


export const ExtensionAbilityInfo = {
    bundleName: "[PC preview] unknown bundleName",
    moduleName: "[PC preview] unknown moduleName",
    name: "[PC preview] unknown name",
    labelId: "[PC preview] unknown labelId",
    descriptionId: "[PC preview] unknown descriptionId",
    iconId: "[PC preview] unknown iconId",
    isVisible: "[PC preview] unknown isVisible",
    extensionAbilityType: ExtensionAbilityType,
    metadata: [Metadata],
    permissions: [paramMock.paramStringMock],
    applicationInfo: ApplicationInfo,
    enabled: "[PC preview] unknown enabled",
    readPermission: "[PC preview] unknown readPermission",
    writePermission: "[PC preview] unknown writePermission",
}