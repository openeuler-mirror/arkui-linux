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

export function mockLightWeightMap() {
  const paramLightWeightMap = {
    paramAnyMock_K : '[PC Preview] unknow any_k',
    paramAnyMock_V : '[PC Preview] unknow any_v'
  }
  const LightWeightMapClass = class LightWeightMap {
    constructor(...args) {
      console.warn('util.LightWeightMap interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.length = '[PC preview] unknow length';
      this.hasAll = function (...args) {
        console.warn("LightWeightMap.hasAll interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.hasKey = function (...args) {
        console.warn("LightWeightMap.hasKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.hasValue = function (...args) {
        console.warn("LightWeightMap.hasValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.increaseCapacityTo = function (...args) {
        console.warn("LightWeightMap.increaseCapacityTo interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.entries = function (...args) {
        console.warn('LightWeightMap.entries interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorEntriesMock = {
          *[Symbol.iterator]() {
            yield [paramLightWeightMap.paramAnyMock_K, paramHashMap.paramAnyMock_V];
          }
        };
        return IteratorEntriesMock;
      }
      this.get = function (...args) {
        console.warn("LightWeightMap.get interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLightWeightMap.paramAnyMock_V;
      };
      this.getIndexOfKey = function (...args) {
        console.warn("LightWeightMap.getIndexOfKey interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.getIndexOfValue = function (...args) {
        console.warn("LightWeightMap.getIndexOfValue interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };
      this.isEmpty = function (...args) {
        console.warn("LightWeightMap.isEmpty interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.getKeyAt = function (...args) {
        console.warn("LightWeightMap.getKeyAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLightWeightMap.paramAnyMock_K;
      };
      this.keys = function (...args) {
        console.warn('LightWeightMap.keys interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorKMock = {
          *[Symbol.iterator]() {
            yield paramLightWeightMap.paramAnyMock_K;
          }
        };
        return IteratorKMock;
      };
      this.setAll = function (...args) {
        console.warn("LightWeightMap.setAll interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.set = function (...args) {
        console.warn("LightWeightMap.set interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramObjectMock;
      };
      this.remove = function (...args) {
        console.warn("LightWeightMap.remove interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLightWeightMap.paramAnyMock_V;
      };
      this.removeAt = function (...args) {
        console.warn("LightWeightMap.removeAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.clear = function (...args) {
        console.warn("LightWeightMap.clear interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.setValueAt = function (...args) {
        console.warn("LightWeightMap.setValueAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };
      this.forEach = function (...args) {
        console.warn("LightWeightMap.forEach interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        if (this.args[0] === 'function') {
          args[0].call(this, paramMock.businessErrorMock)
        }
      };
      this.toString = function (...args) {
        console.warn("LightWeightMap.toString interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
      this.getValueAt = function (...args) {
        console.warn("LightWeightMap.getValueAt interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return paramLightWeightMap.paramAnyMock_V;
      };
      this.values = function (...args) {
        console.warn('LightWeightMap.values interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorVMock = {
          *[Symbol.iterator]() {
            yield paramLightWeightMap.paramAnyMock_V;
          }
        };
        return IteratorVMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("LightWeightMap.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        let index = 0;
        const IteratorMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramLightWeightMap.paramAnyMock_K, paramLightWeightMap.paramAnyMock_V];
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
  return LightWeightMapClass;
}