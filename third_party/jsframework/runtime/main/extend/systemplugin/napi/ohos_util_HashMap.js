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

export function mockHashMap() {
  const paramHashMap = {
    paramAnyMock : '[PC Preview] unknow any',
    paramHashMap : '[PC Preview] unknow hashmap',
    paramIterMock_K : '[PC Preview] unknow iterableiterator_k',
    paramIterMock_V : '[PC Preview] unknow iterableiterator_v'
  }
  const HashMapClass = class HashMap {
    constructor(...args) {
      console.warn('util.HashMap interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.isEmpty = function (...args) {
        console.warn("HashMap.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.hasKey = function (...args) {
        console.warn("HashMap.hasKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
          return paramMock.paramBooleanMock;
      };
      this.hasValue = function (...args) {
        console.warn("HashMap.hasValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.get = function (...args) {
        console.warn("HashMap.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramHashMap.paramAnyMock;
      };
      this.setAll = function (...args) {
        console.warn("HashMap.setAll interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.set = function (...args) {
        console.warn("HashMap.set interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramObjectMock;
      };
      this.remove = function (...args) {
        console.warn("HashMap.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramHashMap.paramAnyMock;
      };
      this.clear = function (...args) {
        console.warn("HashMap.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.keys = function (...args) {
        console.warn('HashMap.keys interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorKMock = {
          *[Symbol.iterator]() {
            yield paramHashMap.paramIterMock_K;
          }
        };
        return IteratorKMock;
      };
      this.values = function (...args) {
        console.warn('HashMap.values interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramHashMap.paramIterMock_V;
          }
        };
        return IteratorVMock;
      };
      this.replace = function (...args) {
        console.warn("HashMap.replace interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.forEach = function (...args) {
        console.warn("HashMap.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock);
        }
      };
      this.entries = function (...args) {
        console.warn('HashMap.entries interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorEntriesMock = {
          *[Symbol.iterator]() {
            yield [paramHashMap.paramIterMock_K, paramHashMap.paramIterMock_V];
          }
        };
        return IteratorEntriesMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("HashMap.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramHashMap.paramIterMock_K, paramHashMap.paramIterMock_V];
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
  return HashMapClass;
}