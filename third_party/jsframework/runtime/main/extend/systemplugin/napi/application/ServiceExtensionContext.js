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

import { paramMock } from "../../utils"
import { Caller } from "../ohos_application_Ability";
import { ExtensionContextClass } from "./ExtensionContext"

export const ServiceExtensionContextClass = class ServiceExtensionContext extends ExtensionContextClass {
    constructor() {
        super();
        console.warn("ServiceExtensionContext.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.startAbility = function (...args) {
            console.warn("ServiceExtensionContext.startAbility interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.startAbilityWithAccount = function (...args) {
            console.warn("ServiceExtensionContext.startAbilityWithAccount interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.startServiceExtensionAbility = function (...args) {
            console.warn("ServiceExtensionContext.startServiceExtensionAbility interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.startServiceExtensionAbilityWithAccount = function (...args) {
            console.warn("ServiceExtensionContext.startServiceExtensionAbilityWithAccount interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.stopServiceExtensionAbility = function (...args) {
            console.warn("ServiceExtensionContext.stopServiceExtensionAbility interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.stopServiceExtensionAbilityWithAccount = function (...args) {
            console.warn("ServiceExtensionContext.stopServiceExtensionAbilityWithAccount interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.terminateSelf = function (...args) {
            console.warn("ServiceExtensionContext.terminateSelf interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.connectAbility = function (...args) {
            console.warn("ServiceExtensionContext.connectAbility interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock
        };
        this.connectAbilityWithAccount = function (...args) {
            console.warn("ServiceExtensionContext.connectAbilityWithAccount interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock
        };
        this.disconnectAbility = function (...args) {
            console.warn("ServiceExtensionContext.disconnectAbility interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            const len = args.length
            if (len > 0 && typeof args[len - 1] === 'function') {
              args[len - 1].call(this, paramMock.businessErrorMock);
            } else {
              return new Promise((resolve, reject) => {
                resolve();
              })
            }
        };
        this.startAbilityByCall = function (...args) {
            console.warn("ServiceExtensionContext.startAbilityByCall interface mocked in the Previewer." +
              " How this interface works on the Previewer may be different from that on a real device.")
            return new Promise((resolve, reject) => {
              resolve(Caller);
            })
        };
    }
};