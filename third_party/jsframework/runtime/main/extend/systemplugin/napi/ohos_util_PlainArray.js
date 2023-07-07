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

export function mockPlainArray() {
  const paramPlainArray = {
    paramAnyMock : '[PC Preview] unknow any',
    paramPlainArray : '[PC Preview] unknow PlainArray',
    paramIterMock_K : '[PC Preview] unknow iterableiterator_k',
    paramIterMock_V : '[PC Preview] unknow iterableiterator_v'
  }
  const PlainArrayClass = class PlainArray {
    constructor(...args) {
      console.warn('util.PlainArray interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.add = function (...args) {
        console.warn("PlainArray.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.clear = function (...args) {
        console.warn("PlainArray.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.clone = function (...args) {
        console.warn("PlainArray.clone interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramPlainArray.paramPlainArray;
      };
      this.has = function (...args) {
        console.warn("PlainArray.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.get = function (...args) {
        console.warn("PlainArray.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramPlainArray.paramAnyMock;
      };
      this.getIndexOfKey = function (...args) {
        console.warn("PlainArray.getIndexOfKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getIndexOfValue = function (...args) {
        console.warn("PlainArray.getIndexOfValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.isEmpty = function (...args) {
        console.warn("PlainArray.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getKeyAt = function (...args) {
        console.warn("PlainArray.getKeyAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.remove = function (...args) {
        console.warn("PlainArray.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramPlainArray.paramAnyMock;
      };
      this.removeAt = function (...args) {
        console.warn("PlainArray.removeAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramPlainArray.paramAnyMock;
      };
      this.removeRangeFrom = function (...args) {
        console.warn("PlainArray.removeRangeFrom interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.setValueAt = function (...args) {
        console.warn("PlainArray.setValueAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.toString = function (...args) {
        console.warn("PlainArray.toString interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
      this.getValueAt = function (...args) {
        console.warn("PlainArray.getValueAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramPlainArray.paramAnyMock;
      };
      this.forEach = function (...args) {
        console.warn("PlainArray.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (this.args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("PlainArray.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramPlainArray.paramIterMock_K, paramPlainArray.paramIterMock_V];
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
  return PlainArrayClass;
}