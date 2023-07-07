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
export const LockInfo = {
  lockType: LockType,
  password: "[PC Preview] unknow password",
  state: LockState,
}
export const LockType = {
  PIN_LOCK: 1,
  FDN_LOCK: 2,
};
export const LockState = {
  LOCK_OFF: 0,
  LOCK_ON: 1,
};
export const PersoLockType = {
  PN_PIN_LOCK: "[PC Preview] unknow PN_PIN_LOCK",
  PN_PUK_LOCK: "[PC Preview] unknow PN_PUK_LOCK",
  PU_PIN_LOCK: "[PC Preview] unknow PU_PIN_LOCK",
  PU_PUK_LOCK: "[PC Preview] unknow PU_PUK_LOCK",
  PP_PIN_LOCK: "[PC Preview] unknow PP_PIN_LOCK",
  PP_PUK_LOCK: "[PC Preview] unknow PP_PUK_LOCK",
  PC_PIN_LOCK: "[PC Preview] unknow PC_PIN_LOCK",
  PC_PUK_LOCK: "[PC Preview] unknow PC_PUK_LOCK",
  SIM_PIN_LOCK: "[PC Preview] unknow SIM_PIN_LOCK",
  SIM_PUK_LOCK: "[PC Preview] unknow SIM_PUK_LOCK",
};
export const PersoLockInfo = {
  lockType: PersoLockType,
  password: "[PC Preview] unknow password",
}
export const DiallingNumbersInfo = {
  alphaTag: "[PC Preview] unknow alphaTag",
  number: "[PC Preview] unknow number",
  recordNumber: "[PC Preview] unknow recordNumber",
  pin2: "[PC Preview] unknow pin2",
}
export const CardType = {
  UNKNOWN_CARD: -1,
  SINGLE_MODE_SIM_CARD: 10,
  SINGLE_MODE_USIM_CARD: 20,
  SINGLE_MODE_RUIM_CARD: 30,
  DUAL_MODE_CG_CARD: 40,
  CT_NATIONAL_ROAMING_CARD: 41,
  CU_DUAL_MODE_CARD: 42,
  DUAL_MODE_TELECOM_LTE_CARD: 43,
  DUAL_MODE_UG_CARD: 50,
  SINGLE_MODE_ISIM_CARD: 60
};
export const IccAccountInfo = {
  simId: "[PC Preview] unknow simId",
  slotIndex: "[PC Preview] unknow slotIndex",
  isEsim: "[PC Preview] unknow isEsim",
  isActive: "[PC Preview] unknow isActive",
  iccId: "[PC Preview] unknow iccId",
  showName: "[PC Preview] unknow showName",
  showNumber: "[PC Preview] unknow showNumber",
}
export const SimState = {
  SIM_STATE_UNKNOWN: "[PC Preview] unknow SIM_STATE_UNKNOWN",
  SIM_STATE_NOT_PRESENT: "[PC Preview] unknow SIM_STATE_NOT_PRESENT",
  SIM_STATE_LOCKED: "[PC Preview] unknow SIM_STATE_LOCKED",
  SIM_STATE_NOT_READY: "[PC Preview] unknow SIM_STATE_NOT_READY",
  SIM_STATE_READY: "[PC Preview] unknow SIM_STATE_READY",
  SIM_STATE_LOADED: "[PC Preview] unknow SIM_STATE_LOADED",
};
export const ContactType = {
  GENERAL_CONTACT: 1,
  FIXED_DIALING: 2,
};
export const OperatorConfig = {
  field: "[PC Preview] unknow field",
  value: "[PC Preview] unknow value"
}
export const LockStatusResponse = {
  result: "[PC Preview] unknow result",
  remain: "[PC Preview] unknow remain",
}
export function mockSim() {
  const sim = {
    ContactType,
    SimState,
    CardType,
    PersoLockType,
    LockState,
    LockType,
    isSimActive: function (...args) {
      console.warn("telephony.sim.isSimActive interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getDefaultVoiceSlotId: function (...args) {
      console.warn("telephony.sim.getDefaultVoiceSlotId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    hasOperatorPrivileges: function (...args) {
      console.warn("telephony.sim.hasOperatorPrivileges interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getISOCountryCodeForSim: function (...args) {
      console.warn("telephony.sim.getISOCountryCodeForSim interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimOperatorNumeric: function (...args) {
      console.warn("telephony.sim.getSimOperatorNumeric interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimSpn: function (...args) {
      console.warn("telephony.sim.getSimSpn interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimState: function (...args) {
      console.warn("telephony.sim.getSimState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SimState);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SimState);
        })
      }
    },
    getLockState: function (...args) {
      console.warn("telephony.sim.getLockState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockState);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockState);
        })
      }
    },
    getCardType: function (...args) {
      console.warn("telephony.sim.getCardType interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CardType);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CardType);
        })
      }
    },
    getSimIccId: function (...args) {
      console.warn("telephony.sim.getSimIccId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getVoiceMailIdentifier: function (...args) {
      console.warn("telephony.sim.getVoiceMailIdentifier interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getVoiceMailNumber: function (...args) {
      console.warn("telephony.sim.getVoiceMailNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getVoiceMailCount: function (...args) {
      console.warn("telephony.sim.getVoiceMailCount interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimTelephoneNumber: function (...args) {
      console.warn("telephony.sim.getSimTelephoneNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimGid1: function (...args) {
      console.warn("telephony.sim.getSimGid1 interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimTeleNumberIdentifier: function (...args) {
      console.warn("telephony.sim.getSimTeleNumberIdentifier interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getLine1NumberFromImpu: function (...args) {
      console.warn("telephony.sim.getLine1NumberFromImpu interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getMaxSimCount: function () {
      console.warn("telephony.sim.getMaxSimCount interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getIMSI: function (...args) {
      console.warn("telephony.sim.getIMSI interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    hasSimCard: function (...args) {
      console.warn("telephony.sim.hasSimCard interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSimAccountInfo: function (...args) {
      console.warn("telephony.sim.getSimAccountInfo interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, IccAccountInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(IccAccountInfo);
        })
      }
    },
    getActiveSimAccountInfoList: function (...args) {
      console.warn("telephony.sim.getActiveSimAccountInfoList interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [IccAccountInfo]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([IccAccountInfo]);
        })
      }
    },
    setDefaultVoiceSlotId: function (...args) {
      console.warn("telephony.sim.setDefaultVoiceSlotId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    activateSim: function (...args) {
      console.warn("telephony.sim.activateSim interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setVoiceMailInfo: function (...args) {
      console.warn("telephony.sim.setVoiceMailInfo interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    deactivateSim: function (...args) {
      console.warn("telephony.sim.deactivateSim interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    sendEnvelopeCmd: function (...args) {
      console.warn("telephony.sim.sendEnvelopeCmd interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setShowName: function (...args) {
      console.warn("telephony.sim.setShowName interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    sendTerminalResponseCmd: function (...args) {
      console.warn("telephony.sim.sendTerminalResponseCmd interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getShowName: function (...args) {
      console.warn("telephony.sim.getShowName interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setShowNumber: function (...args) {
      console.warn("telephony.sim.setShowNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getShowNumber: function (...args) {
      console.warn("telephony.sim.getShowNumber interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getOperatorConfigs: function (...args) {
      console.warn("telephony.sim.getOperatorConfigs interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [OperatorConfigMock]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([OperatorConfigMock]);
        })
      }
    },
    unlockPin: function (...args) {
      console.warn("telephony.sim.unlockPin interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    unlockSimLock: function (...args) {
      console.warn("telephony.sim.unlockSimLock interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    unlockPuk: function (...args) {
      console.warn("telephony.sim.unlockPuk interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    alterPin: function (...args) {
      console.warn("telephony.sim.alterPin interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    setLockState: function (...args) {
      console.warn("telephony.sim.setLockState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    unlockPin2: function (...args) {
      console.warn("telephony.sim.unlockPin2 interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    unlockPuk2: function (...args) {
      console.warn("telephony.sim.unlockPuk2 interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    alterPin2: function (...args) {
      console.warn("telephony.sim.alterPin2 interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LockStatusResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(LockStatusResponse);
        })
      }
    },
    queryIccDiallingNumbers: function (...args) {
      console.warn("telephony.sim.queryIccDiallingNumbers interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [DiallingNumbersInfo]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([DiallingNumbersInfo]);
        })
      }
    },
    addIccDiallingNumbers: function (...args) {
      console.warn("telephony.sim.addIccDiallingNumbers interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    delIccDiallingNumbers: function (...args) {
      console.warn("telephony.sim.delIccDiallingNumbers interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    updateIccDiallingNumbers: function (...args) {
      console.warn("telephony.sim.updateIccDiallingNumbers interface mocked in the Previewer. How this interface works on the Previewer may" +
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
  return sim
}