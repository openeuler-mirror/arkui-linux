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
import { NotificationRequest } from "./notificationRequest"
import { NotificationSortingMap } from "./notificationSortingMap"

export const NotificationSubscriber = {
    onConsume: function (...args) {
        console.warn("NotificationSubscriber.onConsume interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onCancel: function (...args) {
        console.warn("NotificationSubscriber.onCancel interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onUpdate: function (...args) {
        console.warn("NotificationSubscriber.onUpdate interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onConnect: function () {
        console.warn("NotificationSubscriber.onConnect interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onDisconnect: function () {
        console.warn("NotificationSubscriber.onDisconnect interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onDestroy: function () {
        console.warn("NotificationSubscriber.onDestroy interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onDoNotDisturbDateChange: function (...args) {
        console.warn("NotificationSubscriber.onDoNotDisturbDateChange interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    },
    onEnabledNotificationChanged: function (...args) {
        console.warn("NotificationSubscriber.onEnabledNotificationChanged interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.")
    }
}
export const SubscribeCallbackData = {
    request: NotificationRequest,
    sortingMap: NotificationSortingMap,
    reason: '[PC preview] unknow reason',
    sound: '[PC preview] unknow sound',
    vibrationValues: [paramMock.paramNumberMock],
}
export const EnabledNotificationCallbackData = {
    bundle: '[PC preview] unknow bundle',
    uid: '[PC preview] unknow uid',
    enable: '[PC preview] unknow enable',
}