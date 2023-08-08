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

export function mockDeque() {
  const paramDeque = {
    paramAnyMock: '[PC Preview] unknow any',
    paramIterMock: '[PC Preview] unknow IterableIterator'
  }
  const DequeClass = class Deque {
    constructor(...args) {
      console.warn('util.Deque interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.insertFront = function (...args) {
        console.warn("Deque.insertFront interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
      };
      this.insertEnd = function (...args) {
        console.warn("Deque.insertEnd interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
      };
      this.has = function (...args) {
        console.warn("Deque.has interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getFirst = function (...args) {
        console.warn("Deque.getFirst interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        return paramDeque.paramAnyMock;
      };
      this.getLast = function (...args) {
        console.warn("Deque.getLast interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        return paramDeque.paramAnyMock;
      };
      this.popFirst = function (...args) {
        console.warn("Deque.popFirst interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        return paramDeque.paramAnyMock;
      };
      this.popLast = function (...args) {
        console.warn("Deque.popLast interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        return paramDeque.paramAnyMock;
      };
      this.forEach = function (...args) {
        console.warn("Deque.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
            args[0].call(this, paramDeque.businessErrorMock)
        }
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("Deque.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramDeque.paramAnyMock,
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
  return DequeClass;
}