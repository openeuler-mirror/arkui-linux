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
import { ApplicationInfo } from "../bundle/applicationInfo"
import { BaseContextClass as  BaseContext } from "./BaseContext"

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
const EventHubClass = class EventHub {
    constructor() {
      console.warn('EventHub.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.on = function (...args) {
        console.warn("EventHub.on interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.off = function (...args) {
        console.warn("EventHub.off interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
      this.emit = function (...args) {
        console.warn("EventHub.emit interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
    }
}
export const ContextClass = class Context extends BaseContext {
    constructor() {
      super();
      console.warn('Context.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.resourceManager = ResourceManager;
      this.applicationInfo = ApplicationInfo;
      this.cacheDir = "[PC Preview] unknow cacheDir";
      this.tempDir = "[PC Preview] unknow tempDir";
      this.filesDir = "[PC Preview] unknow filesDir";
      this.databaseDir = "[PC Preview] unknow databaseDir";
      this.preferencesDir = "[PC Preview] unknow preferencesDir";
      this.storageDir = "[PC Preview] unknow storageDir";
      this.bundleCodeDir = "[PC Preview] unknow bundleCodeDir";
      this.distributedFilesDir = "[PC Preview] unknow distributedFilesDir";
      this.eventHub = new EventHubClass();
      this.area = AreaMode;
      this.createBundleContext = function (...args) {
        console.warn("Context.createBundleContext interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new ContextClass();
      };
      this.createModuleContext = function (...args) {
        console.warn("Context.createModuleContext interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new ContextClass();
      };
      this.getApplicationContext = function () {
        console.warn("Context.getApplicationContext interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new ContextClass();
      };
      this.switchArea = function (...args) {
        console.warn("Context.switchArea interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
      };
    }
}
export const AreaMode  = {
    EL1: 0,
    EL2: 1
}