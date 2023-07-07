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
export const AbilityMonitor = {
    abilityName: "[PC Preview] unknow abilityName",
    onAbilityCreate: function (...args) {
        console.warn("AbilityMonitor.onAbilityCreate interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
    onAbilityForeground: function (...args) {
        console.warn("AbilityMonitor.onAbilityForeground interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
    onAbilityBackground: function (...args) {
        console.warn("AbilityMonitor.onAbilityBackground interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
    onAbilityDestroy: function (...args) {
        console.warn("AbilityMonitor.onAbilityDestroy interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
    onWindowStageCreate: function (...args) {
        console.warn("AbilityMonitor.onWindowStageCreate interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
    onWindowStageRestore: function (...args) {
        console.warn("AbilityMonitor.onWindowStageRestore interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
    onWindowStageDestroy: function (...args) {
        console.warn("AbilityMonitor.onWindowStageDestroy interface mocked in the Previewer." +
            " How this interface works on the Previewer may be different from that on a real device.")
    },
}