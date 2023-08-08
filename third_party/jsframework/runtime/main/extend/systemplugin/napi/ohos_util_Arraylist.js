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

export function mockArrayList() {
  const paramArrayList = {
    paramAnyMock: '[PC Preview] unknow any',
    paramArrayListMock: '[PC Preview] unknow ArrayList'
  }
  const ArrayListClass = class ArrayList {
    constructor(...args) {
      console.warn('util.ArrayList interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.add = function (...args) {
        console.warn("ArrayList.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.insert = function (...args) {
        console.warn("ArrayList.insert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.has = function (...args) {
        console.warn("ArrayList.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getIndexOf = function (...args) {
        console.warn("ArrayList.getIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.removeByIndex = function (...args) {
        console.warn("ArrayList.removeByIndex interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramArrayList.paramAnyMock;
      };
      this.remove = function (...args) {
        console.warn("ArrayList.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getLastIndexOf = function (...args) {
        console.warn("ArrayList.getLastIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.removeByRange = function (...args) {
        console.warn("ArrayList.removeByRange interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.replaceAllElements = function (...args) {
        console.warn("ArrayList.replaceAllElements interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock, paramArrayList.paramAnyMock)
        }
      };
      this.forEach = function (...args) {
        console.warn("ArrayList.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.sort = function (...args) {
        console.warn("ArrayList.sort interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        }
      };
      this.subArrayList = function (...args) {
        console.warn("ArrayList.subArrayList interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramArrayList.paramArrayListMock;
      };
      this.clear = function (...args) {
        console.warn("ArrayList.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.clone = function (...args) {
        console.warn("ArrayList.clone interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramArrayList.paramArrayListMock;
      };
      this.getCapacity = function (...args) {
        console.warn("ArrayList.getCapacity interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.convertToArray = function (...args) {
        console.warn("ArrayList.convertToArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramArrayMock;
      };
      this.isEmpty = function (...args) {
        console.warn("ArrayList.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.increaseCapacityTo = function (...args) {
        console.warn("ArrayList.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.trimToCurrentLength = function (...args) {
        console.warn("ArrayList.trimToCurrentLength interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("ArrayList.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramArrayList.paramAnyMock,
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
  return ArrayListClass;
}