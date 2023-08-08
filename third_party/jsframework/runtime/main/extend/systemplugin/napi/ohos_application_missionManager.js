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

import { paramMock } from "../utils"
import { MissionInfo as _MissionInfo } from "./application/MissionInfo"
import { MissionSnapshot as _MissionSnapshot } from "./application/MissionSnapshot"
import { MissionListener as _MissionListener } from "./application/MissionListener"

export function mockMissionManager() {
  const missionManager = {
    registerMissionListener: function (...args) {
      console.warn("missionManager.registerMissionListener interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    unregisterMissionListener: function (...args) {
      console.warn('missionManager.unregisterMissionListener interface mocked in the Previewer. How this interface works on the' +
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
    getMissionInfo: function (...args) {
      console.warn('missionManager.getMissionInfo interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, _MissionInfo);
      } else {
        return new Promise((resolve) => {
          resolve(_MissionInfo);
        });
      }
    },
    getMissionInfos: function (...args) {
      console.warn('missionManager.getMissionInfos interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [_MissionInfo]);
      } else {
        return new Promise((resolve) => {
          resolve([_MissionInfo]);
        });
      }
    },
    getMissionSnapShot: function (...args) {
      console.warn('missionManager.getMissionSnapShot interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, _MissionSnapshot);
      } else {
        return new Promise((resolve) => {
          resolve(_MissionSnapshot);
        });
      }
    },
    getLowResolutionMissionSnapShot: function (...args) {
      console.warn('missionManager.getLowResolutionMissionSnapShot interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, _MissionSnapshot);
      } else {
        return new Promise((resolve) => {
          resolve(_MissionSnapshot);
        });
      }
    },
    lockMission: function (...args) {
      console.warn('missionManager.lockMission interface mocked in the Previewer. How this interface works on the' +
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
    unlockMission: function (...args) {
      console.warn('missionManager.unlockMission interface mocked in the Previewer. How this interface works on the' +
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
    clearMission: function (...args) {
      console.warn('missionManager.clearMission interface mocked in the Previewer. How this interface works on the' +
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
    clearAllMissions: function (...args) {
      console.warn('missionManager.clearAllMissions interface mocked in the Previewer. How this interface works on the' +
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
    moveMissionToFront: function (...args) {
      console.warn('missionManager.moveMissionToFront interface mocked in the Previewer. How this interface works on the' +
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
    MissionInfo: _MissionInfo,
    MissionListener: _MissionListener,
    MissionSnapshot: _MissionSnapshot
  }
  return missionManager
}