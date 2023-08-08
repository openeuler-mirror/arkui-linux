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
import { WantClass } from "./ohos_application_Want"

export const FormInfo = {
    bundleName: '[PC preview] unknow bundleName',
    moduleName: '[PC preview] unknow moduleName',
    abilityName: '[PC preview] unknow abilityName',
    name: '[PC preview] unknow name',
    description: '[PC preview] unknow description',
    type: FormType,
    jsComponentName: '[PC preview] unknow jsComponentName',
    colorMode: ColorMode,
    isDefault: '[PC preview] unknow isDefault',
    updateEnabled: '[PC preview] unknow updateEnabled',
    formVisibleNotify: '[PC preview] unknow formVisibleNotify',
    relatedBundleName: '[PC preview] unknow relatedBundleName',
    scheduledUpdateTime: '[PC preview] unknow scheduledUpdateTime',
    formConfigAbility: '[PC preview] unknow formConfigAbility',
    updateDuration: '[PC preview] unknow updateDuration',
    defaultDimension: '[PC preview] unknow defaultDimension',
    supportDimensions: [paramMock.paramNumberMock],
    customizeData: {"key": paramMock.paramStringMock},
}
export const FormType = {
    JS: 1,
}
export const ColorMode = {
    MODE_AUTO: -1,
    MODE_DARK: 0,
    MODE_LIGHT: 1
}
export const FormStateInfo = {
    formState: FormState,
    want: new WantClass(),
}
export const FormState = {
    UNKNOWN: -1,
    DEFAULT: 0,
    READY: 1,
}
export const FormParam = {
    IDENTITY_KEY: "ohos.extra.param.key.form_identity",
    DIMENSION_KEY: "ohos.extra.param.key.form_dimension",
    NAME_KEY: "ohos.extra.param.key.form_name",
    MODULE_NAME_KEY: "ohos.extra.param.key.module_name",
    WIDTH_KEY: "ohos.extra.param.key.form_width",
    HEIGHT_KEY: "ohos.extra.param.key.form_height",
    TEMPORARY_KEY: "ohos.extra.param.key.form_temporary",
    BUNDLE_NAME_KEY: "ohos.extra.param.key.bundle_name",
    ABILITY_NAME_KEY: "ohos.extra.param.key.ability_name",
    DEVICE_ID_KEY: "ohos.extra.param.key.device_id"
}
export const  FormInfoFilter = {
    moduleName: '[PC preview] unknow moduleName',
}
export const FormDimension = {
    Dimension_1_2: 1,
    Dimension_2_2: '[PC preview] unknow Dimension_2_2',
    Dimension_2_4: '[PC preview] unknow Dimension_2_4',
    Dimension_4_4: '[PC preview] unknow Dimension_4_4',
    Dimension_2_1: '[PC preview] unknow Dimension_2_1',
}
export function mockFormInfo() {
    const formInfo = {
        FormInfo,
        FormType,
        ColorMode,
        FormStateInfo,
        FormState,
        FormParam,
        FormInfoFilter,
        FormDimension
    }
    return formInfo;
}