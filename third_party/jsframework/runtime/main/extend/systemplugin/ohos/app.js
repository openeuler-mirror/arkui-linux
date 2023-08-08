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
import { PixelMapMock } from "../multimedia"

export function mockAppAbilityManager() {
  global.ohosplugin.app = {}
  const ActiveProcessInfoMock = {
    pid: "[PC Preview] unknow pid",
    uid: "[PC Preview] unknow uid",
    processName: "[PC Preview] unknow processName",
    bundleNames: ["[PC Preview] unknow bundleNames", "[PC Preview] unknow bundleNames"]
  }
  const ElementNameMock = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    uri: "[PC Preview] unknow uri",
    shortName: "[PC Preview] unknow shortName",
  }
  const AbilityMissionInfoMock = {
    missionId: "[PC Preview] unknow missionId",
    bottomAbility: {
      abilityName: ElementNameMock.abilityName,
      bundleName: ElementNameMock.bundleName,
      deviceId: ElementNameMock.deviceId
    },
    topAbility: {
      abilityName: ElementNameMock.abilityName,
      bundleName: ElementNameMock.bundleName,
      deviceId: ElementNameMock.deviceId
    },
    windowMode: "[PC Preview] unknow windowMode"
  }

  const ActiveServiceAbilityInfoMock = {
    pid: "[PC Preview] unknow pid",
    uid: "[PC Preview] unknow uid",
    processName: "[PC Preview] unknow processName",
    serviceAbility: {
      abilityName: ElementNameMock.abilityName,
      bundleName: ElementNameMock.bundleName,
      deviceId: ElementNameMock.deviceId
    }
  }

  const ProcessErrorInfoMock = {
    errStatus: "[PC Preview] unknow errStatus",
    processName: "[PC Preview] unknow processName",
    pid: "[PC Preview] unknow pid",
    uid: "[PC Preview] unknow uid",
    abilityName: "[PC Preview] unknow abilityName",
    errMsg: "[PC Preview] unknow errMsg",
    backTrace: "[PC Preview] unknow backTrace"
  }
  const SystemMemoryAttrMock = {
    availSysMem: "[PC Preview] unknow availSysMem",
    totalSysMem: "[PC Preview] unknow totalSysMem",
    threshold: "[PC Preview] unknow threshold",
    isSysInlowMem: "[PC Preview] unknow isSysInlowMem"
  }
  const MissionSnapshotMock = {
    topAbility: {
      abilityName: ElementNameMock.abilityName,
      bundleName: ElementNameMock.bundleName,
      deviceId: ElementNameMock.deviceId
    },
    snapshot: PixelMapMock
  }
  const MemoryMapInfoMock = {
    vmPss: "[PC Preview] unknow vmPss",
    vmPrivateDirty: "[PC Preview] unknow vmPrivateDirty",
    vmSharedDirty: "[PC Preview] unknow vmSharedDirty",
    nativePss: "[PC Preview] unknow nativePss",
    nativePrivateDirty: "[PC Preview] unknow nativePrivateDirty",
    nativeSharedDirty: "[PC Preview] unknow nativeSharedDirty",
    otherPss: "[PC Preview] unknow otherPss",
    otherPrivateDirty: "[PC Preview] unknow otherPrivateDirty",
    otherSharedDirty: "[PC Preview] unknow otherSharedDirty"
  }

  global.ohosplugin.app.abilityManager = {
    getCurrentUserId: function (...args) {
      console.warn("app.abilityManager.getCurrentUserId interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    getActiveProcessInfos: function (...args) {
      console.warn("app.abilityManager.getActiveProcessInfos interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [ActiveProcessInfoMock])
      } else {
        return new Promise((resolve) => {
          resolve([ActiveProcessInfoMock])
        })
      }
    },
    getActiveAbilityMissionInfos: function (...args) {
      console.warn("app.abilityManager.getActiveAbilityMissionInfos interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [AbilityMissionInfoMock])
      } else {
        return new Promise((resolve) => {
          resolve([AbilityMissionInfoMock])
        })
      }
    },
    getPreviousAbilityMissionInfos: function (...args) {
      console.warn("app.abilityManager.getPreviousAbilityMissionInfos interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [AbilityMissionInfoMock])
      } else {
        return new Promise((resolve) => {
          resolve([AbilityMissionInfoMock])
        })
      }
    },
    deleteMissions: function (...args) {
      console.warn("app.abilityManager.deleteMissions interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    isUserATestUser: function (...args) {
      console.warn("app.abilityManager.isUserATestUser interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    getActiveServiceAbilityInfos: function (...args) {
      console.warn("app.abilityManager.getActiveServiceAbilityInfos interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [ActiveServiceAbilityInfoMock])
      } else {
        return new Promise((resolve) => {
          resolve([ActiveServiceAbilityInfoMock])
        })
      }
    },
    getHomeScreenIconDenseness: function (...args) {
      console.warn("app.abilityManager.getHomeScreenIconDenseness interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    getHomeScreenIconSize: function (...args) {
      console.warn("app.abilityManager.getHomeScreenIconSize interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    isMultiWindowAllowed: function (...args) {
      console.warn("app.abilityManager.isMultiWindowAllowed interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    moveMissionToFirstSplitScreen: function (...args) {
      console.warn("app.abilityManager.moveMissionToFirstSplitScreen interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    isRamConstrainedDevice: function (...args) {
      console.warn("app.abilityManager.isRamConstrainedDevice interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    getAppMemorySize: function (...args) {
      console.warn("app.abilityManager.getAppMemorySize interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    getProcessMemoryMapInfos: function (...args) {
      console.warn("app.abilityManager.getProcessMemoryMapInfos interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [MemoryMapInfoMock])
      } else {
        return new Promise((resolve) => {
          resolve([MemoryMapInfoMock])
        })
      }
    },

    getSystemMemoryAttr: function (...args) {
      console.warn("app.abilityManager.getSystemMemoryAttr interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SystemMemoryAttrMock)
      } else {
        return new Promise((resolve) => {
          resolve(SystemMemoryAttrMock)
        })
      }
    },
    getProcessErrorInfos: function (...args) {
      console.warn("app.abilityManager.getProcessErrorInfos interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [ProcessErrorInfoMock])
      } else {
        return new Promise((resolve) => {
          resolve([ProcessErrorInfoMock])
        })
      }
    },
    getAbilityMissionSnapshot: function (...args) {
      console.warn("app.abilityManager.getAbilityMissionSnapshot interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, MissionSnapshotMock)
      } else {
        return new Promise((resolve) => {
          resolve(MissionSnapshotMock)
        })
      }
    }
  }
}
