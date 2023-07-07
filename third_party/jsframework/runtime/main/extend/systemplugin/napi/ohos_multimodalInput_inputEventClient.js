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

import { paramMock } from "../utils"

export function mockInputEventClient() {
  const KeyEvent = {
    isPressed: '[PC preview] unknow isPressed',
    keyCode: '[PC preview] unknow keyCode',
    keyDownDuration: '[PC preview] unknow keyDownDuration',
    isIntercepted: '[PC preview] unknow isIntercepted',
  }
  const inputEventClient = {
    injectEvent: function(...args) {
      console.warn("inputEventClient.injectEvent interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (len !== 1) {
        console.warn("the number of parameter must be one");
        return;
      }
      if (typeof args[0] !== 'object') {
        console.warn("the second parameter type must be 'object'");
        return; 
      }
      if (!('KeyEvent' in args[0])) {
        console.warn("missing 'KeyEvent' field");
        return; 
      }
      if (typeof args[0].KeyEvent.isPressed !== 'boolean') {
        console.warn("Field isPressed must be boolean");
        return; 
      }
      if (typeof args[0].KeyEvent.keyCode !== 'number') {
        console.warn("Field keyCode must be number");
        return; 
      }
      if (typeof args[0].KeyEvent.keyDownDuration !== 'number') {
        console.warn("Field keyDownDuration must be number");
        return; 
      }
      if (typeof args[0].KeyEvent.isIntercepted !== 'boolean') {
        console.warn("Field isIntercepted must be boolean");
        return; 
      }
      args[0].call(this, paramMock.businessErrorMock);
    }
  }
  return inputEventClient;
}