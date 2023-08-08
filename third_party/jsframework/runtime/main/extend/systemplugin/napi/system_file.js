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

import { hasComplete } from "../utils"

export function mockFile() {
  const file = {
    move: function (...args) {
      console.warn("file.move interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success(args[0].dstUri)
      hasComplete(args[0].complete)
    },
    copy: function (...args) {
      console.warn("file.copy interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success(args[0].dstUri)
      hasComplete(args[0].complete)
    },
    list: function (...args) {
      console.warn("file.list interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const data = {
        fileList: [{
          uri: '[PC Preview]: no file',
          lastModifiedTime: "[PC Preview]: no file",
          length: "[PC Preview]: no file",
          type: 'file'
        }]
      }
      args[0].success(data)
      hasComplete(args[0].complete)
    },
    get: function (...args) {
      console.warn("file.get interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const data = {
        uri: '[PC Preview]: no file',
        lastModifiedTime: "[PC Preview]: no file",
        length: "[PC Preview]: no file",
        type: 'file',
        subFiles: ["[PC Preview]: no file", "[PC Preview]: no file"]
      }
      args[0].success(data)
      hasComplete(args[0].complete)
    },
    delete: function (...args) {
      console.warn("file.delete interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    writeText: function (...args) {
      console.warn("file.writeText interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    writeArrayBuffer: function (...args) {
      console.warn("file.writeArrayBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    readText: function (...args) {
      console.warn("file.readText interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const data = { text: "[PC Preview]: success default" }
      args[0].success(data)
      hasComplete(args[0].complete)
    },
    readArrayBuffer: function (...args) {
      console.warn("file.readArrayBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const data = { buffer: ["[PC Preview]: default", "[PC Preview]: default", "[PC Preview]: default"] }
      args[0].success(data)
      hasComplete(args[0].complete)
    },
    access: function (...args) {
      console.warn("file.access interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    mkdir: function (...args) {
      console.warn("file.mkdir interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    rmdir: function (...args) {
      console.warn("file.rmdir interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    }
  }
  return file
}