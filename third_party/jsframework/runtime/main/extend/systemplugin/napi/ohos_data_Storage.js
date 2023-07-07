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

const ValueTypes = '[PC Preview] unknow value type'

const StorageObserver = {
  key: '[PC Preview] unknown key'
};
const MAX_KEY_LENGTH = 80;

const MAX_VALUE_LENGTH = 8192;

export function mockDataStorage() {
  const storage = {
    storageMock,
    getStorageSync: function () {
      console.warn("data.storage.getStorageSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return storageMock
    },
    getStorage: function (...args) {
      console.warn("data.storage.getStorage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, storageMock)
      } else {
        return new Promise((resolve) => {
          resolve(storageMock)
        })
      }
    },
    deleteStorageSync: function () {
      console.warn("data.storage.deleteStorageSync interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
    },
    deleteStorage: function (...args) {
      console.warn("data.storage.deleteStorage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    removeStorageFromCacheSync: function () {
      console.warn("data.storage.removeStorageFromCacheSync interface mocked in the Previewer. How this interface" +
        " works on the Previewer may be different from that on a real device.")
    },
    removeStorageFromCache: function (...args) {
      console.warn("data.storage.removeStorageFromCache interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    }
  }
  const storageMock = {
    getSync: function () {
      console.warn("Storage.getSync interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return ValueTypes
    },
    get: function (...args) {
      console.warn("Storage.get interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ValueTypes)
      } else {
        return new Promise((resolve) => {
          resolve(ValueTypes)
        })
      }
    },
    hasSync: function () {
      console.warn("Storage.hasSync interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    has: function (...args) {
      console.warn("Storage.has interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    putSync: function () {
      console.warn("Storage.putSync interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    put: function (...args) {
      console.warn("Storage.put interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    deleteSync: function () {
      console.warn("Storage.deleteSync interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    delete: function (...args) {
      console.warn("Storage.delete interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    clearSync: function () {
      console.warn("Storage.clearSync interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    clear: function (...args) {
      console.warn("Storage.clear interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    flushSync: function () {
      console.warn("Storage.flushSync interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    flush: function (...args) {
      console.warn("Storage.flush interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    on: function (...args) {
      console.warn("Storage.on interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      args[len - 1].call(this, StorageObserver)
    },
    off: function (...args) {
      console.warn("Storage.off interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      args[len - 1].call(this, storageObserver)
    }
  }
  return storage
}