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

export function mockBundleState() {
  const BundleStateInfo = {
    abilityInFgTotalTime: '[PC preview] unknown abilityInFgTotalTime',
    abilityPrevAccessTime: '[PC preview] unknown abilityPrevAccessTime',
    abilityPrevSeenTime: '[PC preview] unknown abilityPrevSeenTime',
    abilitySeenTotalTime: '[PC preview] unknown abilitySeenTotalTime',
    bundleName: "[PC preview] unknown bundle name",
    fgAbilityAccessTotalTime: '[PC preview] unknown fgAbilityAccessTotalTime',
    fgAbilityPrevAccessTime: '[PC preview] unknown fgAbilityPrevAccessTime',
    id: '[PC preview] unknown id',
    infosBeginTime: '[PC preview] unknown infosBeginTime',
    infosEndTime: '[PC preview] unknown infosEndTime',

    merge: function (...args) {
      console.warn("bundleState.merge interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
    },
  }
  const BundleStateInfoArray = [BundleStateInfo]
  const BundleActiveState = {
    appUsagePriorityGroup: '[PC preview] unknown appUsagePriorityGroup',
    bundleName: '[PC preview] unknown bundleName',
    indexOfLink: '[PC preview] unknown indexOfLink',
    nameOfClass: '[PC preview] unknown nameOfClass',
    stateOccurredTime: '[PC preview] unknown stateOccurredTime',
    stateType: '[PC preview] unknown stateType',
  }
  const BundleActiveStateArray = [BundleActiveState]
  const BundleActiveEventState = {
    name: '[PC preview] unknown name',
    eventId: '[PC preview] unknown eventId',
    count: '[PC preview] unknown count',
  }
  const BundleActiveEventStateArray = [BundleActiveEventState]
  const BundleActiveInfoResponse = {
    "key": BundleStateInfo
  }
  const BundleActiveGroupCallbackInfo = {
    appUsageOldGroup : '[PC preview] unknown appUsageOldGroup',
    appUsageNewGroup : '[PC preview] unknown appUsageNewGroup',
    userId : '[PC preview] unknown userId',
    changeReason : '[PC preview] unknown changeReason',
    bundleName : '[PC preview] unknown bundleName',
  }
  const BundleActiveFormInfo = {
    count : '[PC preview] unknown count',
    formLastUsedTime : '[PC preview] unknown formLastUsedTime',
    formId : '[PC preview] unknown formId',
    formDimension : '[PC preview] unknown formDimension',
    formName : '[PC preview] unknown formName',
  }
  const BundleActiveModuleInfo = {
    deviceId : '[PC preview] unknown deviceId',
    bundleName : '[PC preview] unknown bundleName',
    moduleName : '[PC preview] unknown moduleName',
    abilityName : '[PC preview] unknown abilityName',
    appLabelId : '[PC preview] unknown appLabelId',
    labelId : '[PC preview] unknown labelId',
    descriptionId : '[PC preview] unknown descriptionId',
    abilityLableId : '[PC preview] unknown abilityLableId',
    abilityDescriptionId : '[PC preview] unknown abilityDescriptionId',
    abilityIconId : '[PC preview] unknown abilityIconId',
    launchedCount : '[PC preview] unknown launchedCount',
    lastModuleUsedTime : '[PC preview] unknown lastModuleUsedTime',
    formRecords : [BundleActiveFormInfo],
  }
  const IntervalType = {
    BY_OPTIMIZED: 0,
    BY_DAILY: 1,
    BY_WEEKLY: 2,
    BY_MONTHLY: 3,
    BY_ANNUALLY: 4
  }
  const GroupType = {
    ACTIVE_GROUP_ALIVE : 10,
    ACTIVE_GROUP_DAILY : 20,
    ACTIVE_GROUP_FIXED : 30,
    ACTIVE_GROUP_RARE : 40,
    ACTIVE_GROUP_LIMIT : 50,
    ACTIVE_GROUP_NEVER : 60,
  }
  const bundleState = {
    isIdleState: function (...args) {
      console.warn("bundleState.isIdleState interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    queryAppUsagePriorityGroup: function (...args) {
      console.warn("bundleState.queryAppUsagePriorityGroup interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        });
      }
    },
    queryBundleStateInfos: function (...args) {
      console.warn("bundleState.queryBundleStateInfos interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleActiveInfoResponse);
      } else {
        return new Promise((resolve) => {
          resolve(BundleActiveInfoResponse)
        });
      }
    },
    queryBundleStateInfoByInterval: function (...args) {
      console.warn("bundleState.queryBundleStateInfoByInterval interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleStateInfoArray);
      } else {
        return new Promise((resolve) => {
          resolve(BundleStateInfoArray)
        });
      }
    },
    queryBundleActiveStates: function (...args) {
      console.warn("bundleState.queryBundleActiveStates interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleActiveStateArray);
      } else {
        return new Promise((resolve) => {
          resolve(BundleActiveStateArray)
        });
      }
    },
    queryCurrentBundleActiveStates: function (...args) {
      console.warn("bundleState.queryCurrentBundleActiveStates interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleActiveStateArray);
      } else {
        return new Promise((resolve) => {
          resolve(BundleActiveStateArray)
        });
      }
    },
    queryBundleActiveEventStates: function (...args) {
      console.warn("bundleState.queryBundleActiveEventStates interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleActiveEventStateArray);
      } else {
        return new Promise((resolve) => {
          resolve(BundleActiveEventStateArray)
        });
      }
    },
    queryAppNotificationNumber: function (...args) {
      console.warn("bundleState.queryAppNotificationNumber interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleActiveEventStateArray);
      } else {
        return new Promise((resolve) => {
          resolve(BundleActiveEventStateArray)
        });
      }
    },
    setBundleGroup: function (...args) {
      console.warn("bundleState.setBundleGroup interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    registerGroupCallBack: function (...args) {
      console.warn("bundleState.registerGroupCallBack interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    unRegisterGroupCallBack: function (...args) {
      console.warn("bundleState.unRegisterGroupCallBack interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    getRecentlyUsedModules: function (...args) {
      console.warn("bundleState.getRecentlyUsedModules interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleActiveModuleInfo);
      } else {
        return new Promise((resolve) => {
          resolve(BundleActiveModuleInfo)
        });
      }
    },
  }
  return bundleState
}