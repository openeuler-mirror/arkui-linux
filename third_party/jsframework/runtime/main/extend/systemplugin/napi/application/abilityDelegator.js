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
import { AbilityClass } from "../ohos_application_Ability"
import { ContextClass } from "./Context"
import { ShellCmdResult } from "./shellCmdResult"

export const AbilityDelegator = {
    addAbilityMonitor: function (...args) {
        console.warn("AbilityDelegator.addAbilityMonitor interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            })
        }
    },
    removeAbilityMonitor: function (...args) {
        console.warn("AbilityDelegator.removeAbilityMonitor interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            })
        }
    },
    waitAbilityMonitor: function (...args) {
        console.warn("AbilityDelegator.waitAbilityMonitor interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, new AbilityClass());
        } else {
            return new Promise((resolve, reject) => {
                resolve(new AbilityClass());
            })
        }
    },
    getAppContext: function (...args) {
        console.warn('AbilityDelegator.getAppContext interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new ContextClass();
    },
    getAbilityState: function (...args) {
        console.warn('AbilityDelegator.getAbilityState interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return paramMock.paramNumberMock;
    },
    getCurrentTopAbility: function (...args) {
        console.warn("AbilityDelegator.getCurrentTopAbility interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, new AbilityClass());
        } else {
            return new Promise((resolve, reject) => {
                resolve(new AbilityClass());
            })
        }
    },
    startAbility: function (...args) {
        console.warn("AbilityDelegator.startAbility interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            })
        }
    },
    doAbilityForeground: function (...args) {
        console.warn("AbilityDelegator.doAbilityForeground interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramBooleanMock);
            })
        }
    },
    doAbilityBackground: function (...args) {
        console.warn("AbilityDelegator.doAbilityBackground interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve(paramMock.paramBooleanMock);
            })
        }
    },
    print: function (...args) {
        console.warn("AbilityDelegator.print interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            })
        }
    },
    printSync: function (...args) {
        console.warn('AbilityDelegator.printSync interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
    },
    executeShellCommand: function (...args) {
        console.warn("AbilityDelegator.executeShellCommand interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, ShellCmdResult);
        } else {
            return new Promise((resolve, reject) => {
                resolve(ShellCmdResult);
            })
        }
    },
    finishTest: function (...args) {
        console.warn("AbilityDelegator.finishTest interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            })
        }
    }
}