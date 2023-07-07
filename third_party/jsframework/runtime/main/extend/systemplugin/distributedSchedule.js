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

import { paramMock } from "./utils"

export function mockDistributedSchedule() {
  const ModuleInfoMock = {
    moduleName: "[PC Preview] unknow moduleName",
    moduleSourceDir: "[PC Preview] unknow moduleSourceDir"
  }
  const CustomizeDataMock = {
    name: "[PC Preview] unknow name",
    value: "[PC Preview] unknow values"
  }
  const ApplicationInfoMock = {
    name: "[PC Preview] unknow name",
    description: "[PC Preview] unknow description",
    descriptionId: "[PC Preview] unknow descriptionId",
    systemApp: "[PC Preview] unknow systemApp",
    enabled: "[PC Preview] unknow enabled",
    label: "[PC Preview] unknow label",
    labelId: "[PC Preview] unknow labelId",
    icon: "[PC Preview] unknow icon",
    iconId: "[PC Preview] unknow iconId",
    process: "[PC Preview] unknow process",
    supportedModes: "[PC Preview] unknow supportedModes",
    moduleSourceDirs: ["[PC Preview] unknow moduleSourceDir", "[PC Preview] unknow moduleSourceDir"],
    permissions: ["[PC Preview] unknow permission", "[PC Preview] unknow permission"],
    moduleInfo: [ModuleInfoMock],
    entryDir: "[PC Preview] unknow entryDir",
    customizeData: new Map([["[PC Preview] unknow customizeDataKey", CustomizeDataMock]])
  }
  const AbilityInfoMock = {
    bundleName: "[PC Preview] unknow bundleName",
    className: "[PC Preview] unknow name",
    label: "[PC Preview] unknow label",
    description: "[PC Preview] unknow description",
    icon: "[PC Preview] unknow icon",
    labelId: "[PC Preview] unknow labelId",
    descriptionId: "[PC Preview] unknow descriptionId",
    iconId: "[PC Preview] unknow iconId",
    moduleName: "[PC Preview] unknow moduleName",
    process: "[PC Preview] unknow process",
    targetAbility: "[PC Preview] unknow targetAbility",
    backgroundModes: "[PC Preview] unknow backgroundModes",
    isVisible: "[PC Preview] unknow isVisible",
    formEnabled: "[PC Preview] unknow formEnabled",
    type: "[PC Preview] unknow type",
    subType: "[PC Preview] unknow subType",
    orientation: "[PC Preview] unknow orientation",
    launchMode: "[PC Preview] unknow launchMode",
    permissions: ["[PC Preview] unknow permission", "[PC Preview] unknow permission"],
    deviceTypes: ["[PC Preview] unknow deviceType", "[PC Preview] unknow deviceType"],
    deviceCapabilities: ["[PC Preview] unknow deviceCapabilities", "[PC Preview] unknow deviceCapabilities"],
    readPermission: "[PC Preview] unknow readPermission",
    writePermission: "[PC Preview] unknow writePermission",
    applicationInfo: ApplicationInfoMock,
    formEntity: "[PC Preview] unknow formEntity",
    minFormHeight: "[PC Preview] unknow minFormHeight",
    defaultFormHeight: "[PC Preview] unknow defaultFormHeight",
    minFormWidth: "[PC Preview] unknow minFormWidth",
    defaultFormWidth: "[PC Preview] unknow defaultFormWidth",
    uri: "[PC Preview] unknow uri",
    customizeData: new Map([["[PC Preview] unknow customizeDataKey", CustomizeDataMock]])
  }
  global.systemplugin.distributedSchedule = {
    stopDistributedService: function (...args) {
      console.warn("distributedSchedule.stopDistributedService interface mocked in the Previewer. " +
        "How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    startDistributedService: function (...args) {
      console.warn("distributedSchedule.startDistributedService interface mocked in the Previewer. " +
        "How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    queryRemoteAbilityByWant: function (...args) {
      console.warn("distributedSchedule.queryRemoteAbilityByWant interface mocked in the Previewer. " +
        "How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var array = new Array();
      array.push(AbilityInfoMock);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        })
      }
    }
  }
}