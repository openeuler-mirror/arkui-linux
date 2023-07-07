/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

export function mockInputDevice() {
  const DeviceListener = {
    type: '[PC preview] unknow type',
    deviceId: '[PC preview] unknow deviceId',
  }
  const AxisRange = {
    source: '[PC preview] unknow source',
    axis: '[PC preview] unknow axis',
    max: '[PC preview] unknow max',
    min: '[PC preview] unknow min',
    fuzz: '[PC preview] unknow fuzz',
    flat: '[PC preview] unknow flat',
    resolution: '[PC preview] unknow resolution',
  }
  const InputDeviceData = {
    id: '[PC preview] unknow id',
    name: '[PC preview] unknow name',
    sources: ['[PC preview] unknow sources'],
    axisRanges: [AxisRange],
    bus: '[PC preview] unknow bus',
    product: '[PC preview] unknow product',
    vendor: '[PC preview] unknow vendor',
    version: '[PC preview] unknow version',
    phys: '[PC preview] unknow phys',
    uniq: '[PC preview] unknow uniq',
  }
  const KeyboardType = {
    NONE: 0,
    UNKNOWN: 1,
    ALPHABETIC_KEYBOARD: 2,
    DIGITAL_KEYBOARD: 3,
    HANDWRITING_PEN: 4,
    REMOTE_CONTROL: 5,
  }

  const EventType = ['change']
  const DeviceIds = [0, 1, 2, 3, 4]
  const GetKeyboardType = 3
  const inputDevice = {
    KeyboardType,
    on: function (...args) {
      console.warn("inputDevice.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length;
      if (len === 2) {
        if (EventType.indexOf(args[0]) === -1) {
          console.warn("the first parameter must be 'change'")
        }
        if (typeof args[1] != 'function') {
          console.warn("the second parameter type must be 'function'")
        }
      } else {
        console.warn("the number of parameter must be two")
      }
    },
    off: function (...args) {
      console.warn("inputDevice.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length;
      if (len < 1 || len > 2) {
        console.warn("a maximum of two parameters")
      } else if (len === 1) {
        if (EventType.indexOf(args[0]) === -1) {
          console.warn("first parameter must be 'change'")
        }
      } else {
        if (EventType.indexOf(args[0]) === -1) {
          console.warn("first parameter must be 'change'")
        }
        if (typeof args[1] != 'function') {
          console.warn("second parameter type must be 'function'")
        }
      }
    },
    getDeviceSync: function (...args) {
      console.warn("inputDevice.getDeviceSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length;
      if (len != 1) {
        console.warn("the number of parameter must be one")
      } else {
        if (DeviceIds.indexOf(args[len - 1]) != -1) {
          return InputDeviceData;
        } else {
          console.warn("parameter error")
          return paramMock.businessErrorMock;
        }
      }
    },
    getDeviceIdsSync: function () {
      console.warn("inputDevice.getDeviceIdsSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return DeviceIds;
    },
    getDeviceIds: function (...args) {
      console.warn("inputDevice.getDeviceIds interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length;
      if (len > 1) {
        console.warn("the number of parameter must be one")
        return;
      }
      if (len === 1) {
        if (typeof args[0] === 'function') {
          args[0].call(this, DeviceIds);
        } else {
          console.warn("parameter type must be 'function'")
        }
      } else {
        return new Promise((resolve, reject) => {
          resolve(DeviceIds);
        })
      }
    },
    getDevice: function (...args) {
      console.warn("inputDevice.getDevice interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (len < 1 || len > 2) {
        console.warn("the number of parameter must be two");
        return;
      }
      if (typeof args[0] !== 'number') {
        console.warn("the first parameter error");
        return;
      }
      if (len === 1) {
        return new Promise((resolve, reject) => {
          resolve(InputDeviceData);
        })
      } else {
        if (typeof args[1] !== 'function') {
          console.warn("the second parameter type must be 'function'");
          return;
        }
        args[1].call(this, InputDeviceData);
      }
    },
    supportKeys: function(...args) {
      console.warn("inputDevice.supportKeys interface mocked in the Previewer." + 
        "How this interface works on the" + " Previewer may be different from that on a real device.");
      const len = args.length;
      if (len < 2 || len > 3) {
        console.warn("parameter number error");
        return;
      }
      if (typeof args[0] !== 'number') {
        console.warn("the first parameter error");
        return;
      }
      if (typeof args[1] !== 'object') {
        console.warn("the second parameter type must be array");
        return;
      }
      if (args[1].length < 1 || args[1].length > 5) {
        console.warn("the number of keys is incorrect, the range is 1 to 5");
        return;
      }
      var supportKeysRet = [];
      for (var i = 0; i < args[1].length; ++i) {
        supportKeysRet.unshift('[PC preview] unknow boolean');
      }
      if (len === 2) {
        return new Promise((resolve, reject) => {
          resolve(supportKeysRet);
        })
      } else {
        if (typeof args[2] !== 'function') {
          console.warn("the third parameter type is wrong");
          return;
        }
        args[2].call(this, supportKeysRet);
      }
    },
    getKeyboardType: function(...args) {
      console.warn("inputDevice.getKeyboardType interface mocked in the Previewer." +
        "How this interface works on the" + " Previewer may be different from that on a real device.");
      const len = args.length;
      if (len < 1 || len > 2) {
        console.warn("parameter number error");
        return;
      }
      if (typeof args[0] !== 'number') {
        console.warn("the first parameter error");
        return;
      }
      if (len == 1) {
        return new Promise((resolve, reject) => {
          resolve(GetKeyboardType);
        })
      } else {
        if (typeof args[1] !== 'function') {
          console.warn("the second parameter type must be function");
          return;
        }
        args[1].call(this, GetKeyboardType);
      }
    },
  };
  return inputDevice
}