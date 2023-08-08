/*
 * @Author: your name
 * @Date: 2022-01-20 21:27:31
 * @LastEditTime: 2022-01-20 21:27:33
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \third_party_jsframework\runtime\main\extend\systemplugin\featureAbility.js
 */
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

export function mockFeatureAbility() {
  let FeatureAbilityObject = {
    getFeatureAbility: function () {
      const ResultMock = {
        code: '[PC preview] unknow code',
        data: '[PC preview] unknow data'
      }
      const FeatureAbility = {
        startAbility: function (...args) {
          console.warn("Unable to use the FeatureAbility.startAbility method to start another ability in the" +
            " Previewer. Perform this operation on the emulator or a real device instead.")
          return new Promise((resolve, reject) => {
            resolve(ResultMock);
          })
        },
        startAbilityForResult: function (...args) {
          console.warn("Unable to use the FeatureAbility.startAbilityForResult method to start another ability in" +
            " the Previewer. Perform this operation on the emulator or a real device instead.")
          return new Promise((resolve, reject) => {
            resolve(ResultMock);
          })
        },
        finishWithResult: function (...args) {
          console.warn("FeatureAbility.finishWithResult interface mocked in the Previewer. How this interface works" +
            " on the Previewer may be different from that on a real device.")
          return new Promise((resolve, reject) => {
            resolve(ResultMock);
          })
        },
        callAbility: function (...args) {
          console.warn("FeatureAbility.callAbility interface mocked in the Previewer. How this interface works on" +
            " the Previewer may be different from that on a real device.")
          return new Promise((resolve, reject) => {
            resolve(JSON.stringify(ResultMock));
          })
        },
        continueAbility: function (...args) {
          console.warn("FeatureAbility.continueAbility interface mocked in the Previewer. How this interface works on" +
            " the Previewer may be different from that on a real device.")
          return new Promise((resolve, reject) => {
            resolve(ResultMock);
          })
        },
        subscribeAbilityEvent: function (...args) {
          console.warn("FeatureAbility.subscribeAbilityEvent interface mocked in the Previewer. How this interface" +
            " works on the Previewer may be different from that on a real device.")
          return new Promise((resolve, reject) => {
            resolve(JSON.stringify(ResultMock));
          })
        },
        unsubscribeAbilityEvent: function (...args) {
          console.warn("FeatureAbility.unsubscribeAbilityEvent interface mocked in the Previewer. How this interface" +
            " works on the Previewer may be different from that on a real device.")
          return new Promise((resolve, reject) => {
            resolve(JSON.stringify(ResultMock));
          })
        }
      }
      return FeatureAbility
    }
  }
  global.createLocalParticleAbility = function (...args) {
    console.warn("createLocalParticleAbility interface mocked in the Previewer. How this interface" +
      " works on the Previewer may be different from that on a real device.")
    return new Promise((resolve, reject) => {
      resolve(paramMock.paramObjectMock);
    })
  }
  global.FeatureAbility = FeatureAbilityObject.getFeatureAbility();
}