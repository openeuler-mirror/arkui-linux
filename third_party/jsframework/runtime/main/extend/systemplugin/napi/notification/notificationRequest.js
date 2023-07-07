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
import { SlotType } from "../ohos_notification"
import { NotificationActionButton } from "./notificationActionButton"
import { PixelMapMock } from "../ohos_multimedia_image"
import { NotificationTemplate } from "./notificationTemplate"
import { NotificationFlags } from "./notificationFlags"
import { NotificationContent } from "./notificationContent"

export const NotificationRequest = {
    content: NotificationContent,
    id: '[PC preview] unknow id',
    slotType: SlotType,
    isOngoing: '[PC preview] unknow isOngoing',
    isUnremovable: '[PC preview] unknow isUnremovable',
    deliveryTime: '[PC preview] unknow deliveryTime',
    tapDismissed: '[PC preview] unknow tapDismissed',
    autoDeletedTime: '[PC preview] unknow autoDeletedTime',
    wantAgent: '[PC preview] unknow wantAgent',
    extraInfo: {"key": "unknown any"},
    color: '[PC preview] unknow color',
    colorEnabled: '[PC preview] unknow colorEnabled',
    isAlertOnce: '[PC preview] unknow isAlertOnce',
    isStopwatch: '[PC preview] unknow isStopwatch',
    isCountDown: '[PC preview] unknow isCountDown',
    isFloatingIcon: '[PC preview] unknow isFloatingIcon',
    label: '[PC preview] unknow label',
    badgeIconStyle: '[PC preview] unknow badgeIconStyle',
    showDeliveryTime: '[PC preview] unknow showDeliveryTime',
    actionButtons: [NotificationActionButton],
    smallIcon: PixelMapMock,
    largeIcon: PixelMapMock,
    groupName: '[PC preview] unknow groupName',
    creatorBundleName: '[PC preview] unknow creatorBundleName',
    creatorUid: '[PC preview] unknow creatorUid',
    creatorPid: '[PC preview] unknow creatorPid',
    creatorUserId: '[PC preview] unknow creatorUserId',
    classification: '[PC preview] unknow classification',
    hashCode: '[PC preview] unknow hashCode',
    isRemoveAllowed: '[PC preview] unknow isRemveAllowd',
    source: '[PC preview] unknow source',
    template: NotificationTemplate,
    distributedOption: DistributedOptions,
    deviceId: '[PC preview] unknow deviceId',
    notificationFlags: NotificationFlags,
    removalWantAgent: '[PC preview] unknow removalWantAgent',
    badgeNumber: '[PC preview] unknow badgeNumber',
}
export const DistributedOptions = {
    isDistributed: '[PC preview] unknow isDistributed',
    supportDisplayDevices: [paramMock.paramStringMock],
    supportOperateDevices: [paramMock.paramStringMock],
    remindType: '[PC preview] unknow remindType',
}
