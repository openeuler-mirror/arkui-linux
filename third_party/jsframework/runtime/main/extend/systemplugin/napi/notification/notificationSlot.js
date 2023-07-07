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
import { SlotType, SlotLevel } from "../ohos_notification"

export const NotificationSlot = {
    type: SlotType,
    level: SlotLevel,
    desc: '[PC preview] unknow desc',
    badgeFlag: '[PC preview] unknow badgeFlag',
    bypassDnd: '[PC preview] unknow bypassDnd',
    lockscreenVisibility: '[PC preview] unknow lockscreenVisibility',
    vibrationEnabled: '[PC preview] unknow vibrationEnabled',
    sound: '[PC preview] unknow sound',
    lightEnabled: '[PC preview] unknow lightEnabled',
    lightColor: '[PC preview] unknow lightColor',
    vibrationValues: [paramMock.paramNumberMock],
    enabled: '[PC preview] unknow enabled',
};