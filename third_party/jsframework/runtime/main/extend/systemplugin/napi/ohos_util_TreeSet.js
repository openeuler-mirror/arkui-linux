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

export function mockTreeSet() {
  const paramTreeSet = {
    paramAnyMock: '[PC Preview] unknow any',
    paramIterMock_TT: '[PC Preview] unknow IterableIterator_tt',
    paramIterMock: '[PC Preview] unknow IterableIterator'
  }
  const TreeSetClass = class TreeSet {
    constructor(...args) {
      console.warn('util.TreeSet interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.isEmpty = function (...args) {
        console.warn("TreeSet.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.has = function (...args) {
        console.warn("TreeSet.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.add = function (...args) {
        console.warn("TreeSet.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.remove = function (...args) {
        console.warn("TreeSet.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.clear = function (...args) {
        console.warn("TreeSet.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.getFirstValue = function (...args) {
        console.warn("TreeSet.getFirstValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeSet.paramAnyMock;
      };
      this.getLastValue = function (...args) {
        console.warn("TreeSet.getLastValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeSet.paramAnyMock;
      };
      this.getLowerValue = function (...args) {
        console.warn("TreeSet.getLowerValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeSet.paramAnyMock;
      };
      this.getHigherValue = function (...args) {
        console.warn("TreeSet.getHigherValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeSet.paramAnyMock;
      };
      this.popFirst = function (...args) {
        console.warn("TreeSet.popFirst interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeSet.paramAnyMock;
      };
      this.popLast = function (...args) {
        console.warn("TreeSet.popLast interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramTreeSet.paramAnyMock;
      };
      this.forEach = function (...args) {
        console.warn("TreeSet.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.values = function (...args) {
        console.warn("TreeSet.values interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramTreeSet.paramIterMock_TT;
          }
        };
        return IteratorVMock;
      };
      this.entries = function (...args) {
        console.warn("TreeSet.entries interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramTreeSet.paramIterMock;
          }
        };
        return IteratorVMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("TreeSet.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramTreeSet.paramAnyMock,
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
  return TreeSetClass;
}