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
import { ShortcutInfo } from './bundle/shortcutInfo'
import { LauncherAbilityInfo } from './bundle/launcherAbilityInfo'

export function mockInnerBundle() {
    const innerBundleManager = {
        getLauncherAbilityInfos: function(...args){
            console.warn("innerBundle.getLauncherAbilityInfos interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, LauncherAbilityInfo);
            } else {
                return new Promise((resolve) => {
                    resolve(LauncherAbilityInfo);
                })
            }
        },
        on: function(...args) {
            console.warn("innerBundle.on interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
        },
        off: function(...args) {
            console.warn("innerBundle.off interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
        },
        getAllLauncherAbilityInfos: function(...args){
            console.warn("innerBundle.getAllLauncherAbilityInfos interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(LauncherAbilityInfo));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(LauncherAbilityInfo));
                })
            }
        },
        getShortcutInfos: function(...args){
            console.warn("innerBundle.getShortcutInfos interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            const len = args.length;
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Array(ShortcutInfo));
            } else {
                return new Promise((resolve) => {
                    resolve(Array(ShortcutInfo));
                })
            }
        },
    };
    return innerBundleManager;
}