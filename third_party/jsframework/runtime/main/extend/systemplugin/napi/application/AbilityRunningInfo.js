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

const ElementName = {
    deviceId: '[PC preview] unknow deviceId',
    bundleName: '[PC preview] unknow bundleName',
    abilityName: '[PC preview] unknow abilityName',
    uri: '[PC preview] unknow uri',
    shortName: '[PC preview] unknow shortName',
    moduleName: '[PC preview] unknow moduleName'
}
const AbilityState = {
    INITIAL: 0,
    FOREGROUND: 9,
    BACKGROUND: 10,
    FOREGROUNDING: 11,
    BACKGROUNDING: 12
}

export const AbilityRunningInfo = {
    ability: ElementName,
    pid: '[PC preview] unknow pid',
    uid: '[PC preview] unknow uid',
    processName: '[PC preview] unknow processName',
    startTime: '[PC preview] unknow startTime',
    abilityState: AbilityState
}