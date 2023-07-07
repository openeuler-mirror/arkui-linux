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

import { paramMock } from "../utils"
export const SimShortMessage = {
  shortMessage: ShortMessage,
  simMessageStatus: SimMessageStatus,
  indexOnSim: "[PC Preview] unknow indexOnSim"
}
export const ShortMessage = {
  visibleMessageBody: "[PC Preview] unknow visibleMessageBody",
  visibleRawAddress: "[PC Preview] unknow visibleRawAddress",
  messageClass: ShortMessageClass,
  protocolId: "[PC Preview] unknow protocolId",
  scAddress: "[PC Preview] unknow scAddress",
  scTimestamp: "[PC Preview] unknow scTimestamp",
  isReplaceMessage: "[PC Preview] unknow isReplaceMessage",
  hasReplyPath: "[PC Preview] unknow hasReplyPath",
  pdu: ["[PC Preview] unknow pdu"],
  status: "[PC Preview] unknow status",
  isSmsStatusReportMessage: "[PC Preview] unknow isSmsStatusReportMessage",
  emailAddress: "[PC Preview] unknow emailAddress",
  emailMessageBody: "[PC Preview] unknow emailMessageBody",
  userRawData: ["[PC Preview] unknow userRawData"],
  isEmailMessage: "[PC Preview] unknow isEmailMessage",
}
export const SimMessageStatus = {
  SIM_MESSAGE_STATUS_FREE: 0,
  SIM_MESSAGE_STATUS_READ: 1,
  SIM_MESSAGE_STATUS_UNREAD: 3,
  SIM_MESSAGE_STATUS_SENT: 5,
  SIM_MESSAGE_STATUS_UNSENT: 7,
}
export const MmsInformation = {
  messageType: MessageType,
  mmsType: MmsSendReq,
  attachment: [MmsAttachment]
}
export const MessageType = {
  TYPE_MMS_SEND_REQ: 128,
  TYPE_MMS_SEND_CONF: 129,
  TYPE_MMS_NOTIFICATION_IND: 130,
  TYPE_MMS_RESP_IND: 131,
  TYPE_MMS_RETRIEVE_CONF: 132,
  TYPE_MMS_ACKNOWLEDGE_IND: 133,
  TYPE_MMS_DELIVERY_IND: 134,
  TYPE_MMS_READ_REC_IND: 135,
  TYPE_MMS_READ_ORIG_IND: 136,
};
export const MmsAttachment = {
  contentId: "[PC Preview] unknow contentId",
  contentLocation: "[PC Preview] unknow contentLocation",
  contentDisposition: DispositionType,
  contentTransferEncoding: "[PC Preview] unknow contentTransferEncoding",
  contentType: "[PC Preview] unknow contentType",
  isSmil: "[PC Preview] unknow isSmil",
  path: "[PC Preview] unknow path",
  inBuff: "[PC Preview] unknow inBuff",
  fileName: "[PC Preview] unknow fileName",
  charset: MmsCharSets,
}
export const DispositionType = {
  FROM_DATA: 0,
  ATTACHMENT: 1,
  INLINE: 2,
}
export const MmsCharSets = {
  BIG5: 0X07EA,
  ISO_10646_UCS_2: 0X03E8,
  ISO_8859_1: 0X04,
  ISO_8859_2: 0X05,
  ISO_8859_3: 0X06,
  ISO_8859_4: 0X07,
  ISO_8859_5: 0X08,
  ISO_8859_6: 0X09,
  ISO_8859_7: 0X10,
  ISO_8859_8: 0X11,
  ISO_8859_9: 0X12,
  SHIFT_JIS: 0X11,
  US_ASCII: 0X03,
  UTF_8: 0X6A,
}
export const MmsRetrieveConf = {
  transactionId: "[PC Preview] unknow transactionId",
  messageId: "[PC Preview] unknow messageId",
  date: "[PC Preview] unknow date",
  contentType: "[PC Preview] unknow contentType",
  to: [MmsAddress],
  version: MmsVersionType,
  from: MmsAddress,
  cc: [MmsAddress],
  subject: ["[PC Preview] unknow subject"],
  priority: MmsPriorityType,
  deliveryReport: "[PC Preview] unknow deliveryReport",
  readReport: "[PC Preview] unknow readReport",
  retrieveStatus: "[PC Preview] unknow retrieveStatus",
  retrieveText: ["[PC Preview] unknow retrieveText"],
}
export const MmsAcknowledgeInd = {
  transactionId: "[PC Preview] unknow transactionId",
  version: MmsVersionType,
  reportAllowed: ReportType,
}
export const MmsDeliveryInd = {
  transactionId: "[PC Preview] unknow transactionId",
  date: "[PC Preview] unknow date",
  to: [MmsAddress],
  status: "[PC Preview] unknow status",
  version: MmsVersionType,
  messageId: "[PC Preview] unknow messageId",
}
export const MmsReadRecInd = {
  version: MmsVersionType,
  messageId: "[PC Preview] unknow messageId",
  to: [MmsAddress],
  from: MmsAddress,
  readStatus: "[PC Preview] unknow readStatus",
  date: "[PC Preview] unknow date",
}
export const MmsReadOrigInd = {
  version: MmsVersionType,
  messageId: "[PC Preview] unknow messageId",
  to: [MmsAddress],
  from: MmsAddress,
  date: "[PC Preview] unknow date",
  readStatus: "[PC Preview] unknow readStatus",
}
export const MmsRespInd = {
  transactionId: "[PC Preview] unknow transactionId",
  status: "[PC Preview] unknow transactionId",
  version: MmsVersionType,
  reportAllowed: ReportType,
}
export const CBConfigOptions = {
  slotId: "[PC Preview] unknow slotId",
  enable: "[PC Preview] unknow enable",
  startMessageId: "[PC Preview] unknow startMessageId",
  endMessageId: "[PC Preview] unknow endMessageId",
  ranType: RanType
}
export const SimMessageOptions = {
  slotId: "[PC Preview] unknow slotId",
  smsc: "[PC Preview] unknow smsc",
  pdu: "[PC Preview] unknow pdu",
  status: SimMessageStatus,
}
export const UpdateSimMessageOptions = {
  slotId: "[PC Preview] unknow slotId",
  msgIndex: "[PC Preview] unknow msgIndex",
  newStatus: SimMessageStatus,
  pdu: "[PC Preview] unknow pdu",
  smsc: "[PC Preview] unknow smsc",
}
export const SendMessageOptions = {
  slotId: "[PC Preview] unknow slotId",
  destinationHost: "[PC Preview] unknow destinationHost",
  serviceCenter: "[PC Preview] unknow serviceCenter",
  content: "[PC Preview] unknow content",
  destinationPort: "[PC Preview] unknow destinationPort",
  sendCallback: ISendShortMessageCallback,
  deliveryCallback: IDeliveryShortMessageCallback,
}
export const IDeliveryShortMessageCallback = {
  pdu: "[PC Preview] unknow pdu",
}
export const ISendShortMessageCallback = {
  result: SendSmsResult,
  url: "[PC Preview] unknow url",
  isLastPart: "[PC Preview] unknow isLastPart",
}
export const SendSmsResult = {
  SEND_SMS_SUCCESS: 0,
  SEND_SMS_FAILURE_UNKNOWN: 1,
  SEND_SMS_FAILURE_RADIO_OFF: 2,
  SEND_SMS_FAILURE_SERVICE_UNAVAILABLE: 3
}
export const ShortMessageClass = {
  UNKNOWN: "[PC Preview] unknow UNKNOWN",
  INSTANT_MESSAGE: "[PC Preview] unknow INSTANT_MESSAGE",
  OPTIONAL_MESSAGE: "[PC Preview] unknow OPTIONAL_MESSAGE",
  SIM_MESSAGE: "[PC Preview] unknow SIM_MESSAGE",
  FORWARD_MESSAGE: "[PC Preview] unknow FORWARD_MESSAGE",
}
export const RanType = {
  TYPE_GSM: 1,
  TYPE_CDMA: 2,
}
export const ReportType = {
  MMS_YES: 128,
  MMS_NO: 129,
}
export const MmsNotificationInd = {
  transactionId: "[PC Preview] unknow transactionId",
  messageClass: "[PC Preview] unknow messageClass",
  messageSize: "[PC Preview] unknow messageSize",
  expiry: "[PC Preview] unknow expiry",
  contentLocation: "[PC Preview] unknow contentLocation",
  version: MmsVersionType,
  from: MmsAddress,
  subject: "[PC Preview] unknow subject",
  deliveryReport: ["[PC Preview] unknow deliveryReport"],
  contentClass: "[PC Preview] unknow contentClass",
}
export const MmsAddress = {
  address: "[PC Preview] unknow address",
  charset: MmsCharSets,
}
export const MmsVersionType = {
  MMS_VERSION_1_0: 0x10,
  MMS_VERSION_1_1: 0x11,
  MMS_VERSION_1_2: 0x12,
  MMS_VERSION_1_3: 0x13,
}
export const MmsPriorityType = {
  MMS_LOW: 128,
  MMS_NORMAL: 129,
  MMS_HIGH: 130,
}
export const MmsSendReq = {
  from: MmsAddress,
  transactionId: "[PC Preview] unknow transactionId",
  contentType: "[PC Preview] unknow contentType",
  version: MmsVersionType,
  to: [MmsAddress],
  date: "[PC Preview] unknow date",
  cc: [MmsAddress],
  bcc: [MmsAddress],
  subject: ["[PC Preview] unknow subject"],
  messageClass: "[PC Preview] unknow messageClass",
  expiry: "[PC Preview] unknow expiry",
  priority: MmsPriorityType,
  senderVisibility: "[PC Preview] unknow senderVisibility",
  deliveryReport: ["[PC Preview] unknow deliveryReport"],
  readReport: "[PC Preview] unknow readReport",
  responseState: "[PC Preview] unknow responseState",
  transactionId: "[PC Preview] unknow transactionId",
  version: "[PC Preview] unknow version",
  messageId: "[PC Preview] unknow messageId",
}
export const MmsSendConf = {
  responseState: "[PC Preview] unknow responseState",
  transactionId: "[PC Preview] unknow transactionId",
  version: MmsVersionType,
  messageId: "[PC Preview] unknow messageId",
}
export const SmsSegmentsInfo = {
  splitCount: "[PC Preview] unknow splitCount",
  encodeCount: "[PC Preview] unknow encodeCount",
  encodeCountRemaining: "[PC Preview] unknow encodeCountRemaining",
  scheme: SmsEncodingScheme,
}
export const SmsEncodingScheme = {
  SMS_ENCODING_UNKNOWN: 0,
  SMS_ENCODING_7BIT: 1,
  SMS_ENCODING_8BIT: 2,
  SMS_ENCODING_16BIT: 3,
}
export function mockSMS() {
  const sms = {
    SimMessageStatus,
    SmsEncodingScheme,
    DispositionType,
    SendSmsResult,
    MessageType,
    ShortMessage,
    MmsCharSets,
    MmsPriorityType,
    MmsVersionType,
    ReportType,
    SimShortMessage,
    RanType,
    ShortMessageClass,
    splitMessage: function (...args) {
      console.warn("telephony.sms.splitMessage interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramStringMock]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([paramMock.paramStringMock]);
        })
      }
    },
    createMessage: function (...args) {
      console.warn("telephony.sms.createMessage interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ShortMessage);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ShortMessage);
        })
      }
    },
    getSmsSegmentsInfo: function (...args) {
      console.warn("telephony.sms.getSmsSegmentsInfo interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, SmsSegmentsInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SmsSegmentsInfo);
        })
      }
    },
    isImsSmsSupported: function (...args) {
      console.warn("telephony.sms.isImsSmsSupported interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    getImsShortMessageFormat: function (...args) {
      console.warn("telephony.sms.getImsShortMessageFormat interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    decodeMms: function (...args) {
      console.warn("telephony.sms.decodeMms interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, MmsInformation);
      } else {
        return new Promise((resolve, reject) => {
          resolve(MmsInformation);
        })
      }
    },
    encodeMms: function (...args) {
      console.warn("telephony.sms.encodeMms interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    isImsSmsSuppo: function (...args) {
      console.warn("telephony.sms.isImsSmsSuppo interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    sendMessage: function (...args) {
      console.warn("telephony.sms.sendMessage interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    setDefaultSmsSlotId: function (...args) {
      console.warn("telephony.sms.setDefaultSmsSlotId interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getDefaultSmsSlotId: function (...args) {
      console.warn("telephony.sms.getDefaultSmsSlotId interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    setSmscAddr: function (...args) {
      console.warn("telephony.sms.setSmscAddr interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getSmscAddr: function (...args) {
      console.warn("telephony.sms.getSmscAddr interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    hasSmsCapability: function () {
      console.warn("telephony.sms.hasSmsCapability interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    addSimMessage: function (...args) {
      console.warn("telephony.sms.addSimMessage interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    delSimMessage: function (...args) {
      console.warn("telephony.sms.delSimMessage interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    updateSimMessage: function (...args) {
      console.warn("telephony.sms.updateSimMessage interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getAllSimMessages: function (...args) {
      console.warn("telephony.sms.getAllSimMessages interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [SimShortMessage]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([SimShortMessage]);
        })
      }
    },
    setCBConfig: function (...args) {
      console.warn("telephony.sms.setCBConfig interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    }
  }
  return sms
}