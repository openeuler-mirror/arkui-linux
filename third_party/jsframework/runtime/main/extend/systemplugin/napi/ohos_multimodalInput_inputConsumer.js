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

export function mockInputConsumer() {
  const KeyOptions = {
    preKeys: [param.paramNumberMock],
    finalKey: "[PC preview] unknown finalKey",
    isFinalKeyDown: "[PC preview] unknown isFinalKeyDown",
    finalKeyDownDuration: "[PC preview] unknown finalKeyDownDuration",
  }
  const EventType = ['key']
  const inputConsumer = {   
    on: function (...args) {
        console.warn("inputConsumer.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
        const len = args.length;
        if (len !== 3) {
            console.warn("Must be three parameters");
            return;
        }
        if (EventType.indexOf(args[0]) === -1) {
            console.warn("the first parameter must be 'key'");
            return;
        }
        if (typeof args[1] != 'object') {
            console.warn("the second parameter type must be 'object'");
            return; 
        }
        if (typeof args[2] != 'function') {
            console.warn("the third parameter type must be 'function'");
            return; 
        }
        args[2].call(this, args[1]);
    },
    off: function (...args) {
        console.warn("inputConsumer.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
        const len = args.length;
        if (len < 2 || len > 3) {
            console.warn("a maximum of two parameters");
            return;
        }
        if (EventType.indexOf(args[0]) === -1) {
            console.warn("first parameter must be 'key'")
            return;
        }
        if (typeof args[1] != 'object') {
            console.warn("second parameter type must be 'object'");
            return;
        }
        if (len === 3) {
            if (typeof args[2] != 'function') {
                console.warn("the third parameter type must be 'function'");
                return; 
            } 
        }
    }
  }
  return inputConsumer;
}