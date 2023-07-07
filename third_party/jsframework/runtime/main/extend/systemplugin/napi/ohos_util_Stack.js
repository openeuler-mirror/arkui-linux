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

export function mockStack() {
  const paramStack = {
    paramAnyMock: '[PC Preview] unknow any',
    paramIterMock: '[PC Preview] unknow IterableIterator'
  }
  const StackClass = class Stack {
    constructor(...args) {
      console.warn('util.Stack interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.isEmpty = function (...args) {
        console.warn("Stack.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.peek = function (...args) {
        console.warn("Stack.peek interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramStack.paramAnyMock;
      };
      this.pop = function (...args) {
        console.warn("Stack.pop interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramStack.paramAnyMock;
      };
      this.push = function (...args) {
        console.warn("Stack.push interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramStack.paramAnyMock;
      };
      this.locate = function (...args) {
        console.warn("Stack.locate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.forEach = function (...args) {
        console.warn("Stack.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("Stack.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramStack.paramAnyMock,
                done: false
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return IteratorMock;
      }
    }
  }
  return StackClass;
}