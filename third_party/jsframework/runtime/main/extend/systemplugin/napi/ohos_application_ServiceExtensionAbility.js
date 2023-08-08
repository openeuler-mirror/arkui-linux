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
import { ServiceExtensionContextClass } from "./application/ServiceExtensionContext"
import { RemoteObjectClass } from "./ohos_rpc"

export function mockServiceExtensionAbility() {
  const ServiceExtensionAbilityClass = class ServiceExtensionAbility {
    constructor() {
      console.warn('application.ServiceExtensionAbility.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.context = new ServiceExtensionContextClass();
      this.onCreate = function (...args) {
        console.warn("application.ServiceExtensionAbility.onCreate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onDestroy = function () {
        console.warn("application.ServiceExtensionAbility.onDestroy interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onRequest = function (...args) {
        console.warn("application.ServiceExtensionAbility.onRequest interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onConnect = function (...args) {
        console.warn("application.ServiceExtensionAbility.onConnect interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new RemoteObjectClass();
      };
      this.onDisconnect = function (...args) {
        console.warn("application.ServiceExtensionAbility.onDisconnect interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onReconnect = function (...args) {
        console.warn("application.ServiceExtensionAbility.onReconnect interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.onConfigurationUpdated = function (...args) {
        console.warn("application.ServiceExtensionAbility.onConfigurationUpdated interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.dump = function (...args) {
        console.warn("application.ServiceExtensionAbility.dump interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return [paramMock.paramStringMock];
      };
    }
  }
  return new ServiceExtensionAbilityClass();
}