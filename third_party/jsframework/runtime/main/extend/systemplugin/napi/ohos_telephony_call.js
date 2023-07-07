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
export const ImsCallMode = {
  CALL_MODE_AUDIO_ONLY: 0,
  CALL_MODE_SEND_ONLY: 1,
  CALL_MODE_RECEIVE_ONLY: 2,
  CALL_MODE_SEND_RECEIVE: 3,
  CALL_MODE_VIDEO_PAUSED: 4,
}
export const AudioDevice = {
  DEVICE_MIC: "[PC Preview] unknow DEVICE_MIC",
  DEVICE_SPEAKER: "[PC Preview] unknow DEVICE_SPEAKER",
  DEVICE_WIRED_HEADSET: "[PC Preview] unknow DEVICE_WIRED_HEADSET",
  DEVICE_BLUETOOTH_SCO: "[PC Preview] unknow DEVICE_BLUETOOTH_SCO",
}
export const CallRestrictionType = {
  RESTRICTION_TYPE_ALL_INCOMING: 0,
  RESTRICTION_TYPE_ALL_OUTGOING: 1,
  RESTRICTION_TYPE_INTERNATIONAL: 2,
  RESTRICTION_TYPE_INTERNATIONAL_EXCLUDING_HOME: 3,
  RESTRICTION_TYPE_ROAMING_INCOMING: 4,
  RESTRICTION_TYPE_ALL_CALLS: 5,
  RESTRICTION_TYPE_OUTGOING_SERVICES: 6,
  RESTRICTION_TYPE_INCOMING_SERVICES: 7,
}
export const CallTransferInfo = {
  transferNum: "[PC Preview] unknow transferNum",
  type: CallTransferType,
  settingType: CallTransferSettingType,
}
export const CallTransferSettingType = {
  CALL_TRANSFER_DISABLE: 0,
  CALL_TRANSFER_ENABLE: 1,
  CALL_TRANSFER_REGISTRATION: 3,
  CALL_TRANSFER_ERASURE: 4,
}
export const CallTransferType = {
  TRANSFER_TYPE_UNCONDITIONAL: 0,
  TRANSFER_TYPE_BUSY: 1,
  TRANSFER_TYPE_NO_REPLY: 2,
  TRANSFER_TYPE_NOT_REACHABLE: 3,
}
export const ConferenceState = {
  TEL_CONFERENCE_IDLE: 0,
  TEL_CONFERENCE_ACTIVE: 1,
  TEL_CONFERENCE_DISCONNECTING: 2,
  TEL_CONFERENCE_DISCONNECTED: 3,
};
export const CallType = {
  TYPE_CS: 0,
  TYPE_IMS: 1,
  TYPE_OTT: 2,
  TYPE_ERR_CALL: 3,
}
export const VideoStateType = {
  TYPE_VOICE: 0,
  TYPE_VIDEO: 1,
}
export const DetailedCallState = {
  CALL_STATUS_ACTIVE: 0,
  CALL_STATUS_HOLDING: 1,
  CALL_STATUS_DIALING: 2,
  CALL_STATUS_ALERTING: 3,
  CALL_STATUS_INCOMING: 4,
  CALL_STATUS_WAITING: 5,
  CALL_STATUS_DISCONNECTED: 6,
  CALL_STATUS_DISCONNECTING: 7,
  CALL_STATUS_IDLE: 8,
}
export const CallState = {
  CALL_STATE_UNKNOWN: -1,
  CALL_STATE_IDLE: 0,
  CALL_STATE_RINGING: 1,
  CALL_STATE_OFFHOOK: 2,
}
export const CallRestrictionInfo = {
  type: CallRestrictionType,
  password: "[PC Preview] unknow password",
  mode: CallRestrictionMode,
}
export const DialOptions = {
  extras: "[PC Preview] unknow extras",
  accountId: "[PC Preview] unknow accountId",
  videoState: VideoStateType,
  dialScene: DialScene,
  dialType: DialType,
}
export const DialScene = {
  CALL_NORMAL: 0,
  CALL_PRIVILEGED: 1,
  CALL_EMERGENCY: 2,
}
export const DialType = {
  DIAL_CARRIER_TYPE: 0,
  DIAL_VOICE_MAIL_TYPE: 1,
  DIAL_OTT_TYPE: 2,
}
export const CallRestrictionMode = {
  RESTRICTION_MODE_DEACTIVATION: 0,
  RESTRICTION_MODE_ACTIVATION: 1,
}
export const CallEventOptions = {
  eventId: CallAbilityEventId
}
export const NumberFormatOptions = {
  countryCode: "[PC Preview] unknow countryCode"
}
export const CallAbilityEventId = {
  EVENT_DIAL_NO_CARRIER: 1,
  EVENT_INVALID_FDN_NUMBER: 2,
}
export const RejectMessageOptions = {
  messageContent: "[PC Preview] unknow messageContent"
}
export const CallWaitingStatus = {
  CALL_WAITING_DISABLE: 0,
  CALL_WAITING_ENABLE: 1,
};
export const RestrictionStatus = {
  RESTRICTION_DISABLE: 0,
  RESTRICTION_ENABLE: 1,
};
export const TransferStatus = {
  TRANSFER_DISABLE: 0,
  TRANSFER_ENABLE: 1,
};
export const CallAttributeOptions = {
  accountNumber: "[PC Preview] unknow accountNumber",
  speakerphoneOn: "[PC Preview] unknow speakerphoneOn",
  accountId: "[PC Preview] unknow accountId",
  videoState: VideoStateType,
  startTime: "[PC Preview] unknow startTime",
  isEcc: "[PC Preview] unknow isEcc",
  callType: CallType,
  callId: "[PC Preview] unknow callId",
  callState: DetailedCallState,
  conferenceState: ConferenceState,
  status: "[PC Preview] unknow status",
  number: "[PC Preview] unknow number",
}
export const EmergencyNumberOptions = {
  slotId: "[PC Preview] unknow slotId"
}
export const CallTransferResult = {
  status: "[PC Preview] unknow status",
  number: "[PC Preview] unknow number",
}
export const DisconnectedDetails = {
  UNASSIGNED_NUMBER: 1,
  NO_ROUTE_TO_DESTINATION: 3,
  CHANNEL_UNACCEPTABLE: 6,
  OPERATOR_DETERMINED_BARRING: 8,
  NORMAL_CALL_CLEARING: 16,
  USER_BUSY: 17,
  NO_USER_RESPONDING: 18,
  USER_ALERTING_NO_ANSWER: 19,
  CALL_REJECTED: 21,
  NUMBER_CHANGED: 22,
  DESTINATION_OUT_OF_ORDER: 27,
  INVALID_NUMBER_FORMAT: 28,
  NETWORK_OUT_OF_ORDER: 38,
  TEMPORARY_FAILURE: 41,
  INVALID_PARAMETER: 1025,
  SIM_NOT_EXIT: 1026,
  SIM_PIN_NEED: 1027,
  CALL_NOT_ALLOW: 1029,
  SIM_INVALID: 1045,
  UNKNOWN: 1279,
};
export function mockCall() {
  const call = {
    ImsCallMode,
    AudioDevice,
    CallRestrictionType,
    TransferStatus,
    CallTransferSettingType,
    CallWaitingStatus,
    CallTransferType,
    ConferenceState,
    DisconnectedDetails,
    CallAbilityEventId,
    CallType,
    VideoStateType,
    DetailedCallState,
    CallState,
    DialScene,
    RestrictionStatus,
    CallTransferResult,
    DialType,
    CallRestrictionMode,
    dial: function (...args) {
      console.warn("telephony.call.dial interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    makeCall: function (...args) {
      console.warn("telephony.call.makeCall interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    hasCall: function (...args) {
      console.warn("telephony.call.hasCall interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getCallState: function (...args) {
      console.warn("telephony.call.getCallState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CallState);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CallState);
        })
      }
    },
    displayCallScreen: function (...args) {
      console.warn("telephony.call.displayCallScreen interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    muteRinger: function (...args) {
      console.warn("telephony.call.muteRinger interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    hasVoiceCapability: function () {
      console.warn("telephony.call.hasVoiceCapability interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isVideoCallingEnabled: function (...args) {
      console.warn("telephony.call.isVideoCallingEnabled interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    inputDialerSpecialCode: function (...args) {
      console.warn("telephony.call.inputDialerSpecialCode interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    isHacEnabled: function (...args) {
      console.warn("telephony.call.isHacEnabled interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    isEmergencyPhoneNumber: function (...args) {
      console.warn("telephony.call.isEmergencyPhoneNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    formatPhoneNumber: function (...args) {
      console.warn("telephony.call.formatPhoneNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    formatPhoneNumberToE164: function (...args) {
      console.warn("telephony.call.formatPhoneNumberToE164 interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    comparePhoneNumbers: function (...args) {
      console.warn("telephony.call.comparePhoneNumbers interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getCallerIndex: function (...args) {
      console.warn("telephony.call.getCallerIndex interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getCountryCodeFromDbNumber: function (...args) {
      console.warn("telephony.call.getCountryCodeFromDbNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getIntlPrefixAndCountryCodeLen: function (...args) {
      console.warn("telephony.call.getIntlPrefixAndCountryCodeLen interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    answer: function (...args) {
      console.warn("telephony.call.answer interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    hangup: function (...args) {
      console.warn("telephony.call.hangup interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    reject: function (...args) {
      console.warn("telephony.call.reject interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    holdCall: function (...args) {
      console.warn("telephony.call.holdCall interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    unHoldCall: function (...args) {
      console.warn("telephony.call.unHoldCall interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    switchCall: function (...args) {
      console.warn("telephony.call.switchCall interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    combineConference: function (...args) {
      console.warn("telephony.call.combineConference interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getMainCallId: function (...args) {
      console.warn("telephony.call.getMainCallId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSubCallIdList: function (...args) {
      console.warn("telephony.call.getSubCallIdList interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    getCallIdListForConference: function (...args) {
      console.warn("telephony.call.getCallIdListForConference interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    getCallWaitingStatus: function (...args) {
      console.warn("telephony.call.getCallWaitingStatus interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CallWaitingStatus);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CallWaitingStatus);
        })
      }
    },
    setCallWaiting: function (...args) {
      console.warn("telephony.call.setCallWaiting interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    startDTMF: function (...args) {
      console.warn("telephony.call.startDTMF interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    stopDTMF: function (...args) {
      console.warn("telephony.call.stopDTMF interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    isInEmergencyCall: function (...args) {
      console.warn("telephony.call.isInEmergencyCall interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    on: function (...args) {
      console.warn("telephony.call.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'callDetailsChange') {
          args[len - 1].call(this, CallAttributeOptions);
        } else if (args[0] == 'callEventChange') {
          args[len - 1].call(this, CallEventOptions);
        } else if (args[0] == 'callDisconnectedCause') {
          args[len - 1].call(this, DisconnectedDetails);
        }
      }
    },
    off: function (...args) {
      console.warn("telephony.call.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'callDetailsChange') {
          args[len - 1].call(this, CallAttributeOptions);
        } else if (args[0] == 'callEventChange') {
          args[len - 1].call(this, CallEventOptions);
        } else if (args[0] == 'callDisconnectedCause') {
          args[len - 1].call(this, DisconnectedDetails);
        }
      }
    },
    cancelMuted: function (...args) {
      console.warn("telephony.call.cancelMuted interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    joinConference: function (...args) {
      console.warn("telephony.call.joinConference interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    disableImsSwitch: function (...args) {
      console.warn("telephony.call.disableImsSwitch interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    enableImsSwitch: function (...args) {
      console.warn("telephony.call.enableImsSwitch interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    updateImsCallMode: function (...args) {
      console.warn("telephony.call.updateImsCallMode interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    isNewCallAllowed: function (...args) {
      console.warn("telephony.call.isNewCallAllowed interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    separateConference: function (...args) {
      console.warn("telephony.call.separateConference interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getCallRestrictionStatus: function (...args) {
      console.warn("telephony.call.getCallRestrictionStatus interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, RestrictionStatus);
      } else {
        return new Promise((resolve, reject) => {
          resolve(RestrictionStatus);
        })
      }
    },
    setCallRestriction: function (...args) {
      console.warn("telephony.call.setCallRestriction interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setCallTransfer: function (...args) {
      console.warn("telephony.call.setCallTransfer interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getCallTransferInfo: function (...args) {
      console.warn("telephony.call.getCallTransferInfo interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CallTransferResult);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CallTransferResult);
        })
      }
    },
    setCallTransferInfo: function (...args) {
      console.warn("telephony.call.setCallTransferInfo interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    isRinging: function (...args) {
      console.warn("telephony.call.isRinging interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    isImsSwitchEnabled: function (...args) {
      console.warn("telephony.call.isImsSwitchEnabled interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setMuted: function (...args) {
      console.warn("telephony.call.setMuted interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setAudioDevice: function (...args) {
      console.warn("telephony.call.setAudioDevice interface mocked in the Previewer. How this interface works on the Previewer may" +
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
  return call
}