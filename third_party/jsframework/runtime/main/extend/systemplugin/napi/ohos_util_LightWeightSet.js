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

export function mockLightWeightSet() {
  const paramLightWeightSet = {
    paramAnyMock: '[PC Preview] unknow any',
    paramIterMock_T: '[PC Preview] unknow IterableIterator_t'
  }
  const LightWeightSetClass = class LightWeightSet {
    constructor(...args) {
      console.warn('util.LightWeightSet interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.add = function (...args) {
        console.warn("LightWeightSet.add interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.addAll = function (...args) {
        console.warn("LightWeightSet.addAll interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.hasAll = function (...args) {
        console.warn("LightWeightSet.hasAll interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.has = function (...args) {
        console.warn("LightWeightSet.has interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.equal = function (...args) {
        console.warn("LightWeightSet.equal interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.increaseCapacityTo = function (...args) {
        console.warn("LightWeightSet.increaseCapacityTo interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.getIndexOf = function (...args) {
        console.warn("LightWeightSet.getIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.remove = function (...args) {
        console.warn("LightWeightSet.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLightWeightSet.paramAnyMock;
      };
      this.removeAt = function (...args) {
        console.warn("LightWeightSet.removeAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.clear = function (...args) {
        console.warn("LightWeightSet.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.forEach = function (...args) {
        console.warn("LightWeightSet.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (this.args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock);
        }
      };
      this.toString = function (...args) {
        console.warn("LightWeightSet.toString interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
      this.toString = function (...args) {
        console.warn("LightWeightSet.toString interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
      this.toArray = function (...args) {
        console.warn("LightWeightSet.toArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramArrayMock;
      };
      this.getValueAt = function (...args) {
        console.warn("LightWeightSet.getValueAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLightWeightSet.paramAnyMock;
      };
      this.values = function (...args) {
        console.warn('LightWeightSet.values interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramLightWeightSet.paramIterMock_T;
          }
        };
        return IteratorVMock;
      };
      this.entries = function (...args) {
        console.warn('LightWeightSet.entries interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorEntriesMock = {
          *[Symbol.iterator]() {
            yield [paramLightWeightSet.paramIterMock_T, paramLightWeightSet.paramIterMock_T];
          }
        };
        return IteratorEntriesMock;
      };
      this.isEmpty = function (...args) {
        console.warn("LightWeightSet.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("LightWeightSet.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramLightWeightSet.paramIterMock_T, paramLightWeightSet.paramIterMock_T];
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
  return LightWeightSetClass;
}