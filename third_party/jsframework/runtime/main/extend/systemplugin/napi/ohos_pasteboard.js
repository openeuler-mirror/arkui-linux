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
import { PixelMapMock } from "./ohos_multimedia_image.js"

export function mockPasteBoard() {
  const PasteDataMock = {
    getPrimaryText: function () {
      console.warn("PasteData.getPrimaryText interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
        return paramMock.paramStringMock
    },
    addHtmlRecord: function (...args) {
      console.warn("PasteData.addHtmlRecord interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    addWantRecord: function (...args) {
      console.warn("PasteData.addWantRecord interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    addRecord: function (...args) {
      console.warn("PasteData.addRecord interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    addTextRecord: function (...args) {
      console.warn("PasteData.addTextRecord interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    addUriRecord: function (...args) {
      console.warn("PasteData.addUriRecord interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    addPixelMapRecord: function (...args) {
      console.warn("PasteData.addPixelMapRecord interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getMimeTypes: function () {
      console.warn("PasteData.getMimeTypes interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return new Array(paramMock.paramStringMock);
    },
    getPrimaryHtml: function () {
      console.warn("PasteData.getPrimaryHtml interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getPrimaryWant: function () {
      console.warn("PasteData.getPrimaryWant interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return "[PC Preview] unknow getPrimaryWant"
    },
    getPrimaryMimeType: function () {
      console.warn("PasteData.getPrimaryMimeType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getPrimaryUri: function () {
      console.warn("PasteData.getPrimaryUri interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getPrimaryPixelMap: function () {
      console.warn("PasteData.getPrimaryPixelMap interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return PixelMapMock
    },
    getProperty: function () {
      console.warn("PasteData.getProperty interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return PasteDataPropertyMock;
    },
    setProperty: function () {
      console.warn("PasteData.setProperty interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getRecordAt: function (...args) {
      console.warn("PasteData.getRecordAt interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    getRecordCount: function () {
      console.warn("PasteData.getRecordCount interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getTag: function () {
      console.warn("PasteData.getTag interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    hasMimeType: function (...args) {
      console.warn("PasteData.hasMimeType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    removeRecordAt: function (...args) {
      console.warn("PasteData.removeRecordAt interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    replaceRecordAt: function (...args) {
      console.warn("PasteData.replaceRecordAt interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    }
  }
  const PasteDataRecordMock = {
    htmlText: '[PC preview] unknow htmlText',
    want: '[PC preview] unknow want',
    mimeType: '[PC preview] unknow mimeType',
    plainText: '[PC preview] unknow plainText',
    uri: '[PC preview] unknow uri',
    pixelMap: PixelMapMock,
    data: {'mock_xml': new ArrayBuffer()},
    convertToText: function (...args) {
      console.warn("PasteDataRecord.convertToText interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    }
  }
  const pasteboard = {
    ShareOption: {
      InApp: "[PC Preview] unknown InApp",
      LocalDevice: "[PC Preview] unknown LocalDevice",
      CrossDevice: "[PC Preview] unknown CrossDevice"
    },
    MAX_RECORD_NUM: '[PC preview] unknow MAX_RECORD_NUM',
    MIMETYPE_TEXT_HTML: '[PC preview] unknow MIMETYPE_TEXT_HTML11111',
    MIMETYPE_TEXT_WANT: '[PC preview] unknow MIMETYPE_TEXT_WANT',
    MIMETYPE_TEXT_PLAIN: '[PC preview] unknow MIMETYPE_TEXT_PLAIN',
    MIMETYPE_TEXT_URI: '[PC preview] unknow MIMETYPE_TEXT_URI',
    MIMETYPE_PIXELMAP: '[PC preview] unknow MIMETYPE_PIXELMAP',
    createPlainTextData: function (...args) {
      console.warn("pasteboard.createPlainTextData interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataMock;
    },
    createHtmlData: function (...args) {
      console.warn("pasteboard.createHtmlData interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataMock;
    },
    createUriData: function (...args) {
      console.warn("pasteboard.createUriData interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataMock;
    },
    createPixelMapData: function (...args) {
      console.warn("pasteboard.createPixelMapData interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataMock;
    },
    createData: function (...args) {
      console.warn("pasteboard.createData interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataMock;
    },
    createWantData: function (...args) {
      console.warn("pasteboard.createWantData interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataMock;
    },
    createHtmlTextRecord: function (...args) {
      console.warn("pasteboard.createHtmlTextRecord interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    createWantRecord: function (...args) {
      console.warn("pasteboard.createWantRecord interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    createUriRecord: function (...args) {
      console.warn("pasteboard.createUriRecord interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    createPixelMapRecord: function (...args) {
      console.warn("pasteboard.createPixelMapRecord interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    createRecord: function (...args) {
      console.warn("pasteboard.createRecord interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    createPlainTextRecord: function (...args) {
      console.warn("pasteboard.createPlainTextRecord interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return PasteDataRecordMock;
    },
    getSystemPasteboard: function () {
      console.warn("pasteboard.getSystemPasteboard interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return SystemPasteboardMock;
    }
  }
  const PasteDataPropertyMock = {
    additions: '[PC preview] unknow additions',
    mimeTypes: new Array('[PC preview] unknow MIMETYPE_TEXT_PLAIN'),
    tag: '[PC preview] unknow tag',
    timestamp: '[PC preview] unknow timestamp',
    localOnly: '[PC preview] unknow localOnly',
    shareOption: pasteboard.ShareOption
  }
  const SystemPasteboardMock = {
    on: function (...args) {
      console.warn("SystemPasteboard.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'update') {
          args[len - 1].call(this);
        }
      }
    },
    off: function (...args) {
      console.warn("SystemPasteboard.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'update') {
          args[len - 1].call(this);
        }
      }
    },
    clear: function (...args) {
      console.warn("SystemPasteboard.clear interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    hasPasteData: function (...args) {
      console.warn("SystemPasteboard.hasPasteData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    getPasteData: function (...args) {
      console.warn("SystemPasteboard.getPasteData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PasteDataMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(PasteDataMock);
        })
      }
    },
    setPasteData: function (...args) {
      console.warn("SystemPasteboard.setPasteData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    }
  }
  return pasteboard
}
