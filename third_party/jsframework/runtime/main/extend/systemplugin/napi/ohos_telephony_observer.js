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
import { CardType, SimState } from "./ohos_telephony_sim"
export const LockReason = {
  SIM_NONE: "[PC Preview] unknow SIM_NONE",
  SIM_PIN: "[PC Preview] unknow SIM_PIN",
  SIM_PUK: "[PC Preview] unknow SIM_PUK",
  SIM_PN_PIN: "[PC Preview] unknow SIM_PN_PIN",
  SIM_PN_PUK: "[PC Preview] unknow SIM_PN_PUK",
  SIM_PU_PIN: "[PC Preview] unknow SIM_PU_PIN",
  SIM_PU_PUK: "[PC Preview] unknow SIM_PU_PUK",
  SIM_PP_PIN: "[PC Preview] unknow SIM_PP_PIN",
  SIM_PP_PUK: "[PC Preview] unknow SIM_PP_PUK",
  SIM_PC_PIN: "[PC Preview] unknow SIM_PC_PIN",
  SIM_PC_PUK: "[PC Preview] unknow SIM_PC_PUK",
  SIM_SIM_PIN: "[PC Preview] unknow SIM_SIM_PIN",
  SIM_SIM_PUK: "[PC Preview] unknow SIM_SIM_PUK",
};
export const SimStateData = {
  type: CardType,
  state: SimState,
  reason: LockReason,
}
export function mockObserver() {
  const observer = {
    LockReason,
    on: function (...args) {
      console.warn("telephony.observer.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'networkStateChange') {
          args[len - 1].call(this, NetworkState);
        } else if (args[0] === 'signalInfoChange') {
          args[len - 1].call(this, [SignalInformation]);
        } else if (args[0] === 'cellInfoChange') {
          args[len - 1].call(this, [CellInformation]);
        } else if (args[0] === 'cellularDataConnectionStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            state: "[PC Preview] unknow state",
            network: "[PC Preview] unknow network"
          });
        } else if (args[0] === 'cellularDataFlowChange') {
          args[len - 1].call(this, DataFlowType);
        } else if (args[0] === 'callStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            state: "[PC Preview] unknow state",
            number: "[PC Preview] unknow number"
          });
        } else if (args[0] === 'cfuIndicatorChange' || 'voiceMailMsgIndicatorChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] === 'simStateChange') {
          args[len - 1].call(this, SimStateData);
        }
      }
    },
    off: function (...args) {
      console.warn("telephony.observer.off interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'networkStateChange') {
          args[len - 1].call(this, NetworkState);
        } else if (args[0] === 'signalInfoChange') {
          args[len - 1].call(this, [SignalInformation]);
        } else if (args[0] === 'cellInfoChange') {
          args[len - 1].call(this, [CellInformation]);
        } else if (args[0] === 'cellularDataConnectionStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            state: "[PC Preview] unknow state",
            network: "[PC Preview] unknow network"
          });
        } else if (args[0] === 'cellularDataFlowChange') {
          args[len - 1].call(this, DataFlowType);
        } else if (args[0] === 'callStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            state: "[PC Preview] unknow state",
            number: "[PC Preview] unknow number"
          });
        } else if (args[0] === 'cfuIndicatorChange' || 'voiceMailMsgIndicatorChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] === 'simStateChange') {
          args[len - 1].call(this, SimStateData);
        }
      }
    },
    once: function (...args) {
      console.warn("telephony.observer.once interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'networkStateChange') {
          args[len - 1].call(this, NetworkState);
        } else if (args[0] === 'signalInfoChange') {
          args[len - 1].call(this, [SignalInformation]);
        } else if (args[0] === 'cellInfoChange') {
          args[len - 1].call(this, [CellInformation]);
        } else if (args[0] === 'cellularDataConnectionStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            state: "[PC Preview] unknow state",
            network: "[PC Preview] unknow network"
          });
        } else if (args[0] === 'cellularDataFlowChange') {
          args[len - 1].call(this, DataFlowType);
        } else if (args[0] === 'callStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            state: "[PC Preview] unknow state",
            number: "[PC Preview] unknow number"
          });
        } else if (args[0] === 'cfuIndicatorChange' || 'voiceMailMsgIndicatorChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] === 'simStateChange') {
          args[len - 1].call(this, SimStateData);
        }
      }
    }
  }
  return observer
}