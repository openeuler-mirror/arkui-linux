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

import { AbilityDelegator as _AbilityDelegator} from "./application/abilityDelegator"
import { AbilityDelegatorArgs as _AbilityDelegatorArgs } from "./application/abilityDelegatorArgs"
import { AbilityMonitor as _AbilityMonitor } from "./application/abilityMonitor"
import { ShellCmdResult as _ShellCmdResult } from "./application/shellCmdResult"

export const AbilityLifecycleState = {
  UNINITIALIZED: '[PC preview] unknow UNINITIALIZED',
  CREATE: '[PC preview] unknow CREATE',
  FOREGROUND: '[PC preview] unknow FOREGROUND',
  BACKGROUND: '[PC preview] unknow BACKGROUND',
  DESTROY: '[PC preview] unknow DESTROY',
}

export function mockAbilityDelegatorRegistry() {
  const abilityDelegatorRegistry = {
    getAbilityDelegator: function () {
        console.warn('abilityDelegatorRegistry.getAbilityDelegator interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return _AbilityDelegator;
    },
    getArguments: function () {
        console.warn('abilityDelegatorRegistry.getArguments interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return _AbilityDelegatorArgs;
    },
    AbilityLifecycleState,
    AbilityDelegator: _AbilityDelegator,
    AbilityDelegatorArgs: _AbilityDelegatorArgs,
    AbilityMonitor: _AbilityMonitor,
    ShellCmdResult: _ShellCmdResult
  }
  return abilityDelegatorRegistry
}