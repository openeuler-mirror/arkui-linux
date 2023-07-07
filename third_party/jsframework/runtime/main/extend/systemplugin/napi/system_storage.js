/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

export function mockStorage() {
  const storageMock = {
    getStorageSync: function (...args) {
      console.warn("Storage.getStorageSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return storage;
    },
    getStorage: function (...args) {
      console.warn("Storage.getStorage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, storage);
      } else {
        return new Promise((resolve, reject) => {
          resolve(storage);
        })
      }
    },
    deleteStorageSync: function (...args) {
      console.warn("Storage.deleteStorageSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    deleteStorage: function (...args) {
      console.warn("Storage.deleteStorage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    removeStorageFromCacheSync: function (...args) {
      console.warn("Storage.removeStorageFromCacheSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    removeStorageFromCache: function (...args) {
      console.warn("Storage.removeStorageFromCache interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
  };
  const storageObserver = {
    key: "[PC Preview] unknown key",
  };
  const storage = {
    getSync: function (...args) {
      console.warn("Storage.getSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    get: function (...args) {
      console.warn("Storage.get interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    hasSync: function (...args) {
      console.warn("Storage.hasSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    has: function (...args) {
      console.warn("Storage.has interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    putSync: function (...args) {
      console.warn("Storage.putSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    put: function (...args) {
      console.warn("Storage.put interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    deleteSync: function (...args) {
      console.warn("Storage.deleteSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    delete: function (...args) {
      console.warn("Storage.delete interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    clearSync: function (...args) {
      console.warn("Storage.clearSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clear: function (...args) {
      console.warn("Storage.clear interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    flushSync: function (...args) {
      console.warn("Storage.flushSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    flush: function (...args) {
      console.warn("Storage.flush interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    on: function (...args) {
      console.warn("Storage.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return storageObserver;
    },
    off: function (...args) {
      console.warn("Storage.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return storageObserver;
    },
  };
  return storageMock;
}

