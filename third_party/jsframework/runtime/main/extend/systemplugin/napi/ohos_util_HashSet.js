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

export function mockHashSet() {
  const paramHashSet = {
    paramAnyMock : '[PC Preview] unknow any'
  }
  const HashSetClass = class HashSet {
    constructor(...args) {
      console.warn('util.HashSet interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.isEmpty = function (...args) {
        console.warn("HashSet.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.has = function (...args) {
        console.warn("HashSet.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.add = function (...args) {
        console.warn("HashSet.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.remove = function (...args) {
        console.warn("HashSet.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.clear = function (...args) {
        console.warn("HashSet.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.forEach = function (...args) {
        console.warn("HashSet.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (this.args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock);
        }
      };
      this.values = function (...args) {
        console.warn('HashSet.values interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramHashSet.paramAnyMock;
          }
        };
        return IteratorVMock;
      };
      this.entries = function (...args) {
        console.warn('HashSet.entries interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorEntriesMock = {
          *[Symbol.iterator]() {
            yield [paramHashSet.paramAnyMock, paramHashSet.paramAnyMock];
          }
        };
        return IteratorEntriesMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("HashSet.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramHashSet.paramAnyMock, paramHashSet.paramAnyMock];
              index++;
              return {
                value: returnValue,
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
  return HashSetClass;
}