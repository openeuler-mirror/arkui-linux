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

import { paramMock } from "../utils"

export function mockReminderAgent() {
  const infoMock = {
    reminderId: "[PC preview] unknown reminderId",
    info: "[PC preview] unknown info"
  }
  const reminderReq = {
    reminderType: "[PC preview] unknown reminderType",
    actionButton: [
      {
        title: "[PC preview] unknown title",
        type: "[PC preview] unknown type"
      }
    ],
    wantAgent: {
      pkgName: "[PC preview] unknown pkg nam",
      abilityName: "[PC preview] unknown ability name"
    },
    maxScreenWantAgent: {
      pkgName: "[PC preview] unknown pkg name",
      abilityName: "[PC preview] unknown ability name"
    },
    ringDuration: "[PC preview] unknown ringDuration",
    snoozeTimes: "[PC preview] unknown snoozeTimes",
    timeInterval: "[PC preview] unknown timeInterval",
    title: "[PC preview] unknown title",
    content: "[PC preview] unknown content",
    expiredContent: "[PC preview] unknown expiredContent",
    snoozeContent: "[PC preview] unknown snoozeContent",
    notificationId: "[PC preview] unknown notificationId",
    slotType: "[PC preview] unknown slotType"
  }
  const reminderReqs = [
    reminderReq
  ]
  const ActionButton = {
    title: "[PC preview] unknown title",
    type: "[PC preview] unknown type"
  }
  const WantAgent = {
    pkgName: "[PC preview] unknown pkgName",
    abilityName: "[PC preview] unknown abilityName"
  }
  const MaxScreenWantAgent = {
    pkgName: "[PC preview] unknown pkgName",
    abilityName: "[PC preview] unknown abilityName"
  }
  const ReminderRequest = {
    reminderType: "[PC preview] unknown reminderType",
    actionButton: ActionButton,
    wantAgent: WantAgent,
    maxScreenWantAgent: MaxScreenWantAgent,
    ringDuration: "[PC preview] unknown ringDuration",
    snoozeTimes: "[PC preview] unknown snoozeTimes",
    timeInterval: "[PC preview] unknown timeInterval",
    title: "[PC preview] unknown title",
    content: "[PC preview] unknown content",
    expiredContent: "[PC preview] unknown expiredContent",
    snoozeContent: "[PC preview] unknown snoozeContent",
    notificationId: "[PC preview] unknown notificationId",
    slotType: "[PC preview] unknown slotType"
  }
  const ReminderRequestCalendar = {
    dateTime: LocalDateTime,
    repeatMonths: "[PC preview] unknown repeatMonths",
    repeatDays: "[PC preview] unknown repeatDays"
  }
  const ReminderRequestAlarm = {
    hour: "[PC preview] unknown hour",
    minute: "[PC preview] unknown minute",
    daysOfWeek: "[PC preview] unknown daysOfWeek"
  }
  const ReminderRequestTimer = {
    triggerTimeInSeconds: "[PC preview] unknown triggerTimeInSeconds"
  }
  const LocalDateTime = {
    year: "[PC preview] unknown year",
    month: "[PC preview] unknown month",
    day: "[PC preview] unknown day",
    hour: "[PC preview] unknown hour",
    minute: "[PC preview] unknown minute",
    second: "[PC preview] unknown second"
  }
  const reminderAgent = {
    ActionButtonType: {
      ACTION_BUTTON_TYPE_CLOSE: 0,
      ACTION_BUTTON_TYPE_SNOOZE: 1
    },
    ReminderType: {
      REMINDER_TYPE_TIMER: 0,
      REMINDER_TYPE_CALENDAR: 1,
      REMINDER_TYPE_ALARM: 2
    },
    publishReminder: function (...args) {
      console.warn("reminderAgent.publishReminder interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, infoMock.reminderId)
      } else {
        return new Promise((resolve) => {
          resolve(infoMock.reminderId)
        });
      }
    },
    getValidReminders: function (...args) {
      console.warn("reminderAgent.getValidReminders interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, reminderReqs)
      } else {
        return new Promise((resolve) => {
          resolve(reminderReqs)
        });
      }
    },
    cancelReminder: function (...args) {
      console.warn("reminderAgent.cancelReminder interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    cancelAllReminders: function (...args) {
      console.warn("reminderAgent.cancelAllReminders interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    addNotificationSlot: function (...args) {
      console.warn("reminderAgent.addNotificationSlot interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    removeNotificationSlot: function (...args) {
      console.warn("reminderAgent.removeNotificationSlot interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    }
  }
  return reminderAgent
}