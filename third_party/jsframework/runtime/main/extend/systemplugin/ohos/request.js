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

import { paramMock } from "../utils";

const NOTIFY = "[PC Preview] unknow"
const Properties = [
  'NETWORK_MOBILE',
  'NETWORK_WIFI',
  'ERROR_CANNOT_RESUME',
  'ERROR_DEVICE_NOT_FOUND',
  'ERROR_FILE_ALREADY_EXISTS',
  'ERROR_FILE_ERROR',
  'ERROR_HTTP_DATA_ERROR',
  'ERROR_INSUFFICIENT_SPACE',
  'ERROR_TOO_MANY_REDIRECTS',
  'ERROR_UNHANDLED_HTTP_CODE',
  'ERROR_UNKNOWN',
  'PAUSED_QUEUED_FOR_WIFI',
  'PAUSED_UNKNOWN',
  'PAUSED_WAITING_FOR_NETWORK',
  'PAUSED_WAITING_TO_RETRY',
  'SESSION_FAILED',
  'SESSION_PAUSED',
  'SESSION_PENDING',
  'SESSION_RUNNING',
  'SESSION_SUCCESSFUL'
]

export function mockOhosRequest() {
  const ErrorMock = {
    ERROR_HTTP_DATA_ERROR: 501,
    ERROR_DEVICE_NOT_FOUND: 502,
    ERROR_UNHANDLED_HTTP_CODE: 503,
    ERROR_INSUFFICIENT_SPACE: 504,
    ERROR_TOO_MANY_REDIRECTS: 505,
    ERROR_CANNOT_RESUME: 506,
    ERROR_FILE_ALREADY_EXISTS: 507,
    ERROR_FILE_ERROR: 508,
    ERROR_UNKNOWN: 509
  }
  const PauseMock = {
    PAUSED_WAITING_TO_RETRY: 301,
    PAUSED_WAITING_FOR_NETWORK: 302,
    PAUSED_QUEUED_FOR_WIFI: 303,
    PAUSED_UNKNOWN: 304,
  }
  const SessionMock = {
    SESSION_PENDING: 1,
    SESSION_RUNNING: 2,
    SESSION_PAUSED: 4,
    SESSION_SUCCESSFUL: 8,
    SESSION_FAILED: 16,
  }
  const downloadInfo = {
    downloadId: 1,
    failedReason: ErrorMock,
    fileName: "[PC preview] unknown file name",
    filePath: "[PC preview] unknown file path",
    pausedReason: PauseMock,
    status: SessionMock,
    targetURI: "[PC preview] unknown targetURI",
    downloadTitle: "[PC preview] unknown download title",
    downloadTotalBytes: 1024,
    description: "[PC preview] unknown description",
    downloadedBytes: 1
  }
  const DownloadTaskMock = {
    on: function (...args) {
      console.warn("DownloadTask.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          args[len - 1].call(this, paramMock.paramNumberMock, paramMock.paramNumberMock);
        } else if (args[0] == 'complete' || args[0] == 'pause' || args[0] == 'remove') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'fail') {
          args[len - 1].call(this, paramMock.businessErrorMock, ErrorMock);
        }
      }
    },
    off: function (...args) {
      console.warn("DownloadTask.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          args[len - 1].call(this, paramMock.paramNumberMock, paramMock.paramNumberMock);
        } else if (args[0] == 'complete' || args[0] == 'pause' || args[0] == 'remove') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'fail') {
          args[len - 1].call(this, paramMock.businessErrorMock, ErrorMock);
        }
      }
    },
    remove: function (...args) {
      console.warn("DownloadTask.remove interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    pause: function (...args) {
      console.warn("DownloadTask.pause interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    resume: function (...args) {
      console.warn("DownloadTask.resume interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    queryMimeType: function (...args) {
      console.warn("DownloadTask.queryMimeType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    query: function (...args) {
      console.warn("DownloadTask.query interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, downloadInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(downloadInfo);
        })
      }
    }
  }
  const UploadTaskMock = {
    on: function (...args) {
      console.warn("UploadTask.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          args[len - 1].call(this, paramMock.paramNumberMock, paramMock.paramNumberMock);
        } else if (args[0] == 'headerReceive') {
          args[len - 1].call(this, paramMock.paramObjectMock);
        }
      }
    },
    off: function (...args) {
      console.warn("UploadTask.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          args[len - 1].call(this, paramMock.paramNumberMock, paramMock.paramNumberMock);
        } else if (args[0] == 'headerReceive') {
          args[len - 1].call(this, paramMock.paramObjectMock);
        }
      }
    },
    remove: function (...args) {
      console.warn("UploadTask.remove interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    }
  }
  global.ohosplugin.request = {
    download: function (...args) {
      console.warn("ohos.request.download interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DownloadTaskMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DownloadTaskMock);
        })
      }
    },
    upload: function (...args) {
      console.warn("ohos.request.upload interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, UploadTaskMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(UploadTaskMock);
        })
      }
    }
  }

  for (let property of Properties) {
    global.ohosplugin.request[property] = NOTIFY + " " + property
  }
}
