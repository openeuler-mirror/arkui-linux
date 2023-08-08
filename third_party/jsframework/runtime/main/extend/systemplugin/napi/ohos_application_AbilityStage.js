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

import { AbilityStageContextClass } from "./application/AbilityStageContext"
import { paramMock } from "../utils"

export function mockAbilityStage() {
  const AbilityStageClass = class AbilityStage {
    constructor() {
      console.warn('application.AbilityStage.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.context = new AbilityStageContextClass();
      this.onCreate = function () {
        console.warn("application.AbilityStage.onCreate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onAcceptWant = function (...args) {
        console.warn("application.AbilityStage.onAcceptWant interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
      this.onConfigurationUpdated = function (...args) {
        console.warn("application.AbilityStage.onConfigurationUpdated interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onMemoryLevel = function (...args) {
        console.warn("application.AbilityStage.onMemoryLevel interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
    }
  }
  return new AbilityStageClass();
}