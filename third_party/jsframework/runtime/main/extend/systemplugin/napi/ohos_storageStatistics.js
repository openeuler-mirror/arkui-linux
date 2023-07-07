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

import { paramMock } from '../utils';

export function mockStorageStatistics() {
  const BundleStats = {
    appSize: '[PC preview] unknow appSize',
    cacheSize: '[PC preview] unknow cacheSize',
    dataSize: '[PC preview] unknow dataSize'
  };
  const StorageStats= {
    total: '[PC preview] unknow total',
    audio: '[PC preview] unknow audio',
    video: '[PC preview] unknow video',
    image: '[PC preview] unknow image',
    file: '[PC preview] unknow file',
    app: '[PC preview] unknow app'
  }
  const storageStatistics = {
    BundleStats: BundleStats,
    StorageStats: StorageStats,
    getTotalSizeOfVolume: function(...args) {
      console.warn('storageStatistics.getTotalSizeOfVolume interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    getFreeSizeOfVolume: function(...args) {
      console.warn('storageStatistics.getFreeSizeOfVolume interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    getBundleStats: function(...args) {
      console.warn('storageStatistics.getBundleStats interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleStatsMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BundleStatsMock);
        });
      }
    },
    getCurrentBundleStats: function(...args) {
      console.warn('storageStatistics.getCurrentBundleStats interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleStats);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BundleStats);
        });
      }
    },
    getSystemSize: function(...args) {
      console.warn('storageStatistics.getSystemSize interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    getUserStorageStats: function(...args) {
      console.warn('storageStatistics.getUserStorageStats interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, StorageStats);
      } else {
        return new Promise((resolve, reject) => {
          resolve(StorageStats);
        });
      }
    },
    getTotalSize: function(...args) {
      console.warn('storageStatistics.getTotalSize interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    getFreeSize: function(...args) {
      console.warn('storageStatistics.getFreeSize interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    }
  };
  return storageStatistics;
}
