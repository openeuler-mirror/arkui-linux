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
import { NotificationSlot } from "./notification/notificationSlot"
import { NotificationRequest } from "./notification/notificationRequest"

export const SlotType = {
  UNKNOWN_TYPE: 0,
  SOCIAL_COMMUNICATION: 1,
  SERVICE_INFORMATION: 2,
  CONTENT_INFORMATION: 3,
  OTHER_TYPES: 0xFFFF,
}
export const ContentType = {
  NOTIFICATION_CONTENT_BASIC_TEXT: 0,
  NOTIFICATION_CONTENT_LONG_TEXT: 1,
  NOTIFICATION_CONTENT_PICTURE: 2,
  NOTIFICATION_CONTENT_CONVERSATION: 3,
  NOTIFICATION_CONTENT_MULTILINE: 4,
}
export const SlotLevel = {
  LEVEL_NONE: 0,
  LEVEL_MIN: 1,
  LEVEL_LOW: 2,
  LEVEL_DEFAULT: 3,
  LEVEL_HIGH: 4,
}
export const BundleOption = {
  bundle: '[PC preview] unknow bundle',
  uid: '[PC preview] unknow uid',
}
export const NotificationKey = {
  id: '[PC preview] unknow id',
  label: '[PC preview] unknow label',
}
export const DoNotDisturbType = {
  TYPE_NONE: 0,
  TYPE_ONCE: 1,
  TYPE_DAILY: 2,
  TYPE_CLEARLY: 3,
}
const Date = {
  toString: function () {
    console.warn("Date.toString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toDateString: function () {
    console.warn("Date.toDateString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toTimeString: function () {
    console.warn("Date.toTimeString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toLocaleString: function () {
    console.warn("Date.toLocaleString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toLocaleDateString: function () {
    console.warn("Date.toLocaleDateString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toLocaleTimeString: function () {
    console.warn("Date.toLocaleTimeString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  valueOf: function () {
    console.warn("Date.valueOf interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getTime: function () {
    console.warn("Date.getTime interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getFullYear: function () {
    console.warn("Date.getFullYear interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCFullYear: function () {
    console.warn("Date.getUTCFullYear interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getMonth: function () {
    console.warn("Date.getMonth interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCMonth: function () {
    console.warn("Date.getUTCMonth interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getDate: function () {
    console.warn("Date.getDate interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCDate: function () {
    console.warn("Date.getUTCDate interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getDay: function () {
    console.warn("Date.getDay interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCDay: function () {
    console.warn("Date.getUTCDay interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getHours: function () {
    console.warn("Date.getHours interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCHours: function () {
    console.warn("Date.getUTCHours interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getMinutes: function () {
    console.warn("Date.getMinutes interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCMinutes: function () {
    console.warn("Date.getUTCMinutes interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getSeconds: function () {
    console.warn("Date.getSeconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCSeconds: function () {
    console.warn("Date.getUTCSeconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getMilliseconds: function () {
    console.warn("Date.getMilliseconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getUTCMilliseconds: function () {
    console.warn("Date.getUTCMilliseconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getTimezoneOffset: function () {
    console.warn("Date.getTimezoneOffset interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setTime: function (...args) {
    console.warn("Date.setTime interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setMilliseconds: function (...args) {
    console.warn("Date.setMilliseconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCMilliseconds: function (...args) {
    console.warn("Date.setUTCMilliseconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setSeconds: function (...args) {
    console.warn("Date.setSeconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCSeconds: function (...args) {
    console.warn("Date.setUTCSeconds interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setMinutes: function (...args) {
    console.warn("Date.setMinutes interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCMinutes: function (...args) {
    console.warn("Date.setUTCMinutes interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setHours: function (...args) {
    console.warn("Date.setHours interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCHours: function (...args) {
    console.warn("Date.setUTCHours interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setDate: function (...args) {
    console.warn("Date.setDate interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCDate: function (...args) {
    console.warn("Date.setUTCDate interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setMonth: function (...args) {
    console.warn("Date.setMonth interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCMonth: function (...args) {
    console.warn("Date.setUTCMonth interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setFullYear: function (...args) {
    console.warn("Date.setFullYear interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  setUTCFullYear: function (...args) {
    console.warn("Date.setUTCFullYear interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  toUTCString: function () {
    console.warn("Date.toUTCString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toISOString: function () {
    console.warn("Date.toISOString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  toJSON: function (...args) {
    console.warn("Date.toJSON interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock
  },
}
export const DoNotDisturbDate = {
  type: DoNotDisturbType,
  begin: Date,
  end: Date,
}
export const DeviceRemindType = {
  IDLE_DONOT_REMIND: 0,
  IDLE_REMIND: 1,
  ACTIVE_DONOT_REMIND: 2,
  ACTIVE_REMIND: 3,
}
export const SourceType = {
  TYPE_NORMAL: 0,
  TYPE_CONTINUOUS: 1,
  TYPE_TIMER: 2,
}
export function mockNotification() {
  const notification = {
    publish: function (...args) {
      console.warn('notification.publish interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    publishAsBundle: function (...args) {
      console.warn('notification.publishAsBundle interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    },
    cancel: function (...args) {
      console.warn('notification.cancel interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    cancelAsBundle: function (...args) {
      console.warn('notification.cancelAsBundle interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    },
    cancelAll: function (...args) {
      console.warn('notification.cancelAll interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    addSlot: function (...args) {
      console.warn('notification.addSlot interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    addSlots: function (...args) {
      console.warn('notification.addSlots interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getSlot: function (...args) {
      console.warn('notification.getSlot interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NotificationSlot);
      } else {
        return new Promise((resolve) => {
          resolve(NotificationSlot);
        });
      }
    },
    getSlots: function (...args) {
      console.warn('notification.getSlots interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NotificationSlot]);
      } else {
        return new Promise((resolve) => {
          resolve([NotificationSlot]);
        });
      }
    },
    removeSlot: function (...args) {
      console.warn('notification.removeSlot interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    removeAllSlots: function (...args) {
      console.warn('notification.removeAllSlots interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    SlotType,
    ContentType,
    SlotLevel,
    subscribe: function (...args) {
      console.warn('notification.subscribe interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    unsubscribe: function (...args) {
      console.warn('notification.unsubscribe interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    enableNotification: function (...args) {
      console.warn('notification.enableNotification interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    isNotificationEnabled: function (...args) {
      console.warn('notification.isNotificationEnabled interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    displayBadge: function (...args) {
      console.warn('notification.displayBadge interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    isBadgeDisplayed: function (...args) {
      console.warn('notification.isBadgeDisplayed interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    setSlotByBundle: function (...args) {
      console.warn('notification.setSlotByBundle interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getSlotsByBundle: function (...args) {
      console.warn('notification.getSlotsByBundle interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NotificationSlot]);
      } else {
        return new Promise((resolve) => {
          resolve([NotificationSlot]);
        });
      }
    },
    getSlotNumByBundle: function (...args) {
      console.warn('notification.getSlotNumByBundle interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    remove: function (...args) {
      console.warn('notification.remove interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    removeAll: function (...args) {
      console.warn('notification.removeAll interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getAllActiveNotifications: function (...args) {
      console.warn('notification.getAllActiveNotifications interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NotificationRequest]);
      } else {
        return new Promise((resolve) => {
          resolve([NotificationRequest]);
        });
      }
    },
    getActiveNotificationCount: function (...args) {
      console.warn('notification.getActiveNotificationCount interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    getActiveNotifications: function (...args) {
      console.warn('notification.getActiveNotifications interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NotificationRequest]);
      } else {
        return new Promise((resolve) => {
          resolve([NotificationRequest]);
        });
      }
    },
    cancelGroup: function (...args) {
      console.warn("notification.cancelGroup interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    removeGroupByBundle: function (...args) {
      console.warn("notification.removeGroupByBundle interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setDoNotDisturbDate: function (...args) {
      console.warn("notification.setDoNotDisturbDate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getDoNotDisturbDate: function (...args) {
      console.warn("notification.getDoNotDisturbDate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DoNotDisturbDate);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DoNotDisturbDate);
        })
      }
    },
    supportDoNotDisturbMode: function (...args) {
      console.warn("notification.supportDoNotDisturbMode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isSupportTemplate: function (...args) {
      console.warn("notification.isSupportTemplate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    requestEnableNotification: function (...args) {
      console.warn("notification.requestEnableNotification interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    enableDistributed: function (...args) {
      console.warn("notification.enableDistributed interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    isDistributedEnabled: function (...args) {
      console.warn("notification.isDistributedEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    enableDistributedByBundle: function (...args) {
      console.warn("notification.enableDistributedByBundle interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    isDistributedEnabledByBundle: function (...args) {
      console.warn("notification.isDistributedEnabledByBundle interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    getDeviceRemindType: function (...args) {
      console.warn("notification.getDeviceRemindType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DeviceRemindType);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DeviceRemindType);
        })
      }
    },
    isNotificationSlotEnabled: function (...args) {
      console.warn("notification.isNotificationSlotEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    setSyncNotificationEnabledForUninstallApp: function (...args) {
      console.warn("notification.setSyncNotificationEnabledForUninstallApp interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    enableNotificationSlot: function (...args) {
      console.warn("notification.enableNotificationSlot interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getSyncNotificationEnabledForUninstallApp: function (...args) {
      console.warn("notification.getSyncNotificationEnabledForUninstallApp interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    BundleOption,
    NotificationKey,
    DoNotDisturbType,
    DoNotDisturbDate,
    DeviceRemindType,
    SourceType
  }
  return notification
}
