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

export function mockLinkedList() {
  const paramLinkedList = {
    paramAnyMock: '[PC Preview] unknow any',
    paramLinkedListMock: '[PC Preview] unknow LinkedList',
    paramIterMock: '[PC Preview] unknow IterableIterator'
  }
  const LinkedListClass = class LinkedList {
    constructor(...args) {
      console.warn('util.LinkedList interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.add = function (...args) {
        console.warn("LinkedList.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.insert = function (...args) {
        console.warn("LinkedList.insert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.get = function (...args) {
        console.warn("LinkedList.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.addFirst = function (...args) {
        console.warn("LinkedList.addFirst interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.removeFirst = function (...args) {
        console.warn("LinkedList.removeFirst interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.removeLast = function (...args) {
        console.warn("LinkedList.removeLast interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.has = function (...args) {
        console.warn("LinkedList.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getIndexOf = function (...args) {
        console.warn("LinkedList.getIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.removeByIndex = function (...args) {
        console.warn("LinkedList.removeByIndex interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.remove = function (...args) {
        console.warn("LinkedList.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.removeFirstFound = function (...args) {
        console.warn("LinkedList.removeFirstFound interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.removeLastFound = function (...args) {
        console.warn("LinkedList.removeLastFound interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getLastIndexOf = function (...args) {
        console.warn("LinkedList.getLastIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getFirst = function (...args) {
        console.warn("LinkedList.getFirst interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.getLast = function (...args) {
        console.warn("LinkedList.getLast interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.set = function (...args) {
        console.warn("LinkedList.set interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramAnyMock;
      };
      this.forEach = function (...args) {
        console.warn("LinkedList.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.clear = function (...args) {
        console.warn("LinkedList.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.clone = function (...args) {
        console.warn("LinkedList.clone interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLinkedList.paramLinkedListMock;
      };
      this.convertToArray = function (...args) {
        console.warn("LinkedList.convertToArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramArrayMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("LinkedList.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramLinkedList.paramAnyMock,
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
  return LinkedListClass;
}