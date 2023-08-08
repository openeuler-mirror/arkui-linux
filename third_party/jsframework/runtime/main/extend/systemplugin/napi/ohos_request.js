/*
 * Copyright (C) 2021-2022 Huawei Device Co., Ltd.
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

export function mockRequest() {
  const DownloadConfig = {
    url: "[PC Preview] unknow uri",
    header: "[PC Preview] unknow header",
    enableMetered: "[PC Preview] unknow enableMetered",
    enableRoaming: "[PC Preview] unknow enableRoaming",
    description: "[PC Preview] unknow description",
    networkType: "[PC Preview] unknow networkType",
    filePath: "[PC Preview] unknow filePath",
    title: "[PC Preview] unknow title",
    background: "[PC Preview] unknow background",
  };

  const DownloadInfo = {
    description: "[PC Preview] unknow description",
    downloadedBytes: "[PC Preview] unknow downloadedBytes",
    downloadId: "[PC Preview] unknow downloadId",
    failedReason: "[PC Preview] unknow failedReason",
    fileName: "[PC Preview] unknow fileName",
    filePath: "[PC Preview] unknow filePath",
    pausedReason: "[PC Preview] unknow pausedReason",
    status: "[PC Preview] unknow status",
    targetURI: "[PC Preview] unknow targetURI",
    downloadTitle: "[PC Preview] unknow downloadTitle",
    downloadTotalBytes: "[PC Preview] unknow downloadTotalBytes",
  };

  const DownloadTask = {
    on: function (...args) {
      console.warn("downloadTask.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          const receivedSize = "[PC Preview] unknow receivedSize"
          const totalSize = "[PC Preview] unknow totalSize"
          args[len - 1].call(this, receivedSize, totalSize)
        } else if (args[0] == 'complete' || 'pause' || 'remove') {
          args[len - 1].call(this)
        } else if (args[0] == 'fail') {
          const err = "[PC Preview] unknow err"
          args[len - 1].call(this, err)
        }
      }
    },

    off: function (...args) {
      console.warn("downloadTask.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          const receivedSize = "[PC Preview] unknow receivedSize"
          const totalSize = "[PC Preview] unknow totalSize"
          args[len - 1].call(this, receivedSize, totalSize)
        } else if (args[0] == 'complete' || 'pause' || 'remove') {
          args[len - 1].call(this)
        } else if (args[0] == 'fail') {
          const err = "[PC Preview]: unknow err"
          args[len - 1].call(this, err)
        }
      }
    },

    remove: function (...args) {
      console.warn("downloadTask.remove interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },

    pause: function (...args) {
      console.warn("downloadTask.pause interface mocked in the Previewer. How this interface works on the" +
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

    resume: function (...args) {
      console.warn("downloadTask.resume interface mocked in the Previewer. How this interface works on the" +
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

    query: function (...args) {
      console.warn("downloadTask.query interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, downloadInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(downloadInfoMock)
        })
      }
    },

    queryMimeType: function (...args) {
      console.warn("downloadTask.queryMimeType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
  };

  const File = {
    filename: "[PC Preview] unknow filename",
    name: "[PC Preview] unknow name",
    uri: "[PC Preview] unknow uri",
    type: "[PC Preview] unknow type",
  };

  const RequestData = {
    name: "[PC Preview] unknow name",
    value: "[PC Preview] unknow value",
  };

  const UploadConfig = {
    url: "[PC Preview] unknow uri",
    header: "[PC Preview] unknow header",
    method: "[PC Preview] unknow method",
    files: [File],
    data: [RequestData],
  };

  const TaskState = {
    path: "[PC Preview] unknow path",
    responseCode: "[PC Preview] unknow responseCode",
    message: "[PC Preview] unknow message",
  };

  const UploadTask = {
    on: function (...args) {
      console.warn("uploadTask.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          const uploadedSize = "[PC Preview] unknow receivedSize"
          const totalSize = "[PC Preview] unknow totalSize"
          args[len - 1].call(this, uploadedSize, totalSize)
        } else if (args[0] == 'headerReceive') {
          const header = "[PC Preview] unknow header"
          args[len - 1].call(this, header)
        } else if (args[0] == 'complete' || 'fail') {
          const taskStates = "[PC Preview] unknow taskStates"
          args[len - 1].call(this, taskStates)
        }
      }
    },

    off: function (...args) {
      console.warn("uploadTask.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'progress') {
          const uploadedSize = "[PC Preview] unknow receivedSize"
          const totalSize = "[PC Preview] unknow totalSize"
          args[len - 1].call(this, uploadedSize, totalSize)
        } else if (args[0] == 'headerReceive') {
          const header = "[PC Preview] unknow header"
          args[len - 1].call(this, header)
        } else if (args[0] == 'complete' || 'fail') {
          const taskStates = "[PC Preview] unknow taskStates"
          args[len - 1].call(this, taskStates)
        }
      }
    },

    remove: function (...args) {
      console.warn("uploadTask.remove interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
  };

  const request = {
    NETWORK_MOBILE: '[PC preview] unknow NETWORK_MOBILE',
    NETWORK_WIFI: '[PC preview] unknow NETWORK_WIFI',
    ERROR_CANNOT_RESUME: '[PC preview] unknow ERROR_CANNOT_RESUME',
    ERROR_DEVICE_NOT_FOUND: '[PC preview] unknow ERROR_DEVICE_NOT_FOUND',
    ERROR_FILE_ALREADY_EXISTS: '[PC preview] unknow ERROR_FILE_ALREADY_EXISTS',
    ERROR_FILE_ERROR: '[PC preview] unknow ERROR_FILE_ERROR',
    ERROR_HTTP_DATA_ERROR: '[PC preview] unknow ERROR_HTTP_DATA_ERROR',
    ERROR_INSUFFICIENT_SPACE: '[PC preview] unknow ERROR_INSUFFICIENT_SPACE',
    ERROR_TOO_MANY_REDIRECTS: '[PC preview] unknow ERROR_TOO_MANY_REDIRECTS',
    ERROR_UNHANDLED_HTTP_CODE: '[PC preview] unknow ERROR_UNHANDLED_HTTP_CODE',
    ERROR_UNKNOWN: '[PC preview] unknow ERROR_UNKNOWN',
    PAUSED_QUEUED_FOR_WIFI: '[PC preview] unknow PAUSED_QUEUED_FOR_WIFI',
    PAUSED_UNKNOWN: '[PC preview] unknow PAUSED_UNKNOWN',
    PAUSED_WAITING_FOR_NETWORK: '[PC preview] unknow PAUSED_WAITING_FOR_NETWORK',
    PAUSED_WAITING_TO_RETRY: '[PC preview] unknow PAUSED_WAITING_TO_RETRY',
    SESSION_FAILED: '[PC preview] unknow SESSION_FAILED',
    SESSION_PAUSED: '[PC preview] unknow SESSION_PAUSED',
    SESSION_PENDING: '[PC preview] unknow SESSION_PENDING',
    SESSION_RUNNING: '[PC preview] unknow SESSION_RUNNING',
    SESSION_SUCCESSFUL: '[PC preview] unknow SESSION_SUCCESSFUL',

    download: function (...args) {
      console.warn("request.download interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, DownloadTask)
        } else {
          return new Promise((resolve) => {
            resolve(DownloadTask);
          })
        }
    },

    upload: function (...args) {
      console.warn("request.upload interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, UploadTask)
      } else {
        return new Promise((resolve) => {
          resolve(UploadTask)
        })
      }
    }
  }
  return request
}