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
import { paramMock } from "../../../utils"
export const Result = {
    code: "[PC Preview] unknow code",
    data: "[PC Preview] unknow data",
}
export const SubscribeMessageResponse = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    message: "[PC Preview] unknow message",
}
export const CallAbilityParam = {
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    messageCode: "[PC Preview] unknow messageCode",
    abilityType: "[PC Preview] unknow abilityType",
    data: "[PC Preview] unknow data",
    syncOption: "[PC Preview] unknow syncOption",
}
export const SubscribeAbilityEventParam = {
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    messageCode: "[PC Preview] unknow messageCode",
    abilityType: "[PC Preview] unknow abilityType",
    syncOption: "[PC Preview] unknow syncOption",
}
export const SendMessageOptions = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    message: "[PC Preview] unknow message",
    success: function () {
        console.warn("SendMessageOptions.success interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
    },
    fail: function (...args) {
        console.warn("SendMessageOptions.fail interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
    },
    complete: function () {
        console.warn("SendMessageOptions.complete interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
    }
}
export const SubscribeMessageOptions = {
    success: function (...args) {
        console.warn("SubscribeMessageOptions.success interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
    },
    fail: function (...args) {
        console.warn("SubscribeMessageOptions.fail interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
    },
}
export const RequestParams = {
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    entities: [paramMock.paramStringMock],
    action: "[PC Preview] unknow action",
    deviceType: "[PC Preview] unknow deviceType",
    data: "[PC Preview] unknow data",
    flag: "[PC Preview] unknow flag",
    url: "[PC Preview] unknow url",
}
export const FinishWithResultParams = {
    code: "[PC Preview] unknow code",
    result: "[PC Preview] unknow result",
}
export const FeatureAbilityClass = class FeatureAbility {
    constructor() {
      console.warn('FeatureAbility.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.startAbility = function (...args) {
        console.warn("FeatureAbility.startAbility interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(Result);
        })
      };
      this.startAbilityForResult = function (...args) {
        console.warn("FeatureAbility.startAbilityForResult interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(Result);
        })
      };
      this.finishWithResult = function (...args) {
        console.warn("FeatureAbility.finishWithResult interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(Result);
        })
      };
      this.getDeviceList = function (...args) {
        console.warn("FeatureAbility.getDeviceList interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(Result);
        })
      };
      this.callAbility = function (...args) {
        console.warn("FeatureAbility.callAbility interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(paramMock.paramStringMock);
        })
      };
      this.continueAbility = function () {
        console.warn("FeatureAbility.continueAbility interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(Result);
        })
      };
      this.subscribeAbilityEvent = function (...args) {
        console.warn("FeatureAbility.subscribeAbilityEvent interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(paramMock.paramStringMock);
        })
      };
      this.unsubscribeAbilityEvent = function (...args) {
        console.warn("FeatureAbility.unsubscribeAbilityEvent interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve, reject) => {
            resolve(paramMock.paramStringMock);
        })
      };
      this.sendMsg = function (...args) {
        console.warn("FeatureAbility.sendMsg interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.subscribeMsg = function (...args) {
        console.warn("FeatureAbility.subscribeMsg interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.unsubscribeMsg = function () {
        console.warn("FeatureAbility.unsubscribeMsg interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
    }
}