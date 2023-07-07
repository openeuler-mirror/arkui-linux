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

export function mockList() {
  const paramList = {
    paramAnyMock: '[PC Preview] unknow any',
    paramListMock: '[PC Preview] unknow List',
    paramIterMock: '[PC Preview] unknow IterableIterator'
  }
  const ListClass = class List {
    constructor(...args) {
      console.warn('util.List interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.add = function (...args) {
        console.warn("List.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.insert = function (...args) {
        console.warn("List.insert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.get = function (...args) {
        console.warn("List.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramList.paramAnyMock;
      };
      this.has = function (...args) {
        console.warn("List.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getIndexOf = function (...args) {
        console.warn("List.getIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.removeByIndex = function (...args) {
        console.warn("List.removeByIndex interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramList.paramAnyMock;
      };
      this.remove = function (...args) {
        console.warn("List.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getLastIndexOf = function (...args) {
        console.warn("List.getLastIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getFirst = function (...args) {
        console.warn("List.getFirst interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramList.paramAnyMock;
      };
      this.getLast = function (...args) {
        console.warn("List.getLast interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramList.paramAnyMock;
      };
      this.set = function (...args) {
        console.warn("List.set interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramList.paramAnyMock;
      };
      this.equal = function (...args) {
        console.warn("List.equal interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.forEach = function (...args) {
        console.warn("List.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.sort = function (...args) {
        console.warn("List.sort interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.clear = function (...args) {
        console.warn("List.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.getSubList = function (...args) {
        console.warn("List.getSubList interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramList.paramListMock;
      };
      this.replaceAllElements = function (...args) {
        console.warn("List.replaceAllElements interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock, paramLinkedList.paramAnyMock)
        }
      };
      this.convertToArray = function (...args) {
        console.warn("List.convertToArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramArrayMock;
      };
      this.isEmpty = function (...args) {
        console.warn("LinkedList.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("List.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramList.paramAnyMock,
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
  return ListClass;
}