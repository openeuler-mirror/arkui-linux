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

export function mockTreeMap() {
  const paramTreeMap = {
    paramIterMock_K: '[PC Preview] unknow iterableiterator_k',
    paramIterMock_V: '[PC Preview] unknow iterableiterator_v'
  }
  const TreeMapClass = class TreeMap {
    constructor(...args) {
      console.warn('util.TreeMap interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.isEmpty = function (...args) {
        console.warn("TreeMap.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.hasKey = function (...args) {
        console.warn("TreeMap.hasKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.hasValue = function (...args) {
        console.warn("TreeMap.hasValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.get = function (...args) {
        console.warn("TreeMap.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeMap.paramIterMock_V;
      };
      this.getFirstKey = function (...args) {
        console.warn("TreeMap.getFirstKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeMap.paramIterMock_K;
      };
      this.getLastKey = function (...args) {
        console.warn("TreeMap.getLastKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeMap.paramIterMock_K;
      };
      this.setAll = function (...args) {
        console.warn("TreeMap.setAll interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.set = function (...args) {
        console.warn("TreeMap.set interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramObjectMock;
      };
      this.remove = function (...args) {
        console.warn("TreeMap.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeMap.paramIterMock_V;
      };
      this.clear = function (...args) {
        console.warn("TreeMap.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.getLowerKey = function (...args) {
        console.warn("TreeMap.getLowerKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeMap.paramIterMock_K;
      };
      this.getHigherKey = function (...args) {
        console.warn("TreeMap.getHigherKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeMap.paramIterMock_K;
      };
      this.keys = function (...args) {
        console.warn('TreeMap.keys interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorKMock = {
          *[Symbol.iterator]() {
            yield paramTreeMap.paramIterMock_K;
          }
        };
        return IteratorKMock;
      };
      this.values = function (...args) {
        console.warn('TreeMap.values interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramTreeMap.paramIterMock_V;
          }
        };
        return IteratorVMock;
      };
      this.replace = function (...args) {
        console.warn("TreeMap.replace interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.forEach = function (...args) {
        console.warn("TreeMap.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (this.args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.entries = function (...args) {
        console.warn('TreeMap.entries interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorEntriesMock = {
          *[Symbol.iterator]() {
            yield [paramTreeMap.paramIterMock_K, paramTreeMap.paramIterMock_V];
          }
        };
        return IteratorEntriesMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("TreeMap.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramTreeMap.paramIterMock_K, paramTreeMap.paramIterMock_V];
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
  return TreeMapClass;
}