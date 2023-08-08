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

import { paramMock } from "../utils";
import { RawFileDescriptor } from "./global/rawFileDescriptor"

export function mockResourceManager() {
  const Direction = {
    DIRECTION_VERTICAL : 0,
    DIRECTION_HORIZONTAL : 1
  }

  const ConfigurationClass = class Configuration {
    constructor() {
      console.warn('resourceManager.Configuration.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.direction = Direction;
      this.locale = '[PC Preview] unknow string';
    }
  }

  const ScreenDensity = {
    SCREEN_SDPI : 120,
    SCREEN_MDPI : 160,
    SCREEN_LDPI : 240,
    SCREEN_XLDPI : 320,
    SCREEN_XXLDPI : 480,
    SCREEN_XXXLDPI : 640
  }

  const DeviceType = {
    DEVICE_TYPE_PHONE : 0x00,
    DEVICE_TYPE_TABLET : 0x01,
    DEVICE_TYPE_CAR : 0x02,
    DEVICE_TYPE_PC : 0x03,
    DEVICE_TYPE_TV : 0x04,
    DEVICE_TYPE_WEARABLE : 0x06
  }

  const DeviceCapabilityClass = class DeviceCapability {
    constructor() {
      console.warn('resourceManager.DeviceCapability.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.screenDensity = ScreenDensity;
      this.deviceType = DeviceType;
    }
  }

  const ResourceManager = {
    getString: function(...args) {
      console.warn("ResourceManager.getString interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },

    getStringArray: function(...args) {
      console.warn("ResourceManager.getStringArray interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramStringMock]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([paramMock.paramStringMock]);
        })
      }
    },

    getMedia: function(...args) {
      console.warn("ResourceManager.getMedia interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },

    getMediaBase64: function(...args) {
      console.warn("ResourceManager.getMediaBase64 interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },

    getPluralString: function(...args) {
      console.warn("ResourceManager.getPluralString interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },

    getConfiguration: function(...args) {
      console.warn("ResourceManager.getConfiguration interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new ConfigurationClass());
      } else {
        return new Promise((resolve, reject) => {
          resolve(new ConfigurationClass());
        })
      }
    },

    getDeviceCapability: function(...args) {
      console.warn("ResourceManager.getDeviceCapability interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new DeviceCapabilityClass());
      } else {
        return new Promise((resolve, reject) => {
          resolve(new DeviceCapabilityClass());
        })
      }
    },

    release: function() {
      console.warn("ResourceManager.release interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },

    getRawFile: function(...args) {
      console.warn("ResourceManager.getRawFile interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },

    getRawFileDescriptor: function(...args) {
      console.warn("ResourceManager.getRawFileDescriptor interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, RawFileDescriptor);
      } else {
        return new Promise((resolve, reject) => {
          resolve(RawFileDescriptor);
        })
      }
    },

    closeRawFileDescriptor: function(...args) {
      console.warn("ResourceManager.closeRawFileDescriptor interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },

    getStringByName: function(...args) {
      console.warn("ResourceManager.getStringByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },

    getStringArrayByName: function(...args) {
      console.warn("ResourceManager.getStringArrayByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramStringMock]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([paramMock.paramStringMock]);
        })
      }
    },

    getMediaByName: function(...args) {
      console.warn("ResourceManager.getMediaByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },

    getMediaBase64ByName: function(...args) {
      console.warn("ResourceManager.getMediaBase64ByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },

    getPluralStringByName: function(...args) {
      console.warn("ResourceManager.getPluralStringByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },

    getStringSync: function(...args) {
      console.warn("ResourceManager.getStringSync interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },

    getStringByNameSync: function(...args) {
      console.warn("ResourceManager.getStringByNameSync interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },

    getBoolean: function(...args) {
      console.warn("ResourceManager.getBoolean interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getBooleanByName: function(...args) {
      console.warn("ResourceManager.getBooleanByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getNumber: function(...args) {
      console.warn("ResourceManager.getNumber interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    getNumberByName: function(...args) {
      console.warn("ResourceManager.getNumberByName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    }
  }

  const resourceManager = {
    ResourceManager,
    getResourceManager: async function getResourceManager(optBundleName, optCallback) {
      let bundleName = '';
      let callback;
      if (typeof optCallback == 'function') {
        bundleName = optBundleName ? optBundleName : '';
        callback = optCallback;
      } else if (typeof optBundleName == 'function') {
        callback = optBundleName;
      } else {
        bundleName = optBundleName ? optBundleName : '';
      }
      console.warn("ResourceManager.getResourceManager interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      if (typeof callback === 'function') {
        callback.call(this, paramMock.businessErrorMock, ResourceManager);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ResourceManager);
        })
      }
    },
  }
  return resourceManager;
}
 

