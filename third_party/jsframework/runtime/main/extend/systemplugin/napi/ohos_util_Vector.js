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

export function mockVector() {
  const paramVector = {
    paramAnyMock: '[PC Preview] unknow any',
    paramVectorMock: '[PC Preview] unknow Vector',
    paramIterMock: '[PC Preview] unknow IterableIterator'
  }

  const VectorClass = class Vector {
    constructor(...args) {
      console.warn('util.Vector interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.add = function (...args) {
        console.warn("Vector.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.insert = function (...args) {
        console.warn("Vector.insert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.has = function (...args) {
        console.warn("Vector.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.get = function (...args) {
        console.warn("Vector.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramAnyMock;
      };
      this.getIndexOf = function (...args) {
        console.warn("Vector.getIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getFirstElement = function (...args) {
        console.warn("Vector.getFirstElement interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramAnyMock;
      };
      this.getLastElement = function (...args) {
        console.warn("Vector.getLastElement interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramAnyMock;
      };
      this.removeByIndex = function (...args) {
        console.warn("Vector.removeByIndex interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramAnyMock;
      };
      this.remove = function (...args) {
        console.warn("Vector.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.set = function (...args) {
        console.warn("Vector.set interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramAnyMock;
      };
      this.getLastIndexOf = function (...args) {
        console.warn("Vector.getLastIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getLastIndexFrom = function (...args) {
        console.warn("Vector.getLastIndexFrom interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getIndexFrom = function (...args) {
        console.warn("Vector.getIndexFrom interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.removeByRange = function (...args) {
        console.warn("Vector.removeByRange interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.replaceAllElements = function (...args) {
        console.warn("Vector.replaceAllElements interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock, paramVector.paramAnyMock)
        }
      };
      this.forEach = function (...args) {
        console.warn("Vector.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (typeof args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.sort = function (...args) {
        console.warn("Vector.sort interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.subVector = function (...args) {
        console.warn("Vector.subVector interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramVectorMock;
      };
      this.clear = function (...args) {
        console.warn("Vector.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.clone = function (...args) {
        console.warn("Vector.clone interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramVector.paramVectorMock;
      };
      this.setLength = function (...args) {
        console.warn("Vector.setLength interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.getCapacity = function (...args) {
        console.warn("Vector.getCapacity interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.convertToArray = function (...args) {
        console.warn("Vector.convertToArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramArrayMock;
      };
      this.isEmpty = function (...args) {
        console.warn("Vector.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.increaseCapacityTo = function (...args) {
        console.warn("Vector.increaseCapacityTo interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.toString = function (...args) {
        console.warn("Vector.toString interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
      this.trimToCurrentLength = function (...args) {
        console.warn("Vector.trimToCurrentLength interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.copyToArray = function (...args) {
        console.warn("Vector.copyToArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("Vector.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              index++;
              return {
                value: paramVector.paramAnyMock,
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
  return VectorClass;
}