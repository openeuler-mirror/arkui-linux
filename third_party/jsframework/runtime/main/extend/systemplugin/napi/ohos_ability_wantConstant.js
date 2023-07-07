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
export const Action = {
    ACTION_HOME: "ohos.want.action.home",
    ACTION_DIAL: "ohos.want.action.dial",
    ACTION_SEARCH: "ohos.want.action.search",
    ACTION_WIRELESS_SETTINGS: "ohos.settings.wireless",
    ACTION_MANAGE_APPLICATIONS_SETTINGS: "ohos.settings.manage.applications",
    ACTION_APPLICATION_DETAILS_SETTINGS: "ohos.settings.application.details",
    ACTION_SET_ALARM: "ohos.want.action.setAlarm",
    ACTION_SHOW_ALARMS: "ohos.want.action.showAlarms",
    ACTION_SNOOZE_ALARM: "ohos.want.action.snoozeAlarm",
    ACTION_DISMISS_ALARM: "ohos.want.action.dismissAlarm",
    ACTION_DISMISS_TIMER: "ohos.want.action.dismissTimer",
    ACTION_SEND_SMS: "ohos.want.action.sendSms",
    ACTION_CHOOSE: "ohos.want.action.choose",
    ACTION_IMAGE_CAPTURE: "ohos.want.action.imageCapture",
    ACTION_VIDEO_CAPTURE: "ohos.want.action.videoCapture",
    ACTION_SELECT: "ohos.want.action.select",
    ACTION_SEND_DATA: "ohos.want.action.sendData",
    ACTION_SEND_MULTIPLE_DATA: "ohos.want.action.sendMultipleData",
    ACTION_SCAN_MEDIA_FILE: "ohos.want.action.scanMediaFile",
    ACTION_VIEW_DATA: "ohos.want.action.viewData",
    ACTION_EDIT_DATA: "ohos.want.action.editData",
    INTENT_PARAMS_INTENT: "ability.want.params.INTENT",
    INTENT_PARAMS_TITLE: "ability.want.params.TITLE",
    ACTION_FILE_SELECT: "ohos.action.fileSelect",
    PARAMS_STREAM: "ability.params.stream",
    ACTION_APP_ACCOUNT_OAUTH: "ohos.account.appAccount.action.oauth",
    ACTION_MARKER_DOWNLOAD: "ohos.want.action.marketDownload"
}
export const Entity = {
    ENTITY_DEFAULT: "entity.system.default",
    ENTITY_HOME: "entity.system.home",
    ENTITY_VOICE: "entity.system.voice",
    ENTITY_BROWSABLE: "entity.system.browsable",
    ENTITY_VIDEO: "entity.system.video"
}
export const Flags = {
    FLAG_AUTH_READ_URI_PERMISSION: 0x00000001,
    FLAG_AUTH_WRITE_URI_PERMISSION: 0x00000002,
    FLAG_ABILITY_FORWARD_RESULT: 0x00000004,
    FLAG_ABILITY_CONTINUATION: 0x00000008,
    FLAG_NOT_OHOS_COMPONENT: 0x00000010,
    FLAG_ABILITY_FORM_ENABLED: 0x00000020,
    FLAG_AUTH_PERSISTABLE_URI_PERMISSION: 0x00000040,
    FLAG_AUTH_PREFIX_URI_PERMISSION: 0x00000080,
    FLAG_ABILITYSLICE_MULTI_DEVICE: 0x00000100,
    FLAG_START_FOREGROUND_ABILITY: 0x00000200,
    FLAG_ABILITY_CONTINUATION_REVERSIBLE: 0x00000400,
    FLAG_INSTALL_ON_DEMAND: 0x00000800,
    FLAG_INSTALL_WITH_BACKGROUND_MODE: 0x80000000,
    FLAG_ABILITY_CLEAR_MISSION: 0x00008000,
    FLAG_ABILITY_NEW_MISSION: 0x10000000,
    FLAG_ABILITY_MISSION_TOP: 0x20000000
}
export function mockWantConstant() {
    const wantConstant = {
        Action,
        Entity,
        Flags
    }
    return wantConstant;
}