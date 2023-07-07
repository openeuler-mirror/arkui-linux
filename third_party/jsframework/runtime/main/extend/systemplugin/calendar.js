/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

import { paramMock } from './utils';

export function mockCalendar() {
  const CalendarEntityClass = class CalendarEntity {
    constructor() {
      console.warn('calendar.CalendarEntity.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.id = '[PC preview] unknown id';
    }
  };
  CalendarEntityClass.ACC_TYPE_LOCAL = 'LOCAL';
  CalendarEntityClass.IS_SYNC_ADAPTER = 'caller_is_syncadapter';
  const AccountsClass = class Accounts extends CalendarEntityClass {
    constructor() {
      super();
      console.warn('calendar.Accounts.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.name = '[PC preview] unknown name';
      this.accName = '[PC preview] unknown accName';
      this.accType = '[PC preview] unknown accType';
      this.accColour = '[PC preview] unknown accColour';
      this.accDisplayName = '[PC preview] unknown accDisplayName';
      this.visible = '[PC preview] unknown visible';
      this.accTimezone = '[PC preview] unknown accTimezone';
      this.isSyncEvents = '[PC preview] unknown isSyncEvents';
      this.remindersType = '[PC preview] unknown remindersType';
      this.attendeeTypes = '[PC preview] unknown attendeeTypes';
    }
  };
  AccountsClass.NAME = 'name';
  const EventsClass = class Events extends CalendarEntityClass {
    constructor() {
      super();
      console.warn('calendar.Events.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.accId = '[PC preview] unknown accId';
      this.title = '[PC preview] unknown title';
      this.description = '[PC preview] unknown description';
      this.eventPosition = '[PC preview] unknown eventPosition';
      this.eventStatus = '[PC preview] unknown eventStatus';
      this.eventStartTime = '[PC preview] unknown eventStartTime';
      this.eventEndTime = '[PC preview] unknown eventEndTime';
      this.duration = '[PC preview] unknown duration';
      this.isWholeDay = '[PC preview] unknown isWholeDay';
      this.availableStatus = '[PC preview] unknown availableStatus';
      this.hasAlarm = '[PC preview] unknown hasAlarm';
      this.recurRule = '[PC preview] unknown recurRule';
      this.recurDate = '[PC preview] unknown recurDate';
      this.initialId = '[PC preview] unknown initialId';
      this.hasAttendeeInfo = '[PC preview] unknown hasAttendeeInfo';
    }
  };
  const InstancesClass = class Instances extends CalendarEntityClass {
    constructor() {
      super();
      console.warn('calendar.Instances.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.instanceBegin = '[PC preview] unknown instanceBegin';
      this.instanceEnd = '[PC preview] unknown instanceEnd';
      this.eventId = '[PC preview] unknown eventId';
      this.instanceStartDay = '[PC preview] unknown instanceStartDay';
      this.instanceEndDay = '[PC preview] unknown instanceEndDay';
      this.instanceStartMinute = '[PC preview] unknown instanceStartMinute';
      this.instanceEndMinute = '[PC preview] unknown instanceEndMinute';
    }
  };
  const ParticipantsClass = class Participants extends CalendarEntityClass {
    constructor() {
      super();
      console.warn('calendar.Participants.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.eventId = '[PC preview] unknown eventId';
      this.participantName = '[PC preview] unknown participantName';
      this.participantEmail = '[PC preview] unknown participantEmail';
      this.participantRoleType = '[PC preview] unknown participantRoleType';
      this.participantType = '[PC preview] unknown participantType';
      this.participantStatus = '[PC preview] unknown participantStatus';
    }
  };
  const RemindersClass = class Reminders extends CalendarEntityClass {
    constructor() {
      super();
      console.warn('calendar.Reminders.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.eventId = '[PC preview] unknown eventId';
      this.remindMinutes = '[PC preview] unknown remindMinutes';
      this.remindType = '[PC preview] unknown remindType';
      this.syncId = '[PC preview] unknown syncId';
    }
  };
  const AppletEntityClass = class AppletEntity {
    constructor() {
      console.warn('calendar.AppletEntity.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.title = '[PC preview] unknown title';
      this.startTime = '[PC preview] unknown startTime';
      this.allDay = '[PC preview] unknown allDay';
      this.description = '[PC preview] unknown description';
      this.location = '[PC preview] unknown location';
      this.endTime = '[PC preview] unknown endTime';
      this.alarm = '[PC preview] unknown alarm';
      this.alarmOffset = '[PC preview] unknown alarmOffset';
      this.repeatInterval = '[PC preview] unknown repeatInterval';
      this.repeatEndTime = '[PC preview] unknown repeatEndTime';
    }
  };
  const AppletRepeatEntityClass = class AppletRepeatEntity extends AppletEntityClass {
    constructor() {
      super();
      console.warn('calendar.AppletRepeatEntity.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.repeatInterval = '[PC preview] unknown repeatInterval';
      this.repeatEndTime = '[PC preview] unknown repeatEndTime';
    }
  };
  const CalendarCollectionClass = class CalendarCollection {
    constructor() {
      this.handler = '[PC preview] unknown handler';
      this.close = function (...args) {
        console.warn('calendar.CalendarCollection.close interface mocked in the Previewer. How this interface works on' +
          ' the Previewer may be different from that on a real device.');
      };
      this.count = function (...args) {
        console.warn('calendar.CalendarCollection.count interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return paramMock.paramNumberMock;
      };
      this.next = function (...args) {
        console.warn('calendar.CalendarCollection.next interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new CalendarEntityClass();
      };
      this.hasNext = function (...args) {
        console.warn('calendar.CalendarCollection.hasNext interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return paramMock.paramBooleanMock;
      };
    }
  };
  const CalendarDataHelperClass = class CalendarDataHelper {
    constructor() {
      this.name = '[PC preview] unknown  queryEntityName';
      this.query = function (...args) {
        console.warn('calendar.CalendarDataHelper.query interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, new CalendarCollectionClass());
        } else {
          return new Promise((resolve) => {
            resolve(new CalendarCollectionClass());
          });
        }
      };
      this.insert = function (...args) {
        console.warn('calendar.CalendarDataHelper.insert interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramBooleanMock);
          });
        }
      };
      this.update = function (...args) {
        console.warn('calendar.CalendarDataHelper.update interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          return new Promise((resolve) => {
            resolve();
          });
        }
      };
      this.delete = function (...args) {
        console.warn('calendar.CalendarDataHelper.delete interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          if (typeof args[0] === 'number') {
            args[len - 1].call(this, paramMock.businessErrorMock);
          } else if (args[0] instanceof CalendarEntityClass) {
            args[len - 1].call(this, paramMock.businessErrorMock);
          } else {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
          }
        } else {
          if (typeof args[0] === 'number') {
            return new Promise((resolve) => {
              resolve();
            });
          } else if (args[0] instanceof CalendarEntityClass) {
            return new Promise((resolve) => {
              resolve();
            });
          } else {
            return new Promise((resolve) => {
              resolve(paramMock.paramNumberMock);
            });
          }
        }
      };
    }
  };
  CalendarDataHelperClass.creator = function (...args) {
    console.warn('calendar.CalendarDataHelper.creator interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.');
    return new CalendarDataHelperClass();
  };
  global.systemplugin.calendar = {
    BaseColumns: {
      COUNT: "_count",
      ID: "_id"
    },
    AccountColumns: {
      ACC_COLOR: "calendar_color",
      ACC_COLOR_INDEX: "calendar_color_index",
      ACC_DISPLAY_NAME: "calendar_displayName",
      VISIBLE: "visible",
      ACC_TIME_ZONE: "calendar_timezone",
      IS_SYNC_EVENTS: "sync_events",
      REMINDERS_TYPE: "allowedReminders",
      AVAILABILITY_STATUS: "allowedAvailability",
      ATTENDEE_TYPES: "allowedAttendeeTypes",
      IS_PRIMARY: "isPrimary"
    },
    AccountSyncColumns: {
      ACC_SYNC1: "cal_sync1",
      ACC_SYNC2: "cal_sync2",
      ACC_SYNC3: "cal_sync3",
      ACC_SYNC4: "cal_sync4",
      ACC_SYNC5: "cal_sync5",
      ACC_SYNC6: "cal_sync6",
      ACC_SYNC7: "cal_sync7",
      ACC_SYNC8: "cal_sync8",
      ACC_SYNC9: "cal_sync9",
      ACC_SYNC10: "cal_sync10"
    },
    EventsColumns: {
      ACC_ID: "calendar_id",
      TITLE: "title",
      DESCRIPTION: "description",
      EVENT_POSITION: "eventLocation",
      EVENT_STATUS: "eventStatus",
      EVENT_STATUS_TENTATIVE: 0,
      EVENT_STATUS_CONFIRMED: 1,
      EVENT_STATUS_CANCELED: 2,
      OWNER_ATTENDEE_STATUS: "selfAttendeeStatus",
      EXTEND_DATA1: "sync_data1",
      EXTEND_DATA2: "sync_data2",
      EXTEND_DATA3: "sync_data3",
      EXTEND_DATA4: "sync_data4",
      EXTEND_DATA5: "sync_data5",
      EXTEND_DATA6: "sync_data6",
      D_DATA7: "sync_data7",
      EXTEND_DATA8: "sync_data8",
      EXTEND_DATA9: "sync_data9",
      EXTEND_DATA10: "sync_data10",
      EVENT_START_TIME: "dtstart",
      EVENT_END_TIME: "dtend",
      DURATION: "duration",
      START_TIMEZONE: "eventTimezone",
      END_TIMEZONE: "eventEndTimezone",
      IS_WHOLE_DAY: "allDay",
      PERMISSION_LEVEL: "accessLevel",
      PERMISSION_DEFAULT: 0,
      PERMISSION_CONFIDENTIAL: 1,
      PERMISSION_PRIVATE: 2,
      PERMISSION_PUBLIC: 3,
      AVAILABLE_STATUS: "availability",
      STATUS_BUSY: 0,
      STATUS_FREE: 1,
      STATUS_TENTATIVE: 2,
      HAS_ALARM: "hasAlarm",
      HAS_EXTENDED_ATTRIBUTES: "hasExtendedProperties",
      RECUR_RULE: "rrule",
      RECUR_DATE: "rdate",
      INITIAL_ID: "original_id",
      INITIAL_SYNC_ID: "original_sync_id",
      HAS_ATTENDEE_INFO: "hasAttendeeData",
      ORGANIZER_EMAIL: "organizer"
    },
    InstancesColumns: {
      EVENT_ID: "event_id",
      INSTANCE_START: "begin",
      INSTANCE_END: "end",
      INSTANCE_START_DAY: "startDay",
      INSTANCE_END_DAY: "endDay",
      INSTANCE_START_MINUTE: "startMinute",
      INSTANCE_END_MINUTE: "endMinute"
    },
    ParticipantsColumns: {
      EVENT_ID: "event_id",
      PARTICIPANT_NAME: "attendeeName",
      PARTICIPANT_EMAIL: "attendeeEmail",
      PARTICIPANT_ROLE_TYPE: "attendeeRelationship",
      ROLE_NONE: 0,
      ROLE_ATTENDEE: 1,
      ROLE_ORGANIZER: 2,
      ROLE_PERFORMER: 3,
      ROLE_SPEAKER: 4,
      PARTICIPANT_TYPE: "attendeeType",
      TYPE_NONE: 0,
      TYPE_REQUIRED: 1,
      TYPE_OPTIONAL: 2,
      TYPE_RESOURCE: 3,
      PARTICIPANT_STATUS: "attendeeStatus",
      PARTICIPANT_STATUS_NONE: 0,
      PARTICIPANT_STATUS_ACCEPTED: 1,
      PARTICIPANT_STATUS_DECLINED: 2,
      PARTICIPANT_STATUS_INVITED: 3,
      PARTICIPANT_STATUS_TENTATIVE: 4
    },
    RemindersColumns: {
      EVENT_ID: "event_id",
      REMIND_MINUTES: "minutes",
      REMIND_MINUTES_DEFAULT: -1,
      REMIND_TYPE: "method",
      TYPE_DEFAULT: 0,
      TYPE_ALERT: 1,
      TYPE_EMAIL: 2,
      TYPE_SMS: 3,
      TYPE_ALARM: 4
    },
    SyncColumns: {
      ACC_NAME: "account_name",
      ACC_TYPE: "account_type",
      SYNC_ID: "_sync_id",
      DIRTY: "dirty",
      CALLING_BUNDLE_NAME: "mutators",
      DELETED: "deleted"
    },
    queryEntityName: {
      EVENTS: "EVENTS",
      ACCOUNTS: "ACCOUNTS",
      INSTANCES: "INSTANCES",
      PARTICIPANTS: "PARTICIPANTS",
      REMINDERS: "REMINDERS"
    },
    CalendarEntity: CalendarEntityClass,
    Accounts: AccountsClass,
    Events: EventsClass,
    Instances: InstancesClass,
    Participants: ParticipantsClass,
    Reminders: RemindersClass,
    AppletEntity: AppletEntityClass,
    AppletRepeatEntity: AppletRepeatEntityClass,
    CalendarCollection: CalendarCollectionClass,
    CalendarDataHelper: CalendarDataHelperClass,
    addPhoneCalendar: function (...args) {
      console.warn('calendar.addPhoneCalendar interface mocked in the Previewer. How this interface works on the' +
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
    addPhoneRepeatCalendar: function (...args) {
      console.warn('calendar.addPhoneRepeatCalendar interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    }
  };
}
