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
export const PreferredNetworkMode = {
  PREFERRED_NETWORK_MODE_GSM: 1,
  PREFERRED_NETWORK_MODE_WCDMA: 2,
  PREFERRED_NETWORK_MODE_LTE: 3,
  PREFERRED_NETWORK_MODE_LTE_WCDMA: 4,
  PREFERRED_NETWORK_MODE_LTE_WCDMA_GSM: 5,
  PREFERRED_NETWORK_MODE_WCDMA_GSM: 6,
  PREFERRED_NETWORK_MODE_CDMA: 7,
  PREFERRED_NETWORK_MODE_EVDO: 8,
  PREFERRED_NETWORK_MODE_EVDO_CDMA: 9,
  PREFERRED_NETWORK_MODE_WCDMA_GSM_EVDO_CDMA: 10,
  PREFERRED_NETWORK_MODE_LTE_EVDO_CDMA: 11,
  PREFERRED_NETWORK_MODE_LTE_WCDMA_GSM_EVDO_CDMA: 12,
  PREFERRED_NETWORK_MODE_TDSCDMA: 13,
  PREFERRED_NETWORK_MODE_TDSCDMA_GSM: 14,
  PREFERRED_NETWORK_MODE_TDSCDMA_WCDMA: 15,
  PREFERRED_NETWORK_MODE_TDSCDMA_WCDMA_GSM: 16,
  PREFERRED_NETWORK_MODE_LTE_TDSCDMA: 17,
  PREFERRED_NETWORK_MODE_LTE_TDSCDMA_GSM: 18,
  PREFERRED_NETWORK_MODE_LTE_TDSCDMA_WCDMA: 19,
  PREFERRED_NETWORK_MODE_LTE_TDSCDMA_WCDMA_GSM: 20,
  PREFERRED_NETWORK_MODE_TDSCDMA_WCDMA_GSM_EVDO_CDMA: 21,
  PREFERRED_NETWORK_MODE_LTE_TDSCDMA_WCDMA_GSM_EVDO_CDMA: 22,
  PREFERRED_NETWORK_MODE_NR: 31,
  PREFERRED_NETWORK_MODE_NR_LTE: 32,
  PREFERRED_NETWORK_MODE_NR_LTE_WCDMA: 33,
  PREFERRED_NETWORK_MODE_NR_LTE_WCDMA_GSM: 34,
  PREFERRED_NETWORK_MODE_NR_LTE_EVDO_CDMA: 35,
  PREFERRED_NETWORK_MODE_NR_LTE_WCDMA_GSM_EVDO_CDMA: 36,
  PREFERRED_NETWORK_MODE_NR_LTE_TDSCDMA: 37,
  PREFERRED_NETWORK_MODE_NR_LTE_TDSCDMA_GSM: 38,
  PREFERRED_NETWORK_MODE_NR_LTE_TDSCDMA_WCDMA: 39,
  PREFERRED_NETWORK_MODE_NR_LTE_TDSCDMA_WCDMA_GSM: 40,
  PREFERRED_NETWORK_MODE_NR_LTE_TDSCDMA_WCDMA_GSM_EVDO_CDMA: 41,
  PREFERRED_NETWORK_MODE_MAX_VALUE: 99,
};
export const RadioTechnology = {
  RADIO_TECHNOLOGY_UNKNOWN: 0,
  RADIO_TECHNOLOGY_GSM: 1,
  RADIO_TECHNOLOGY_1XRTT: 2,
  RADIO_TECHNOLOGY_WCDMA: 3,
  RADIO_TECHNOLOGY_HSPA: 4,
  RADIO_TECHNOLOGY_HSPAP: 5,
  RADIO_TECHNOLOGY_TD_SCDMA: 6,
  RADIO_TECHNOLOGY_EVDO: 7,
  RADIO_TECHNOLOGY_EHRPD: 8,
  RADIO_TECHNOLOGY_LTE: 9,
  RADIO_TECHNOLOGY_LTE_CA: 10,
  RADIO_TECHNOLOGY_IWLAN: 11,
  RADIO_TECHNOLOGY_NR: 12
}
export const NetworkType = {
  NETWORK_TYPE_UNKNOWN: "[PC Preview] unknow NETWORK_TYPE_UNKNOWN",
  NETWORK_TYPE_GSM: "[PC Preview] unknow NETWORK_TYPE_GSM",
  NETWORK_TYPE_CDMA: "[PC Preview] unknow NETWORK_TYPE_CDMA",
  NETWORK_TYPE_WCDMA: "[PC Preview] unknow NETWORK_TYPE_WCDMA",
  NETWORK_TYPE_TDSCDMA: "[PC Preview] unknow NETWORK_TYPE_TDSCDMA",
  NETWORK_TYPE_LTE: "[PC Preview] unknow NETWORK_TYPE_LTE",
  NETWORK_TYPE_NR: "[PC Preview] unknow NETWORK_TYPE_NR",
};
export const WcdmaCellInformation = {
  lac: "[PC Preview] unknow lac",
  cellId: "[PC Preview] unknow cellId",
  psc: "[PC Preview] unknow psc",
  uarfcn: "[PC Preview] unknow uarfcn",
  mcc: "[PC Preview] unknow mcc",
  mnc: "[PC Preview] unknow mnc",
}
export const NetworkSelectionModeOptions = {
  slotId: "[PC Preview] unknow slotId",
  selectMode: NetworkSelectionMode,
  networkInformation: NetworkInformation,
  resumeSelection: "[PC Preview] unknow resumeSelection",
}
export const NsaState = {
  NSA_STATE_NOT_SUPPORT: 1,
  NSA_STATE_NO_DETECT: 2,
  NSA_STATE_CONNECTED_DETECT: 3,
  NSA_STATE_IDLE_DETECT: 4,
  NSA_STATE_DUAL_CONNECTED: 5,
  NSA_STATE_SA_ATTACHED: 6
}
export const NetworkInformation = {
  operatorName: "[PC Preview] unknow operatorName",
  operatorNumeric: "[PC Preview] unknow operatorNumeric",
  state: NetworkInformationState,
  radioTech: "[PC Preview] unknow radioTech",
}
export const NetworkInformationState = {
  NETWORK_UNKNOWN: "[PC Preview] unknow NETWORK_UNKNOWN",
  NETWORK_AVAILABLE: "[PC Preview] unknow NETWORK_AVAILABLE",
  NETWORK_CURRENT: "[PC Preview] unknow NETWORK_CURRENT",
  NETWORK_FORBIDDEN: "[PC Preview] unknow NETWORK_FORBIDDEN",
}
export const TdscdmaCellInformation = {
  lac: "[PC Preview] unknow lac",
  cellId: "[PC Preview] unknow cellId",
  cpid: "[PC Preview] unknow cpid",
  uarfcn: "[PC Preview] unknow uarfcn",
  mcc: "[PC Preview] unknow mcc",
  mnc: "[PC Preview] unknow mnc",
}
export const NetworkState = {
  longOperatorName: "[PC Preview] unknow longOperatorName",
  shortOperatorName: "[PC Preview] unknow shortOperatorName",
  plmnNumeric: "[PC Preview] unknow plmnNumeric",
  isRoaming: "[PC Preview] unknow isRoaming",
  regState: RegState,
  cfgTech: RadioTechnology,
  nsaState: NsaState,
  isCaActive: "[PC Preview] unknow isCaActive",
  isEmergency: "[PC Preview] unknow isEmergency",
}
export const NrCellInformation = {
  nrArfcn: "[PC Preview] unknow nrArfcn",
  pci: "[PC Preview] unknow pci",
  tac: "[PC Preview] unknow tac",
  nci: "[PC Preview] unknow nci",
  mcc: "[PC Preview] unknow mcc",
  mnc: "[PC Preview] unknow mnc",
}
export const NetworkSelectionMode = {
  NETWORK_SELECTION_UNKNOWN: "[PC Preview] unknow NETWORK_SELECTION_UNKNOWN",
  NETWORK_SELECTION_AUTOMATIC: "[PC Preview] unknow NETWORK_SELECTION_AUTOMATIC",
  NETWORK_SELECTION_MANUAL: "[PC Preview] unknow NETWORK_SELECTION_MANUAL",
};
export const GsmCellInformation = {
  lac: "[PC Preview] unknow lac",
  cellId: "[PC Preview] unknow cellId",
  arfcn: "[PC Preview] unknow arfcn",
  bsic: "[PC Preview] unknow bsic",
  mcc: "[PC Preview] unknow mcc",
  mnc: "[PC Preview] unknow mnc",
}
export const LteCellInformation = {
  cgi: "[PC Preview] unknow cgi",
  pci: "[PC Preview] unknow pci",
  tac: "[PC Preview] unknow tac",
  earfcn: "[PC Preview] unknow earfcn",
  bandwidth: "[PC Preview] unknow bandwidth",
  mcc: "[PC Preview] unknow mcc",
  mnc: "[PC Preview] unknow mnc",
  isSupportEndc: "[PC Preview] unknow isSupportEndc",
}
export const RegState = {
  REG_STATE_NO_SERVICE: 0,
  REG_STATE_IN_SERVICE: 1,
  REG_STATE_EMERGENCY_CALL_ONLY: 2,
  REG_STATE_POWER_OFF: 3,
};
export const CdmaCellInformation = {
  baseId: "[PC Preview] unknow baseId",
  latitude: "[PC Preview] unknow latitude",
  longitude: "[PC Preview] unknow longitude",
  nid: "[PC Preview] unknow nid",
  sid: "[PC Preview] unknow sid"
}
export const NrOptionMode = {
  NR_OPTION_UNKNOWN: "[PC Preview] unknow NR_OPTION_UNKNOWN",
  NR_OPTION_NSA_ONLY: "[PC Preview] unknow NR_OPTION_NSA_ONLY",
  NR_OPTION_SA_ONLY: "[PC Preview] unknow NR_OPTION_SA_ONLY",
  NR_OPTION_NSA_AND_SA: "[PC Preview] unknow NR_OPTION_NSA_AND_SA",
};
export const CellInformation = {
  networkType: NetworkType,
  isCamped: "[PC Preview] unknow isCamped",
  timeStamp: "[PC Preview] unknow timeStamp",
  signalInformation: SignalInformation,
  data: CdmaCellInformation,
};
export const SignalInformation = {
  signalType: NetworkType,
  signalLevel: "[PC Preview] unknow signalLevel",
};
export const NetworkSearchResult = {
  isNetworkSearchSuccess: "[PC Preview] unknow isNetworkSearchSuccess",
  networkSearchResult: [NetworkInformation],
}
export function mockRadio() {
  const radio = {
    RegState,
    NrOptionMode,
    PreferredNetworkMode,
    RadioTechnology,
    NetworkType,
    NetworkInformationState,
    NsaState,
    NetworkSelectionMode,
    getRadioTech: function (...args) {
      console.warn("telephony.radio.getRadioTech interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, {
          psRadioTech: "[PC Preview] unknow psRadioTech",
          csRadioTech: "[PC Preview] unknow csRadioTech"
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve({
            psRadioTech: "[PC Preview] unknow psRadioTech",
            csRadioTech: "[PC Preview] unknow csRadioTech"
          });
        })
      }
    },
    getNetworkState: function (...args) {
      console.warn("telephony.radio.getNetworkState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, NetworkState);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetworkState);
        })
      }
    },
    sendUpdateCellLocationRequest: function (...args) {
      console.warn("telephony.radio.sendUpdateCellLocationRequest interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setPrimarySlotId: function (...args) {
      console.warn("telephony.radio.setPrimarySlotId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getCellInformation: function (...args) {
      console.warn("telephony.radio.getCellInformation interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [CellInformation]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([CellInformation]);
        })
      }
    },
    getNetworkSelectionMode: function (...args) {
      console.warn("telephony.radio.getNetworkSelectionMode interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetworkSelectionMode);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetworkSelectionMode);
        })
      }
    },
    setNetworkSelectionMode: function (...args) {
      console.warn("telephony.radio.setNetworkSelectionMode interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getNetworkSearchInformation: function (...args) {
      console.warn("telephony.radio.getNetworkSearchInformation interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetworkSearchResult);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetworkSearchResult);
        })
      }
    },
    getISOCountryCodeForNetwork: function (...args) {
      console.warn("telephony.radio.getISOCountryCodeForNetwork interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getNrOptionMode: function (...args) {
      console.warn("telephony.radio.getNrOptionMode interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NrOptionMode);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NrOptionMode);
        })
      }
    },
    getIMEI: function (...args) {
      console.warn("telephony.radio.getIMEI interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getMEID: function (...args) {
      console.warn("telephony.radio.getMEID interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getUniqueDeviceId: function (...args) {
      console.warn("telephony.radio.getUniqueDeviceId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getPrimarySlotId: function (...args) {
      console.warn("telephony.radio.getPrimarySlotId interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getSignalInformation: function (...args) {
      console.warn("telephony.radio.getSignalInformation interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [SignalInformation]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([SignalInformation]);
        })
      }
    },
    isNrSupported: function () {
      console.warn("telephony.radio.isNrSupported interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isRadioOn: function (...args) {
      console.warn("telephony.radio.isRadioOn interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    turnOnRadio: function (...args) {
      console.warn("telephony.radio.turnOnRadio interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    turnOffRadio: function (...args) {
      console.warn("telephony.radio.turnOffRadio interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getOperatorName: function (...args) {
      console.warn("telephony.radio.getOperatorName interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    setPreferredNetwork: function (...args) {
      console.warn("telephony.radio.setPreferredNetwork interface mocked in the Previewer. How this interface works on the Previewer may" +
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
    getPreferredNetwork: function (...args) {
      console.warn("telephony.radio.getPreferredNetwork interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PreferredNetworkMode);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PreferredNetworkMode);
        })
      }
    },
    getIMEISV: function (...args) {
      console.warn("telephony.radio.getIMEISV interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    }
  }
  return radio
}